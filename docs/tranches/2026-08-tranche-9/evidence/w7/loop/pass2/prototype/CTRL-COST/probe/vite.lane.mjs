// The lane's own vite config: the estate's default export (a plain object) spread over a
// PRIVATE cacheDir. Worktrees share node_modules/.vite through the symlink, so concurrent
// lanes evict each other's optimized deps; this keeps the dependency cache in the worktree.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-30/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-30/.vite-cache",
};
