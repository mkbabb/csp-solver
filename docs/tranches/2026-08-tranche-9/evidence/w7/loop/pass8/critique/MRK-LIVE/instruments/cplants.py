# Critic file plants on the critic's SCRATCH COPY (never the work tree). usage: cplants.py apply|restore
import sys, hashlib, os, shutil
S = '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critlive8/'
FE = S + 'copy/web/frontend/'
BAK = S + 'bak/'
IDX = 'src/assets/index.css'
LAM = 'src/pencil/sheet/AnswerKeyLaminate.vue'
CSS = '''
/* CRITIC PLANTS (pass-8 critique, MRK-LIVE) */
/* MORE2S / COARSE2S: the ring faint under the regime on ONE shipped stop that is not the walk's first clean key */
@media (prefers-contrast: more) { html:has(button.logo-trigger:focus-visible) .focus-ring { opacity: 0.15 !important; } }
@media (pointer: coarse) { html:has(button.logo-trigger:focus-visible) .focus-ring { opacity: 0.15 !important; } }
/* FCSIDE: forced colours, three of four outline sides clipped away (the X6 sibling of FCCLIP2) */
@media (forced-colors: active) { .game-card, .staging-btn { clip-path: inset(-12px 0 0 0) !important; } }
'''
X12 = "\nfunction critX12() {\n  const N = '--motion-note';\n  document.body.style.setProperty('animation-duration', `var(${N}, 280ms)`);\n}\nvoid critX12;\n"
def sha(p): return hashlib.sha1(open(p,'rb').read()).hexdigest()[:12]
act = sys.argv[1]
for f in (IDX, LAM):
    p = FE + f; b = BAK + os.path.basename(f)
    if act == 'apply':
        before = sha(p); shutil.copyfile(p, b); s = open(p).read()
        if f == IDX: s = s + CSS
        else:
            a = '<script setup lang="ts">'
            assert s.count(a) == 1
            s = s.replace(a, a + X12, 1)
        open(p, 'w').write(s)
        print(f'APPLY {f}: {before} -> {sha(p)}')
    else:
        shutil.copyfile(b, p); print(f'RESTORE {f}: {sha(p)}')
