require('dotenv').config();

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');


task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.10",
  networks: {
    local: {
      url: 'http://localhost:8545'
    },
    xdai: {
      url: 'https://dai.poa.network',
      accounts: [process.env.PRIVATE_KEY],
    },
    mumbai: {
      url: 'https://matic-mumbai.chainstacklabs.com',
      accounts: [process.env.PRIVATE_KEY],
    },
    rinkeby: {
      url: "https://eth-mainnet.alchemyapi.io/v2/Fp5AcyTsLowVFkgEpYFn7IkVpI3UJS4f",
      accounts: [process.env.PRIVATE_KEY],
    },
    ropsten: {
      url: "https://eth-mainnet.alchemyapi.io/v2/Fp5AcyTsLowVFkgEpYFn7IkVpI3UJS4f",
      accounts: [process.env.PRIVATE_KEY],
    }
  }
};
