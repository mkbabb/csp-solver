/** CTRL-FACE pass-3 critic · focused: the caption lane, the deck's OWN tape, the 768 chip. */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
const [BASE, OUT, TAG] = process.argv.slice(2);

const CARD = () => {
  const px = (n) => Math.round(n * 100) / 100;
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { x: px(r.x), y: px(r.y), w: px(r.width), h: px(r.height), r: px(r.right), b: px(r.bottom) };
  };
  const root = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
  if (!root) return { err: "no visible card" };
  return {
    card: box(root),
    rows: [...root.querySelectorAll(".zone-row")].map((row) => {
      const cap = row.querySelector(".zone-row-label");
      const strip = row.querySelector(".options-row");
      const chips = [...row.querySelectorAll(".ctrl-btn")];
      return {
        cap: cap ? { t: cap.textContent.trim(), ...box(cap), basis: getComputedStyle(cap).flexBasis, minW: getComputedStyle(cap).minWidth, ta: getComputedStyle(cap).textAlign } : null,
        row: box(row),
        strip: strip ? box(strip) : null,
        chips: chips.length,
        sameLine: cap && strip ? Math.abs(cap.getBoundingClientRect().top - strip.getBoundingClientRect().top) < 8 : null,
      };
    }),
    chipFont: (() => {
      const c = root.querySelector(".tray-well .ctrl-btn");
      return c ? getComputedStyle(c).fontSize + " / " + getComputedStyle(c).fontFamily.split(",")[0] : null;
    })(),
    chipBoxes: [...root.querySelectorAll(".tray-well .ctrl-btn")].map((c) => box(c).w + "x" + box(c).h),
  };
};

const DECK = () => {
  const px = (n) => Math.round(n * 100) / 100;
  const v = (el) => {
    const s = getComputedStyle(el);
    return `${s.fontFamily.split(",")[0].replace(/["']/g, "")} | ${px(parseFloat(s.fontSize))} | ${s.fontWeight} | ${s.lineHeight} | ${s.margin}`;
  };
  const band = document.querySelector(".staging-band");
  if (!band) return { err: "no staging band" };
  const tape = band.querySelector(".washi-tag");
  const bb = (el) => {
    const r = el.getBoundingClientRect();
    return { x: px(r.x), y: px(r.y), w: px(r.width), h: px(r.height) };
  };
  return {
    band: bb(band),
    slip: band.querySelector(".staging-slip") ? bb(band.querySelector(".staging-slip")) : null,
    deckTape: tape ? { t: tape.textContent.trim(), v: v(tape), b: bb(tape) } : null,
    firstWashiInDoc: (() => {
      const w = document.querySelector(".washi-tag");
      return w ? { t: w.textContent.trim(), inBand: band.contains(w) } : null;
    })(),
    labels: [...band.querySelectorAll(".staging-axis-label")].map((l) => ({ t: l.textContent.trim(), v: v(l), b: bb(l) })),
    chips: [...band.querySelectorAll(".ctrl-btn")].map((c) => ({ t: c.textContent.trim(), v: v(c), b: bb(c) })),
  };
};

async function run(engine, name) {
  const b = await engine.launch();
  const out = [];
  for (const c of [
    { id: "390c", w: 390, h: 844, coarse: true },
    { id: "768x1024c", w: 768, h: 1024, coarse: true },
    { id: "1280f", w: 1280, h: 800, coarse: false },
  ]) {
    const ctx = await b.newContext({
      viewport: { width: c.w, height: c.h },
      hasTouch: c.coarse,
      isMobile: c.coarse && name === "chromium",
      deviceScaleFactor: 2,
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const p = await ctx.newPage();
    try {
      await p.goto(`${BASE}/?size=3&difficulty=MEDIUM`, { waitUntil: "load", timeout: 40000 });
      await p.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
      await p.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
      const vis = p.locator(".controls-card:visible").first();
      if (!(await vis.isVisible().catch(() => false))) {
        const tab = p.locator(".drawer-tab");
        const touch = await p.evaluate(() => "ontouchstart" in window || navigator.maxTouchPoints > 0);
        await (touch ? tab.tap() : tab.click());
        await p.waitForTimeout(900);
      }
      await vis.waitFor({ state: "visible", timeout: 20000 });
      await p.waitForTimeout(700);
      out.push({ engine: name, cell: c.id, kind: "card", ...(await p.evaluate(CARD)) });
    } catch (e) {
      out.push({ engine: name, cell: c.id, kind: "card", err: String(e).slice(0, 180) });
    }
    // the deck
    try {
      await p.goto(`${BASE}/?view=gallery&size=3&difficulty=MEDIUM`, { waitUntil: "load", timeout: 40000 });
      await p.waitForSelector(".staging-axis", { timeout: 25000 });
      await p.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
      await p.waitForTimeout(900);
      out.push({ engine: name, cell: c.id, kind: "deck", ...(await p.evaluate(DECK)) });
    } catch (e) {
      out.push({ engine: name, cell: c.id, kind: "deck", err: String(e).slice(0, 180) });
    }
    await ctx.close();
  }
  await b.close();
  return out;
}
const all = [...(await run(chromium, "chromium")), ...(await run(webkit, "webkit"))];
writeFileSync(OUT, all.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log(`${TAG}: ${all.length} rows -> ${OUT}`);
