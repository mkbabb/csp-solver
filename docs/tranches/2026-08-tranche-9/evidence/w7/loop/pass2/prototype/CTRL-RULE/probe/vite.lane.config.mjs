// T9-W7 pass 2 · CTRL-RULE — the lane's own vite config. Two lines of substance: the estate's
// default export, spread, with a PRIVATE cacheDir inside this worktree. Worktrees share
// node_modules through a symlink and concurrent dev servers evict each other's optimized deps.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-29/web/frontend/vite.config.ts";
export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-29/.vite-cache",
};
