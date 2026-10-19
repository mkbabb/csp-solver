import * as L from "./hv2/shape-census.mjs";
const BS = String.fromCharCode(92);
const a = "if (e) /" + BS + "/" + BS + '//.test(t); el.style.minHeight = "0";\n';
console.log(JSON.stringify(L.stripJs(a)));
console.log(L.scriptWrites(a, "min-height").length);
const d = "const r = f(a) / 2; el.style.minHeight = c / 2; // tail\n";
console.log(JSON.stringify(L.stripJs(d)), L.scriptWrites(d, "min-height").length);
