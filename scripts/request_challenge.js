const { ethers } = require("ethers");
require("dotenv").config();

async function requestChallenge(contractAddress, operatorAddress) {
  const url =
    "https://waitlist-api.develop.testblast.io/v1/dapp-auth/challenge";

  const requestData = {
    contractAddress: contractAddress,
    operatorAddress: operatorAddress,
  };

  const privateKey = process.env.OPERATOR_KEY;

  try {
    const { default: fetch } = await import("node-fetch");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    signMessage(responseData.message, privateKey)
      .then((signature) => {
        console.log("Signature:", signature);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    return { success: false, challengeData: "", message: error.message };
  }
}

// Sign message function
async function signMessage(message, privateKey) {
  const wallet = new ethers.Wallet(privateKey);
  const signature = await wallet.signMessage(message);
  return signature;
}

async function main() {
  const contractAddress = "0xdE4a8E10E02859bd49F66De29B0c87Cc94b9132B";
  const operatorAddress = "0x5e5Af5dc3Cc3c93FA8347fA98eddc942162d0Cbf";

  const response = await requestChallenge(contractAddress, operatorAddress);
  console.log("Response:", response);
}

main().catch((error) => console.error("Error in main:", error));
