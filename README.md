# PayFence

A contractor-payment review prototype: catch changed recipients, duplicate invoices, and over-limit amounts before a human signs. An MCP interface exposes the same review controls to assistants without giving them payment authority.

## What works

- Authenticated invoice/vendor workspace persisted in Cloudflare D1.
- Invoice import from text or JSON, search, recipient checks, duplicate checks, and per-payment limits.
- Exact-detail approval fingerprints; editing payment details invalidates approval.
- Vendor wallet changes require the currently registered wallet's signature.
- Hash-linked audit history, genesis validation, and downloadable review packets.
- EIP-712 contract enforcing recipient, amount, expiry, cancellation, and replay protection.
- Approved-invoice testnet rehearsal: reads current workspace details, rechecks approval before signing and execution, transfers **mock tokens to the invoice recipient**, and exports signed evidence.
- A local Streamable HTTP MCP server with `review_queue`, `prepare_review_packet`, and `verify_audit` tools.

**Boundaries:** dashboard payments are simulations. Testnet rehearsals are separate mock-token transactions and do not mark dashboard invoices paid. MCP reads exported snapshots, not live D1, and cannot approve or pay. No production USDC, Arc deployment, Solana integration, Alexa certification, customer traction, or independent security audit is claimed.

## Complete local setup

### 1. Install

Requires **Node.js 22.13+**, **Yarn Classic 1.22.22**, and Git. Node 22 LTS is recommended. A browser wallet is needed only for manual testnet rehearsals.

```sh
git clone https://github.com/Bonavia/PayFence.git
cd PayFence
npm install -g yarn@1.22.22
yarn --version
yarn install --frozen-lockfile
```

Use an authorized GitHub account if the repository is private. If Corepack already manages Yarn, use `corepack enable` instead of overwriting its shim; this repository pins Yarn 1.22.22. Do not install over the shim with `--force`.

For an existing Yarn 4 checkout: stop the dev server, pull changes, remove `node_modules`, then reinstall. On PowerShell: `Remove-Item -Recurse -Force node_modules`. On macOS/Linux: `rm -rf node_modules`. Keep the new committed `yarn.lock`. Yarn 1 uses `--frozen-lockfile`, not `--immutable`.

### 2. Create the database

```sh
yarn db:migrate
yarn db:status
```

Accept the local migration prompt if shown. Repeating migration skips previously applied SQL.

| Item | Configuration |
| --- | --- |
| Database | Cloudflare D1, emulated locally with SQLite |
| App binding | `DB` in `.openai/hosting.json` and `vite.config.ts` |
| Migration CLI | `wrangler.local.jsonc`; placeholder ID matches the app |
| Schema | `db/schema.ts` |
| SQL migrations | `drizzle/` |
| Local data | `.wrangler/state/`, ignored by Git |
| Seed | Sample invoices/vendors created on first authenticated request |

No PostgreSQL, MySQL, Docker, paid account, or database connection string is required. One workspace is stored per authenticated identity, with a version for concurrent-write checks.

### 3. Run and sign in

```sh
yarn dev
```

Open **http://localhost:5173** and click **Sign in**, or open **http://localhost:5173/signin-with-chatgpt?return_to=/**.

A clean clone uses the portable profile. Its development-only middleware creates `seedy@sites.test` for loopback requests; no real ChatGPT login is required. Use `localhost` consistently so the cookie matches. The stub is absent from production builds; managed Sites supplies platform authentication. Do not expose the development server publicly.

### 4. Walk through the product

1. Open Studio North's flagged invoice and inspect the mismatched wallet.
2. Restore the registered recipient and approve the demo payment.
3. Edit the amount. Approval is cleared; approve the updated details again.
4. Download its review packet using the download button. View and verify the audit trail.
5. Use **Simulate payment** for the dashboard simulation, or leave it **Approved** for the testnet rehearsal below.

## Environment settings

**No `.env` file or secrets are required for the local dashboard.** D1 is a Worker binding, so there is no `DATABASE_URL`. Browser-wallet signing keeps private keys out of the app server.

- `.openai/hosting.json`: existing Sites identity and logical D1 binding.
- `vite.config.ts`: local Worker and dev-sign-in configuration.
- `wrangler.local.jsonc`: local database tooling only; never deploy its placeholder ID.
- `.sites-runtime/execution-profile.json`: optional ignored runtime selection. Missing means portable; do not copy a managed profile to your machine.
- `PAYFENCE_MCP_PORT`: optional MCP port, default `3001`. The MCP service binds only to `127.0.0.1`.

## Database changes and reset

```sh
yarn db:generate
yarn db:migrate
```

Generate after editing `db/schema.ts`; review and commit generated SQL and Drizzle metadata. Generation alone does not apply a migration.

**Reset demo** replaces only the current workspace. To erase all local D1 data, stop the server, export anything needed, delete `.wrangler/state/v3/d1`, then migrate and restart. This is destructive to local data. Local database commands never target a remote database.

## Optional: invoice rehearsal with a wallet

Keep the app running and start another terminal:

```sh
yarn chain
```

Add a network to a separate test wallet: RPC `http://127.0.0.1:8545`, chain ID `31337`, currency `ETH`. Import a test key printed by Ganache. Never reuse or fund these keys with real assets.

In **Testnet lab**, choose an approved invoice, deploy test contracts, then click **Rehearse approved invoice**. Confirm vendor registration, mock-token mint, exact allowance, typed-data signature, and execution in your wallet. The sample recipient addresses need no keys to receive valueless mock tokens. To inspect a recipient balance in your own wallet, create a vendor using a second test account and an invoice for it.

The lab checks the live workspace before signing and execution. It uses a stable invoice ID to prevent replay within the same contract. If vendor wallet/limit settings changed, deploy fresh contracts. A transaction already signed or submitted cannot be revoked merely by editing the dashboard; this is a rehearsal, not synchronized production settlement.

Download the signed evidence packet after confirmation. Ganache state disappears on restart; redeploy after restarting. Sepolia (`11155111`) is also supported and requires faucet ETH. Mainnet is blocked by the interface. The deployed token is always a valueless MockUSDC.

For a wallet-free reproducible demonstration:

```sh
yarn demo:evidence
```

This starts an ephemeral in-memory chain, runs the invoice scenario, checks tampering/replay/stale-approval rejection and recipient balance, then writes `outputs/demo-evidence.json`. It is explicitly a generated fixture, not a customer payment or a public deployment.

## Optional: MCP review tools

```sh
# Terminal 1: sample workspace
 yarn mcp
# Terminal 2: real SDK client calling all three tools
 yarn mcp:demo
```

To review your exported workspace, use **Testnet lab → Export workspace**, then:

```sh
yarn mcp /absolute/path/to/payfence-workspace.json
yarn mcp:demo demo-001
```

Replace `demo-001` with an invoice ID in your export. On Windows, quote a path such as `"C:\Users\you\Downloads\payfence-workspace.json"`.

Connect a Streamable HTTP-capable MCP client to `http://127.0.0.1:3001/mcp`. The SDK supports protocol `2025-11-25`; integration tests verify that version explicitly. The file is re-read for each tool call, but it remains a snapshot until you export again. Malformed files fail startup. No LLM/API key is needed for the SDK demonstration; an assistant client supplies its own model.

This service is local-only and has no payment tools. Public hosting requires a separately designed authenticated deployment; do not proxy the unauthenticated local listener onto the Internet. Alexa+ device integration has not been tested.

## Tests and build

```sh
yarn tsc --noEmit
yarn test
yarn build
```

Tests include business rules, contract execution, review evidence, audit tampering, and MCP HTTP integration. No wallet, running database, or external RPC is required. Ganache can fall back to JavaScript if its native module is unavailable.

```sh
# CI
yarn install:ci
yarn tsc --noEmit
yarn test
yarn build
```

After Solidity edits, run `yarn contracts:compile` and commit the ABI/bytecode. `yarn build` writes `dist/`. `yarn start` runs the built Worker locally at Wrangler's default `http://127.0.0.1:8787`; it does **not** provide development sign-in. Use `yarn dev` for the full local walkthrough.

## Hosting

The existing hosted target is Sites, which must provision D1 as `DB`, apply migrations, and supply trusted identity headers. GitHub uploads do not deploy the app or initialize remote D1. A standalone Cloudflare deployment still needs a real D1 resource, deployment configuration, remote migrations, and secure authentication. The local placeholder is not deployment-ready.

## Troubleshooting

- **No such table / workspace unavailable:** run `yarn db:migrate`, then reload. Use the same project directory for dev and migration commands.
- **Sign-in required:** use the local sign-in URL and the same hostname; start with `yarn dev`.
- **Wrong Yarn version:** check inside the repository; enable Corepack or install Yarn 1.22.22.
- **Port busy:** use `yarn dev --port 5174`; update the sign-in URL too.
- **No approved invoice in the lab:** resolve controls and approve; a simulated-paid invoice is no longer eligible.
- **Invoice changed during signing:** return to review and approve current details. Do not retry an obsolete signature.
- **Already consumed:** that invoice executed or was cancelled in this test contract; do not pay it twice.
- **MCP connection refused:** start `yarn mcp` first. `/mcp` supports POST; a browser GET is not a health check.
- **Workspace changed in another tab:** refresh; version checks prevent silent overwrites.

## Submission materials

Start at [docs/submissions/README.md](docs/submissions/README.md). It links verified requirements, competitor analysis, event-specific drafts, video scripts, and remaining submission gates. These are preparation documents, not submitted entries or prize guarantees.

## Security boundaries

Unaudited prototype; never use for real funds. Vendor registration is a payer trust decision. Limits are per payment, not aggregate budgets. Production needs token policies, authorization roles, reconciliation, monitoring, and independent review. Off-chain approval is not a wallet authorization. Hash chains detect changed records against retained evidence but cannot prevent wholesale rewriting by an administrator. MCP uses snapshots and exposes no signing capability.
