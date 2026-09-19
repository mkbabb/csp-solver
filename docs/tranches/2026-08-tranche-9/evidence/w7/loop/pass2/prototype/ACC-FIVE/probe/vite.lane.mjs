// ACC-FIVE pass-2 lane server: the estate's default export (a plain object) spread over a
// PRIVATE cacheDir. Worktrees share node_modules/.vite through the symlink and concurrent
// lanes evict each other's optimized deps. `.mjs`, not `.ts`: the repo root's package.json
// has no `"type": "module"`, so vite bundles a `.ts` config sitting here to CJS and the
// tailwind plugin's ESM default import comes back as a namespace object, not a function.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-41/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-41/.vite-cache",
};
