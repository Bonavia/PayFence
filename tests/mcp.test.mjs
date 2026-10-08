import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { request } from 'node:http';
import { createPayFenceHttp } from '../scripts/mcp-server.mjs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

test('MCP negotiates 2025-11-25 and returns real controls without exposing payment tools', async () => {
  const http = createPayFenceHttp(); http.listen(0, '127.0.0.1'); await once(http, 'listening');
  const url = `http://127.0.0.1:${http.address().port}/mcp`;
  const client = new Client({ name: 'integration-test', version: '1' });
  try {
    const init = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'test', version: '1' } } }) });
    assert.equal((await init.json()).result.protocolVersion, '2025-11-25');
    await client.connect(new StreamableHTTPClientTransport(new URL(url)));
    assert.deepEqual((await client.listTools()).tools.map(t => t.name).sort(), ['prepare_review_packet', 'review_queue', 'verify_audit']);
    const result = await client.callTool({ name: 'review_queue', arguments: {} });
    const queue = JSON.parse(result.content[0].text);
    assert.equal(queue.invoices[0].controls[0].ok, false);
    assert.equal(queue.invoices[0].readyForRehearsal, false);
    const bad = await client.callTool({ name: 'prepare_review_packet', arguments: { invoiceId: 'missing' } });
    assert.equal(bad.isError, true);
    assert.equal((await fetch(url, { method: 'POST', headers: { Origin: 'https://untrusted.example' } })).status, 403);
    const status = await new Promise((resolve, reject) => { const req = request(url, { headers: { Host: 'untrusted.example' } }, res => { res.resume(); resolve(res.statusCode); }); req.on('error', reject); req.end(); });
    assert.equal(status, 403);
  } finally { await client.close(); await new Promise(resolve => http.close(resolve)); }
});
