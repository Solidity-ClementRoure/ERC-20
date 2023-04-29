pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "./IERC20Mintable.sol";

contract ERC20Mintable is IERC20Mintable, ERC20, Ownable, ERC20Burnable
{
    constructor() public ERC20("ERC20Mintable", "MINT") {
        minters[msg.sender] = true;
        _mint(address(this), 1000 * (10 ** uint256(decimals())));
    }

    mapping (address => bool) public minters;

	function setMinter(address minterAddress, bool isMinter) override external 
    {
        minters[minterAddress] = isMinter;
    }

	function mint(address toAddress, uint256 amount) override external 
    {
        require(minters[msg.sender] == true, "You are not a minter");
        _mint(toAddress, amount);
    }

	function isMinter(address minterAddress) override external returns (bool) 
    {
        return minters[minterAddress];
    }
}
