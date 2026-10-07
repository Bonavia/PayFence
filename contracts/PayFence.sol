// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
contract PayFence {
    struct Vendor { address wallet; uint256 limit; uint256 nonce; }
    struct Order { bytes32 invoiceId; bytes32 vendorId; address payer; address recipient; address token; uint256 amount; uint256 deadline; }
    mapping(address => mapping(bytes32 => Vendor)) public vendors;
    mapping(address => mapping(bytes32 => bool)) public consumed;
    bytes32 public constant ORDER_TYPEHASH = keccak256("Order(bytes32 invoiceId,bytes32 vendorId,address payer,address recipient,address token,uint256 amount,uint256 deadline)");
    bytes32 public constant CHANGE_TYPEHASH = keccak256("WalletChange(address payer,bytes32 vendorId,address newWallet,uint256 nonce)");
    event PaymentExecuted(bytes32 indexed invoiceId,address indexed payer,address recipient,address token,uint256 amount);
    event VendorRegistered(address indexed payer,bytes32 indexed vendorId,address wallet,uint256 limit);
    event WalletChanged(address indexed payer,bytes32 indexed vendorId,address wallet);
    function domainSeparator() public view returns(bytes32) { return keccak256(abi.encode(keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),keccak256("PayFence"),keccak256("1"),block.chainid,address(this))); }
    function typed(bytes32 h) internal view returns(bytes32) {return keccak256(abi.encodePacked("\x19\x01",domainSeparator(),h));}
    function recover(bytes32 h,bytes calldata signature) internal pure returns(address) {
        require(signature.length==65,"signature length");bytes32 r;bytes32 s;uint8 v;
        assembly {r:=calldataload(signature.offset) s:=calldataload(add(signature.offset,32)) v:=byte(0,calldataload(add(signature.offset,64)))}
        require(uint256(s)<=0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0 && (v==27||v==28),"invalid signature");
        address signer=ecrecover(h,v,r,s);require(signer!=address(0),"zero signer");return signer;
    }
    function registerVendor(bytes32 id,address wallet,uint256 limit) external {
        require(wallet!=address(0)&&limit>0,"invalid vendor");require(vendors[msg.sender][id].wallet==address(0),"already registered");
        vendors[msg.sender][id]=Vendor(wallet,limit,0);emit VendorRegistered(msg.sender,id,wallet,limit);
    }
    function changeWallet(bytes32 id,address next,bytes calldata signature) external {
        Vendor storage v=vendors[msg.sender][id];require(next!=address(0)&&v.wallet!=address(0),"invalid wallet");
        require(recover(typed(keccak256(abi.encode(CHANGE_TYPEHASH,msg.sender,id,next,v.nonce))),signature)==v.wallet,"vendor signature");
        v.wallet=next;v.nonce++;emit WalletChanged(msg.sender,id,next);
    }
    function cancel(bytes32 invoiceId) external {consumed[msg.sender][invoiceId]=true;}
    function orderDigest(Order calldata o) public view returns(bytes32) {return typed(keccak256(abi.encode(ORDER_TYPEHASH,o.invoiceId,o.vendorId,o.payer,o.recipient,o.token,o.amount,o.deadline)));}
    function execute(Order calldata o,bytes calldata signature) external {
        require(!consumed[o.payer][o.invoiceId],"already consumed");require(block.timestamp<=o.deadline,"expired");
        Vendor storage v=vendors[o.payer][o.vendorId];require(v.wallet!=address(0)&&v.wallet==o.recipient,"recipient mismatch");
        require(o.amount>0&&o.amount<=v.limit,"payment limit");require(o.token.code.length>0,"invalid token");
        require(recover(orderDigest(o),signature)==o.payer,"payer signature");
        consumed[o.payer][o.invoiceId]=true;
        (bool ok,bytes memory result)=o.token.call(abi.encodeWithSignature("transferFrom(address,address,uint256)",o.payer,o.recipient,o.amount));
        require(ok&&(result.length==0||abi.decode(result,(bool))),"transfer failed");
        emit PaymentExecuted(o.invoiceId,o.payer,o.recipient,o.token,o.amount);
    }
}
