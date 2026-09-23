import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend/vite.config.ts";
// the sweep's server: no watcher, no HMR — the tree it serves is the tree at launch, so an edit made
// elsewhere during a 30-minute census cannot reload the page under it.
export default { ...base, cacheDir: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/.vite-cache-palwalk5-frozen", server: { ...(base.server ?? {}), hmr: false, watch: null } };
