// The HEAD control: the MAIN tree at 74a2b5d9 (its src is frozen for exactly this office).
// Read-only — served, never built into, with a PRIVATE cacheDir so this lane's optimized deps
// never evict a concurrent lane's out of the shared node_modules/.vite.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";
export default {
  ...base,
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/.vite-cache-head",
};
