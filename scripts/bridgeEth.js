const { ethers, JsonRpcProvider, parseEther, formatEther } = require("ethers");
require("dotenv").config();

const INFURA_KEY = process.env.INFURA_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// This is for Blast Sepolia Testnet, not Blast mainnet
const BlastBridgeAddress = "0xc644cc19d2A9388b71dd1dEde07cFFC73237Dca8";
// Providers for Sepolia and Blast networks
const sepoliaProvider = new JsonRpcProvider(
  `https://sepolia.infura.io/v3/${INFURA_KEY}`
);
const blastProvider = new JsonRpcProvider("https://sepolia.blast.io");
async function bridgeEth() {
  // Wallet setup
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const sepoliaWallet = wallet.connect(sepoliaProvider);
  const blastWallet = wallet.connect(blastProvider);

  // Transaction to send 0.1 Sepolia ETH
  const tx = {
    to: BlastBridgeAddress,
    value: parseEther("0.4"),
  };

  const transaction = await sepoliaWallet.sendTransaction(tx);
  await transaction.wait();

  // Confirm the bridged balance on Blast
  const balance = await blastProvider.getBalance(wallet.address);
  console.log(`Balance on Blast: ${formatEther(balance)} ETH`);
}

bridgeEth();
