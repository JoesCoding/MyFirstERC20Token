pragma solidity ^0.5.0;

contract DappToken {

	string public name = "JAS Token";
	string public symbol = "JAS";
	string public standard = "JAS Token v1.0";
	uint256 public totalSupply;

	mapping(address => uint256) public balanceOf;

	constructor (uint256 _initialSupply) public {
		totalSupply = _initialSupply;
		balanceOf[msg.sender] = _initialSupply;
	}

}