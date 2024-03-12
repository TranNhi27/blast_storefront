require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomicfoundation/hardhat-verify");

const priKey = process.env.PRIVATE_KEY;
const ethersKey = process.env.ETHERS_API;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    blast_sepolia: {
      url: `https://sepolia.blast.io`,
      accounts: [priKey],
    },
    blast: {
      url: `https://rpc.blast.io`,
      accounts: [priKey],
    },
  },
  etherscan: {
    apiKey: {
      blast_sepolia: ethersKey,
    },
    customChains: [
      {
        network: "blast_sepolia",
        chainId: 168587773,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan",
          browserURL: "https://testnet.blastscan.io",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
};
