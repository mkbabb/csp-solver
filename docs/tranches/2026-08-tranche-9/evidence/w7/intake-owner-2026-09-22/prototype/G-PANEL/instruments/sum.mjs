// summarise gpanel.mjs JSON: node sum.mjs a.json [b.json …] — one line per record, the gate reads only
import { readFileSync } from 'node:fs';
const f = (n) => (n == null ? '—' : typeof n === 'number' ? +n.toFixed(2) : n);
for (const file of process.argv.slice(2)) for (const r of JSON.parse(readFileSync(file, 'utf8'))) {
  if (r.error) { console.log(`${r.engine} ${r.game} ${r.theme} ${r.cell} ${r.plant} ERROR ${r.error}`); continue; }
  const m = r.m; const st = m.groups.filter((g) => g.staged); const live = m.groups.filter((g) => !g.staged);
  const s0 = m.sections[0];
  const tapeToH2 = s0 && m.tag ? s0.h2.y - m.tag.b : null;
  const h2ToChip = s0 && st[0] ? st[0].rects[0].y - s0.h2.b : null;
  const d = m.deal;
  const out = {
    regime: `${m.regime.coarse ? 'coarse' : 'fine'}·${m.regime.row ? 'row' : 'col'}·${m.regime.rail ? 'rail' : 'dock'}${m.regime.prm ? '·prm' : ''}`,
    zoneH: f(m.zone.h), step: m.zoneStep.trim(),
    staged: st.map((g) => `${g.labels.length}c/${g.lineCount}L[${g.boxes.join(' ')}]gx${f(g.gapX)}gy${f(g.gapY)}x${g.lineFirstX.join('/')}`).join(' | '),
    live: live.map((g) => `${g.labels[0]}:${g.lineCount}L gx${f(g.gapX)} gy${f(g.gapY)} [${g.boxes.join(' ')}]`).join(' | '),
    tapeToH2: f(tapeToH2), h2ToChip: f(h2ToChip),
    deal: `btn ${d.btn.w}x${d.btn.h} b${d.btn.b} pad ${d.btnPadInline} | tally ${d.tally ? d.tally.w + 'x' + d.tally.h + '@' + d.tally.x + ',' + d.tally.y : 'absent'} | Δbase ${f(d.baselineDelta)} clearX ${f(d.clearX)} ∩ ${f(d.intersect)} | row h ${d.row.h}`,
    armed: r.armed ? `Δbase ${f(r.armed.deal.baselineDelta)} clearX ${f(r.armed.deal.clearX)} btn ${r.armed.deal.btn.w} tally@${r.armed.deal.tally?.y} rowH ${r.armed.deal.row.h}` : undefined,
    G3: m.bar ? `verbBottom ${d.btn.b} vs fade ${f(m.bar.y - 32)} → ${d.btn.b <= m.bar.y - 32 ? 'GREEN' : 'RED'}` : '—',
    G3b: m.nextTape ? `tape ${m.nextTape.text} b${m.nextTape.rect.b} op${m.nextTape.opacity} under${m.nextTape.underBar} → ${m.nextTape.rect.b <= m.bar.y - 32 && +m.nextTape.opacity === 1 && !m.nextTape.underBar ? 'GREEN' : 'RED'}` : '—',
    ink: `h2 ${f(r.ink.h2)} chip ${f(r.ink.chip)} die ${f(r.ink.die)} Δchip ${f(r.ink.chip - r.ink.h2)} Δdie ${f(r.ink.die - r.ink.h2)}`,
    card: `w ${m.card.w} clientW ${m.card.clientW} scrollW ${m.card.scrollW} scrollH ${m.card.scrollH} board.x ${m.board?.x} panelH ${m.panelH}`,
    ctrlMin: m.ctrlMin ? `${m.ctrlMin.minW}x${m.ctrlMin.minH} n${m.ctrlMin.n}` : '—',
    aa: Object.entries(r.aa).map(([k, v]) => `${k} ${f(v)}`).join(' · '),
  };
  console.log(`\n## ${r.engine} ${r.game} ${r.theme} ${r.cell} plant=${r.plant} settle ${r.settleMs}ms`);
  for (const [k, v] of Object.entries(out)) if (v !== undefined) console.log(`  ${k}: ${v}`);
}
