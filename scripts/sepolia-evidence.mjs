import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { JsonRpcProvider, Wallet, NonceManager, Contract, ContractFactory, id, parseUnits, verifyTypedData } from 'ethers';
import { reviewInvoice, reviewPacket } from '../lib/review.ts';

const types = { Order: [
  { name: 'invoiceId', type: 'bytes32' }, { name: 'vendorId', type: 'bytes32' },
  { name: 'payer', type: 'address' }, { name: 'recipient', type: 'address' },
  { name: 'token', type: 'address' }, { name: 'amount', type: 'uint256' }, { name: 'deadline', type: 'uint256' },
] };
const flag = (argv, name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
const help = `PayFence mock-token Sepolia evidence\n\nRead-only verification:\n  npm run sepolia:evidence -- --verify outputs/sepolia-evidence.json\n\nDeploy and rehearse an approved exported invoice (test ETH gas):\n  npm run sepolia:evidence -- --deploy --workspace PATH --invoice ID\n\nRequired: SEPOLIA_RPC_URL. Deployment additionally needs DEPLOYER_PRIVATE_KEY\nin your ignored local .env.local. Never send a private key to a chat or commit it.\nOnly RPC chain 11155111 is accepted. Mainnet is rejected. No real USDC is used.\n`;

export async function run(argv = process.argv.slice(2), env = process.env) {
  if (argv.includes('--help')) { console.log(help); return; }
  const verifyFile = flag(argv, '--verify');
  if (!verifyFile && !argv.includes('--deploy')) throw new Error('Choose --verify or --deploy; use --help for instructions.');
  if (verifyFile && argv.includes('--deploy')) throw new Error('Choose one mode.');
  if (!env.SEPOLIA_RPC_URL) throw new Error('Set SEPOLIA_RPC_URL in .env.local.');
  const provider = new JsonRpcProvider(env.SEPOLIA_RPC_URL);
  try {
    if ((await provider.getNetwork()).chainId !== 11155111n) throw new Error('Only Ethereum Sepolia chain 11155111 is permitted.');
    const artifacts = JSON.parse(await readFile(new URL('../lib/contracts.json', import.meta.url), 'utf8'));
    if (verifyFile) {
      const evidence = JSON.parse(await readFile(verifyFile, 'utf8'));
      if (evidence.schema !== 'payfence.sepolia.v1' || evidence.domain.chainId !== 11155111) throw new Error('Unexpected evidence schema or network.');
      if (verifyTypedData(evidence.domain, types, evidence.order, evidence.signature).toLowerCase() !== evidence.order.payer.toLowerCase()) throw new Error('Invalid order signature.');
      const receipt = await provider.getTransactionReceipt(evidence.receipt.transactionHash);
      if (!receipt || receipt.status !== 1 || receipt.to.toLowerCase() !== evidence.domain.verifyingContract.toLowerCase()) throw new Error('Successful PayFence transaction not found.');
      const fence = new Contract(evidence.domain.verifyingContract, artifacts.PayFence.abi, provider);
      const token = new Contract(evidence.order.token, artifacts.MockUSDC.abi, provider);
      const event = receipt.logs.filter(l => l.address.toLowerCase() === evidence.domain.verifyingContract.toLowerCase())
        .map(l => { try { return fence.interface.parseLog(l); } catch { return null; } })
        .find(l => l?.name === 'PaymentExecuted' && l.args.invoiceId === evidence.order.invoiceId);
      if (!event || event.args.recipient.toLowerCase() !== evidence.order.recipient.toLowerCase() || event.args.payer.toLowerCase() !== evidence.order.payer.toLowerCase() || event.args.token.toLowerCase() !== evidence.order.token.toLowerCase() || event.args.amount !== BigInt(evidence.order.amount)) throw new Error('Payment event does not match the signed order.');
      if (!await fence.consumed(evidence.order.payer, evidence.order.invoiceId)) throw new Error('Invoice replay marker missing.');
      const balance = await token.balanceOf(evidence.order.recipient);
      console.log(JSON.stringify({ verifiedAgainstConfiguredRpc: true, chainId: 11155111, transactionHash: receipt.hash, recipient: evidence.order.recipient, amount: evidence.order.amount, currentRecipientBalance: balance.toString() }, null, 2));
      return evidence;
    }
    const workspaceFile = flag(argv, '--workspace'), invoiceId = flag(argv, '--invoice');
    if (!workspaceFile || !invoiceId) throw new Error('Provide --workspace with an exported JSON file and --invoice with an approved invoice ID.');
    const raw = await readFile(workspaceFile);
    if (raw.length > 2000000) throw new Error('Workspace exceeds 2 MB.');
    const parsed = JSON.parse(raw.toString('utf8')), state = parsed.state || parsed;
    const review = await reviewInvoice(state, invoiceId);
    if (!review.readyForRehearsal) throw new Error(review.nextAction);
    if (!/^0x[0-9a-fA-F]{64}$/.test(env.DEPLOYER_PRIVATE_KEY || '')) throw new Error('Set a separate test wallet DEPLOYER_PRIVATE_KEY in your ignored .env.local.');
    const wallet = new Wallet(env.DEPLOYER_PRIVATE_KEY, provider), signer = new NonceManager(wallet);
    if (await provider.getBalance(wallet.address) === 0n) throw new Error('The test wallet needs faucet Sepolia ETH for gas.');
    const invoice = state.invoices.find(i => i.id === invoiceId), vendor = state.vendors.find(v => v.id === invoice.vendorId);
    const packet = await reviewPacket(state, invoiceId), amount = parseUnits(invoice.amount, 6), vendorId = id(vendor.id);
    console.log('Deploying valueless MockUSDC and PayFence on RPC chain 11155111.');
    const token = await new ContractFactory(artifacts.MockUSDC.abi, artifacts.MockUSDC.bytecode, signer).deploy(); await token.waitForDeployment();
    const fence = await new ContractFactory(artifacts.PayFence.abi, artifacts.PayFence.bytecode, signer).deploy(); await fence.waitForDeployment();
    await (await fence.registerVendor(vendorId, invoice.recipient, parseUnits(vendor.budget, 6))).wait();
    await (await token.mint(wallet.address, amount)).wait();
    await (await token.approve(await fence.getAddress(), amount)).wait();
    const block = await provider.getBlock('latest');
    const domain = { name: 'PayFence', version: '1', chainId: 11155111, verifyingContract: await fence.getAddress() };
    const order = { invoiceId: id(invoice.id), vendorId, payer: wallet.address, recipient: invoice.recipient, token: await token.getAddress(), amount: amount.toString(), deadline: block.timestamp + 3600 };
    const signature = await wallet.signTypedData(domain, types, order);
    const receipt = await (await fence.execute(order, signature)).wait();
    const received = await token.balanceOf(invoice.recipient);
    if (received !== amount) throw new Error('Unexpected recipient balance for the freshly deployed mock token.');
    const evidence = { schema: 'payfence.sepolia.v1', createdAt: new Date().toISOString(), source: 'approved exported snapshot; not a live workspace lock', reviewPacket: packet, domain, order, signature,
      contracts: { payFence: domain.verifyingContract, mockUSDC: order.token },
      deploymentTransactions: { payFence: fence.deploymentTransaction().hash, mockUSDC: token.deploymentTransaction().hash },
      receipt: { transactionHash: receipt.hash, blockNumber: receipt.blockNumber, gasUsed: receipt.gasUsed.toString() }, tokenBalance: received.toString(),
      explorer: { payment: `https://sepolia.etherscan.io/tx/${receipt.hash}`, payFence: `https://sepolia.etherscan.io/address/${domain.verifyingContract}`, mockUSDC: `https://sepolia.etherscan.io/address/${order.token}` },
      limitations: 'Valueless mock tokens; consumes Sepolia test ETH for gas. Does not update dashboard payment status. Verify that the configured RPC is the real public Sepolia network before claiming public proof. Snapshot approval is not a live state lock.' };
    const output = resolve(flag(argv, '--output') || 'outputs/sepolia-evidence.json');
    await mkdir(dirname(output), { recursive: true }); await writeFile(output, JSON.stringify(evidence, null, 2) + '\n');
    console.log(`Evidence saved to ${output}. Check the public explorer URLs before including them in a submission.`);
    return evidence;
  } finally { provider.destroy(); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch(() => { console.error('Sepolia evidence command failed. Check the selected mode, approved invoice export, RPC network, and test wallet configuration. No credentials are printed.'); process.exitCode = 1; });
}
