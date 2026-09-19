// MOT-VERB pass-2 CRITIC probe. Read-only: serves two already-built dists and reads.
// usage: node critic.probe.mjs <engine> <protoURL> <controlURL>
// resolved by absolute path: this probe lives in the evidence tree, outside any package
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import process from "node:process";

const engineName = process.argv[2];
const ENGINE = engineName === "webkit" ? webkit : chromium;
const PROTO = process.argv[3];
const CTRL = process.argv[4];

const VIEWPORTS = [
  { name: "desk", width: 1280, height: 800, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 3, isMobile: false, hasTouch: true },
];

const census = async (page) =>
  page.evaluate(() => {
    const out = { rects: [], filters: [], contrast: {}, rungs: {}, dusk: {} };
    const els = [...document.querySelectorAll("*")];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      out.rects.push(
        [el.tagName, Math.round(r.x * 100) / 100, Math.round(r.y * 100) / 100, Math.round(r.width * 100) / 100, Math.round(r.height * 100) / 100].join("|"),
      );
      const f = getComputedStyle(el).filter;
      if (f && f !== "none") for (const m of f.matchAll(/url\("?#([^")]+)"?\)/g)) out.filters.push(m[1]);
    }
    const rs = getComputedStyle(document.documentElement);
    for (const k of ["--rung-page", "--rung-step", "--rung-sheet", "--rung-mark", "--rung-breath", "--rung-touch", "--verb-dusk-ms"])
      out.rungs[k] = rs.getPropertyValue(k).trim();
    // contrast: body text on the page ground, and the logo/heading if present
    const lum = (c) => {
      const [r, g, b] = c.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => v / 255);
      const f = (u) => (u <= 0.03928 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a, b) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
      return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
    };
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    out.contrast.bodyBg = bodyBg;
    const probe = (sel, label) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const cs = getComputedStyle(el);
      let bg = "rgba(0, 0, 0, 0)";
      let n = el;
      while (n && (bg === "rgba(0, 0, 0, 0)" || bg === "transparent")) {
        bg = getComputedStyle(n).backgroundColor;
        n = n.parentElement;
      }
      out.contrast[label] = { color: cs.color, bg, ratio: ratio(cs.color, bg) };
    };
    probe("body", "body");
    probe(".game-card-title, .card-title, h1", "heading");
    probe(".margin-note-ink", "marginNote");
    probe("button", "button");
    out.filterIds = [...new Set(out.filters)].sort();
    return out;
  });

const toggleBeats = async (page) => {
  const tog = await page.$('[data-testid="dark-mode-toggle"], .dark-mode-toggle, button[aria-label*="ark" i], button[title*="ark" i]');
  if (!tog) return { error: "no toggle found" };
  await tog.click();
  await page.waitForTimeout(30);
  return page.evaluate(() => {
    const read = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { dur: cs.transitionDuration, delay: cs.transitionDelay, prop: cs.transitionProperty, ease: cs.transitionTimingFunction };
    };
    return {
      turning: document.documentElement.className,
      ".toggle-icon": read(".toggle-icon"),
      ".toggle-icon.is-active": read(".toggle-icon.is-active"),
      ".toggle-icon .warp": read(".toggle-icon .warp"),
      ".toggle-icon.is-active .warp": read(".toggle-icon.is-active .warp"),
      ".toggle-icon.is-active .twinkle-star": read(".toggle-icon.is-active .twinkle-star"),
      ".toggle-icon.is-active .twinkle-star-2": read(".toggle-icon.is-active .twinkle-star-2"),
      ".toggle-icon.is-active .twinkle-star-3": read(".toggle-icon.is-active .twinkle-star-3"),
    };
  });
};

const result = { engine: engineName, builds: {} };
const browser = await ENGINE.launch();
for (const [label, url] of [["proto", PROTO], ["control", CTRL]]) {
  result.builds[label] = {};
  for (const vp of VIEWPORTS) {
    for (const theme of ["light", "dark"]) {
      for (const prm of [false, true]) {
        const ctx = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: vp.deviceScaleFactor,
          hasTouch: vp.hasTouch,
          colorScheme: theme,
          reducedMotion: prm ? "reduce" : "no-preference",
        });
        const page = await ctx.newPage();
        await page.goto(url, { waitUntil: "networkidle" });
        await page.waitForTimeout(900);
        const key = `${vp.name}/${theme}${prm ? "/prm" : ""}`;
        const c = await census(page);
        result.builds[label][key] = {
          rectCount: c.rects.length,
          rectHash: c.rects.join("\n").length,
          rects: c.rects,
          filterIds: c.filterIds,
          rungs: c.rungs,
          contrast: c.contrast,
        };
        if (!prm) result.builds[label][key].beats = await toggleBeats(page);
        await ctx.close();
      }
    }
  }
}
await browser.close();
console.log(JSON.stringify(result));
