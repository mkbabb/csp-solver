// PLR-SELF pass-2 RESEARCH — private vite cache, so concurrent lanes stop evicting each
// other's optimized deps. Spreads the worktree's own config; nothing committed.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-46/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-46/.vite-cache",
};
