#!/usr/bin/env python3
"""plant.py <name> apply|restore — PLR-PLACE pass-7 named source plants, sha1-verified restore."""
import sys, hashlib, os, shutil
W='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend/'
BK='/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work/bak/'
PM='src/pencil/chrome/PlayerMark/PlayerMark.vue'
PLANTS={
 'GHOST': (PM, "for (const id of new Set([...Object.keys(settled.value), ...Object.keys(timers)])) {", "for (const id of Object.keys(settled.value)) {"),
 'E4': (PM, '    @click="close"\n    @touchend.prevent\n', '    @touchend.prevent\n'),
 'TOUCHEND': (PM, '    @touchend.prevent\n', ''),
 'SEAM_A': (PM, 'const TAP_IS_A_LOOK = true;', 'const TAP_IS_A_LOOK = false;'),
 'YIELD': (PM, 'const CHART_YIELDS = false;', 'const CHART_YIELDS = true;'),
 'NO_ARM': ('src/App.vue', 'const PLACE_CHART = true;', 'const PLACE_CHART = false;'),
 'REFIT': (PM, '  window.addEventListener("resize", refit);\n', '', '  document.addEventListener("transitionend", onSettle);\n', ''),
 'REFIT_RESIZE_ONLY': (PM, '  window.addEventListener("resize", refit);\n', ''),
 'REACH': (PM, '  if (TAP_IS_A_LOOK && e.pointerType === "touch") close();\n}',
   '  if (TAP_IS_A_LOOK && e.pointerType === "touch") close();\n  const s = document.getElementById(lobbyId);\n  if (s) { s.style.pointerEvents = "none"; const hit = document.elementFromPoint(e.clientX, e.clientY); s.style.pointerEvents = ""; (hit?.closest(".sudoku-cell")?.querySelector("input") as HTMLElement | null)?.focus(); }\n}'),
 # the yield keyed on pass 6's one-axis proxy (board under the rows) and the chart kept wherever that proxy is false
 'YIELD_P6': (PM, 'const CHART_YIELDS = false;', 'const CHART_YIELDS = true;', 'yielded.value = covered(dressed.box, board) > covered(pose, board);', 'yielded.value = board.left <= dressed.rowsStart && laps(dressed.box, board);'),
}
name, act = sys.argv[1], sys.argv[2]
spec = PLANTS[name]; f = spec[0]; pairs = list(zip(spec[1::2], spec[2::2]))
os.makedirs(BK, exist_ok=True)
p=W+f; b=BK+name+'.orig'
sha=lambda x: hashlib.sha1(open(x,'rb').read()).hexdigest()
if act=='apply':
    s=open(p).read()
    for old,new in pairs:
        assert s.count(old)==1, (name,'anchor',s.count(old)); s=s.replace(old,new)
    shutil.copy(p,b); open(p,'w').write(s); print('planted',name,sha(b)[:12],'->',sha(p)[:12])
else:
    shutil.copy(b,p); print('restored',name,sha(p)[:12], 'OK' if sha(p)==sha(b) else 'MISMATCH')
