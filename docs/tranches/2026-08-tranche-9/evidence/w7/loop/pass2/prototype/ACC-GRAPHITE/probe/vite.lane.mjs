// The lane's dev server: the estate's config, spread, with a PRIVATE optimized-deps cache.
// Concurrent worktree servers share `node_modules/.vite` and evict each other's deps.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-40/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-40/.vite-cache",
};
