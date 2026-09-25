// ring7.mjs — CTRL-TAPE pass 7 row 5: the foot's focus RING read on ALL FOUR BANDS (LAWS P6 §E) with the
// chair's four-band probe (this dir's copy, `offCss` + `station` extension stated in its head), in-run plants
// X6 (bottom erased), X4 (opacity 0.15) and FAINT (the ring ink at 15 % — the ring's own faint plant: the
// chair's FADE15 rides `color`/`stroke`, which an `outline: var(--ring-ink)` never reads). The ring's route
// is the keyboard's: one Tab sets the modality, then the verb is focused (`:focus-visible` witnessed).
//   node ring7.mjs <baseURL> <label> [engine] [scheme] [cell]
import { createRequire } from "node:module";
import os from "node:os";
import { fourBands } from "./edge-bands.mjs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [BASE, LABEL, ENG = "chromium", SCHEME = "light", CELL = "coarse1280"] = process.argv.slice(2);
const CELLS = { coarse1280: [1280, 800, true, false], rail1280: [1280, 800, false, false], dock390: [390, 844, true, true] };
const [vw, vh, touch, dock] = CELLS[CELL];
const PAYLOAD = "ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw";
const b = await pw[ENG].launch();
const ctx = await b.newContext({ baseURL: BASE, viewport: { width: vw, height: vh }, hasTouch: touch, deviceScaleFactor: 2, colorScheme: SCHEME, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto("/?board=" + PAYLOAD);
await page.waitForSelector(".board-cells", { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(900);
if (dock) { await page.locator(".drawer-tab").first().click(); await page.waitForTimeout(1200); }
const givens = await page.evaluate(() => [...document.querySelectorAll(".board-wrapper input")].map((e, i) => (/given/.test(e.getAttribute("aria-label") || "") ? `${i}:${e.value}` : null)).filter(Boolean).join(","));
// the verb: the first VISIBLE `Clear the board` inside the case
const id = await page.evaluate(() => {
  const el = [...document.querySelectorAll('.drawer-case [aria-label="Clear the board"]')].find((e) => e.getClientRects().length && getComputedStyle(e).visibility !== "hidden");
  if (!el) return null; el.setAttribute("data-ring7", "1"); return el.closest("#card-foot") ? "foot" : el.closest(".tray-well") ? "well" : "card";
});
const SUBJ = '[data-ring7="1"]';
await page.keyboard.press(ENG === "webkit" ? "Alt+Tab" : "Tab");
await page.locator(SUBJ).focus();
await page.waitForTimeout(300);
const fv = await page.evaluate((s) => document.querySelector(s)?.matches(":focus-visible"), SUBJ);
const OFF = `${SUBJ} { outline-color: transparent !important; }`;
const opts = { subject: SUBJ, edge: SUBJ, out: 8, inn: 0, offCss: OFF };
const fmt = (r) => r.bands ? Object.entries(r.bands).map(([k, v]) => `${k} ${v.coreMedian} (n${v.stations} <3:${v.fracUnder} drop${v.dropped}${v.occluder ? " occ " + v.occluder : ""})`).join(" · ") + ` | topOnly ${r.topOnly} → ${r.red ? "RED " + r.why.join("; ") : "GREEN"}` : `→ RED ${r.why.join("; ")}`;
const tag = `${LABEL} ${ENG} ${SCHEME} ${vw}x${vh} dpr2 ${touch ? "coarse" : "fine"} PRM ground=${id} focus-visible=${fv} givens=${givens}`;
let exit = 0;
for (const station of [1, 8]) {
  const clean = await fourBands(page, { ...opts, station });
  console.log(`RING ${tag} station${station} CLEAN ${fmt(clean)}`);
  if (clean.red) exit |= 1;
  const PLANTS = {
    X6_bottom_erased: `${SUBJ} { clip-path: inset(-8px -8px 16px -8px) !important; }`,
    X4_opacity_015: `${SUBJ} { opacity: 0.15 !important; }`,
    FAINT_ring_15: `${SUBJ}:focus-visible { outline-color: color-mix(in srgb, var(--ring-ink) 15%, transparent) !important; }`,
  };
  for (const [n, css] of Object.entries(PLANTS)) {
    const t = await page.addStyleTag({ content: css });
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const r = await fourBands(page, { ...opts, station });
    await t.evaluate((e) => e.remove());
    console.log(`RING ${tag} station${station} PLANT ${n} ${fmt(r)}`);
    if (!r.red) exit |= 2;
  }
}
console.log(`LOAD ${os.loadavg().map((v) => v.toFixed(2)).join(" ")}`);
await b.close();
process.exit(exit);
