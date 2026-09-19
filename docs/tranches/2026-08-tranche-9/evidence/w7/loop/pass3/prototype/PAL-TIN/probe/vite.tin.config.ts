// PAL-TIN pass-3 scratch server config — PRIVATE cacheDir (worktrees share node_modules/.vite
// through the symlink and concurrent servers evict each other's optimized deps). Not a product
// file; removed before the lane returns, banked under the evidence dir's probe/.
import base from "./vite.config";

export default {
  ...base,
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/.vite-cache-tin",
};
