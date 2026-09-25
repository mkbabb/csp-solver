// notes-stroke.mjs — CTRL-TAPE pass 7, INTAKE-22 row 21: each rail hover note's box against the lip's PAINTED
// bottom stroke (not its svg box). Per verb in the foot: hover, poll the note's opacity to rest, read its box;
// the lip's ink = pixels that change when the frame is hidden (two independent pairs intersected, PRM parks the
// beat — the pass-7 inset row's read). Reports: the stroke's lowest ink row under the note's x-span, the note's
// top, and the px² of note box over lip ink (INTAKE row 21's gate: 0 px², or the berth re-homed).
//   node notes-stroke.mjs <baseURL> [engine] [WxH]
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs";
const [BASE, ENG = "chromium", VP = "1440x900"] = process.argv.slice(2);
const [vw, vh] = VP.split("x").map(Number);
const PAYLOAD = "ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw";
const b = await (ENG === "webkit" ? webkit : chromium).launch();
const ctx = await b.newContext({ baseURL: BASE, viewport: { width: vw, height: vh }, deviceScaleFactor: 2, reducedMotion: "reduce" });
const page = await ctx.newPage(); await page.goto("/?board=" + PAYLOAD); await page.waitForSelector(".action-bar", { state: "attached" }); await page.waitForTimeout(900);
const bar = await page.evaluate(() => { const r = document.querySelector("#card-foot .action-bar").getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; });
const clip = { x: Math.floor(bar.l - 8), y: Math.floor(bar.b - 4), width: Math.ceil(bar.r - bar.l + 16), height: 20 };
const raw = async () => { const buf = await page.screenshot({ clip, scale: "device", animations: "disabled" }); return sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true }); };
const pair = async () => { const on = await raw(); const t = await page.addStyleTag({ content: ".bar-frame svg { visibility: hidden !important }" }); await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))); const off = await raw(); await t.evaluate((e) => e.remove()); return { on, off }; };
const [p1, p2] = [await pair(), await pair()];
const W = p1.on.info.width, H = p1.on.info.height;
const ink = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) { const o = i * 3; const d = (p) => Math.max(...[0, 1, 2].map((k) => Math.abs(p.on.data[o + k] - p.off.data[o + k]))); ink[i] = d(p1) > 24 && d(p2) > 24 ? 1 : 0; }
const verbs = await page.evaluate(() => [...document.querySelectorAll("#card-foot .action-verbs > button, #card-foot .action-bar > .info-btn")].filter((e) => e.getClientRects().length).map((e) => e.getAttribute("aria-label")));
for (const name of verbs) {
  await page.locator(`#card-foot [aria-label="${name}"]`).hover();
  let note = null;
  for (let i = 0; i < 30; i++) { await page.waitForTimeout(60); note = await page.evaluate((n) => { const btn = document.querySelector(`#card-foot [aria-label="${n}"]`); const lab = btn?.querySelector(":scope > .washi-label, .washi-label"); if (!lab) return null; const cs = getComputedStyle(lab); const r = lab.getBoundingClientRect(); return { op: +cs.opacity, t: r.top, b: r.bottom, l: r.left, r: r.right }; }, name); if (note && note.op > 0.99) break; }
  if (!note) { console.log(JSON.stringify({ eng: ENG, vp: VP, verb: name, note: null })); continue; }
  let lowest = -1, overlap = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!ink[y * W + x]) continue; const cx = clip.x + x / 2, cy = clip.y + y / 2; if (cx >= note.l && cx <= note.r) { lowest = Math.max(lowest, cy); if (cy >= note.t && cy <= note.b) overlap += 0.25; } }
  console.log(JSON.stringify({ eng: ENG, vp: VP, verb: name, noteTop: +note.t.toFixed(2), lipLowestInkUnderNote: lowest < 0 ? null : +lowest.toFixed(2), strokeBelowNoteTopCss: lowest < 0 ? null : +(lowest - note.t).toFixed(2), notePx2OverLipInk: overlap }));
  await page.mouse.move(2, 2); await page.waitForTimeout(300);
}
await b.close();
