#!/usr/bin/env python3
"""plant.py <file> <name> apply|restore — named source plants, sha1-verified restore."""
import sys, hashlib, os, shutil
W='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend/'
BK='/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr-place-p6-work/bak/'
PM='src/pencil/chrome/PlayerMark/PlayerMark.vue'
PLANTS={
 'GHOST': (PM, "for (const id of new Set([...Object.keys(settled.value), ...Object.keys(timers)])) {", "for (const id of Object.keys(settled.value)) {"),
 'E4': (PM, '    :chart="chart"\n    @click="close"\n', '    :chart="chart"\n'),
 'SEAM_A': (PM, 'const TAP_IS_A_LOOK = true;', 'const TAP_IS_A_LOOK = false;'),
 'YIELD': (PM, 'const CHART_YIELDS = false;', 'const CHART_YIELDS = true;'),
 'NO_ARM': ('src/App.vue', 'const PLACE_CHART = true;', 'const PLACE_CHART = false;'),
}
name, act = sys.argv[1], sys.argv[2]
f, old, new = PLANTS[name]
os.makedirs(BK, exist_ok=True)
p=W+f; b=BK+name+'.orig'
sha=lambda x: hashlib.sha1(open(x,'rb').read()).hexdigest()
if act=='apply':
    s=open(p).read(); assert s.count(old)==1, (name,'anchor',s.count(old))
    shutil.copy(p,b); open(p,'w').write(s.replace(old,new)); print('planted',name,sha(b)[:10],'->',sha(p)[:10])
else:
    shutil.copy(b,p); print('restored',name,sha(p)[:10], 'OK' if sha(p)==sha(b) else 'MISMATCH')
