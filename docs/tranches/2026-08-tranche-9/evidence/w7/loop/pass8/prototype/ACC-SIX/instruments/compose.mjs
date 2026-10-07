// ACC-SIX pass 8 · T9-B-ACC6-1's composite: the four DPR-2 crops (arm x theme, one engine) laid 2x2 on a canvas in a
// page of the engine's own browser, a 4 px white gutter; rows = arm (gold top, violet bottom), columns = theme
// (light left, dark right). No decoder dependency: the browser composes and encodes.
//   node .acc6p8/compose.mjs --crops <dir> --engine chromium --out <png> [--keep <device px of each crop top>] [--wide <device px of each crop left>]
import { readFileSync, writeFileSync } from "node:fs";
import { args, playwright } from "../e2e/lib/paint-lib.mjs";

const A = args();
const engine = A.engine ?? "chromium";
const cells = ["gold-light", "gold-dark", "violet-light", "violet-dark"].map(
  (k) => "data:image/png;base64," + readFileSync(`${A.crops}/${k.split("-")[0]}-${engine}-${k.split("-")[1]}.png`).toString("base64"),
);
const browser = await playwright().chromium.launch();
const page = await browser.newPage();
const png = await page.evaluate(async ([srcs, keep, wide]) => {
  const imgs = await Promise.all(
    srcs.map((s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = s; })),
  );
  const w = Math.min(imgs[0].width, wide || 1e9), h = Math.min(imgs[0].height, keep || 1e9), g = 4;
  const c = document.createElement("canvas");
  c.width = 2 * w + g;
  c.height = 2 * h + g;
  const x = c.getContext("2d");
  x.fillStyle = "#fff";
  x.fillRect(0, 0, c.width, c.height);
  imgs.forEach((im, k) => x.drawImage(im, 0, 0, w, h, (k % 2) * (w + g), Math.floor(k / 2) * (h + g), w, h));
  return c.toDataURL("image/png");
}, [cells, Number(A.keep ?? 0), Number(A.wide ?? 0)]);
writeFileSync(A.out, Buffer.from(png.split(",")[1], "base64"));
console.log(`COMPOSE ${A.out} ${readFileSync(A.out).length} B`);
await browser.close();
