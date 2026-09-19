// THE HEAD CONTROL (chair §7, registry §2.7): a second read-only server on MAIN at
// 74a2b5d9. Private cacheDir in the session scratchpad — nothing is written into the frozen
// tree, and no sibling lane's optimized deps are evicted.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";
export default {
  ...base,
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/vite-cache-accfive-head",
};
