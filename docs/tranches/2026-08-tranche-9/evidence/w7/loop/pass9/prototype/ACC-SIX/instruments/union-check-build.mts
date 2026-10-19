// ACC-SIX pass 9 · the WAVE union + homes.on-WAVE + the lane's on-WAVE delta, rebuilt at return to prove the served union dist is bank-4's (never banked)
import base from '<SCRATCH>/union/web/frontend/vite.config.ts';
const S = '<SCRATCH>';
export default { ...base, cacheDir: S + '/cache-union-check', build: { ...(base.build ?? {}), outDir: S + '/dist-union-check', emptyOutDir: false } };
