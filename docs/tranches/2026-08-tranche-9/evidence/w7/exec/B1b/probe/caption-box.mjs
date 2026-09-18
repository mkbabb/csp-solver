/**
 * T9-W7 exec B1b — the row caption's own box.
 *
 * The caption is a rest-pose rendered label: no hover, no state, nothing to drive. This reads
 * every `.zone-row-label` on the controls card — its text and its box — at one viewport in one
 * engine, so the DELTA is the caption's own width and the claim can be checked against the
 * census. `.zone-row-label` is `flex: 0 0 3.75rem` beside the chips (mobile) and `flex: 0 0
 * auto` over them (the desktop rail's stacked column), which is why the box only moves at the
 * stacked width.
 *
 * usage: node caption-box.mjs <baseURL> <engine> <width> <height> [framePath]
 */
import {
  chromium,
  webkit,
} from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';

const [, , BASE, ENGINE = 'chromium', W = '1280', H = '800', FRAME] = process.argv;
const ENGINES = { chromium, webkit };

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
  viewport: { width: Number(W), height: Number(H) },
  reducedMotion: 'reduce',
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto(new URL(`./?board=${PINNED}`, BASE).href, { waitUntil: 'load' });
await page.waitForSelector('.sudoku-cell', { timeout: 30000 });
await page.waitForTimeout(2500);

const rows = await page.evaluate(() =>
  [...document.querySelectorAll('.zone-row-label')].map((el) => {
    const r = el.getBoundingClientRect();
    return {
      text: el.textContent.trim(),
      box: [r.x, r.y, r.width, r.height].map((n) => Math.round(n * 100) / 100),
      // the control the caption names, so a caption that moved its neighbour is visible here
      row: (() => {
        const rr = el.parentElement.getBoundingClientRect();
        return [rr.x, rr.y, rr.width, rr.height].map((n) => Math.round(n * 100) / 100);
      })(),
      chips: (() => {
        const c = el.parentElement.querySelector('.options-row');
        if (!c) return null;
        const cr = c.getBoundingClientRect();
        return [cr.x, cr.y, cr.width, cr.height].map((n) => Math.round(n * 100) / 100);
      })(),
    };
  }),
);
console.log(`engine=${ENGINE} viewport=${W}x${H}`);
for (const r of rows)
  console.log(
    `  "${r.text}"  label=${r.box.join(',')}  row=${r.row.join(',')}  chips=${r.chips ? r.chips.join(',') : 'none'}`,
  );

if (FRAME && rows.length) {
  // The pencils compartment sits below the fold at this viewport (the captions measure at
  // y≈710 and y≈856 against an 800px window), so the crop scrolls to it first. The boxes
  // REPORTED above are the unscrolled ones — this scroll exists for the picture alone.
  await page.locator('.zone-row-label').last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const shot = await page.evaluate(() =>
    [...document.querySelectorAll('.zone-row-label')].map((el) => {
      const r = el.parentElement.getBoundingClientRect();
      return [r.x, r.y, r.width, r.height];
    }),
  );
  const x0 = Math.min(...shot.map((r) => r[0]));
  const y0 = Math.min(...shot.map((r) => r[1]));
  const x1 = Math.max(...shot.map((r) => r[0] + r[2]));
  const y1 = Math.max(...shot.map((r) => r[1] + r[3]));
  await page.screenshot({
    path: FRAME,
    clip: {
      x: Math.max(0, x0 - 8),
      y: Math.max(0, y0 - 8),
      width: x1 - x0 + 16,
      height: y1 - y0 + 16,
    },
  });
  console.log(`  frame ${FRAME}`);
}
await browser.close();
