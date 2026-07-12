// Resolve which DOM node is painting per-beat: trace briefly, then describe the
// painting nodeIds via CDP DOM.describeNode (trace nodeId == backendNodeId).
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const { chromium } = require('playwright');

const arm = process.argv[2] ?? 'mine';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 806 }, deviceScaleFactor: 2, colorScheme: 'dark' });
const page = await ctx.newPage();
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
if (arm === 'mine') {
  await page.addStyleTag({ content: `.outline-svg, .boil-divider-wrap, .sun-moon-toggle { visibility: hidden !important; }` });
}
await page.waitForTimeout(4000);
const out = '/tmp/whois-trace.json';
await browser.startTracing(page, { path: out, categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.invalidationTracking'] });
await page.waitForTimeout(4000);
await browser.stopTracing();

const evs = JSON.parse(readFileSync(out, 'utf8')).traceEvents;
const ids = new Set();
for (const e of evs) {
  const d = e.args?.data ?? {};
  if ((e.name === 'Paint' || e.name === 'InvalidateLayout' || e.name === 'LayoutInvalidationTracking' || e.name === 'PaintInvalidationTracking' || e.name === 'StyleRecalcInvalidationTracking') && d.nodeId) ids.add(d.nodeId);
  if (e.name === 'LayoutInvalidationTracking' && d.nodeId) ids.add(d.nodeId);
}
// invalidationTracking events carry nodeName directly — print those too
const named = {};
for (const e of evs) {
  const d = e.args?.data ?? {};
  if (d.nodeName && d.nodeId) named[d.nodeId] = `${d.nodeName} reason=${d.reason ?? ''}`;
}
console.log('tracked ids:', [...ids]);
console.log('named from trace:', named);

const cdp = await ctx.newCDPSession(page);
await cdp.send('DOM.getDocument', { depth: -1, pierce: true });
for (const id of ids) {
  try {
    const { node } = await cdp.send('DOM.describeNode', { backendNodeId: id });
    const attrs = node.attributes ?? [];
    const attrStr = [];
    for (let i = 0; i < attrs.length; i += 2) attrStr.push(`${attrs[i]}="${attrs[i + 1]}"`);
    console.log(id, '→', node.nodeName, attrStr.join(' ').slice(0, 160));
  } catch (err) {
    console.log(id, '→ unresolvable:', String(err).slice(0, 80));
  }
}
await browser.close();
