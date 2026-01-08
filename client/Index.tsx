import React, { useEffect, useState } from "react";
import axios from "axios";
import { BackgroundGrid } from "@/components/xrpl/BackgroundGrid";
import { Card } from "@/components/xrpl/Card";
import { Button } from "@/components/xrpl/Button";
import { InputField } from "@/components/xrpl/InputField";
import { StatusBadge } from "@/components/xrpl/StatusBadge";

// Top-level configurable API base - use relative paths for seamless integration
const API_BASE = import.meta.env.VITE_API_BASE || "";

// --- MAIN APP ---

export default function Index() {
  const [seed, setSeed] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [log, setLog] = useState<Array<{ ts: string; entry: string }>>([]);

  const [issuerSeed, setIssuerSeed] = useState("");
  const [issuerAddress, setIssuerAddress] = useState("");
  const [currency, setCurrency] = useState("RLUSD");

  const [loanAmt, setLoanAmt] = useState("");
  const [finishAfter, setFinishAfter] = useState("");

  const [balances, setBalances] = useState<Array<any>>([]);

  useEffect(() => {
    // Logic kept: derive address placeholder
  }, [seed]);

  function pushLog(entry: string) {
    setLog((l) =>
      [{ ts: new Date().toISOString(), entry }, ...l].slice(0, 100),
    );
  }

  async function callApi(path: string, body = {}) {
    setStatus("Processing...");
    try {
      const res = await axios.post(`${API_BASE}/${path}`, body, {
        timeout: 45000,
      });
      setStatus("Done");
      pushLog(`${path} -> OK`);
      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data || err.message || String(err);
      setStatus(
        "Error: " + (typeof msg === "string" ? msg : JSON.stringify(msg)),
      );
      pushLog(`${path} -> ERROR: ${JSON.stringify(msg)}`);
      throw err;
    }
  }

  // Actions
  async function createDID() {
    try {
      const payload = { seed };
      const data = await callApi("did", payload);
      pushLog(`DID created: ${JSON.stringify(data?.result || data)}`);
      alert("DID created — check transaction in response and server logs.");
    } catch (e) {}
  }

  async function createTrustline() {
    try {
      const payload = { seed, issuer: issuerAddress || issuerSeed, currency };
      const data = await callApi("trustline", payload);
      pushLog(`Trustline: ${JSON.stringify(data?.result || data)}`);
      alert("Trustline created (or pending). Check logs.");
    } catch (e) {}
  }

  async function issueToken() {
    try {
      const payload = {
        seed: issuerSeed,
        destination: address,
        currency,
        value: "100",
      };
      const data = await callApi("issue", payload);
      pushLog(
        `Issued ${currency} -> ${address}: ${JSON.stringify(data?.result || data)}`,
      );
      alert("Issued tokens — check balances after a few seconds.");
    } catch (e) {}
  }

  async function refreshBalances() {
    try {
      const res = await axios.get(`${API_BASE}/balances/${address}`);
      setBalances(res.data || []);
      pushLog(`Balances refreshed for ${address}`);
    } catch (err: any) {
      pushLog(`Balances error: ${err.message}`);
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <BackgroundGrid />

      <div className="relative z-10">
        {/* HEADER */}
        <header className="border-b border-slate-700/30 backdrop-blur-sm bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400 tracking-tight">
                  xRangerLend
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 tracking-widest uppercase font-semibold">
                  XRPL LENDING PROTOCOL // TESTNET v0.9
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                  NETWORK NODE
                </div>
                <div className="text-sm font-mono text-cyan-400 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg w-fit">
                  {API_BASE}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN: IDENTITY & ISSUER */}
            <div className="lg:col-span-1 space-y-6">
              {/* Identity Card */}
              <Card title="Account Identity" highlight>
                <div className="space-y-4">
                  <InputField
                    id="seed"
                    label="Account Seed"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="sn..."
                  />
                  <InputField
                    id="address"
                    label="Account Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="r..."
                  />

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={createDID}
                      variant="primary"
                      className="flex-1"
                    >
                      Init DID
                    </Button>
                    <Button
                      onClick={refreshBalances}
                      variant="secondary"
                      className="flex-1"
                    >
                      Sync Data
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-slate-700/30">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      System Status
                    </div>
                    <StatusBadge status={status} />
                  </div>
                </div>
              </Card>

              {/* Issuer Card */}
              <Card title="Token Issuer">
                <div className="space-y-4">
                  <InputField
                    id="issuerSeed"
                    label="Issuer Seed"
                    value={issuerSeed}
                    onChange={(e) => setIssuerSeed(e.target.value)}
                    placeholder="sn..."
                  />
                  <InputField
                    id="issuerAddress"
                    label="Issuer Address"
                    value={issuerAddress}
                    onChange={(e) => setIssuerAddress(e.target.value)}
                    placeholder="r..."
                  />
                  <InputField
                    id="currency"
                    label="Currency Code"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    placeholder="RLUSD"
                  />

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={createTrustline}
                      variant="action"
                      className="flex-1"
                    >
                      Trust Set
                    </Button>
                    <Button
                      onClick={issueToken}
                      variant="action"
                      className="flex-1"
                    >
                      Issue Token
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Balances Card */}
              <Card title="Asset Balances">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {balances.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm font-semibold text-slate-400 mb-2">
                        NO ASSETS DETECTED
                      </p>
                      <p className="text-xs text-slate-500">
                        Tap 'Sync Data' to refresh
                      </p>
                    </div>
                  ) : (
                    balances.map((b, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50 border border-slate-700/30 hover:border-slate-700/50 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-slate-200">
                            {b.currency || "XRP"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {b.counterparty || "Native"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-mono text-cyan-400">
                            {b.value}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN: OPERATIONS & LOGS */}
            <div className="lg:col-span-2 space-y-6">
              {/* Escrow Operations */}
              <Card title="Escrow Operations">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      id="loanAmt"
                      label="Loan Amount"
                      value={loanAmt}
                      onChange={(e) => setLoanAmt(e.target.value)}
                      placeholder="100"
                    />
                    <InputField
                      id="finishAfter"
                      label="Lock Duration"
                      value={finishAfter}
                      onChange={(e) => setFinishAfter(e.target.value)}
                      placeholder="3600"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-700/30 text-xs text-slate-300 space-y-2">
                    <p className="font-semibold text-slate-200">
                      PROTOCOL FLOW:
                    </p>
                    <p>
                      Issuer sends tokens → Smart Escrow locks funds → Finish
                      condition met (Time) → Funds released to Borrower.
                    </p>
                  </div>

                  <Button
                    onClick={async () => {
                      if (!loanAmt) {
                        alert("Please enter loan amount");
                        return;
                      }
                      if (!finishAfter) {
                        alert("Please enter lock duration");
                        return;
                      }
                      try {
                        await callApi("create-escrow", {
                          seed: issuerSeed,
                          destination: address,
                          amount: loanAmt,
                          currency,
                          finishAfter: parseInt(finishAfter),
                        });
                        alert("Escrow initialized on ledger.");
                        setLoanAmt("");
                        setFinishAfter("");
                      } catch (e) {}
                    }}
                    variant="action"
                    className="w-full"
                  >
                    Initialize Escrow Contract
                  </Button>

                  <Button
                    onClick={async () => {
                      const seq = prompt(
                        "Enter Escrow Sequence # (from logs):",
                      );
                      if (!seq) return;
                      try {
                        await callApi("finish-escrow", {
                          seed,
                          owner: issuerAddress || issuerSeed,
                          offerSequence: parseInt(seq),
                        });
                        alert("Escrow Execution Request Sent.");
                      } catch (e) {}
                    }}
                    variant="secondary"
                    className="w-full"
                  >
                    Execute Finish
                  </Button>
                </div>
              </Card>

              {/* Terminal Log */}
              <Card title="Transaction Log">
                <div className="space-y-0 max-h-96 overflow-y-auto font-mono text-xs">
                  {log.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                      <div className="text-4xl mb-3">⌨</div>
                      <p>Waiting for network activity...</p>
                    </div>
                  ) : (
                    log.map((l, idx) => (
                      <div
                        key={idx}
                        className="border-b border-slate-700/20 py-2 hover:bg-slate-900/30 px-2 transition-colors"
                      >
                        <div className="text-slate-500 mb-1">
                          <span className="text-cyan-400">
                            {new Date(l.ts).toLocaleTimeString()}
                          </span>
                          <span className="text-slate-600"> | </span>
                          <span className="text-emerald-400">
                            BLOCK_SEQ_{1000 + idx}
                          </span>
                        </div>
                        <div className="text-slate-300">
                          <span className="text-emerald-400">➜</span> {l.entry}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Dev Notes */}
              <Card title="Developer Credentials">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Environment
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      Env: <span className="text-cyan-400">VITE_API_BASE</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Faucet
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      <a
                        href="https://xrpl.org/faucet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 underline"
                      >
                        xrpl.org/faucet
                      </a>
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2 pt-4 border-t border-slate-700/30 space-y-3">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Architecture
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      React • Tailwind • XRPL.js • Node
                    </p>
                    <p className="text-xs text-red-400/80 font-semibold">
                      ⚠ Do not use mainnet keys in browser environment.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
