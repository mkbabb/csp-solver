// NOTE-LEDGER pass-3 RESEARCH — the HEAD subject (chair §2.7 / CHAIR-RULINGS "the base moved"):
// a read-only dev server on MAIN at 74a2b5d9. Private cacheDir in the session scratchpad so
// nothing is written into the frozen tree (the pass-2 trap: a scratch config carries the TREE's
// identity, not only its cache).
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";
export default {
  ...base,
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/vite-cache-note-ledger",
};
