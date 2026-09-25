const SC = await import("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/prototype/CTRL-FACE/instruments/shape-census.mjs");
import { readFileSync } from "node:fs";
const f = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend/src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue";
const r = SC.sfc(readFileSync(f,"utf8"));
console.log(JSON.stringify(r, (k,v)=> typeof v==="string" && v.length>200 ? v.slice(0,200)+"…("+v.length+")" : v, 1).slice(0,2500));
