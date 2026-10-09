# Completed prototype video scripts

Recorded 9 October 2026. Both MP4s include English synthetic narration and selectable English subtitles. Separate SRT captions and full transcripts are included in the submission kit. These are reviewable video files; publication URLs and owner approval of the final pitch are still pending.

The product demo is an actual automated recording of the local production app with sample data, a test wallet, and valueless mock tokens on ephemeral chain 31337. It is not a public-chain or human wallet recording. UI action time is not accelerated. The pitch uses original slides and screenshots from that recording.

## Pitch — 2:42

### 0:00 — PayFence

PayFence helps contractor heavy teams review an invoice before they sign an E V M payment. The first product focuses on one reviewer and one contractor invoice, checking the destination, amount, duplicate reference, and the exact details that were approved.

### 0:17 — A familiar vendor name is not enough

A familiar vendor name is not the same as authorizing the destination on an invoice. Details can also change after a reviewer approves them. PayFence makes these checks explicit and invalidates an approval when payment details change. This is our technical thesis, not yet a validated customer finding.

### 0:37 — One clear review workflow

The local dashboard checks registered recipients, duplicate invoice references, per payment limits, and valid destinations. It persists the workspace in SQLite and binds approval to a fingerprint. An edit clears that approval. Review packets and a hash linked audit trail make the decision inspectable.

### 0:57 — The contract checks the signed order

The signed payment lab carries the approved invoice into an E I P seven twelve order. The contract checks the registered recipient, limit, payer signature, expiry, and invoice replay protection. We have demonstrated a real local contract transfer to the invoice recipient using valueless mock tokens.

### 1:17 — Decision evidence travels with the invoice

The proposed differentiator is the connection between invoice controls, exact authorization, and portable evidence. Read only M C P tools let assistants inspect exported snapshots without spend authority. Market uniqueness remains unproven. PayFence is not an autonomous treasury or a guarantee that all fraud is prevented.

### 1:37 — Start with a small, reachable audience

The initial customer hypothesis is small agencies and teams already paying contractors through E V M wallets. We plan direct founder led discovery with five payment reviewers, followed by a small review only pilot cohort. We will measure confusion, review time, repeat use, and willingness to pay.

### 1:57 — Test the business before expanding

A subscription per workspace is the business hypothesis. Pricing, acquisition cost, retention, and market size remain unvalidated. The owner reports no customer interviews, users, revenue, outside funding, or prior submissions. The next evidence should come from real payment reviewers, not additional demo fixtures.

### 2:19 — A focused next chapter

The owner intends to apply to the accelerator and build PayFence full time if selected. The next priorities are customer validation, public testnet proof, receipt reconciliation, and reviewed production controls. Founder background and personal motivation remain pending. The ambition is clear: make every contractor payment decision easier to inspect.

## Product demo — 2:44

### 0:00 — PayFence · working prototype

PayFence reviews contractor invoices before signing an E V M payment. This recording uses the working local application, sample invoices, and an automated test wallet. Every contract transaction uses valueless mock tokens on an ephemeral local chain.

### 0:14 — 01 · Spot the changed recipient

Studio North's invoice requests a different wallet from the registered vendor. The recipient check fails, and approval is disabled. The familiar vendor name does not override the exact destination being requested.

### 0:25 — 02 · Restore the registered wallet

Restoring the registered wallet resolves this sample exception. The review also checks duplicate invoice references, the vendor's per payment limit, and a valid nonzero destination. These are specific controls, not a guarantee against every kind of fraud.

### 0:39 — 03 · Approve exact details

The reviewer can now approve the current invoice details. PayFence stores an approval fingerprint. This dashboard approval is a review decision, not a wallet signature or a blockchain payment.

### 0:49 — 04 · Change a detail; approval clears

Now the amount changes. Saving the edit increments the revision, clears the old approval, and returns the invoice to review. This prevents the dashboard from presenting an earlier approval as approval of changed details.

### 1:01 — 05 · Reapprove and export the review

After reviewing the new amount, the invoice is approved again. The downloaded review packet includes the checks, revision, approval match, audit result, and a packet hash. It is portable review evidence, not proof that money has moved.

### 1:14 — 06 · Verify the decision history

The audit trail records recipient restoration, approval, and the later edit. Integrity verification checks the hashes and links. A separately retained head can detect truncation; the chain does not prove authorship or prevent an administrator from rewriting the whole history.

### 1:28 — 07 · Deploy the test contracts

The signed payment lab selects the approved invoice. This automated test wallet deploys a valueless mock token and the PayFence contract on local chain thirty one thousand three hundred thirty seven. No public deployment or human wallet extension is being claimed.

### 1:42 — 08 · Sign and execute the invoice

The lab registers the invoice vendor, mints test tokens, grants the exact allowance, signs the order, and executes it. The contract checks the recipient, amount limit, payer signature, expiry, and invoice replay marker. The app rechecks the current approval before signing and sending.

### 1:57 — 09 · Inspect and export signed evidence

The receipt confirms a real local contract transaction to the invoice recipient. The signed evidence includes the domain, order, signature, transaction hash, and block number. Dashboard status remains separate, so this prototype does not claim automatic settlement reconciliation.

### 2:13 — 10 · Read-only assistant review

The optional M C P service exposes three read only tools: review the queue, prepare a review packet, and verify the audit. Here are actual S D K responses from an exported workspace snapshot. The service cannot approve an invoice or send funds.

### 2:27 — Review → approve → sign → evidence

PayFence connects invoice checks to exact authorization and inspectable evidence. The local app, contract flow, and review tools work. Customer validation, public Sepolia proof, and production controls remain next steps. No real stablecoin settlement or customer traction is claimed.

## Owner completion

- Watch both videos and confirm the product and owner statements before publishing.
- Add founder introduction only after supplying actual founder details.
- Upload the videos to a stable reviewer-accessible host and paste the URLs into the submission form.
- Verify current form fields and visibility requirements. These files have not been uploaded to a public video host.
- Retain the mock-token, sample-data, synthetic-narration, and local-chain disclosures.
