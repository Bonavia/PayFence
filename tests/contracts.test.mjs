import {test} from 'node:test';import assert from 'node:assert/strict';import ganache from 'ganache';import {BrowserProvider,Wallet,ContractFactory,id,parseUnits} from 'ethers';import fs from 'node:fs';
const a=JSON.parse(fs.readFileSync('lib/contracts.json','utf8'));
const types={Order:[{name:'invoiceId',type:'bytes32'},{name:'vendorId',type:'bytes32'},{name:'payer',type:'address'},{name:'recipient',type:'address'},{name:'token',type:'address'},{name:'amount',type:'uint256'},{name:'deadline',type:'uint256'}]};
test('signed execution rejects tampering, replay, limits, expiry and stale vendor wallets',async()=>{
 const rpc=ganache.provider({logging:{quiet:true},chain:{chainId:31337,hardfork:'shanghai'}});const p=new BrowserProvider(rpc);const signer=await p.getSigner();const keys=Object.values(rpc.getInitialAccounts());const owner=new Wallet(keys[0].secretKey),vendor=new Wallet(keys[1].secretKey),other=new Wallet(keys[2].secretKey);
 try{
 const token=await new ContractFactory(a.MockUSDC.abi,a.MockUSDC.bytecode,signer).deploy();await token.waitForDeployment();const f=await new ContractFactory(a.PayFence.abi,a.PayFence.bytecode,signer).deploy();await f.waitForDeployment();
 const amt=parseUnits('10',6),vid=id('vendor');await(await token.mint(owner.address,amt*10n)).wait();await(await token.approve(await f.getAddress(),amt*10n)).wait();await(await f.registerVendor(vid,vendor.address,amt*2n)).wait();
 const domain={name:'PayFence',version:'1',chainId:31337,verifyingContract:await f.getAddress()};
 const o={invoiceId:id('first'),vendorId:vid,payer:owner.address,recipient:vendor.address,token:await token.getAddress(),amount:amt,deadline:9999999999};const sign=x=>owner.signTypedData(domain,types,x);const sig=await sign(o);
 await assert.rejects(f.execute.staticCall({...o,amount:amt+1n},sig));
 await assert.rejects(f.execute.staticCall({...o,recipient:other.address},sig));
 await assert.rejects(f.execute.staticCall(o,await other.signTypedData(domain,types,o)));
 const over={...o,amount:amt*3n};await assert.rejects(f.execute.staticCall(over,await sign(over)));
 const expired={...o,deadline:1};await assert.rejects(f.execute.staticCall(expired,await sign(expired)));
 await(await f.execute(o,sig)).wait();assert.equal(await token.balanceOf(vendor.address),amt);await assert.rejects(f.execute.staticCall(o,sig));
 const canceled={...o,invoiceId:id('cancel')};await(await f.cancel(canceled.invoiceId)).wait();await assert.rejects(f.execute.staticCall(canceled,await sign(canceled)));
 const stale={...o,invoiceId:id('stale')};const staleSig=await sign(stale);
 const changeTypes={WalletChange:[{name:'payer',type:'address'},{name:'vendorId',type:'bytes32'},{name:'newWallet',type:'address'},{name:'nonce',type:'uint256'}]};const change={payer:owner.address,vendorId:vid,newWallet:other.address,nonce:0};
 await assert.rejects(f.changeWallet.staticCall(vid,other.address,await owner.signTypedData(domain,changeTypes,change)));
 await(await f.changeWallet(vid,other.address,await vendor.signTypedData(domain,changeTypes,change))).wait();await assert.rejects(f.execute.staticCall(stale,staleSig));
 }finally{await rpc.disconnect();}
});
