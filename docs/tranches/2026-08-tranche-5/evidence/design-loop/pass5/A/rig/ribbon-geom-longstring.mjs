/**
 * ribbon-geom, THE FALSIFYING ARM (pass-5 Lane A, minor A-m8).
 *
 * Pass 4's `ribbon-geom` is the one Lane-A instrument with no arm that can red: all 36 cells
 * read `overflow 0/0`, `subLines 1`, and the three shipped sub-lines differ by ~24 px of slack
 * at the tightest viewport (320: 51.96 / 41.40 / 31.73). An instrument that has only ever seen
 * strings that fit cannot distinguish "the ribbon holds its copy" from "the probe cannot see
 * overflow at all". This arm settles that, at the cell where the margin is thinnest.
 *
 * THE CONTROL: at 320 px, after measuring the shipped `both` state, the sub-line's text is
 * replaced in the DOM with a string long enough to be impossible, and the SAME reads are taken
 * again. The rig FAILS unless the second read moves — `subLines > 1` or a non-zero overflow.
 *
 * NOTE ON PROVENANCE (banked, not buried): pass 4's `rigA/` committed only `package.json` and a
 * `node_modules` symlink — `verb-ink.mjs` and `ribbon-geom.mjs` are absent from the tree at
 * `66fa5856`. This file is a RE-AUTHORING against pass 4's own JSON schema, not that script
 * recovered, so its absolute numbers are its own; the shipped read is re-taken here so the
 * before/after pair is internally consistent.
 *
 *   node ribbon-geom-longstring.mjs <baseURL>
 */
import { chromium } from "@playwright/test";

const base = process.argv[2];
if (!base) throw new Error("usage: node ribbon-geom-longstring.mjs <baseURL>");

const LONG =
  "neither board's marks are saved and neither board's marks will be saved " +
  "and this sentence exists only to be too long for the note it sits in";

/** The `both` state: a dirty mounted sudoku AND a target card whose ledger holds user moves. */
async function armBoth(page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "kenken-board-v1",
      JSON.stringify({
        boardSize: 6,
        difficulty: "HARD",
        values: { 0: 1, 5: 2 },
        givenCells: ["0"],
        originalGivenCells: ["0"],
        overriddenCells: [],
        solvedValues: {},
        boardGeneration: 1,
        inequalities: [],
      }),
    );
  });
  await page.goto(base + "/?size=3&difficulty=EASY");
  await page.waitForSelector(".sudoku-cell", { timeout: 20000 });
  await page.waitForFunction(
    () => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0,
    null,
    { timeout: 20000 },
  );
  const blank = await page.evaluate(() => {
    const c = document.querySelectorAll(".sudoku-cell");
    for (let i = 0; i < c.length; i++) if (!c[i].querySelector(".glyph-svg")) return i;
    return -1;
  });
  await page.locator(".sudoku-cell").nth(blank).click();
  await page.evaluate((idx) => {
    const input = document.querySelectorAll(".sudoku-cell input")[idx];
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, "1");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, blank);
  await page.locator(".sudoku-cell").nth(blank).locator(".glyph-svg").waitFor({ timeout: 20000 });
  await page.locator("button.logo-trigger").click();
  await page.waitForSelector(".staging-band", { timeout: 20000 });
  const viewport = page.locator(".gallery-viewport");
  await viewport.focus();
  for (let i = 0; i < 4; i++) await viewport.press("ArrowRight"); // → kenken
  await page.locator(".staging-deal").click();
  await page.waitForSelector(".gallery-guard .guard-note-sub", { timeout: 20000 });
}

/** Pass 4's read, re-taken: box, overflow against the ribbon's own clip, slack, line count. */
async function read(page) {
  return page.evaluate(() => {
    const note = document.querySelector(".gallery-guard .guard-note") ?? document.querySelector(".gallery-guard");
    const sub = document.querySelector(".gallery-guard .guard-note-sub");
    const nb = note.getBoundingClientRect();
    const sb = sub.getBoundingClientRect();
    const lh = parseFloat(getComputedStyle(sub).lineHeight) || sb.height;
    return {
      sub: sub.textContent.trim(),
      noteW: +nb.width.toFixed(2),
      noteH: +nb.height.toFixed(2),
      // The two overflows pass 4 printed: the sub's content past its own box, and the note's
      // scroll box past its border box.
      overflowX: +Math.max(0, sub.scrollWidth - sub.clientWidth).toFixed(2),
      overflowY: +Math.max(0, note.scrollHeight - note.clientHeight).toFixed(2),
      subSlackL: +(sb.left - nb.left).toFixed(2),
      subSlackR: +(nb.right - sb.right).toFixed(2),
      subLines: Math.max(1, Math.round(sb.height / lh)),
    };
  });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 320, height: 900 } });
await armBoth(page);

const shipped = await read(page);
await page.evaluate((s) => {
  document.querySelector(".gallery-guard .guard-note-sub").textContent = s;
}, LONG);
await page.waitForTimeout(120);
const stretched = await read(page);
await browser.close();

const moved =
  stretched.subLines > shipped.subLines ||
  stretched.overflowX > 0 ||
  stretched.overflowY > 0 ||
  stretched.noteH > shipped.noteH;

const rows = [
  { arm: "shipped (both)", ...shipped },
  { arm: "control: long string", ...stretched },
];
for (const r of rows)
  console.log(
    `chromium light 320  ${r.arm.padEnd(22)} ${String(r.noteW).padStart(7)}×${String(r.noteH).padStart(7)}` +
      `  overflow ${r.overflowX}/${r.overflowY}  slack ${r.subSlackL}/${r.subSlackR}` +
      `  lines ${r.subLines}  "${r.sub.slice(0, 46)}${r.sub.length > 46 ? "…" : ""}"`,
  );
console.log("");
console.log(
  `FALSIFIABILITY GATE: the instrument must MOVE on a string that cannot fit — ${moved ? "PASS" : "FAIL"}`,
);
console.log(JSON.stringify(rows));
process.exit(moved ? 0 : 1);
