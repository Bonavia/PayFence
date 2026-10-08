# PayFence submission preparation

Research checked 8 October 2026. No entry has been submitted. Use the event-specific draft, replace every `[OWNER INPUT]` or `[REQUIRED]` field, and review the current portal before submission. No prize outcome is promised.

| Event | Deadline from organizer | Fit and next gate |
| --- | --- | --- |
| Colosseum Crypto World's Fair | 12 October 2026; confirm cutoff/timezone in dashboard | Closest current product fit. Multi-ecosystem competition; do not claim a Solana deployment. Record pitch and product videos, provide founder and demand evidence, grant judge access. |
| Arc Microgrants | 14 October 2026, 23:59 ET | Not eligible yet: organizer requires working Arc mainnet deployment and public repository. Current code is testnet-only. |
| Amazon Build Ship Shape, Alexa+ | 23 October 2026, 12:00 PDT | MCP implementation added. Record it working; private-repo judge access or public licensed repo, product feedback, and development disclosure remain. |
| Mergetober | PR opened 1–31 October 2026 | Separate Cognee contribution, not a PayFence app submission. Assignment required before coding; AI-generated PRs are prohibited. |

The Colosseum date is date-only on its landing page; do not infer a midnight cutoff. Arc's event calendar spans into October 15, but its explicit submission text gives October 14 at 23:59 ET. These facts are sourced in the linked event pages below.

## Files

- [Winner comparison and gap decisions](winner-review.md)
- [Colosseum field-aligned draft](colosseum.md)
- [Amazon field-aligned draft](amazon.md)
- [Arc and Mergetober gates](other-events.md)
- [Demo and pitch recording scripts](video-scripts.md)
- [Validation record](validation.md)

The public organizer requirements define the field map. Logged-in form-specific character limits, declarations, and any extra questions still need checking at submission time; this is not a claimed copy of an unseen portal form.

## Implemented in this update

1. Yarn Classic 1.22.22, compatible lockfile, D1 migration/status commands, and complete README.
2. Shared review evaluator and hash-bound review packets.
3. Audit genesis validation and optional retained-head verification, with tampering tests.
4. Approved-invoice rehearsal instead of the old unrelated self-payment; stable invoice replay key, freshness checks, signed evidence export.
5. Actual Streamable HTTP MCP server and SDK demo client, with protocol and origin-validation tests.
6. Reproducible local-chain evidence scenario, explicitly labelled as a fixture.

## Remaining product gaps

The testnet workflow still requires several wallet prompts and does not reconcile receipts into D1. The MCP workflow reads exports, not live workspace data, and has no public authenticated service. Production settlement needs token allowlists, authorization roles, wallet/contract review, receipt reconciliation, and operational controls. We should validate demand before building accounting connectors or switching chains for a prize.

## Actions requiring the owner

Record and publish authentic demo/pitch videos; supply team/location/background and truthful traction/funding disclosures; choose the final event tracks; arrange judge access; verify rights/licensing; submit and accept event terms. Changing repository visibility, inviting judges, spending mainnet gas, or signing with a funded wallet has not been done as part of code preparation.

## Official sources

- https://colosseum.com/worldsfair
- https://colosseum.com/hackathon
- https://community.arc.io/public/events/arc-microgrants-f8tijfjhyq
- https://amazonappdev2026.devpost.com/
- https://amazonappdev2026.devpost.com/rules
- https://www.wemakedevs.org/hackathons/mergetober/rules
