// CTRL-FACE pass-3 research — scratch vite config: the estate's own config with a PRIVATE
// cacheDir so concurrent lanes do not evict each other's optimized deps (chair §7).
// The cache lands in this session's scratchpad, not in the frozen main tree.
import base from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts';
export default {
  ...base,
  cacheDir:
    '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/vite-cache-face',
};
