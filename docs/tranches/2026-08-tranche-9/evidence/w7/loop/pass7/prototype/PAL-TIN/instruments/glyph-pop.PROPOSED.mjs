// glyph-pop.mjs — THE glyph-population probe (T9-W7 pass 7, chair's instruments; registry-v6 §2.9; LAWS P5
// §2.11 statistic + P6 §E clauses). A painted-text gate reads the WHOLE glyph-coverage population:
//   the subject photographed ON and with its text transparent (`color` AND `-webkit-text-fill-color`
//   transparent, text-shadow none); every pixel whose RGB moved by ≥ `delta` (default 6/255) is a glyph
//   pixel; each glyph pixel's value = contrast(ON pixel, OFF pixel) — the ink against the ground it is
//   painted on. The population is keyed on coverage (did the text paint here), never on the crop's max.
// Clauses (every one RED on breach — never `min(4.5, 0)`, never a skip):
//   G0  the subject exists and is visible
//   G1  the population ≥ `minPop` (40) px — an EMPTY or thin population is RED
//   G2  the core median of the population ≥ `floor` (4.5) — ABSOLUTE, never relative to an in-run photo of
//       the subject's own element (an in-run control inherits the plant)
//   G3  the fraction of the population under `floor` ≤ `fracBound` (the stamped control + slack; until the
//       estate stamps it, the SHIPPED reading + 0.05) — printed always, gated when a bound is given
//   G4  every x-slice of the population (16 over its own extent, ≥ 8 px each) keeps its CORE (p95) ≥ max(3.0,
//       0.4 × the whole population's p95) — the TAIL clause (relative, never the only clause: G2 is absolute)
// A second bare photograph is taken and the ON pair compared (a transient ground pixel is printed, P5 C1).
import { onOff, lum, ratio, median, maxDelta } from "./paint-lib.mjs";

export async function glyphPopulation(page, { subject, floor = 4.5, minPop = 40, fracBound = null, delta = 6, pad = 2, slices = 16, slicePop = 8, sliceRatio = 0.4, sliceQ = 0.95 }) {
  const loc = page.locator(subject).first();
  const vis = await loc.isVisible().catch(() => false);
  if (!vis) return { red: true, why: [`G0 subject ${subject} not visible`] };
  const b = await loc.boundingBox();
  const vw = page.viewportSize();
  const x = Math.max(0, Math.floor(b.x - pad)), y = Math.max(0, Math.floor(b.y - pad));
  const clip = { x, y, width: Math.min(vw.width - x, Math.ceil(b.width + 2 * pad)), height: Math.min(vw.height - y, Math.ceil(b.height + 2 * pad)) };
  const off = `${subject}, ${subject} * { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; }`;
  const A = await onOff(page, clip, off);
  const B = await onOff(page, clip, off);
  let transient = 0;
  for (let i = 0; i < A.on.data.length; i += 3) if (maxDelta(A.on.data, B.on.data, i) >= delta) transient++;
  const pop = [], xs = [];
  for (let i = 0; i < A.on.data.length; i += 3) if (maxDelta(A.on.data, A.off.data, i) >= delta) { pop.push(ratio(lum(A.on.data, i), lum(A.off.data, i))); xs.push((i / 3) % A.on.w); }
  const why = [];
  const med = median(pop);
  const frac = pop.length ? pop.filter((v) => v < floor).length / pop.length : 1;
  if (pop.length < minPop) why.push(`G1 population ${pop.length} px < ${minPop} (EMPTY/thin is RED)`);
  else {
    if (med < floor) why.push(`G2 core median ${med.toFixed(3)} < ${floor}`);
    if (fracBound != null && frac > fracBound) why.push(`G3 fraction under ${floor} = ${frac.toFixed(3)} > bound ${fracBound.toFixed(3)}`);
  }
  // G4 · the per-SLICE CORE (the tail): the population cut into `slices` columns over its own x-extent; every
  // slice holding ≥ `slicePop` px keeps its CORE (p95: the full-ink pixels every letter has, whatever its
  // antialiasing share — a thin 'i' lowers a slice MEDIAN, never its core) ≥ max(3.0, `sliceRatio` × the
  // whole population's p90). A median (G2) and a fraction (G3) cannot see a fade on the last 12 % of a short
  // word (pass-7 reading: WebKit light, "Size", TAIL12 read 4.592 / 0.489 against 4.5 / 0.499 — GREEN on both).
  const q = (a, f) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * f))]; };
  const sl = [];
  if (pop.length >= minPop) {
    const core = q(pop, sliceQ);
    const x0 = Math.min(...xs), x1 = Math.max(...xs) + 1, W = (x1 - x0) / slices;
    for (let k = 0; k < slices; k++) { const v = pop.filter((_, j) => xs[j] >= x0 + k * W && xs[j] < x0 + (k + 1) * W); sl.push(v.length >= slicePop ? +q(v, sliceQ).toFixed(2) : null); }
    const lim = Math.max(3.0, sliceRatio * core);
    const lows = sl.map((m, k) => (m != null && m < lim ? `${k}:${m}` : null)).filter(Boolean);
    if (lows.length) why.push(`G4 slice core (p${Math.round(sliceQ * 100)}) under ${lim.toFixed(2)} (= max(3.0, ${sliceRatio}×whole p${Math.round(sliceQ * 100)} ${core.toFixed(2)})) at ${lows.join(", ")}`);
  }
  return { red: why.length > 0, why, population: pop.length, coreMedian: +med.toFixed(3), fracUnder: +frac.toFixed(3), slices: sl, transientPx: transient, clip };
}

/** The in-run text plants (LAWS P6 §E) — each must RED. FAINT keeps `color` green (it moves only the fill).
 *  A string is CSS injected as a style tag; `{ tail }` is the TAIL plant: the last `tail` fraction of the TEXT
 *  RUN (measured by a Range over the subject's text, never the box — a padded or block-wide box puts its last
 *  12 % over no glyph at all) painted at 25 % alpha through a mask keyed to that run's pixels. */
export const TEXT_PLANTS = (s) => ({
  FAINT30_fill: `${s}, ${s} * { -webkit-text-fill-color: color-mix(in srgb, currentColor 30%, transparent) !important; }`,
  FADE65_fill: `${s}, ${s} * { -webkit-text-fill-color: color-mix(in srgb, currentColor 65%, transparent) !important; }`,
  FADE80_fill: `${s}, ${s} * { -webkit-text-fill-color: color-mix(in srgb, currentColor 80%, transparent) !important; }`,
  TAIL12_a25: { tail: 0.12 },
  TAIL35_a25: { tail: 0.35 },
  EMPTY_hidden: `${s}, ${s} * { color: transparent !important; -webkit-text-fill-color: transparent !important; }`,
});
/** Apply (and return an undo for) the TAIL plant on the first subject element. */
export async function applyTail(page, subject, tail) {
  return page.evaluate(({ subject, tail }) => {
    const el = document.querySelector(subject); if (!el) return { ok: false };
    // THE TEXT RUN, not the element's contents: a Range over `el` counts a non-text child (an inline
    // svg — the attribution tape's tally) as run, and the last 12 % then lands on the child and fades
    // no glyph (PAL-TIN pass 7: TAIL12 slices identical to clean on the tape). Text nodes only.
    const rects = [];
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) { if (!n.textContent.trim()) continue; const r = document.createRange(); r.selectNodeContents(n); rects.push(...[...r.getClientRects()].filter((q) => q.width > 0)); }
    const eb = el.getBoundingClientRect();
    const left = Math.min(...rects.map((q) => q.left)), right = Math.max(...rects.map((q) => q.right));
    const cut = left + (1 - tail) * (right - left) - eb.left;
    const g = `linear-gradient(to right, #000 ${cut.toFixed(1)}px, rgba(0,0,0,.25) ${cut.toFixed(1)}px)`;
    el.dataset.tailPrev = el.getAttribute("style") ?? "";
    el.style.setProperty("-webkit-mask-image", g, "important"); el.style.setProperty("mask-image", g, "important");
    return { ok: true, run: [+(left - eb.left).toFixed(1), +(right - eb.left).toFixed(1)], cut: +cut.toFixed(1), box: +eb.width.toFixed(1) };
  }, { subject, tail });
}
export async function undoTail(page, subject) {
  await page.evaluate((subject) => { const el = document.querySelector(subject); if (el) { const p = el.dataset.tailPrev; if (p) el.setAttribute("style", p); else el.removeAttribute("style"); delete el.dataset.tailPrev; } }, subject);
}
