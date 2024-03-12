// Define PointType enum
const PointType = {
  LIQUIDITY: "LIQUIDITY",
  DEVELOPER: "DEVELOPER",
};

// Define PointBalances constructor function
function PointBalances(
  available,
  pendingSent,
  earnedCumulative,
  receivedCumulative,
  finalizedSentCumulative
) {
  this.available = available;
  this.pendingSent = pendingSent;
  this.earnedCumulative = earnedCumulative;
  this.receivedCumulative = receivedCumulative;
  this.finalizedSentCumulative = finalizedSentCumulative;
}

// Define Response constructor function
function Response(success, balancesByPointType) {
  this.success = success;
  this.balancesByPointType = balancesByPointType;
}

// Create instances of PointBalances for LIQUIDITY and DEVELOPER
const liquidityPointBalances = new PointBalances("", "", "", "", "");
const developerPointBalances = new PointBalances("", "", "", "", "");

// Create an instance of Response
const response = new Response(false, {
  [PointType.LIQUIDITY]: liquidityPointBalances,
  [PointType.DEVELOPER]: developerPointBalances,
});

async function checkPoint(bearerToken, contractAddress) {
  const url = `https://waitlist-api.develop.testblast.io/v1/contracts/${contractAddress}/point-balances`;

  try {
    const { default: fetch } = await import("node-fetch");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: error.message };
  }
}

async function main() {
  const bearerToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiJmYWEwMjE2OS1lNDgxLTQyNjQtODZjMy1lY2VmNzRjOTc1YWMiLCJjb250cmFjdEFkZHJlc3MiOiIweGRlNGE4ZTEwZTAyODU5YmQ0OWY2NmRlMjliMGM4N2NjOTRiOTEzMmIiLCJpYXQiOjE3MDk4MDE2ODgsImV4cCI6MTcwOTgwNTI4OH0.pm90mpIsO6l4X9lsPuFDxjFkxKx5l3Vcadi4yL4S50w";
  const contractAddress = "0xdE4a8E10E02859bd49F66De29B0c87Cc94b9132B";
  const response = await checkPoint(bearerToken, contractAddress);
  console.log("Response:", response);
}

main().catch((error) => console.error("Error in main:", error));
