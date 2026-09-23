// ACC-SIX pass-6 — π, WHOLE-DOM (LAWS P5: "a π census is WHOLE-DOM with an in-run floor, keyed by semantic
// ancestry"; the pass-5 critic's c5-pi.mjs read a nine-selector list and is superseded by this copy). Arms: the
// lane's built dist, the control 74a2b5d9, and the control AGAIN (the in-run floor, which must read 0). Every
// element with a box, keyed by its ancestry chain of tag.firstClass#rank (rank among same-key siblings), read
// for its y/x/height and its computed PAINT (color, background, opacity, visibility, filter, fill, stroke,
// stroke-opacity, font-size, font-family) + tag. The payload is p6-common's encoded board, the given-set read
// back through the aria-label corpus on every arm. Two poses: fill 0 (rest) and fill 2 (two legal writes: the
// count is showing on the lane). Four cells, both engines, PRM (the boil held at pose 0).
// usage: PROTO=… CTRL=… node p6-pi.mjs <out.json>   → prints a classified summary; raw JSON stays in scratch.
import { writeFileSync } from "node:fs";
import { ENGINES, BOARD, asset, labels, writeLegal, open } from "./p6-common.mjs";
const ARMS = { proto: process.env.PROTO || "http://127.0.0.1:4237", control: process.env.CTRL || "http://127.0.0.1:4238", control2: process.env.CTRL || "http://127.0.0.1:4238" };
const CELLS = [
  { name: "393x699-coarse", viewport: { width: 393, height: 699 }, dpr: 2, touch: true },
  { name: "812x375-coarse", viewport: { width: 812, height: 375 }, dpr: 2, touch: true },
  { name: "844x390-coarse", viewport: { width: 844, height: 390 }, dpr: 2, touch: true },
  { name: "1280x800-fine", viewport: { width: 1280, height: 800 }, dpr: 1, touch: false },
].filter((c) => !process.env.CELLS || process.env.CELLS.split(",").includes(c.name));
const SNAP = () => {
  const nm = (e) => e.tagName + "." + String(e.className?.baseVal ?? e.className ?? "").split(" ")[0];
  const key = (e) => { const p = []; for (let x = e; x && x !== document.body; x = x.parentElement) { let n = 0; for (let s = x.previousElementSibling; s; s = s.previousElementSibling) if (nm(s) === nm(x)) n++; p.push(nm(x) + "#" + n); } return p.reverse().join(">"); };
  const out = {};
  document.querySelectorAll("body *").forEach((e) => {
    const r = e.getBoundingClientRect(); if (!r.width && !r.height) return;
    const c = getComputedStyle(e);
    out[key(e)] = [nm(e), +(r.y + scrollY).toFixed(2), +(r.x + scrollX).toFixed(2), +r.height.toFixed(2), [e.tagName, c.color, c.backgroundColor, c.opacity, c.visibility, c.filter, c.fill, c.stroke, c.strokeOpacity, c.fontSize, c.fontFamily].join("|")];
  });
  return out;
};
function cmp(A, B) { // A vs B
  const moved = {}, paint = {}, onlyA = [], onlyB = [];
  let nMoved = 0, nPaint = 0;
  for (const [k, a] of Object.entries(A)) {
    const b = B[k]; if (!b) { onlyA.push(a[0]); continue; }
    const dy = +(a[1] - b[1]).toFixed(2), dx = +(a[2] - b[2]).toFixed(2), dh = +(a[3] - b[3]).toFixed(2);
    if (Math.abs(dy) > 0.01 || Math.abs(dx) > 0.01 || Math.abs(dh) > 0.01) { nMoved++; const s = (moved[a[0]] ??= { n: 0, d: [] }); s.n++; const t = `dy${dy} dx${dx} dh${dh}`; if (s.d.length < 3 && !s.d.includes(t)) s.d.push(t); }
    if (a[4] !== b[4]) { nPaint++; const s = (paint[a[0]] ??= { n: 0, ex: [] }); s.n++; if (s.ex.length < 1) s.ex.push([a[4], b[4]]); }
  }
  for (const [k, b] of Object.entries(B)) if (!A[k]) onlyB.push(b[0]);
  const tally = (xs) => Object.entries(xs.reduce((m, x) => ((m[x] = (m[x] ?? 0) + 1), m), {}));
  return { elements: Object.keys(A).length, nMoved, nPaint, moved, paint, onlyProto: tally(onlyA), onlyControl: tally(onlyB) };
}
const out = { board: BOARD, arms: ARMS, control: "74a2b5d9", cells: {} };
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const C of CELLS) {
    const got = {};
    for (const [arm, base] of Object.entries(ARMS)) {
      const { ctx, page } = await open(br, base, { ...C, reduce: true });
      const G = (got[arm] = { asset: await asset(page), labels: await labels(page), coarse: await page.evaluate(() => matchMedia("(pointer: coarse)").matches) });
      await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(1, 1); await page.waitForTimeout(600);
      G.f0 = await page.evaluate(SNAP);
      for (let k = 0; k < 2; k++) await writeLegal(page, 260);
      await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(1, 1); await page.waitForTimeout(700);
      G.f2 = await page.evaluate(SNAP);
      G.meta = await page.evaluate(() => document.querySelector(".margin-note-meta")?.textContent ?? null);
      await ctx.close();
    }
    const R = (out.cells[`${eng}/${C.name}`] = { assets: [got.proto.asset, got.control.asset, got.control2.asset], sameGivens: got.proto.labels === got.control.labels && got.control.labels === got.control2.labels, coarse: got.proto.coarse, meta: got.proto.meta,
      fill0: { pv: cmp(got.proto.f0, got.control.f0), floor: cmp(got.control2.f0, got.control.f0) }, fill2: { pv: cmp(got.proto.f2, got.control.f2), floor: cmp(got.control2.f2, got.control.f2) } });
    const s = (x) => `els ${x.elements} moved ${x.nMoved} paint ${x.nPaint} +${x.onlyProto.length}/-${x.onlyControl.length}`;
    console.log(`${eng} ${C.name} ${R.assets.join(",")} givens-same ${R.sameGivens} coarse ${R.coarse} meta "${R.meta}"`);
    for (const f of ["fill0", "fill2"]) {
      console.log(`  ${f} pv: ${s(R[f].pv)} | floor: ${s(R[f].floor)}`);
      console.log(`    moved: ${JSON.stringify(R[f].pv.moved).slice(0, 700)}`);
      console.log(`    paint: ${JSON.stringify(Object.fromEntries(Object.entries(R[f].pv.paint).map(([k, v]) => [k, v.n])))}`);
      console.log(`    only proto: ${JSON.stringify(R[f].pv.onlyProto)} only control: ${JSON.stringify(R[f].pv.onlyControl)}`);
    }
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.error("wrote");
