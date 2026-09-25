import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const sharp = require("sharp");
const d = process.argv[2];
const px = async (f) => sharp(f).removeAlpha().raw().toBuffer({ resolveWithObject: true });
for (const eng of ["chromium", "webkit"]) for (const [a, b, c] of [["yield", "list", "390x664"], ["yield", "chart", "390x860"], ["yield", "chart", "390x664"], ["yield", "list", "390x860"]]) {
  const A = await px(`${d}/crop-${a}-${c}-${eng}.png`), B = await px(`${d}/crop-${b}-${c}-${eng}.png`);
  if (A.info.width !== B.info.width || A.info.height !== B.info.height) { console.log(eng, a, b, c, "SIZE DIFFERS", A.info.height, B.info.height); continue; }
  let n = 0; for (let i = 0; i < A.data.length; i += 3) if (Math.max(Math.abs(A.data[i] - B.data[i]), Math.abs(A.data[i + 1] - B.data[i + 1]), Math.abs(A.data[i + 2] - B.data[i + 2])) >= 6) n++;
  console.log(eng, `${a} vs ${b} @ ${c}`, `${n} px differ (Δ≥6) of ${A.info.width * A.info.height}`);
}
