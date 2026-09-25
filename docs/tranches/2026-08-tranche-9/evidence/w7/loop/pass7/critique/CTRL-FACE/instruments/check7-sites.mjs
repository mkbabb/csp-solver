const SC = await import("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/prototype/CTRL-FACE/instruments/shape-census.mjs");
const fe = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend";
const s = SC.census(fe, "*", "font-family");
console.log("sites", s.length);
const byKind = {}; for (const x of s) byKind[x.kind] = (byKind[x.kind]||0)+1; console.log(byKind);
for (const x of s) if (/Handwritten|Attribution/.test(x.file)) console.log(x.file, x.line, x.kind, x.prop, x.value);
console.log(Object.keys(SC));
