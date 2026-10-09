import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import ganache from 'ganache';
import { seed, digest, log } from '../lib/model.ts';
import { run } from '../scripts/sepolia-evidence.mjs';

test('evidence tooling rehearses an approved snapshot and verifies the signed event on an isolated RPC', async () => {
  // Sepolia chain ID for testing only; this is NOT public Sepolia evidence.
  const rpc = ganache.server({ logging: { quiet: true }, chain: { chainId: 11155111, hardfork: 'shanghai' } });
  const directory = await mkdtemp(join(tmpdir(), 'payfence-sepolia-test-'));
  try {
    await rpc.listen(0, '127.0.0.1');
    const state = seed(), invoice = state.invoices[0];
    invoice.recipient = state.vendors[0].wallet;
    invoice.status = 'approved'; invoice.approval = { digest: await digest(state, invoice), at: new Date().toISOString() };
    await log(state, 'Test approval', 'Isolated test fixture; not a customer approval.');
    const workspace = join(directory, 'workspace.json'), output = join(directory, 'evidence.json');
    await writeFile(workspace, JSON.stringify(state));
    const env = { SEPOLIA_RPC_URL: `http://127.0.0.1:${rpc.address().port}`, DEPLOYER_PRIVATE_KEY: Object.values(rpc.provider.getInitialAccounts())[0].secretKey };
    const evidence = await run(['--deploy', '--workspace', workspace, '--invoice', invoice.id, '--output', output], env);
    assert.equal(evidence.order.recipient, invoice.recipient);
    assert.equal(evidence.tokenBalance, '2400000000');
    await run(['--verify', output], { SEPOLIA_RPC_URL: env.SEPOLIA_RPC_URL });
    const changed = JSON.parse(await readFile(output, 'utf8')); changed.order.amount = '1'; await writeFile(output, JSON.stringify(changed));
    await assert.rejects(run(['--verify', output], { SEPOLIA_RPC_URL: env.SEPOLIA_RPC_URL }), /Invalid order signature/);
  } finally { await rpc.close(); await rm(directory, { recursive: true, force: true }); }
});

test('evidence deployment refuses a mainnet RPC before signing or transacting', async () => {
  const rpc = ganache.server({ logging: { quiet: true }, chain: { chainId: 1 } });
  try {
    await rpc.listen(0, '127.0.0.1');
    const before = await rpc.provider.request({ method: 'eth_blockNumber', params: [] });
    await assert.rejects(run(['--deploy'], { SEPOLIA_RPC_URL: `http://127.0.0.1:${rpc.address().port}` }), /Only Ethereum Sepolia/);
    assert.equal(await rpc.provider.request({ method: 'eth_blockNumber', params: [] }), before);
  } finally { await rpc.close(); }
});
