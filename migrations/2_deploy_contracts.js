const DappToken = artifacts.require("DappToken");

module.exports = function (deployer) {
	const one_million = 1000000
	deployer.deploy(DappToken, one_million);
};
