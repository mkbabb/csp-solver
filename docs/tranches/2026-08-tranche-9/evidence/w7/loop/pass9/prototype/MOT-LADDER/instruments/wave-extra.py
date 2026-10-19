"""On-WAVE only: the two union sites the PROPOSED clock-context reads (dormant until the chair folds it)."""
import sys
p=sys.argv[1]; s=open(p).read()
old='''const ADMITTED_ARITH = [
'''
new='''const ADMITTED_ARITH = [
  {
    file: "src/pencil/chrome/MarginNote.vue",
    expr: "reduced ? 0 : MOTION.rungs.note",
    ms: null,
    ctx: true,
    why: "PRM IS A VALUE OF THE NOTE'S CLOCK — 0 under reduce, else the note rung (pass 9, charter row 5: a ternary read is the consumer's value; the union's line)",
  },
  {
    file: "src/pencil/grid/gridPaths.ts",
    expr: "slot = now >= slot + FRONT_MIN_MS ? now + FRONT_MIN_MS : slot + FRONT_MIN_MS",
    ms: null,
    ctx: true,
    why: "THE FRONT'S SLOT — the next commit is one floor after now or after the last slot, whichever is later (ACC-FIVE's cap; pass 9, charter row 5; the union's line)",
  },
'''
assert s.count(old)==1; s=s.replace(old,new,1); open(p,'w').write(s); print("wave-extra ok")
