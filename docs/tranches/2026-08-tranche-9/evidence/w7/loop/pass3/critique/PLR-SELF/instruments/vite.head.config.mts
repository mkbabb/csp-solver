// The HEAD CONTROL (74a2b5d9) for the critic's pi rows. The MAIN tree's frontend, read-only;
// its src carries no modification at this session's start. Port 4239, scratchpad cacheDir.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";

const MAIN = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion";

export default {
  ...base,
  root: `${MAIN}/web/frontend`,
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/.vite-cache-critic-head",
  server: {
    ...(base as { server?: Record<string, unknown> }).server,
    fs: { allow: [MAIN] },
  },
};
