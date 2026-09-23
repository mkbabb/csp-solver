// π compare: control vs prototype, element-by-element in DOM order (computed paint props + tag + attr names + rect)
// node picmp.mjs pi/base-X.json pi/K2-X.json
import { readFileSync } from "node:fs";
const [a, b] = process.argv.slice(2).map((f) => JSON.parse(readFileSync(f, "utf8")));
const PROPS = ["display", "visibility", "opacity", "color", "background-color", "border-top-color", "fill", "stroke", "stroke-width", "filter", "transform", "scale", "font-family", "font-size", "font-weight", "box-shadow", "outline-style", "mix-blend-mode", "clip-path", "z-index", "position"];
const CLAIMED = /sun-moon-toggle|hand-drawn-grid/;
const BEAT = /pose|boil-frame|boil-divider|rest-twinkle/;
const out = { counts: [a.snap.length, b.snap.length], tagSeqEqual: a.snap.map((x) => x.tag).join() === b.snap.map((x) => x.tag).join(), claimed: [], unclaimed: [], beatOnly: 0 };
// align by DOM path: a node present on one side only is reported, never allowed to shift the rest
const pairs = []; out.onlyControl = []; out.onlyProto = [];
for (let i = 0, j = 0; i < a.snap.length || j < b.snap.length; ) {
  if (i < a.snap.length && j < b.snap.length && a.snap[i].p === b.snap[j].p) { pairs.push([a.snap[i++], b.snap[j++]]); continue; }
  const k = b.snap.slice(j, j + 12).findIndex((y) => i < a.snap.length && y.p === a.snap[i].p);
  const l = a.snap.slice(i, i + 12).findIndex((x) => j < b.snap.length && x.p === b.snap[j].p);
  if (k > 0 && (l < 0 || k <= l)) { for (let q = 0; q < k; q++) out.onlyProto.push(b.snap[j++].p); continue; }
  if (l > 0) { for (let q = 0; q < l; q++) out.onlyControl.push(a.snap[i++].p); continue; }
  if (i < a.snap.length) out.onlyControl.push(a.snap[i++].p); if (j < b.snap.length) out.onlyProto.push(b.snap[j++].p);
}
for (const [x, y] of pairs) {
  const diffs = [];
  if (x.tag !== y.tag) diffs.push(`tag ${x.tag}→${y.tag}`);
  if (x.attrs !== y.attrs) diffs.push(`attrs ${x.attrs}→${y.attrs}`);
  if (x.rect !== y.rect) diffs.push(`rect ${x.rect}→${y.rect}`);
  const xv = x.v.split("|"), yv = y.v.split("|");
  PROPS.forEach((p, k) => { if (xv[k] !== yv[k]) diffs.push(`${p} ${xv[k].slice(0, 40)}→${yv[k].slice(0, 40)}`); });
  if (!diffs.length) continue;
  const beatOnly = BEAT.test(x.p) && diffs.every((d) => /^(opacity|visibility) /.test(d));
  if (beatOnly) { out.beatOnly++; continue; }
  (CLAIMED.test(x.p) ? out.claimed : out.unclaimed).push(`${x.p} :: ${diffs.join("; ")}`);
}
out.census = { control: a.census, proto: b.census };
out.btnAfter = [a.btnAfter, b.btnAfter];
console.log(JSON.stringify({ onlyControl: out.onlyControl, onlyProto: out.onlyProto, counts: out.counts, tagSeqEqual: out.tagSeqEqual, claimedN: out.claimed.length, unclaimedN: out.unclaimed.length, beatOnly: out.beatOnly, unclaimed: out.unclaimed.slice(0, 8), claimed: out.claimed.slice(0, 6), filterCensus: { control: Object.fromEntries(Object.entries(a.census).map(([k, v]) => [k, v && v.length])), proto: Object.fromEntries(Object.entries(b.census).map(([k, v]) => [k, v && v.length])) }, protoRestFilters: b.census.rest, protoMidFilters: b.census.mid, btnAfter: out.btnAfter }));
