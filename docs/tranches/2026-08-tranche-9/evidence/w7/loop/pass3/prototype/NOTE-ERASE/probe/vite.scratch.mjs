// NOTE-ERASE pass-3 lane server (the PROTOTYPE tree). The estate's config, spread, with a
// PRIVATE cacheDir: worktrees share node_modules/.vite through the symlink and concurrent
// lanes evict each other's optimized deps. Never a committed vite.config.ts change.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/.vite-cache",
};
