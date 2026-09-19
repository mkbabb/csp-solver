// NOTE-ERASE pass-2 lane server. The estate's config, spread, with a PRIVATE cacheDir:
// worktrees share node_modules/.vite through the symlink and concurrent lanes evict each
// other's optimized deps. Never a committed vite.config.ts change.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-48/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-48/.vite-cache",
};
