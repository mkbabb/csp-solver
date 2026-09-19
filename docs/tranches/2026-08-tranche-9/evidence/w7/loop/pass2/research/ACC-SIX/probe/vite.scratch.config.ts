// ACC-SIX pass-2 — PREVIEW-ONLY scratch config. It serves the ALREADY-BUILT dist
// (index-9rZPzI5DEcpe.js, the artifact W8 §8.1 holds fixed): no build runs, no plugin is
// needed to serve static files, and the private `cacheDir` keeps this lane out of the shared
// node_modules/.vite that the worktrees symlink. The estate's vite.config.ts is never edited
// and never loaded — spreading it here pulls @tailwindcss/vite through a foreign root and
// throws before the server binds.
export default {
  root: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend",
  cacheDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/.vite-cache-acc-six",
  build: { outDir: "dist" },
  preview: { host: "127.0.0.1", port: 4237, strictPort: true },
};
