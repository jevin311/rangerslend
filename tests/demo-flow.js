// tests/demo-flow.js
import dotenv from "dotenv";
import xrpl from "xrpl";
import fetch from "node-fetch";
import { XrplSdk } from "../src/xrplSdk.js";
dotenv.config();

const sdk = new XrplSdk(process.env.XRPL_WS);

async function faucet() {
  const r = await fetch("https://faucet.altnet.rippletest.net/accounts", { method: "POST" });
  return r.json();
}

async function main() {
  console.log("=== DEMO FLOW (Testnet) ===");
  // 1) Fund issuer and borrower accounts via faucet
  const issuerF = await faucet();
  const borrowerF = await faucet();

  const issuerSeed = issuerF.account.seed || issuerF.account.secret;
  const issuerAddress = issuerF.account.address;
  const borrowerSeed = borrowerF.account.seed || borrowerF.account.secret;
  const borrowerAddress = borrowerF.account.address;

  console.log("Issuer:", issuerAddress);
  console.log("Borrower:", borrowerAddress);

  // create wallets
  const issuerWallet = xrpl.Wallet.fromSeed(issuerSeed);
  const borrowerWallet = xrpl.Wallet.fromSeed(borrowerSeed);

  // connect
  await sdk.connect();

  // 2) Borrower creates a DID
  const didDoc = { "@context": "https://w3id.org/did/v1", id: `did:xrpl:1:${borrowerAddress}` };
  const didRes = await sdk.createDID(borrowerWallet, JSON.stringify(didDoc));
  console.log("DIDSet result:", didRes.result.meta.TransactionResult);

  // 3) Borrower creates trustline to issuer for token TUSD
  const currency = "TUSD";
  const trust = await sdk.createTrustline(borrowerWallet, issuerAddress, currency, "1000");
  console.log("Trustline:", trust.result.meta.TransactionResult);

  // 4) Issuer issues token to borrower (simulate RLUSD)
  const pay = await sdk.sendPayment(issuerWallet, borrowerAddress, { currency, issuer: issuerAddress, value: "100" });
  console.log("Payment:", pay.result.meta.TransactionResult);

  // 5) Create escrow: borrower (or lender) locks collateral; demo: issuer escrows 10 TUSD to borrower that only finishes after a short time
  const now = Math.floor(Date.now() / 1000);
  const finishAfter = now + 60; // allow finish after 1 minute
  const escrowRes = await sdk.createEscrow(issuerWallet, borrowerAddress, { currency, issuer: issuerAddress, value: "10" }, finishAfter);
  console.log("EscrowCreate:", escrowRes.result.meta.TransactionResult, "Seq:", escrowRes.result.sequence);

  // cleanup
  await sdk.disconnect();
}
main().catch(console.error);
