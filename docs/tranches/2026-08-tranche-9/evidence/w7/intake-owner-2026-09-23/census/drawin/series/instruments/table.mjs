import { readFileSync } from 'node:fs';
const a = JSON.parse(readFileSync(process.argv[2]));
const groups = {};
for (const r of a) { const k = r.run.replace(/-\d+$/, ''); (groups[k] ??= []).push(r); }
const mm = (xs) => { xs = xs.filter((x) => x != null).sort((p, q) => p - q); return xs.length ? `${xs[0]}/${xs[Math.floor(xs.length / 2)]}/${xs.at(-1)}` : '-'; };
console.log('| cell (engine-vp-cache-theme-motion) | n | draw start ms | draw window ms | painted frames in draw | frame dt max ms | frames >16.7 / >25 | frozen ms (>25) | worst single-frame line Δ % | lines never seen partial (of 17) | line jumps (>2× own median) | logo worst Δ % | givens pop at ms (count) | grid bake sync ms (per pose max / sum) | bake poses inside draw | long tasks in draw (chromium) |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const [k, rs] of Object.entries(groups)) {
  const gridKey = (r) => Object.keys(r.bakes).map(Number).sort((x, y) => y - x)[0];
  const row = [k, rs.length, mm(rs.map((r) => r.tDraw0)), mm(rs.map((r) => r.drawMs)), mm(rs.map((r) => r.grid?.frames)), mm(rs.map((r) => r.grid?.dtMax)), `${mm(rs.map((r) => r.grid?.over16))} / ${mm(rs.map((r) => r.grid?.over25))}`, mm(rs.map((r) => r.grid?.frozenMs)), mm(rs.map((r) => r.lineWorst?.d)), mm(rs.map((r) => r.linesSeenPartialInAtMost1Frame)), rs.map((r) => `${r.lineJumps}/${r.lineSteps}`).join(' '), mm(rs.map((r) => r.logo?.worst?.d)), rs.map((r) => (r.glPop ? `${r.glPop.at}(${r.glPop.to})` : '-')).join(' '), rs.map((r) => { const g = r.bakes[gridKey(r)]; return g ? `${gridKey(r)}px ${g.max}/${g.sum}` : '-'; }).join(' '), rs.map((r) => { const g = r.bakes[gridKey(r)]; return g ? g.inGrid : '-'; }).join(' '), rs.map((r) => r.longtasksInGrid.map((l) => l[1]).join('+') || '0').join(' ')];
  console.log('| ' + row.join(' | ') + ' |');
}
