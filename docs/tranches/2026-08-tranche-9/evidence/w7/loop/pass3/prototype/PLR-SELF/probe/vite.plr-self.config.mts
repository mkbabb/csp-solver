// The prototype's server. PRIVATE vite cacheDir: worktrees share `node_modules/.vite` through
// the symlink and concurrent lanes evict each other's optimized deps.
//
// `root` and `server.fs.allow` are spelled out because the config file itself lives in the
// evidence bank under `docs/`: vite infers both from the config's own directory, and the
// worktree's `index.html` then reads as "outside the serving allow list". The `node_modules`
// entry is the MAIN tree's real path — the worktree's is a symlink to it.
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
