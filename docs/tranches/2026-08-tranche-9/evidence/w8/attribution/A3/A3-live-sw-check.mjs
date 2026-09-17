// run: node A3-live-sw-check.mjs   — read-only load of the LIVE edge; asserts no service worker registers.
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
const p = await ctx.newPage();
await p.goto('https://sudoku.babb.dev/', { waitUntil: 'load', timeout: 60000 });
await p.waitForTimeout(8000);
const out = await p.evaluate(async () => ({
  supported: 'serviceWorker' in navigator,
  registrations: (await navigator.serviceWorker.getRegistrations()).length,
  controller: !!navigator.serviceWorker.controller,
  entry: [...document.querySelectorAll('script[src]')].map(s => s.getAttribute('src')),
  caches: typeof caches !== 'undefined' ? await caches.keys() : null,
}));
console.log(JSON.stringify({ url: 'https://sudoku.babb.dev/', at: new Date().toISOString(), ...out }));
await b.close();
