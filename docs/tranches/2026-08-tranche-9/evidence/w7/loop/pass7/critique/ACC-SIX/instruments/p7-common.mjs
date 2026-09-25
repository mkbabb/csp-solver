// PASS-6 COPY of pass5/prototype/ACC-SIX/instruments/p5-common.mjs (+ the aria-label given-set read, LAWS P5; + a 16x16 payload). ACC-SIX pass-5 — shared: the pinned payload (the product's own codec grammar, LAWS P4), the
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
/** LAWS P5: the given-set read back through the ARIA-LABEL corpus (never innerText). */
export const labels = (page) => page.evaluate(() => Array.from(document.querySelectorAll(".sudoku-cell")).map((c) => c.getAttribute("aria-label") ?? c.querySelector("input")?.getAttribute("aria-label") ?? "").join("|"));
// ── A REAL 16x16 payload (pass 6, charter row 4): a valid solved grid by the band pattern,
// 86 givens (seeded), 170 writable — the widest count the lesson can show is "3 of 170".
function mul(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export const SOL16 = Array.from({ length: 256 }, (_, i) => { const r = Math.floor(i / 16), c = i % 16; return ((4 * (r % 4) + Math.floor(r / 4) + c) % 16) + 1; });
const keep16 = (() => { const rnd = mul(20260923); const idx = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } return new Set(idx.slice(0, 86)); })();
export const PUZ16 = SOL16.map((v, i) => (keep16.has(i) ? v.toString(36) : "0")).join("");
export const BOARD16 = "?board=" + b64u(String.fromCharCode(1) + "4." + PUZ16);
export async function open16(browser, base, C, extra = {}) {
  const ctx = await browser.newContext({ viewport: C.viewport, deviceScaleFactor: C.dpr ?? 1, hasTouch: !!C.touch, isMobile: false, colorScheme: C.scheme ?? "light", reducedMotion: C.reduce ? "reduce" : "no-preference", ...extra });
  const page = await ctx.newPage();
  await page.goto(base + "/" + BOARD16);
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1500);
  return { ctx, page };
}
// A SECOND 9x9 payload (LAWS P5: a painted percentage is quoted on >= 2 payloads): the same deal with rows 1 and
// 9 blanked (6 givens dropped, 57 writable); every write is still the SOLUTION's digit, so every pose is legal.
export const PUZ2 = "000000000" + PUZ.slice(9, 72) + "000000000";
export const BOARD2 = "?board=" + b64u(String.fromCharCode(1) + "3." + PUZ2);
