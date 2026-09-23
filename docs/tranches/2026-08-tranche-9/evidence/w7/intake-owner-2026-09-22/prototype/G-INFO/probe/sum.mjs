// Summarise desk-*.json: one line per cell per arm, then the gate roll-up per arm.
//   node sum.mjs <files...>
import { readFileSync } from 'node:fs';
const rows = process.argv.slice(2).flatMap((f) => JSON.parse(readFileSync(f, 'utf8')));
const fmt = (r) => r.err ? `${r.eng} ${r.arm} ${r.w}x${r.h} ${r.theme}${r.prm ? '/prm' : ''} ${r.start}/${r.mode} ERR ${r.err.slice(0, 120)}` :
  [r.eng, r.arm, `${r.w}x${r.h}`, r.theme + (r.prm ? '/prm' : ''), `${r.start}/${r.mode}`, 'vis', r.visFrac, `(${r.dVis}/${r.dRef})`, 'dl>verbs', r.dlBottomAboveVerbs,
    'stΔ', r.stDelta, 'siv', r.siv, 'vΔ', r.verbsMaxDelta, 'π', `${r.pre.pi.cardW}/${r.pre.pi.boardL}`, 'bar', r.bar.join('>'), 'barH', r.barH.join('>'),
    'trace', `h${r.trace.hFinal} settle${r.trace.settleMs} inter${r.trace.intermediateFrames} step${r.trace.maxStepPx} rev${r.trace.reversalPx} ratio${r.trace.stepRatioVsCurvePeak}`,
    'fr650', `${r.frames650.over16_7}/${r.frames650.over25}/max${r.frames650.max}`, 'band', `${r.contentBand.closed}>${r.contentBand.open}`,
    r.tab ? `tab ${r.tab.occluded}/${r.tab.n} blind ${r.tabBlinded.occluded}/${r.tabBlinded.n}` : '', r.flank ? `flank L${r.flank.closed.left}>${r.flank.open.left} R${r.flank.closed.right}>${r.flank.open.right}` : '',
    r.borders ? `borders[${[...new Set(r.borders)].join(',')}]x${r.borders.length}` : ''].join(' ');
for (const r of rows) console.log(fmt(r));
const mm = (a) => a.length ? `${Math.min(...a)}…${Math.max(...a)}` : '-';
for (const arm of ['base', 'proto']) {
  const R = rows.filter((r) => r.arm === arm && !r.err);
  const P = R.filter((r) => !r.prm);
  console.log(`\n== ${arm}: n=${R.length} (errors ${rows.filter((r) => r.arm === arm && r.err).length})`);
  console.log(' visFrac', mm(R.map((r) => r.visFrac)), '| dl bottom above verbs', mm(R.map((r) => r.dlBottomAboveVerbs)));
  console.log(' stΔ', mm(R.map((r) => r.stDelta)), '| siv', mm(R.map((r) => r.siv)), '| verbs rect Δ', mm(R.map((r) => r.verbsMaxDelta)));
  console.log(' settle ms (no-PRM)', mm(P.map((r) => r.trace.settleMs)), '| reversal', mm(P.map((r) => r.trace.reversalPx)), '| step ratio', mm(P.map((r) => r.trace.stepRatioVsCurvePeak)));
  console.log(' PRM intermediate frames', mm(R.filter((r) => r.prm).map((r) => r.trace.intermediateFrames)), '| PRM settle', mm(R.filter((r) => r.prm).map((r) => r.trace.settleMs)));
}
// π per cell: proto vs base
const key = (r) => `${r.eng} ${r.w}x${r.h} ${r.theme}${r.prm ? '/prm' : ''} ${r.start}/${r.mode}`;
const byKey = {};
for (const r of rows) if (!r.err) (byKey[key(r)] ??= {})[r.arm] = r;
let worst = 0; const pis = new Set();
for (const [k, v] of Object.entries(byKey)) if (v.base && v.proto) {
  const d = Math.max(Math.abs(v.base.pre.pi.cardW - v.proto.pre.pi.cardW), Math.abs(v.base.pre.pi.boardL - v.proto.pre.pi.boardL), Math.abs(v.base.pre.pi.cardL - v.proto.pre.pi.cardL));
  worst = Math.max(worst, d); pis.add(`${v.base.eng} ${v.base.w}x${v.base.h}: card ${v.base.pre.pi.cardW}/${v.proto.pre.pi.cardW} boardL ${v.base.pre.pi.boardL}/${v.proto.pre.pi.boardL} barClosed ${v.base.pre.bar.h}/${v.proto.pre.bar.h}`);
}
console.log('\nπ worst |Δ| (cardW, cardL, boardL) =', +worst.toFixed(3));
for (const p of pis) console.log(' ', p);
