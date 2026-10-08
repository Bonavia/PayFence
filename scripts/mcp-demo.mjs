import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
const client = new Client({ name: 'payfence-demo', version: '1.0.0' });
try {
  await client.connect(new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${process.env.PAYFENCE_MCP_PORT || 3001}/mcp`)));
  console.log('Tools:', (await client.listTools()).tools.map(tool => tool.name));
  for (const [name, args] of [['review_queue', {}], ['prepare_review_packet', { invoiceId: process.argv[2] || 'demo-001' }], ['verify_audit', {}]]) {
    const result = await client.callTool({ name, arguments: args });
    if (result.isError) throw new Error(JSON.stringify(result.content));
    console.log(name, JSON.stringify(result, null, 2));
  }
} finally { await client.close(); }
