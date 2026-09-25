// ring-bands.mjs — CTRL-FACE pass 7, charter row 1: the focus ring read as PAINT on all four bands.
// A CLI over the chair's `fourBands` (this dir's copy carries the PROPOSED `off`/`window` options; see
// edge-bands.PROPOSED.diff). The ring is an OUTLINE, not an element, so edge-OFF is the same element with
// `outline-color: transparent` — every other pixel of the chip is identical ON and OFF.
//   node ring-bands.mjs --url <u> --engine chromium|webkit --site <sel> [--scheme light|dark] [--viewport WxH]
//     [--dpr 1] [--touch] [--window 1]
// Plants (each must RED): X1 opacity 0 on the ringed control; FAINT15 the ring ink at 15 %; X6 the bottom
// band clipped away (a top-band-only row passes it). Exit 0 clean GREEN + every plant RED · 1 clean RED ·
// 3 a plant GREEN · 4 both.
import { createRequire } from "node:module";
import os from "node:os";
import { fourBands } from "./edge-bands.mjs";
const require = createRequire(process.env.FE_PKG ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const A = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => { if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1]?.startsWith("--") || all[i + 1] == null ? "1" : all[i + 1]]); return acc; }, []));
const engine = A.engine ?? "chromium"; const [vw, vh] = (A.viewport ?? "1280x800").split("x").map(Number);
const browser = await pw[engine].launch();
const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: +(A.dpr ?? 1), colorScheme: A.scheme ?? "light", hasTouch: A.touch === "1", isMobile: false, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(A.url);
await page.locator(".board-cells").first().waitFor({ timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);
const tag = `${engine} ${A.scheme ?? "light"} ${vw}x${vh} dpr${A.dpr ?? 1} ${A.touch === "1" ? "coarse" : "fine"} PRM`;
if (A.touch === "1" && A.open) { await page.locator(A.open).first().tap(); await page.waitForTimeout(900); }
const S = "[data-ring-probe]";
const focus = async () => {
  await page.keyboard.press("Tab");
  const ok = await page.evaluate((sel) => {
    document.querySelectorAll("[data-ring-probe]").forEach((e) => e.removeAttribute("data-ring-probe"));
    const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
    const el = [...(card ?? document).querySelectorAll(sel)].find((e) => e.getClientRects().length);
    if (!el) return null;
    el.setAttribute("data-ring-probe", ""); el.scrollIntoView({ block: "center" }); el.focus();
    const cs = getComputedStyle(el);
    return { fv: el.matches(":focus-visible"), style: cs.outlineStyle, color: cs.outlineColor, offset: cs.outlineOffset, width: cs.outlineWidth, text: el.textContent.trim().slice(0, 20), selected: el.getAttribute("aria-pressed") ?? el.getAttribute("aria-checked") ?? el.getAttribute("aria-selected") };
  }, A.site);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  return ok;
};
const opts = { subject: S, edge: S, out: 8, inn: 0, off: `${S} { outline-color: transparent !important; }`, window: +(A.window ?? 1) };
const fmt = (r) => (r.bands ? Object.entries(r.bands).map(([k, b]) => `${k} ${b.coreMedian} (n${b.stations} <3:${b.fracUnder} drop${b.dropped}${b.occluder ? " occ " + b.occluder : ""})`).join(" · ") + ` | topOnly ${r.topOnly}` : "") + ` → ${r.red ? "RED " + r.why.join("; ") : "GREEN"}`;
const who = await focus();
if (!who) { console.log(`RING ${tag} ${A.site} NO SUBJECT → RED`); await browser.close(); process.exit(1); }
const clean = await fourBands(page, opts);
console.log(`RING ${tag} ${A.site} "${who.text}" sel=${who.selected} fv=${who.fv} ${who.style} ${who.width} off ${who.offset} ${who.color} window ${opts.window} CLEAN ${fmt(clean)}`);
let exit = clean.red ? 1 : 0, hole = false;
const PLANTS = {
  X1_opacity0: `${S} { opacity: 0 !important; }`,
  FAINT15_ring: `${S} { outline-color: color-mix(in srgb, var(--ring-ink) 15%, transparent) !important; }`,
  X6_bottom_erased: `${S} { clip-path: inset(-12px -12px 12px -12px) !important; }`,
};
for (const [name, css] of Object.entries(PLANTS)) {
  const t = await page.addStyleTag({ content: css });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const still = await page.evaluate(() => !!document.activeElement?.matches("[data-ring-probe]:focus-visible"));
  const r = await fourBands(page, opts);
  await t.evaluate((e) => e.remove());
  if (!r.red) hole = true;
  console.log(`RING ${tag} ${A.site} PLANT ${name} (focus-visible held ${still}) ${fmt(r)}`);
}
if (hole) exit = exit ? 4 : 3;
console.log(`LOAD ${os.loadavg().map((v) => v.toFixed(2)).join(" ")}`);
await browser.close();
process.exit(exit);
