// T9-W7 pass 3 · CTRL-RULE research lane — a PRIVATE vite cache, never the estate's default.
// Worktrees share node_modules/.vite through the symlink and concurrent servers evict each
// other's optimized deps; this config gives the lane its own.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-29/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-29/.vite-cache-r3rule",
};
