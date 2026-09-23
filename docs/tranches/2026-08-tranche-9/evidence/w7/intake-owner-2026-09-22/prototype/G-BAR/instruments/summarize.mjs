// Summarise gbar.mjs runs into per-gate lines (min/median/max; raw JSON is never banked).
// usage: node summarize.mjs a.json b.json …
import { readFileSync } from 'node:fs';
const rows = process.argv.slice(2).flatMap((f) => JSON.parse(readFileSync(f, 'utf8')));
const r2 = (n) => (n == null || !isFinite(n) ? '–' : Math.round(n * 100) / 100);
const stat = (a) => { const s = a.filter((x) => x != null && isFinite(x)).sort((x, y) => x - y); return s.length ? `${r2(s[0])}/${r2(s[Math.floor(s.length / 2)])}/${r2(s[s.length - 1])} (n=${s.length})` : '–'; };
const by = (f) => rows.filter(f);
const P = (a) => a.arm === 'proto', T = (a) => a.arm === 'tab', B = (a) => a.arm === 'base';
const errs = rows.filter((a) => a.error); console.log('errors:', errs.length, errs.map((a) => `${a.engine}/${a.theme}/${a.cell}/${a.arm}: ${a.error.slice(0, 90)}`).join(' | '));
const key = (a) => `${a.engine}/${a.cell}/${a.theme}`;

console.log('\n## G1 lip (paths · sw · pruned · coverage t/b/l/r) and HEAD top-band');
for (const a of by((a) => !B(a))) console.log(a.arm, key(a), a.top?.lip?.paths, a.top?.lip?.sw?.join(), a.top?.lip?.pruned, a.lipPaint && JSON.stringify(a.lipPaint.coverage), 'ext', a.lipPaint && JSON.stringify(a.lipPaint.extentCss));
console.log('HEAD top-band ink:', stat(by(B).map((a) => a.lipPaint?.topBandInk)), 'lip nodes on HEAD:', by(B).filter((a) => a.top?.lip).length);
console.log('\n## G6 borders in the strip (max width) proto | base');
console.log('proto', stat(by(P).map((a) => Math.max(0, ...(a.top?.borders || []).map((q) => q.w)))), '| base', stat(by(B).map((a) => Math.max(0, ...(a.top?.borders || []).map((q) => q.w)))));
console.log('\n## G2 leak (census wells-diff L/R · opus diff L/R · fade-end pad band L/R · neg narrow fade end L/R)');
for (const a of by((a) => a.leak)) console.log(a.arm, key(a), JSON.stringify(a.leak.censusWellsDiff), JSON.stringify(a.leak.opusDiff), JSON.stringify(a.leak.fadeEndPadBand), a.leak.negNarrowFade ? JSON.stringify(a.leak.negNarrowFade) : '');
console.log('\n## G3 alignment |dL| |dR| (painted centroids, scroll end)');
for (const a of by((a) => a.rhythm)) console.log(a.arm, key(a), r2(a.rhythm.align.dL), r2(a.rhythm.align.dR));
console.log('\n## G4 rhythm (lip: box gap, s2s min/med, daylight min) vs inter-well (box gap, s2s med, daylight min) · neg (daylight min)');
for (const a of by((a) => a.rhythm)) console.log(a.arm, key(a), 'lip', r2(a.rhythm.boxGap + 4), r2(a.rhythm.s2s.min), r2(a.rhythm.s2s.med), r2(a.rhythm.daylight.min), '| wells', a.rhythm.interWell ? `${r2(a.rhythm.interWell.boxGap)} ${r2(a.rhythm.interWell.s2s.med)} ${r2(a.rhythm.interWell.daylight.min)}` : '–', '| neg', a.rhythmNeg ? `${r2(a.rhythmNeg.boxGap + 4)} ${r2(a.rhythmNeg.daylight.min)}` : '–');
console.log('\n## G5 dock foot (padB · lowest ink @0.625 · @0.5)');
for (const a of by((a) => a.foot)) console.log(a.arm, key(a), a.foot.padB, a.foot.lowestInk_0625, a.foot.padB_05, a.foot.lowestInk_05);
for (const a of by((a) => B(a) && a.cell.startsWith('390'))) console.log('base', key(a), 'bar→vp bottom', r2(a.top.vp.h - a.top.bar.b));
console.log('\n## G8 contrast: lip core median/min · sublabels core median');
for (const a of by((a) => a.lipPaint && !a.lipPaint.none)) console.log(a.arm, key(a), a.lipPaint.contrastCore.median, a.lipPaint.contrastCore.min, '| subs', (a.sublabels || []).map((s) => s.coreMedian).join(','));
for (const a of by(B)) console.log('base', key(a), '| subs', (a.sublabels || []).map((s) => s.coreMedian).join(','));
console.log('\n## G9 lip pruned / pose nodes / will-change; crude filter count proto vs base');
console.log('proto pruned', by(P).filter((a) => a.top?.lip?.pruned).length, '/', by(P).length, 'poseNodes', stat(by(P).map((a) => a.top?.lip?.poseNodes)), 'willChange', stat(by(P).map((a) => a.top?.lip?.willChange)));
const fl = {}; for (const a of rows) { (fl[key(a)] ||= {})[a.arm] = a.top?.filters; } console.log('filter-count deltas (proto-base) ≠0:', Object.entries(fl).filter(([k, v]) => v.proto !== v.base).map(([k, v]) => `${k}:${v.proto}-${v.base}`).join(' ') || 'none');
console.log('\n## G7 π: card / board / masthead rects proto vs base');
const pair = {}; for (const a of rows) (pair[key(a)] ||= {})[a.arm] = a;
for (const [k, v] of Object.entries(pair)) { if (!v.proto || !v.base) continue; const d = (x, y) => (x && y ? ['x', 'y', 'w', 'h'].map((q) => r2(x[q] - y[q])).join(',') : '–'); console.log(k, 'card', d(v.proto.top?.card, v.base.top?.card), 'board', d(v.proto.top?.board, v.base.top?.board), 'mast', d(v.proto.top?.masthead, v.base.top?.masthead), 'bar', d(v.proto.top?.bar, v.base.top?.bar), 'scrollH', `${v.proto.top?.sc?.scrollH}/${v.base.top?.sc?.scrollH}`, 'play', d(v.proto.top?.play, v.base.top?.play)); }
console.log('\n## G7 π signature: nodes outside the strip whose tag/rect/paint differ (proto vs base)');
for (const [k, v] of Object.entries(pair)) { if (!v.proto?.sig || !v.base?.sig) continue; const a = v.proto.sig, b = v.base.sig; let tags = 0, rect = 0, paint = 0; const ex = []; const n = Math.min(a.length, b.length); for (let i = 0; i < n; i++) { if (a[i][0] !== b[i][0]) { tags++; if (ex.length < 3) ex.push('T:' + a[i][0] + '≠' + b[i][0]); continue; } if (a[i][1] !== b[i][1]) { rect++; if (ex.length < 3) ex.push('R:' + a[i][0] + ' ' + a[i][1] + '≠' + b[i][1]); } if (a[i][2] !== b[i][2]) { paint++; if (ex.length < 6) ex.push('P:' + a[i][0]); } } console.log(k, `n ${a.length}/${b.length} tagΔ ${tags} rectΔ ${rect} paintΔ ${paint}`, ex.join(' ; ')); }
console.log('\n## G10 tab walk (controls · under · worst) proto | neg | base');
for (const a of by((a) => a.tabWalk)) console.log(a.arm, key(a), JSON.stringify(a.tabWalk), a.tabWalkNeg ? 'NEG ' + JSON.stringify(a.tabWalkNeg) : '');
console.log('\n## G11 notes (op · top below lip box bottom · below stroke · covers) + berth');
for (const a of by((a) => a.notes)) console.log(a.arm, key(a), a.notes.map((n) => `${n.op}/${n.topBelowFrameBottom}/${n.topBelowStroke}/${n.coversBodyControls}`).join(' '), 'berth', JSON.stringify(a.berth));
console.log('\n## G12 tags (orphans · clippedAbove · pinnedSeen · padT/cardPadT/sentinel)');
for (const a of by((a) => a.tags)) console.log(a.arm, key(a), a.tags.orphans, a.tags.clippedAbove, a.tags.pinnedSeen, a.tags.padT, a.tags.cardPadT, a.tags.sentinelTop);
console.log('\n## G13 landscape');
for (const a of by((a) => a.land || (a.cell.startsWith('8') && B(a)))) console.log(a.arm, key(a), JSON.stringify(a.land || null), 'bar', a.top?.bar && r2(a.top.bar.y), 'play', a.top?.play && r2(a.top.play.y), 'scH', a.top?.sc?.scrollH);
console.log('\n## G14 focus rings (fv · ringPx · overlap · outside inner edge)');
for (const a of by((a) => a.rings)) console.log(a.arm, key(a), a.rings.map((q) => `${q.fv}/${q.ringPx}/${q.overlapPx}/${q.outsideLipInnerEdgePx}`).join(' '));
console.log('\n## discontinuity: glide strip-vs-card jumps · scroll-still jumps');
for (const a of rows) if (a.glide) console.log(a.arm, key(a), 'glide', a.glide.frames, a.glide.stripVsCardJumps, a.glide.maxStepPx, 'travel', a.glide.cardTravel, '| scroll', a.scrollStill ? `${a.scrollStill.jumps}/${a.scrollStill.maxStepPx}` : '–');
console.log('\n## crib (i) landing');
for (const a of by((a) => a.crib)) console.log(a.arm, key(a), JSON.stringify(a.crib));
