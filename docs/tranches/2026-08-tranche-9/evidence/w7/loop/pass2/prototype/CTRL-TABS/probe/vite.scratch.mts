// CTRL-TABS pass-2 — the lane's PRIVATE vite config. The estate's default export is a plain
// object; spreading it and re-pointing `cacheDir` keeps this worktree's optimized deps out of
// the shared `node_modules/.vite` every worktree symlinks (concurrent lanes evict each other's
// there, and a half-evicted cache is a dev server serving stale modules).
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-35/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-35/.vite-cache",
};
