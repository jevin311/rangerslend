import { Router } from "express";

const router = Router();

// In-memory balance tracking (for demo purposes)
const balanceTracker: Record<
  string,
  Array<{ currency: string; value: string; counterparty: string }>
> = {};

// In-memory escrow tracking
interface EscrowRecord {
  sequence: number;
  owner: string;
  destination: string;
  amount: string;
  currency: string;
  finishAfter?: number;
  createdAt: string;
}
const escrowTracker: Record<number, EscrowRecord> = {};

// Helper function to get account from seed (simplified)
function getAccountFromSeed(seed: string): string {
  // In real implementation, derive actual address from seed
  // For demo, use a deterministic hash of seed
  const hash = seed.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  return `r${hash}xrpl${seed.slice(-4)}`;
}

// --- XRPL Routes ---

/**
 * POST /did
 * Create a Decentralized Identifier (DID) on the XRPL
 */
router.post("/did", async (req, res) => {
  try {
    const { seed } = req.body;

    if (!seed) {
      return res.status(400).json({ error: "Seed is required" });
    }

    console.log("🔐 DID requested for seed:", seed);
    // TODO: Replace with xrplSdk call later to create actual DID
    const did = `did:xrpl:${seed?.slice(-6) || "XXXXXX"}`;

    res.json({
      result: {
        did,
        seed,
        timestamp: new Date().toISOString(),
        message: "DID created successfully (dummy implementation)",
      },
    });
  } catch (error) {
    console.error("❌ DID Error:", error);
    res.status(500).json({ error: "Failed to create DID" });
  }
});

/**
 * POST /trustline
 * Set a trustline between two accounts
 */
router.post("/trustline", async (req, res) => {
  try {
    const { seed, issuer, currency } = req.body;

    if (!seed || !issuer || !currency) {
      return res
        .status(400)
        .json({ error: "Seed, issuer, and currency are required" });
    }

    console.log("🔗 Trustline request:", {
      seed: seed.slice(-4),
      issuer,
      currency,
    });

    // TODO: Replace with xrplSdk call to set trustline
    res.json({
      result: {
        status: "success",
        currency,
        issuer,
        timestamp: new Date().toISOString(),
        message: "Trustline set successfully (dummy implementation)",
      },
    });
  } catch (error) {
    console.error("❌ Trustline Error:", error);
    res.status(500).json({ error: "Failed to set trustline" });
  }
});

/**
 * POST /issue
 * Issue tokens to a destination account
 */
router.post("/issue", async (req, res) => {
  try {
    const { seed, destination, currency, value } = req.body;

    if (!seed || !destination || !currency || !value) {
      return res.status(400).json({
        error: "Seed, destination, currency, and value are required",
      });
    }

    console.log("💰 Issue token request:", {
      seed: seed.slice(-4),
      destination,
      currency,
      value,
    });

    // Track the issued tokens in memory
    if (!balanceTracker[destination]) {
      balanceTracker[destination] = [];
    }

    // Check if currency already exists for this destination
    const existingBalance = balanceTracker[destination].find(
      (b) => b.currency === currency,
    );

    if (existingBalance) {
      // Update existing balance
      existingBalance.value = String(
        parseFloat(existingBalance.value) + parseFloat(value),
      );
    } else {
      // Add new currency balance
      balanceTracker[destination].push({
        currency,
        value,
        counterparty: "rIssuer123456789012345678901234567",
      });
    }

    // TODO: Replace with xrplSdk call to issue tokens
    res.json({
      result: {
        status: "success",
        destination,
        currency,
        value,
        txHash: `TX${Math.random().toString(36).substring(7).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        message: "Token issued successfully",
      },
    });
  } catch (error) {
    console.error("❌ Issue Error:", error);
    res.status(500).json({ error: "Failed to issue token" });
  }
});

/**
 * POST /create-escrow
 * Create an escrow contract
 */
router.post("/create-escrow", async (req, res) => {
  try {
    const { seed, issuer, destination, amount, currency, finishAfter } =
      req.body;

    if (!destination || !amount || !currency) {
      return res.status(400).json({
        error: "Destination, amount, and currency are required",
      });
    }

    // Use provided issuer address, or try seed as fallback
    const issuerAddress = issuer || getAccountFromSeed(seed || "");
    const parsedAmount = parseFloat(amount);

    if (!issuerAddress) {
      return res.status(400).json({
        error: "Issuer address or seed is required",
      });
    }

    console.log("📦 Escrow creation:", {
      issuerAddress,
      destination,
      amount,
      currency,
      finishAfter,
    });

    // Check if issuer has sufficient balance
    if (!balanceTracker[issuerAddress]) {
      balanceTracker[issuerAddress] = [];
    }

    const issuerBalance = balanceTracker[issuerAddress].find(
      (b) => b.currency === currency,
    );
    const currentBalance = issuerBalance ? parseFloat(issuerBalance.value) : 0;

    if (currentBalance < parsedAmount) {
      return res.status(400).json({
        error: `Insufficient balance. Have ${currentBalance} ${currency}, need ${parsedAmount}`,
      });
    }

    // Deduct amount from issuer's balance
    if (issuerBalance) {
      issuerBalance.value = String(currentBalance - parsedAmount);
    }

    // Create escrow record
    const escrowSeq = Math.floor(Math.random() * 1000000);
    escrowTracker[escrowSeq] = {
      sequence: escrowSeq,
      owner: issuerAddress,
      destination,
      amount: String(parsedAmount),
      currency,
      finishAfter,
      createdAt: new Date().toISOString(),
    };

    console.log(`✓ Escrow ${escrowSeq} created - Locked ${amount} ${currency}`);

    res.json({
      result: {
        status: "success",
        escrowSequence: escrowSeq,
        issuer: issuerAddress,
        destination,
        amount,
        currency,
        finishAfter,
        txHash: `TX${Math.random().toString(36).substring(7).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        message: "Escrow contract initialized - funds locked",
      },
    });
  } catch (error) {
    console.error("❌ Create Escrow Error:", error);
    res.status(500).json({ error: "Failed to create escrow" });
  }
});

/**
 * POST /finish-escrow
 * Execute/finish an escrow contract
 */
router.post("/finish-escrow", async (req, res) => {
  try {
    const { seed, owner, offerSequence } = req.body;

    if (!offerSequence) {
      return res.status(400).json({
        error: "offerSequence is required",
      });
    }

    console.log("✅ Finish escrow request:", {
      offerSequence,
    });

    // Find the escrow record
    const escrow = escrowTracker[offerSequence];
    if (!escrow) {
      return res.status(404).json({
        error: `Escrow ${offerSequence} not found`,
      });
    }

    const { destination, amount, currency } = escrow;

    // Initialize destination balance if not exists
    if (!balanceTracker[destination]) {
      balanceTracker[destination] = [];
    }

    // Add funds to destination
    const destBalance = balanceTracker[destination].find(
      (b) => b.currency === currency,
    );

    if (destBalance) {
      destBalance.value = String(
        parseFloat(destBalance.value) + parseFloat(amount),
      );
    } else {
      balanceTracker[destination].push({
        currency,
        value: amount,
        counterparty: escrow.owner,
      });
    }

    // Remove escrow from tracker
    delete escrowTracker[offerSequence];

    console.log(
      `✓ Escrow ${offerSequence} finished - Released ${amount} ${currency} to ${destination}`,
    );

    res.json({
      result: {
        status: "success",
        escrowSequence: offerSequence,
        owner: escrow.owner,
        destination,
        amount,
        currency,
        txHash: `TX${Math.random().toString(36).substring(7).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        message: "Escrow finished - funds released to destination",
      },
    });
  } catch (error) {
    console.error("❌ Finish Escrow Error:", error);
    res.status(500).json({ error: "Failed to finish escrow" });
  }
});

/**
 * GET /balances/:address
 * Get account balances
 */
router.get("/balances/:address", async (req, res) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    console.log("💳 Balances requested for:", address);

    // Return tracked balances if any exist, otherwise return empty
    const balances = balanceTracker[address] || [];

    // For demonstration, add some initial XRP balance if no balances tracked
    if (balances.length === 0) {
      balances.push({
        currency: "XRP",
        value: "100",
        counterparty: "Native",
      });
    }

    // TODO: Replace with xrplSdk call to fetch actual account balances
    res.json(balances);
  } catch (error) {
    console.error("❌ Balances Error:", error);
    res.status(500).json({ error: "Failed to fetch balances" });
  }
});

export { router as xrplRouter };
