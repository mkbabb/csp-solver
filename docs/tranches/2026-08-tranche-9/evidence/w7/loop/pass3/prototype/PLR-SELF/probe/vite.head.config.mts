// The HEAD CONTROL's server: the main tree's frontend, whose src is frozen at 74a2b5d9 (the
// campaign's standing law; the session-start `git status` carries docs-only modifications).
// Read-only — nothing is written into that tree, and the cacheDir is this session's scratchpad.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";

const MAIN = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion";

export default {
  ...base,
  root: `${MAIN}/web/frontend`,
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/.vite-cache-head",
  server: {
    ...(base as { server?: Record<string, unknown> }).server,
    fs: { allow: [MAIN] },
  },
};
