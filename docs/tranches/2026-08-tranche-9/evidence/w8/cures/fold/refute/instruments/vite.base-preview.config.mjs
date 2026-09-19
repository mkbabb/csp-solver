// C07a's BASE arm on the FOLDED tree: `vite preview` with NO `preview` block, i.e. the config
// as master has it at 74a2b5d9 (vite's default CORS middleware ON, which answers `Vary: Origin`).
// Copied from cures/C07a/verify-r1/vite.base.config.mjs and re-pointed at this worktree; it
// serves the CURED `dist`, so the ONLY thing that differs from :4256 is the response header.
// Only root/base/build.outDir shape a preview server's static responses; the build plugins are
// deliberately absent so nothing can write into any tree.
export default {
  root: '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-fold/web/frontend',
  base: '/',
  build: { outDir: 'dist' },
};
