# Arc and Mergetober eligibility gates

## Arc Microgrants

Official source: https://community.arc.io/public/events/arc-microgrants-f8tijfjhyq

The required fields are a working Arc mainnet deployment link, public repository, short description of the project and Arc's role, and public builder profile. Testnet-only projects and projects without an Arc component are excluded. The program offers $500 in USDC; the explicit closing text is 14 October 2026 at 23:59 ET.

**Current status: not eligible.** PayFence blocks mainnet in its interface and has no verified Arc deployment. We did not relabel Sepolia or a local chain as Arc.

Prepared field draft, only to use after implementation and verification:

- Project: PayFence.
- Description: Invoice-level controls for contractor payments, checking destination changes, duplicates, limits, and exact human authorization.
- Arc role: [REQUIRED: describe the implemented Arc contracts, token/gas behavior, and verified execution. No integration exists yet.]
- Live deployment: [REQUIRED: actual accessible Arc mainnet app/contract link and working transaction evidence.]
- Public repository: [REQUIRED: publicly accessible licensed source after ownership review. Current link alone does not establish public access.]
- Builder profile: [OWNER INPUT: the submitting builder's real public profile.]
- Funding/eligibility: [OWNER INPUT: confirm no prior Circle/Arc funding and applicable program requirements.]

A mainnet adaptation requires verified current chain configuration, supported token handling, receipt verification, and a funded signing wallet with explicit transaction review. Removing the UI mainnet guard is not an acceptable substitute for those changes. Given the current prototype, Colosseum/Amazon preparation has higher immediate value.

## Mergetober

Official rules: https://www.wemakedevs.org/hackathons/mergetober/rules

This is a Cognee integration contribution campaign, not a general app contest. The rules require assignment before coding, an eligible integration issue, an October PR, a public real-world-use blog for each PR, and contribution/DCO compliance. They permit AI assistance but prohibit AI-generated PRs. We have not requested assignment or prepared an entry represented as compliant.

Prepared checklist for a separate owner-led contribution:

- GitHub author: [OWNER INPUT].
- Eligible integration issue: [REQUIRED: URL; check existing issues first].
- Maintainer assignment: [REQUIRED: explicit assignment evidence before work begins].
- Owner-written implementation and PR: [REQUIRED: URL, date, tests, and DCO].
- Real use-case blog: [REQUIRED: public URL for this PR].
- Merge/submission evidence: [REQUIRED: actual status and submitted form].

Do not submit the PayFence MCP server as a Cognee integration; it does not integrate Cognee. No issue comment, maintainer contact, PR, or blog publication was sent.
