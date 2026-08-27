const fs   = require('fs');
const path = require('path');

const dir   = 'k6/reports';
const files = fs.readdirSync(dir)
  .filter(f => f.endsWith('.json') && f !== '.gitkeep')
  .map(f => ({ name: f, mtime: fs.statSync(path.join(dir, f)).mtimeMs }))
  .sort((a, b) => b.mtime - a.mtime);

if (!files.length) { console.log('No reports found in k6/reports/'); process.exit(0); }

const latest = path.join(dir, files[0].name);
console.log(`\nLatest report: ${latest}\n`);

const data    = JSON.parse(fs.readFileSync(latest, 'utf8'));
const metrics = data.metrics ?? {};

const get = (key, stat) => metrics[key]?.values?.[stat];
const pct = v => v !== undefined ? `${v.toFixed(0)} ms` : 'n/a';
const rate = v => v !== undefined ? `${(v * 100).toFixed(2)} %` : 'n/a';
const rps  = v => v !== undefined ? `${v.toFixed(2)} req/s` : 'n/a';

const rows = [
  ['p(50) latency',  pct(get('http_req_duration', 'p(50)'))],
  ['p(95) latency',  pct(get('http_req_duration', 'p(95)'))],
  ['p(99) latency',  pct(get('http_req_duration', 'p(99)'))],
  ['Throughput',     rps(get('http_reqs', 'rate'))],
  ['Error rate',     rate(get('http_req_failed', 'rate'))],
  ['Total requests', String(get('http_reqs', 'count') ?? 'n/a')],
];

const pad = (s, n) => s.padEnd(n);
console.log('┌─────────────────────┬──────────────────────┐');
console.log('│ Metric              │ Value                │');
console.log('├─────────────────────┼──────────────────────┤');
rows.forEach(([k, v]) => console.log(`│ ${pad(k, 19)} │ ${pad(v, 20)} │`));
console.log('└─────────────────────┴──────────────────────┘');
