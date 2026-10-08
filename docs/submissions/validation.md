# Validation record

Validated 8 October 2026 on Linux with Node 24.19.0 and Yarn 1.22.22. Node 22.13+ remains the declared minimum; this session did not exercise Windows, macOS, a browser wallet extension, or an Alexa device.

| Check | Result |
| --- | --- |
| Yarn Classic install | Passed; Yarn-generated v1 lockfile |
| Frozen offline reinstall | Passed |
| TypeScript compilation | Passed |
| Automated tests | 9 passed, 0 failed |
| D1 initial migration | Passed |
| D1 migration rerun and status | Passed; no pending migration |
| Production build | Passed |
| Automated local-chain evidence | All five scenario checks passed |

`yarn demo:evidence` verifies a blocked recipient before correction, signed-order tampering rejection, invoice replay rejection, stale approval rejection, and the exact recipient token balance. It creates an ephemeral chain and a reproducible fixture file; no public explorer URL or mainnet deployment is implied.

The tests also cover money parsing, duplicate references, payment limits, signature authorization, expiry, cancellation, vendor wallet updates, audit linkage/genesis/truncation, and MCP protocol negotiation/tool calls/origin and host checks. The Ganache native module was unavailable under Node 24 and its documented JavaScript fallback was used successfully.

Automated success does not establish independent contract security, production suitability, customer demand, Alexa certification, or competition eligibility. Video recording and owner disclosures remain necessary.
