// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
// TEST ONLY. Anyone can mint. Not real USDC.
contract MockUSDC {
 string public constant name="PayFence Test Dollar";string public constant symbol="TEST";uint8 public constant decimals=6;
 mapping(address=>uint256) public balanceOf;mapping(address=>mapping(address=>uint256)) public allowance;
 function mint(address to,uint256 amount) external {balanceOf[to]+=amount;}
 function approve(address spender,uint256 amount) external returns(bool){allowance[msg.sender][spender]=amount;return true;}
 function transferFrom(address from,address to,uint256 amount) external returns(bool){require(balanceOf[from]>=amount&&allowance[from][msg.sender]>=amount,"insufficient funds or allowance");balanceOf[from]-=amount;balanceOf[to]+=amount;allowance[from][msg.sender]-=amount;return true;}
}
