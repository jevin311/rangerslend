import xrpl from "xrpl";

const WS = process.env.XRPL_WS;

export async function connect() {
  const client = new xrpl.Client(WS);
  await client.connect();
  return client;
}

// Create DID on XRPL
export async function createDID(seed, didJson) {
  const client = await connect();
  const wallet = xrpl.Wallet.fromSeed(seed);

  const tx = {
    TransactionType: "DIDSet",
    Account: wallet.classicAddress,
    DIDDocument: Buffer.from(JSON.stringify(didJson)).toString("hex")
  };

  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  await client.disconnect();
  return result;
}

// Create trustline (for RLUSD-style token)
export async function createTrustline(seed, issuer, currency) {
  const client = await connect();
  const wallet = xrpl.Wallet.fromSeed(seed);

  const tx = {
    TransactionType: "TrustSet",
    Account: wallet.classicAddress,
    LimitAmount: {
      currency,
      issuer,
      value: "1000000"
    }
  };

  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  await client.disconnect();
  return result;
}

// Send issued token payment
export async function sendToken(seed, destination, currency, value) {
  const client = await connect();
  const wallet = xrpl.Wallet.fromSeed(seed);

  const tx = {
    TransactionType: "Payment",
    Account: wallet.classicAddress,
    Destination: destination,
    Amount: {
      currency,
      issuer: wallet.classicAddress,
      value
    }
  };

  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  await client.disconnect();
  return result;
}
