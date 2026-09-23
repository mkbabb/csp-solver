// CTRL-FACE pass-6 critic: the parked publisher. node park.mjs <engine> <baseURL>
import { chromium, webkit } from "playwright";
const [engName, base] = process.argv.slice(2);
const eng = engName === "webkit" ? webkit : chromium;
const Q = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const browser = await eng.launch();
async function session(mode) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__w = [];
    const sp = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function (n, v, p) {
      if (/^--(action-bar-h|card-pad-t|pin-tape-h|card-pad-b)$/.test(n)) window.__w.push([n, v, performance.now()]);
      return sp.call(this, n, v, p);
    };
  });
  await page.goto(`${base}/?${Q}`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page.waitForTimeout(1500);
  const btnSel = await page.evaluate(() => {
    const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
    const bar = card?.querySelector(".action-bar");
    const b = bar && [...bar.querySelectorAll("button")].find((x) => /keys/i.test((x.getAttribute("aria-label") || "") + x.textContent));
    if (!b) return null;
    b.setAttribute("data-crit-keys", "1");
    return true;
  });
  if (!btnSel) { await ctx.close(); return { mode, error: "no keys control" }; }
  const truth = () => page.evaluate(() => {
    const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
    const bar = card.querySelector(".action-bar");
    const cs = getComputedStyle(card);
    return {
      pub: card.style.getPropertyValue("--action-bar-h"),
      truth: `${Math.ceil(bar.getBoundingClientRect().height + (parseFloat(cs.paddingBottom) || 0))}px`,
      pubPadT: card.style.getPropertyValue("--card-pad-t"), truthPadT: cs.paddingTop,
      open: !!card.querySelector(".legend-fold.is-open"),
      writes: window.__w.filter((w) => w[0] === "--action-bar-h").length,
    };
  });
  const out = { engine: engName, mode };
  out.before = await truth();
  if (mode === "single") {
    await page.evaluate(() => document.querySelector("[data-crit-keys]").click());
  } else if (mode === "double-sync") {
    // two presses in one task: the net state does not change, so no transition starts
    await page.evaluate(() => { const b = document.querySelector("[data-crit-keys]"); b.click(); b.click(); });
  } else if (mode === "open-then-hide") {
    // a press, then the regime changes mid-rung (the card leaves the rail for the dock)
    await page.evaluate(() => document.querySelector("[data-crit-keys]").click());
    await page.setViewportSize({ width: 390, height: 844 });
  }
  await page.waitForTimeout(900);
  out.afterPress = await truth();
  // now something ELSE moves the bar: the root font grows 12.5 % (a reader's text-size change)
  await page.evaluate(() => { document.documentElement.style.fontSize = "18px"; });
  await page.waitForTimeout(900);
  out.afterFont = await truth();
  await ctx.close();
  return out;
}
for (const m of ["single", "double-sync"]) console.log(JSON.stringify(await session(m)));
await browser.close();
