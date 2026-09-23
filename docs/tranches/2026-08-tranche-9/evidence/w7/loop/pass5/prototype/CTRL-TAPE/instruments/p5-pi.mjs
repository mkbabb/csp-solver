/**
 * T9-W7 pass 5 · CTRL-TAPE — π PROD-VS-PROD, on the encoded payload, with its own negative arm.
 *
 *   node p5-pi.mjs <out.json> <protoDist> <controlDist>
 *
 * Both arms are BUILT dists under `vite preview` (LAWS P4: one rendering mode). The negative arm
 * is the control read twice (control-vs-control): the noise floor every delta is read against.
 * The signature is every element OUTSIDE the case (`.drawer-case`) and outside SVG interiors
 * (the beat swaps poses there by design): tag + rect + nine computed paint properties, in
 * document order. Named rows beside it: the board, a cell, the wordmark, the case, the card's
 * width/left, and on the gallery route the deck's tapes and axis labels.
 */
import { writeFileSync } from "node:fs";
import { ENGINES, CELLS, open, givens } from "./p5-lib.mjs";

const OUT = process.argv[2];
const PROTO = process.argv[3];
const CTRL = process.argv[4];
const KEYS = ["rail1440", "rail1280", "rail1024", "dock390", "dock430", "land844"];
const PROPS = ["color", "backgroundColor", "fontSize", "fontFamily", "fontWeight", "lineHeight", "letterSpacing", "opacity", "display"];

const SIG = (props) => {
  const out = [];
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest(".drawer-case, #controls-drawer")) continue;
    if (el.closest("svg") && el.tagName.toLowerCase() !== "svg") continue;
    if (/^(SCRIPT|STYLE|LINK|META)$/.test(el.tagName)) continue;
    const b = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    out.push({
      k: `${el.tagName}.${String(el.className?.baseVal ?? el.className).split(" ").filter((c) => !/^(is-|data-v)/.test(c)).slice(0, 2).join(".")}`,
      r: [b.left, b.top, b.width, b.height].map((v) => +v.toFixed(1)),
      p: props.map((p) => cs[p]),
    });
  }
  return out;
};
const NAMED = () => {
  const R = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [b.left, b.top, b.width, b.height].map((v) => +v.toFixed(2)); };
  return { board: R(".board-wrapper"), cell: R(".sudoku-cell"), logo: R("svg.handwritten-logo"), case: R(".drawer-case"), card: R(".controls-card"), foot: R("#card-foot") };
};
const DECK = () =>
  [...document.querySelectorAll(".washi-tag, .staging-axis-label")]
    .filter((e) => !e.closest(".controls-card"))
    .map((e) => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return [(e.textContent || "").trim(), +b.width.toFixed(2), +b.height.toFixed(2), cs.fontSize, cs.lineHeight, cs.fontFamily.split(",")[0], cs.color]; });

function diff(a, b) {
  const n = Math.min(a.length, b.length);
  let tag = 0, rect = 0, paint = 0;
  const examples = [];
  for (let i = 0; i < n; i++) {
    if (a[i].k !== b[i].k) { tag++; if (examples.length < 6) examples.push(["tag", i, a[i].k, b[i].k]); continue; }
    if (a[i].r.some((v, j) => Math.abs(v - b[i].r[j]) > 0.5)) { rect++; if (examples.length < 6) examples.push(["rect", a[i].k, a[i].r, b[i].r]); }
    const pd = a[i].p.map((v, j) => (v !== b[i].p[j] ? PROPS[j] : null)).filter(Boolean);
    if (pd.length) { paint++; if (examples.length < 6) examples.push(["paint", a[i].k, pd.join("+")]); }
  }
  return { nA: a.length, nB: b.length, tag, rect, paint, examples };
}

const out = { proto: PROTO, control: CTRL, rows: [] };
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const key of KEYS) {
    const read = async (base) => {
      const { ctx, page } = await open(br, base, CELLS[key], { dpr: 1 });
      await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
      await page.waitForTimeout(300);
      const r = { givens: await givens(page), named: await page.evaluate(NAMED), sig: await page.evaluate(SIG, PROPS) };
      await page.goto("/?view=gallery");
      await page.waitForSelector("svg.handwritten-logo", { timeout: 45000 });
      await page.waitForTimeout(900);
      r.deck = await page.evaluate(DECK);
      await ctx.close();
      return r;
    };
    try {
      const p = await read(PROTO);
      const c1 = await read(CTRL);
      const c2 = await read(CTRL);
      const row = {
        eng, cell: key,
        givens: [p.givens, c1.givens],
        named: { proto: p.named, control: c1.named },
        sigProtoVsControl: diff(p.sig, c1.sig),
        sigControlVsControl: diff(c1.sig, c2.sig),
        deckEqual: JSON.stringify(p.deck) === JSON.stringify(c1.deck),
        deckN: [p.deck.length, c1.deck.length],
      };
      out.rows.push(row);
      console.log(eng, key, JSON.stringify({ giv: row.givens[0] === row.givens[1], named: row.named, pc: [row.sigProtoVsControl.nA, row.sigProtoVsControl.tag, row.sigProtoVsControl.rect, row.sigProtoVsControl.paint], cc: [row.sigControlVsControl.tag, row.sigControlVsControl.rect, row.sigControlVsControl.paint], deck: row.deckEqual, ex: row.sigProtoVsControl.examples.slice(0, 3) }));
    } catch (e) {
      out.rows.push({ eng, cell: key, error: String(e).slice(0, 200) });
      console.log(eng, key, "ERROR", String(e).slice(0, 200));
    }
  }
  await br.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
