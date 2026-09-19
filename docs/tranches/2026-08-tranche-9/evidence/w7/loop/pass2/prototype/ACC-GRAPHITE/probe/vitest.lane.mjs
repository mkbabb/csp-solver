// The lane's unit runner for the GEOMETRY probe. A plain object, no `defineConfig` import:
// this file lives in the evidence tree, which has no `node_modules` above it, so anything it
// imported would resolve against the wrong root.
const FE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-40/web/frontend";
const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/ACC-GRAPHITE/probe";

export default {
  root: FE,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-40/.vite-cache-unit",
  resolve: {
    alias: {
      "@pencil": FE + "/src/pencil",
      "@games": FE + "/src/games",
      "@": FE + "/src",
    },
  },
  test: {
    environment: "node",
    include: [HERE + "/*.probe.test.ts"],
    globals: false,
  },
};
