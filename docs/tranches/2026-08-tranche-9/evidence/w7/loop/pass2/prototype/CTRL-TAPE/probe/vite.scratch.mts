// Scratch dev-server config for the CTRL-TAPE pass-2 lane. Spreads the estate's default
// export (a plain object) and gives this worktree a PRIVATE optimized-deps cache, so
// concurrent lanes on the shared node_modules symlink cannot evict each other's.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-28/web/frontend/vite.config.ts";
export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-28/.vite-cache",
};
