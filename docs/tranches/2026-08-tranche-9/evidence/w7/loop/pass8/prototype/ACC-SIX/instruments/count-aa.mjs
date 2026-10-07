// ACC-SIX pass 8 · the count line's GLYPH-TEXT AA (charter row 5), through the ONE glyph-pop home.
// P16 (86 givens, 170 writable), 1280x800 (the pair fits, the count stays), the product's hint x2 → the
// count "1 of 170 on the board" laid in its zero-height box; glyphGate on `.margin-note-meta` (the clip
// is the text run: PROPOSED run-clip), every plant in the same run. Cells: engine × theme × DPR 1/2 ×
// {reduce, no-preference} (LAWS P7 §E (i): the regime the photograph does not emulate is read too).
//   node .acc6p8/count-aa.mjs --url http://127.0.0.1:4237 [--engine chromium|webkit] [--label tree]
import { glyphGate, fmt } from "../e2e/lib/glyph-pop.mjs";
import { args, playwright, openCell, load } from "../e2e/lib/paint-lib.mjs";

const A = args();
const engine = A.engine ?? "chromium";
const browser = await playwright()[engine].launch();
function mulberry(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const SOL16 = Array.from({ length: 256 }, (_, i) => ((4 * (Math.floor(i / 16) % 4) + Math.floor(Math.floor(i / 16) / 4) + (i % 16)) % 16) + 1);
const rnd = mulberry(20260923);
const idx = [...Array(256).keys()];
for (let i = 255; i > 0; i--) {
  const j = Math.floor(rnd() * (i + 1));
  [idx[i], idx[j]] = [idx[j], idx[i]];
}
const KEEP = new Set(idx.slice(0, 86));
const PUZ = SOL16.map((v, i) => (KEEP.has(i) ? v.toString(36) : "0")).join("");
const BOARD = "?board=" + Buffer.from(String.fromCharCode(1) + "4." + PUZ, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
let cleanRed = 0,
  hole = 0;
for (const colorScheme of ["light", "dark"])
  for (const dpr of [1, 2])
    for (const reducedMotion of ["reduce", "no-preference"]) {
      const { ctx, page } = await openCell(browser, { width: 1280, height: 800, dpr, colorScheme, reducedMotion });
      await page.goto(A.url + "/" + BOARD);
      await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);
      for (let k = 0; k < 2; k++) {
        await page.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click());
        await page.waitForTimeout(1500);
      }
      await page.waitForFunction(() => document.querySelector(".margin-note-meta")?.textContent?.trim() === "1 of 170 on the board", null, { timeout: 10000 });
      await page.waitForTimeout(800);
      const ink = await page.evaluate(() => getComputedStyle(document.querySelector(".margin-note-meta")).color);
      const g = await glyphGate(page, { subject: ".margin-note-meta", payload: `p16-laid-1280-${colorScheme}-dpr${dpr}` });
      const tag = `${A.label ?? "tree"} ${engine} ${colorScheme} dpr${dpr} ${reducedMotion}`;
      console.log(`COUNT-AA ${tag} ink ${ink} CLEAN ${fmt(g.clean)} (bound ${g.bound?.toFixed(3)})`);
      if (g.clean.red) cleanRed++;
      for (const [k, r] of Object.entries(g.plants)) {
        if (!r.red) hole++;
        console.log(`COUNT-AA ${tag} PLANT ${k} ${r.red ? "RED" : "GREEN ← a hole"} median ${r.coreMedian ?? "-"}`);
      }
      await ctx.close();
    }
console.log(`COUNT-AA ${engine} clean RED ${cleanRed}/8 · plants GREEN ${hole} · LOAD ${load()}`);
await browser.close();
process.exit(cleanRed ? (hole ? 4 : 1) : hole ? 3 : 0);
