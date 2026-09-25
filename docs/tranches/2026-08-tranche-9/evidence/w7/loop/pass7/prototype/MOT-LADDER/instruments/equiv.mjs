// the library copy vs the chair's original: every export over the tree's own sources
import { readFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
const [orig, copy, fe] = process.argv.slice(2);
const A = await import(orig), B = await import(copy);
const files = A.sources(fe, { tests: true });
let n = 0, diff = 0, atOnly = 0;
const cmp = (label, a, b) => { n++; if (!isDeepStrictEqual(a, b)) { diff++; if (diff < 6) console.log("DIFF", label); } };
cmp("exports", Object.keys(A).sort(), Object.keys(B).sort());
cmp("sources", files, B.sources(fe, { tests: true }));
for (const f of files) {
  const t = readFileSync(f, "utf8");
  cmp("stripCss " + f, A.stripCss(t), B.stripCss(t));
  cmp("stripJs " + f, A.stripJs(t), B.stripJs(t));
  cmp("stripHtml " + f, A.stripHtml(t), B.stripHtml(t));
  if (f.endsWith(".vue")) cmp("sfc " + f, A.sfc(t), B.sfc(t));
  const blocks = f.endsWith(".vue") ? A.sfc(t).styles.map((s) => s.css) : f.endsWith(".css") ? [t] : [];
  for (const css of blocks) {
    const ra = A.cssRules(css), rb = B.cssRules(css);
    const rbNoAt = rb.filter((r) => !r.prelude.startsWith("@"));
    if (rb.length !== rbNoAt.length) atOnly += rb.length - rbNoAt.length;
    cmp("cssRules " + f, ra, rbNoAt);
  }
  for (const p of ["min-height", "transition-timing-function", "color"]) cmp(`scriptWrites ${p} ${f}`, A.scriptWrites(t, p), B.scriptWrites(t, p));
}
for (const [cls, prop] of [["margin-note", "min-height"], ["drawer-case", "color"], ["game-cell", "transition"]]) {
  const a = A.census(fe, cls, prop), b = B.census(fe, cls, prop);
  cmp(`census ${cls}`, a, b.filter((s) => !String(s.prelude).startsWith("@")));
}
const ta = A.tokens(fe), tb = B.tokens(fe);
const tbNoAt = tb.all.filter((d) => !d.prelude.startsWith("@"));
cmp("tokens.all (at-rule rows aside)", ta.all, tbNoAt);
for (const c of ["#fff", "#11223344", "rgb(10 20 30 / 50%)", "hsl(0.5turn 50% 50%)", "hwb(120 10% 20%)", "lab(50% 20 30)", "lch(50% 30 120)", "oklab(0.5 0.1 0.1)", "oklch(0.6 0.1 200)", "color(srgb 0.1 0.2 0.3)", "rebeccapurple", "color-mix(in srgb, red 30%, blue)", "transparent"])
  cmp("parseColor " + c, A.parseColor(c), B.parseColor(c));
cmp("deltaE", A.deltaE(A.parseColor("#a27803"), A.parseColor("#7e6a17")), B.deltaE(B.parseColor("#a27803"), B.parseColor("#7e6a17")));
for (const s of [".a .b:not(.c)", ":deep(.x) .y:is(.p, .q)", ".m::before", "html.dark .n > .o"]) { cmp("subject " + s, A.subjectCompound(s), B.subjectCompound(s)); cmp("classes " + s, [...A.compoundClasses(A.subjectCompound(s)).pos], [...B.compoundClasses(B.subjectCompound(s)).pos]); }
const map = new Map([["--a", "var(--b, 3px)"], ["--c", "1px"]]);
for (const v of ["var(--a)", "var(--nope, var(--c))", "var(--stem-${x})"]) cmp("resolve " + v, A.resolve(v, map), B.resolve(v, map));
console.log(`comparisons ${n}, differences ${diff}, at-rule rules the copy adds ${atOnly}, tokens the copy adds ${tb.all.length - ta.all.length}`);
process.exit(diff ? 1 : 0);
