// PLR-COUNT pass-2 lane vite config. Private cache dir: worktrees share node_modules/.vite
// through the symlink and concurrent servers evict each other's optimized deps.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-47/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-47/.vite-cache",
};
