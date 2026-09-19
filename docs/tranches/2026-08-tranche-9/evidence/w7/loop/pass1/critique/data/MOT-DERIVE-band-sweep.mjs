#!/usr/bin/env node
/**
 * CRITIC's independent re-run (MOT-DERIVE pass-1): the BAND SWEEP.
 * dockGlideMs now governs EVERY viewport <1024. The prototype auditioned ONE (390x844,
 * 628px). Measure the sheet's declared travel + duration across the band the constant
 * actually covers, both engines — and read contrast on the sheet in both themes.
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = "http://127.0.0.1:4244/";
const OUT = process.argv[2] ?? "/tmp/critic-band.json";
const ENGINE = process.argv.find((a) => a.startsWith("--engine="))?.split("=")[1] ?? "chromium";

const ARM = `
window.__mv = [];
const orig = Element.prototype.animate;
Element.prototype.animate = function (kf, opts) {
  let cls = ''; try { cls = typeof this.className === 'string' ? this.className : (this.getAttribute('class') || ''); } catch {}
  window.__mv.push({ cls: String(cls).slice(0,50), kf: JSON.stringify(kf), dur: opts && opts.duration, easing: opts && opts.easing });
  return orig.call(this, kf, opts);
};
window.__rect = (sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect();
  return { x:+r.left.toFixed(2), y:+r.top.toFixed(2), w:+r.width.toFixed(2), h:+r.height.toFixed(2) }; };
`;

function travelOf(kf) {
  // magnitude of the FROM translate
  const m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(kf) || /translateY\(([-\d.]+)px\)/.exec(kf);
  if (!m) return null;
  const x = parseFloat(m[1]);
  const y = m[2] !== undefined ? parseFloat(m[2]) : 0;
  return +Math.hypot(x, m[2] !== undefined ? y : x === x ? y : 0).toFixed(1);
}

const launcher = ENGINE === "webkit" ? webkit : chromium;
const browser = await launcher.launch({ headless: true });
const out = { engine: ENGINE, when: new Date().toISOString(), rows: [], contrast: [] };

const VPS = [
  { name: "390x844 portrait phone", w: 390, h: 844, dsf: 3, mobile: true },
  { name: "360x640 small phone", w: 360, h: 640, dsf: 3, mobile: true },
  { name: "768x1024 tablet portrait", w: 768, h: 1024, dsf: 2, mobile: true },
  { name: "844x390 landscape phone", w: 844, h: 390, dsf: 3, mobile: true },
  { name: "1023x700 just under rail", w: 1023, h: 700, dsf: 2, mobile: false },
  { name: "1440x900 DESK control", w: 1440, h: 900, dsf: 2, mobile: false },
];

for (const vp of VPS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: vp.dsf,
    hasTouch: vp.mobile,
    isMobile: ENGINE === "chromium" ? vp.mobile : undefined,
  });
  const page = await ctx.newPage();
  await page.addInitScript(ARM);
  await page.goto(BASE + "?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.waitForTimeout(1800);
  await page.evaluate(() => (window.__mv = []));
  const tab = page.locator(".drawer-tab").first();
  const before = await page.evaluate('window.__rect(".scene-controls")');
  await tab.click({ force: true });
  await page.waitForTimeout(900);
  const settled = await page.evaluate('window.__rect(".scene-controls")');
  const mv = await page.evaluate(() => window.__mv);
  const sheet = mv.filter((m) => m.cls.includes("scene-controls"));
  const rows = sheet.map((m) => {
    const t = travelOf(m.kf);
    return { cls: m.cls, dur: m.dur, travelPx: t, pxPerMs: t && m.dur ? +(t / m.dur).toFixed(3) : null, easing: m.easing };
  });
  out.rows.push({
    viewport: vp.name,
    moverCount: mv.length,
    sheet: rows,
    allMovers: mv.map((m) => ({ cls: m.cls.slice(0, 28), dur: m.dur, travelPx: travelOf(m.kf) })),
    closedRect: before,
    settledRect: settled,
  });
  await ctx.close();
}

// CONTRAST on the dock sheet, both themes (the family lands no CSS — this must be identical
// to HEAD; measured anyway because the charter binds every design to AA on both themes).
for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: ENGINE === "chromium",
    colorScheme: theme,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.waitForTimeout(1500);
  await page.locator(".drawer-tab").first().click({ force: true });
  await page.waitForTimeout(900);
  const read = await page.evaluate(() => {
    const lum = (c) => {
      const [r, g, b] = c.map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const parse = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const bgOf = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const b = getComputedStyle(n).backgroundColor;
        const p = parse(b);
        if (p.length === 3 && !/rgba\(0, 0, 0, 0\)/.test(b)) return p;
        n = n.parentElement;
      }
      return parse(getComputedStyle(document.body).backgroundColor);
    };
    const ratio = (a, b) => {
      const la = lum(a), lb = lum(b);
      return +((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)).toFixed(2);
    };
    const out = [];
    const sels = [
      ".scene-controls .washi-label",
      ".scene-controls .option-chip",
      ".scene-controls button",
      ".scene-controls",
    ];
    for (const s of sels) {
      const els = [...document.querySelectorAll(s)].slice(0, 3);
      for (const el of els) {
        const cs = getComputedStyle(el);
        const fg = parse(cs.color);
        const bg = bgOf(el);
        if (fg.length === 3 && bg.length === 3)
          out.push({
            sel: s,
            text: (el.textContent || "").trim().slice(0, 18),
            fontPx: parseFloat(cs.fontSize),
            color: cs.color,
            bg: `rgb(${bg.join(", ")})`,
            ratio: ratio(fg, bg),
          });
      }
    }
    return out;
  });
  out.contrast.push({ theme, read });
  await ctx.close();
}

await browser.close();
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(JSON.stringify({ engine: ENGINE, rows: out.rows.map((r) => ({ vp: r.viewport, sheet: r.sheet, movers: r.moverCount })) }, null, 1));
console.log("CONTRAST", JSON.stringify(out.contrast.map((c) => ({ theme: c.theme, min: Math.min(...c.read.map((r) => r.ratio)), rows: c.read })), null, 1));
