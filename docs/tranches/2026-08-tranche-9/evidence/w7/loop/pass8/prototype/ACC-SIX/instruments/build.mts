// ACC-SIX pass 8 · out-of-tree BUILD with ONE in-memory plant (PLANT env; none = the tree). No tree file is written.
//   overyield  the yield keyed on the voice's LENGTH (> 20 chars), not on the wrap (the pass-7 critic's)
//   late150    the yield reported 150 ms late (the pass-7 critic's)
//   yieldoff   no report at all (the yield's mechanism deleted)
//   slow49     gridPaths FRONT_MIN_MS -> 49 (G10's floor clause born-RED: an 18/s front)
//   graphite   the wash const flipped to GRAPHITE's arm (index.css, one line)
//   gold       the ink const flipped to FIVE's gold arm (index.css, two lines)
import base from '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8/bt/web/frontend/vite.config.ts';
const P = process.env.PLANT ?? 'none';
const LINE = 'if (m.offsetTop > v.offsetTop + v.offsetHeight / 2) emit("yielded");';
const plant = { name: 'acc6p8-plant', enforce: 'pre' as const, transform(code: string, id: string) {
  if (P === 'slow49' && id.endsWith('/grid/gridPaths.ts')) {
    const o = code.replace('export const FRONT_MIN_MS = MOTION.hand.stepMs - 1;', 'export const FRONT_MIN_MS = 49;');
    if (o === code) throw new Error('plant missed slow49'); return o;
  }
  if ((P === 'graphite' || P === 'gold') && id.endsWith('/assets/index.css')) {
    const o = P === 'graphite'
      ? code.replace('--ground-wash-unit: var(--wash-blue);', '--ground-wash-unit: var(--wash-graphite);')
      : code.replace('--accent-ink: var(--accent-violet-ink);', '--accent-ink: var(--accent-gold-ink);').replace('--accent-glow: var(--accent-violet-glow);', '--accent-glow: var(--accent-gold-glow);');
    if (o === code || (P === 'gold' && !o.includes('--accent-glow: var(--accent-gold-glow);'))) throw new Error('plant missed ' + P); return o;
  }
  if (P === 'none' || P === 'slow49' || P === 'graphite' || P === 'gold' || !id.endsWith('/chrome/MarginNote.vue')) return;
  let out = code;
  if (P === 'overyield') out = code.replace(LINE, 'if ((v.textContent ?? "").trim().length > 20) emit("yielded");');
  if (P.startsWith('late')) out = code.replace(LINE, LINE.replace('emit("yielded");', `setTimeout(() => emit("yielded"), ${P.slice(4)});`));
  if (P === 'yieldoff') out = code.replace(LINE, 'void emit;');
  if (out === code) throw new Error('plant missed ' + P);
  return out; } };
export default { ...base, plugins: [plant, ...(base.plugins ?? [])], cacheDir: '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8/cache-wf45-' + P };
