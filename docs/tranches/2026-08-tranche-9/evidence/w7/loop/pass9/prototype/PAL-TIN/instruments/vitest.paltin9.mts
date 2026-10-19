import base from "$WORKTREES/wf_308fa864-c94-2/web/frontend/vitest.config.ts";
// PAL-TIN pass 9 scratch: the tree's vitest config with a private cacheDir (never banked)
export default { ...base, cacheDir: "$SCRATCH/cache/vitest" };
