async function obtainToken(challengeData, signature) {
  const url = "https://waitlist-api.develop.testblast.io/v1/dapp-auth/solve";

  const requestData = {
    challengeData: challengeData,
    signature: signature,
  };

  console.log(url);
  console.log(requestData);

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
    return responseData;
  } catch (error) {
    console.error("Error:", error);

    return {
      success: false,
      bearerToken: "",
      message: error.message,
    };
  }
}

async function main() {
  const challengeData =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250cmFjdEFkZHJlc3MiOiIweGRlNGE4ZTEwZTAyODU5YmQ0OWY2NmRlMjliMGM4N2NjOTRiOTEzMmIiLCJvcGVyYXRvckFkZHJlc3MiOiIweDVlNWFmNWRjM2NjM2M5M2ZhODM0N2ZhOThlZGRjOTQyMTYyZDBjYmYiLCJleHBpcmVzQXQiOiIyMDI0LTAzLTA3VDA4OjU1OjExLjMyMloiLCJub25jZSI6IjM5MTJiMGZhZDMxZWMxMGE0M2U4ZGJmM2Q3OWY3NjlmMzBiMzdjMGM2YmNmOGVjN2QzZjRhMjIwNDg0Mjg3MjMiLCJpYXQiOjE3MDk4MDE2NTEsImV4cCI6MTcwOTgwMTcxMX0.coRO0tnXw6BBBaLy4fURWS0h3v9WYlvKtBSyapdxmSo";
  const signature =
    "0x8a16152d4003a0e6afb3037073d9920e4e9fbf90d58b94ee92b6a86aa157cba844b1eea6d7dfbc7433b08e858889c705214c9d690a95dc76c0e26adfaba4b7201c";

  const response = await obtainToken(challengeData, signature);
  console.log("Response:", response);
}

main().catch((error) => console.error("Error in main:", error));
