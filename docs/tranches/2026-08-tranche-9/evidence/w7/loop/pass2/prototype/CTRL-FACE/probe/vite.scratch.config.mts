// CTRL-FACE pass-2 scratch vite config (chair §7). NOT a change to the estate's config: it
// spreads it and adds a PRIVATE cacheDir, because worktrees share `node_modules/.vite` through
// the symlink and concurrent lanes evict each other's optimized deps. Scratch, untracked,
// deleted before the lane returns. It lives inside web/frontend because vite bundles a config
// from outside the project to CJS, and `@tailwindcss/vite` is ESM-only.
import base from "./vite.config";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-34/.vite-cache",
};
