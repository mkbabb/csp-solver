// ring8.mjs — CTRL-TAPE pass 8 charter row 5: the foot's focus RING read at the CHAIR'S STATION (station 1,
// estate-wide, pass8/CHAIR-RULINGS §2.7) through the edge-bands PRODUCT HOME, with the home's own plant set
// (EDGE_PLANTS incl. DASH_1IN8, the dash-thinning plant) plus the ring's own FAINT plant (an outline ink at
// 15 %: the home's FADE15 re-sets every painted colour, and this one rides the ring token itself). No
// re-parameterising: station, holes (0.02), floor (3.0), thick (2) are the home's defaults. The route is the
// keyboard's (one Tab sets the modality, then the verb is focused, `:focus-visible` witnessed).
//   node ring8.mjs <baseURL> <label> [engine] [scheme] [cell] <home: path to e2e/lib/edge-bands.mjs>
import { createRequire } from "node:module";
import os from "node:os";
const [BASE, LABEL, ENG = "chromium", SCHEME = "light", CELL = "coarse1280", HOME] = process.argv.slice(2);
const { edgeGate, fmt, EDGE_PLANTS } = await import(HOME);
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const CELLS = { coarse1280: [1280, 800, true, false], rail1440: [1440, 900, false, false], dock390: [390, 844, true, true] };
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
const id = await page.evaluate(() => {
  const el = [...document.querySelectorAll('.drawer-case [aria-label="Clear the board"]')].find((e) => e.getClientRects().length && getComputedStyle(e).visibility !== "hidden");
  if (!el) return null; el.setAttribute("data-ring8", "1"); return el.closest("#card-foot") ? "foot" : el.closest(".tray-well") ? "well" : "card";
});
const SUBJ = '[data-ring8="1"]';
await page.keyboard.press(ENG === "webkit" ? "Alt+Tab" : "Tab");
await page.locator(SUBJ).focus();
await page.waitForTimeout(300);
const fv = await page.evaluate((s) => document.querySelector(s)?.matches(":focus-visible"), SUBJ);
const ring = await page.evaluate((s) => { const c = getComputedStyle(document.querySelector(s)); return `${c.outlineStyle} ${c.outlineWidth} off ${c.outlineOffset}`; }, SUBJ);
const OFF = `${SUBJ} { outline-color: transparent !important; }`;
const plants = { ...EDGE_PLANTS(SUBJ), FAINT_ring_15: `${SUBJ}:focus-visible { outline-color: color-mix(in srgb, var(--ring-ink) 15%, transparent) !important; }` };
const g = await edgeGate(page, { subject: SUBJ, edge: SUBJ, off: OFF, out: 8, inn: 0, plants });
const tag = `${LABEL} ${ENG} ${SCHEME} ${vw}x${vh} dpr2 ${touch ? "coarse" : "fine"} PRM ground=${id} focus-visible=${fv} ring=[${ring}] station1`;
let exit = g.clean.red ? 1 : 0;
console.log(`RING ${tag} CLEAN ${fmt(g.clean)}`);
for (const [n, r] of Object.entries(g.plants)) {
  if (!r.red && !r.noop && !r.info) exit |= 2;
  console.log(`RING ${tag} PLANT ${n} ${fmt(r)}${r.info ? " [sensitivity row]" : ""}`);
}
console.log(`LOAD ${os.loadavg().map((v) => v.toFixed(2)).join(" ")}`);
await b.close();
process.exit(exit);
