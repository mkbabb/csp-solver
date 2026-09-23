import sys, hashlib, os
FE='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/'
BAK='/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive-p6/bak/'
os.makedirs(BAK, exist_ok=True)
P = {
 'X1-ring-ink-deleted': ('src/assets/index.css', '''  --ring-ink: var(
    --color-focus-sketch
  );''', '''  /* X1 plant: --ring-ink deleted */'''),
 'X2-ghost-opacity-0': ('src/games/shared/gameCell.css', '''.cell-ghost.is-active {
  opacity: 1;
}''', '''.cell-ghost.is-active {
  opacity: 0;
}'''),
 'X3-laminate-masked': ('src/pencil/sheet/AnswerKeyLaminate.vue', '''<style scoped>
.answer-key-laminate {''', '''<style scoped>
.x3-plant {
  animation-duration: var(--motion-note, 280ms);
}
.answer-key-laminate {'''),
 'R-reversal-only': ('src/pencil/chrome/FocusRing.vue', None, None),
 'G22-inset-100': ('src/pencil/config/pencilConfig.ts', '''  inset: 0.86,
});''', '''  inset: 1,
});'''),
 'R2-stop-on-reversed': ('src/pencil/chrome/FocusRing.vue', '''    measure();
    if (running(el).length) still = 0;''', '''    measure();
    if (running(el).some((a) => a.playbackRate < 0)) return;
    if (running(el).length) still = 0;'''),
 'G-guard-outline-none': ('src/pencil/chrome/GameGallery/GameGallery.vue', '''
.guard-btn {''', '''
.guard-btn:focus-visible {
  outline: none;
}
.guard-btn {'''),
}
def sha(p): return hashlib.sha1(open(p,'rb').read()).hexdigest()[:10]
name, act = sys.argv[1], sys.argv[2]
f, old, new = P[name]
p = FE + f
b = BAK + name + '.' + os.path.basename(f)
if act == 'apply':
    s = open(p).read(); open(b,'w').write(s)
    if name == 'R-reversal-only':
        o1 = '''  let still = 0;
  const step = () => {
    const el = target.value;
    if (!el || gen !== settleGen) return;
    measure();
    if (running(el).length) still = 0;
    else if (++still >= 3) return;'''
        n1 = '''  let still = 0;
  let first: Animation[] | null = null;
  rPlantLive = true;
  const step = () => {
    const el = target.value;
    if (!el || gen !== settleGen) return;
    measure();
    const now = running(el);
    if (!first && now.length) first = now;
    if (first && now.some((a) => !first!.includes(a))) return void (rPlantLive = false);
    if (now.length) still = 0;
    else if (++still >= 3) return void (rPlantLive = false);'''
        o2 = '''  if (el && e.target instanceof Node && el.contains(e.target)) settle();'''
        n2 = '''  if (rPlantLive) return;
  if (el && e.target instanceof Node && el.contains(e.target)) settle();'''
        o3 = '''let settleGen = 0;'''
        n3 = '''let settleGen = 0;
let rPlantLive = false;'''
        for o in (o1,o2,o3): assert s.count(o)==1, o[:40]
        s = s.replace(o1,n1).replace(o2,n2).replace(o3,n3)
    else:
        assert s.count(old)==1, name
        s = s.replace(old,new)
    open(p,'w').write(s)
    print('APPLIED', name, f, 'orig', sha(b), 'now', sha(p))
else:
    open(p,'w').write(open(b).read())
    print('RESTORED', name, f, sha(p), 'equal' if sha(p)==sha(b) else 'MISMATCH')
