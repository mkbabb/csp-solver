// ACC-GRAPHITE pass-3 RESEARCH lane unit runner. Read-only on the product: it imports the
// MAIN tree's shipped generators at HEAD (74a2b5d9) and writes only into this evidence dir.
// A plain object, no `defineConfig` import — this file lives in the evidence tree, which has
// no `node_modules` above it. Private cacheDir (scratchpad) per the pass-3 vite law.
const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/research/ACC-GRAPHITE/probe";

export default {
  root: FE,
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/.vite-cache-acc-graphite-r3",
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
