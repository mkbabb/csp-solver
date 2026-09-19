// T9-W7 pass 3 · MRK-ABS PROTOTYPE — the HEAD CONTROL (74a2b5d9).
// Serves the MAIN tree READ-ONLY (main's src is frozen; no build ever runs there) with its own
// private cacheDir, separate from the prototype's.
//   npx vite --config <this> --host 127.0.0.1 --port 4240 --strictPort
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";

export default {
  ...(base as object),
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/.vite-abs-head",
};
