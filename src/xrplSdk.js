// src/xrplSdk.js
import xrpl from "xrpl";

const DEFAULT_WS = process.env.XRPL_WS || "wss://s.altnet.rippletest.net:51233";

export class XrplSdk {
  constructor(wsUrl = DEFAULT_WS) {
    this.client = new xrpl.Client(wsUrl);
    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
  }

  async disconnect() {
    if (this.connected) {
      await this.client.disconnect();
      this.connected = false;
    }
  }

  // Create a DID on-ledger using DIDSet (DID document string or URI)
  // wallet: xrpl.Wallet instance
  // didDocumentJson: JSON string or short doc
  async createDID(wallet, didDocumentJson, opts = {}) {
    await this.connect();
    const tx = {
      TransactionType: "DIDSet",
      Account: wallet.classicAddress,
      DIDDocument: Buffer.from(didDocumentJson).toString("hex"),
      ...opts
    };
    const prepared = await this.client.autofill(tx);
    const signed = wallet.sign(prepared);
    const res = await this.client.submitAndWait(signed.tx_blob);
    return res;
  }

  // Create a TrustSet (trustline) so an account can hold issued currency from issuer
  // wallet: xrpl.Wallet of the trusting account
  // issuerAddress: string (issuer classic address)
  // currency: 3-6 char currency code (token code)
  // limit: string e.g. "1000"
  async createTrustline(wallet, issuerAddress, currency, limit = "1000000") {
    await this.connect();
    const tx = {
      TransactionType: "TrustSet",
      Account: wallet.classicAddress,
      LimitAmount: {
        currency: currency,
        issuer: issuerAddress,
        value: limit
      }
    };
    const prepared = await this.client.autofill(tx);
    const signed = wallet.sign(prepared);
    const res = await this.client.submitAndWait(signed.tx_blob);
    return res;
  }

  // Send an issued-currency payment (issuer -> dest) or XRP (string)
  async sendPayment(senderWallet, destination, amount) {
    // amount may be string (drops/XRP) or object for issued currency
    await this.connect();
    const tx = {
      TransactionType: "Payment",
      Account: senderWallet.classicAddress,
      Destination: destination,
      Amount: amount
    };
    const prepared = await this.client.autofill(tx);
    const signed = senderWallet.sign(prepared);
    const res = await this.client.submitAndWait(signed.tx_blob);
    return res;
  }

  // Create Escrow (can escrow XRP or (with token support) issued currencies)
  // Amount: string (drops) or Issued currency object {currency, issuer, value}
  // finishAfter: unix time in seconds (optional)
  async createEscrow(senderWallet, destination, amount, finishAfter = null) {
    await this.connect();
    const tx = {
      TransactionType: "EscrowCreate",
      Account: senderWallet.classicAddress,
      Destination: destination,
      Amount: amount
    };
    if (finishAfter) tx.FinishAfter = finishAfter;
    const prepared = await this.client.autofill(tx);
    const signed = senderWallet.sign(prepared);
    const res = await this.client.submitAndWait(signed.tx_blob);
    return res;
  }

  // Finish an escrow
  // ownerAddress: account that created the escrow
  // escrowSequence: sequence of the EscrowCreate ledger object
  // wallet: signer who has right to finish
  async finishEscrow(wallet, ownerAddress, escrowSequence) {
    await this.connect();
    const tx = {
      TransactionType: "EscrowFinish",
      Account: wallet.classicAddress,
      Owner: ownerAddress,
      OfferSequence: escrowSequence
    };
    const prepared = await this.client.autofill(tx);
    const signed = wallet.sign(prepared);
    const res = await this.client.submitAndWait(signed.tx_blob);
    return res;
  }

  async getBalances(address) {
    await this.connect();
    return await this.client.getBalances(address);
  }

  // small helper: create wallet funded from testnet faucet (returns xrpl.Wallet)
  static async fundTestWallet() {
    // Use the official Testnet faucet API
    const resp = await fetch("https://faucet.altnet.rippletest.net/accounts", { method: "POST" });
    const j = await resp.json();
    // The faucet returns {account: {address, secret}, ...}
    if (!j?.account?.address) throw new Error("Faucet error: " + JSON.stringify(j));
    const wallet = xrpl.Wallet.fromSeed(j.account.seed ?? j.account.secret ?? j.account.private_key, {classicAddress: j.account.address});
    // NOTE: xrpl.Wallet.fromSeed may accept seed; if scaffold fails, create wallet manually
    return { address: j.account.address, secret: j.account.seed ?? j.account.secret, walletData: j.account };
  }
}
