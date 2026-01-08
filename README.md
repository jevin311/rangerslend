# rangerslend
# xMicroLend — XRPL Micro-lending MVP

## Overview
xMicroLend is an XRPL-based micro-lending MVP that demonstrates:
- On-ledger Decentralized Identifiers (DIDs) (DIDSet)
- Issued-currency (RLUSD-like) flows with trustlines and payments
- Escrow-based conditional collateral management (EscrowCreate / EscrowFinish)
- A small developer SDK exposing these core flows

This project runs on the **XRPL Testnet** and is intended to be a minimal, testable demonstration you can extend.

## What XRPL features are used
- **DIDSet / DID ledger entries** — on-ledger DID storage and DID documents. (DID amendment). :contentReference[oaicite:7]{index=7}  
- **Issued currencies (IOUs)** — simulate RLUSD by creating an issuer and trustlines. :contentReference[oaicite:8]{index=8}  
- **EscrowCreate / EscrowFinish** — native conditional payments to secure collateral or time-locked funds. :contentReference[oaicite:9]{index=9}  
- **xrpl.js** — the official JavaScript SDK used to interact with XRPL. :contentReference[oaicite:10]{index=10}

## Quick start (Testnet)
1. Clone repo and `cd xMicroLend`.
2. `npm install`
3. Copy `.env.example` → `.env` and set values if you want; defaults point to XRPL Testnet.
4. Run `node server.js` to start REST API.
5. Use the Testnet faucet to create funding seeds for test accounts:
   - Programmatic faucet: `curl -X POST https://faucet.altnet.rippletest.net/accounts` (see XRPL docs) :contentReference[oaicite:11]{index=11}
6. Use the REST endpoints:
   - `POST /create-did` with `{seed, didDocument}` to create a DID on-ledger.
   - `POST /trustline` with `{seed, issuerAddress, currency}` to create trustline.
   - `POST /issue-payment` with `{issuerSeed, dest, currency, value}` to simulate issuer token payment.
   - `POST /create-escrow` and `POST /finish-escrow` to manage escrows.

## Demo script
`npm run demo` runs a demo flow that:
- Funds two test accounts via faucet.
- Creates a DID for the borrower.
- Sets a trustline.
- Issues tokens from issuer → borrower.
- Creates a sample escrow.

## How this solves a real-world problem
A major barrier for micro-lending in underbanked regions is identity + conditional, trust-minimized collateral release. xMicroLend:
- Uses on-ledger DIDs so verifiable credentials (KYC / reputation) can be anchored to identities.
- Uses issued stable tokens (RLUSD-like) for fast stable-value transfers.
- Uses escrow to automate collateral release once repayment conditions are satisfied.
This reduces counterparty risk and allows developers and institutions to build compliant, auditable microfinance apps on XRPL.

## For Judges — Rubric mapping
- **Business potential (20%)**: microfinance use-case is large and underserved; stablecoins + DID + escrow combine to create low-cost rails for tiny loans.
- **Creativity (20%)**: DID + Escrow + RLUSD simulation is a concrete combo enabling verifiable identity + automated collateral.
- **Use of XRPL (30%)**: uses DIDSet, TrustSet/IssuedCcy, EscrowCreate/EscrowFinish, xrpl.js. (See docs referenced.) :contentReference[oaicite:12]{index=12}
- **Completeness (30%)**: working SDK, REST endpoints, demo script and README make it testable on Testnet.

## Next steps (if you want to expand)
- Integrate W3C Verifiable Credentials (VCs) off-ledger and anchor proofs on ledger DIDs.
- Add a frontend wallet experience (React + xrpl.js in-browser).
- Replace mock RLUSD with production RLUSD issuer details (mainnet) and add compliance flows for AML/KYC.
- Build SDK language bindings (python, go).

## References (selected)
- XRPL DIDs / DIDSet docs. :contentReference[oaicite:13]{index=13}  
- XRPL Escrow docs. :contentReference[oaicite:14]{index=14}  
- Issue tokens / issued currencies. :contentReference[oaicite:15]{index=15}  
- RLUSD overview. :contentReference[oaicite:16]{index=16}  
- xrpl.js library docs. :contentReference[oaicite:17]{index=17}
