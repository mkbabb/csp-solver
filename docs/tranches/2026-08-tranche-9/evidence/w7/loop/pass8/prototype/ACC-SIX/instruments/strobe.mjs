// ACC-SIX pass 8 · THE HOLD'S LOSS, priced over a sample of deals (charter row 6). Pass 7's p7-strobe re-pointed
// at the product homes: playwright and the photograph decode come from e2e/lib/paint-lib.mjs (no sharp, no
// absolute node_modules path). Per engine, ONE phone cell (CELL=WxH, coarse: hasTouch, DPR 2, PRM): N-1 fresh
// 9x9 deals (EASY/MEDIUM/HARD in turn, dealt once on the first engine and replayed by `?board=`) plus P16. Each
// deal is played hint-first, PRESSES times; after every press (settled 700 ms) the count's paint is read as
// shown minus hidden (`onOff`, visibility) on its text run's rect. Printed per deal: w:px per press.
// LOSS = the lesson's writes the player makes with the count HELD gone (w ≥ 1 and px 0 before the lift),
// and the deals whose count is gone from their FIRST write (the hold's cost the charter asks named).
//   CELL=812x375 N=10 ENGINES=chromium,webkit node .acc6p8/strobe.mjs --url http://127.0.0.1:4237 --out <json>
import { writeFileSync } from "node:fs";
import { args, playwright, openCell, onOff, lum, load } from "../e2e/lib/paint-lib.mjs";

const A = args();
const [W, H] = (process.env.CELL || "812x375").split("x").map(Number);
const N = +(process.env.N || 10),
  PRESSES = +(process.env.PRESSES || 8);
const PW = playwright();
const b64u = (x) => Buffer.from(x, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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
const BOARD16 = "?board=" + b64u(String.fromCharCode(1) + "4." + SOL16.map((v, i) => (KEEP.has(i) ? v.toString(36) : "0")).join(""));

const DEALS = [],
  TIERS = [];
{
  const br = await PW.chromium.launch();
  const seen = new Set();
  for (let i = 0; DEALS.length < N - 1 && i < 60; i++) {
    const tier = ["EASY", "MEDIUM", "HARD"][i % 3];
    const ctx = await br.newContext();
    const page = await ctx.newPage();
    await page.goto(A.url + "/?size=3&difficulty=" + tier);
    await page.waitForSelector(".sudoku-cell input");
    await page.waitForTimeout(1500);
    const puz = await page.evaluate(() => Array.from(document.querySelectorAll(".sudoku-cell input")).map((x) => x.value || "0").join(""));
    if (/^[0-9]{81}$/.test(puz) && !seen.has(puz)) {
      seen.add(puz);
      DEALS.push("?board=" + b64u(String.fromCharCode(1) + "3." + puz));
      TIERS.push(tier + ":" + puz.replace(/0/g, "").length + "g");
    }
    await ctx.close();
  }
  await br.close();
}
DEALS.push(BOARD16);
TIERS.push("P16");

async function metaPx(page) {
  // the note sits below the fold on a landscape phone (812x375: the first run read "no run" on every press,
  // the rect's y past innerHeight): bring the NOTE into view (a scroll, no layout change) before reading it
  await page.evaluate(() => document.querySelector(".margin-note-block, .margin-note")?.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(120);
  const r = await page.evaluate(() => {
    const m = document.querySelector(".margin-note-meta");
    if (!m) return null;
    const rg = document.createRange();
    rg.selectNodeContents(m);
    const t = rg.getBoundingClientRect();
    const v = document.querySelector(".margin-note")?.getBoundingClientRect();
    return { x: t.x, y: t.y, w: t.width, h: t.height, row2: !!v && v.height > 0 && t.top > v.top + v.height / 2, text: m.textContent.trim(), ih: innerHeight };
  });
  if (!r) return { px: 0, why: "absent" };
  const clip = { x: Math.max(0, Math.floor(r.x) - 2), y: Math.max(0, Math.floor(r.y) - 2), width: Math.ceil(r.w) + 4, height: Math.ceil(r.h) + 4 };
  clip.height = Math.max(0, Math.min(clip.height, r.ih - clip.y));
  if (clip.height < 2 || clip.width < 5) return { px: 0, why: "no run", text: r.text, row2: r.row2 };
  const { on, off } = await onOff(page, clip, ".margin-note-meta { visibility: hidden !important; }");
  let n = 0;
  for (let k = 0; k < on.w * on.h; k++) if (Math.abs(lum(on.data, k * 3) - lum(off.data, k * 3)) > 0.01) n++;
  return { px: n, row2: r.row2, text: r.text };
}
const out = { cell: `${W}x${H}`, deals: DEALS, tiers: TIERS, rows: [] };
for (const e of (process.env.ENGINES || "chromium,webkit").split(",")) {
  const br = await PW[e].launch();
  for (const [di, deal] of DEALS.entries()) {
    const { ctx, page } = await openCell(br, { width: W, height: H, dpr: 2, hasTouch: true, reducedMotion: "reduce" });
    await page.goto(A.url + "/" + deal);
    await page.waitForSelector(".sudoku-cell", { timeout: 90000 });
    await page.waitForTimeout(1500);
    const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
    const trace = [];
    let lifted = false;
    for (let k = 0; k < PRESSES; k++) {
      await page.evaluate(() => {
        const i = Array.from(document.querySelectorAll(".sudoku-cell input")).find((x) => !x.value);
        i?.focus();
        document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click();
      });
      await page.waitForTimeout(700);
      const w = await page.evaluate(() => Number(document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuetext")?.split(" ")[0] ?? -1));
      const voice = await page.evaluate(() => document.querySelector(".margin-note")?.textContent?.trim() ?? "");
      const p = await metaPx(page);
      if (w >= 3 && !p.text) lifted = true;
      trace.push({ k: k + 1, w, voice: voice.slice(0, 48), px: p.px, row2: p.row2 ?? null, lifted });
    }
    const inLesson = trace.filter((t) => !t.lifted && t.w >= 1);
    const row = {
      engine: e,
      deal: TIERS[di],
      coarse,
      load: load(),
      trace: trace.map((t) => `${t.w}:${t.px ?? "?"}${t.row2 ? "r2" : ""}${t.lifted ? "L" : ""}`).join(" "),
      laid: trace.some((t) => (t.px ?? 0) > 0),
      heldWrites: inLesson.filter((t) => (t.px ?? 0) === 0).length,
      lessonWrites: inLesson.length,
      goneFromFirstWrite: inLesson.length > 0 && (inLesson[0].px ?? 0) === 0,
      blinks: (() => {
        let b = 0, seen = false, hid = false;
        for (const t of trace) {
          if (t.lifted) break;
          const on = (t.px ?? 0) > 0;
          if (on && hid) (b++, (hid = false));
          if (on) seen = true;
          else if (seen) hid = true;
        }
        return b;
      })(),
      row2: trace.filter((t) => t.row2).length,
    };
    out.rows.push(row);
    console.log(`STROBE ${out.cell} ${e} ${row.deal} coarse ${coarse} load ${row.load} | w:px ${row.trace} | held ${row.heldWrites}/${row.lessonWrites} goneFromFirst ${row.goneFromFirstWrite} blinks ${row.blinks} row2 ${row.row2}`);
    await ctx.close();
  }
  await br.close();
}
const agg = {};
for (const r of out.rows) {
  const a = (agg[r.engine] ??= { deals: 0, laid: 0, goneFromFirstWrite: 0, heldWrites: 0, lessonWrites: 0, blinks: 0, row2: 0 });
  a.deals++;
  a.laid += r.laid;
  a.goneFromFirstWrite += r.goneFromFirstWrite;
  a.heldWrites += r.heldWrites;
  a.lessonWrites += r.lessonWrites;
  a.blinks += r.blinks;
  a.row2 += r.row2;
}
out.agg = agg;
console.log(`STROBE ${out.cell} AGG ${JSON.stringify(agg)}`);
if (A.out) writeFileSync(A.out, JSON.stringify(out, null, 1));
