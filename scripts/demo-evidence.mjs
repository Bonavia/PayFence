import { mkdir, readFile, writeFile } from 'node:fs/promises';
import ganache from 'ganache';
import { BrowserProvider, Wallet, ContractFactory, id, parseUnits } from 'ethers';
import { seed, digest, log } from '../lib/model.ts';
import { reviewInvoice, reviewPacket } from '../lib/review.ts';

// Generates real local-chain evidence from a disclosed sample; never user money.
const state = seed(), invoice = state.invoices[0];
const blockedBefore = !(await reviewInvoice(state, invoice.id)).readyForRehearsal;
invoice.recipient = state.vendors[0].wallet;
invoice.status = 'approved'; invoice.approval = { digest: await digest(state, invoice), at: new Date().toISOString() };
await log(state, 'Fixture approved', 'Automated evidence sample; not a human approval.');
const packet = await reviewPacket(state, invoice.id);
const artifacts = JSON.parse(await readFile('lib/contracts.json', 'utf8'));
const rpc = ganache.provider({ logging: { quiet: true }, chain: { chainId: 31337, hardfork: 'shanghai' } });
try {
  const provider = new BrowserProvider(rpc), signer = await provider.getSigner();
  const owner = new Wallet(Object.values(rpc.getInitialAccounts())[0].secretKey);
  const token = await new ContractFactory(artifacts.MockUSDC.abi, artifacts.MockUSDC.bytecode, signer).deploy(); await token.waitForDeployment();
  const fence = await new ContractFactory(artifacts.PayFence.abi, artifacts.PayFence.bytecode, signer).deploy(); await fence.waitForDeployment();
  const amount = parseUnits(invoice.amount, 6), vendorId = id(invoice.vendorId);
  await (await fence.registerVendor(vendorId, invoice.recipient, parseUnits(state.vendors[0].budget, 6))).wait();
  await (await token.mint(owner.address, amount)).wait(); await (await token.approve(await fence.getAddress(), amount)).wait();
  const block = await provider.getBlock('latest');
  const order = { invoiceId: id(invoice.id), vendorId, payer: owner.address, recipient: invoice.recipient, token: await token.getAddress(), amount, deadline: block.timestamp + 3600 };
  const domain = { name: 'PayFence', version: '1', chainId: 31337, verifyingContract: await fence.getAddress() };
  const types = { Order: [{ name: 'invoiceId', type: 'bytes32' }, { name: 'vendorId', type: 'bytes32' }, { name: 'payer', type: 'address' }, { name: 'recipient', type: 'address' }, { name: 'token', type: 'address' }, { name: 'amount', type: 'uint256' }, { name: 'deadline', type: 'uint256' }] };
  const signature = await owner.signTypedData(domain, types, order);
  let tamperingRejected = false; try { await fence.execute.staticCall({ ...order, amount: amount - 1n }, signature); } catch { tamperingRejected = true; }
  const receipt = await (await fence.execute(order, signature)).wait();
  let replayRejected = false; try { await fence.execute.staticCall(order, signature); } catch { replayRejected = true; }
  const received = await token.balanceOf(invoice.recipient);
  invoice.amount = '2401';
  const staleApprovalRejected = !(await reviewInvoice(state, invoice.id)).readyForRehearsal;
  const checks = { blockedBefore, tamperingRejected, replayRejected, staleApprovalRejected, exactRecipientBalance: received === amount };
  if (Object.values(checks).some(value => !value)) throw new Error('Evidence scenario failed');
  const output = { schema: 'payfence.evidence.v1', createdAt: new Date().toISOString(), fixture: true, network: 'ephemeral Ganache 31337 — not a public testnet deployment', checks, reviewPacket: packet, domain, order, signature, receipt: { transactionHash: receipt.hash, blockNumber: receipt.blockNumber, gasUsed: receipt.gasUsed.toString() }, tokenBalance: received.toString(), limitations: 'Mock token only. Ephemeral chain is stopped after execution. This file is reproducible evidence, not independently notarized proof.' };
  await mkdir('outputs', { recursive: true });
  await writeFile('outputs/demo-evidence.json', JSON.stringify(output, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2) + '\n');
  console.log('Evidence checks:', checks, '\nSaved outputs/demo-evidence.json');
} finally { await rpc.disconnect(); }
