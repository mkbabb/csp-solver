import { chromium } from "playwright";
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 390, height: 844 }, baseURL: "http://127.0.0.1:4240", hasTouch: true, isMobile: true, deviceScaleFactor: 3 });
const p = await c.newPage();
await p.emulateMedia({ reducedMotion: "reduce" });
await p.goto("/?size=3&difficulty=EASY", { waitUntil: "networkidle" });
await p.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
const card = p.locator(".controls-card:visible").first();
if (!(await card.isVisible().catch(() => false))) { await p.locator(".drawer-tab").tap(); await p.waitForTimeout(1100); }
let hops=0,on=false;
while (hops<80 && !on) { await p.keyboard.press("Tab"); hops++;
  on = await p.evaluate(() => { const a=document.activeElement; return !!a && a.matches(".tray-well .ctrl-btn") && a.matches(":focus-visible"); }); }
await p.waitForTimeout(600);
const r = await p.evaluate(() => {
  const a = document.activeElement;
  const before = getComputedStyle(a).outlineColor;
  const attrs = [...a.attributes].map(x=>x.name).filter(n=>/^data-v-/.test(n));
  const parentAttrs = [...a.closest(".tray-well").attributes].map(x=>x.name).filter(n=>/^data-v-/.test(n));
  a.style.outline = "2px dashed var(--ring-ink)";
  const inline = getComputedStyle(a).outlineColor;
  a.style.outline = "";
  a.style.outlineColor = "var(--ring-ink)";
  const inlineColorOnly = getComputedStyle(a).outlineColor;
  a.style.outlineColor = "#3a7bc4";
  const literal = getComputedStyle(a).outlineColor;
  a.style.outlineColor = "";
  const raw = JSON.stringify(getComputedStyle(a).getPropertyValue("--ring-ink"));
  return { before, inline, inlineColorOnly, literal, raw, transitionProp: getComputedStyle(a).transitionProperty, transitionDur: getComputedStyle(a).transitionDuration, chipScope: attrs, wellScope: parentAttrs,
           ringInk: getComputedStyle(a).getPropertyValue("--ring-ink").trim() };
});
console.log("tabs", hops, JSON.stringify(r, null, 1));
await b.close();
