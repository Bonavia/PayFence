import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { read, write, db } from '../lib/store.ts';
import { validateLocalRequest } from '../lib/local-workspace.ts';

test('SQLite initializes, persists after reconnect, and rejects stale writes', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'payfence-'));
  const filename = join(directory, 'workspace.sqlite');
  const previous = process.env.PAYFENCE_DB_PATH;
  process.env.PAYFENCE_DB_PATH = filename;
  try {
    const first = await read('local');
    assert.equal(first.version, 0);
    assert.equal(first.state.invoices.length, 3);
    first.state.invoices[0].description = 'Saved locally';
    await write('local', 0, first.state);
    await assert.rejects(write('local', 0, first.state), /another tab/);
    db().close();
    globalThis.payfenceDatabases.delete(filename);
    const reloaded = await read('local');
    assert.equal(reloaded.version, 1);
    assert.equal(reloaded.state.invoices[0].description, 'Saved locally');
  } finally {
    db().close();
    globalThis.payfenceDatabases.delete(filename);
    if (previous === undefined) delete process.env.PAYFENCE_DB_PATH;
    else process.env.PAYFENCE_DB_PATH = previous;
    rmSync(directory, { recursive: true, force: true });
  }
});

test('local API rejects foreign hosts and cross-origin browser requests', () => {
  const req = (host, origin) => new Request('http://localhost:3000/api/workspace', {
    headers: { Host: host, ...(origin ? { Origin: origin } : {}) },
  });
  for (const host of ['localhost:3000', '127.0.0.1:3000', '[::1]:3000']) {
    assert.equal(validateLocalRequest(req(host)), null);
    assert.equal(validateLocalRequest(req(host, `http://${host}`)), null);
  }
  assert.equal(validateLocalRequest(req('attacker.example')).status, 403);
  assert.equal(validateLocalRequest(req('localhost:3000', 'https://attacker.example')).status, 403);
});
