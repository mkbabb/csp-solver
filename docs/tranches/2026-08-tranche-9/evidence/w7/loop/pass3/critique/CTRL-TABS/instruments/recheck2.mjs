import { chromium, webkit } from "playwright";
import fs from "node:fs";
const PROTO = "http://127.0.0.1:4241/";
const HEAD = "http://127.0.0.1:4242/";
const SETTLE = 950;
const OUT = process.argv[2];

const coarseProbe = () => {
  const f = (n) => (n == null ? null : +n.toFixed(2));
  const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { w: f(b.width), h: f(b.height), x: f(b.x), y: f(b.y), bottom: f(b.bottom) }; };
  const tools = [...document.querySelectorAll(".play-controls button, #fold-tools button")].map((e) => {
    const b = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    return { label: (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 18), w: f(b.width), h: f(b.height), x: f(b.x), y: f(b.y), vis: cs.visibility, disp: cs.display };
  });
  // is each tool inside the viewport and not covered?
  const inView = tools.map((t) => t.w > 0 && t.x >= 0 && t.y >= 0 && t.x + t.w <= innerWidth && t.y + t.h <= innerHeight);
  const el = (x, y) => { const e = document.elementFromPoint(x, y); return e ? (e.closest("button")?.getAttribute("aria-label") || e.tagName + "." + String(e.className).slice(0, 18)) : null; };
  const hit = tools.map((t) => (t.w > 0 ? el(t.x + t.w / 2, t.y + t.h / 2) : null));
  return {
    pointerCoarse: matchMedia("(pointer: coarse)").matches,
    playControls: r(".play-controls"),
    boardEdge: r("#board-edge"),
    edgeToolsBerth: !!document.querySelector("#board-edge-tools"),
    tools, inView, hit,
    tongue: r(".drawer-tab"),
    paper: r(".board-wrapper"),
  };
};

const CONTRAST = () => {
  const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const parse = (s) => { const m = s.match(/[\d.]+/g); if (!m) return null; const a = m.length > 3 ? +m[3] : 1; return { rgb: [+m[0], +m[1], +m[2]], a }; };
  const over = (fg, bg) => fg.rgb.map((v, i) => v * fg.a + bg[i] * (1 - fg.a));
  const bgOf = (el) => { let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0.95) return c.rgb; n = n.parentElement; } const c = parse(getComputedStyle(document.body).backgroundColor); return c ? c.rgb : [255, 255, 255]; };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return +(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05))).toFixed(2); };
  const out = [];
  const sel = [
    [".tab.is-raised .tab-word", "raised tab word"],
    [".tab:not(.is-raised) .tab-word", "quiet tab word"],
    [".zone-row-label", "row caption"],
    [".action-verbs .act-face", "floor verb face"],
    [".act-danger, .is-danger, .act-face.is-destructive", "destructive"],
    [".icon-sublabel", "icon sublabel"],
    [".option-chip", "chip"],
    [".option-chip[aria-checked='false'], .option-chip:not([aria-checked='true'])", "chip unselected"],
  ];
  for (const [s, name] of sel) {
    for (const el of [...document.querySelectorAll(s)].slice(0, 2)) {
      const cs = getComputedStyle(el);
      const fg = parse(cs.color); if (!fg) continue;
      const bg = bgOf(el);
      const eff = over(fg, bg);
      out.push({ name, sel: s, color: cs.color, opacity: cs.opacity, size: cs.fontSize, weight: cs.fontWeight, bg: bg.join(","), ratio: ratio(eff, bg) });
    }
  }
  return out;
};

const galleryPi = () => {
  const f = (n) => +n.toFixed(2);
  return [...document.querySelectorAll("[id^='gallery-card-'], .game-card-name")].map((e) => {
    const b = e.getBoundingClientRect();
    return { id: e.id || e.className, x: f(b.x), y: f(b.y), w: f(b.width), h: f(b.height) };
  });
};

async function run(engine, name, out) {
  const browser = await engine.launch();
  // COARSE contexts — the pose .play-controls actually ships in
  for (const [w, h] of [[390, 844], [844, 390], [900, 500], [812, 375]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: name === "chromium" ? true : undefined });
    const page = await ctx.newPage();
    for (const [tag, url] of [["proto", PROTO], ["head", HEAD]]) {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(SETTLE);
      out.coarse.push({ engine: name, cell: `${w}x${h}`, tree: tag, ...(await page.evaluate(coarseProbe)) });
    }
    await ctx.close();
    console.log(name, "coarse", w + "x" + h, "done");
  }
  // CONTRAST, both themes, phone + desk
  for (const [w, h] of [[390, 844], [1280, 800]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(PROTO, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(SETTLE);
    for (const theme of ["light", "dark"]) {
      await page.evaluate((t) => { document.documentElement.classList.toggle("dark", t === "dark"); }, theme);
      await page.waitForTimeout(250);
      out.contrast.push({ engine: name, cell: `${w}x${h}`, theme, rows: await page.evaluate(CONTRAST) });
    }
    await ctx.close();
    console.log(name, "contrast", w + "x" + h, "done");
  }
  // GALLERY pi
  for (const [w, h] of [[390, 844], [1280, 800]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    for (const [tag, url] of [["proto", PROTO], ["head", HEAD]]) {
      await page.goto(url + "#/", { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(SETTLE);
      out.gallery.push({ engine: name, cell: `${w}x${h}`, tree: tag, rects: await page.evaluate(galleryPi) });
    }
    await ctx.close();
    console.log(name, "gallery", w + "x" + h, "done");
  }
  await browser.close();
}
const out = { coarse: [], contrast: [], gallery: [] };
await run(chromium, "chromium", out);
await run(webkit, "webkit", out);
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("EXIT OK");
