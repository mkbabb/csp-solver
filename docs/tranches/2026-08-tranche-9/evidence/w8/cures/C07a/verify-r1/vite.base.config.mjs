// verify round 1b — the BASE arm's server: vite preview with NO `preview` block, i.e. the
// branch's config as found at 7b0610cc (vite's default CORS middleware on). Serves dist-base.
// Only root/base/build.outDir shape a preview server's static responses; the build plugins are
// deliberately absent so nothing can write into any tree. No `defineConfig` import: the config
// sits outside the frontend package and vite resolves its temp module beside it.
export default {
  root: '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-wasm/web/frontend',
  base: '/',
  build: { outDir: 'dist-base' },
}
