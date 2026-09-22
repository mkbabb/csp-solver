// The BUILD config for this lane. Separate cacheDir from the serve config (LAWS: build and serve
// never share one). Output stays the tree's own `dist/`.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/.vite-cache-note-erase-p4-build",
};
