// THE HEAD CONTROL, DEV MODE — the shared read-only tree `.claude/worktrees/w7-control`
// (detached at 74a2b5d9). The chair's own preview arm serves the PRE-BUILT dist; this lane's
// prototype arm is a dev server, so π needs a dev control or the arms differ by pipeline as
// well as by diff. Nothing is written into the control tree: the cacheDir is lane-named and
// lives in THIS worktree.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/vite.config.ts";

export default {
  ...base,
  root: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend",
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/.vite-cache-note-erase-p4-control",
};
