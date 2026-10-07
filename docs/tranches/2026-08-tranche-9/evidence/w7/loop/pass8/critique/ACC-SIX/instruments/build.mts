// ACC-SIX pass-8 CRITIC · out-of-tree build of the critic's own archive (74a2b5d9 + pass8.diff), one in-memory plant
import base from '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6-crit8/base/web/frontend/vite.config.ts';
const P = process.env.PLANT ?? 'none';
const LINE = 'if (m.offsetTop > v.offsetTop + v.offsetHeight / 2) emit("yielded");';
const plant = { name: 'acc6crit8-plant', enforce: 'pre' as const, transform(code: string, id: string) {
  if (P === 'graphite' && id.endsWith('/assets/index.css')) {
    const o = code.replace('--ground-wash-unit: var(--wash-blue);', '--ground-wash-unit: var(--wash-graphite);');
    if (o === code) throw new Error('plant missed ' + P); return o;
  }
  if (P === 'w7' && id.endsWith('/assets/index.css')) {
    const o = code.replace('--wash-blue: color-mix(in srgb, var(--color-crayon-blue) 13%, transparent);', '--wash-blue: transparent;');
    if (o === code) throw new Error('plant missed ' + P); return o;
  }
  if (P === 'none' || P === 'graphite' || P === 'w7' || !id.endsWith('/chrome/MarginNote.vue')) return;
  let out = code;
  if (P === 'overyield') out = code.replace(LINE, 'if ((v.textContent ?? "").trim().length > 20) emit("yielded");');
  if (P.startsWith('late')) out = code.replace(LINE, LINE.replace('emit("yielded");', `setTimeout(() => emit("yielded"), ${P.slice(4)});`));
  if (P === 'noro') out = code.replace('yieldObserver = new ResizeObserver(readYield);', 'return;');
  if (P === 'raf') out = code.replace(LINE, LINE.replace('emit("yielded");', 'requestAnimationFrame(() => emit("yielded"));'));
  if (out === code) throw new Error('plant missed ' + P);
  return out; } };
export default { ...base, plugins: [plant, ...(base.plugins ?? [])], cacheDir: '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6-crit8/cache-' + P };
