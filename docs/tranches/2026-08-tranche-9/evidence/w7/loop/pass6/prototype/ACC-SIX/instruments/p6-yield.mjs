// ACC-SIX pass-6 — THE COUNT YIELDS (charter row 4). A REAL 16x16 payload (p6-common BOARD16: 86 givens,
// 170 writable), both engines, four cells; each arm: rest snapshot A, then the product's own Hint pressed
// once (it writes a cell AND speaks a voice line: the count lays down on 0 -> 1), snapshot B, then the
// widest pair the lesson can meet emulated in the voice's own span (the critic's c5-landwrap method:
// "G goes nowhere else in this column" + "3 of 170 on the board"), snapshot C. Every snapshot is SETTLED
// (two equal consecutive reads; the dock sheet slides ~700 ms). Per snapshot: the strip's height, the
// document's scrollHeight, W2's `.drawer-tab` y, whether the meta's TEXT lies inside the block, and the
// meta's PAINT (its text rect shot with the meta shown minus hidden: changed px). Whole-DOM moves A->B and
// A->C are counted over every element with a box (keyed by DOM index inside the arm; the in-run floor is
// A vs a second rest read A2, which must be 0).
// usage: PROTO=http://127.0.0.1:4237 CONTROL=http://127.0.0.1:4238 node p6-yield.mjs <out.json>
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { ENGINES, BOARD16, PUZ16, asset, open16 } from "./p6-common.mjs";
const ARMS = { proto: process.env.PROTO || "http://127.0.0.1:4237", control: process.env.CONTROL || "http://127.0.0.1:4238" };
// ABLATE=1: the NEGATIVE CONTROL — the lane's own dist with the yield's two rules undone in-page (the meta gets
// its height back, the clip is lifted), i.e. pass 5's shape minus its portrait reserve. The strip must grow.
if (process.env.ABLATE) { delete ARMS.control; ARMS.protoAblated = ARMS.proto; delete ARMS.proto; }
const ABLATION = ".margin-note-block.meta-yields { clip-path: none !important; } .margin-note-block.meta-yields .margin-note-meta { height: auto !important; }";
const CELLS = [
  { name: "393x699-coarse", viewport: { width: 393, height: 699 }, dpr: 2, touch: true },
  { name: "812x375-coarse", viewport: { width: 812, height: 375 }, dpr: 2, touch: true },
  { name: "844x390-coarse", viewport: { width: 844, height: 390 }, dpr: 2, touch: true },
  { name: "1280x800-fine", viewport: { width: 1280, height: 800 }, dpr: 1, touch: false },
].filter((c) => !process.env.CELLS || process.env.CELLS.split(",").includes(c.name));
const SNAP = () => {
  const els = [];
  // SEMANTIC key (LAWS P5): the ancestry chain of tag.firstClass#n, n = rank among same-key siblings,
  // so a node the hint inserts elsewhere never renumbers an unrelated element.
  const nm = (e) => e.tagName + "." + String(e.className?.baseVal ?? e.className ?? "").split(" ")[0];
  const key = (e) => { const parts = []; for (let x = e; x && x !== document.body; x = x.parentElement) { let n = 0; for (let s = x.previousElementSibling; s; s = s.previousElementSibling) if (nm(s) === nm(x)) n++; parts.push(nm(x) + "#" + n); } return parts.reverse().join(">"); };
  document.querySelectorAll("body *").forEach((e) => { const r = e.getBoundingClientRect(); if (r.width || r.height) els.push([key(e), nm(e), +(r.y + scrollY).toFixed(2)]); });
  const blk = document.querySelector(".margin-note-block"), meta = document.querySelector(".margin-note-meta"), tab = document.querySelector(".drawer-tab");
  let metaText = null;
  if (meta && blk) { const rg = document.createRange(); rg.selectNodeContents(meta); const t = rg.getBoundingClientRect(), b = blk.getBoundingClientRect(); const v = document.querySelector(".margin-note")?.getBoundingClientRect(); metaText = { top: +t.top.toFixed(2), bottom: +t.bottom.toFixed(2), blockBottom: +b.bottom.toFixed(2), inside: t.top < b.bottom - 0.5, row2: !!v && v.height > 0 && t.top > v.top + 4 }; }
  return { els, sh: document.scrollingElement.scrollHeight, strip: +(document.querySelector(".board-margin")?.getBoundingClientRect().height ?? -1).toFixed(2), tabY: tab ? +(tab.getBoundingClientRect().y + scrollY).toFixed(2) : null, voice: document.querySelector(".margin-note")?.textContent?.trim() ?? "", meta: meta?.textContent?.trim() ?? null, metaText, coarse: matchMedia("(pointer: coarse)").matches };
};
async function settled(page) { let prev = null; for (let t = 0; t < 40; t++) { const s = await page.evaluate(SNAP); const k = JSON.stringify(s); if (k === prev) return s; prev = k; await page.waitForTimeout(250); } return { ...JSON.parse(prev), unsettled: true }; }
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
async function metaPaint(page) {
  // below the fold (the landscape cells): bring the strip into view for the photograph only; the
  // geometry rows above were read before this and the page is scrolled back after it.
  const sy = await page.evaluate(() => { const y = scrollY; const b = document.querySelector(".margin-note-block"); if (b && b.getBoundingClientRect().bottom > innerHeight - 40) b.scrollIntoView({ block: "center" }); return y; });
  await page.waitForTimeout(150);
  try { return await metaPaintAt(page); } finally { await page.evaluate((y) => scrollTo(0, y), sy); await page.waitForTimeout(150); }
}
async function metaPaintAt(page) {
  const clip = await page.evaluate(() => { const m = document.querySelector(".margin-note-meta"); if (!m) return null; const rg = document.createRange(); rg.selectNodeContents(m); const t = rg.getBoundingClientRect(); return { x: Math.max(0, Math.floor(t.x) - 2), y: Math.max(0, Math.floor(t.y) - 2), width: Math.ceil(t.width) + 4, height: Math.ceil(t.height) + 4 }; });
  if (!clip) return { px: null, why: "no meta" };
  // clamp to the viewport (a landscape strip sits at the fold); the clamped share is printed
  const ih = await page.evaluate(() => innerHeight);
  const full = clip.height; clip.height = Math.max(0, Math.min(clip.height, ih - clip.y));
  if (clip.height < 2) return { px: null, why: "offscreen" };
  const S = await page.screenshot({ clip }); await page.evaluate(() => document.querySelector(".margin-note-meta").style.setProperty("visibility", "hidden")); await page.waitForTimeout(120);
  const H = await page.screenshot({ clip }); await page.evaluate(() => document.querySelector(".margin-note-meta").style.removeProperty("visibility"));
  const a = await sharp(S).raw().toBuffer({ resolveWithObject: true }), b = (await sharp(H).raw().toBuffer()); let n = 0;
  for (let i = 0; i < a.data.length; i += a.info.channels) if (Math.abs(lin(a.data[i]) - lin(b[i])) + Math.abs(lin(a.data[i + 1]) - lin(b[i + 1])) + Math.abs(lin(a.data[i + 2]) - lin(b[i + 2])) > 0.03) n++;
  return { px: n, clipShare: +(clip.height / full).toFixed(2) };
}
const moves = (A, B) => { const m = new Map(B.els.map(([i, n, y]) => [i, y])); const out = {}; let n = 0; for (const [i, name, y] of A.els) { const q = m.get(i); if (q !== undefined && Math.abs(q - y) > 0.01) { n++; (out[name] ??= []).length < 2 && out[name].push(+(q - y).toFixed(2)); } } return { n, top: Object.fromEntries(Object.entries(out).slice(0, 10)) }; };
const out = { board: BOARD16, puz16: PUZ16, cells: {} };
for (const [eng, L] of ENGINES) { const br = await L.launch();
  for (const C of CELLS) for (const [arm, base] of Object.entries(ARMS)) {
    const { ctx, page } = await open16(br, base, { ...C, reduce: true });
    if (arm === "protoAblated") await page.addStyleTag({ content: ABLATION });
    const A = await settled(page); await page.waitForTimeout(300); const A2 = await settled(page);
    // the product's two-press hint: press 1 names, press 2 writes (count lays down, written 0 -> 1), press 3 names the NEXT step
    // while the count is still up (written 1 < 3): the REAL pair on the strip.
    const press = () => page.evaluate(() => { const b = document.querySelector('[aria-label*="Hint" i]:not([disabled])'); b?.click(); return !!b; });
    let hinted = 0; for (let k = 0; k < 2; k++) { if (await press()) hinted++; await page.waitForTimeout(700); }
    const B0 = await settled(page); const pB0 = await metaPaint(page);
    if (await press()) hinted++; await page.waitForTimeout(700); const B = await settled(page); const pB = await metaPaint(page);
    await page.evaluate(() => { const p = document.querySelector(".margin-note"); const meta = document.querySelector(".margin-note-meta"); if (meta) meta.textContent = "3 of 170 on the board"; p.querySelectorAll(".margin-note-ink").forEach((x) => x.remove()); const s = document.createElement("span"); s.className = "margin-note-ink"; for (const x of p.getAttributeNames()) if (x.startsWith("data-v-")) s.setAttribute(x, ""); s.textContent = "G goes nowhere else in this column"; p.appendChild(s); });
    await page.waitForTimeout(200); const Cn = await settled(page); const pC = await metaPaint(page);
    const row = { asset: await asset(page), coarse: A.coarse, hinted, floorA_A2: moves(A, A2).n, B0: { voice: B0.voice, meta: B0.meta, strip: B0.strip, tabY: B0.tabY, metaText: B0.metaText, metaPaintPx: pB0, movedFromA: moves(A, B0) }, B: { voice: B.voice, meta: B.meta, strip: B.strip, sh: B.sh, tabY: B.tabY, metaText: B.metaText, metaPaintPx: pB, movedFromA: moves(A, B) }, C: { strip: Cn.strip, sh: Cn.sh, tabY: Cn.tabY, metaText: Cn.metaText, metaPaintPx: pC, movedFromA: moves(A, Cn) }, rest: { strip: A.strip, sh: A.sh, tabY: A.tabY }, unsettled: [!!A.unsettled, !!B.unsettled, !!Cn.unsettled] };
    out.cells[`${eng}/${C.name}/${arm}`] = row;
    console.error(eng, C.name, arm, row.asset, "rest strip", A.strip, "tab", A.tabY, "| B0", JSON.stringify({ v: B0.voice, m: B0.meta, strip: B0.strip, tab: B0.tabY, in: B0.metaText?.inside, px: pB0.px, moved: row.B0.movedFromA.n }), "| B", JSON.stringify({ v: B.voice, m: B.meta, strip: B.strip, tab: B.tabY, in: B.metaText?.inside, row2: B.metaText?.row2, px: pB.px, moved: row.B.movedFromA.n }), "| C", JSON.stringify({ strip: Cn.strip, tab: Cn.tabY, in: Cn.metaText?.inside, row2: Cn.metaText?.row2, px: pC.px, moved: row.C.movedFromA.n }), "floor", row.floorA_A2);
    await ctx.close();
  } await br.close(); }
writeFileSync(process.argv[2], JSON.stringify(out, null, 1)); console.error("wrote");
