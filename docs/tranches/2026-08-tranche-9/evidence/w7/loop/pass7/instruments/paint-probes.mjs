// paint-probes.mjs — the CLI over edge-bands.mjs and glyph-pop.mjs (T9-W7 pass 7, chair's instruments).
//   node paint-probes.mjs --url <u> --engine chromium|webkit --probe edge|glyph --subject <sel>
//     [--edge <sel>] [--scheme light|dark] [--viewport 1280x800] [--dpr 1] [--touch] [--hover <sel>]
//     [--click <sel>] [--plants] [--prm 1] [--frac-bound <n>|auto]
// Clean read first; then each plant injected, read, removed (EDGE_PLANTS / TEXT_PLANTS). The glyph probe's
// fraction bound `auto` = the CLEAN read's fraction + 0.05 (LAWS P6 §E "the shipped reading + 0.05"), taken
// from the un-planted photograph — never from a planted element's own photo.
// Exit: 0 clean GREEN and every plant RED · 1 clean RED · 3 a plant read GREEN (a hole) · 4 both.
import { createRequire } from "node:module";
import os from "node:os";
import { fourBands, EDGE_PLANTS } from "./edge-bands.mjs";
import { glyphPopulation, TEXT_PLANTS, applyTail, undoTail } from "./glyph-pop.mjs";
const require = createRequire(process.env.FE_PKG ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const A = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => { if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1]?.startsWith("--") || all[i + 1] == null ? "1" : all[i + 1]]); return acc; }, []));
const engine = A.engine ?? "chromium"; const [vw, vh] = (A.viewport ?? "1280x800").split("x").map(Number);
const browser = await pw[engine].launch();
const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: +(A.dpr ?? 1), colorScheme: A.scheme ?? "light", hasTouch: A.touch === "1", reducedMotion: A.prm === "0" ? "no-preference" : "reduce" });
const page = await ctx.newPage();
await page.goto(A.url);
await page.locator(A.ready ?? ".board-cells").first().waitFor({ timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);
if (A.hover) { await page.locator(A.hover).first().hover(); await page.waitForTimeout(900); }
if (A.click) { await page.locator(A.click).first().click(); await page.waitForTimeout(900); }
const tag = `${engine} ${A.scheme ?? "light"} ${vw}x${vh} dpr${A.dpr ?? 1} ${A.touch === "1" ? "coarse" : "fine"} ${A.prm === "0" ? "motion" : "PRM"}`;
const read = (fracBound) => A.probe === "edge" ? fourBands(page, { subject: A.subject, edge: A.edge }) : glyphPopulation(page, { subject: A.subject, fracBound, ...(A.slices ? { slices: +A.slices } : {}), ...(A["slice-q"] ? { sliceQ: +A["slice-q"] } : {}), ...(A["slice-ratio"] ? { sliceRatio: +A["slice-ratio"] } : {}) });
const fmt = (r) => A.probe === "edge"
  ? (r.bands ? Object.entries(r.bands).map(([k, b]) => `${k} ${b.coreMedian} (n${b.stations} <3:${b.fracUnder} drop${b.dropped}${b.occluder ? " occ " + b.occluder : ""}${b.firstPose ? " [first " + b.firstPose + "]" : ""})`).join(" · ") + ` | topOnly ${r.topOnly}` : "") + ` → ${r.red ? "RED " + r.why.join("; ") : "GREEN"}`
  : `pop ${r.population ?? 0} median ${r.coreMedian ?? "-"} <4.5 ${r.fracUnder ?? "-"} slices [${(r.slices ?? []).map((v) => v ?? "·").join(" ")}] transient ${r.transientPx ?? "-"} → ${r.red ? "RED " + r.why.join("; ") : "GREEN"}`;
const edgeCount = A.probe === "edge" ? await page.locator(A.edge).count() : null;
const clean = await read(null);
const bound = A["frac-bound"] === "auto" ? (clean.fracUnder ?? 0) + 0.05 : A["frac-bound"] ? +A["frac-bound"] : null;
const clean2 = A.probe === "glyph" && bound != null ? await read(bound) : clean;
console.log(`PROBE ${A.probe} ${tag} ${A.subject}${edgeCount != null ? ` [edge elements: ${edgeCount}]` : ""} CLEAN ${fmt(clean2)}${bound != null ? ` (bound ${bound.toFixed(3)})` : ""}`);
let exit = clean2.red ? 1 : 0;
if (A.plants) {
  const P = A.probe === "edge" ? EDGE_PLANTS(A.edge) : TEXT_PLANTS(A.subject);
  let hole = false;
  for (const [name, css] of Object.entries(P)) {
    const info = /^INFO_/.test(name);
    let t = null, tail = null;
    if (typeof css === "string") t = await page.addStyleTag({ content: css }); else tail = await applyTail(page, A.subject, css.tail);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const r = await read(bound);
    if (t) await t.evaluate((e) => e.remove()); else await undoTail(page, A.subject);
    if (!r.red && !info) hole = true;
    console.log(`PROBE ${A.probe} ${tag} ${A.subject} PLANT ${name}${tail ? ` (run ${JSON.stringify(tail.run)} cut ${tail.cut} of box ${tail.box})` : ""} ${fmt(r)}${info ? " [sensitivity row, not a required plant]" : ""}`);
  }
  if (hole) exit = exit ? 4 : 3;
}
console.log(`LOAD ${os.loadavg().map((v) => v.toFixed(2)).join(" ")}`);
await browser.close();
process.exit(exit);
