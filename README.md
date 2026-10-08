# PayFence

A hackathon prototype for safer contractor payments: catch changed recipients, duplicate invoices, and over-limit payments before approving them.

## What works

- Private, durable invoice and vendor workspace using authenticated user identity and Cloudflare D1.
- Text/JSON invoice import, search, filtering, registered recipient checks and per-payment limits.
- Exact-detail approval fingerprints; editing payment details invalidates approval.
- Vendor wallet changes verified against the currently registered wallet's signature.
- Hash-linked audit history and JSON exports.
- EIP-712 payment contract with recipient checks, limits, expiry, cancellation and invoice replay protection.
- Testnet lab deploys a valueless mock token and contract, then signs and executes an actual test transaction.

The invoice workspace uses simulated payments. The separate contract lab demonstrates on-chain execution; it is not connected to invoice approvals. No production payments, real USDC, multisig review, OCR, accounting integrations or independent audit notarization are claimed.

## Run

Requires Node 22.13+ and Yarn 4.18.0. Enable Corepack with `corepack enable` (install Corepack first with `npm install -g corepack` if unavailable). Install with `yarn install`, run `yarn dev`, typecheck with `yarn tsc --noEmit`, build with `yarn build`. For CI, use `yarn install --immutable` or `yarn install:ci`. The authenticated workspace requires the Sites runtime and D1 binding `DB`; it intentionally does not bypass authentication on localhost. Database schema is in `db/schema.ts`; migrations are in `drizzle/`.

Run `yarn test` for local, in-memory blockchain tests and invoice checks. Run `yarn contracts:compile` after changing Solidity source. Tests require no wallet, network or funds. Ganache may print a native-module warning and use its JavaScript fallback.

For a browser wallet test, start `yarn chain`, add localhost RPC on chain ID 31337, and import one of the local-only generated test keys into a separate test wallet. Deploy and run from Testnet lab. Never reuse those keys or send real funds to them. Sepolia (11155111) is also permitted but requires faucet ETH. This UI rejects all other chain IDs. The Solidity contract itself is chain agnostic.

## Demo story

1. Open the flagged Studio North invoice; see that its requested wallet differs from the registry.
2. Restore its registered wallet, approve the demo payment, then edit the amount. The approval disappears.
3. Approve again and simulate payment. Inspect the audit history and export it.
4. In the local testnet lab, deploy contracts and execute a wallet-signed test payment.
5. Run the automated contract test to demonstrate rejection of tampering, unauthorized signatures, replay, expiry, cancellation and stale vendor wallets.

## Security boundaries

This is unaudited prototype code, not a service for real funds. First-time vendor registration is a payer trust decision. Limits are per payment, not cumulative. A payer signature authorizes its exact token address and units; production would need approved token policies. Duplicate protection uses invoice IDs on-chain and vendor/reference pairs in the demo. Off-chain approvals are not wallet authorizations. Hash chains detect altered entries against a retained trusted hash, but cannot prevent an administrator from rewriting the entire history. Concurrent workspace writes use a compare-and-swap version check. Workspace data is segregated by the platform-authenticated user.

## Structure

- `app/page.tsx`: review dashboard, vendors and audit UI
- `app/api/workspace/route.ts`: authenticated workspace operations
- `lib/model.ts`, `lib/store.ts`: validation, fingerprints and persistent state
- `components/chain-panel.tsx`: wallet-driven testnet lab
- `contracts/`: payment executor and test token
- `tests/`: local contract and business-rule tests

Hackathon eligibility, chain requirements and reuse rules must be checked for each submission. This repository is not a submitted entry and does not guarantee a prize.
