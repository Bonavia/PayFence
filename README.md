# PayFence

A standalone payment-review app built with Next.js, React, and SQLite. Run it in your browser on your own computer. No ChatGPT account, Cloudflare runtime, Docker, or external database is required.

## Run locally

Install **Node.js 22.13 or newer** (Node 24 LTS recommended).

Download and extract the source ZIP, open a terminal in the `PayFence` folder, and run:

```sh
npm ci
npm run dev
```

Open **http://localhost:3000**. Your workspace opens immediately without sign-in. The database and sample records are created automatically on the first request.

To run a production build locally:

```sh
npm run build
npm start
```

The same URL and saved workspace work in both modes. Both servers bind to `127.0.0.1`. To use a different port: `npm run dev -- --port 3002` or `npm start -- --port 3002`.

## What works

- Create vendors and invoices; import invoices from `.txt` or `.json`.
- Detect changed recipients, duplicate references, and amounts exceeding vendor limits.
- Approve exact payment details; edits invalidate the approval.
- Require the existing vendor wallet's signature to change its registered address.
- Simulate payments and keep a hash-linked audit trail.
- Export workspace data, review packets, and audit records.
- Rehearse an approved invoice using wallet-signed mock-token transactions on a local EVM chain or Sepolia.

Dashboard payments remain simulations. Testnet transactions transfer valueless mock tokens and do not mark dashboard invoices paid. This conversion changes how the app runs; it does not add real USDC settlement.

## Try the workflow

1. Open Studio North's flagged invoice and use **Use registered vendor wallet**.
2. Approve the payment, then edit its amount to see the approval cleared.
3. Approve again and download the review packet.
4. Use **Simulate payment**, then open **Audit trail → Verify integrity**.
5. Refresh the browser or restart the server: your changes remain saved.

## Storage and configuration

The app stores one shared local workspace in `.data/payfence.sqlite`. This folder is ignored by Git. No manual migrations or database credentials are needed.

Optional: copy `.env.example` to `.env.local` and change `PAYFENCE_DB_PATH` to use another SQLite file. Relative paths resolve from the project directory. Node's built-in SQLite may print an experimental-feature warning on Node 22; it is used intentionally.

**Testnet lab → Export workspace** downloads a JSON snapshot. **Reset demo** replaces invoices, vendors, and audit records with the original samples. Export anything you want to retain before resetting. For a full database backup, stop the server and copy the `.data` folder.

This app is for use on your computer. It has no multi-user login; all browser tabs share the same workspace. API Host/Origin checks restrict access to localhost. Public hosting needs a separate authentication design.

## Optional testnet rehearsal

In a second terminal:

```sh
npm run chain
```

Add this network to a separate test wallet:

| Setting | Value |
| --- | --- |
| RPC | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency | `ETH` |

Import a test key printed by Ganache. Use these keys only for valueless local testing.

Keep an invoice **Approved**, open **Testnet lab**, select it, deploy test contracts, and click **Rehearse approved invoice**. Confirm registration, minting, allowance, typed-data signature, and execution in your wallet. Download the signed evidence after confirmation. Ganache state disappears on restart, so redeploy afterward. Sepolia (`11155111`) also works with faucet ETH; the interface blocks mainnet.

The lab rechecks the approval before signing and execution. Editing the dashboard cannot revoke an already submitted blockchain transaction.

For a wallet-free automated example:

```sh
npm run demo:evidence
```

## Optional read-only MCP service

The dashboard does not depend on this service. It is retained for clients that want to review an exported snapshot.

```sh
npm run mcp
# In another terminal:
npm run mcp:demo
```

To use an exported workspace instead of samples:

```sh
npm run mcp -- /absolute/path/to/payfence-workspace.json
```

Connect a Streamable HTTP MCP client to `http://127.0.0.1:3001/mcp`. It can review invoices, prepare review packets, and verify audit records; it cannot approve or send payments. Its source is an exported snapshot, not the live dashboard database. Set `PAYFENCE_MCP_PORT` in the shell to change its port.

## Verification

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Tests cover review rules, local persistence, stale-write rejection, request boundaries, audit integrity, contract execution, and the optional MCP service. After changing Solidity, run `npm run contracts:compile` to regenerate the ABI and bytecode.

## Troubleshooting

- **Node cannot find `node:sqlite`:** upgrade to Node 22.13+ and reinstall with `npm ci`.
- **Workspace unavailable:** check that the project directory or configured database directory is writable. Start the server from the project folder.
- **Workspace changed in another tab:** refresh and retry; version checks prevent overwriting a newer change.
- **No approved invoice in the lab:** resolve its failed checks and approve it. A simulated-paid invoice is no longer eligible.
- **Port already in use:** select another port using the commands above.

Contracts remain an unaudited prototype. Limits are per payment, and off-chain approval is not a wallet authorization. The current [Colosseum submission packet](docs/submissions/README.md) includes the readiness checklist, video transcripts, validation record, local evidence, and a [Sepolia deployment guide](docs/submissions/sepolia-guide.md). Other event drafts are retained as historical material.
