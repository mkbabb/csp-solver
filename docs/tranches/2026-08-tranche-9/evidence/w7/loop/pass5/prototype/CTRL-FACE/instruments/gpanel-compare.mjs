// CTRL-FACE pass 5 — one line per (engine, game, cell): proto / control(74a2b5d9) / mainhead(1e6cfbbf) side by side.
// usage: node gpanel-compare.mjs <dir with gp-{proto,control,mainhead}-{chromium,webkit}.json>
import { readFileSync, existsSync } from "node:fs";
const dir = process.argv[2];
const load = (a, e) => (existsSync(`${dir}/gp-${a}-${e}.json`) ? JSON.parse(readFileSync(`${dir}/gp-${a}-${e}.json`, "utf8")) : []);
const f = (n) => (n == null || Number.isNaN(n) ? "—" : +(+n).toFixed(2));
const brief = (r) => {
  if (!r) return null;
  if (r.error) return { err: r.error.slice(0, 80) };
  const m = r.m, st = m.groups.filter((g) => g.staged), d = m.deal, s0 = m.sections[0];
  return {
    zone: f(m.zone.h),
    lines: st.map((g) => g.lineCount).join("+") || m.groups.map((g) => g.lineCount).join("+"),
    tapeH2: s0 && m.tag ? f(s0.h2.y - m.tag.b) : "—",
    g3: `${f(d.btn.b)}/${f(m.bar.y - 32)}`,
    g3b: m.nextTape ? `${m.nextTape.text}:${+m.nextTape.opacity === 1 && !m.nextTape.underBar && m.nextTape.rect.b <= m.bar.y - 32 ? "ok" : "under"}` : "—",
    die: r.ink.die != null && r.ink.h2 != null ? f(r.ink.die - r.ink.h2) : "—",
    chipInk: r.ink.chip != null && r.ink.h2 != null ? f(r.ink.chip - r.ink.h2) : "—",
    base: f(d.baselineDelta), clear: f(d.clearX), cut: f(d.intersect),
    armed: r.armed ? `${f(r.armed.deal.baselineDelta)}/${f(r.armed.deal.clearX)}` : "—",
    card: `${m.card.w}/${m.board?.x}`, sw: `${m.card.scrollW}/${m.card.clientW}`, scrollH: m.card.scrollH,
    btn: `${d.btn.w}x${f(d.btn.h)}`, rowH: f(d.row.h), wrapH: m.wrapH, givens: m.givens?.slice(0, 12),
    aa: Object.values(r.aa).map(f).join("/"),
    ctrlMin: m.ctrlMin ? `${m.ctrlMin.minW}x${m.ctrlMin.minH}` : "—",
  };
};
for (const e of ["chromium", "webkit"]) {
  const P = load("proto", e), C = load("control", e), M = load("mainhead", e);
  for (const r of P) {
    const k = (x) => x.game === r.game && x.cell === r.cell && x.theme === r.theme && x.plant === r.plant;
    const p = brief(r), c = brief(C.find(k)), m = brief(M.find(k));
    console.log(`\n## ${e} ${r.game} ${r.cell} (${r.theme})  — proto | control 74a2b5d9 | mainhead 1e6cfbbf`);
    for (const key of Object.keys(p)) console.log(`  ${key.padEnd(8)} ${String(p[key]).padEnd(22)} | ${String(c?.[key] ?? "—").padEnd(22)} | ${m?.[key] ?? "—"}`);
    console.log(`  givens-equal ${p.givens === c?.givens && c?.givens === m?.givens}`);
  }
}
