// Composite the raw panels into ≤4 crops, 4× nearest, one variable per row pair.
import sharp from "sharp";
const RAW = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/raw";
const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MRK-ABS/frames";
async function grid(rows, scale, out) {
  const tiles = []; let W = 0, H = 0, y = 0; const GAP = 6;
  for (const row of rows) { let x = 0, h = 0;
    for (const f of row) { const m = await sharp(f).metadata(); const w = m.width * scale, hh = m.height * scale;
      tiles.push({ input: await sharp(f).resize(w, hh, { kernel: "nearest" }).png().toBuffer(), left: x, top: y }); x += w + GAP; h = Math.max(h, hh); }
    W = Math.max(W, x - GAP); y += h + GAP; }
  H = y - GAP;
  await sharp({ create: { width: W, height: H, channels: 3, background: { r: 255, g: 0, b: 255 } } }).composite(tiles).png({ palette: true, quality: 90, effort: 10 }).toFile(out);
}
const e = process.argv[2] ?? "chromium";
await grid([["A", "B", "C"].map((a) => `${RAW}/board-${a}-light-${e}.png`), ["A", "B", "C"].map((a) => `${RAW}/board-${a}-dark-${e}.png`)], 3,
  `${OUT}/p5-1-ballot-three-arms-cell0-16x16-light-dark-${e}-fine.png`);
await grid([["A", "D"].map((a) => `${RAW}/board-${a}-light-${e}.png`), ["A", "D"].map((a) => `${RAW}/board-${a}-dark-${e}.png`)], 3,
  `${OUT}/p5-2-inset-086-vs-090-cell0-16x16-light-dark-${e}-fine.png`);
await grid([["A", "HEAD"].map((a) => `${RAW}/forced-deck-${a}-light-${e}.png`)], 1,
  `${OUT}/p5-3-forced-colours-deck-card-lane-vs-control-${e}-fine.png`);
console.log("crops done");
if (process.argv[3] === "p5-4") await grid([["A", "HEAD"].map((a) => `${RAW}/deck-${a}-light-webkit.png`), ["A", "HEAD"].map((a) => `${RAW}/guard-${a}-light-webkit.png`)], 3,
  `${OUT}/p5-4-deck-centre-and-armed-guard-lane-vs-control-light-webkit-fine.png`);
