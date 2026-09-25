// PROPOSED EXTENSION (CTRL-TAPE pass 7, LAWS P6 §I "a lane that needs one extends THIS file"): two options,
// both defaulting to the chair's behaviour byte-for-byte — `offCss` (the OFF photograph's CSS; default the
// edge's `visibility: hidden`), because a focus RING is an `outline` on the subject itself and hiding the
// subject would take its label with it; and `station` (px of side per station; default 1), because a DASHED
// ring's gaps read 1.00 one column at a time and a station one dash period wide keeps each station on ink.
// The chair's copy (sha1 9b808b53) is unchanged; this is a copy with its diff stated.
// edge-bands.mjs — THE four-band edge probe (T9-W7 pass 7, chair's instruments; registry-v6 §2.9; LAWS P6 §E).
// "Existence is not visibility": a drawn-edge paint gate reads ALL FOUR BANDS (top, right, bottom, left)
// against edge-OFF with a per-band CORE-MEDIAN floor (default 3.0 : 1). A top-band-only row passed a
// clip-path that erased the bottom edge ×2 (SELF's X6); a computed-style ring gate passed a 15 % ink (FACE);
// LIVE's ring stayed 18/18 green at opacity 0.15 (X4).
//
// The read, per band: a strip `out` px outside and `in` px inside the subject's border box, photographed
// ON and with the edge OFF (`<edge> { visibility: hidden !important }`). A STATION is one column (top/bottom)
// or one row (left/right) inside the middle `span` of the side (corners excluded, default 10–90 %). A
// station's value = the MAX over the strip's depth of contrast(ON pixel, OFF pixel) — the stroke against
// the ground it is painted on. A station where ON == OFF reads 1.00 and is COUNTED (a dropped station is a
// miss, never a skip). The band's core median = the median of its stations; the fraction of stations under
// the floor is printed. Clauses (every one RED on breach):
//   B0  the subject exists and is visible (a missing subject is RED, never a skip)
//   B1  each of the four bands has ≥ 8 stations (an EMPTY band is RED)
//   B2  each band's core median ≥ floor (3.0)
// The legacy TOP-ONLY reading is printed beside (`topOnly`) so the hole a single band leaves is visible.
import { onOff, lum, ratio, median } from "./paint-lib.mjs";

export async function fourBands(page, { subject, edge, out = 8, inn = 8, span = [0.1, 0.9], floor = 3.0, offCss: offOverride = null, station = 1 }) {
  const loc = page.locator(subject).first();
  const vis = await loc.isVisible().catch(() => false);
  if (!vis) return { red: true, why: [`B0 subject ${subject} not visible`], bands: null };
  const vw = page.viewportSize();
  const clamp = (c) => { const x = Math.max(0, Math.floor(c.x)), y = Math.max(0, Math.floor(c.y)); return { x, y, width: Math.max(1, Math.min(vw.width - x, Math.ceil(c.width))), height: Math.max(1, Math.min(vw.height - y, Math.ceil(c.height))) }; };
  // Each band is photographed with ITS side scrolled into view (a subject taller than the viewport has its
  // bottom band below the fold; a clamped strip of the fold is not the edge). A side still outside the
  // viewport after the scroll photographs 0 stations → B1 EMPTY → RED (never skipped).
  const strip = (side, b) => side === "top" ? { x: b.x, y: b.y - out, width: b.width, height: out + inn }
    : side === "bottom" ? { x: b.x, y: b.y + b.height - inn, width: b.width, height: out + inn }
    : side === "left" ? { x: b.x - out, y: b.y, width: out + inn, height: Math.min(b.height, vw.height) }
    : { x: b.x + b.width - inn, y: b.y, width: out + inn, height: Math.min(b.height, vw.height) };
  const offCss = offOverride ?? `${edge} { visibility: hidden !important; }`;
  const bands = {}; const why = []; let b0 = null;
  const readBand = async (side, block) => {
    await loc.evaluate((e, block) => e.scrollIntoView({ block, inline: "nearest" }), block);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const b = await loc.boundingBox(); b0 ??= b;
    const raw = strip(side, b);
    const inView = raw.y + raw.height > 0 && raw.y < vw.height && raw.x + raw.width > 0 && raw.x < vw.width;
    if (!inView) return { stations: 0, coreMedian: 0, fracUnder: 1, dropped: 0, pose: block, occluder: "viewport" };
    // the OCCLUDER at the band's midpoint on the box edge (LAWS P5: name it)
    const occluder = await page.evaluate(({ x, y, sel, edge }) => {
      const e = document.elementFromPoint(x, y); if (!e) return "none";
      // the edge svg is pointer-events:none, so the hit is whatever lies under it: an ANCESTOR of the
      // subject is its ground (not an occluder); anything else painted there covers the edge
      const subj = document.querySelector(sel);
      if (e.closest(sel) || e.closest(edge) || (subj && e.contains(subj))) return null;
      const c = typeof e.className === "string" ? e.className : e.className?.baseVal ?? "";
      return `${e.tagName.toLowerCase()}${c ? "." + c.trim().split(/\s+/).slice(0, 2).join(".") : ""}`;
    }, { x: side === "left" || side === "right" ? raw.x + raw.width / 2 : b.x + b.width / 2, y: side === "top" || side === "bottom" ? raw.y + raw.height / 2 : b.y + Math.min(b.height, vw.height - b.y) / 2, sel: subject, edge });
    const clip = clamp(raw);
    const { on, off } = await onOff(page, clip, offCss);
    const horiz = side === "top" || side === "bottom";
    const len = horiz ? on.w : on.h, depth = horiz ? on.h : on.w;
    const s0 = Math.floor(len * span[0]), s1 = Math.ceil(len * span[1]);
    const st = [];
    for (let s = s0; s < s1; s += station) {
      let best = 1;
      for (let k = s; k < Math.min(s1, s + station); k++) for (let d = 0; d < depth; d++) {
        const x = horiz ? k : d, y = horiz ? d : k;
        const i = (y * on.w + x) * 3;
        const r = ratio(lum(on.data, i), lum(off.data, i));
        if (r > best) best = r;
      }
      st.push(best);
    }
    const med = median(st);
    return { stations: st.length, coreMedian: +med.toFixed(3), fracUnder: st.length ? +(st.filter((v) => v < floor).length / st.length).toFixed(3) : 1, dropped: st.filter((v) => v <= 1.0001).length, pose: block, occluder };
  };
  for (const side of ["top", "right", "bottom", "left"]) {
    // scroll POSES: the side's own edge first, then centred; an occluded first pose is printed with its
    // occluder and the better-seen pose is the reading (the band must be paintable at SOME reachable pose)
    const first = await readBand(side, side === "bottom" ? "end" : side === "top" ? "start" : "nearest");
    let band = first;
    const tried = [`${first.pose} ${first.coreMedian}${first.occluder ? " occ " + first.occluder : ""}`];
    for (const pose of side === "bottom" ? ["center", "start"] : side === "top" ? ["center", "end"] : ["center"]) {
      if (band.coreMedian >= floor) break;
      const next = await readBand(side, pose); tried.push(`${next.pose} ${next.coreMedian}${next.occluder ? " occ " + next.occluder : ""}`);
      if (next.coreMedian > band.coreMedian) band = next;
    }
    if (tried.length > 1) band = { ...band, firstPose: tried.join(" | ") };
    bands[side] = band;
    if (band.stations < 8) why.push(`B1 ${side} band EMPTY (${band.stations} stations${band.occluder ? ", occluder " + band.occluder : ""})`);
    else if (band.coreMedian < floor) why.push(`B2 ${side} core median ${band.coreMedian} < ${floor}${band.occluder ? " (occluder " + band.occluder + ")" : ""}`);
  }
  return { red: why.length > 0, why, bands, topOnly: bands.top ? (bands.top.coreMedian >= floor ? "GREEN" : "RED") : "RED", box: { x: +b0.x.toFixed(1), y: +b0.y.toFixed(1), w: +b0.width.toFixed(1), h: +b0.height.toFixed(1) } };
}

/** The in-run plants every drawn-edge row ships (LAWS P6 §E): each must RED. `edge` = the edge element. */
export const EDGE_PLANTS = (edge) => ({
  X6_bottom_erased: `${edge} { clip-path: inset(-8px -8px 16px -8px) !important; }`,
  X4_opacity_015: `${edge} { opacity: 0.15 !important; }`,
  FADE15_ink: `${edge} { color: color-mix(in srgb, currentColor 15%, transparent) !important; stroke: color-mix(in srgb, currentColor 15%, transparent) !important; }`,
  INFO_X5_opacity_04: `${edge} { opacity: 0.4 !important; }`, // a sensitivity row (SELF's X5): printed, not required — a bright ink at 40 % can clear 3.0 on dark lawfully
});
