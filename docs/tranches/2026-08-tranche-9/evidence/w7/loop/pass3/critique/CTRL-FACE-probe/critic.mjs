/** T9-W7 pass 3 · CTRL-FACE · the CRITIC's own re-run. Read-only on product files. */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const [BASE, OUT, TAG] = process.argv.slice(2);
const CELLS = [
  { id: "1280f", w: 1280, h: 800, coarse: false, scheme: "light" },
  { id: "390c", w: 390, h: 844, coarse: true, scheme: "light" },
  { id: "390c-dark", w: 390, h: 844, coarse: true, scheme: "dark" },
  { id: "320c", w: 320, h: 568, coarse: true, scheme: "light" },
  { id: "768x1024c", w: 768, h: 1024, coarse: true, scheme: "light" },
];

const PROBE = () => {
  const px = (n) => Math.round(n * 100) / 100;
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { x: px(r.x), y: px(r.y), w: px(r.width), h: px(r.height), r: px(r.right) };
  };
  const inkBox = (el) => {
    const rg = document.createRange();
    rg.selectNodeContents(el);
    const r = rg.getBoundingClientRect();
    return { x: px(r.x), y: px(r.y), w: px(r.width), h: px(r.height), r: px(r.right) };
  };
  const voice = (el) => {
    const s = getComputedStyle(el);
    return [
      s.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      px(parseFloat(s.fontSize)),
      s.fontWeight,
      s.textTransform,
      s.whiteSpace,
      s.lineHeight,
    ].join(" | ");
  };
  // ── composited colour, the alpha-aware way ────────────────────────────────
  const parse = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const bgOf = (el) => {
    let acc = null;
    let n = el;
    while (n && n.nodeType === 1) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) acc = acc ? over(acc, c) : c;
      if (acc && acc.a >= 0.999) break;
      n = n.parentElement;
    }
    if (!acc) acc = { r: 255, g: 255, b: 255, a: 1 };
    if (acc.a < 1) acc = over(acc, { r: 255, g: 255, b: 255, a: 1 });
    return acc;
  };
  const lum = (c) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
  };
  const contrast = (el) => {
    const fgRaw = parse(getComputedStyle(el).color);
    if (!fgRaw) return { ratio: null, raw: getComputedStyle(el).color };
    const bg = bgOf(el);
    const fg = fgRaw.a < 1 ? over(fgRaw, bg) : fgRaw;
    const op = parseFloat(getComputedStyle(el).opacity);
    return { ratio: ratio(fg, bg), opacity: op, fg: getComputedStyle(el).color };
  };

  const card = document.querySelector(".controls-card") || document.querySelector("[class*='controls-card']");
  const cs = card ? getComputedStyle(card) : null;
  const caps = [...document.querySelectorAll(".zone-row-label")];
  const heads = [...document.querySelectorAll(".mobile-heading-btn")];
  const chips = [...document.querySelectorAll(".tray-well .ctrl-btn")];
  const tapes = [...document.querySelectorAll(".tray-well .washi-tag")];
  const vals = [...document.querySelectorAll(".heading-value")];
  const deckLabels = [...document.querySelectorAll(".staging-axis-label")];

  return {
    card: card
      ? {
          ...box(card),
          padL: cs.paddingLeft,
          contentL: px(card.getBoundingClientRect().x + parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth)),
        }
      : null,
    caps: caps.map((c) => ({
      t: c.textContent.trim(),
      b: box(c),
      ink: inkBox(c),
      v: voice(c),
      c: contrast(c),
      row: box(c.parentElement),
      sib: c.nextElementSibling ? box(c.nextElementSibling) : null,
    })),
    heads: heads.map((h) => ({
      open: h.getAttribute("aria-expanded"),
      name: h.querySelector(".section-heading")?.textContent.trim(),
      nameV: h.querySelector(".section-heading") ? voice(h.querySelector(".section-heading")) : null,
      nameC: h.querySelector(".section-heading") ? contrast(h.querySelector(".section-heading")) : null,
      nameCls: h.querySelector(".section-heading")?.className,
      val: h.querySelector(".heading-value")?.textContent.trim() ?? null,
      valV: h.querySelector(".heading-value") ? voice(h.querySelector(".heading-value")) : null,
      valC: h.querySelector(".heading-value") ? contrast(h.querySelector(".heading-value")) : null,
      valCls: h.querySelector(".heading-value")?.className ?? null,
    })),
    vals: vals.map((v) => ({ t: v.textContent.trim(), c: contrast(v), cls: v.className })),
    chips: chips.map((c) => ({
      t: c.textContent.trim(),
      b: box(c),
      v: voice(c),
      c: contrast(c),
      sel: c.getAttribute("aria-pressed"),
    })),
    tapes: tapes.map((t) => ({ t: t.textContent.trim(), b: box(t), v: voice(t), c: contrast(t) })),
    deck: deckLabels.map((d) => ({ t: d.textContent.trim(), v: voice(d), cls: d.className })),
    filters: document.querySelectorAll("filter").length,
  };
};

async function run(engine, name) {
  const b = await engine.launch();
  const rows = [];
  for (const c of CELLS) {
    const ctx = await b.newContext({
      viewport: { width: c.w, height: c.h },
      hasTouch: c.coarse,
      isMobile: c.coarse && name === "chromium",
      deviceScaleFactor: 2,
      colorScheme: c.scheme,
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
        const touch = await p.evaluate(
          () => "ontouchstart" in window || navigator.maxTouchPoints > 0,
        );
        await (touch ? tab.tap() : tab.click());
        await p.waitForTimeout(900);
      }
      await vis.waitFor({ state: "visible", timeout: 20000 });
      await p.waitForTimeout(800);
      rows.push({ engine: name, cell: c.id, ...(await p.evaluate(PROBE)) });
    } catch (e) {
      rows.push({ engine: name, cell: c.id, err: String(e).slice(0, 220) });
    }
    await ctx.close();
  }
  await b.close();
  return rows;
}

const all = [...(await run(chromium, "chromium")), ...(await run(webkit, "webkit"))];
writeFileSync(OUT, all.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log(`${TAG}: ${all.length} rows -> ${OUT}`);
