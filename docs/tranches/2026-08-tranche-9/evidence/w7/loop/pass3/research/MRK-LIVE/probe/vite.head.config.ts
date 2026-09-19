// HEAD-control server for MRK-LIVE pass-3 research. Read-only on the main tree; the private
// cacheDir keeps the shared node_modules/.vite from being evicted by a concurrent lane.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";
export default {
  ...base,
  cacheDir: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrk-live-vite-cache",
};
