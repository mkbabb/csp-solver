// PLR-COUNT pass-2 PROTOTYPE rig. Private cache dir: worktrees share node_modules/.vite through
// the symlink and concurrent servers evict each other's optimized deps (CHAIR §7).
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-53/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-53/.vite-cache",
};
