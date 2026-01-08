// server.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import xrpl from "xrpl";
import { XrplSdk } from "./src/xrplSdk.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

const sdk = new XrplSdk(process.env.XRPL_WS);

app.get("/", (req, res) => res.send("xMicroLend XRPL MVP"));

app.post("/create-did", async (req, res) => {
  try {
    const { seed, didDocument } = req.body;
    if (!seed || !didDocument) return res.status(400).send({ error: "seed & didDocument required" });
    const wallet = xrpl.Wallet.fromSeed(seed);
    const r = await sdk.createDID(wallet, JSON.stringify(didDocument));
    res.json(r);
  } catch (e) { res.status(500).json({ error: e.message, stack: e.stack }); }
});

app.post("/trustline", async (req, res) => {
  try {
    const { seed, issuerAddress, currency } = req.body;
    const wallet = xrpl.Wallet.fromSeed(seed);
    const r = await sdk.createTrustline(wallet, issuerAddress, currency);
    res.json(r);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/issue-payment", async (req, res) => {
  try {
    const { issuerSeed, dest, currency, value } = req.body;
    const issuerWallet = xrpl.Wallet.fromSeed(issuerSeed);
    const amount = { currency, issuer: issuerWallet.classicAddress, value: value.toString() };
    const r = await sdk.sendPayment(issuerWallet, dest, amount);
    res.json(r);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/create-escrow", async (req, res) => {
  try {
    const { seed, destination, amount, currency, finishAfter } = req.body;
    const wallet = xrpl.Wallet.fromSeed(seed);
    const amt = currency ? { currency, issuer: process.env.ISSUER_ADDRESS, value: amount.toString() } : amount.toString();
    const r = await sdk.createEscrow(wallet, destination, amt, finishAfter);
    res.json(r);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/finish-escrow", async (req, res) => {
  try {
    const { seed, owner, offerSequence } = req.body;
    const wallet = xrpl.Wallet.fromSeed(seed);
    const r = await sdk.finishEscrow(wallet, owner, offerSequence);
    res.json(r);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/balances/:address", async (req, res) => {
  try {
    const b = await sdk.getBalances(req.params.address);
    res.json(b);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, () => {
  console.log(`xMicroLend server listening at http://localhost:${PORT}`);
});
