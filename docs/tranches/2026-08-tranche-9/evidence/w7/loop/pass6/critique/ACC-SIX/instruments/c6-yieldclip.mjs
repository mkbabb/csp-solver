// ACC-SIX pass-6 CRITIC instrument (non-author). Two rows the lane did not read:
// ROW T (the clip's trim): does `.margin-note-block.meta-yields { clip-path: inset(-100vh -100vw 0 -100vw) }`
//   cut PAINT that the control shows? Per pose, the strip's neighbourhood is photographed with the clip as
//   shipped (S1, then S1b = the noise pair) and with `clip-path: none !important` injected (S2). Two cuts:
//   meta shown (the count's own paint) and meta hidden (visibility: hidden — the VOICE's paint alone: any
//   difference is a voice glyph the clip trims). Changed px use the lane's metaPaint threshold (sum |dlin| > .03).
// ROW L (the lesson's life): a hint-first play — Hint pressed six times (the product's two-press hint: name,
//   write, ×3 writes) — sampling the meta's PAINTED px (shown minus hidden over its text rect) after every
//   press, then COUNT_REST + 1 s, then one legal write: does the lesson ever paint, and does it come back?
// Payload: P1 (c6-common BOARD). Cells: 393x699 coarse (hasTouch), 844x390 coarse (hasTouch), 1280x800 fine.
// usage: BASE=http://127.0.0.1:4237 node c6-yieldclip.mjs <out.json>
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { ENGINES, BOARD as BOARD9, BOARD16, DEAL, cells as cells9, asset, writeLegal as writeLegal9, open as open9, open16 } from "./c6-common.mjs";
// P=16: the lane's real 16x16 payload (p6-common BOARD16) for ROW L only (its writes are hint writes; writeLegal is 9x9-only)
const P16 = process.env.P === "16"; const BOARD = P16 ? BOARD16 : BOARD9; const open = P16 ? open16 : open9;
const cells = async (p) => (P16 ? DEAL : await cells9(p)); const writeLegal = async (p, s) => (P16 ? (await p.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click()), await p.waitForTimeout(s), await p.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click()), await p.waitForTimeout(s)) : writeLegal9(p, s));
const ONLY = process.env.ROWS || "TL";
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const CELLS_ALL = [
  { name: "393x699-coarse", viewport: { width: 393, height: 699 }, dpr: 2, touch: true },
  { name: "844x390-coarse", viewport: { width: 844, height: 390 }, dpr: 2, touch: true },
  { name: "1280x800-fine", viewport: { width: 1280, height: 800 }, dpr: 1, touch: false },
];
const CELLS = CELLS_ALL.filter((c) => !process.env.CELLS || process.env.CELLS.split(",").includes(c.name));
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
async function diffPx(A, B, blockBottomRow) {
  const a = await sharp(A).raw().toBuffer({ resolveWithObject: true }), b = await sharp(B).raw().toBuffer();
  const { width: w, channels: ch } = a.info; let n = 0, below = 0;
  for (let i = 0; i < a.data.length; i += ch) if (Math.abs(lin(a.data[i]) - lin(b[i])) + Math.abs(lin(a.data[i + 1]) - lin(b[i + 1])) + Math.abs(lin(a.data[i + 2]) - lin(b[i + 2])) > 0.03) { n++; if (Math.floor(i / ch / w) >= blockBottomRow) below++; }
  return { n, below };
}
const setStyle = (page, id, css) => page.evaluate(([i, c]) => { document.getElementById(i)?.remove(); if (!c) return; const s = document.createElement("style"); s.id = i; s.textContent = c; document.head.appendChild(s); }, [id, css]);
async function region(page) {
  await page.evaluate(() => { const b = document.querySelector(".margin-note-block"); if (b && (b.getBoundingClientRect().bottom > innerHeight - 40 || b.getBoundingClientRect().top < 0)) b.scrollIntoView({ block: "center" }); });
  await page.waitForTimeout(200);
  return page.evaluate(() => { const b = document.querySelector(".margin-note-block").getBoundingClientRect(); const x = Math.max(0, Math.floor(b.x) - 40), y = Math.max(0, Math.floor(b.y) - 30); const w = Math.min(innerWidth - x, Math.ceil(b.width) + 80), h = Math.min(innerHeight - y, Math.ceil(b.height) + 60); return { clip: { x, y, width: w, height: h }, bottomRow: Math.round((b.bottom - y) * devicePixelRatio), yields: document.querySelector(".margin-note-block").classList.contains("meta-yields"), clipPath: getComputedStyle(document.querySelector(".margin-note-block")).clipPath, voice: document.querySelector(".margin-note")?.textContent?.trim() ?? "", meta: document.querySelector(".margin-note-meta")?.textContent?.trim() ?? null }; });
}
async function trim(page) {
  const R = await region(page); const shot = () => page.screenshot({ clip: R.clip });
  const out = { voice: R.voice, meta: R.meta, yields: R.yields, clipPath: R.clipPath };
  for (const [cut, css] of [["metaShown", ""], ["voiceOnly", ".margin-note-meta { visibility: hidden !important; }"]]) {
    await setStyle(page, "c6-meta", css); await page.waitForTimeout(150);
    const S1 = await shot(); await page.waitForTimeout(200); const S1b = await shot();
    await setStyle(page, "c6-clip", ".margin-note-block { clip-path: none !important; }"); await page.waitForTimeout(150);
    const S2 = await shot(); await setStyle(page, "c6-clip", ""); await page.waitForTimeout(150);
    out[cut] = { noise: (await diffPx(S1, S1b, R.bottomRow)).n, clipVsNone: await diffPx(S1, S2, R.bottomRow) };
  }
  await setStyle(page, "c6-meta", "");
  return out;
}
async function metaPainted(page) {
  const r = await page.evaluate(() => { const m = document.querySelector(".margin-note-meta"); if (!m) return null; const b = document.querySelector(".margin-note-block"); if (b.getBoundingClientRect().bottom > innerHeight - 40) b.scrollIntoView({ block: "center" }); const rg = document.createRange(); rg.selectNodeContents(m); const t = rg.getBoundingClientRect(); return { x: Math.max(0, Math.floor(t.x) - 2), y: Math.max(0, Math.floor(t.y) - 2), width: Math.ceil(t.width) + 4, height: Math.min(innerHeight - Math.max(0, Math.floor(t.y) - 2), Math.ceil(t.height) + 4), text: m.textContent.trim(), voice: document.querySelector(".margin-note")?.textContent?.trim() ?? "" }; });
  if (!r) return { px: null, meta: null };
  if (r.height < 2) return { px: null, meta: r.text, why: "offscreen" };
  const { text, voice, ...clip } = r;
  const S = await page.screenshot({ clip }); await setStyle(page, "c6-mh", ".margin-note-meta { visibility: hidden !important; }"); await page.waitForTimeout(100);
  const H = await page.screenshot({ clip }); await setStyle(page, "c6-mh", "");
  return { px: (await diffPx(S, H, 1e9)).n, meta: text, voice: voice.slice(0, 48) };
}
const press = (page) => page.evaluate(() => { const b = document.querySelector('[aria-label*="Hint" i]:not([disabled])'); b?.click(); return !!b; });
const out = { board: BOARD, base: BASE, cells: {} };
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const C of CELLS) {
    // ROW T
    if (ONLY.includes("T")) { const { ctx, page } = await open(br, BASE, { ...C, reduce: true });
      const R = (out.cells[`${eng}/${C.name}/T`] = { asset: await asset(page), dealOk: (await cells(page)) === DEAL, coarse: await page.evaluate(() => matchMedia("(pointer: coarse)").matches) });
      await writeLegal(page, 900); R.countAlone = await trim(page);
      await press(page); await page.waitForTimeout(900); R.hintPlusCount = await trim(page);
      await ctx.close(); console.error(eng, C.name, "T", JSON.stringify(R)); }
    // ROW L
    if (ONLY.includes("L")) { const { ctx, page } = await open(br, BASE, { ...C, reduce: true });
      const R = (out.cells[`${eng}/${C.name}/L`] = { dealOk: (await cells(page)) === DEAL, samples: [] });
      for (let k = 0; k < 6; k++) { const ok = await press(page); await page.waitForTimeout(250); R.samples.push({ press: k + 1, ok, ...(await metaPainted(page)) }); }
      await page.waitForTimeout(1500); R.afterRest = await metaPainted(page);
      await writeLegal(page, 600); R.afterNextWrite = await metaPainted(page);
      R.maxPainted = Math.max(0, ...R.samples.map((s) => s.px ?? 0));
      await ctx.close(); console.error(eng, C.name, "L", JSON.stringify(R)); }
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1)); console.error("wrote");
