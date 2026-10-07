import solc from 'solc';import fs from 'node:fs';
const sources=Object.fromEntries(['PayFence','MockUSDC'].map(n=>[n+'.sol',{content:fs.readFileSync('contracts/'+n+'.sol','utf8')}]));
const output=JSON.parse(solc.compile(JSON.stringify({language:'Solidity',sources,settings:{optimizer:{enabled:true,runs:200},evmVersion:'shanghai',outputSelection:{'*':{'*':['abi','evm.bytecode.object']}}}})));
for(const e of output.errors||[]) {if(e.severity==='error')throw Error(e.formattedMessage);}
const artifacts=Object.fromEntries(Object.entries(output.contracts).flatMap(([,cs])=>Object.entries(cs).map(([n,c])=>[n,{abi:c.abi,bytecode:'0x'+c.evm.bytecode.object}])));
fs.writeFileSync('lib/contracts.json',JSON.stringify(artifacts,null,2)+'\n');console.log('Compiled PayFence and test token');
