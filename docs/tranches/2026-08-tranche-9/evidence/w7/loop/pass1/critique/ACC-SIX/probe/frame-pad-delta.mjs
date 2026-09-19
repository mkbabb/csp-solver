const bbox = (d) => {
  const nums = d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  const xs = [], ys = [];
  for (let i = 0; i + 1 < nums.length; i += 2) { xs.push(nums[i]); ys.push(nums[i+1]); }
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
};
for (const n of ["HEAD", "PROTO"]) {
  const m = await import(`${process.env.SP}/gp-${n}.mjs`);
  const f = m.generateFrameTraceFrames(1000, 4, 12345, 0.5);
  const b = bbox(f[0]);
  const g = m.generateGridBoilFrames(1000, 9, 3, 4, 0.5, 12345);
  const gb = bbox((g.frame || g)[0] ?? "");
  console.log(n, "TRACE  y0=%s y1=%s x0=%s x1=%s", b.y0.toFixed(3), b.y1.toFixed(3), b.x0.toFixed(3), b.x1.toFixed(3));
  console.log(n, "GRIDFR y0=%s y1=%s x0=%s x1=%s", gb.y0.toFixed(3), gb.y1.toFixed(3), gb.x0.toFixed(3), gb.x1.toFixed(3));
}
