/**
 * T9-W7 pass 3 · CTRL-FACE · THE CRITIC'S OWN READ.
 *   node crit-face.mjs <baseURL> <tag> <outJson>
 * Re-runs, independently: the caption lane (incl. the COLUMN alignment the file's own comment
 * promises), contrast on both themes with alpha compositing over the real ground, the printed
 * count, the chip tap floor, and the shut-tab ink rank.
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const [BASE, TAG, OUT] = process.argv.slice(2);

const CELLS = [
  { id: "320", w: 320, h: 568, coarse: true },
  { id: "375", w: 375, h: 812, coarse: true },
  { id: "390", w: 390, h: 844, coarse: true },
  { id: "430", w: 430, h: 932, coarse: true },
  { id: "desk1280", w: 1280, h: 800, coarse: false },
];

const PROBE = () => {
  const px = (n) => Math.round(n * 100) / 100;
  const cs = (el) => getComputedStyle(el);
  const card = document.querySelector(".controls-card");
  if (!card) return { err: "no card" };

  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const lum = (c) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => {
    const L1 = lum(a), L2 = lum(b);
    return px(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) * 100) / 100;
  };
  // the effective ground: walk up compositing every non-transparent background
  const groundOf = (el) => {
    let stack = [];
    let n = el;
    while (n && n !== document.documentElement) {
      const bg = parse(cs(n).backgroundColor);
      if (bg && bg.a > 0) stack.push(bg);
      n = n.parentElement;
    }
    const root = parse(cs(document.documentElement).backgroundColor) ||
      parse(cs(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
    let acc = root.a > 0 ? root : { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) acc = over(stack[i], acc);
    return acc;
  };
  const contrast = (el) => {
    const fg = parse(cs(el).color);
    const bg = groundOf(el);
    return {
      ratio: ratio(over(fg, bg), bg),
      color: cs(el).color,
      size: px(parseFloat(cs(el).fontSize)),
      weight: cs(el).fontWeight,
      face: cs(el).fontFamily.split(",")[0].replace(/["']/g, "").trim(),
    };
  };

  const rows = [];
  const add = (sel, label, root = card) => {
    for (const el of root.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      rows.push({ sel: label, text: (el.textContent || "").trim().slice(0, 24), ...contrast(el) });
    }
  };
  add(".section-heading", ".section-heading");
  add(".heading-value", ".heading-value");
  add(".zone-row-label", ".zone-row-label");
  add(".washi-tag", ".washi-tag");
  add(".ctrl-btn", ".ctrl-btn");
  add(".icon-sublabel", ".icon-sublabel");

  // ── the caption COLUMN: does every caption still end on one edge, and every chip
  //    group still start on one axis? (the rule .zone-row's own comment states)
  const caps = [...card.querySelectorAll(".zone-row-label")].map((c) => {
    const r = c.getBoundingClientRect();
    const o = c.parentElement.querySelector(".options-row");
    const ob = o ? o.getBoundingClientRect() : null;
    const lh = parseFloat(cs(c).lineHeight);
    return {
      text: c.textContent.trim(),
      boxW: px(r.width),
      declaredBasis: cs(c).flexBasis,
      minWidth: cs(c).minWidth,
      right: px(r.right),
      left: px(r.left),
      h: px(r.height),
      lines: px(r.height / lh),
      lineHeight: px(lh),
      rowH: px(c.parentElement.getBoundingClientRect().height),
      optionsLeft: ob ? px(ob.left) : null,
      optionsW: ob ? px(ob.width) : null,
      chips: c.parentElement.querySelectorAll(".ctrl-btn").length,
      beside: ob ? ob.top < r.bottom - 1 && r.top < ob.bottom - 1 : null,
      overflowsBox: px(c.scrollWidth) > px(r.width) + 0.5,
    };
  });

  // ── printed count derivation
  const tapes = card.querySelectorAll(".washi-tag").length;
  const captions = card.querySelectorAll(".zone-row-label").length;
  const heads = card.querySelectorAll(".section-heading").length;
  const printedVoices = {};
  for (const el of [
    ...card.querySelectorAll(".washi-tag"),
    ...card.querySelectorAll(".zone-row-label"),
    ...card.querySelectorAll(".section-heading"),
  ]) {
    const s = cs(el);
    const k = [
      s.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      px(parseFloat(s.fontSize)),
      s.fontWeight,
      s.textTransform,
    ].join(" · ");
    printedVoices[k] = (printedVoices[k] ?? 0) + 1;
  }

  // ── chip tap floor + the word's paint box vs the chip's
  const chipRows = [...card.querySelectorAll(".ctrl-btn")].slice(0, 12).map((b) => {
    const r = b.getBoundingClientRect();
    const w = b.querySelector(".ctrl-word");
    const wr = w ? w.getBoundingClientRect() : null;
    return {
      text: (b.textContent || "").trim().slice(0, 12),
      w: px(r.width),
      h: px(r.height),
      pressed: b.getAttribute("aria-pressed"),
      face: cs(b).fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      weight: cs(b).fontWeight,
      transform: cs(b).textTransform,
      markSize: w ? cs(w).backgroundSize : null,
      wordOverflowsChipLeft: wr ? px(r.left - wr.left) : null,
      wordOverflowsChipRight: wr ? px(wr.right - r.right) : null,
    };
  });

  // ── card box, for overflow
  const cr = card.getBoundingClientRect();
  return {
    rows,
    caps,
    counts: { tapes, captions, heads, printed: tapes + captions + heads, printedVoices },
    chipRows,
    card: { left: px(cr.left), right: px(cr.right), w: px(cr.width), h: px(cr.height) },
    scrollW: px(document.documentElement.scrollWidth),
    innerW: window.innerWidth,
  };
};

const out = [];
for (const [name, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await type.launch();
  for (const theme of ["light", "dark"]) {
    for (const cell of CELLS) {
      const ctx = await b.newContext({
        viewport: { width: cell.w, height: cell.h },
        deviceScaleFactor: 2,
        hasTouch: cell.coarse,
        isMobile: cell.coarse && name === "chromium",
        colorScheme: theme,
      });
      const p = await ctx.newPage();
      try {
        await p.goto(`${BASE}/?size=3&difficulty=EASY`, { waitUntil: "load", timeout: 40000 });
        await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
        const start = p.locator("button", { hasText: /play|start|new game/i }).first();
        if (await start.count()) {
          await start.click({ timeout: 5000 }).catch(() => {});
          await p.waitForTimeout(900);
        }
        const tab = p.locator(".drawer-tab").first();
        if (await tab.count()) {
          const vis = await tab.isVisible().catch(() => false);
          if (vis) {
            await tab.click({ timeout: 5000 }).catch(() => {});
            await p.waitForTimeout(900);
          }
        }
        await p.waitForSelector(".controls-card", { timeout: 20000 });
        await p.waitForTimeout(800);
        const r = await p.evaluate(PROBE);
        out.push({ engine: name, theme, cell: cell.id, ...r });
      } catch (e) {
        out.push({ engine: name, theme, cell: cell.id, err: String(e).slice(0, 160) });
      }
      await ctx.close();
    }
  }
  await b.close();
}
writeFileSync(OUT, JSON.stringify({ tag: TAG, base: BASE, out }, null, 1));
console.log("done", OUT, out.length);
