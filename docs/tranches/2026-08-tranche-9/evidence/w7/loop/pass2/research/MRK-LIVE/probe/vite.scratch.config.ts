// MRK-LIVE pass-2 RESEARCH scratch vite config. Spreads the estate's default and gives this
// lane a PRIVATE optimized-deps cache, so concurrent lanes on the shared node_modules symlink
// cannot evict each other's deps. Never a committed vite.config.ts change.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-44/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-44/.vite-cache-mrk-live-p2",
};
