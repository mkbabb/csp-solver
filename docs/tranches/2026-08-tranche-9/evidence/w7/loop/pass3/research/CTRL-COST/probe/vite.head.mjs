// THE HEAD CONTROL (chair §2.7): a second read-only server on MAIN at 74a2b5d9, private
// cacheDir in the session scratchpad so nothing is written into the frozen tree.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";
export default {
  ...base,
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/vite-cache-head",
};
