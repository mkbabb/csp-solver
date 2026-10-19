import base from "$WORKTREES/wf_308fa864-c94-2/web/frontend/vite.config.ts";
// PAL-TIN pass 9 · scratch build config (never banked): private cacheDir in the lane's durable scratch.
export default { ...base, cacheDir: "$SCRATCH/cache/build" };
