import { createRequire } from "node:module";
const require = createRequire(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json",
);
const { chromium } = require("playwright");

const b = await chromium.launch();
const p = await b.newPage();
await p.goto("http://127.0.0.1:4241/?size=3&difficulty=EASY&wire=local");
await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
const out = await p.evaluate(async () => {
  const m = await import("/src/pencil/grid/gridPaths.ts");
  const pts = (d) => [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((n) => parseFloat(n[0]));
  const spread = (amount) => {
    const fr = m.generateRectBoilFrames(
      2,
      5.5,
      20,
      13,
      { roughness: 0.4, segments: 4, seed: 67, jagged: true },
      amount,
      2,
    );
    const a = pts(fr[0]);
    const c = pts(fr[1]);
    let max = 0;
    let sum = 0;
    for (let i = 0; i < Math.min(a.length, c.length); i++) {
      const d = Math.abs(a[i] - c[i]);
      if (d > max) max = d;
      sum += d;
    }
    // The stub renders 24 viewBox units into a 20px box: CSS px = units * 20/24.
    const k = 20 / 24;
    return {
      amount,
      maxUnits: +max.toFixed(4),
      maxCssPx: +(max * k).toFixed(4),
      meanCssPx: +((sum / a.length) * k).toFixed(4),
    };
  };
  return [0, 0.4, 0.8, 1.2, 1.6, 2, 2.5, 3, 4].map(spread);
});
console.log(JSON.stringify(out));
await b.close();
