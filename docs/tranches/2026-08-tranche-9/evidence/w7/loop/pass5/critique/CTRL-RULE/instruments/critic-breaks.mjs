// T9-W7 pass 5 · CRITIC · CTRL-RULE — break tests on the lane's new e2e rows, run as the rows' own
// evaluate bodies (copied verbatim from zone-grammar.spec.ts) against the lane dist with a plant.
//  B-LINES-1: the foot's drawn rule DELETED → does "the page's lines keep a name line apart" red?
//             (its census falls back to the foot's BOX: `foot.querySelector("svg.ruled-line") ?? foot`)
//  B-LINES-2: every group rule deleted but one → does the row's `n >= 7` catch it?
//  B-TOGGLE : the toggle's hover scale raised to 1.25 (the literal 1.08 is written in App.vue as 0.54,
//             in the gate as 0.04) → does zone-grammar:731 still green while the hovered box reaches
//             a control?
// node critic-breaks.mjs <chromium|webkit> <LANE>
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
const [ENGINE, LANE] = process.argv.slice(2);
const SPEC = readFileSync("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28/web/frontend/e2e/zone-grammar.spec.ts", "utf8");
// lift DRAWN_LINES verbatim (TS annotations stripped)
const src = SPEC.slice(SPEC.indexOf("const DRAWN_LINES = () => {"), SPEC.indexOf("test(\"the page's lines keep"))
  .replace("const DRAWN_LINES = ", "").replace(/as HTMLElement/g, "").replace(/as SVGGraphicsElement \| null/g, "").replace(/\(svg: Element\)/g, "(svg)")
  .replace(/const inCard: number\[\] = \[\];/, "const inCard = [];").replace(/\(x\): x is \{ t: number; b: number; w: number \} =>/, "(x) =>").replace(/\.rp-name"\)!/, '.rp-name")').replace(/;\s*$/, "");
const DRAWN = new Function("return (" + src.trim().replace(/;$/, "") + ")")();
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const out = {};
async function page(vp) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, colorScheme: "light" });
  const p = await ctx.newPage();
  await p.goto(`${LANE}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
  await p.waitForTimeout(1800);
  return { ctx, p };
}
{
  const { ctx, p } = await page({ width: 1280, height: 800 });
  const pass = (r) => r.n >= 7 && Math.min(...r.inCard) >= r.floor && r.fold !== null && r.fold >= r.floor;
  const base = await p.evaluate(DRAWN); out.lines_asShipped = { ...base, rowGreen: pass(base) };
  await p.evaluate(() => document.querySelector("#card-foot svg.ruled-line")?.remove());
  const b1 = await p.evaluate(DRAWN); out.B_LINES_1_footRuleDeleted = { ...b1, rowGreen: pass(b1) };
  await ctx.close();
}
{
  const { ctx, p } = await page({ width: 1024, height: 768 });
  const read = () => p.evaluate(() => {
    const t = document.querySelector("button.sun-moon-toggle").getBoundingClientRect();
    const card = document.querySelector(".controls-card");
    const chip = card.querySelector(".ctrl-btn").getBoundingClientRect();
    return { foot: parseFloat(getComputedStyle(card).getPropertyValue("--toggle-foot")), box: t.bottom + t.height * 0.04, chipTop: chip.top };
  });
  const row = (at) => Math.abs(at.foot - at.box) < 0.5 && at.chipTop >= at.foot - 0.5;
  const a = await read(); out.toggle_asShipped = { ...a, rowGreen: row(a) };
  await p.addStyleTag({ content: ".sun-moon-toggle:hover{transform:scale(1.25)!important}" });
  const b = await read();
  const tb = await p.locator("button.sun-moon-toggle").boundingBox();
  await p.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2); await p.waitForTimeout(700);
  const hov = await p.evaluate(() => { const t = document.querySelector("button.sun-moon-toggle").getBoundingClientRect(); const chip = document.querySelector(".controls-card .ctrl-btn").getBoundingClientRect(); return { hoveredBottom: +t.bottom.toFixed(2), chipTop: +chip.top.toFixed(2), overlapY: +(t.bottom - chip.top).toFixed(2), overlapX: +(Math.min(t.right, chip.right) - Math.max(t.left, chip.left)).toFixed(2) }; });
  out.B_TOGGLE_hover125 = { ...b, rowGreen: row(b), hovered: hov };
  await ctx.close();
}
writeFileSync(join(OUT, `critic-breaks-${ENGINE}.json`), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close();
