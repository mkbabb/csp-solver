// critic: π of the RING GEOMETRY on the rings the graft moves but the README never priced: tier 1 (hover
// sketch, fine pointer) and the invalid mark at rest, lane dist vs control dist, one 9x9 payload, boil parked,
// both engines, with a control-vs-control floor. Pixel counts (any channel >= 16) inside the cell's clip + 6 px.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
const [, , LANE, CTRL, OUTDIR] = process.argv;
const sub = 3, n = 9; let cells = "";
for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const i = r*n+c; const v = ((r*sub+Math.floor(r/sub)+c)%n)+1; cells += ((i>1&&(r*7+c*3)%5<2)?v:0).toString(36); }
const payload = Buffer.from(String.fromCharCode(1)+`${sub}.${cells}`,"latin1").toString("base64url");
async function shoot(b, url, mode, theme) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce", colorScheme: theme });
  await p.goto(`${url}/?size=3&board=${payload}`);
  for (let t = 0; t < 120; t++) { if ((await p.evaluate(() => document.querySelectorAll(".board-shell .game-cell").length)) === 81) break; await p.waitForTimeout(500); }
  await p.waitForTimeout(1500);
  const dark = await p.evaluate(() => document.documentElement.classList.contains("dark"));
  if (dark !== (theme === "dark")) { await p.locator("button.sun-moon-toggle").first().evaluate((e) => e.focus()); await p.keyboard.press("Enter"); await p.waitForTimeout(1500); await p.evaluate(() => document.activeElement?.blur?.()); await p.mouse.move(5, 5); await p.waitForTimeout(800); }
  const idx = 0; // cell 0: empty in the payload (the frame crossing)
  const box = await p.locator(".board-shell .game-cell").nth(idx).boundingBox();
  const idx2 = 40;
  const box2 = await p.locator(".board-shell .game-cell").nth(idx2).boundingBox();
  let target = box;
  if (mode === "hover") { target = box2; await p.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2); await p.waitForTimeout(700); }
  if (mode === "invalid") {
    // type the digit its row already holds into empty cell 0 (row 0 holds (0*3+0+c)%9+1 at kept c)
    const rowGiven = await p.evaluate(() => [...document.querySelectorAll(".board-shell .game-cell input")].slice(0, 9).map((i) => i.value).find((v) => v));
    await p.locator(".board-shell .game-cell input").nth(idx).click();
    await p.keyboard.press(rowGiven ?? "1");
    await p.evaluate(() => document.activeElement?.blur?.());
    await p.mouse.move(5, 5);
    await p.waitForTimeout(1200);
    const inv = await p.evaluate(() => document.querySelectorAll(".game-cell.is-invalid").length);
    if (!inv) console.log("WARN no invalid cell", url, theme);
  }
  const clip = { x: Math.floor(target.x - 6), y: Math.floor(target.y - 6), width: Math.ceil(target.width + 12), height: Math.ceil(target.height + 12) };
  const buf = await p.screenshot({ clip, caret: "hide" });
  await p.close();
  return buf;
}
const raw = async (b) => (await sharp(b).raw().ensureAlpha().toBuffer({ resolveWithObject: true }));
const diff = async (a, c) => { const A = await raw(a), B = await raw(c); if (A.data.length !== B.data.length) return -1; let k = 0; for (let i = 0; i < A.data.length; i += 4) if (Math.max(Math.abs(A.data[i]-B.data[i]), Math.abs(A.data[i+1]-B.data[i+1]), Math.abs(A.data[i+2]-B.data[i+2])) >= 16) k++; return k; };
const lines = [`payload ${payload} (9x9, cell 0 = frame crossing, cell 40 = centre) · PRM reduce · 1280x800 fine`];
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch();
  for (const theme of ["light", "dark"]) for (const mode of ["hover", "invalid"]) {
    const l = await shoot(b, LANE, mode, theme), c1 = await shoot(b, CTRL, mode, theme), c2 = await shoot(b, CTRL, mode, theme);
    writeFileSync(`${OUTDIR}/${name}-${theme}-${mode}-lane.png`, l); writeFileSync(`${OUTDIR}/${name}-${theme}-${mode}-ctrl.png`, c1);
    const line = `${name} ${theme} ${mode}: lane-vs-control ${await diff(l, c1)} px · control-vs-control floor ${await diff(c1, c2)} px`;
    console.log(line); lines.push(line);
  }
  await b.close();
}
writeFileSync(`${OUTDIR}/pi-rings.txt`, lines.join("\n") + "\n");
