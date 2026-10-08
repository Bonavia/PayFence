# Winner comparison and gap decisions

Reviewed 8 October 2026. This is a product comparison, not a prediction of judging outcomes. Current public implementations may contain work added after their winning submissions. We did not treat today's code as a historical hackathon snapshot or claim to have run competitors' systems.

| Project | Verified result | Evidence inspected | Lesson for PayFence |
| --- | --- | --- | --- |
| MCPay | Cypherpunk 2025 first place, Stablecoins | Organizer project/result pages; public repository README; an actual Next.js MCP route example | Make the payment/assistant interface runnable, explain its complete flow, and provide executable examples. |
| CargoBill | Breakout 2025 first place, Stablecoins | Organizer winner and portfolio pages; product website and platform workflow | Start with a narrow customer and link invoices to a specific operational task. Its product claims were not independently benchmarked. |
| Sudont | Frontier 2026 top-25 winner | Organizer result description of an agent security execution firewall/local RPC | Payment security already has serious competitors. Specify the exact threat and enforced controls instead of claiming novelty from “AI + crypto.” |
| Flovia | Frontier 2026 top-25 winner | Organizer result description of machine-paid API analytics | Expose useful decision evidence. A transaction hash alone does not explain why a payment was allowed. |

## What the build review found

MCPay's current repository describes registry, payment proxy, SDK, and examples. Its inspected Next.js example registers an MCP resource and tool and exports HTTP handlers; the integration is present in code, not only a pitch. We borrowed the lesson of runnable, inspectable integration, not its source code. PayFence now provides a separate local MCP service with tests and an SDK client.

CargoBill's site connects payment requests and transfers to logistics work. It is a stronger customer-specific proposition than a generic stablecoin dashboard. PayFence's proposed initial audience is small agencies and contractor-heavy teams already handling EVM payments. This audience is a hypothesis until interviews establish demand.

Sudont and Flovia show that safety and payment observability are existing categories. PayFence's narrower differentiator is invoice-level evidence: registered recipient, duplicate invoice, per-payment limit, exact approval fingerprint, and human-signed rehearsal. We have not established that this is unique in the market.

## Decisions applied

- Replace the self-payment demo with an approved-invoice rehearsal using its actual recipient and amount.
- Export review and signed rehearsal packets; explain their trust limits.
- Add an MCP interface that shares the review rules and cannot authorize funds.
- Check the audit genesis link; allow retained-head comparison to detect truncation.
- Provide an automated local-chain demonstration and accurate setup instructions.

## Work with the highest remaining value

1. Observe five target users reviewing a changed-recipient invoice. Record consented evidence, completion time, confusion, and willingness to pilot. No interviews have been claimed.
2. Reconcile verified chain receipts into workspace state before calling the product a complete payment system.
3. Replace snapshot export with a properly authenticated per-user MCP connection before claiming a live assistant integration.
4. Reduce wallet prompts and document failure/recovery paths. Do not sacrifice exact authorization or make a mainnet claim to improve the demo.

## Sources

- Result: https://blog.colosseum.com/announcing-the-winners-of-the-solana-breakout-hackathon/
- Result: https://blog.colosseum.com/announcing-the-winners-of-the-solana-cypherpunk-hackathon/
- Result: https://blog.colosseum.com/announcing-the-winners-of-the-solana-frontier-hackathon/
- MCPay project: https://colosseum.com/arena/projects/mcpay
- MCPay repository: https://github.com/microchipgnu/MCPay
- Inspected source: https://github.com/microchipgnu/MCPay/blob/main/examples/chatgpt-apps-sdk-nextjs-starter/app/mcp/route.ts
- CargoBill portfolio: https://colosseum.com/companies/cargobill
- CargoBill product: https://www.cargobill.co/
- CargoBill platform: https://www.cargobill.co/platforms
