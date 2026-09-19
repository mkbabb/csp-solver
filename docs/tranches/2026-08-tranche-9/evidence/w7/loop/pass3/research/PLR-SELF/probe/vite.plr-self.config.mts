// PLR-SELF pass-3 research · the private-cache dev server (CHAIR §7).
// The estate's default export is a plain object; the cacheDir is OUTSIDE the frozen main tree
// (this lane is read-only on the repo, so the optimized deps live in the session scratchpad).
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/.vite-cache-plr-self",
};
