// T9-W7 pass 3 · MRK-ABS research lane — the scratch vite config (registry-v2 §7).
// Serves the MAIN tree at 74a2b5d9 (the pass-3 base, read-only for this lane) with a PRIVATE
// cacheDir so concurrent lanes cannot evict each other's optimized deps through the shared
// node_modules symlink. Run FROM web/frontend:
//   npx vite --config <this> --host 127.0.0.1 --port 4239 --strictPort
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";

export default {
  ...(base as object),
  cacheDir:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/.vite-mrkabs",
};
