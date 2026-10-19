# unit-plants.py : one-edit plants on the hand (bootHand.ts / pencilConfig.ts), each run through
# bootHand.test.ts; the tree's files are restored byte-for-byte after every plant. Exits to a TSV.
import subprocess, sys, shutil, hashlib
W='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend'
S='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB'
BH=W+'/src/pencil/composables/bootHand.ts'; PC=W+'/src/pencil/config/pencilConfig.ts'
FLOOR='const floored = Math.max(shortest * MOTION.hand.paceSlack, MOTION.hand.stepMs);'
CAP='return Math.min(floored, MOTION.hand.maxStepMs);'
PLANTS=[
 ('clean', None, None, None),
 ('nofloor', BH, FLOOR, 'const floored = shortest * MOTION.hand.paceSlack;'),
 ('nocap', BH, CAP, 'return floored;'),
 ('noslack', BH, FLOOR, 'const floored = Math.max(shortest, MOTION.hand.stepMs);'),
 ('median', BH, 'const shortest = Math.min(...intervals);', 'const shortest = [...intervals].sort((a, b) => a - b)[intervals.length >> 1];'),
 ('slack1.49', PC, '    paceSlack: 1.5,\n', '    paceSlack: 1.49,\n'),
 ('slack1.51', PC, '    paceSlack: 1.5,\n', '    paceSlack: 1.51,\n'),
 ('wall', BH, 'clock += Math.min(dt, pace(dt));', 'clock += dt;'),
 ('cap34', PC, '    maxStepMs: 42,\n', '    maxStepMs: 34,\n'),
 ('cap38', PC, '    maxStepMs: 42,\n', '    maxStepMs: 38,\n'),
 ('cap37.9', PC, '    maxStepMs: 42,\n', '    maxStepMs: 37.9,\n'),
 ('window1', PC, '    paceWindow: 5,\n', '    paceWindow: 1,\n'),
]
orig={p:open(p).read() for p in (BH,PC)}
out=open(S+'/logs/unit-plants.tsv','w'); out.write('plant\texit\tfailed rows\n')
for name,f,a,b in PLANTS:
    try:
        if f:
            t=orig[f]; assert t.count(a)==1,(name,a); open(f,'w').write(t.replace(a,b))
        log=S+f'/logs/unit-plant-{name}.log'
        with open(log,'w') as L:
            rc=subprocess.call(['npx','vitest','run','src/pencil/composables/bootHand.test.ts'],cwd=W,stdout=L,stderr=subprocess.STDOUT,timeout=110)
        fails=[l.strip()[2:].split(' (')[0] for l in open(log) if l.strip().startswith('×')]
        out.write(f'{name}\t{rc}\t{len(fails)}: {" | ".join(fails)}\n'); out.flush()
    finally:
        for p,t in orig.items(): open(p,'w').write(t)
for p,t in orig.items(): assert open(p).read()==t
out.write('RESTORED\n'); out.close()
