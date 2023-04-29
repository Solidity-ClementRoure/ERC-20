pragma solidity ^0.6.0;
import "./IExerciceSolution.sol";
import "./ERC20Claimable.sol";
import "./ERC20Mintable.sol";

contract ExerciceSolution is IExerciceSolution 
{
	address Evaluator = address(0x16F3F705825294A55d40D3D34BAF9F91722d6143);
	address ClaimableDeployed = address(0xE70AE39bDaB3c3Df5225E03032D31301E2E71B6b);
	address MintableDeployed = address(0xc1965DFB30573ce0351816C49EEcF11Ec851f4d8);

	ERC20Claimable claimableERC20;
    ERC20Mintable MintableERC20;
	mapping(address => uint256) public balance;

    //constructor(ERC20Claimable _claimableERC20) // Local Deployment
	constructor() // Goerli Deployment

	public 
	{
        //claimableERC20 = _claimableERC20; // Local Deployment
		claimableERC20 = ERC20Claimable(ClaimableDeployed); // Goerli Deployment
		
		MintableERC20 = ERC20Mintable(MintableDeployed);
        
        claimableERC20.claimTokens();

		// claimableERC20.transfer(address(0xde6f7801ef5a4b8b27aD750a80500da08F0221f0), 10000); // Local Evaluator's address
	}

	function claimTokensOnBehalf() external override
	{
		uint256 claimedTokens = claimableERC20.claimTokens();
		balance[msg.sender] += claimedTokens;
	}

	function tokensInCustody(address callerAddress) external override returns (uint256)
	{
		return balance[callerAddress];
	}

	function withdrawTokens(uint256 amountToWithdraw) external override returns (uint256)
	{
		require(balance[msg.sender] >= amountToWithdraw, "Not enough tokens to withdraw");
		balance[msg.sender] -= amountToWithdraw;
		claimableERC20.transfer(msg.sender, amountToWithdraw);

		//Burning tokens
		MintableERC20.burn(amountToWithdraw);
	}

	function depositTokens(uint256 amountToWithdraw) external override returns (uint256)
	{
        claimableERC20.transferFrom(msg.sender, address(this), amountToWithdraw);
        balance[msg.sender] += amountToWithdraw;
        balance[address(this)] -= amountToWithdraw;

        MintableERC20 = ERC20Mintable(MintableDeployed);

        MintableERC20.setMinter(address(this), true);
        MintableERC20.setMinter(Evaluator,false);

        MintableERC20.mint(msg.sender, amountToWithdraw);
    }

	function getERC20DepositAddress() external override returns (address)
	{
        MintableERC20 = ERC20Mintable(MintableDeployed);

        MintableERC20.setMinter(address(this), true);
        MintableERC20.setMinter(Evaluator,false);

        return MintableDeployed;
    }
}