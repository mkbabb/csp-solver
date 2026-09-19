#!/usr/bin/env node
/**
 * MRK-ABS pass-2 · THE PI CHECK — rect deltas on every surface this family does not claim.
 *
 * Walks r0's R1 controls census and this prototype's re-run of the SAME instrument, pairs every
 * numeric leaf by its full path, and reports the largest |delta| per top-level surface. The
 * family claims exactly two things off the board: an outline (which is not in flow and moves no
 * box) and the ring's own geometry (inside the cell's svg). Everything else must read pi.
 *
 * Also diffs the heading census literally: N heading voices in, N out.
 */
import fs from "node:fs";
import path from "node:path";

const R0 = process.argv[2];
const P1 = process.argv[3];
const IGNORE = /(^|\.)(at|ts|timestamp)$/;

function leaves(o, prefix = "", out = new Map()) {
  if (o === null || o === undefined) return out;
  if (typeof o === "number") {
    if (!IGNORE.test(prefix)) out.set(prefix, o);
    return out;
  }
  if (Array.isArray(o)) {
    o.forEach((v, i) => leaves(v, `${prefix}[${i}]`, out));
    return out;
  }
  if (typeof o === "object") {
    for (const [k, v] of Object.entries(o)) leaves(v, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

function strings(o, prefix = "", out = new Map()) {
  if (typeof o === "string") {
    out.set(prefix, o);
    return out;
  }
  if (Array.isArray(o)) {
    o.forEach((v, i) => strings(v, `${prefix}[${i}]`, out));
    return out;
  }
  if (o && typeof o === "object") {
    for (const [k, v] of Object.entries(o)) strings(v, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

const rows = [];
for (const cell of ["1280x800", "390x844", "900x500"]) {
  for (const engine of ["chromium", "webkit"]) {
    const fa = path.join(R0, `census-${cell}-${engine}.json`);
    const fb = path.join(P1, `census-${cell}-${engine}.json`);
    if (!fs.existsSync(fa) || !fs.existsSync(fb)) continue;
    const A = JSON.parse(fs.readFileSync(fa, "utf8"));
    const B = JSON.parse(fs.readFileSync(fb, "utf8"));
    const la = leaves(A);
    const lb = leaves(B);
    const perSurface = new Map();
    let missing = 0;
    let added = 0;
    for (const [k, v] of la) {
      if (!lb.has(k)) {
        missing++;
        continue;
      }
      const d = Math.abs(lb.get(k) - v);
      const surf = k.split(/[.[]/)[0];
      const cur = perSurface.get(surf) ?? { max: 0, at: "", n: 0 };
      cur.n++;
      if (d > cur.max) {
        cur.max = d;
        cur.at = k;
      }
      perSurface.set(surf, cur);
    }
    for (const k of lb.keys()) if (!la.has(k)) added++;

    const sa = strings(A);
    const sb = strings(B);
    let strDiff = 0;
    const strExamples = [];
    for (const [k, v] of sa) {
      if (sb.has(k) && sb.get(k) !== v) {
        strDiff++;
        if (strExamples.length < 8) strExamples.push(`${k}: ${JSON.stringify(v)} -> ${JSON.stringify(sb.get(k))}`);
      }
    }
    rows.push({
      cell,
      engine,
      headingsHead: A.headings?.length ?? (A.headings ? Object.keys(A.headings).length : null),
      headingsProto: B.headings?.length ?? (B.headings ? Object.keys(B.headings).length : null),
      numericLeavesPaired: [...perSurface.values()].reduce((a, b) => a + b.n, 0),
      leavesMissing: missing,
      leavesAdded: added,
      stringLeavesChanged: strDiff,
      stringExamples: strExamples,
      perSurfaceMaxDelta: Object.fromEntries(
        [...perSurface.entries()]
          .sort((a, b) => b[1].max - a[1].max)
          .map(([k, v]) => [k, { maxAbsDeltaPx: +v.max.toFixed(3), at: v.at, n: v.n }]),
      ),
    });
  }
}
console.log(JSON.stringify({ r0: R0, proto: P1, rows }, null, 2));
