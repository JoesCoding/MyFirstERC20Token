const DappToken = artifacts.require("DappToken");

contract('DappToken', function(accounts) {
	var tokenInstance;
	const oneMillion = 1000000;

	it('initializes the contract with the correct values', function() {
		return DappToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name) {
			assert.equal(name, 'JAS Token', 'has the correct name');
			return tokenInstance.symbol();
		}).then(function(symbol) {
			assert.equal(symbol, 'JAS', 'has the correct symbol');
			return tokenInstance.standard();
		}).then(function(standard) {
			assert.equal(standard, 'JAS Token v1.0', 'has the correct standard');
		});
	})

	it('allocates the initial supply upon deployment', function() {
		return DappToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.totalSupply()
		}).then(function(totalSupply) {
			assert.equal(totalSupply.toNumber(), oneMillion, 'sets the total supply to initial supply passed');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance) {
			assert.equal(adminBalance.toNumber(), oneMillion, 'initial supply is all allocated to admin account')
		})
	})
})