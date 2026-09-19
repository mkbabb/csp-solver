// Scratch vite config for the CTRL-RULE pass-2 research lane (HEAD, main tree, read-only).
// Private cacheDir per the chair's §7 ruling — worktrees share node_modules/.vite through a
// symlink and concurrent servers evict each other's optimized deps.
import base from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts'

export default {
  ...base,
  root: '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend',
  cacheDir:
    '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ctrl-rule-p2-vite',
}
