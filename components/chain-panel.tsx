'use client';
import {useState} from 'react';
import {BrowserProvider,Contract,ContractFactory,id,parseUnits} from 'ethers';
import artifacts from '@/lib/contracts.json';
import {type State} from '@/lib/model';
import {reviewInvoice,reviewPacket} from '@/lib/review';
const types={Order:[{name:'invoiceId',type:'bytes32'},{name:'vendorId',type:'bytes32'},{name:'payer',type:'address'},{name:'recipient',type:'address'},{name:'token',type:'address'},{name:'amount',type:'uint256'},{name:'deadline',type:'uint256'}]};
export function ChainPanel({state}:{state:State}){
 const [busy,setBusy]=useState(false),[report,setReport]=useState(''),[fence,setFence]=useState(''),[token,setToken]=useState(''),[tx,setTx]=useState(''),[invoiceId,setInvoiceId]=useState(''),[evidence,setEvidence]=useState<object|null>(null);
 async function run(action:'deploy'|'pay'){
  setBusy(true);setEvidence(null);setTx('');setReport('Waiting for test wallet…');
  try{
   const eth=(window as unknown as {ethereum?:ConstructorParameters<typeof BrowserProvider>[0]}).ethereum;if(!eth)throw Error('Install an EVM test wallet to use the lab.');
   const provider=new BrowserProvider(eth);const net=await provider.getNetwork();if(![BigInt(31337),BigInt(11155111)].includes(net.chainId))throw Error('Switch your wallet to local chain 31337 or Ethereum Sepolia. Mainnet is disabled.');
   const signer=await provider.getSigner();const payer=await signer.getAddress();
   if(action==='deploy'){
    setReport('Deploying test token. Confirm the testnet transaction.');
    const t=await new ContractFactory(artifacts.MockUSDC.abi,artifacts.MockUSDC.bytecode,signer).deploy();await t.waitForDeployment();setToken(await t.getAddress());
    setReport('Deploying PayFence. Confirm the second testnet transaction.');
    const f=await new ContractFactory(artifacts.PayFence.abi,artifacts.PayFence.bytecode,signer).deploy();await f.waitForDeployment();setFence(await f.getAddress());setReport('Test contracts deployed. Run a payment to mint test dollars, register the selected invoice vendor, and execute a signed rehearsal.');
   }else{
    const response=await fetch('/api/workspace');if(!response.ok)throw Error('Sign in and reload the workspace first.');
    const snapshot=(await response.json() as {state:State}).state;const review=await reviewInvoice(snapshot,invoiceId);
    if(!review.readyForRehearsal)throw Error(review.nextAction);
    const invoice=snapshot.invoices.find(i=>i.id===invoiceId)!;const vendor=snapshot.vendors.find(v=>v.id===invoice.vendorId)!;
    const packet=await reviewPacket(snapshot,invoiceId);
    const assertFresh=async()=>{const r=await fetch('/api/workspace');if(!r.ok)throw Error('Cannot recheck live approval.');const current=(await r.json() as {state:State}).state;const check=await reviewInvoice(current,invoiceId);if(!check.readyForRehearsal||check.fingerprint!==review.fingerprint)throw Error('Invoice changed. Stop and review it again.');};
    const f=new Contract(fence,artifacts.PayFence.abi,signer),t=new Contract(token,artifacts.MockUSDC.abi,signer);
    const vendorId=id(vendor.id);const v=await f.vendors(payer,vendorId);
    if(v.wallet==='0x0000000000000000000000000000000000000000'){setReport('Registering the invoice vendor and per-payment limit…');await(await f.registerVendor(vendorId,vendor.wallet,parseUnits(vendor.budget,6))).wait();}
    if(v.wallet!=='0x0000000000000000000000000000000000000000'&&(v.wallet.toLowerCase()!==vendor.wallet.toLowerCase()||v.limit!==parseUnits(vendor.budget,6)))throw Error('Contract vendor settings differ. Deploy fresh test contracts.');
    const invoiceKey=id(invoice.id);if(await f.consumed(payer,invoiceKey))throw Error('This invoice has already been executed or cancelled in this contract.');
    setReport('Minting the exact invoice amount in valueless test tokens.');await(await t.mint(payer,parseUnits(invoice.amount,6))).wait();
    setReport('Approve the exact invoice amount in TEST tokens…');await(await t.approve(fence,parseUnits(invoice.amount,6))).wait();
    const block=await provider.getBlock('latest');const order={invoiceId:invoiceKey,vendorId,payer,recipient:invoice.recipient,token,amount:parseUnits(invoice.amount,6),deadline:(block?.timestamp??Math.floor(Date.now()/1000))+3600};
    await assertFresh();setReport('Sign the invoice recipient, amount, network, and contract…');const signature=await signer.signTypedData({name:'PayFence',version:'1',chainId:net.chainId,verifyingContract:fence},types,order);
    await assertFresh();setReport('Executing the signed invoice rehearsal…');const receipt=await(await f.execute(order,signature)).wait();setTx(receipt.hash);setEvidence({schema:'payfence.rehearsal.v1',reviewPacket:packet,domain:{name:'PayFence',version:'1',chainId:net.chainId.toString(),verifyingContract:fence},order:{...order,amount:order.amount.toString()},signature,transactionHash:receipt.hash,blockNumber:receipt.blockNumber,token,limitations:'Mock-token rehearsal, not real USDC settlement. Verify transaction independently. Workspace simulation status is unchanged.'});setReport('Confirmed in block '+receipt.blockNumber+'. Mock tokens were sent to the invoice recipient. Download the signed evidence. Workspace simulation status is unchanged.');
   }
  }catch(e){setReport(e instanceof Error?e.message:'Test failed');}finally{setBusy(false);}
 }
 return <section className="panel"><div className="panelhead"><div><h2>Signed payment lab</h2><p>Real contract execution, with valueless test tokens.</p></div><span className="badge blue">Testnet only</span></div><div className="panelbody stack"><div className="notice">Use a separate test wallet. Local chain 31337 costs $0. Sepolia requires faucet ETH for gas. Mainnet is blocked by this interface. Select an approved invoice. Its exact recipient and amount will be used with mock tokens; this does not mark the invoice paid in the workspace.</div><p>The contract binds payer, invoice, vendor, recipient, token, amount, deadline, chain and contract address to the signature. It checks the vendor wallet and payment limit before transferring.</p><label className="field">Invoice to rehearse<select value={invoiceId} disabled={busy} onChange={e=>{setInvoiceId(e.target.value);setEvidence(null)}}><option value="">Select an approved invoice</option>{state.invoices.filter(i=>i.status==='approved').map(i=><option key={i.id} value={i.id}>{i.reference} · {i.amount} TEST</option>)}</select></label><div className="actions"><button className="primary" disabled={busy} onClick={()=>run('deploy')}>1. Deploy test contracts</button><button className="secondary" disabled={busy||!fence||!token||!invoiceId} onClick={()=>run('pay')}>2. Rehearse approved invoice</button></div>{fence&&<p className="walletrow">PayFence: {fence}</p>}{token&&<p className="walletrow">Test token: {token}</p>}{report&&<div className="notice" role="status">{report}</div>}{evidence&&<button className="secondary" onClick={()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(evidence,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="payfence-rehearsal.json";a.click();URL.revokeObjectURL(url)}}>Download signed evidence</button>}{tx&&<p className="walletrow">Transaction: {tx}</p>}<p className="sidenote">You will confirm multiple transactions in your wallet. Never buy tokens for this demo. Contracts are an unaudited hackathon prototype; the app does not request real stablecoins.</p></div></section>;
}
export default ChainPanel;

