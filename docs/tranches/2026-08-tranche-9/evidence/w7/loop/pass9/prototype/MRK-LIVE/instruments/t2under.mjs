// What stands just outside cell 0's top, left and right edges (4 px out) on a dist, under reduce.
import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/paint-lib.mjs";
const [base, label] = process.argv.slice(2);
function mint(sub) {
  const n = sub * sub; let cells = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const i = r * n + c; const v = ((r * sub + Math.floor(r / sub) + c) % n) + 1; const keep = i > 1 && (r * 7 + c * 3) % 5 < 2; cells += (keep ? v : 0).toString(36); }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}
const browser = await playwright().chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: "reduce", colorScheme: "light" });
const page = await ctx.newPage();
await page.goto(`${base}/?size=3&board=${mint(3)}`);
await page.waitForFunction(() => document.querySelectorAll(".board-shell .game-cell").length === 81, null, { timeout: 120000 });
await page.waitForTimeout(1200);
const out = await page.evaluate(() => {
  const c = document.querySelectorAll(".board-shell .game-cell")[0].getBoundingClientRect();
  const nm = (e) => `${e.tagName.toLowerCase()}.${String(e.className?.baseVal ?? e.className).trim().split(/\s+/).slice(0, 2).join(".")}`;
  const at = (x, y) => document.elementsFromPoint(x, y).slice(0, 6).map((e) => { const cs = getComputedStyle(e); return `${nm(e)}[bg ${cs.backgroundColor}${cs.backgroundImage !== "none" ? " img" : ""}${cs.boxShadow !== "none" ? " shadow" : ""}${cs.borderTopWidth !== "0px" ? " bt" + cs.borderTopWidth : ""}]`; }).join(" > ");
  return { cell: [c.x, c.y, c.width, c.height].map(Math.round), top: at(c.x + c.width / 2, c.y - 4), left: at(c.x - 4, c.y + c.height / 2), right: at(c.right + 4, c.y + c.height / 2), bottom: at(c.x + c.width / 2, c.bottom + 4) };
});
for (const [k, v] of Object.entries(out)) console.log(`${label} ${k}: ${Array.isArray(v) ? v.join(",") : v}`);
await browser.close();
