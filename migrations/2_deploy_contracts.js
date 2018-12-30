var gambling1 = artifacts.require('./gambling1.sol')
var gambling0 = artifacts.require('./gambling0.sol')

module.exports = function (deployer) {
  deployer.deploy(gambling1)
  deployer.deploy(gambling0)
}
