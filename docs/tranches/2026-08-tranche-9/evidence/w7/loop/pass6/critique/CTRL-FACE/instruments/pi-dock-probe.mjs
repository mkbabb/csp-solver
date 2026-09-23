// CTRL-FACE pass-6 critic probe. node probe.mjs <engine> <baseURL> <label>
import { chromium, webkit, devices } from "playwright";
const [engName, base, label] = process.argv.slice(2);
const eng = engName === "webkit" ? webkit : chromium;
const Q = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const phone = devices["iPhone 13"];
const cells = [
  ["1280x800-fine", { viewport: { width: 1280, height: 800 } }],
  ["1440x900-fine", { viewport: { width: 1440, height: 900 } }],
  ["390x844-coarse", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: phone.isMobile, hasTouch: true }],
  ["430x932-coarse", { viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, isMobile: phone.isMobile, hasTouch: true }],
  ["320x568-coarse", { viewport: { width: 320, height: 568 }, deviceScaleFactor: 2, isMobile: phone.isMobile, hasTouch: true }],
];
const r2 = (n) => Math.round(n * 100) / 100;
const browser = await eng.launch();
const out = [];
for (const [cell, opts] of cells) {
  const ctx = await browser.newContext({ ...opts, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${base}/?${Q}`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  let opened = false;
  const vis = page.locator(".controls-card:visible").first();
  if (!(await vis.isVisible().catch(() => false))) {
    const tab = page.locator(".drawer-tab");
    if (opts.hasTouch) await tab.tap(); else await tab.click();
    await page.waitForTimeout(1500);
    opened = true;
  }
  await page.waitForTimeout(800);
  const m = await page.evaluate(() => {
    const R = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map((n) => Math.round(n * 100) / 100); };
    const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
    const givens = [...document.querySelectorAll('[role="gridcell"] input')].map((i) => i.value || "0").join("");
    const board = document.querySelector(".board-cells") || document.querySelector('[role="grid"]');
    const tags = card ? [...card.querySelectorAll(".washi-tag")].filter((t) => t.getClientRects().length) : [];
    const firstBtn = card ? [...card.querySelectorAll("button")].find((b) => b.getClientRects().length && !b.closest(".action-bar")) : null;
    const cs = card ? getComputedStyle(card) : null;
    const drawer = document.querySelector("#controls-drawer .drawer-case");
    return {
      givens: givens.slice(0, 12),
      board: R(board), card: R(card), drawer: R(drawer),
      padT: cs?.paddingTop, pinTapeH: card?.style.getPropertyValue("--pin-tape-h"), cardPadT: card?.style.getPropertyValue("--card-pad-t"),
      scrollH: card?.scrollHeight, clientH: card?.clientHeight, scrollW: card?.scrollWidth, clientW: card?.clientWidth,
      tape0: R(tags[0]), tape0Text: tags[0]?.textContent?.trim(),
      firstBtn: R(firstBtn), firstBtnText: (firstBtn?.getAttribute("aria-label") || firstBtn?.textContent || "").trim().slice(0, 20),
      masthead: R(document.querySelector("header")), tab: R(document.querySelector(".drawer-tab")),
    };
  });
  out.push({ engine: engName, label, cell, opened, ...m });
  await ctx.close();
}
await browser.close();
for (const o of out) console.log(JSON.stringify(o));
