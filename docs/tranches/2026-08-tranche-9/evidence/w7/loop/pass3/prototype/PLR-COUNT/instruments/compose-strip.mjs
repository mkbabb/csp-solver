/** Frame 1: the head strip at N=1/3/5/6 (heading rung) with the ablated rung beneath it. */
import { createRequire } from "node:module";
const sharp = createRequire(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json",
)("sharp");

const F =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/PLR-COUNT/frames";
const names = [
  "strip-N1.png",
  "strip-N3.png",
  "strip-N5.png",
  "strip-N6-heading.png",
  "strip-N6-subheading.png",
];
const imgs = [];
for (const n of names) {
  const b = sharp(`${F}/${n}`);
  const m = await b.metadata();
  imgs.push({ n, buf: await b.png().toBuffer(), w: m.width, h: m.height });
}
const GAP = 36;
const PAD = 24;
const rowW = imgs.slice(0, 4).reduce((a, i) => a + i.w, 0) + GAP * 3;
const W = Math.max(rowW, imgs[4].w) + PAD * 2;
const H = imgs[0].h + GAP + imgs[4].h + PAD * 2;
let x = PAD;
const comp = [];
for (const i of imgs.slice(0, 4)) {
  comp.push({ input: i.buf, left: Math.round(x), top: PAD });
  x += i.w + GAP;
}
comp.push({ input: imgs[4].buf, left: PAD, top: PAD + imgs[0].h + GAP });
await sharp({
  create: {
    width: Math.round(W),
    height: Math.round(H),
    channels: 3,
    background: { r: 251, g: 250, b: 249 },
  },
})
  .composite(comp)
  .png({ compressionLevel: 9 })
  .toFile(`${F}/frame1-strip-390-coarse.png`);
console.log("frame1", Math.round(W), Math.round(H));
