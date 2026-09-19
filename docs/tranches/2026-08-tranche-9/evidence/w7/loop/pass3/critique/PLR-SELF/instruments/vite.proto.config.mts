// PLR-SELF pass-3 CRITIC's server for the prototype worktree. Port 4238.
// Private cacheDir (the worktree's own — its author's server is dead, so nothing evicts it).
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-51/web/frontend/vite.config.ts";

const WT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-51";

export default {
  ...base,
  root: `${WT}/web/frontend`,
  cacheDir: `${WT}/.vite-cache`,
  server: {
    ...(base as { server?: Record<string, unknown> }).server,
    fs: {
      allow: [
        WT,
        "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules",
        "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/csp-solver",
      ],
    },
  },
};
