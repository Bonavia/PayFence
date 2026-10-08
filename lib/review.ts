import { checks, digest, hash, type State } from './model.ts';

// A retained head lets a reviewer detect truncation as well as changed entries.
// A self-contained hash chain cannot prove who authored it.
export async function verifyAuditChain(audit: State['audit'], expectedHead?: string) {
  let head = 'GENESIS';
  for (let index = 0; index < audit.length; index++) {
    const { hash: actual, ...entry } = audit[index];
    if (entry.previousHash !== head || await hash(JSON.stringify(entry)) !== actual) {
      return { valid: false, count: audit.length, head, failedIndex: index };
    }
    head = actual;
  }
  return { valid: expectedHead === undefined || expectedHead === head, count: audit.length, head, failedIndex: null };
}

export async function reviewInvoice(state: State, invoiceId: string) {
  const invoice = state.invoices.find(item => item.id === invoiceId);
  if (!invoice) throw new Error('Invoice not found.');
  const vendor = state.vendors.find(item => item.id === invoice.vendorId);
  if (!vendor) throw new Error('Registered vendor not found.');
  const controls = checks(state, invoice);
  const fingerprint = await digest(state, invoice);
  const approvalMatches = invoice.status === 'approved' && invoice.approval?.digest === fingerprint;
  const audit = await verifyAuditChain(state.audit);
  return {
    invoiceId, reference: invoice.reference, vendor: vendor.name,
    amount: invoice.amount, recipient: invoice.recipient, revision: invoice.revision,
    status: invoice.status, controls, fingerprint, approvalMatches, audit,
    readyForRehearsal: controls.every(control => control.ok) && approvalMatches && audit.valid,
    nextAction: !audit.valid ? 'Investigate audit integrity before continuing.' :
      controls.some(control => !control.ok) ? 'Resolve failed controls in the workspace.' :
      !approvalMatches ? 'A human must review and approve the current details in the workspace.' :
      'A human may rehearse this invoice with mock tokens in the testnet lab.',
  };
}

export async function reviewPacket(state: State, invoiceId: string) {
  const review = await reviewInvoice(state, invoiceId);
  const body = {
    schema: 'payfence.review.v1', createdAt: new Date().toISOString(),
    review, network: state.network, workspaceMode: state.mode,
    limitations: 'Snapshot review only. Not a payment authorization, independent audit, or proof of settlement. Recheck live state before signing.',
  };
  return { ...body, packetHash: await hash(JSON.stringify(body)) };
}
