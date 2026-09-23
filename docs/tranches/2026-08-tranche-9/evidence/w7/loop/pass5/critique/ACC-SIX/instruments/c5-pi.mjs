// ACC-SIX pass-5 CRITIC — π of the portrait-only reserve against 74a2b5d9 on the lane's encoded payload
// (p5-common.COPY BOARD, read back on every arm), control-vs-control noise in the same run, and the
// LANDSCAPE WRAP ROW the portrait-only predicate gives up: count showing (1 legal write) + the widest
// hint line the product writes, emulated in the voice's own span (the lane's p5-wrap method), plus a
// 16x16-width count ("3 of 170 on the board") — reads the strip and the controls' top per line.
// usage: PROTO=http://127.0.0.1:4237 CTRL=http://127.0.0.1:4238 node c5-pi.mjs <out.json>
import { writeFileSync } from "node:fs";
import { ENGINES, BOARD, DEAL, cells, asset, writeLegal, open } from "./p5-common.COPY.mjs";
const ARMS = { proto: process.env.PROTO || "http://127.0.0.1:4237", control: process.env.CTRL || "http://127.0.0.1:4238", control2: process.env.CTRL || "http://127.0.0.1:4238" };
const SEL = [".masthead", ".logo-text", ".board-wrapper", ".sudoku-cell", ".play-controls", ".icon-btn", ".board-voice", ".drawer-tab", ".margin-note"];
const CELLS = [
  { name: "393x699-coarse", viewport: { width: 393, height: 699 }, dpr: 3, touch: true },
  { name: "812x375-coarse", viewport: { width: 812, height: 375 }, dpr: 3, touch: true },
  { name: "844x390-coarse", viewport: { width: 844, height: 390 }, dpr: 3, touch: true },
  { name: "1280x800-fine", viewport: { width: 1280, height: 800 }, dpr: 1, touch: false },
];
const LINES = { silent: [null, null], hidden9: ["5 goes nowhere else in this column", null], hidden16: ["G goes nowhere else in this column", "3 of 170 on the board"] };
const READ = (sels) => sels.map((s) => { const els = Array.from(document.querySelectorAll(s)); return { sel: s, n: els.length, y: els.map((e) => +e.getBoundingClientRect().y.toFixed(2)), paint: els.map((e) => { const c = getComputedStyle(e); return [e.tagName, c.color, c.backgroundColor, c.opacity, c.filter, c.font].join("|"); }) }; });
const STRIP = () => { const m = document.querySelector(".board-margin"), v = document.querySelector(".margin-note"), meta = document.querySelector(".margin-note-meta"), pc = document.querySelector(".play-controls"); const r = (e) => e.getBoundingClientRect(); return { stripH: +r(m).height.toFixed(2), stripW: +r(m).width.toFixed(1), minH: getComputedStyle(m).minHeight, pos: getComputedStyle(m).position, controlsTop: pc ? +r(pc).top.toFixed(2) : null, meta: meta?.textContent ?? null, metaW: meta ? +r(meta).width.toFixed(1) : null, voiceW: +r(v).width.toFixed(1), wrapped: !!meta && r(meta).top > r(v).top + 4 }; };
function cmp(a, b) { const out = { paint: 0, moved: {} }; a.forEach((x, i) => { const y = b[i]; if (x.n !== y.n) out.moved[x.sel] = `n ${x.n}/${y.n}`; for (let j = 0; j < Math.min(x.n, y.n); j++) { if (x.paint[j] !== y.paint[j]) out.paint++; const d = +(x.y[j] - y.y[j]).toFixed(2); if (Math.abs(d) > 0.01) { const s = (out.moved[x.sel] ??= { n: 0, dy: [] }); s.n++; if (!s.dy.includes(d)) s.dy.push(d); } } }); return out; }
const out = { board: BOARD, arms: ARMS, control: "74a2b5d9", cells: {} };
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const C of CELLS) {
    const got = {};
    for (const [arm, base] of Object.entries(ARMS)) {
      const { ctx, page } = await open(br, base, { ...C, reduce: true });
      const G = (got[arm] = { asset: await asset(page), dealOk: (await cells(page)) === DEAL, coarse: await page.evaluate(() => matchMedia("(pointer: coarse)").matches) });
      await page.evaluate(() => document.activeElement?.blur?.()); await page.waitForTimeout(500);
      G.f0 = await page.evaluate(READ, SEL); G.s0 = await page.evaluate(STRIP);
      for (let k = 0; k < 2; k++) await writeLegal(page, 260);
      await page.evaluate(() => document.activeElement?.blur?.()); await page.waitForTimeout(500);
      G.f2 = await page.evaluate(READ, SEL); G.s2 = await page.evaluate(STRIP);
      G.lines = {};
      for (const [k, [line, count]] of Object.entries(LINES)) {
        await page.evaluate(([t, c]) => { const p = document.querySelector(".margin-note"); p.querySelector("#acc6c-voice")?.remove(); const meta = document.querySelector(".margin-note-meta"); if (meta) { meta.dataset.orig ??= meta.textContent; meta.textContent = c ?? meta.dataset.orig; } if (!t) return; const s = document.createElement("span"); s.id = "acc6c-voice"; s.className = "margin-note-ink"; for (const a of p.getAttributeNames()) if (a.startsWith("data-v-")) s.setAttribute(a, ""); s.textContent = t; p.appendChild(s); }, [line, count]);
        await page.waitForTimeout(150);
        G.lines[k] = await page.evaluate(STRIP);
      }
      await ctx.close();
    }
    out.cells[`${eng}/${C.name}`] = { asset: [got.proto.asset, got.control.asset], dealOk: [got.proto.dealOk, got.control.dealOk, got.control2.dealOk], coarse: got.proto.coarse,
      fill0: { pv: cmp(got.proto.f0, got.control.f0), noise: cmp(got.control2.f0, got.control.f0) }, fill2: { pv: cmp(got.proto.f2, got.control.f2), noise: cmp(got.control2.f2, got.control.f2) },
      strip: { proto: [got.proto.s0, got.proto.s2], control: [got.control.s0, got.control.s2] }, lines: { proto: got.proto.lines, control: got.control.lines } };
    console.error("done", eng, C.name);
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.error("wrote");
