// MRK-LIVE pass-2 PROTOTYPE scratch vite config. Spreads the worktree's default and gives this
// lane a PRIVATE optimized-deps cache, so concurrent lanes on the shared node_modules symlink
// cannot evict each other's deps. Never a committed vite.config.ts change.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-36/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-36/.vite-cache",
};
