# File plants on the SCRATCH COPY (never the work tree). usage: plants8.py <name> apply|restore
import sys, hashlib, os, shutil
FE = '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive8b/copy/web/frontend/'
BAK = '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive8b/bak/'
os.makedirs(BAK, exist_ok=True)
IDX = 'src/assets/index.css'
LAM = 'src/pencil/sheet/AnswerKeyLaminate.vue'
FR = 'src/pencil/chrome/FocusRing.vue'
T2 = '\n.game-cell:has(input:focus-visible) .cell-ghost { opacity: 0.2 !important; }'
def media(mq): return f'\n@media {mq} {{\n  .focus-ring {{ opacity: 0.15 !important; }}\n  .game-cell:has(input:focus-visible) .cell-ghost {{ opacity: 0.2 !important; }}\n}}\n'
P = {
  # (file, anchor, replacement) ; anchor None = append
  'NOPREF2': (IDX, None, media('(prefers-reduced-motion: no-preference)')),
  'COARSE2': (IDX, None, media('(pointer: coarse)')),
  'MORE2': (IDX, None, media('(prefers-contrast: more)')),
  'DARKX4b': (IDX, None, '\n.dark .focus-ring { opacity: 0.15 !important; }\n'),
  'X4': (IDX, None, '\n.focus-ring { opacity: 0.15 !important; }\n'),
  'X4b': (IDX, None, T2 + '\n'),
  'FCCLIP2': (IDX, None, '\n@media (forced-colors: active) {\n  .game-card.is-center, .staging-btn { clip-path: inset(0) !important; }\n}\n'),
  'X5': (LAM, '<template>', '<template>\n<i style="animation-duration: var(--motion-note, 280ms)"></i>'),
  'X7': (LAM, '<template>', '<template>\n<i style="animation-duration: VAR(--motion-note, 280ms)"></i>'),
  'X8': (LAM, '<script setup lang="ts">', '<script setup lang="ts">\nconst rung8 = "note";\ndocument.body.style.setProperty("animation-duration", `var(--motion-${rung8}, 280ms)`);'),
  'X9': (LAM, '<script setup lang="ts">', '<script setup lang="ts">\nconst d9 = "var(--motion-note" + ", 280ms)";\ndocument.body.style.setProperty("animation-duration", d9);'),
  'R2': (FR, '    measure();\n    if (running(el).length) still = 0;', '    measure();\n    if (running(el).some((a) => a.playbackRate < 0)) return;\n    if (running(el).length) still = 0;'),
}
def sha(p): return hashlib.sha1(open(p, 'rb').read()).hexdigest()[:12]
name, act = sys.argv[1], sys.argv[2]
f, anchor, repl = P[name]
p = FE + f
b = BAK + name + '.' + os.path.basename(f)
if act == 'apply':
    before = sha(p)
    shutil.copyfile(p, b)
    s = open(p).read()
    if anchor is None:
        s = s + repl
    else:
        assert s.count(anchor) >= 1, f'anchor missing for {name}'
        s = s.replace(anchor, repl, 1)
    open(p, 'w').write(s)
    print(f'PLANT {name} applied to {f}: {before} -> {sha(p)}')
else:
    shutil.copyfile(b, p)
    print(f'PLANT {name} restored {f}: {sha(p)}')
