// T9-W7 pass 3 · MRK-ABS PROTOTYPE — the prototype's own dev server.
// Serves the LANE'S WORKTREE with a PRIVATE cacheDir (registry-v2 §7): the worktrees share
// node_modules through a symlink, so concurrent lanes would otherwise evict each other's deps.
//   npx vite --config <this> --host 127.0.0.1 --port 4239 --strictPort   (from <worktree>/web/frontend)
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend/vite.config.ts";

export default {
  ...(base as object),
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/.vite-cache",
};
