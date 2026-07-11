// Elimination probe: who paints the 1440-wide clips on the settled page?
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const { chromium } = require('@playwright/test');

const BASE = 'http://localhost:3001';
const TRACE_MS = 5000;

async function trace(page, client) {
  const events = [];
  const handler = (p) => events.push(...p.value);
  client.on('Tracing.dataCollected', handler);
  const done = new Promise((res) => client.once('Tracing.tracingComplete', res));
  await client.send('Tracing.start', {
    categories: 'disabled-by-default-devtools.timeline,devtools.timeline',
    transferMode: 'ReportEvents',
  });
  await page.waitForTimeout(TRACE_MS);
  await client.send('Tracing.end');
  await done;
  client.off('Tracing.dataCollected', handler);
  const paints = events.filter((e) => e.name === 'Paint' && e.ph === 'X');
  let wide = 0;
  for (const p of paints) {
    const clip = p.args?.data?.clip;
    if (!clip) continue;
    const w = Math.max(clip[0], clip[2], clip[4], clip[6]) - Math.min(clip[0], clip[2], clip[4], clip[6]);
    if (w >= 1400 && w < 10000) wide++;
  }
  return { paints_s: +(paints.length / 5).toFixed(1), wide1440_s: +(wide / 5).toFixed(1) };
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 806 } });
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(5000);
const client = await page.context().newCDPSession(page);

const conditions = [
  ['control', null],
  ['no-tab', '.drawer-tab,[class*=drawer-tab]{display:none!important}'],
  ['no-header', 'header{display:none!important}'],
  ['no-controls', '.controls-card,.scene-controls{display:none!important}'],
  ['no-margin', '.margin-note,[class*=margin]{display:none!important}'],
];

const out = {};
for (const [name, css] of conditions) {
  let tag = null;
  if (css) tag = await page.evaluate((c) => {
    const s = document.createElement('style');
    s.textContent = c;
    document.head.appendChild(s);
    return true;
  }, css);
  await page.waitForTimeout(600);
  out[name] = await trace(page, client);
  if (tag) await page.evaluate(() => document.head.querySelector('style:last-of-type').remove());
  await page.waitForTimeout(400);
}
console.log(JSON.stringify(out, null, 2));
await browser.close();
