# xRangerLend - XRPL Lending Protocol

A modern, professional web application for managing decentralized lending operations on the XRP Ledger (XRPL). xRangerLend provides an intuitive interface for creating DIDs, managing trustlines, issuing tokens, and executing escrow contracts on the XRPL testnet.

**Version:** 0.9 | **Network:** XRPL Testnet | **Status:** Active Development

---

## 🎯 Overview

xRangerLend is a full-stack lending protocol built on the XRP Ledger. It enables users to:

- Create and manage Decentralized Identifiers (DIDs)
- Set up trustlines between accounts
- Issue custom tokens
- Create and execute smart escrow contracts
- Monitor account balances and transaction history in real-time

The application features a sleek, modern UI with real-time transaction logging, comprehensive error handling, and a responsive design that works across all devices.

---

## ✨ Features

### Account Management

- **DID Creation** - Generate decentralized identifiers on the XRPL
- **Account Identity** - Manage account seeds and addresses
- **Real-time Sync** - Fetch and display current account balances

### Token Operations

- **Trustline Management** - Establish trust between accounts for token transfers
- **Token Issuance** - Issue custom tokens to designated accounts
- **Currency Support** - Support for RLUSD and other XRPL currencies

### Escrow Contracts

- **Escrow Creation** - Initialize smart escrow contracts with customizable parameters
- **Lock Duration** - Set time-based conditions for fund release
- **Escrow Execution** - Complete escrow contracts when conditions are met
- **Secure Protocol** - Implements XRPL-native security mechanisms

### Developer Experience

- **Transaction Log** - Real-time logging of all API calls and responses
- **Error Handling** - Comprehensive error messages and status tracking
- **Developer Credentials** - Quick reference for API configuration and faucet access
- **Network Display** - Shows connected XRPL node information

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 10.14.0+ (or npm/yarn)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/xrangerlend.git
cd xrangerlend

# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```

The application will be available at `http://localhost:3000` (or the port shown in your terminal).

### Development

```bash
# Run type checking
pnpm typecheck

# Build for production
pnpm run build

# Start production server
pnpm start

# Format code
pnpm run format.fix
```

---

## 📁 Project Structure

```
xrangerlend/
├── client/                          # Frontend React application
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components (pre-configured)
│   │   └── xrpl/                   # Custom XRPL components
│   │       ├── BackgroundGrid.tsx  # Animated background grid
│   │       ├── Button.tsx          # Custom button variants (primary, secondary, action)
│   │       ├── Card.tsx            # Reusable card container
│   │       ├── InputField.tsx      # Form input with label
│   │       └── StatusBadge.tsx     # Status indicator component
│   ├── pages/
│   │   ├── Index.tsx               # Main application page
│   │   └── NotFound.tsx            # 404 page
│   ├── hooks/
│   │   └── use-mobile.tsx          # Mobile detection hook
│   ├── lib/
│   │   └── utils.ts                # Utility functions
│   ├── App.tsx                     # Main app wrapper with routing
│   └── global.css                  # Global styles and CSS variables
│
├── server/                          # Express backend
│   ├── index.ts                    # Main server configuration
│   ├── node-build.ts               # Production build entry point
│   └── routes/
│       ├── demo.ts                 # Example demo route
│       └── xrpl.ts                 # XRPL API routes
│
├── shared/                          # Shared types and utilities
│
├── public/                          # Static assets
│
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite client build config
├── vite.config.server.ts           # Vite server build config
├── postcss.config.js               # PostCSS configuration
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

---

## 🔌 API Endpoints

All endpoints use relative paths and support JSON request/response bodies.

### DID Operations

**`POST /did`**
Create a Decentralized Identifier on the XRPL.

```json
Request:
{
  "seed": "sn3OxYr8QLWrZNZmxZCHMqDi..."
}

Response:
{
  "result": {
    "did": "did:xrpl:d4OxYr",
    "seed": "sn3OxYr8QLWrZNZmxZCHMqDi...",
    "timestamp": "2024-01-08T08:00:00.000Z",
    "message": "DID created successfully"
  }
}
```

### Trustline Management

**`POST /trustline`**
Establish a trustline between two accounts for token transfers.

```json
Request:
{
  "seed": "sn3OxYr8QLWrZNZmxZCHMqDi...",
  "issuer": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
  "currency": "RLUSD"
}

Response:
{
  "result": {
    "status": "success",
    "currency": "RLUSD",
    "issuer": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
    "timestamp": "2024-01-08T08:00:00.000Z"
  }
}
```

### Token Issuance

**`POST /issue`**
Issue tokens to a destination account.

```json
Request:
{
  "seed": "sn3OxYr8QLWrZNZmxZCHMqDi...",
  "destination": "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1",
  "currency": "RLUSD",
  "value": "100"
}

Response:
{
  "result": {
    "status": "success",
    "destination": "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1",
    "currency": "RLUSD",
    "value": "100",
    "txHash": "TXa1b2c3d4e5f...",
    "timestamp": "2024-01-08T08:00:00.000Z"
  }
}
```

### Escrow Operations

**`POST /create-escrow`**
Initialize a smart escrow contract with time-based conditions.

```json
Request:
{
  "seed": "sn3OxYr8QLWrZNZmxZCHMqDi...",
  "destination": "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1",
  "amount": "100",
  "currency": "RLUSD",
  "finishAfter": 3600
}

Response:
{
  "result": {
    "status": "success",
    "escrowSequence": 12345,
    "destination": "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1",
    "amount": "100",
    "currency": "RLUSD",
    "finishAfter": 3600,
    "txHash": "TXa1b2c3d4e5f...",
    "timestamp": "2024-01-08T08:00:00.000Z"
  }
}
```

**`POST /finish-escrow`**
Execute/complete an escrow contract.

```json
Request:
{
  "seed": "sn3OxYr8QLWrZNZmxZCHMqDi...",
  "owner": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
  "offerSequence": 12345
}

Response:
{
  "result": {
    "status": "success",
    "owner": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
    "offerSequence": 12345,
    "txHash": "TXa1b2c3d4e5f...",
    "timestamp": "2024-01-08T08:00:00.000Z"
  }
}
```

### Account Balances

**`GET /balances/:address`**
Retrieve all token balances for a given account address.

```
Request:
GET /balances/rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1

Response:
[
  {
    "currency": "RLUSD",
    "value": "1000",
    "counterparty": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
  },
  {
    "currency": "XRP",
    "value": "50",
    "counterparty": "Native"
  }
]
```

---

## 🏗️ Architecture

### Frontend Stack

- **React 18** - UI framework with hooks and functional components
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing
- **shadcn/ui** - Pre-built, accessible UI components
- **TypeScript** - Type-safe JavaScript

### Backend Stack

- **Express.js** - Web framework for Node.js
- **CORS** - Cross-origin resource sharing middleware
- **TypeScript** - Type-safe backend code

### Key Design Patterns

**Component Architecture:**

- Modular, reusable UI components in `client/components/xrpl/`
- shadcn/ui integration for complex components
- Custom Button variants (primary, secondary, action) with visual feedback

**State Management:**

- React hooks (useState, useEffect) for component state
- Props-based data flow for simplicity
- Axios for async API communication

**Error Handling:**

- Try-catch blocks around API calls
- User-friendly error messages
- Real-time error logging in transaction log

**Styling:**

- Tailwind CSS for responsive, modern design
- HSL-based CSS variables for theming
- Dark mode theme optimized for XRPL aesthetic
- Glassmorphism effects with backdrop blur

---

## 💻 Usage Guide

### 1. Creating a DID

1. Enter your account seed in the **Account Identity** section
2. Click **Init DID** button
3. Check the **Transaction Log** for confirmation
4. View the created DID in the alert popup

### 2. Setting Up Trustlines

1. Enter the issuer's information in the **Token Issuer** section
2. Specify the currency code (e.g., "RLUSD")
3. Click **Trust Set** button
4. Confirm the trustline in the transaction log

### 3. Issuing Tokens

1. Fill in the **Token Issuer** fields with issuer seed
2. Enter the destination address in **Account Identity**
3. Click **Issue Token** button
4. Monitor the **Transaction Log** for the transaction hash

### 4. Creating Escrow Contracts

1. Go to **Escrow Operations** section
2. Enter the **Loan Amount** (e.g., 100)
3. Set the **Lock Duration** in seconds (e.g., 3600 for 1 hour)
4. Click **Initialize Escrow Contract**
5. Note the escrow sequence number from the response

### 5. Executing Escrow

1. When time condition is met, click **Execute Finish**
2. Enter the escrow sequence number when prompted
3. Confirm the execution in the transaction log

### 6. Monitoring Balances

1. Enter an account address in **Account Identity**
2. Click **Sync Data** button
3. View all token balances in the **Asset Balances** card
4. Balances update automatically after token operations

---

## 🔐 Security Considerations

⚠️ **IMPORTANT:** This application is designed for **testnet use only**.

### Security Best Practices

1. **Never use mainnet keys** - Always use testnet seeds and addresses
2. **Secure seed storage** - Never share your seed in production
3. **Environment variables** - Use VITE_API_BASE for backend configuration
4. **Timeout protection** - API calls have 45-second timeout
5. **Input validation** - All endpoints validate required fields
6. **Error isolation** - Sensitive error details are logged but not exposed to users

### Accessing Testnet Funds

Get free XRP for testing:

1. Visit [xrpl.org/faucet](https://xrpl.org/faucet)
2. Generate or use an existing testnet account
3. Request funds (typically 100 XRP per request)
4. Use the address in the application

---

## 🛠️ Development Guide

### Adding New Features

1. **Create new components** in `client/components/xrpl/` following existing patterns
2. **Add API routes** in `server/routes/xrpl.ts` with proper validation
3. **Use TypeScript** for type safety across frontend and backend
4. **Test thoroughly** with various inputs and error conditions
5. **Update the transaction log** with meaningful messages for user feedback

### Integrating Real XRPL SDK

Replace dummy implementations in `server/routes/xrpl.ts`:

```typescript
import { Client, Wallet } from "xrpl";

const client = new Client("wss://testnet.xrpl-py.xrplcluster.com");

router.post("/did", async (req, res) => {
  try {
    const { seed } = req.body;
    const wallet = Wallet.fromSeed(seed);

    // Replace with actual xrplSdk call
    // const result = await createDID(wallet);

    res.json({ result: { did: wallet.address } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Code Quality

```bash
# Type checking
pnpm typecheck

# Format code
pnpm run format.fix

# Run tests (when available)
pnpm test
```

---

## 📦 Dependencies

### Key Production Dependencies

- `react@^18.3.1` - UI framework
- `express@^5.1.0` - Backend framework
- `axios@^1.13.2` - HTTP client
- `tailwindcss@^3.4.17` - CSS framework
- `react-router-dom@^6.30.1` - Routing
- `@radix-ui/*` - Accessible components

### Development Dependencies

- `typescript@^5.9.2` - Type checking
- `vite@^7.1.2` - Build tool
- `tailwindcss` - CSS processing
- `postcss` - CSS transformations

See `package.json` for complete dependency list.

---

## 🚀 Deployment

### Building for Production

```bash
# Build both client and server
pnpm run build

# Or build separately
pnpm run build:client  # Output: dist/spa/
pnpm run build:server  # Output: dist/server/
```

### Running Production Server

```bash
pnpm start
```

The server will listen on the PORT environment variable (default: 3000).

### Environment Variables

```bash
# API Base (if backend on different URL)
VITE_API_BASE=https://api.yourdomain.com

# Server Port
PORT=3000

# Custom ping message (optional)
PING_MESSAGE=pong
```

---

## 📊 Performance

- **Fast Build Times**: Vite provides near-instant reload during development
- **Optimized Bundle**: Tree-shaking and code splitting included
- **Responsive UI**: CSS Grid for layout, transitions for smooth animations
- **Efficient State Management**: Minimal re-renders with React hooks
- **Network Efficiency**: Single axios instance with 45-second timeout

---

## 🔄 Future Enhancements

- [ ] Full xrplSdk integration for real ledger operations
- [ ] Multi-signature wallet support
- [ ] Transaction history visualization with charts
- [ ] Advanced escrow conditions (conditional, oracle-based)
- [ ] Token swap functionality
- [ ] WebSocket real-time balance updates
- [ ] Mobile app version (React Native)
- [ ] Mainnet support with confirmation warnings
- [ ] Ledger hardware wallet integration
- [ ] Transaction templates and presets

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:

- Code follows existing style conventions
- TypeScript types are properly defined
- Components follow established patterns
- Commit messages are clear and descriptive

---

## 🐛 Troubleshooting

### "Unable to input numbers in escrow fields"

**Solution:** The input fields should now properly accept and store values. Make sure to use the latest version.

### "Error: timeout of 45000ms exceeded"

**Solution:**

- Check if backend server is running
- Verify API_BASE configuration
- Check network connectivity
- Try increasing timeout in `client/pages/Index.tsx` line 37

### "Cannot read property 'value' of null"

**Solution:**

- Ensure input fields have proper state management
- Check that IDs match between InputField and usage

### "Transaction Log not showing updates"

**Solution:**

- Check browser console for errors
- Verify API responses are being received
- Clear browser cache if needed

---

## 📚 Resources

- **XRPL Documentation**: https://xrpl.org/
- **XRPL Testnet Faucet**: https://xrpl.org/faucet
- **React Documentation**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Express.js**: https://expressjs.com/

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📧 Contact & Support

- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: [Your contact email]
- **Twitter**: [@YourHandle]

---

## 🙏 Acknowledgments

- XRP Ledger Foundation for XRPL resources
- React team for the amazing framework
- Tailwind CSS for utility-first styling
- shadcn/ui for beautiful components
- All contributors and testers

---

**Made with ❤️ for the XRPL community**

Last Updated: January 2024 | Version 0.9
