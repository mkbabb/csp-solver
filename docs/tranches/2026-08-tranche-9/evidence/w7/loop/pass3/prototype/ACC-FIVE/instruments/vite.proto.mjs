// ACC-FIVE pass-3 PROTOTYPE server config. Two lines over the estate's own export, plus the
// PRIVATE cacheDir the chair's §7 requires (worktrees share node_modules/.vite through the
// symlink and concurrent servers evict each other's optimized deps).
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend/vite.config.ts";
export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/.vite-cache-serve",
};
