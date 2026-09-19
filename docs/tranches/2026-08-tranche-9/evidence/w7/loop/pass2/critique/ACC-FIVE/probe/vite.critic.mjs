// ACC-FIVE pass-2 CRITIC lane server. The estate's default export spread over a private
// cacheDir so the concurrent lanes cannot evict this one's optimized deps.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-41/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-41/.vite-cache-critic",
};
