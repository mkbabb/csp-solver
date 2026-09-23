// Group an3 rows by cell (run minus its rep index) and print min/median/max per column.
// usage: node tab3.mjs <an3.json> [rows]   (rows: print each run instead of groups)
import { readFileSync } from 'node:fs';
const a = JSON.parse(readFileSync(process.argv[2]));
if (process.argv[3] === 'rows') {
  for (const r of a) console.log(r.run, 'hz', r.hz, 'rub', r.tRub0, 'draw', r.tDraw0, '->', r.tDrawn, 'given', r.tGiven, 'boil', r.tBoil, 'co', r.tCo0, 'worst', JSON.stringify(r.worst), 'dtmax', r.dtDrawMax, 'o34', r.over34, 'np', r.neverPartial, 'gp', r.gpMax, 'tp', r.tpMax, 'f20', r.frac20Med, 'enc', r.encIn.length, 'live', r.liveGrid, r.liveLogo, 'er', r.erases, 'lc', JSON.stringify(r.lcVals), 'inj', JSON.stringify(r.inj), 'rub%', r.rubWorstPctPerFrame);
  process.exit(0);
}
const g = {}; for (const r of a) (g[r.run.replace(/-\d+$/, '')] ??= []).push(r);
const mm = (xs) => { xs = xs.filter((x) => x != null && !Number.isNaN(x)).sort((p, q) => p - q); return xs.length ? `${xs[0]}/${xs[Math.floor(xs.length / 2)]}/${xs.at(-1)}` : '-'; };
const cols = [['n', (rs) => rs.length], ['hz', (rs) => mm(rs.map((r) => r.hz))], ['rub0', (rs) => mm(rs.map((r) => r.tRub0))], ['stroke0', (rs) => mm(rs.map((r) => r.tDraw0))], ['drawn', (rs) => mm(rs.map((r) => r.tDrawn))], ['lastGiven', (rs) => mm(rs.map((r) => r.tGiven))], ['boil', (rs) => mm(rs.map((r) => r.tBoil))], ['chrome0', (rs) => mm(rs.map((r) => r.tCo0))],
  ['worst frame%perim', (rs) => mm(rs.map((r) => r.worst.frame))], ['worst sub%', (rs) => mm(rs.map((r) => r.worst.sub))], ['worst cell%', (rs) => mm(rs.map((r) => r.worst.cell))], ['dt max in draw', (rs) => mm(rs.map((r) => r.dtDrawMax))], ['>34ms', (rs) => mm(rs.map((r) => r.over34))], ['lines partial<2 frames', (rs) => mm(rs.map((r) => r.neverPartial))], ['max fronts', (rs) => mm(rs.map((r) => r.gpMax))], ['max tips', (rs) => mm(rs.map((r) => r.tpMax))], ['drawn@20% (med)', (rs) => mm(rs.map((r) => r.frac20Med))],
  ['encodes in hand window', (rs) => mm(rs.map((r) => r.encIn.length))], ['live-filter samples grid/logo', (rs) => `${mm(rs.map((r) => r.liveGrid))} · ${mm(rs.map((r) => r.liveLogo))}`], ['erases', (rs) => mm(rs.map((r) => r.erases))], ['rub worst %/frame', (rs) => mm(rs.map((r) => r.rubWorstPctPerFrame))]];
console.log('| cell | ' + cols.map((c) => c[0]).join(' | ') + ' |');
console.log('|' + '---|'.repeat(cols.length + 1));
for (const [k, rs] of Object.entries(g)) console.log(`| ${k} | ` + cols.map((c) => c[1](rs)).join(' | ') + ' |');
