import fs from "node:fs";
import * as P from "./shape-census.mjs";
import * as H from "./hv2/shape-census.mjs";
const f = process.argv[2];
const t = fs.readFileSync(f, "utf8");
const BS = String.fromCharCode(92);
const C2 = "if(e)/" + BS + "/" + BS + "//.test(t);";
const mid = t.indexOf(";", t.length >> 1) + 1;
const planted = t.slice(0, mid) + C2 + t.slice(mid);
const ink = (x) => x.replace(/\s+/g, "").length;
const frac = (L, x) => (ink(x) - ink(L.stripJs(x))) / ink(x);
for (const [name, L] of [["homes v2", H], ["PROPOSED strip-paren-kw", P]])
  console.log(`${name}: clean ${(100 * frac(L, t)).toFixed(2)} % blanked · C2 at byte ${mid} ${(100 * frac(L, planted)).toFixed(2)} % blanked (${f.split("/").pop()}, ${t.length} B)`);
