// ACC-SIX pass 7 · PLANT server: the tree served with ONE in-memory rewrite (no tree file is written).
//   PLANT=ablate    gridPaths FRONT_MIN_MS -> 0 (G10's rate born-RED)
//   PLANT=yieldoff  MarginNote never reports the wrap (the yield's mechanism deleted: the count wraps to row 2)
//   PLANT=pass6     the pass-6 yield: no report, the clip-path back (the strobe's reference arm)
//   PLANT=unheight  no report AND the meta's zero height undone (pass 6's 'rule deletion': the strip grows)
import base from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend/vite.config.ts';
const P = process.env.PLANT;
const plant = {
  name: 'acc6p7-plant', enforce: 'pre',
  transform(code, id) {
    if (P === 'ablate' && id.endsWith('/grid/gridPaths.ts')) {
      const out = code.replace('export const FRONT_MIN_MS = MOTION.hand.stepMs - 1;', 'export const FRONT_MIN_MS = 0;');
      if (out === code) throw new Error('plant ablate missed'); return out;
    }
    if ((P === 'yieldoff' || P === 'pass6' || P === 'unheight') && id.endsWith('/chrome/MarginNote.vue')) {
      let out = code.replace('emit("yielded");', 'void emit;');
      if (P === 'pass6') out = out.replace('.margin-note-block.meta-yields .margin-note-meta {', '.margin-note-block.meta-yields { clip-path: inset(-100vh -100vw 0 -100vw); }\n.margin-note-block.meta-yields .margin-note-meta {');
      if (P === 'unheight') out = out.replace('.margin-note-block.meta-yields .margin-note-meta {\n  height: 0;', '.margin-note-block.meta-yields .margin-note-meta {\n  height: auto;');
      if (out === code) throw new Error('plant yield missed'); return out;
    }
  },
};
export default { ...base, plugins: [plant, ...(base.plugins ?? [])], cacheDir: '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6p7-cache-plant-' + P };
