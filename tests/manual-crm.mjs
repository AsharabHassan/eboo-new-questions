// Local-only browser verification. Never forwards a form to a real service.
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const audit = { receipts: [], documentRequests: [] };
const auditPath = process.env.EBOO_QA_AUDIT_PATH || path.join(os.tmpdir(), 'eboo-local-qa.json');
const save = () => fs.writeFileSync(auditPath, JSON.stringify(audit, null, 2));
http.createServer(async (req, res) => {
  if (req.method === 'GET') { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(audit)); return; }
  let body = ''; for await (const chunk of req) body += chunk;
  const p = JSON.parse(body);
  audit.receipts.push({ endpoint: req.url, submission_id: p.submission_id, city: p.answer_location_value,
    source: p.source, campaign_id: p.campaign_id, adset_id: p.adset_id, ad_id: p.ad_id,
    entry_url: p.meta_event_source_url, phone_normalized_correctly: p.phone === '+447700900123' });
  save();
  res.statusCode = audit.receipts.length === 1 ? 502 : 200;
  res.setHeader('content-type', 'application/json'); res.end('{}');
}).listen(4381, '127.0.0.1');

// A local proxy blocks all third-party scripts/connections, including Meta, even if Allow is tested.
http.createServer((req, res) => {
  if (req.headers['sec-fetch-dest'] === 'document') {
    audit.documentRequests.push({ url: req.url, destination: 'document' }); save();
  }
  const upstream = http.request({ hostname: '127.0.0.1', port: 4380, path: req.url, method: req.method,
    headers: { ...req.headers, host: '127.0.0.1:4382' } }, (reply) => {
    res.writeHead(reply.statusCode || 500, { ...reply.headers,
      'content-security-policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; media-src 'self' blob:; frame-src 'none'" });
    reply.pipe(res);
  });
  upstream.on('error', () => { res.statusCode = 502; res.end('Local application starting'); });
  req.pipe(upstream);
}).listen(4382, '127.0.0.1');
console.log('Local mock CRM :4381; external-network-blocked browser proxy :4382');
