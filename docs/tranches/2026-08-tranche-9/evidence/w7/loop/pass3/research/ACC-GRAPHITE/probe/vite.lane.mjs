// ACC-GRAPHITE pass-3 research: serve the MAIN tree (HEAD 74a2b5d9) read-only with a PRIVATE
// vite cacheDir, so concurrent lanes cannot evict each other's optimized deps.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";
export default {
  ...base,
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/.vite-cache-acc-graphite-serve",
};
