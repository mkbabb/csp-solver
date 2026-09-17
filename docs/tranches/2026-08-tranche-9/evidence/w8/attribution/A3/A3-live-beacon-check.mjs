// run: node A3-live-beacon-check.mjs  — read-only: does the CF Insights beacon fetch/execute on the live edge?
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
const reqs = [], csp = [];
ctx.on('request', r => { if (!r.url().startsWith('https://sudoku.babb.dev')) reqs.push({ u: r.url(), t: r.resourceType() }); });
ctx.on('requestfailed', r => reqs.push({ u: r.url(), failed: r.failure()?.errorText }));
const p = await ctx.newPage();
p.on('console', m => { if (/Content Security Policy|Refused to/.test(m.text())) csp.push(m.text().slice(0, 240)); });
await p.goto('https://sudoku.babb.dev/', { waitUntil: 'load', timeout: 60000 });
await p.waitForTimeout(8000);
const third = await p.evaluate(() => performance.getEntriesByType('resource')
  .filter(e => !e.name.startsWith(location.origin))
  .map(e => ({ n: e.name.slice(0, 110), start: +e.startTime.toFixed(0), end: +e.responseEnd.toFixed(0), transfer: e.transferSize })));
console.log(JSON.stringify({ at: new Date().toISOString(), offOriginRequests: reqs, cspViolations: csp, offOriginResourceTiming: third }, null, 1));
await b.close();
