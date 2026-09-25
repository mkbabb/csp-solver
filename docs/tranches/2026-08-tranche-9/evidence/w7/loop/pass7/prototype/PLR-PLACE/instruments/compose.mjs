// compose the yield's frame: row 1 390×664 chart | yield ; row 2 390×860 yield | list (chromium, light, coarse, PRM, DPR 1)
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const sharp = require("sharp");
const [dir, eng, out] = process.argv.slice(2);
const P = (arm, c) => `${dir}/crop-${arm}-${c}-${eng}.png`;
const rows = [["chart", "390x664", "yield", "390x664"], ["yield", "390x860", "list", "390x860"]];
const gap = 8;
const metas = [];
for (const r of rows) for (let i = 0; i < 2; i++) metas.push(await sharp(P(r[2 * i], r[2 * i + 1])).metadata());
const rowH = [Math.max(metas[0].height, metas[1].height), Math.max(metas[2].height, metas[3].height)];
const W = 390 * 2 + gap, H = rowH[0] + rowH[1] + gap;
const comp = [];
let k = 0;
for (let ri = 0; ri < 2; ri++) for (let i = 0; i < 2; i++) comp.push({ input: P(rows[ri][2 * i], rows[ri][2 * i + 1]), left: i * (390 + gap), top: ri ? rowH[0] + gap : 0 }), k++;
await sharp({ create: { width: W, height: H, channels: 3, background: "#808080" } }).composite(comp).png().toFile(out);
console.log(out, W, H);
