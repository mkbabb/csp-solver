// T9-W7 pass-1 CRITIC — independent re-run: the card's fit, the one-dimming ratio, and the
// reading the prototype never took: THE DESTRUCTIVE VERB'S INK against the face it is painted on.
// Analytic composite (alpha over the effective ground), so it is engine-independent, and the
// painted extreme beside it.
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4240/";

const HELPERS = () => {
  window.__parse = (c) => {
    // rgb/rgba/color(srgb r g b / a)
    let m = /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)$/.exec(c);
    if (m) return [+m[1] * 255, +m[2] * 255, +m[3] * 255, m[4] === undefined ? 1 : +m[4]];
    m = /^rgba?\(([^)]+)\)$/.exec(c);
    if (m) {
      const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
      return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]];
    }
    return null;
  };
  window.__ground = (el) => {
    // walk up for the first opaque background, compositing translucent ones, and multiplying
    // every ancestor `opacity` on the way — the double-dim the family forbids lives HERE.
    let stack = [];
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      const bg = window.__parse(cs.backgroundColor);
      const op = parseFloat(cs.opacity);
      stack.push({ bg, op });
      if (bg && bg[3] === 1 && op === 1) break;
      n = n.parentElement;
    }
    let out = [255, 255, 255];
    for (let i = stack.length - 1; i >= 0; i--) {
      const { bg, op } = stack[i];
      if (bg && bg[3] > 0) {
        const a = bg[3];
        out = [0, 1, 2].map((k) => bg[k] * a + out[k] * (1 - a));
      }
      if (op < 1) out = [0, 1, 2].map((k) => out[k] * op + 255 * (1 - op)); // approximation flag
    }
    return out;
  };
  window.__lum = (rgb) => {
    const f = (x) => { const v = x / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
  };
  window.__ratio = (a, b) => { const [x, y] = [window.__lum(a), window.__lum(b)].sort((p, q) => q - p); return +(((x + 0.05) / (y + 0.05))).toFixed(2); };
  window.__inkOn = (el) => {
    const cs = getComputedStyle(el);
    const ink = window.__parse(cs.color);
    let ground = window.__ground(el);
    // the element's OWN opacity chain dims the ink too
    let op = 1, n = el;
    while (n && n !== document.documentElement) { op *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
    const a = (ink[3] ?? 1) * op;
    const painted = [0, 1, 2].map((k) => ink[k] * a + ground[k] * (1 - a));
    return { color: cs.color, alpha: +a.toFixed(3), ground: ground.map((v) => Math.round(v)), ratio: window.__ratio(painted, ground), chainOpacity: +op.toFixed(3) };
  };
};

const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const scheme of ["light", "dark"]) {
    const browser = await (engine === "webkit" ? webkit : chromium).launch();
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: engine === "chromium" ? true : undefined, colorScheme: scheme });
    await ctx.addInitScript(() => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", document.documentElement.dataset.x || "SCHEME"); } catch {} });
    const page = await ctx.newPage();
    await page.addInitScript(`try{localStorage.setItem("sudoku-color-scheme","${scheme}")}catch{}`);
    await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
    await page.waitForTimeout(1500);
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(1200);
    await page.evaluate(HELPERS);

    const base = await page.evaluate(() => {
      const card = document.querySelector(".controls-card");
      const tabs = [...document.querySelectorAll('[role="tab"]')].map((t) => ({
        t: t.innerText.trim(),
        sel: t.getAttribute("aria-selected"),
        ...window.__inkOn(t.querySelector(".tab-word") || t),
        box: (({ width, height }) => ({ w: +width.toFixed(2), h: +height.toFixed(2) }))(t.getBoundingClientRect()),
      }));
      return {
        card: card ? { sh: card.scrollHeight, ch: card.clientHeight, fits: card.scrollHeight <= card.clientHeight } : null,
        cardBox: card ? (({ height }) => +height.toFixed(2))(card.getBoundingClientRect()) : null,
        tabs,
        acts: [...document.querySelectorAll(".action-bar button")].map((b) => ({
          t: b.innerText.replace(/\s+/g, " ").trim().slice(0, 12),
          ...window.__inkOn(b.querySelector(".act-word, .verb-word, span") || b),
          box: (({ width, height }) => ({ w: +width.toFixed(2), h: +height.toFixed(2) }))(b.getBoundingClientRect()),
        })),
      };
    });

    // ARM the destructive verb — the ribbon takes the floor's row
    let armed = null;
    try {
      const clear = page.locator(".action-bar button", { hasText: /^clear$/ }).first();
      await clear.click({ force: true });
      await page.waitForTimeout(700);
      armed = await page.evaluate(() => {
        const g = document.querySelector('[role="group"], .guard-row, .guard-ribbon');
        const btns = [...document.querySelectorAll('[role="group"] button, .guard-row button, .guard-ribbon button')];
        const card = document.querySelector(".controls-card");
        return {
          found: !!g,
          groupName: g?.getAttribute("aria-label") || g?.textContent?.replace(/\s+/g, " ").trim().slice(0, 40) || null,
          cardH: card ? +card.getBoundingClientRect().height.toFixed(2) : null,
          cardFits: card ? card.scrollHeight <= card.clientHeight : null,
          verbs: btns.map((b) => ({
            t: b.innerText.replace(/\s+/g, " ").trim().slice(0, 14),
            ...window.__inkOn(b.querySelector("span, .guard-word") || b),
            faceBg: (() => { const f = b.querySelector(".guard-face, .act-face") || b; return getComputedStyle(f).backgroundColor; })(),
            box: (({ width, height }) => ({ w: +width.toFixed(2), h: +height.toFixed(2) }))(b.getBoundingClientRect()),
          })),
        };
      });
    } catch (e) { armed = { error: String(e).slice(0, 120) }; }

    out[`${engine}-${scheme}`] = { ...base, armed };
    await browser.close();
  }
}
writeFileSync("/tmp/crit-contrast.json", JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
