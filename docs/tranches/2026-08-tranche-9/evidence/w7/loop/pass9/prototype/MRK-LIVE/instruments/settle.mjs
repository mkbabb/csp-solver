// Why docSettled never holds on a dist: load the 9x9 board under reduce, light theme, blur, then
// sample the predicate's four parts every 500 ms for 16 s and print each part that fails.
import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/paint-lib.mjs";
import os from "node:os";
const [base, label] = process.argv.slice(2);
function mint(sub) {
  const n = sub * sub; let cells = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const i = r * n + c; const v = ((r * sub + Math.floor(r / sub) + c) % n) + 1; const keep = i > 1 && (r * 7 + c * 3) % 5 < 2; cells += (keep ? v : 0).toString(36); }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}
console.log(`${label} LOAD start ${os.loadavg().map((x) => x.toFixed(1)).join(" ")}`);
for (const engine of (process.env.ENGINES ?? "chromium,webkit").split(",")) {
  const browser = await playwright()[engine].launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: "reduce", colorScheme: "light" });
  const page = await ctx.newPage();
  await page.goto(`${base}/?size=3&board=${mint(3)}`);
  await page.waitForFunction(() => document.querySelectorAll(".board-shell .game-cell").length === 81, null, { timeout: 120000 });
  await page.evaluate(() => document.activeElement?.blur());
  const seen = new Map();
  for (let t = 0; t < 32; t++) {
    const s = await page.evaluate(() => {
      const run = document.getAnimations().filter((a) => a.playState === "running" && Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity));
      return {
        running: run.map((a) => `${a.constructor.name}:${a.animationName ?? a.transitionProperty ?? a.id ?? "?"}@${a.effect?.target?.tagName?.toLowerCase()}.${String(a.effect?.target?.className?.baseVal ?? a.effect?.target?.className ?? "").split(" ").slice(0, 2).join(".")} end=${Math.round(a.effect?.getComputedTiming().endTime)} t=${Math.round(a.currentTime)}`),
        markPose: [...document.querySelectorAll("[data-mark-pose]")].filter((g) => g.dataset.markPose !== "0").map((g) => `${g.tagName.toLowerCase()}.${String(g.className?.baseVal ?? g.className).split(" ")[0]}=${g.dataset.markPose}`),
        ringZero: [...document.querySelectorAll(".focus-ring")].filter((r) => r.querySelector("path")?.style.opacity === "0").length,
        rings: document.querySelectorAll(".focus-ring").length,
        bitmaps: [...document.querySelectorAll(".board-shell .hand-drawn-grid")].map((g) => g.querySelectorAll("image.boil-frame-bitmap").length),
      };
    });
    const key = JSON.stringify(s);
    if (!seen.has(key)) { seen.set(key, t); console.log(`${label} ${engine} t=${(t * 0.5).toFixed(1)}s ${key.slice(0, 900)}`); }
    await page.waitForTimeout(500);
  }
  await browser.close();
}
console.log(`${label} LOAD end ${os.loadavg().map((x) => x.toFixed(1)).join(" ")}`);
