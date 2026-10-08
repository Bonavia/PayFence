import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seed, digest, log, hash } from '../lib/model.ts';
import { reviewInvoice, reviewPacket, verifyAuditChain } from '../lib/review.ts';

test('review refuses changed recipients, stale approvals, and changed limits', async () => {
  const state = seed(), invoice = state.invoices[0];
  assert.equal((await reviewInvoice(state, invoice.id)).readyForRehearsal, false);
  invoice.recipient = state.vendors[0].wallet;
  invoice.status = 'approved'; invoice.approval = { digest: await digest(state, invoice), at: new Date().toISOString() };
  assert.equal((await reviewInvoice(state, invoice.id)).readyForRehearsal, true);
  state.vendors[0].budget = '1';
  assert.equal((await reviewInvoice(state, invoice.id)).readyForRehearsal, false);
  state.vendors[0].budget = '5000'; invoice.amount = '2401';
  assert.equal((await reviewInvoice(state, invoice.id)).approvalMatches, false);
});

test('audit verification detects forged genesis, edits, and truncation with a retained head', async () => {
  const state = seed(); await log(state, 'Created', 'fixture'); await log(state, 'Reviewed', 'fixture');
  const head = state.audit.at(-1).hash;
  assert.equal((await verifyAuditChain(state.audit, head)).valid, true);
  const edited = structuredClone(state.audit); edited[0].detail = 'changed';
  assert.equal((await verifyAuditChain(edited)).valid, false);
  const forged = structuredClone(state.audit); forged[0].previousHash = 'FAKE';
  const { hash: ignored, ...entry } = forged[0]; forged[0].hash = await hash(JSON.stringify(entry));
  assert.equal((await verifyAuditChain(forged)).valid, false);
  assert.equal((await verifyAuditChain(state.audit.slice(0, 1), head)).valid, false);
  assert.equal((await verifyAuditChain([], head)).valid, false);
});

test('review packets disclose snapshot limits and detect changed packet contents', async () => {
  const packet = await reviewPacket(seed(), 'demo-001');
  const { packetHash, ...body } = packet;
  assert.equal(packetHash, await hash(JSON.stringify(body)));
  body.review.amount = '1';
  assert.notEqual(packetHash, await hash(JSON.stringify(body)));
  assert.match(packet.limitations, /Not a payment authorization/);
});
