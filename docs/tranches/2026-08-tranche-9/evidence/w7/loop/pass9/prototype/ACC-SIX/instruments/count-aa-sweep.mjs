// ACC-SIX pass 9 · R3: the count line's glyph AA at DPR 1 light, swept over the meta's ink rung (never banked;
// a copy rides the evidence). P16, 1280x800 fine, the product's hint x2 lays "1 of 170 on the board"; per rung
// an injected `.margin-note-meta { color: graphite N% }` and glyphPopulation(runClip) on the meta's text run.
//   node <HELPER>/count-aa-sweep.mjs --url http://127.0.0.1:4237 --engine chromium|webkit [--dpr 1] [--scheme light]
import { glyphPopulation, fmt } from "../e2e/lib/glyph-pop.mjs";
import { args, playwright, openCell, load } from "../e2e/lib/paint-lib.mjs";

const A = args();
const engine = A.engine ?? "chromium";
const dpr = Number(A.dpr ?? 1);
const colorScheme = A.scheme ?? "light";
const RUNGS = (A.rungs ?? "68,76,84,92,100").split(",").map(Number);
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
const { ctx, page } = await openCell(browser, { width: 1280, height: 800, dpr, colorScheme, reducedMotion: "reduce" });
await page.goto(A.url + "/" + BOARD);
await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
for (let k = 0; k < 2; k++) {
  await page.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click());
  await page.waitForTimeout(1500);
}
await page.waitForFunction(() => document.querySelector(".margin-note-meta")?.textContent?.trim() === "1 of 170 on the board", null, { timeout: 10000 });
await page.waitForTimeout(800);
for (const n of RUNGS) {
  const css = [".margin-note-meta", "{ color: color-mix(in srgb, var(--color-pencil-graphite) " + n + "%, transparent) !important; }"].join(" ");
  const tag = n === 68 ? null : await page.addStyleTag({ content: css });
  await page.waitForTimeout(300);
  const ink = await page.evaluate(() => getComputedStyle(document.querySelector(".margin-note-meta")).color);
  const r = await glyphPopulation(page, { subject: ".margin-note-meta", runClip: true, floor: 4.5 });
  console.log(`COUNT-AA-SWEEP ${A.label ?? "tree"} ${engine} ${colorScheme} dpr${dpr} rung ${n}% ink ${ink} ${fmt(r)}`);
  if (tag) await tag.evaluate((e) => e.remove());
}
console.log(`COUNT-AA-SWEEP done · LOAD ${load()}`);
await ctx.close();
await browser.close();
