// the uncut ring, both trees: every consumer that passes no cuts must draw HEAD's bytes
const a = await import(process.argv[2]); const b = await import(process.argv[3]);
let n = 0, same = 0;
for (const [w, h] of [[100, 40], [366, 366], [44, 92], [284, 600], [59.83, 44]]) for (const r of [0, 6, 12]) for (const seed of [1, 42, 99]) for (const fc of [2, 4]) {
  const o = { boilAmount: 1.2, seed };
  const A = a.generateRectBoilFrames(0, 0, w, h, o, 1.2, fc, r, undefined);
  const B = b.generateRectBoilFrames(0, 0, w, h, o, 1.2, fc, r, undefined);
  n++; if (JSON.stringify(A) === JSON.stringify(B)) same++;
}
console.log(`uncut rings byte-identical: ${same}/${n}`);
// negative control: a cut ring must differ
const o = { boilAmount: 1.2, seed: 42 };
const cut = a.generateRectBoilFrames(0, 0, 100, 40, o, 1.2, 4, 0, undefined, { omit: "bottom" });
const head = b.generateRectBoilFrames(0, 0, 100, 40, o, 1.2, 4, 0, undefined);
console.log(`control (omit bottom) differs from HEAD: ${JSON.stringify(cut) !== JSON.stringify(head)}`);
