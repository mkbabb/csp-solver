// T9-W7 pass 2 · CTRL-TABS research — the lane's PRIVATE vite config.
// Worktrees share node_modules/.vite through the symlink and concurrent servers evict each
// other's optimized deps, so this lane keeps its own cacheDir inside the worktree.
import base from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-39/web/frontend/vite.config.ts';

export default {
  ...base,
  cacheDir:
    '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-39/.vite-cache-pass2-ctrl-tabs',
};
