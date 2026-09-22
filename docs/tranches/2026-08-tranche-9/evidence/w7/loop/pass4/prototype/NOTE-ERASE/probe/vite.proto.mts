// NOTE-ERASE pass-4 lane server (the PROTOTYPE tree). The tree's own config, spread, with a
// PRIVATE cacheDir: worktrees share node_modules/.vite through the symlink and concurrent lanes
// evict each other's optimized deps. `.mts` because a `.ts` config bundled from outside the tree
// turns @tailwindcss/vite's ESM default into a non-function (CTRL-FACE's incident).
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/.vite-cache-note-erase-p4",
};
