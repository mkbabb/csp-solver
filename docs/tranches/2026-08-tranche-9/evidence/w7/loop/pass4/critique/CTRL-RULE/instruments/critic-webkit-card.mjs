// T9-W7 pass 4 · CTRL-RULE · CRITIC — two WebKit reads the main probe could not take:
//  (1) why the prototype card's clientHeight is 17 px under chromium's at the desk (a scrollbar?)
//  (2) the keyboard ring PAINTED in WebKit (Tab skips buttons there; a keydown + focus() is the
//      keyboard-modality route, asserted by :focus-visible before anything is read).
// node critic-webkit-card.mjs <chromium|webkit> <BASE> <light|dark>
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;
const [ENGINE = "webkit", BASE = "http://127.0.0.1:4238/", THEME = "light"] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CR = (a, b) => { const [h, l] = a > b ? [a, b] : [b, a]; return (h + 0.05) / (l + 0.05); };
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, colorScheme: THEME });
await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, THEME);
const p = await ctx.newPage();
await p.goto(`${BASE}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
await p.waitForTimeout(2500);
const card = await p.evaluate(() => {
  const c = document.querySelector(".controls-card"); const cs = getComputedStyle(c);
  const wide = [...c.querySelectorAll("*")].map((e) => ({ e, r: e.getBoundingClientRect() }))
    .filter(({ r }) => r.right > c.getBoundingClientRect().right - parseFloat(cs.paddingRight) + 0.5 && r.width > 0)
    .slice(0, 6).map(({ e, r }) => `${e.tagName}.${String(e.className?.baseVal ?? e.className).split(" ")[0]} r=${r.right.toFixed(1)}`);
  return { offsetH: c.offsetHeight, clientH: c.clientHeight, scrollW: c.scrollWidth, clientW: c.clientWidth, overflowX: cs.overflowX, overflowY: cs.overflowY,
    cardRight: +c.getBoundingClientRect().right.toFixed(1), padR: cs.paddingRight, borderB: cs.borderBottomWidth, overhang: wide };
});
console.log(ENGINE, THEME, "card", JSON.stringify(card));
const bg = (await p.evaluate(() => getComputedStyle(document.querySelector(".controls-card")).backgroundColor)).match(/[\d.]+/g).slice(0, 3).map(Number);
await p.keyboard.press("Shift");
await p.locator(".controls-card .ctrl-btn").first().evaluate((e) => e.focus());
await p.waitForTimeout(250);
const fr = await p.evaluate(() => { const a = document.activeElement; const b = a.getBoundingClientRect(); const cs = getComputedStyle(a);
  return { cls: String(a.className).split(" ")[0], fv: a.matches(":focus-visible"), x: b.x, y: b.y, w: b.width, h: b.height, outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`, off: parseFloat(cs.outlineOffset) || 0 }; });
const clip = { x: Math.round(fr.x + fr.w * 0.25), y: Math.round(fr.y - fr.off - 4), width: Math.max(4, Math.round(fr.w * 0.5)), height: 6 };
const buf = await p.screenshot({ clip });
const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
let worst = Infinity; const Lb = L(bg);
for (let x = 0; x < info.width; x++) { let m = 1; for (let y = 0; y < info.height; y++) { const i = (y * info.width + x) * 3; m = Math.max(m, CR(L([data[i], data[i + 1], data[i + 2]]), Lb)); } worst = Math.min(worst, m); }
console.log(ENGINE, THEME, "ring", JSON.stringify({ fv: fr.fv, outline: fr.outline, worstColumn: +worst.toFixed(3) }));
await browser.close();
console.log("EXIT OK");
