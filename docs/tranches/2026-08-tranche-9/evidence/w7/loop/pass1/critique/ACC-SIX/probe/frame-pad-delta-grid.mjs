const bbox = (d) => {
  const nums = d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  const xs = [], ys = [];
  for (let i = 0; i + 1 < nums.length; i += 2) { xs.push(nums[i]); ys.push(nums[i+1]); }
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
};
for (const n of ["HEAD", "PROTO"]) {
  const m = await import(`${process.env.SP}/gp-${n}.mjs`);
  const g = m.generateGridBoilFrames(9, 3, 1000, 42, 4);
  const b = bbox(g.frame[0]);
  console.log(n, "GRID FRAME pose0  y0", b.y0.toFixed(3), "y1", b.y1.toFixed(3), "x0", b.x0.toFixed(3), "x1", b.x1.toFixed(3));
}
