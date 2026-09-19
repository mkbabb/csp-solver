import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";

// The HEAD control: the MAIN tree at 74a2b5d9, served READ-ONLY on the band's next free port.
// Its vite cache is redirected out of the shared node_modules/.vite so the two servers cannot
// evict each other's optimized deps (the pass-3 law).
export default {
  ...base,
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/head-vite-cache",
};
