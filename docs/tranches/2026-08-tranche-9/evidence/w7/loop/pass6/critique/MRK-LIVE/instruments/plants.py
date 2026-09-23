# critic's plants (MRK-LIVE pass 6): pass-5 X1/X2/X3 first, then the critic's own X4/X4b/X5
import sys, hashlib, os
FE='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/'
BAK='/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklivecrit6/bak/'
P = {
 'X1': ('src/assets/index.css', '  --ring-ink: var(\n    --color-focus-sketch\n  );', '  /* X1 plant */'),
 'X2': ('src/games/shared/gameCell.css', '.cell-ghost.is-active {\n  opacity: 1;\n}', '.cell-ghost.is-active {\n  opacity: 0;\n}'),
 'X3': ('src/pencil/sheet/AnswerKeyLaminate.vue', '<style scoped>\n', '<style scoped>\n.x3-plant {\n  animation-duration: var(--motion-note, 280ms);\n}\n'),
 # the drawn ring still paints, at 15 % (a ring no reader sees): existence is not visibility
 'X4': ('src/pencil/chrome/FocusRing.vue', '  stroke: var(--ring-ink);\n}', '  stroke: var(--ring-ink);\n  opacity: 0.15;\n}'),
 # the board's tier-2 ring still paints, at 20 %
 'X4b': ('src/games/shared/gameCell.css', '.cell-ghost.is-active {\n  opacity: 1;\n}', '.cell-ghost.is-active {\n  opacity: 0.2;\n}'),
 # a masked default in a lazy SFC's TEMPLATE (inline style), not its <style>
 'X5': ('src/pencil/sheet/AnswerKeyLaminate.vue', '    class="answer-key-laminate sheet-laminate"\n', '    class="answer-key-laminate sheet-laminate"\n    style="animation-duration: var(--motion-note, 280ms)"\n'),
}
def sha(p): return hashlib.sha1(open(p,'rb').read()).hexdigest()[:10]
name, act = sys.argv[1], sys.argv[2]
f, old, new = P[name]; p = FE + f; b = BAK + name + '.' + os.path.basename(f)
if act == 'apply':
    s = open(p).read(); open(b,'w').write(s)
    assert s.count(old) == 1, name
    open(p,'w').write(s.replace(old, new)); print('APPLIED', name, f, 'orig', sha(b), 'now', sha(p))
else:
    open(p,'w').write(open(b).read()); print('RESTORED', name, f, sha(p), 'equal' if sha(p)==sha(b) else 'MISMATCH')
