// Pass-2 CTRL-FACE research lane: the estate's config, a PRIVATE vite cache.
// Concurrent lanes share node_modules/.vite through the worktree symlink and evict
// each other's optimized deps; this keeps the lane's deps to itself.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-34/web/frontend/vite.config.ts";
export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-34/.vite-cache-r2",
};
