// preload gate (cold load): one wasm fetch on the streaming happy-path, no console warning;
// only the active game's worker modulepreloaded. Fresh (uncached) context.
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
const { chromium } = pw;
const url = 'http://127.0.0.1:4191/';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, bypassCSP: false });
const page = await ctx.newPage();
const wasmReqs = [];
const workerReqs = [];
const consoleMsgs = [];
page.on('request', (r) => {
  const u = r.url();
  if (u.endsWith('.wasm')) wasmReqs.push({ url: u.split('/').pop(), method: r.method(), resourceType: r.resourceType() });
  if (/solver\.worker[.-][^/]*\.js/.test(u)) workerReqs.push(u.split('/').pop());
});
page.on('console', (m) => { if (m.type() === 'warning' || m.type() === 'error') consoleMsgs.push(`[${m.type()}] ${m.text().slice(0, 160)}`); });
page.on('pageerror', (e) => consoleMsgs.push(`[pageerror] ${e.message.slice(0, 160)}`));
await page.goto(url, { waitUntil: 'load', timeout: 60000 });
// let the worker instantiate the wasm (solve nothing, just idle for cold instantiate)
await page.waitForTimeout(4000);
// also read modulepreload links in the served HTML
const preloads = await page.evaluate(() => [...document.querySelectorAll('link[rel="modulepreload"]')].map((l) => l.getAttribute('href').split('/').pop()));
console.log(JSON.stringify({
  wasmFetches: wasmReqs,
  wasmFetchCount: wasmReqs.length,
  workerFetches: workerReqs,
  workerFetchCount: workerReqs.length,
  modulepreloadWorkers: preloads.filter((p) => /solver\.worker/.test(p)),
  allModulepreloads: preloads,
  consoleWarningsErrors: consoleMsgs,
}, null, 1));
await browser.close();
