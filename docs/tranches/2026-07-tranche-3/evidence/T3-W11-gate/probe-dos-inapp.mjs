// T3-W11 GATE — the reflected-DoS reject, END-TO-END in the real app (not the replica):
// open ?game=futoshiki&board=<100k-pair blob> and time load-to-interactive; the board
// must degrade fail-closed (fresh board, no crafted carets, no hang).
import { createRequire } from 'node:module';
const require = createRequire(
  new URL('../../../../../web/frontend/package.json', import.meta.url),
);
const { chromium } = require('@playwright/test');

const BASE = process.env.BASE || 'http://localhost:3001';
const toB64Url = (s) =>
  Buffer.from(s, 'binary').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

// The G8 blob: 4×4, 100k duplicate pairs (~590 KB base64url — raw.length 4096-caps it).
const blob100k = toB64Url('4.' + '1'.repeat(16) + '.' + Array(100000).fill('0-1').join(','));
// A just-over-cap blob (~5.5 KB) — same rejection branch, small enough for any URL limit.
const blobOverCap = toB64Url('4.' + '1'.repeat(16) + '.' + Array(900).fill('0-1').join(','));

const browser = await chromium.launch();
const page = await browser.newPage();

for (const [name, blob] of [['100k-pair (~590KB)', blob100k], ['over-cap ~5.5KB', blobOverCap]]) {
  const t0 = Date.now();
  let resp;
  try {
    resp = await page.goto(`${BASE}/?game=futoshiki&board=${blob}`, { timeout: 30000 });
  } catch (e) {
    console.log(`${name}: blobLen=${blob.length}  goto FAILED at the transport (${e.message.split('\n')[0]}) — the URL never reaches the app`);
    continue;
  }
  console.log(`${name}: HTTP ${resp?.status()}`);
  if (resp && resp.status() >= 400) {
    console.log(`${name}: blobLen=${blob.length}  rejected by the dev server itself (HTTP ${resp.status()}) — never reaches the decoder`);
    continue;
  }
  await page.waitForFunction(() => document.querySelectorAll('.futoshiki-cell').length > 0, {
    timeout: 30000,
  });
  const t1 = Date.now();
  const state = await page.evaluate(() => ({
    cells: document.querySelectorAll('.futoshiki-cell').length,
    carets: document.querySelectorAll('.futoshiki-caret, [class*="caret"]').length,
    responsive: true, // this evaluate returning at all proves the main thread lives
  }));
  console.log(
    `${name}: blobLen=${blob.length}  load→board=${t1 - t0}ms  cells=${state.cells}  caretEls=${state.carets}  mainThreadLive=${state.responsive}`,
  );
}
await browser.close();
