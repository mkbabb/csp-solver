set -x
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-40/web/frontend
for vp in desk phone; do for th in light dark; do
  VP=$vp THEME=$th npx playwright test --config critique-probe/pw.config.ts critique-probe/verify.probe.ts 2>&1 | tail -12
done; done
echo "EXIT-LINE done"
