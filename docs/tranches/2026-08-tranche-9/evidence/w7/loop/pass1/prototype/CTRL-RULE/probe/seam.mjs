// the 390 seam — the case's painted top band against the wordmark's box, both ports.
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const PORTS = { proto: "4230", head: "4232" };

async function one(engine, port, w, h) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: engine === "chromium" ? true : undefined,
    hasTouch: true,
    colorScheme: "dark",
  });
  await ctx.addInitScript(() => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", "dark");
    } catch {}
  });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/?size=3&difficulty=EASY`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1600);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  const r = await page.evaluate(() => {
    const logo = document.querySelector("svg.handwritten-logo");
    const lb = logo.getBoundingClientRect();
    const sc = document.querySelector(".scene-controls");
    const scb = sc.getBoundingClientRect();
    const cs = getComputedStyle(sc);
    // the case's PAINTED top band: the drawn outline the case wears, its topmost stroke
    const caseEl = sc.querySelector(".drawer-case") || sc;
    const outlines = [...sc.querySelectorAll(".drawer-case > svg.outline-svg")].map((s) => {
      const b = s.getBoundingClientRect();
      return { cls: s.getAttribute("class"), top: +b.top.toFixed(2), h: +b.height.toFixed(2) };
    });
    const caseBox = caseEl.getBoundingClientRect();
    return {
      logoBottom: +lb.bottom.toFixed(2),
      sceneControlsTop: +scb.top.toFixed(2),
      sheetChrome: cs.getPropertyValue("--sheet-chrome").trim(),
      top: cs.top,
      caseTop: +caseBox.top.toFixed(2),
      outlines,
      drawerClosed: document.documentElement.classList.contains("drawer-closed"),
    };
  });
  await browser.close();
  return r;
}

const rows = {};
for (const [tag, port] of Object.entries(PORTS)) {
  for (const engine of ["chromium", "webkit"]) {
    for (const [w, h] of [
      [375, 812],
      [390, 844],
      [430, 932],
    ]) {
      rows[`${tag}/${w}/${engine}`] = await one(engine, port, w, h);
    }
  }
}
for (const [k, v] of Object.entries(rows)) {
  const band = Math.min(...v.outlines.map((o) => o.top));
  console.log(
    k,
    `logoBottom=${v.logoBottom} sceneTop=${v.sceneControlsTop} caseTop=${v.caseTop} band=${band.toFixed(2)}`,
    `clearance(band-logo)=${(band - v.logoBottom).toFixed(2)}`,
    `clearance(scene-logo)=${(v.sceneControlsTop - v.logoBottom).toFixed(2)}`,
    `--sheet-chrome=${v.sheetChrome} top=${v.top} closed=${v.drawerClosed}`,
  );
}
