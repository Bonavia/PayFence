# PayFence video recording scripts

These are recording scripts, not completed videos. Use the actual built app. Keep sample-data and mock-token labels visible; use no unrelated copyrighted music or footage. Record a wallet rehearsal ahead of time and edit waiting periods honestly. Do not accelerate the recording in a way that implies measured settlement speed.

## Colosseum presentation target two minutes thirty seconds

**0:00–0:25 — problem and audience**

“PayFence is for teams reviewing contractor payments. A vendor name can look familiar even when an invoice's destination wallet has changed. Reviewers also need to know whether the details they approved are still the details being signed.”

**0:25–0:55 — product**

“PayFence checks registered recipients, duplicate invoices, and per-payment limits. Approval is bound to exact invoice details. A change clears approval. Our prototype connects that review to a wallet-signed testnet rehearsal and exports the decision evidence.”

**0:55–1:20 — implementation**

“The workspace is persisted in D1. An EIP-712 contract checks the signed order and prevents invoice replay. MCP tools let an assistant inspect review snapshots without giving it spend authority. These are mock-token demonstrations, not production payments.”

**1:20–1:50 — customer and business hypothesis**

“Our initial hypothesis is contractor-heavy teams already using EVM payments. We plan review-only pilots to learn whether the controls reduce mistakes without slowing approval. Workspace subscriptions are a hypothesis to test.”

[OWNER INPUT: replace planned-validation language only with genuine interview or pilot evidence.]

**1:50–2:30 — differentiation and next steps**

“Payment rails already exist. Our focus is tying an invoice decision to exact authorization and inspectable evidence. Next we need receipt reconciliation, authenticated live MCP access, and user testing.”

[OWNER INPUT: introduce actual founders, experience, motivation, and commitment.]

## Product demo target two minutes forty five seconds

| Time | Screen action | Narration point |
| --- | --- | --- |
| 0:00–0:25 | Open flagged Studio North invoice | Show the requested and registered recipient mismatch. |
| 0:25–0:50 | Restore recipient, approve, then edit amount | Show approval invalidation; do not claim the system identifies all fraud. |
| 0:50–1:10 | Reapprove and download packet | Explain fingerprint and checks; packet is not a payment authorization. |
| 1:10–2:10 | Show previously prepared testnet lab, choose invoice, sign and execute | Point to recipient and amount. Label mock token and actual chain ID. Show receipt and evidence export. |
| 2:10–2:35 | Show `yarn mcp:demo` calling a running server | Show blocked controls and audit verification. State that it reads an exported snapshot. |
| 2:35–2:45 | Show repository and remaining limits | No production funds; no automatic D1 settlement reconciliation. |

For Amazon, lead with the MCP call during the first 30 seconds, then show the human review/signing handoff. Use the local MCP server path, not a claimed Alexa device simulation. Its video must be public, English, on YouTube/Vimeo, and under three minutes.

## Recording preparation

Run `yarn db:migrate`, `yarn dev`, and `yarn chain`. Sign in locally. Approve one invoice and leave it unpaid in dashboard simulation. Deploy the test contracts before the timed recording. In separate terminals run `yarn mcp` and `yarn mcp:demo`. For evidence without a browser wallet, run `yarn demo:evidence`; explain that the resulting chain is ephemeral and not a public deployment.

## Required URLs to fill

- Presentation: [REQUIRED].
- Product demo: [REQUIRED].
- Amazon demo if separately edited: [REQUIRED].
- Reviewer-accessible commit: [REQUIRED].
