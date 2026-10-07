'use client';
import {useState} from 'react';
import {BrowserProvider,Contract,ContractFactory,id,parseUnits} from 'ethers';
import artifacts from '@/lib/contracts.json';
const types={Order:[{name:'invoiceId',type:'bytes32'},{name:'vendorId',type:'bytes32'},{name:'payer',type:'address'},{name:'recipient',type:'address'},{name:'token',type:'address'},{name:'amount',type:'uint256'},{name:'deadline',type:'uint256'}]};
export function ChainPanel(){
 const [busy,setBusy]=useState(false),[report,setReport]=useState(''),[fence,setFence]=useState(''),[token,setToken]=useState(''),[tx,setTx]=useState('');
 async function run(action:'deploy'|'pay'){
  setBusy(true);setReport('Waiting for test wallet…');
  try{
   const eth=(window as unknown as {ethereum?:ConstructorParameters<typeof BrowserProvider>[0]}).ethereum;if(!eth)throw Error('Install an EVM test wallet to use the lab.');
   const provider=new BrowserProvider(eth);const net=await provider.getNetwork();if(![BigInt(31337),BigInt(11155111)].includes(net.chainId))throw Error('Switch your wallet to local chain 31337 or Ethereum Sepolia. Mainnet is disabled.');
   const signer=await provider.getSigner();const payer=await signer.getAddress();
   if(action==='deploy'){
    setReport('Deploying test token. Confirm the testnet transaction.');
    const t=await new ContractFactory(artifacts.MockUSDC.abi,artifacts.MockUSDC.bytecode,signer).deploy();await t.waitForDeployment();setToken(await t.getAddress());
    setReport('Deploying PayFence. Confirm the second testnet transaction.');
    const f=await new ContractFactory(artifacts.PayFence.abi,artifacts.PayFence.bytecode,signer).deploy();await f.waitForDeployment();setFence(await f.getAddress());setReport('Test contracts deployed. Run a payment to mint test dollars, register your own wallet as the vendor, and execute a signed order.');
   }else{
    const f=new Contract(fence,artifacts.PayFence.abi,signer),t=new Contract(token,artifacts.MockUSDC.abi,signer);
    const vendorId=id('payfence-self-demo');const v=await f.vendors(payer,vendorId);
    if(v.wallet==='0x0000000000000000000000000000000000000000'){setReport('Registering your test wallet as the vendor…');await(await f.registerVendor(vendorId,payer,parseUnits('100',6))).wait();}
    setReport('Minting 10 test dollars. These tokens have no monetary value.');await(await t.mint(payer,parseUnits('10',6))).wait();
    setReport('Approve an exact 10 TEST allowance…');await(await t.approve(fence,parseUnits('10',6))).wait();
    const block=await provider.getBlock('latest');const order={invoiceId:id(crypto.randomUUID()),vendorId,payer,recipient:payer,token,amount:parseUnits('10',6),deadline:(block?.timestamp??Math.floor(Date.now()/1000))+3600};
    setReport('Sign the exact payment details…');const signature=await signer.signTypedData({name:'PayFence',version:'1',chainId:net.chainId,verifyingContract:fence},types,order);
    setReport('Executing the signed test payment…');const receipt=await(await f.execute(order,signature)).wait();setTx(receipt.hash);setReport('Confirmed in block '+receipt.blockNumber+'. Replay is blocked by the invoice ID. The test payment returned to your own wallet.');
   }
  }catch(e){setReport(e instanceof Error?e.message:'Test failed');}finally{setBusy(false);}
 }
 return <section className="panel"><div className="panelhead"><div><h2>Signed payment lab</h2><p>Real contract execution, with valueless test tokens.</p></div><span className="badge blue">Testnet only</span></div><div className="panelbody stack"><div className="notice">Use a separate test wallet. Local chain 31337 costs $0. Sepolia requires faucet ETH for gas. Mainnet is blocked by this interface. This lab is separate from the demo invoice workspace.</div><p>The contract binds payer, invoice, vendor, recipient, token, amount, deadline, chain and contract address to the signature. It checks the vendor wallet and payment limit before transferring.</p><div className="actions"><button className="primary" disabled={busy} onClick={()=>run('deploy')}>1. Deploy test contracts</button><button className="secondary" disabled={busy||!fence||!token} onClick={()=>run('pay')}>2. Run signed test payment</button></div>{fence&&<p className="walletrow">PayFence: {fence}</p>}{token&&<p className="walletrow">Test token: {token}</p>}{report&&<div className="notice" role="status">{report}</div>}{tx&&<p className="walletrow">Transaction: {tx}</p>}<p className="sidenote">You will confirm multiple transactions in your wallet. Never buy tokens for this demo. Contracts are an unaudited hackathon prototype; the app does not request real stablecoins.</p></div></section>;
}
export default ChainPanel;
