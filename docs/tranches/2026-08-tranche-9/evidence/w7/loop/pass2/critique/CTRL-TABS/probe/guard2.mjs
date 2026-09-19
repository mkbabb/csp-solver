// CTRL-TABS critic — the GUARD row, re-measured from RENDERED PIXELS (not from a computed-style
// composite): the ribbon is armed through the product's own predicate, then the destructive
// word's ground is the modal pixel of its own box as the engine painted it.
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4237/";
const OUT = process.env.OUT || "/tmp/critic-guard2.json";

const lum = (r, g, b) => {
  const f = (x) => {
    const v = x / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [l1, l2] = [a, b].sort((x, y) => y - x);
  return +((l1 + 0.05) / (l2 + 0.05)).toFixed(2);
};
const parse = (c) => (c.match(/[\d.]+/g) || []).slice(0, 4).map(Number);
const over = (fg, bg) => {
  const a = fg.length > 3 ? fg[3] : 1;
  return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
};

async function modal(page, r) {
  const buf = await page.screenshot({ clip: { x: r.x, y: r.y, width: r.w, height: r.h } });
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const t = new Map();
  for (let i = 0; i < data.length; i += info.channels) {
    const k = `${data[i]},${data[i + 1]},${data[i + 2]}`;
    t.set(k, (t.get(k) || 0) + 1);
  }
  let best, n = 0;
  for (const [k, v] of t) if (v > n) ((best = k), (n = v));
  return { rgb: best.split(",").map(Number), share: +(n / (info.width * info.height)).toFixed(3) };
}

const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const theme of ["light", "dark"]) {
    const browser = await (engine === "webkit" ? webkit : chromium).launch();
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: engine === "chromium" ? true : undefined,
      hasTouch: true,
      colorScheme: theme,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await page.waitForTimeout(1200);
    const idx = await page.evaluate(() =>
      [...document.querySelectorAll(".game-cell input")].findIndex((i) => !i.value),
    );
    await page.locator(".game-cell input").nth(idx).click({ force: true });
    await page.keyboard.press("5");
    await page.waitForTimeout(500);
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
    await page.evaluate(() => document.querySelector('.action-verbs [data-verb="clear"]')?.click());
    await page.waitForTimeout(700);

    const geo = await page.evaluate(() => {
      const n = (s) => (s || "").replace(/\s+/g, " ").trim();
      const info = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        let op = 1, p = el;
        while (p && p !== document.documentElement) {
          op *= parseFloat(getComputedStyle(p).opacity || "1");
          p = p.parentElement;
        }
        return {
          text: n(el.textContent),
          color: cs.color,
          opacityChain: +op.toFixed(4),
          rect: { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) },
          drawnBox: !!el.querySelector("svg"),
        };
      };
      const raised = document.querySelector(".tab.is-raised");
      return {
        ask: n(document.querySelector(".guard-ask")?.textContent),
        go: info(document.querySelector(".guard-go")),
        keep: info(document.querySelector(".guard-keep")),
        focus: document.activeElement?.className || null,
        cardBg: getComputedStyle(document.querySelector(".controls-card")).backgroundColor,
        raisedAfter: raised ? getComputedStyle(raised, "::after").content : "n/a",
        logs: document.querySelectorAll('[role="log"]').length,
        ringAuthored: getComputedStyle(document.documentElement).getPropertyValue("--ring-ink").trim(),
      };
    });
    const res = { ...geo, measured: {} };
    const card = parse(geo.cardBg);
    for (const w of ["go", "keep"]) {
      const b = geo[w];
      if (!b) continue;
      const g = await modal(page, { x: b.rect.x, y: b.rect.y, w: Math.max(1, b.rect.w), h: Math.max(1, b.rect.h) });
      const fg = parse(b.color);
      const ink = over([fg[0], fg[1], fg[2], (fg[3] ?? 1) * b.opacityChain], g.rgb);
      res.measured[w] = {
        groundPainted: g.rgb,
        groundShare: g.share,
        ink: b.color,
        wordOnItsGround: ratio(lum(...ink), lum(...g.rgb)),
        groundVsCard: ratio(lum(...g.rgb), lum(card[0], card[1], card[2])),
        greyOfInk: +lum(...ink).toFixed(4),
      };
    }
    if (res.measured.go && res.measured.keep)
      res.measured.greyscaleGapBetweenWords = ratio(res.measured.go.greyOfInk, res.measured.keep.greyOfInk);
    // Escape disarms?
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    res.escapeDisarms = await page.evaluate(() => !document.querySelector(".guard-go"));
    out[`390x844-${theme}-${engine}`] = res;
    await browser.close();
  }
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("EXIT-OK", OUT);
