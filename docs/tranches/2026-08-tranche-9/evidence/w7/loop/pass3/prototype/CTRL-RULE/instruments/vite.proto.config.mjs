// CTRL-RULE pass 3 — the PROTOTYPE's dev server, with a PRIVATE optimized-deps cache.
// Worktrees share node_modules through the symlink, so two servers on the estate's default
// cacheDir evict each other's optimized deps mid-run. :4231 is this lane's charter port.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28/.vite-cache",
};
