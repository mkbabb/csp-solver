import * as S from "../../../../worktrees/wf_308fa864-c94-2/web/frontend/scripts/shape-census.mjs";
const BS = String.fromCharCode(92);
const C1 = '[function () {} / 2, "x/", "http://a.b", "#ffb2f3"]';
const C2 = 'if (e) /' + BS + '/' + BS + '//.test(t); return "#ffb2f3";';
const C3 = '"' + BS + 'u0023ffb2f3"';
const C4 = '"' + BS + 'u{23}ffb2f3"';
for (const [k, t] of Object.entries({ C1, C2 })) console.log(k, JSON.stringify(t), "=>", JSON.stringify(S.stripJs(t)));
for (const [k, t] of Object.entries({ C3, C4 })) console.log(k, JSON.stringify(t), "=>", JSON.stringify(S.foldText(t)));
for (const c of ["color(xyz-d65 0.7333 0.5957 0.9243)", "color(xyz 0.7 0.6 0.9)", "color(rec2020 1 0.7 0.95)"]) console.log(c, JSON.stringify(S.parseColor(c)));
