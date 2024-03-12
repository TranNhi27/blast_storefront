const { v4: uuidv4 } = require("uuid");

async function transferPoint(contractAddress, batchId, request, bearerToken) {
  const url = `https://waitlist-api.develop.testblast.io/v1/contracts/${contractAddress}/batches/${batchId}`;

  try {
    const { default: fetch } = await import("node-fetch");

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    return { success: false, batchId: "" };
  }
}

// PUT /v1/contracts/:contractAddress/batches/:batchId
//
// batchId is a client provided string (max length 64)
// This endpoint is idempotent on batchId (for a non-idempotent variant see below)
// If a request fails, the request can be retried with the same batchId
// If the batchId already exists, we return a 409
// We recommend using a UUID
//
// The contract must have enough points of pointType available
// for this request to succeed.
// type Transfer = {
//   toAddress: string,

//   // decimal string
//   // must be >= MINIMUM_TRANSFER_SIZE
//   // must have decimal places <= MAX_TRANSFER_DECIMALS
//   points: string,
// };

// type Request = {
//   pointType: PointType,

//   // 1 <= transfers.length <= MAX_TRANSFERS_PER_BATCH
//   // transfers[i].toAddress !== contractAddress (no self transfers)
//   // count(transfers[].toAddress = address) <= 1 (only one transfer per address)
//   transfers: Transfer[],
// };

// type Response = {
//   success: boolean,
//   batchId: string,
// };

async function main() {
  const contractAddress = "0x0e136d9a626BF716cB08FAB03513eAB836af7F52";

  // Generate a UUID
  const uuid = uuidv4();
  console.log("UUID:", uuid);
  const batchId = uuid; // Replace with your actual batch ID
  const request = {
    pointType: "LIQUIDITY", // Or "DEVELOPER"
    transfers: [
      {
        toAddress: "0x306563D12A1ee361280884d8Cf68b14c0d34908b",
        points: "1",
      },
      // Add more transfers if needed
    ],
  };

  const bearerToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOiIxODQyNzNjMC03ZDBiLTRlZTMtYmM0Ni02MzZmZmNkNjE3MjIiLCJjb250cmFjdEFkZHJlc3MiOiIweDBlMTM2ZDlhNjI2YmY3MTZjYjA4ZmFiMDM1MTNlYWI4MzZhZjdmNTIiLCJpYXQiOjE3MDk3MTI1NjYsImV4cCI6MTcwOTcxNjE2Nn0.zF3pvjcEli60FI-Pcaax_r6uJGqQpybqRthMoWilXqY";

  const response = await transferPoint(
    contractAddress,
    batchId,
    request,
    bearerToken
  );
  console.log("Response:", response);
}

main().catch((error) => console.error("Error in main:", error));
