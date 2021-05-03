const DappToken = artifacts.require("DappToken");

contract('DappToken', function(accounts) {
	var tokenInstance;
	const oneMillion = 1000000;
	const quarterMillion = 250000;
	const threeQuarterMillion = 750000;

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
	});

	it('allocates the initial supply upon deployment', function() {
		return DappToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.totalSupply()
		}).then(function(totalSupply) {
			assert.equal(totalSupply.toNumber(), oneMillion, 'sets the total supply to initial supply passed');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance) {
			assert.equal(adminBalance.toNumber(), oneMillion, 'initial supply is all allocated to admin account')
		});
	});

	it('transfers token ownership', function() {
		return DappToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.transfer.call(accounts[1], 9999999999)
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
			return tokenInstance.transfer.call(accounts[1], quarterMillion, { from: accounts[0] });
		}).then(function(success) {
			assert(success, true, 'it returns true for valid transfers');
			return tokenInstance.transfer(accounts[1], quarterMillion, { from: accounts[0] });
		}).then(function(receipt) {
			assert(receipt.logs.length, 1, 'triggers one event');
			assert(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
			assert(receipt.logs[0].args._from, accounts[0], 'logs the account tokens are transferred from');
			assert(receipt.logs[0].args._to, accounts[1], 'logs the account tokens are transferred from');
			assert(receipt.logs[0].args._value, quarterMillion, 'logs the transfer amount');
			return tokenInstance.balanceOf(accounts[1]);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), quarterMillion, 'adds the amount to the receiving account');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), threeQuarterMillion, 'deducts the amount from the sending account');
		});
	});
})