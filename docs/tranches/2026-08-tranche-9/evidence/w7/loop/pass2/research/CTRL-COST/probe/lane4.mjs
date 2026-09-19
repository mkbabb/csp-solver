// T9-W7 pass 2 · CTRL-COST research probe 4 — three questions probes 2 and 3 left open.
//   E   does the SECOND Enter deal? (probe 2's read was inside the 4,000ms window's shadow;
//       probe 3 read the DOM before Vue's tick). Every read below is after a rAF + 400ms, and
//       the pointer path is measured beside the keyboard path as the control.
//   X   does Escape reach anything else (does the sheet close)?
//   A   the AA arms, with the ground applied BEFORE the face arms and the ink read while the
//       word is actually shown; the composite reader gains an oklab/oklch parser, because the
//       injected arms serialize as `oklab(...)` and the pass-1 reader is blind to that.
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4235/";
const OUT = new URL("../readings/lane4.json", import.meta.url);

const HELPERS = () => {
  const oklabToSrgb = (L, a, b) => {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;
    const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
    const lin = [
      +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
    return lin.map((v) => {
      const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(Math.max(v, 0), 1 / 2.4) - 0.055;
      return Math.min(255, Math.max(0, c * 255));
    });
  };
  window.__parse = (c) => {
    let m = /^color\(srgb\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.]+))?\)$/.exec(c);
    if (m) return [+m[1] * 255, +m[2] * 255, +m[3] * 255, m[4] === undefined ? 1 : +m[4]];
    m = /^rgba?\(([^)]+)\)$/.exec(c);
    if (m) { const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]]; }
    m = /^oklab\(([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.]+))?\)$/.exec(c);
    if (m) { const rgb = oklabToSrgb(+m[1], +m[2], +m[3]); return [...rgb, m[4] === undefined ? 1 : +m[4]]; }
    m = /^oklch\(([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:deg)?(?:\s*\/\s*([\d.]+))?\)$/.exec(c);
    if (m) { const h = (+m[3] * Math.PI) / 180; const rgb = oklabToSrgb(+m[1], +m[2] * Math.cos(h), +m[2] * Math.sin(h)); return [...rgb, m[4] === undefined ? 1 : +m[4]]; }
    return null;
  };
  window.__ground = (el) => {
    const stack = []; let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      const bg = window.__parse(cs.backgroundColor);
      stack.push({ bg, op: parseFloat(cs.opacity), raw: cs.backgroundColor });
      if (bg && bg[3] === 1) break;
      n = n.parentElement;
    }
    let out = [255, 255, 255];
    for (let i = stack.length - 1; i >= 0; i--) {
      const { bg } = stack[i];
      if (bg && bg[3] > 0) { const a = bg[3]; out = [0, 1, 2].map((k) => bg[k] * a + out[k] * (1 - a)); }
    }
    return { rgb: out, chain: stack.map((s) => s.raw) };
  };
  window.__lum = (rgb) => { const f = (x) => { const v = x / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]); };
  window.__ratio = (a, b) => { const [x, y] = [window.__lum(a), window.__lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2); };
  window.__inkOn = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const ink = window.__parse(cs.color);
    const g = window.__ground(el);
    const a = ink[3] ?? 1;
    const painted = [0, 1, 2].map((k) => ink[k] * a + g.rgb[k] * (1 - a));
    return { ratio: window.__ratio(painted, g.rgb), ink: cs.color, ground: g.rgb.map((v) => +v.toFixed(1)), chain: g.chain };
  };
  window.__board = () => [...document.querySelectorAll(".cell-native-input")].map((i) => i.value || "_").join("");
  window.__armed = (sel = ".deal-btn") => !!document.querySelector(`${sel} .act-word.is-armed.is-shown`);
  window.__tick = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 400)));
};

const settle = (p, ms) => p.waitForTimeout(ms);
const out = { base: BASE, when: new Date().toISOString(), cells: {} };

for (const engine of ["chromium", "webkit"]) {
  const BT = engine === "webkit" ? webkit : chromium;
  const browser = await BT.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: engine === "chromium" ? true : undefined, colorScheme: "light" });
  const page = await ctx.newPage();
  await page.addInitScript(`try{localStorage.setItem("sudoku-color-scheme","light")}catch{}`);
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await settle(page, 1200);
  await page.locator(".drawer-tab").first().click({ force: true });
  await settle(page, 1200);
  await page.evaluate(HELPERS);

  const rec = {};
  const ensureSheet = async () => {
    const open = await page.evaluate(() => {
      const c = document.querySelector(".controls-card");
      if (!c) return false;
      const r = c.getBoundingClientRect();
      return r.height > 0 && r.top < window.innerHeight - 40;
    });
    if (!open) { await page.locator(".drawer-tab").first().click({ force: true }); await settle(page, 1300); }
    return open;
  };
  const dirty = async () => {
    await ensureSheet();
    const fill = page.locator(".controls-card button", { hasText: /^fill$/ }).first();
    if (!(await fill.count())) return;
    await page.evaluate(() => [...document.querySelectorAll(".controls-card button")].find((b) => b.textContent.trim() === "fill")?.scrollIntoView({ block: "center" }));
    await settle(page, 250);
    try { await fill.click({ force: true, timeout: 5000 }); } catch { await page.evaluate(() => [...document.querySelectorAll(".controls-card button")].find((b) => b.textContent.trim() === "fill")?.click()); }
    await settle(page, 1600);
  };
  const focusDeal = () => page.evaluate(() => { const b = document.querySelector(".deal-btn"); b.scrollIntoView({ block: "center" }); b.focus(); });

  try {
  // ── E1 · the POINTER control: two taps deal? ───────────────────────────────────────────
  await dirty();
  rec.pointer = await (async () => {
    const b0 = await page.evaluate(() => window.__board());
    const deal = page.locator(".deal-btn").first();
    try { await deal.click({ force: true, timeout: 5000 }); } catch { await page.evaluate(() => document.querySelector(".deal-btn")?.click()); }
    await page.evaluate(() => window.__tick());
    const armed1 = await page.evaluate(() => window.__armed());
    try { await deal.click({ force: true, timeout: 5000 }); } catch { await page.evaluate(() => document.querySelector(".deal-btn")?.click()); }
    await page.evaluate(() => window.__tick());
    const armed2 = await page.evaluate(() => window.__armed());
    const dealt = await page.evaluate(async (b) => {
      const t = performance.now();
      while (performance.now() - t < 9000) { if (window.__board() !== b) return { changed: true, ms: +(performance.now() - t).toFixed(0) }; await new Promise((s) => setTimeout(s, 120)); }
      return { changed: false, ms: 9000 };
    }, b0);
    return { armedAfterTap1: armed1, armedAfterTap2: armed2, dealt };
  })();

  // ── E2 · the KEYBOARD path ─────────────────────────────────────────────────────────────
  await settle(page, 800);
  await dirty();
  rec.keyboard = await (async () => {
    const b0 = await page.evaluate(() => window.__board());
    await focusDeal();
    await settle(page, 200);
    await page.keyboard.press("Enter");
    await page.evaluate(() => window.__tick());
    const armed1 = await page.evaluate(() => window.__armed());
    const active1 = await page.evaluate(() => document.activeElement?.className?.toString().slice(0, 40) || null);
    await page.keyboard.press("Enter");
    await page.evaluate(() => window.__tick());
    const armed2 = await page.evaluate(() => window.__armed());
    const dealt = await page.evaluate(async (b) => {
      const t = performance.now();
      while (performance.now() - t < 9000) { if (window.__board() !== b) return { changed: true, ms: +(performance.now() - t).toFixed(0) }; await new Promise((s) => setTimeout(s, 120)); }
      return { changed: false, ms: 9000 };
    }, b0);
    return { armedAfterEnter1: armed1, focusAfterEnter1: active1, armedAfterEnter2: armed2, dealt };
  })();

  // ── X · Escape: does it disarm, and does anything else hear it? ────────────────────────
  await settle(page, 800);
  await dirty();
  rec.escape = await (async () => {
    await focusDeal();
    await settle(page, 200);
    await page.keyboard.press("Enter");
    await page.evaluate(() => window.__tick());
    const before = await page.evaluate(() => ({ armed: window.__armed(), sheetOpen: !!document.querySelector(".controls-card"), caseTop: Math.round(document.querySelector(".drawer-case")?.getBoundingClientRect().top ?? -1) }));
    await page.keyboard.press("Escape");
    await page.evaluate(() => window.__tick());
    await settle(page, 600);
    const after = await page.evaluate(() => ({ armed: window.__armed(), sheetOpen: !!document.querySelector(".controls-card"), caseTop: Math.round(document.querySelector(".drawer-case")?.getBoundingClientRect().top ?? -1), activeEl: document.activeElement?.className?.toString().slice(0, 40) || null }));
    return { before, after };
  })();

  // ── A · the AA arms, ground applied BEFORE the arm ─────────────────────────────────────
  rec.aa = {};
  for (const [name, css] of [
    ["asSpecced_8pct", null],
    ["cureA_clearWhileAsking", ".controls-card .icon-btn:has(.act-word.is-armed.is-shown) .act-face.is-heavy{background:rgba(255,255,255,0)!important}"],
    ["cureB_4pct", ".controls-card .act-face.is-heavy{background:rgba(10,10,10,0.04)!important}"],
    ["cureC_bareCard_weightOnly", ".controls-card .act-face.is-heavy{background:rgba(255,255,255,0)!important}"],
  ]) {
    await settle(page, 900);
    await dirty();
    if (css) await page.addStyleTag({ id: "arm-" + name, content: css });
    await focusDeal();
    await settle(page, 150);
    try { await page.locator(".deal-btn").first().click({ force: true, timeout: 5000 }); } catch { await page.evaluate(() => document.querySelector(".deal-btn")?.click()); }
    await page.evaluate(() => window.__tick());
    rec.aa[name] = await page.evaluate(() => {
      const b = document.querySelector(".deal-btn");
      const word = [...b.querySelectorAll(".act-word")].find((w) => w.classList.contains("is-armed"));
      const no = b.querySelector(".act-answer");
      const face = b.querySelector(".act-face");
      const name = b.querySelector(".act-word:not(.is-armed)");
      return {
        armed: !!(word && word.classList.contains("is-shown")),
        asked: window.__inkOn(word),
        no: window.__inkOn(no),
        restWord: window.__inkOn(name),
        faceBg: getComputedStyle(face).backgroundColor,
      };
    });
    if (css) await page.evaluate((n) => document.getElementById("arm-" + n)?.remove(), name);
    // let the window lapse so the next arm starts clean
    await settle(page, 4300);
  }

  } catch (e) { rec.error = String(e).slice(0, 300); }
  out.cells[engine] = rec;
  await browser.close();
}

writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log("banked", OUT.pathname);
