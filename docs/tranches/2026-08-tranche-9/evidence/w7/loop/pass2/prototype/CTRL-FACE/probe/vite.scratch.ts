// CTRL-FACE pass-2 scratch vite config (chair §7): the estate's config, spread, with a PRIVATE
// cacheDir. Worktrees share `node_modules/.vite` through the symlink and concurrent lanes evict
// each other's optimized deps; this keeps the eviction inside the worktree.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-34/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-34/.vite-cache",
};
