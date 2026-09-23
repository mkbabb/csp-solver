// ACC-SIX pass-5 — shared: the pinned payload (the product's own codec grammar, LAWS P4), the
// given-set readback, one legal write, the asset identity. Every row that imports this STATES
// the payload it used (BOARD below) and asserts both arms read the same given-set.
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
export const { chromium, webkit } = pw;
export const PUZ = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
export const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const b64u = (s) => Buffer.from(s, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export const PAYLOAD = b64u(String.fromCharCode(1) + "3." + PUZ);
export const BOARD = "?board=" + PAYLOAD;
export const ENGINES = [["chromium", chromium], ["webkit", webkit]];
/** The given-set the arm dealt, read at LOAD (givens carry no DOM class here — the input value
 *  IS the given): must equal PUZ with '.' for 0, on every arm. */
export const DEAL = PUZ.replace(/0/g, ".");
/** The dealt digits as the inputs read them (givens + anything written). */
export const cells = (page) => page.evaluate(() => Array.from(document.querySelectorAll(".sudoku-cell input")).map((i) => i.value || ".").join(""));
export const asset = (page) => page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop() ?? "dev");
/** Write the SOLUTION's digit into the n-th empty cell (a LEGAL play state, never a repeated 5). */
export async function writeLegal(page, settle = 300) {
  const idx = await page.evaluate(() => {
    const cs = Array.from(document.querySelectorAll(".sudoku-cell"));
    const i = cs.findIndex((c) => { const x = c.querySelector("input"); return x && !x.value; });
    if (i >= 0) cs[i].querySelector("input").focus();
    return i;
  });
  if (idx < 0) return -1;
  await page.keyboard.type(SOL[idx]);
  await page.waitForTimeout(settle);
  return idx;
}
export async function open(browser, base, C, extra = {}) {
  const ctx = await browser.newContext({ viewport: C.viewport, deviceScaleFactor: C.dpr ?? 1, hasTouch: !!C.touch, isMobile: false, colorScheme: C.scheme ?? "light", reducedMotion: C.reduce ? "reduce" : "no-preference", ...extra });
  const page = await ctx.newPage();
  await page.goto(base + "/" + BOARD);
  await page.waitForSelector(".sudoku-cell input", { timeout: 60000 });
  await page.waitForTimeout(1500);
  return { ctx, page };
}
