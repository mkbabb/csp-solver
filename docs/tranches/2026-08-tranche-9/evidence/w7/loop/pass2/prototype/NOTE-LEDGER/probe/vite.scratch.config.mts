// NOTE-LEDGER pass-2 PROTOTYPE — the lane's own vite config, re-pointed at the PASS-2
// worktree. Spreads the estate's default and gives this server a PRIVATE optimize-deps cache,
// because the worktrees share `node_modules/.vite` through the symlink and concurrent lanes
// evict each other's deps. Never a committed vite.config.ts change.
//
// `.mts` matters: a `.ts` scratch config outside the package bundles to CJS and dies on
// @tailwindcss/vite. And the IMPORT PATH is the whole file: the research lane's copy still
// named wf_e58b4764-0fc-54, so it served the PASS-1 build's index.html and 403'd this
// worktree's — a scratch config carries the tree's identity, not just its cache.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-47/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-47/.vite-cache",
};
