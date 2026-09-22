// ACC-SIX pass-4 CRITIC — the count's in-place update, on a PINNED encoded board, three arms:
// prototype dist (4237), key-restored ABLATION dist built from the same source (4239).
// No reducedMotion: the write-in animation must be free to re-run so its re-run is visible.
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync } from "node:fs";
const { chromium, webkit } = pw;
const PUZ = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const b64u = (s) => Buffer.from(s, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export const BOARD = "?board=" + b64u(String.fromCharCode(1) + "3." + PUZ);
const ARMS = { proto: "http://127.0.0.1:4237", ablate: "http://127.0.0.1:4239" };
const CELLS = [
  { name: "desk-1280x800-fine", viewport: { width: 1280, height: 800 }, dpr: 1, touch: false },
  { name: "phone-393x699-coarse", viewport: { width: 393, height: 699 }, dpr: 3, touch: true },
];
async function writeOne(page) {
  const idx = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll(".sudoku-cell"));
    const i = cells.findIndex((c) => { const x = c.querySelector("input"); return x && !x.value; });
    if (i < 0) return -1; cells[i].querySelector("input").focus(); return i;
  });
  if (idx < 0) return -1;
  await page.keyboard.type(SOL[idx]);
  await page.waitForTimeout(300);
  await page.evaluate(() => document.activeElement?.blur?.());
  return idx;
}
const rows = { board: BOARD, cells: {} };
for (const [eng, L] of [["chromium", chromium], ["webkit", webkit]]) {
  const br = await L.launch();
  for (const [arm, base] of Object.entries(ARMS)) for (const C of CELLS) {
    const ctx = await br.newContext({ viewport: C.viewport, deviceScaleFactor: C.dpr, hasTouch: C.touch, colorScheme: "light" });
    const page = await ctx.newPage();
    await page.goto(base + "/" + BOARD);
    await page.waitForSelector(".sudoku-cell input", { timeout: 60000 });
    await page.waitForTimeout(1500);
    const R = (rows.cells[`${eng}/${arm}/${C.name}`] = {});
    R.asset = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop());
    R.coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
    R.row1 = await page.evaluate(() => Array.from(document.querySelectorAll(".sudoku-cell input")).slice(0, 9).map((i) => i.value || ".").join(""));
    await page.evaluate(() => {
      window.__c = { muts: [], nodes: [], anims: [] };
      new MutationObserver((rs) => { for (const r of rs) { for (const n of r.addedNodes) if (n.nodeType === 1 && n.classList?.contains("margin-note-meta")) window.__c.muts.push("+" + n.textContent.trim()); for (const n of r.removedNodes) if (n.nodeType === 1 && n.classList?.contains("margin-note-meta")) window.__c.muts.push("-" + n.textContent.trim()); } })
        .observe(document.querySelector(".board-margin"), { childList: true, subtree: true });
    });
    const snap = () => page.evaluate(() => {
      const el = document.querySelector(".margin-note-meta");
      if (el && !window.__c.nodes.includes(el)) window.__c.nodes.push(el);
      const an = el ? el.getAnimations({ subtree: true }).map((a) => `${a.animationName || a.id || "anim"}:${a.playState}:${Math.round(a.currentTime ?? -1)}`) : [];
      return { text: el?.textContent.trim() ?? null, nodes: window.__c.nodes.length, anims: an };
    });
    R.w = [];
    for (let k = 0; k < 3; k++) {
      await writeOne(page);
      await page.waitForTimeout(40);
      R.w.push(await snap());
    }
    R.muts = await page.evaluate(() => window.__c.muts);
    R.fill = await page.evaluate(() => document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuetext"));
    await ctx.close();
    console.error("done", eng, arm, C.name);
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(rows, null, 2));
console.error("wrote", process.argv[2]);
