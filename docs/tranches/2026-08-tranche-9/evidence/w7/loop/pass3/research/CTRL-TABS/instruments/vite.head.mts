// CTRL-TABS pass-3 RESEARCH — the HEAD control server's config (chair §7: private cacheDir).
// The tree is MAIN at 74a2b5d9 (read-only; this lane writes no product file). The cacheDir is
// the session scratchpad, never the repo, so the frozen main tree gains no untracked directory.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/.vite-cache-ctrl-tabs-r3",
};
