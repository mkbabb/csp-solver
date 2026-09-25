// ACC-SIX pass-7 CRITIC plants (in-memory; no tree file written)
//   overyield: the yield keyed on the voice's LENGTH (> 20 chars), not on the wrap: kills the lesson wherever a long hint speaks, desk included
//   late300:   the yield reported 300 ms late: the count paints on row two, unclipped, for ~18 frames before it goes
//   latefit:   no report at all when the viewport is wider than 700 (irrelevant control) — unused
import base from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend/vite.config.ts';
const P = process.env.PLANT;
const plant = { name: 'acc6crit7-plant', enforce: 'pre', transform(code, id) {
  if (!id.endsWith('/chrome/MarginNote.vue')) return;
  let out = code;
  if (P === 'overyield') out = code.replace('if (m.offsetTop > v.offsetTop + v.offsetHeight / 2) emit("yielded");', 'if ((v.textContent ?? "").trim().length > 20) emit("yielded");');
  if (P.startsWith('late')) out = code.replace('if (m.offsetTop > v.offsetTop + v.offsetHeight / 2) emit("yielded");', 'if (m.offsetTop > v.offsetTop + v.offsetHeight / 2) setTimeout(() => emit("yielded"), ' + P.slice(4) + ');');
  if (out === code) throw new Error('plant missed ' + P); return out; } };
export default { ...base, plugins: [plant, ...(base.plugins ?? [])], cacheDir: '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit7-cache-plant-' + P };
