# Validation record

Validated 9 October 2026 on Linux with Node 24.19.0 and npm. The current project uses Next.js and automatic local SQLite initialization; no D1 migration, Cloudflare account, or Yarn setup is required. Node 22.13+ is the declared minimum. Windows, macOS, and a human browser wallet extension have not been exercised in this session.

| Check | Result |
| --- | --- |
| Clean npm installation | Passed during the local conversion |
| TypeScript | Passed |
| ESLint | Passed with one existing unused-variable warning in `tests/review.test.mjs` |
| Automated tests | 13 passed, 0 failed |
| Production build | Passed |
| SQLite initialization, persistence, stale-write rejection | Passed |
| Local Host/Origin request boundaries | Passed |
| Automated local-chain scenarios | Five checks passed |
| Actual browser recording | Seven checks passed; no browser errors |
| Sepolia evidence deployment and verification tooling | Passed on an isolated RPC using chain ID 11155111; not public Sepolia proof |
| Mainnet RPC rejection | Passed before signing or transaction submission |

## Browser evidence

The production local app was recorded with Playwright and an automated test wallet connected to an ephemeral Ganache provider on chain 31337. It used a separate sample SQLite database. The recording demonstrates recipient mismatch blocking, restored recipient approval, edit invalidation, reapproval and review packet export, audit verification, contract deployment, EIP-712 signature, exact recipient transfer, receipt/evidence export, and actual MCP SDK calls against the exported snapshot.

Seven assertions passed: changed recipient blocked; edit clears approval; audit verified; transaction confirmed; exact recipient token balance; MCP has only read-only tools; no browser errors. See [evidence](evidence/README.md). Narration is synthetic. No real customer, human wallet interaction, public explorer proof, or real stablecoin transfer is claimed.

`npm run demo:evidence` separately verifies recipient blocking, signed-order tampering rejection, invoice replay rejection, stale approval rejection, and exact recipient balance. These local-chain runs are reproducible and ephemeral. Ganache used its JavaScript fallback under Node 24.

Tests also cover money parsing, duplicate references, limits, signature authorization, expiry, cancellation, vendor wallet updates, audit genesis/linkage/truncation, MCP negotiation/tool calls, storage, and request boundaries. Success does not establish independent contract security or customer demand.

## Remaining checks

- Public Sepolia deployment and verification against an independently checked explorer.
- Actual human browser wallet extension and target desktop platform.
- Customer interviews and pilots.
- Production authentication, receipt reconciliation, and independent contract review before real funds.
