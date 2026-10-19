# build-plants.py : the tree's final build (t2) + one-edit hand plants, each built to $S/dist-<name>;
# the tree's files are restored byte-for-byte after every build (asserted). Exits to a TSV.
import subprocess
W='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend'
S='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB'
BH=W+'/src/pencil/composables/bootHand.ts'; PC=W+'/src/pencil/config/pencilConfig.ts'
STEP='clock += Math.min(dt, pace(dt));'
P8BH=open(S+'/plants/bootHand.pass8.ts').read()
PLANTS=[
 ('t3', []),
 ('slack1', [(PC, '    paceSlack: 1.5,\n', '    paceSlack: 1,\n')]),
 ('wall', [(BH, STEP, 'clock += dt;')]),
 ('p7clock', [(BH, STEP, 'clock += Math.min(dt, MOTION.hand.stepMs);')]),
 ('cap3x', [(BH, STEP, 'clock += Math.min(dt, 3 * pace(dt));')]),
 ('cap1p5x', [(BH, STEP, 'clock += Math.min(dt, 1.5 * pace(dt));')]),
 ('pass8hand', [(BH, None, P8BH), (PC, '    maxStepMs: 42,\n', '    maxStepMs: 34,\n')]),
]
orig={p:open(p).read() for p in (BH,PC)}
out=open(S+'/logs/build-plants.tsv','w'); out.write('build\texit\tindex js\n')
for name,edits in PLANTS:
    try:
        for f,a,b in edits:
            if a is None: open(f,'w').write(b); continue
            t=orig[f]; assert t.count(a)==1,(name,a); open(f,'w').write(t.replace(a,b))
        rc=subprocess.call([S+'/bin/build.sh',name],timeout=300)
        log=open(S+f'/logs/build-{name}.log').read()
        import re,os
        js=[x for x in os.listdir(S+f'/dist-{name}/assets') if re.match(r'index-.*\.js$',x)] if os.path.isdir(S+f'/dist-{name}/assets') else []
        out.write(f'{name}\t{log.strip().splitlines()[-1]}\t{js}\n'); out.flush()
    finally:
        for p,t in orig.items(): open(p,'w').write(t)
for p,t in orig.items(): assert open(p).read()==t
out.write('RESTORED\n'); out.close()
