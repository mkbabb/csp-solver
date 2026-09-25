// ACC-SIX pass 7 · THE STROBE, PRICED OVER A SAMPLE OF DEALS (charter row 2; registry-v6 §2.12; pass-6 critique §2.4).
// Per arm, per engine, one phone cell (393x699 coarse, hasTouch witnessed, PRM reduce): N deals — fresh 9x9 deals at
// EASY/MEDIUM/HARD by the product's own `?size=3&difficulty=` route, plus the pinned 16x16 payload (P16) — each played
// hint-first: the product's Hint pressed up to PRESSES times (press 1 names, press 2 writes, ...), and after every press
// (settled 700 ms) the count's PAINT is read: its text rect photographed shown minus hidden (visibility), changed px
// (the pass-6 critic's c6 statistic), plus whether it sits on the voice's row. A BLINK is the count painted, then 0 px,
// then painted again, all inside the lesson (before its lift). Printed per deal: the px trace, the voice at each press.
// usage: ARMS='tree=http://127.0.0.1:4237,pass6=http://127.0.0.1:4241' N=10 ENGINES=chromium,webkit node p7-strobe.mjs <out.json>
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { chromium, webkit, BOARD16 } from "./p7-common.mjs";
const ARMS = Object.fromEntries((process.env.ARMS || "tree=http://127.0.0.1:4237").split(",").map((a) => a.split("=")));
const N = +(process.env.N || 10), PRESSES = +(process.env.PRESSES || 8);
const ENG = { chromium, webkit };
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const load = () => execSync("uptime").toString().split("averages:")[1]?.trim().split(" ")[0];
// THE SAMPLE IS PAIRED AND DISTINCT (pass 7, second cut: the first cut's EASY and MEDIUM deals repeated one bank
// template each, so 10 deals were 6 boards; a board is now kept only once): N-1 fresh 9x9 deals are dealt ONCE (the first arm's server, chromium, EASY/MEDIUM/HARD in turn),
// their givens read back from the inputs and re-encoded in the product's `?board=` codec, so every arm and engine plays
// the SAME boards; P16 is the Nth.
const b64u = (x) => Buffer.from(x, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const DEALS = [], TIERS = [];
{ const br = await chromium.launch(); const base0 = Object.values(ARMS)[0];
  const seen = new Set();
  for (let i = 0; DEALS.length < N - 1 && i < 60; i++) { const tier = ["EASY", "MEDIUM", "HARD"][i % 3]; const ctx = await br.newContext(); const page = await ctx.newPage();
    await page.goto(base0 + "/?size=3&difficulty=" + tier); await page.waitForSelector(".sudoku-cell input"); await page.waitForTimeout(1500);
    const puz = await page.evaluate(() => Array.from(document.querySelectorAll(".sudoku-cell input")).map((x) => x.value || "0").join(""));
    if (/^[0-9]{81}$/.test(puz) && !seen.has(puz)) { seen.add(puz); DEALS.push("?board=" + b64u(String.fromCharCode(1) + "3." + puz)); TIERS.push(tier + ":" + puz.replace(/0/g, "").length + "g"); }
    await ctx.close(); }
  await br.close(); }
DEALS.push(BOARD16); TIERS.push("P16");
async function metaPx(page) {
  const clip = await page.evaluate(() => { const m = document.querySelector(".margin-note-meta"); if (!m) return null; const r = document.createRange(); r.selectNodeContents(m); const t = r.getBoundingClientRect(); const v = document.querySelector(".margin-note")?.getBoundingClientRect(); return { x: Math.max(0, Math.floor(t.x) - 2), y: Math.max(0, Math.floor(t.y) - 2), width: Math.ceil(t.width) + 4, height: Math.ceil(t.height) + 4, row2: !!v && v.height > 0 && t.top > v.top + v.height / 2, text: m.textContent.trim() }; });
  if (!clip) return { px: 0, why: "absent" };
  const { row2, text } = clip; delete clip.row2; delete clip.text;
  const ih = await page.evaluate(() => innerHeight); clip.height = Math.max(0, Math.min(clip.height, ih - clip.y)); if (clip.height < 2) return { px: null, why: "offscreen", text };
  const S = await page.screenshot({ clip }); await page.evaluate(() => document.querySelector(".margin-note-meta")?.style.setProperty("visibility", "hidden")); await page.waitForTimeout(80);
  const H = await page.screenshot({ clip }); await page.evaluate(() => document.querySelector(".margin-note-meta")?.style.removeProperty("visibility"));
  const a = await sharp(S).raw().toBuffer({ resolveWithObject: true }), b = await sharp(H).raw().toBuffer(); let n = 0;
  for (let i = 0; i < a.data.length; i += a.info.channels) if (Math.abs(lin(a.data[i]) - lin(b[i])) + Math.abs(lin(a.data[i + 1]) - lin(b[i + 1])) + Math.abs(lin(a.data[i + 2]) - lin(b[i + 2])) > 0.03) n++;
  return { px: n, row2, text };
}
const blinks = (trace) => { let b = 0, seen = false, hid = false; for (const t of trace) { if (t.lifted) break; const on = (t.px ?? 0) > 0; if (on && hid) { b++; hid = false; } if (on) seen = true; else if (seen) hid = true; } return b; };
const out = { deals: DEALS, tiers: TIERS, rows: [] };
for (const e of (process.env.ENGINES || "chromium,webkit").split(",")) { const br = await ENG[e].launch();
  for (const [arm, base] of Object.entries(ARMS)) for (const [di, deal] of DEALS.entries()) {
    const ctx = await br.newContext({ viewport: { width: 393, height: 699 }, deviceScaleFactor: 2, hasTouch: true, reducedMotion: "reduce" });
    const page = await ctx.newPage(); await page.goto(base + "/" + deal); await page.waitForSelector(".sudoku-cell", { timeout: 90000 }); await page.waitForTimeout(1500);
    const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
    const trace = []; let lifted = false;
    for (let k = 0; k < PRESSES; k++) {
      await page.evaluate(() => { const i = Array.from(document.querySelectorAll(".sudoku-cell input")).find((x) => !x.value); i?.focus(); document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click(); });
      await page.waitForTimeout(700);
      const w = await page.evaluate(() => Number(document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuetext")?.split(" ")[0] ?? -1));
      const voice = await page.evaluate(() => document.querySelector(".margin-note")?.textContent?.trim() ?? "");
      const p = await metaPx(page);
      if (w >= 3 && !p.text) lifted = true;
      trace.push({ k: k + 1, w, voice: voice.slice(0, 48), px: p.px, row2: p.row2 ?? null, lifted });
    }
    const row = { engine: e, arm, deal: TIERS[di], payload: deal.slice(0, 40), coarse, load: load(), trace: trace.map((t) => `${t.w}:${t.px ?? "?"}${t.row2 ? "r2" : ""}`).join(" "), blinks: blinks(trace), laid: trace.some((t) => (t.px ?? 0) > 0), yieldedInLesson: trace.some((t, i) => !t.lifted && t.w > 0 && t.w < 3 && (t.px ?? 0) === 0 && trace.slice(0, i).some((u) => (u.px ?? 0) > 0)), voices: [...new Set(trace.map((t) => t.voice))].slice(0, 4) };
    out.rows.push(row); console.error(e, arm, row.deal, "coarse", coarse, "load", row.load, "| w:px", row.trace, "| blinks", row.blinks, "yielded", row.yieldedInLesson);
    await ctx.close();
  } await br.close(); }
const agg = {}; for (const r of out.rows) { const k = `${r.engine}/${r.arm}`; const a = (agg[k] ??= { deals: 0, laid: 0, yielded: 0, blinks: 0, dealsWithBlink: 0 }); a.deals++; a.laid += r.laid; a.yielded += r.yieldedInLesson; a.blinks += r.blinks; a.dealsWithBlink += r.blinks > 0; }
out.agg = agg; console.error(JSON.stringify(agg)); writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
