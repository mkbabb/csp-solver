const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules";
const { chromium } = await import(`${NM}/playwright/index.mjs`);
const PORT = process.argv[2], TAG = process.argv[3];
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
await c.addInitScript(() => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", "light"); } catch {} });
const p = await c.newPage();
await p.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "domcontentloaded" });
await p.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
await p.waitForTimeout(2200);
await p.keyboard.press("g");
await p.waitForTimeout(2500);
const r = await p.evaluate(() => [...document.querySelectorAll(".staging-axis-label")].map((el) => {
  const rg = document.createRange(); rg.selectNodeContents(el);
  const b = rg.getBoundingClientRect();
  return { t: el.textContent.trim(), glyphX: +b.x.toFixed(2), glyphW: +b.width.toFixed(2), boxX: +el.getBoundingClientRect().x.toFixed(2), padL: getComputedStyle(el).paddingLeft };
}));
console.log(TAG, JSON.stringify(r));
await b.close();
