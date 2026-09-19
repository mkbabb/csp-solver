import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-42/web/frontend/vite.config.ts";

// T9-W7 pass-2 law: worktrees share node_modules/.vite through the symlink, and concurrent
// dev servers evict each other's optimized deps. Private cacheDir, inside the worktree.
export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-42/.vite-cache",
};
