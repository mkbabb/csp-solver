import { chromium, webkit, mintFromControl, assertSameBoard, settled } from "./p5-lib.mjs";
const [PROTO, CTRL] = process.argv.slice(2);
const board = await mintFromControl(CTRL);
console.log(`payload ${board.payload.slice(0, 16)}… (${board.givens} givens)`);
const READ = () => {
  const t = document.querySelector(".progress-trace");
  if (!t) return { traces: 0 };
  const cs = getComputedStyle(t);
  const g = t.closest("g");
  let op = 1, n = t;
  while (n && n !== document.documentElement) { op *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
  return { traces: document.querySelectorAll(".progress-trace").length, stroke: cs.stroke, opacity: cs.opacity, effectiveOpacity: +op.toFixed(3), visibility: cs.visibility, won: !!document.querySelector(".solve-success") };
};
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch();
  for (const [arm, base] of [["proto", PROTO], ["control", CTRL]]) {
    const ctx = await b.newContext({ colorScheme: "light", reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage();
    await p.emulateMedia({ contrast: "more" });
    await p.goto(base + board.query);
    await p.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await p.waitForTimeout(1200);
    await assertSameBoard(p, board.cells);
    const more = await p.evaluate(() => matchMedia("(prefers-contrast: more)").matches);
    for (let i = 0; i < 3; i++) { await p.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click()); await p.waitForTimeout(150); }
    const before = (await settled(p, READ)).value;
    await p.evaluate(() => document.querySelector('[aria-label="Solve puzzle"]')?.click());
    await p.waitForSelector(".solve-success", { timeout: 20000 });
    const after = (await settled(p, READ)).value;
    console.log(`${name}/${arm} contrast:more=${more} BEFORE ${JSON.stringify(before)} || AT WIN ${JSON.stringify(after)}`);
    await ctx.close();
  }
  await b.close();
}
