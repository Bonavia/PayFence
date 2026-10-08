# Amazon Alexa Plus submission draft

Sources: https://amazonappdev2026.devpost.com/ and https://amazonappdev2026.devpost.com/rules. Deadline: 23 October 2026 at 12:00 PDT. The public requirements are mapped below; check the logged-in form for field limits.

## Project title and short description

PayFence — invoice review tools for assistants, with human-controlled payment rehearsal.

PayFence exposes invoice risk checks, exact-detail review packets, and audit verification through a working Streamable HTTP MCP server. A human resolves issues and approves details in the workspace; a separate wallet-signed mock-token rehearsal checks the payment contract. The assistant can explain risk but cannot approve or transfer funds.

## Track and mini challenges

Proposed primary track: Alexa+ via self-hosted MCP. The local SDK server supports protocol 2025-11-25 and is demonstrated with a real MCP client. It has not been tested with an Alexa+ device or certified by Amazon. Do not describe the CLI client as an Alexa simulator.

No AWS Builder entry is claimed: no AWS runtime integration is implemented. No Open Source mini-challenge entry is claimed: the required separate qualifying public contribution/project and licensing evidence are not established. A README change alone is insufficient.

## What it does and how it works

The user exports an invoice workspace from PayFence. A local MCP service loads that snapshot, checks invoice controls using the same evaluator as the browser, and produces a review packet. The packet identifies failed checks, current approval status, a fingerprint, and audit integrity. A retained audit head can detect truncated history.

The user returns to the workspace to make changes or approve. The testnet lab retrieves live workspace state before signing and execution; it uses the selected invoice's exact amount and recipient with a freshly deployed mock token. Its EIP-712 signature binds the order and domain. Evidence export records the signature and transaction. None of the MCP tools can perform a payment.

## Why it is useful

An assistant should be able to explain why an invoice needs attention without gaining spend authority. PayFence separates review information from signing power and makes the explanation inspectable. The intended audience is contractor-heavy teams; demand and willingness to pay remain hypotheses.

## Technical implementation and design

Run instructions are in README.md. `scripts/mcp-server.mjs` uses the official MCP SDK and Streamable HTTP. `scripts/mcp-demo.mjs` is an executable SDK client. `lib/review.ts` shares the review logic. Tests exercise protocol negotiation, tool calls, invalid requests/origins, stale approvals, and audit tampering. The service listens only on loopback and reads exports; authenticated remote access is not implemented.

This is a useful local prototype, but Amazon's rubric warns that a basic wrapper is less differentiated than a stateful, orchestrated workflow. Our review packets and human-signing boundary strengthen the workflow; live authenticated integration and user-tested interaction remain the next gaps.

## Code repository

https://github.com/Bonavia/PayFence

[REQUIRED: select a reviewer-accessible commit. Either make the repository public with an appropriate open-source license after rights review, or grant the organizer's currently specified private-repo reviewers access. No visibility change or invitations were made. Verify the current reviewer list and accepted invitations when submitting.]

## Demonstration video

[REQUIRED: public English YouTube/Vimeo URL, under three minutes. Show the actual MCP client calling the server and inspecting a blocked invoice. See video-scripts.md. Do not imply an Alexa device connection that was not tested.]

## Product feedback

Draft observations to confirm after the owner's own walkthrough:

- MCP SDK: used for server tool registration, HTTP transport, and the demonstration client. Sharing the evaluator prevents the assistant and dashboard from having divergent invoice checks.
- Integration limit: snapshot exports require a manual refresh. This is a PayFence architecture limitation, not a demonstrated Amazon platform defect.
- Onboarding: README supplies a no-key local path and an explicit distinction between snapshot review and live signing. [OWNER INPUT: actual time taken, confusing steps, environment, and whether you would use the tools again.]
- No first-hand Alexa+ device/console experience or AWS service feedback is claimed.

## Feature requests and friction log

Optional proposed feature request: show an assistant-visible evidence card with explicit snapshot age, source, and handoff to a human approval screen. Priority: important. This is a proposal, not a claimed platform deficiency.

Do not submit invented friction observations for the possible judging bonus. For each real incident record: date/version, task, steps, expected result, actual result, severity, workaround, and actionable suggestion. No fabricated timings or success rates are included.

## Work during the event window

The organizer's window starts 31 August 2026 and ends 23 October 2026. Initial PayFence project work and this enhancement are recorded in Git history; disclose reused UI/framework scaffolding. Added in this update: MCP service/client, shared review packets, audit-head verification, invoice-specific rehearsal, tests, local database setup, and submission documentation. [OWNER INPUT: confirm ownership, development dates, outside help, and any prior sponsor support.]

## Known limitations

No public authenticated MCP deployment, Alexa device test, production settlement, receipt-to-D1 reconciliation, or customer validation yet. These limits must stay visible in the submission and demo.
