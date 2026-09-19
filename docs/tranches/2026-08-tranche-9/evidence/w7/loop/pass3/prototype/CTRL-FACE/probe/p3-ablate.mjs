/** T9-W7 pass 3 · CTRL-FACE · ablations, in page, on the prototype. */
import { chromium, webkit } from "playwright";

const CELLS = [320, 360, 375, 390, 430];

async function run(engine, name) {
  const b = await engine.launch();
  for (const w of CELLS) {
    const ctx = await b.newContext({
      viewport: { width: w, height: 844 },
      deviceScaleFactor: 3,
      hasTouch: true,
      isMobile: name === "chromium",
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const p = await ctx.newPage();
    await p.goto("http://127.0.0.1:4234/?size=3&difficulty=EASY", { waitUntil: "load" });
    await p.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
    await p.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
    const tab = p.locator(".drawer-tab");
    if (await tab.isVisible().catch(() => false)) {
      await tab.tap();
      await p.waitForTimeout(900);
    }
    const r = await p.evaluate(() => {
      const px = (n) => Math.round(n * 100) / 100;
      const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
      const caps = () =>
        [...card.querySelectorAll(".zone-row-label")].map((c) => ({
          t: c.textContent.trim(),
          lines: c.getClientRects().length,
          w: px(c.getBoundingClientRect().width),
          rowH: px(c.parentElement.getBoundingClientRect().height),
        }));
      const shipped = caps();
      // ABLATION A — the printed caption WITHOUT `white-space: nowrap` (the born-RED arm)
      const a = document.createElement("style");
      a.textContent = ".zone-row-label { white-space: normal !important }";
      document.head.appendChild(a);
      const noWrapOff = caps();
      const cardNoWrap = px(card.getBoundingClientRect().height);
      a.remove();
      // ABLATION B — the tab row's headroom back to 0.35rem
      const ink = (el) => {
        const rr = document.createRange();
        rr.selectNodeContents(el);
        return rr.getBoundingClientRect();
      };
      const daylight = () => {
        const tape = card.querySelector(".washi-tag");
        const heads = [...card.querySelectorAll(".mobile-heading-btn .section-heading")];
        if (!tape || !heads.length) return null;
        const tb = tape.getBoundingClientRect();
        return heads.map((h) => px(ink(h).top - tb.bottom));
      };
      const shippedDaylight = daylight();
      const bst = document.createElement("style");
      bst.textContent = ".mobile-heading-row { padding-top: 0.35rem !important }";
      document.head.appendChild(bst);
      const at035 = daylight();
      bst.textContent = ".mobile-heading-row { padding-top: 0 !important }";
      const at0 = daylight();
      bst.remove();
      return {
        shipped,
        noWrapOff,
        cardH: px(card.getBoundingClientRect().height),
        cardNoWrap,
        shippedDaylight,
        at035,
        at0,
      };
    });
    console.log(`${name} ${w}: ` + JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
}

await run(chromium, "chromium");
await run(webkit, "webkit");
