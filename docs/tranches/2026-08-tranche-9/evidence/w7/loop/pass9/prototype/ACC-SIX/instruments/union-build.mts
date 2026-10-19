// ACC-SIX pass 9 · the WAVE union + homes.on-WAVE + the lane's on-WAVE delta, built out of tree (never banked)
import base from '<SCRATCH>/union/web/frontend/vite.config.ts';
const S = '<SCRATCH>';
export default { ...base, cacheDir: S + '/cache-union', build: { ...(base.build ?? {}), outDir: S + '/dist-union', emptyOutDir: false } };
