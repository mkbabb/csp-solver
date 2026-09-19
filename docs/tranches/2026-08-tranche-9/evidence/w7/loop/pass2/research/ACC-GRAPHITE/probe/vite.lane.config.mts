// ACC-GRAPHITE pass-2 research: the estate's own config with a PRIVATE optimizer cache, so
// this lane's server cannot evict a concurrent lane's deps through the shared node_modules
// symlink. The estate's default export is a plain object; spreading it is the whole change.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-43/web/frontend/vite.config.ts";
export default {
  ...base,
  cacheDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-43/.vite-cache-acc-graphite-r2",
};
