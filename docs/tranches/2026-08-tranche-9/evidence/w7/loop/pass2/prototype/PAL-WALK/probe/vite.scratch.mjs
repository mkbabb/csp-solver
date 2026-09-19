// A PRIVATE vite cache for this lane's dev server. Worktrees share `node_modules/.vite` through
// the symlink and concurrent servers evict each other's optimized deps, so the estate's config
// is spread and only `cacheDir` moves — nothing committed, nothing shared.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-59/web/frontend/vite.config.ts";
export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-59/.vite-cache",
};
