/**
 * T9-W7 exec B1b — the paper note, driven.
 *
 * The two recut sentences are the `budget` and `network` variants of `PAPER_NOTE_COPY`, and
 * both are rendered by `SolverErrorNote.vue:46` inside a `role="alert"` card. Neither can be
 * reached by playing: a step budget is spent by a board hard enough to exhaust it, and a dead
 * worker is a fault. So the fault is INJECTED AT THE NETWORK LAYER, never in the source —
 * Playwright fulfils the request for the built worker chunk with a stub module that answers
 * `ping` truthfully and fails every real request with the code this run names. The page, the
 * bundle and the classifier are the shipped ones; only the worker's answer is ours.
 *
 * Reads, per engine:
 *   · the alert's own text and box
 *   · whether the card drew its `try again` button (retryable, which decides whether the
 *     sentence has to carry what the player can do)
 *
 * With `censusPath` it also writes a WHOLE-TREE rect census taken while the alert is up, in
 * `rect-census.mjs`'s own key grammar, so the driven surface gets the same π treatment as the
 * rest pose: before and after diff with `rect-diff.mjs`.
 *
 * usage: node note-arm.mjs <baseURL> <engine> <CODE> [framePath] [censusPath]
 */
import { writeFileSync } from 'node:fs';
import {
  chromium,
  webkit,
} from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';

const [, , BASE, ENGINE = 'chromium', CODE = 'WORKER_FAILURE', FRAME, CENSUS_OUT] =
  process.argv;
const ENGINES = { chromium, webkit };

const STUB = (code) => `
self.onmessage = (e) => {
  const d = e.data || {};
  if (d.kind === 'ping') { self.postMessage({ id: d.id, ok: true, kind: 'ping' }); return; }
  self.postMessage({ id: d.id, ok: false, code: ${JSON.stringify(code)}, message: 'injected by the B1b arm' });
};
`;

// The same pinned permalink the census uses: eight givens, no generation, identical every run.
function encodeSudoku(size, cells, total) {
  let c = '';
  for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36);
  const body = String.fromCharCode(1) + `${size}.${c}`;
  return Buffer.from(body, 'latin1')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
const PINNED = encodeSudoku(3, { 0: 5, 4: 3, 8: 7, 20: 9, 40: 1, 60: 4, 76: 2, 80: 6 }, 81);

const browser = await ENGINES[ENGINE].launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  reducedMotion: 'reduce',
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.route(/solver\.worker.*\.js(\?.*)?$/, (route) =>
  route.fulfill({
    status: 200,
    contentType: 'text/javascript',
    body: STUB(CODE),
  }),
);
await page.goto(new URL(`./?board=${PINNED}`, BASE).href, { waitUntil: 'load' });
await page.waitForSelector('.sudoku-cell', { timeout: 30000 });
await page.waitForTimeout(2000);

await page.locator('.controls-card button[aria-label="Solve puzzle"]').click();
await page.waitForSelector('.error-note', { timeout: 30000 });
await page.waitForTimeout(600);

const note = page.locator('.error-note-text');
const text = (await note.innerText()).trim();
const box = await note.boundingBox();
const card = await page.locator('.error-note').boundingBox();
const retry = await page.locator('.error-note-retry').count();
const role = await page.locator('.error-note').getAttribute('role');
console.log(`engine=${ENGINE} code=${CODE}`);
console.log(`  role=${role} retryButton=${retry}`);
console.log(`  text="${text}"`);
console.log(
  `  text box=${box.x.toFixed(2)},${box.y.toFixed(2)},${box.width.toFixed(2)},${box.height.toFixed(2)}`,
);
console.log(
  `  card box=${card.x.toFixed(2)},${card.y.toFixed(2)},${card.width.toFixed(2)},${card.height.toFixed(2)}`,
);
console.log(`  names the machine: ${/solver|engine|worker|wasm/i.test(text)}`);
const retryBox = retry ? await page.locator('.error-note-retry').boundingBox() : null;
if (retryBox)
  console.log(
    `  try-again box=${retryBox.x.toFixed(2)},${retryBox.y.toFixed(2)},${retryBox.width.toFixed(2)},${retryBox.height.toFixed(2)}`,
  );

if (CENSUS_OUT) {
  const rects = await page.evaluate(() => {
    const p = (el) => {
      const parts = [];
      let n = el;
      while (n && n.nodeType === 1 && n !== document.documentElement) {
        const q = n.parentElement;
        const i = q ? Array.prototype.indexOf.call(q.children, n) + 1 : 1;
        parts.unshift(`${n.tagName.toLowerCase()}:${i}`);
        n = q;
      }
      return 'html/' + parts.join('/');
    };
    const out = {};
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      out[p(el)] = [
        Math.round(r.x * 100) / 100,
        Math.round(r.y * 100) / 100,
        Math.round(r.width * 100) / 100,
        Math.round(r.height * 100) / 100,
      ];
    }
    return out;
  });
  writeFileSync(CENSUS_OUT, JSON.stringify(rects, null, 0) + '\n');
  console.log(`  census ${Object.keys(rects).length} rects -> ${CENSUS_OUT}`);
}

if (FRAME) {
  await page.screenshot({
    path: FRAME,
    clip: {
      x: Math.max(0, card.x - 6),
      y: Math.max(0, card.y - 6),
      width: Math.min(card.width + 12, 1280),
      height: card.height + 12,
    },
  });
  console.log(`  frame ${FRAME}`);
}
await browser.close();
