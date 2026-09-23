import os
D=os.environ['D']; E=os.environ['E']
s=open(D+'/r0/r6-idiom-history/law-probe.mjs').read()
o='const FE = path.join(import.meta.dirname, "../../../../../../../../web/frontend");'
assert s.count(o)==1
s=s.replace(o,'// pass-5 copy (MRK-ABS): FE=<tree>/web/frontend is REQUIRED; R1 re-cut below, every other row verbatim\n// from the chair\'s current r0 probe (L1 a ceiling, R3 re-cut).\nconst FE = process.env.FE;')
a=s.index('law(\n  "R1",'); b=s.index('law(\n  "R2",')
row = r'''law(
  "R1",
  // MOVED, pass 5 (pass4 CHAIR-RULINGS §1.3 booked the one-value token; this re-cut answers the
  // pass-4 critic: the pass-4 wording was a VOCABULARY check that read GREEN with all 33 figures
  // falsified to 9.99). Two halves. THIS row (browserless): one declaration, no theme arm, and
  // every figure the declaration's comment carries is a LEDGER row or the named opacity — an
  // unguarded figure reds here. The TRUTH half is G-ABS-5 in e2e/focus-ring.spec.ts, which holds
  // every ledger row to the painted reading and reds on the 9.99 ledger (its in-run control and
  // the break test on the tree). A browserless row cannot see paint and does not pretend to.
  "`--color-focus-sketch` is declared once with no theme arm, and every figure its comment carries is a ledger row G-ABS-5 holds to the painted reading",
  "index.css --color-focus-sketch; e2e/focus-ring.spec.ts G-ABS-5 (pass5 MRK-ABS)",
  "RED",
  () => {
    const css = read("src/assets/index.css");
    const decls = [...css.matchAll(/--color-focus-sketch:/g)].map((m) => m.index);
    const darkAt = css.indexOf("\n.dark");
    const inDark = decls.some((i) => i > darkAt);
    const at = decls[0] ?? -1;
    const comment = at < 0 ? "" : css.slice(at, css.indexOf("*/", at));
    const op = comment.match(/WORST of (\d+) samples, tier 2 at stroke-opacity (\d+(?:\.\d+)?)/);
    const guarded = op ? [op[2]] : [];
    let rows = 0;
    for (const m of comment.matchAll(/(16×16|9×9) (paper|frame)\s+light (\d+\.\d+) \/ (\d+\.\d+)\s+dark (\d+\.\d+) \/ (\d+\.\d+)/g)) {
      rows++;
      guarded.push(m[3], m[4], m[5], m[6]);
    }
    const figures = [...comment.matchAll(/(?<!\d\.)(?<!\d)\d+\.\d{2,}(?!\d|\.\d)/g)].map((m) => m[0]);
    for (const g of guarded) { const k = figures.indexOf(g); if (k >= 0) figures.splice(k, 1); }
    let spec = "";
    try { spec = read("e2e/focus-ring.spec.ts"); } catch { /* absent */ }
    const truthHalf = /G-ABS-5/.test(spec) && /paintClause/.test(spec) && /--color-focus-sketch:/.test(spec);
    const ok = decls.length === 1 && !inDark && !!op && rows >= 3 && figures.length === 0 && truthHalf;
    return {
      ok,
      detail: `declarations ${decls.length}, in .dark ${inDark}; ledger opacity ${op ? op[2] : "none"}, rows ${rows}; unguarded figures [${figures.join(", ")}]; G-ABS-5 present ${truthHalf}`,
    };
  },
);

'''
s=s[:a]+row+s[b:]
open(E+'/probe/law-probe.R1-moved.mjs','w').write(s)
