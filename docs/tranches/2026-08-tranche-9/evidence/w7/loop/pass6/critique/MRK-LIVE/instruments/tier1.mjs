import { chromium } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const sub = 3, n = 9; let cells = "";
for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const i = r*n+c; const v = ((r*sub+Math.floor(r/sub)+c)%n)+1; cells += ((i>1&&(r*7+c*3)%5<2)?v:0).toString(36); }
const payload = Buffer.from(String.fromCharCode(1)+`${sub}.${cells}`,"latin1").toString("base64url");
const b = await chromium.launch();
for (const url of process.argv.slice(2)) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  await p.goto(`${url}/?size=3&board=${payload}`);
  for (let t = 0; t < 120; t++) { if ((await p.evaluate(() => document.querySelectorAll(".board-shell .game-cell").length)) === 81) break; await p.waitForTimeout(500); }
  await p.waitForTimeout(1200);
  const bx = await p.locator(".board-shell .game-cell").nth(40).boundingBox();
  await p.mouse.move(bx.x + bx.width/2, bx.y + bx.height/2); await p.waitForTimeout(600);
  const hov = await p.evaluate(() => { const g = document.querySelectorAll(".board-shell .game-cell")[40].querySelector(".cell-ghost-path"); const s = getComputedStyle(g); const w = getComputedStyle(g.closest(".cell-ghost")); return [s.stroke, s.strokeWidth, s.strokeOpacity, s.fill, s.fillOpacity, w.opacity, g.getAttribute("d").length].join(" | "); });
  await p.mouse.move(5,5); await p.evaluate(() => document.querySelectorAll(".board-shell .game-cell")[40].classList.add("is-invalid")); await p.waitForTimeout(600);
  const inv = await p.evaluate(() => { const g = document.querySelectorAll(".board-shell .game-cell")[40].querySelector(".cell-ghost-path"); const s = getComputedStyle(g); return [s.stroke, s.strokeWidth, s.strokeOpacity, s.fill, s.fillOpacity].join(" | "); });
  console.log(url, "tier1 hover:", hov, "· invalid:", inv);
  await p.close();
}
await b.close();
