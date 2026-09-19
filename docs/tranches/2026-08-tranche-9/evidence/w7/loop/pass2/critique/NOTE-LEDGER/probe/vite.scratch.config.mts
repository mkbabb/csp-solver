// NOTE-LEDGER pass-2 CRITIQUE — the critic's own vite config, pointed at the PROTOTYPE's
// worktree (wf_8630d340-e56-47) with a cacheDir of its own so nothing evicts a concurrent
// lane's optimized deps. Never a committed vite.config.ts change.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-47/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-47/.vite-cache-critique",
};
