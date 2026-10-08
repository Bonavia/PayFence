# Colosseum Crypto Worlds Fair submission draft

Field map: https://colosseum.com/hackathon (submission FAQ). Event: https://colosseum.com/worldsfair. Deadline: 12 October 2026; verify exact portal cutoff. Confirm any extra fields and limits in the authenticated portal.

## Product name

PayFence

## Brief description

PayFence helps contractor-heavy teams catch changed recipients, duplicate invoices, and over-limit payments before signing. It connects invoice review to a mock-token EVM rehearsal and exports the checks, approval fingerprint, signed order, and transaction evidence. Assistants can inspect review snapshots through MCP without authority to approve or pay.

## Blockchains and tools integrated

EVM Solidity contract; local chain 31337 and Ethereum Sepolia support; ethers; React and TypeScript; Vinext/Vite; Cloudflare D1; MCP Streamable HTTP; Yarn 1. The automated evidence scenario runs on ephemeral Ganache. No public-chain deployment address or transaction is claimed without an independently verifiable link. No Solana or Arc integration is claimed.

## Problem and product insight

An invoice can retain a familiar vendor name while its destination wallet changes. A reviewer can also approve one set of details and unknowingly act on a later revision. PayFence keeps the approved details explicit and checks recipient identity, duplicates, and limits before a test transaction. Its contract independently enforces the signed recipient and amount, expiry, and one-time invoice consumption.

This is a control layer for a narrow workflow. It is not a replacement for accounting, a fraud guarantee, or an autonomous treasury.

## Product and execution

The browser stores each signed-in user's workspace in D1. Reviewing an invoice creates a fingerprint; changes invalidate approval. In the testnet lab, a human chooses an approved invoice, deploys mock contracts, and signs its exact order. The app rechecks the workspace before signing and sending. Signed evidence can be downloaded. Dashboard simulation state and the testnet receipt remain separate.

The MCP service exposes three read-only review capabilities against an exported snapshot: inspect the queue, prepare a review packet, and verify audit integrity. It never requests a private key or payment authorization.

## Team members and backgrounds

[OWNER INPUT: all actual team members, role, profile URL, relevant experience, and individual contribution. Do not infer identity from repository ownership or reuse a resume without confirmation.]

## Team location

[OWNER INPUT: actual location of each team member.]

## Product graphic

Repository asset: `public/favicon.svg`, an existing PayFence shield mark. Check required dimensions/file format in the portal and confirm rights to all included assets. Do not claim a new logo was created in this update.

## Repository and reviewer access

https://github.com/Bonavia/PayFence

[REQUIRED: ensure reviewers can access the selected commit. The organizer allows a private repository when review access is granted to hackathon@colosseum.com. Access has not been granted in this task.]

## Presentation video

[REQUIRED: public or otherwise judge-accessible link to a two-to-three-minute presentation. Script: video-scripts.md.]

## Product demonstration video

[REQUIRED: judge-accessible product video of at most three minutes. Show functioning controls and the actual test transaction; label mock tokens and snapshots.]

## Go to market and distribution

Initial customer hypothesis: small agencies and contractor-heavy teams already using EVM stablecoins. Proposed entry point: a review-only pilot using redacted invoices and test wallets, distributed through agency operations communities and direct founder-led outreach. Interview targets should be users responsible for approving payments, not only developers.

Proposed pilot success measures: changed-recipient detection, duplicate rejection, review completion time, and whether a team returns for another payment cycle. These are planned measurements, not achieved results. A subscription per workspace is a pricing hypothesis; test willingness to pay before setting prices or forecasting revenue.

## Demand validation and traction

No verified customer interviews, users, revenue, paid volume, pilots, or letters of intent are supplied in this repository. [OWNER INPUT: add only real evidence with dates, permission to cite, and a precise distinction between interviews, active use, and paid use.]

## Market and competitors

The initial market is contractor-payment operations for teams already using crypto. Size remains unvalidated; no top-down market-size figure is asserted. Existing alternatives include manual wallet checks, accounting workflows, payment infrastructure, and agent-security products. See winner-review.md for sourced comparisons. The proposed advantage is the link between invoice controls and portable evidence, not settlement speed alone.

## Development history and funding

Repository history records the initial PayFence upload and package-manager changes. This update adds review evidence, MCP, invoice rehearsal, and validation/documentation. Some framework/UI scaffolding predates the product. [OWNER INPUT: confirm actual product start date, team contributions, any prior submissions, outside capital, and development before the event window. Preserve commit history; do not backdate work.]

## Roadmap and commitment

Next product priorities: receipt reconciliation, authenticated live MCP access, usability testing, and independently reviewed production controls. [OWNER INPUT: genuine founder commitment, availability, and accelerator interest.]
