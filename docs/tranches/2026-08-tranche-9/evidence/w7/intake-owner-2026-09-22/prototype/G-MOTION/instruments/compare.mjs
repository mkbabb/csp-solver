// node compare.mjs ink <base.png> <proto.png> [diff.png]   → max channel Δ, pixels Δ>1, alpha/AA stats
// node compare.mjs pi <base-pi.json> <proto-pi.json>        → moved elements outside / inside the tag-delta zone
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const sharp = require("sharp");
const [mode, a, b, diffOut] = process.argv.slice(2);
if (mode === "ink") {
  const A = await sharp(a).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const B = await sharp(b).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (A.info.width !== B.info.width || A.info.height !== B.info.height) { console.log(JSON.stringify({ sizeMismatch: [A.info, B.info].map((i) => `${i.width}x${i.height}`) })); process.exit(0); }
  let max = 0, n1 = 0, n4 = 0, sum = 0; const N = A.info.width * A.info.height; const d = Buffer.alloc(N * 3);
  // "painted AA": the count of partially-inked pixels (neither paper nor full ink) on each side
  const lum = (buf, i) => 0.299 * buf[i] + 0.587 * buf[i + 1] + 0.114 * buf[i + 2];
  let aaA = 0, aaB = 0; const paper = lum(A.data, 0);
  for (let p = 0; p < N; p++) {
    const i = p * 4; let m = 0;
    for (let c = 0; c < 3; c++) m = Math.max(m, Math.abs(A.data[i + c] - B.data[i + c]));
    max = Math.max(max, m); if (m > 1) n1++; if (m > 4) n4++; sum += m;
    const v = Math.min(255, m * 8); d[p * 3] = v; d[p * 3 + 1] = v; d[p * 3 + 2] = v;
    const la = Math.abs(lum(A.data, i) - paper), lb = Math.abs(lum(B.data, i) - paper);
    if (la > 8 && la < 120) aaA++; if (lb > 8 && lb < 120) aaB++;
  }
  if (diffOut) await sharp(d, { raw: { width: A.info.width, height: A.info.height, channels: 3 } }).png().toFile(diffOut);
  console.log(JSON.stringify({ px: `${A.info.width}x${A.info.height}`, maxChannelDelta: max, pxOver1: n1, pxOver4: n4, meanDelta: +(sum / N).toFixed(4), aaPxBase: aaA, aaPxProto: aaB }));
} else {
  const A = JSON.parse(readFileSync(a, "utf8")), B = JSON.parse(readFileSync(b, "utf8"));
  const zone = (e) => /svg\[\d+\]/.test(e.path) && (e.zone ?? false);
  const idx = (L) => { const m = new Map(); for (const e of L) m.set(e.path, e); return m; };
  // mark the tag-delta zone: descendants of the grid svg and the wordmark svg
  const mark = (L) => { const roots = L.filter((e) => /(^|\s)(hand-drawn-grid|handwritten-logo)(\s|$)/.test(e.cls)).map((e) => e.path); const inks = L.filter((e) => /(^|\s)grid-ink(\s|$)/.test(e.cls)).map((e) => e.path); for (const e of L) e.zone = roots.some((r) => e.path.startsWith(r + ">")) || inks.some((r) => e.path === r || e.path.startsWith(r + ">")); return L; };
  mark(A); mark(B);
  const MA = idx(A), MB = idx(B);
  const moved = [], zoneDelta = { baseOnly: 0, protoOnly: 0, changed: 0, tagsBase: {}, tagsProto: {} };
  for (const e of A) if (e.zone) zoneDelta.tagsBase[e.tag] = (zoneDelta.tagsBase[e.tag] || 0) + 1;
  for (const e of B) if (e.zone) zoneDelta.tagsProto[e.tag] = (zoneDelta.tagsProto[e.tag] || 0) + 1;
  for (const [p, ea] of MA) {
    const eb = MB.get(p);
    if (ea.zone || (eb && eb.zone)) { if (!eb) zoneDelta.baseOnly++; else if (JSON.stringify(ea.props) !== JSON.stringify(eb.props) || ea.tag !== eb.tag) zoneDelta.changed++; continue; }
    if (!eb) { moved.push({ p, why: "missing in proto", cls: ea.cls }); continue; }
    const diffs = []; if (ea.tag !== eb.tag) diffs.push(`tag ${ea.tag}→${eb.tag}`); if (ea.cls !== eb.cls) diffs.push(`class '${ea.cls}'→'${eb.cls}'`); if (ea.rect !== eb.rect) diffs.push(`rect ${ea.rect}→${eb.rect}`);
    for (const k of Object.keys(ea.props)) if (ea.props[k] !== eb.props[k]) diffs.push(`${k} ${ea.props[k]}→${eb.props[k]}`);
    if (diffs.length) moved.push({ p: p.slice(-90), cls: ea.cls.slice(0, 40), diffs: diffs.slice(0, 4) });
  }
  for (const [p, eb] of MB) if (!MA.has(p) && !eb.zone) moved.push({ p: p.slice(-90), why: "new in proto", cls: eb.cls });
  for (const [p, eb] of MB) if (!MA.has(p) && eb.zone) zoneDelta.protoOnly++;
  console.log(JSON.stringify({ elementsBase: A.length, elementsProto: B.length, movedOutsideZone: moved.length, moved: moved.slice(0, 8), zoneDelta }));
}
