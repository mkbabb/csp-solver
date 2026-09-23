// G8 + G1/G3/G9 side by side: proto vs control per (engine, game, theme, cell). usage: node g8.mjs <rawDir>
import { readFileSync, existsSync } from 'node:fs';
const dir = process.argv[2];
for (const e of ['chromium', 'webkit']) for (const th of ['light', 'dark']) {
  const fp = `${dir}/proto-${e}-${th}.json`, fb = `${dir}/base-${e}-${th}.json`; if (!existsSync(fp) || !existsSync(fb)) continue;
  const P = JSON.parse(readFileSync(fp)), B = JSON.parse(readFileSync(fb));
  for (const p of P) { const b = B.find((x) => x.game === p.game && x.cell === p.cell && x.plant === p.plant); if (!b || p.error || b.error) { console.log(e, th, p.cell, 'MISSING/ERR'); continue; }
    const dw = +(p.m.card.w - b.m.card.w).toFixed(2), dx = +(p.m.board.x - b.m.board.x).toFixed(2);
    console.log(`${e} ${th} ${p.game.padEnd(9)} ${p.cell.padEnd(15)} card ${b.m.card.w}→${p.m.card.w} Δ${dw} | board.x Δ${dx} | scrollW==clientW ${b.m.card.scrollW === b.m.card.clientW}→${p.m.card.scrollW === p.m.card.clientW} (${p.m.card.scrollW}/${p.m.card.clientW}) | zone ${b.m.zone.h}→${p.m.zone.h} | card scrollH ${b.m.card.scrollH}→${p.m.card.scrollH} | panelH ${b.m.panelH}→${p.m.panelH} | AA ${Object.values(b.aa).map((v) => v ?? '—').join('/')} → ${Object.values(p.aa).map((v) => v ?? '—').join('/')}`);
  }
}
