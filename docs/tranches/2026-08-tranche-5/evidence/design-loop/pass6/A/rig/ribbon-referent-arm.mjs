/**
 * ribbon-referent-arm — ONE INSTRUMENT, ONE TREE, ONE RUN, BOTH PUBLISHED NUMBERS (pass-6 Lane A,
 * order 3 / A5-G4).
 *
 * THE ROW. Pass 4 published the ribbon's sub-line slack at 320 as 51.96 / 41.40 / 31.73 (select /
 * target / both). Pass 5 re-measured the `both` cell on a re-authored instrument and read 45.33.
 * The reconciliation offered was "two trees and two instruments apart" — which is the honest
 * statement of an unreconciled number, not a reconciliation. Both readings were taken on a BUILT
 * DIST at 320 CSS px, and both report the same note box (255.83 × 106.2) for the same string, so
 * neither the harness nor the layout moved. The only free variable left is the REFERENT the slack
 * is measured from.
 *
 * THE HYPOTHESIS, stated before the run: pass 4 measured the sub against the note's CONTENT box,
 * pass 5 against its BORDER box, and the gap is `.guard-note`'s own horizontal padding
 * (`0.85rem` = 13.60px), a constant that cannot depend on the string. 45.33 − 31.73 = 13.60 and
 * 45.34 − 31.74 = 13.60 — exact on both sides, which is what a padding offset looks like and what
 * a tree move or a font swap does not.
 *
 * THE ARM. This instrument reads BOTH referents off the SAME rect, in the same run, on the same
 * tree, for all three shipped sub-lines, and gates the content-box column against pass 4's banked
 * 320 row (`pass4/logs/A/ribbon-geom.json`). It carries its own falsifier: the same comparison is
 * re-run against the BORDER-box column and MUST fail. A rig where both columns pass is a rig that
 * cannot tell the two referents apart, and it exits non-zero.
 *
 * THE THREE STATES. Pass 4's own finding is that the note's rect is identical across select /
 * target / both at every width, so the three sub-lines are read by substituting the shipped string
 * into the armed ribbon rather than by arming three journeys. The instrument re-prints noteW/noteH
 * on every read, so that identity is re-proven here rather than borrowed.
 *
 * THE RETIRED COLUMN (order 2 / A5-G2). `overflow` is printed under RETIRED and is never gated:
 * pass 5's long-string arm showed it reads 0/0 even on a string that cannot fit — the note grows,
 * it does not clip — so it is a property the layout cannot violate. `subLines` and `noteH` are the
 * load-bearing columns and are printed as such.
 *
 *   node ribbon-referent-arm.mjs <baseURL>
 */
import { chromium } from "@playwright/test";

const base = process.argv[2];
if (!base) throw new Error("usage: node ribbon-referent-arm.mjs <baseURL>");

/** Pass 4's banked 320 row, chromium/light, transcribed from `pass4/logs/A/ribbon-geom.json`. */
const PASS4_320 = {
  "your marks aren't saved": [51.96, 51.98],
  "kenken's marks aren't saved": [41.4, 41.4],
  "neither board's marks are saved": [31.73, 31.74],
};
const TOL = 0.05;

/** The `both` state: a dirty mounted sudoku AND a target card whose ledger holds user moves.
 *  Verbatim from pass 5's `ribbon-geom-longstring.mjs` — the arming is not what is under test. */
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

/** One rect, four referents. The BORDER column is pass 5's read; the CONTENT column subtracts the
 *  note's own padding; the TEXT column is the `<p>` the sub actually lives in, printed so the
 *  content-box reading is disambiguated from a shrink-to-fit text block rather than assumed. */
async function read(page) {
  return page.evaluate(() => {
    const note = document.querySelector(".gallery-guard .guard-note");
    const text = document.querySelector(".gallery-guard .guard-note-text");
    const sub = document.querySelector(".gallery-guard .guard-note-sub");
    const nb = note.getBoundingClientRect();
    const tb = text.getBoundingClientRect();
    const sb = sub.getBoundingClientRect();
    const cs = getComputedStyle(note);
    const padL = parseFloat(cs.paddingLeft);
    const padR = parseFloat(cs.paddingRight);
    const lh = parseFloat(getComputedStyle(sub).lineHeight) || sb.height;
    const r2 = (n) => +n.toFixed(2);
    return {
      sub: sub.textContent.trim(),
      noteW: r2(nb.width),
      noteH: r2(nb.height),
      padL: r2(padL),
      padR: r2(padR),
      borderL: r2(sb.left - nb.left),
      borderR: r2(nb.right - sb.right),
      contentL: r2(sb.left - (nb.left + padL)),
      contentR: r2(nb.right - padR - sb.right),
      textL: r2(sb.left - tb.left),
      textR: r2(tb.right - sb.right),
      // RETIRED — printed, never gated (A5-G2). Reads 0/0 on a string that cannot fit.
      overflowX: r2(Math.max(0, sub.scrollWidth - sub.clientWidth)),
      overflowY: r2(Math.max(0, note.scrollHeight - note.clientHeight)),
      subLines: Math.max(1, Math.round(sb.height / lh)),
    };
  });
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 320, height: 900 },
  deviceScaleFactor: 2, // pass 4's DPR
});
await armBoth(page);

const rows = [];
for (const s of Object.keys(PASS4_320)) {
  await page.evaluate((str) => {
    document.querySelector(".gallery-guard .guard-note-sub").textContent = str;
  }, s);
  await page.waitForTimeout(120);
  rows.push(await read(page));
}
await browser.close();

const hdr = (label) => `${label.padEnd(34)}`;
console.log("chromium light 320 · built dist · DPR2 · LOAD-BEARING: subLines, noteH\n");
for (const r of rows) {
  const [p4l, p4r] = PASS4_320[r.sub];
  console.log(
    `${hdr(`"${r.sub}"`)} note ${r.noteW}×${r.noteH}  lines ${r.subLines}` +
      `  slack[border] ${r.borderL}/${r.borderR}` +
      `  slack[content] ${r.contentL}/${r.contentR}` +
      `  slack[text] ${r.textL}/${r.textR}` +
      `  pass4 ${p4l}/${p4r}  pad ${r.padL}/${r.padR}`,
  );
}
console.log("");
for (const r of rows)
  console.log(
    `RETIRED (A5-G2)  ${hdr(`"${r.sub}"`)} overflow ${r.overflowX}/${r.overflowY}` +
      ` — not gated: 0/0 is unfalsifiable on this layout`,
  );

/** BORN-RED: `ABLATE=padding` drops the one term the reconciliation rests on — the content
 *  referent stops subtracting the note's padding — and every gate below must red. Run it, bank it,
 *  or the gate is not known to be able to fail. */
if (process.env.ABLATE === "padding") {
  console.log("\nABLATION: padding term dropped from the CONTENT referent — the gate must RED.");
  for (const r of rows) {
    r.contentL = r.borderL;
    r.contentR = r.borderR;
  }
}

const near = (a, b) => Math.abs(a - b) <= TOL;
const contentOk = rows.every((r) => {
  const [l, rr] = PASS4_320[r.sub];
  return near(r.contentL, l) && near(r.contentR, rr);
});
const borderOk = rows.every((r) => {
  const [l, rr] = PASS4_320[r.sub];
  return near(r.borderL, l) && near(r.borderR, rr);
});
const padHolds = rows.every(
  (r) => near(r.borderL - r.contentL, r.padL) && near(r.borderR - r.contentR, r.padR),
);

console.log("");
console.log(
  `RECONCILIATION GATE — pass 4's 320 row reproduces on the CONTENT referent (±${TOL}px), all three states: ${contentOk ? "PASS" : "FAIL"}`,
);
console.log(
  `FALSIFIER — the same comparison on the BORDER referent must NOT pass: ${borderOk ? "FAIL (the rig cannot tell the referents apart)" : "PASS (it reds, as it must)"}`,
);
console.log(
  `IDENTITY — border − content == the note's own padding, both sides, all three: ${padHolds ? "PASS" : "FAIL"}`,
);
console.log(JSON.stringify(rows));
process.exit(contentOk && !borderOk && padHolds ? 0 : 1);
