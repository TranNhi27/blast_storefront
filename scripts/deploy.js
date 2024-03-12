const hre = require("hardhat");

async function main() {
  const initialOwnerAddress = "0x306563D12A1ee361280884d8Cf68b14c0d34908b";
  const pointsOperator = "0x5e5af5dc3cc3c93fa8347fa98eddc942162d0cbf";

  const _mintPrice = 300000000000000;
  const storefront = await hre.ethers.deployContract("Storefront", [
    initialOwnerAddress,
    pointsOperator,
    _mintPrice,
  ]);

  await storefront.waitForDeployment();

  console.log(
    `Storefront deployed with ETH mint price ${_mintPrice} deployed to ${storefront.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
