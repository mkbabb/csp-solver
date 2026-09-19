// CRITIC's own server for the PLR-SELF prototype worktree. Private cacheDir (the estate's
// node_modules/.vite is shared through the symlink and concurrent lanes evict each other).
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-52/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/PLR-SELF/cache-proto",
};
