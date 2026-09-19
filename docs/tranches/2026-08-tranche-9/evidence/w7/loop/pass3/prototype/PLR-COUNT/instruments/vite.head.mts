// The HEAD control (74a2b5d9): the MAIN tree served READ-ONLY on the band's next free port.
// Its cacheDir is this lane's own, so the control cannot evict a neighbour's optimized deps.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";
export default {
  ...base,
  root: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend",
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/.vite-cache-head",
};
