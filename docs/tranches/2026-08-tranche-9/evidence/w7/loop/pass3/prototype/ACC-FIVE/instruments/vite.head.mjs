// ACC-FIVE pass-3 HEAD CONTROL server config. The control is commit 74a2b5d9, exported with
// `git archive` into the scratchpad (the worktree carries the prototype, so the control cannot
// be served from it). Its own private cacheDir.
import base from "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/head-tree/web/frontend/vite.config.ts";
export default {
  ...base,
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/.vite-cache-head",
};
