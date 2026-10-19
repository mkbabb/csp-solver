// ACC-SIX pass 9 · the WAVE union + homes.on-WAVE + the lane's on-WAVE delta, ONE in-memory plant (never banked)
import base from '<SCRATCH>/union/web/frontend/vite.config.ts';
const P = process.env.PLANT ?? 'none';
const S = '<SCRATCH>';
const LINE = 'if (m.offsetTop > v.offsetTop + v.offsetHeight / 2) emit("yielded");';
const must = (o: string, c: string) => { if (o === c) throw new Error('plant missed ' + P); return o; };
const plant = { name: 'acc-six-plant', enforce: 'pre' as const, transform(code: string, id: string) {
  if (P === 'none') return;
  if (id.endsWith('/assets/index.css')) {
    if (P === 'w7') return must(code.replace('--wash-blue: color-mix(in srgb, var(--color-crayon-blue) 13%, transparent);', '--wash-blue: transparent;'), code);
    if (P === 'graphite') return must(code.replace('--ground-wash-unit: var(--wash-blue);', '--ground-wash-unit: var(--wash-graphite);'), code);
    return;
  }
  if (P === 'slow49') return id.endsWith('/grid/gridPaths.ts') ? must(code.replace('export const FRONT_MIN_MS = MOTION.hand.stepMs - 1;', 'export const FRONT_MIN_MS = 49;'), code) : undefined;
  if (P === 'w7' || P === 'graphite' || !id.endsWith('/chrome/MarginNote.vue')) return;
  if (P === 'overyield') return must(code.replace(LINE, 'if ((v.textContent ?? "").trim().length > 20) emit("yielded");'), code);
  if (P.startsWith('late')) return must(code.replace(LINE, LINE.replace('emit("yielded");', `setTimeout(() => emit("yielded"), ${P.slice(4)});`)), code);
  if (P === 'noro') return must(code.replace('yieldObserver = new ResizeObserver(readYield);', 'return;'), code);
  throw new Error('unknown plant ' + P);
} };
export default { ...base, plugins: [plant, ...(base.plugins ?? [])], cacheDir: S + '/cache-u-' + P, build: { ...(base.build ?? {}), outDir: S + (P === 'none' ? '/dist-union' : '/dist-u-' + P), emptyOutDir: false } };
