# PayFence — Crypto World's Fair submission packet

Updated 9 October 2026 for the `standalone-local` branch. Technical/product copy below describes the actual prototype. The founder's personal answers remain pending by owner choice and must be written personally before submission. No entry has been submitted.

Deadline: 12 October 2026, 11:59 p.m. Pacific (13 October, 1:59 a.m. America/Chicago). Recheck the authenticated portal for changes, exact questions, and character limits.

## Product name

PayFence

## Brief description

PayFence helps teams review contractor invoices before signing an EVM payment. It checks the registered recipient, duplicate invoice references, and per-payment limits, invalidates approval when details change, and connects approved invoices to signed mock-token rehearsals with exportable decision evidence.

## Audience and first use case

Our initial customer hypothesis is small agencies and contractor-heavy teams already handling EVM stablecoin payments. The first workflow is one payment reviewer checking one contractor invoice before signing. We are testing whether exact-detail approval and clear exceptions make that task more reliable without unnecessary review work. This is a target-customer hypothesis, not demonstrated demand.

## Product insight — technical thesis, not a personal founder story

Recognizing a vendor name is not the same as authorizing the destination and amount on an invoice. The details reviewed off-chain can also change before signing. PayFence makes the registered recipient and payment constraints visible, fingerprints the approved invoice revision, and carries the payment fields into an EIP-712 order checked by a contract. Its proposed differentiator is the connection between invoice review, exact authorization, and portable decision evidence. We have not established market uniqueness or a fraud-prevention guarantee.

## Current implementation and integrated tools

Next.js, React, TypeScript, npm, Node's built-in SQLite, ethers, Solidity, Ganache, and the MCP SDK. The app runs locally with one shared workspace and no ChatGPT account or Cloudflare runtime. It supports local EVM chain 31337 and Ethereum Sepolia 11155111 for mock-token rehearsals. A public Sepolia deployment and explorer evidence have not yet been supplied.

The Solidity contract checks recipient, per-payment limit, payer signature, expiry, and one-time invoice consumption. Vendor wallet changes require the existing vendor wallet's signature. Signature domain separation includes chain and contract. Read-only MCP tools review exported snapshots; they cannot approve or spend.

## What the demo proves

1. A sample invoice with a mismatched wallet is blocked.
2. Restoring the registered recipient allows exact-detail approval.
3. Editing the amount clears approval; the revised invoice needs a new review.
4. A real local EVM contract transfers valueless mock tokens to the invoice recipient using a signed order.
5. Review, signed-order, receipt, and audit evidence can be exported.
6. The optional MCP service exposes review tools against an exported snapshot.

The recorded test wallet is automated and connected to an ephemeral local chain. This is not a recording of a human wallet-extension confirmation or a public-chain transaction. Dashboard simulations, testnet receipts, and exported snapshots remain distinct; blockchain receipts are not automatically reconciled into dashboard status.

## Business and distribution hypothesis

Start with direct outreach to agency owners and finance/operations reviewers already paying contractors in crypto. Ask to observe their present approval workflow and test PayFence with redacted invoices and valueless test tokens. Recruit a small first cohort before adding integrations or chains.

Potential revenue is a subscription per workspace for payment-review controls and evidence exports. Pricing, willingness to pay, acquisition cost, retention, and market size are unvalidated. No revenue projection is claimed. A bottom-up market estimate needs evidence on the number of reachable teams, payment-review frequency, and a tested price.

## Demand validation, funding, and prior submissions

Owner confirmed on 9 October 2026: no customer interviews, users, revenue, outside funding, or prior submissions. Treat this as owner-supplied disclosure, not independently verified due diligence. Sample invoices and automated scenarios are not traction.

Next validation: observe five actual payment reviewers, then seek up to ten willing pilot teams. Measure review completion, missed exceptions, time, repeated use, and willingness to pay. These are planned activities; no interviews or pilots have been conducted as part of this task. See [validation-plan.md](validation-plan.md).

## Founder-market fit, motivation, and team

[FOUNDER INPUT PENDING BY OWNER CHOICE: actual names, roles, locations, profiles, relevant experience, individual contributions, and the personal experience that led to this problem.]

Use [founder-worksheet.md](founder-worksheet.md). Do not submit generated product copy as a personal account of experiences that did not happen.

## Development history and attribution

The repository contains prior framework/UI scaffolding and PayFence work. The 9 October conversion removed ChatGPT/Sites/Cloudflare dependencies and added standard Next.js/npm commands, automatic SQLite persistence, tests, and updated local setup. This submission-preparation update adds current documentation, recorded evidence, and Sepolia evidence tooling. AI assisted implementation, validation, document preparation, and media creation. Founder contribution and ownership statements must reflect actual work.

[FOUNDER INPUT PENDING: actual product start date; all relevant development before 14 September 2026 at 6:00 a.m. Pacific; work completed during the event; individual contributors; third-party code and asset rights. Do not infer product age from an import commit or backdate work.]

## Accelerator application

Owner confirmed interest in applying and building PayFence full-time if selected. Toggle the accelerator supplement in the actual portal. Personal background, motivation, commitment logistics, and additional long-form answers remain pending. Use the worksheet; no claim is made about acceptance or funding.

## Repository and judge access

Repository: https://github.com/Bonavia/PayFence/tree/standalone-local

Provide the final commit from the branch after preparation. The repository is private; reviewer access for `hackathon@colosseum.com` must be confirmed by the owner. The current GitHub plugin exposes no collaborator-invitation operation, and no invitation has been sent. Do not change visibility without an explicit owner decision.

## Videos and graphic

Prepared assets: `PayFence-Pitch.mp4` and `PayFence-Product-Demo.mp4`, with English captions and disclosed synthetic narration. The founder must review the content, add a personal introduction if desired, and publish judge-accessible video links. Files and scripts alone are not published video URLs.

- Presentation URL: [OWNER ACTION: upload reviewed pitch and paste accessible URL].
- Product-demo URL: [OWNER ACTION: upload reviewed demo and paste accessible URL].
- Product graphic: prepared `PayFence-Logo.png`, based on the existing repository shield mark. Check the portal's size/format requirements.
- Public Sepolia proof: [OWNER ACTION: execute the guide with a separate faucet-funded test wallet, verify explorer links, and include the generated evidence].

## Sources and final checks

- Requirements and judging: https://colosseum.com/hackathon
- Event: https://colosseum.com/worldsfair
- Rules: https://colosseum.com/legal/Crypto%20World%27s%20Fair%20Hackathon%20Rules.pdf

Each team member must register, and each individual may participate in only one team/product submission. Relevant pre-event work must be disclosed. Confirm individual eligibility and rights in the portal, then personally review and accept the terms. No registration, submission, public media upload, judge invitation, customer contact, or testnet spending has been carried out by this preparation task.
