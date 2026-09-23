// ACC-SIX pass-5 — π against 74a2b5d9 on ONE encoded payload (p5-common BOARD, read back on every
// arm), EVERY element of each selector, computed PAINT properties + tag names separated from rects,
// fills 0 / 2 (the count on the strip) / 3 (the lesson lifted), with the CONTROL-VS-CONTROL arm in
// the same run as its noise floor (LAWS P4). A copy of the pass-4 critic's acc6c-pi.mjs, re-pointed
// and widened (844x390, fill 2, the noise arm, the strip's own numbers). Claimed surfaces are read
// and reported, never counted as π: .progress-trace, .board-margin, .margin-note-meta.
// usage: PROTO=http://127.0.0.1:4237 CTRL=http://127.0.0.1:4238 node p5-pi.mjs <out.json>
import { writeFileSync } from "node:fs";
import { ENGINES, BOARD, DEAL, cells, asset, writeLegal, open } from "./p5-common.mjs";
const ARMS = { proto: process.env.PROTO || "http://127.0.0.1:4237", control: process.env.CTRL || "http://127.0.0.1:4238", control2: process.env.CTRL || "http://127.0.0.1:4238" };
const SEL = [".masthead", ".logo-text", ".board-wrapper", ".sudoku-cell", ".sudoku-cell input", ".glyph-svg", "svg.hand-drawn-grid", ".controls-card", ".play-controls", ".icon-btn", ".deal-row", ".board-voice", ".margin-note", ".margin-note-text", ".drawer-tab", "button"];
const CLAIMED = [".board-margin", ".margin-note-meta", ".progress-trace"];
const CELLS = [
  { name: "1280x800-fine", viewport: { width: 1280, height: 800 }, dpr: 1, touch: false, schemes: ["light", "dark"] },
  { name: "393x699-coarse", viewport: { width: 393, height: 699 }, dpr: 3, touch: true, schemes: ["light", "dark"] },
  { name: "844x390-coarse", viewport: { width: 844, height: 390 }, dpr: 3, touch: true, schemes: ["light"] },
];
const READ = (sels) => sels.map((s) => {
  const els = Array.from(document.querySelectorAll(s)).slice(0, 120);
  return { sel: s, n: els.length, items: els.map((el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    return { paint: [el.tagName, cs.font, cs.lineHeight, cs.color, cs.backgroundColor, cs.stroke, cs.fill, cs.opacity, cs.filter, cs.transform, cs.borderTopWidth + " " + cs.borderTopColor, cs.visibility, cs.display].join(" | "), rect: [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(2)) }; }) };
});
const STRIP = () => { const m = document.querySelector(".board-margin"); const cs = getComputedStyle(m); return { h: +m.getBoundingClientRect().height.toFixed(2), minHeight: cs.minHeight, lineHeight: cs.lineHeight, fontSize: cs.fontSize, position: cs.position, meta: document.querySelector(".margin-note-meta")?.textContent ?? null }; };
function cmp(a, b) {
  const paint = [], rect = [], count = [];
  a.forEach((x, i) => { const y = b[i]; if (x.n !== y.n) count.push(`${x.sel} n ${x.n} vs ${y.n}`);
    for (let j = 0; j < Math.min(x.n, y.n); j++) {
      if (x.items[j].paint !== y.items[j].paint) paint.push({ sel: x.sel, j, a: x.items[j].paint, b: y.items[j].paint });
      const d = x.items[j].rect.map((v, k) => +(v - y.items[j].rect[k]).toFixed(2));
      if (d.some((v) => Math.abs(v) > 0.01)) rect.push({ sel: x.sel, j, dx: d[0], dy: d[1], dw: d[2], dh: d[3] });
    } });
  const bySel = {};
  for (const r of rect) { const s = (bySel[r.sel] ??= { n: 0, dy: new Set(), dx: new Set(), dh: new Set() }); s.n++; s.dy.add(r.dy); s.dx.add(r.dx); s.dh.add(r.dh); }
  for (const s of Object.values(bySel)) for (const k of ["dy", "dx", "dh"]) s[k] = [...s[k]].sort((p, q) => p - q).filter((v, i, arr) => i === 0 || i === arr.length - 1 || arr.length <= 3);
  return { count, paintN: paint.length, paint: paint.slice(0, 6), rectN: rect.length, bySel };
}
const out = { board: BOARD, arms: ARMS, control: "74a2b5d9", cells: {} };
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const C of CELLS) for (const scheme of C.schemes) {
    const got = {};
    for (const [arm, base] of Object.entries(ARMS)) {
      const { ctx, page } = await open(br, base, { ...C, scheme, reduce: true });
      const G = (got[arm] = { asset: await asset(page), dealOk: (await cells(page)) === DEAL, coarse: await page.evaluate(() => matchMedia("(pointer: coarse)").matches), f: {}, strip: {} });
      for (const [fill, n] of [[0, 0], [2, 2], [3, 1]]) {
        for (let k = 0; k < n; k++) await writeLegal(page, 260);
        await page.evaluate(() => document.activeElement?.blur?.());
        await page.waitForTimeout(fill === 3 ? 900 : 500);
        G.f[fill] = await page.evaluate(READ, SEL); G.strip[fill] = await page.evaluate(STRIP);
        G.claimed ??= {}; G.claimed[fill] = await page.evaluate(READ, CLAIMED);
      }
      await ctx.close();
    }
    const key = `${eng}/${C.name}/${scheme}`;
    out.cells[key] = { asset: [got.proto.asset, got.control.asset], dealOk: [got.proto.dealOk, got.control.dealOk, got.control2.dealOk], coarse: got.proto.coarse, strip: { proto: got.proto.strip, control: got.control.strip } };
    for (const f of [0, 2, 3]) {
      out.cells[key][`fill${f}`] = { protoVsControl: cmp(got.proto.f[f], got.control.f[f]), noise: cmp(got.control2.f[f], got.control.f[f]) };
    }
    console.error("done", key);
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.error("wrote");
