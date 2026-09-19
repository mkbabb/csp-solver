// NOTE-LEDGER pass-2 research — the lane's own vite config. Spreads the estate's default and
// gives this server a PRIVATE optimize-deps cache, because the worktrees share
// `node_modules/.vite` through the symlink and concurrent lanes evict each other's deps.
// Never a committed vite.config.ts change; the estate's file is untouched.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-54/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-54/.vite-cache",
};
