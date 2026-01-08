import express from "express";
import dotenv from "dotenv";
import {
  createDID,
  createTrustline,
  sendToken
} from "./src/xrpl.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("XRPL MVP is running");
});

app.post("/did", async (req, res) => {
  const { seed } = req.body;
  const did = {
    "@context": "https://w3id.org/did/v1",
    id: "did:xrpl:mvp"
  };

  const result = await createDID(seed, did);
  res.json(result);
});

app.post("/trustline", async (req, res) => {
  const { seed, issuer, currency } = req.body;
  const result = await createTrustline(seed, issuer, currency);
  res.json(result);
});

app.post("/issue", async (req, res) => {
  const { seed, destination, currency, value } = req.body;
  const result = await sendToken(seed, destination, currency, value);
  res.json(result);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
