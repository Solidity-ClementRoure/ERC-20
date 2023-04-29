var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20Claimable = artifacts.require("ERC20Claimable.sol");
var evaluator = artifacts.require("Evaluator.sol");
var solution = artifacts.require("ExerciceSolution.sol");
var mintable = artifacts.require("ERC20Mintable.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        //await deployTDToken(deployer, network, accounts); 
        //await deployEvaluator(deployer, network, accounts); 
       // await setPermissionsAndRandomValues(deployer, network, accounts); 
        //await deployRecap(deployer, network, accounts); 
		await instenciateContract(deployer, network, accounts);

        await testSolution(deployer, network, accounts); 
		//await deployMintable(deployer, network, accounts);
    });
};


async function instenciateContract(deployer, network, accounts) {
	 TDToken = await TDErc20.at("0xE619D5b35C4f40deaF37Ec2d7678D315565B7f93")
	 ClaimableToken = await ERC20Claimable.at("0x261d75885849c6196D13cfAA59F9c4EE15186bBB")
     Evaluator = await evaluator.at("0xde6f7801ef5a4b8b27aD750a80500da08F0221f0")
	 MintableToken = await mintable.at("0x8bA828Cabf7db69ee0c0512a623D66BE81c3C729")

}

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-ERC20-102-23","TD-ERC20-102-23",web3.utils.toBN("20000000000000000000000000000"))
	ClaimableToken = await ERC20Claimable.new("ClaimableToken23","CLTK-23",web3.utils.toBN("20000000000000000000000000000"))
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address, ClaimableToken.address)
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("ClaimableToken " + ClaimableToken.address)
	console.log("Evaluator " + Evaluator.address)
}

async function deployMintable(deployer, network, accounts) {
	MintableToken = await mintable.new()
	console.log("MintableToken " + MintableToken.address)
}
async function testSolution(deployer, network, accounts) {
	mySolution = await solution.new(ClaimableToken.address)
	console.log("mySolution " + mySolution.address)
	await Evaluator.submitExercice(mySolution.address)
	myBalance = await TDToken.balanceOf(accounts[0])
	console.log("my balance " + myBalance)

	// await Evaluator.ex4_approvedExerciceSolution()
	// myBalance = await TDToken.balanceOf(accounts[0])
	// console.log("my balance " + myBalance)
	// console.log()

	// await Evaluator.ex5_revokedExerciceSolution()
	// myBalance = await TDToken.balanceOf(accounts[0])
	// console.log("my balance " + myBalance)
	// console.log()

	// await Evaluator.ex6_depositTokens()
	// myBalance = await TDToken.balanceOf(accounts[0])
	// console.log("my balance " + myBalance)
	// console.log()

	// await Evaluator.ex7_createERC20()
	// myBalance = await TDToken.balanceOf(accounts[0])
	// console.log("my balance " + myBalance)
	// console.log()

	// await Evaluator.ex8_depositAndMint()
	// myBalance = await TDToken.balanceOf(accounts[0])
	// console.log("my balance " + myBalance)
	// console.log()

	await Evaluator.ex9_withdrawAndBurn()
	myBalance = await TDToken.balanceOf(accounts[0])
	console.log("my balance " + myBalance)
	console.log()
	



}

// truffle run verify ERC20TD@0xb79a94500EE323f15d76fF963CcE27cA3C9e32DF --network goerli 
// truffle run verify ERC20Claimable@0xE70AE39bDaB3c3Df5225E03032D31301E2E71B6b --network goerli 
// truffle run verify Evaluator@0x16F3F705825294A55d40D3D34BAF9F91722d6143 --network goerli 