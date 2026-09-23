// T9-W7 pass 6 · CTRL-RULE — the coarse rail's WIDTH ANATOMY (charter row 1). One arm per run.
// Reads the case, card, foot, bar and each verb's box + paint at 1280×800 hasTouch (or W/H env),
// drawer open, on the lane's encoded payload. node p6-rail.mjs <chromium|webkit> <BASE> [W] [H] [touch 1|0]
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const [ENGINE = "chromium", BASE = "http://127.0.0.1:4231/", W = "1280", H = "800", T = "1"] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({ viewport: { width: +W, height: +H }, deviceScaleFactor: 1, hasTouch: T === "1" });
const p = await ctx.newPage();
await p.goto(`${BASE}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
await p.waitForTimeout(2000);
if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
  await p.locator(".drawer-tab").first().click({ force: true });
}
let last = -1;
for (let i = 0; i < 30; i++) { await p.waitForTimeout(100); const t = await p.evaluate(() => document.querySelector(".drawer-case")?.getBoundingClientRect().left ?? 0); if (Math.abs(t - last) < 0.01) break; last = t; }
const r = await p.evaluate(() => {
  const b = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { w: +r.width.toFixed(2), l: +r.left.toFixed(2), padL: cs.paddingLeft, padR: cs.paddingRight, contain: cs.contain, sw: e.scrollWidth, cw: e.clientWidth }; };
  const verbs = [...document.querySelectorAll(".action-verbs > button, .action-bar > button")].map((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { name: e.getAttribute("aria-label"), w: +r.width.toFixed(2), padL: cs.paddingLeft, minW: cs.minWidth, vis: cs.visibility }; });
  const av = document.querySelector(".action-verbs"); const avcs = av && getComputedStyle(av);
  return { coarse: matchMedia("(pointer: coarse)").matches, case: b(".drawer-case"), card: b(".controls-card"), foot: b("#card-foot") ?? b(".card-foot"), bar: b(".action-bar"), verbsRow: av ? { gap: avcs.columnGap, display: avcs.display, cols: avcs.gridTemplateColumns, wrap: avcs.flexWrap } : null, verbs,
    masthead: b(".masthead"), logo: b("svg.handwritten-logo"), tab: b(".drawer-tab"), host: b(".board-peek-host") };
});
console.log(JSON.stringify({ engine: ENGINE, base: BASE, W, H, touch: T, ...r }, null, 1));
await browser.close();
