// T9-W7 pass1 · CTRL-RULE — BASELINE. The card at HEAD, three cells, both engines.
// Read-only. `node base.mjs` with a dev server on 127.0.0.1:4231.
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE || "http://127.0.0.1:4231/";

const CELLS = [
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
  { name: "dock-390x844", w: 390, h: 844, mobile: true },
  { name: "land-900x500", w: 900, h: 500, mobile: true },
  { name: "rail-1440x900", w: 1440, h: 900, mobile: false },
];

async function board(engine, cell, dark = false) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    isMobile: cell.mobile && engine === "chromium" ? true : undefined,
    hasTouch: cell.mobile,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light");
    } catch {}
  }, dark);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1400);
  // open the sheet if it is shut (the dock poses)
  const shut = await page.evaluate(() =>
    document.documentElement.classList.contains("drawer-closed"),
  );
  if (shut) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES
  }
  return { browser, page };
}

const READ = () => {
  const px = (v) => +parseFloat(v).toFixed(2);
  const box = (el) => {
    const b = el.getBoundingClientRect();
    return { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) };
  };
  const card = document.querySelector(".controls-card");
  const wrap = document.querySelector(".control-panel-wrap");
  const cs = (el) => getComputedStyle(el);
  const voice = (el) => {
    const c = cs(el);
    return [
      c.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      px(c.fontSize),
      c.fontWeight,
      c.textTransform,
    ].join(" · ");
  };

  const names = [];
  for (const [sel, kind] of [
    [".section-heading", "staged eyebrow"],
    [".tray-well > .washi-tag", "compartment tape"],
    [".zone-row-label", "row caption"],
  ]) {
    for (const el of card.querySelectorAll(sel)) {
      names.push({
        kind,
        text: el.innerText.replace(/\s+/g, " ").trim(),
        voice: voice(el),
        box: box(el),
        rank: el.closest("h1,h2,h3,h4,h5,h6")?.tagName ?? "—",
      });
    }
  }

  // option rows: intrinsic width of the chip row and of each chip
  const rows = [...card.querySelectorAll(".options-row")].map((r) => ({
    box: box(r),
    scrollW: +r.scrollWidth.toFixed(2),
    chips: [...r.querySelectorAll(".ctrl-btn")].map((c) => ({
      t: c.innerText.trim(),
      w: +c.getBoundingClientRect().width.toFixed(2),
      h: +c.getBoundingClientRect().height.toFixed(2),
      fs: px(cs(c).fontSize),
    })),
    hidden: r.getBoundingClientRect().width === 0,
  }));

  const wells = [...card.querySelectorAll(".tray-well")].map((w) => ({
    tag: (w.querySelector(".washi-tag")?.textContent || "?").trim(),
    box: box(w),
    strokeW: w.querySelector(":scope > .outline-svg")
      ? +cs(w.querySelector(":scope > .outline-svg").querySelector("path") || w).strokeWidth ||
        (w.querySelector(":scope > .outline-svg").querySelector("path")?.getAttribute("stroke-width") ?? null)
      : null,
    pad: cs(w).padding,
    margin: cs(w).marginBlockStart + " / " + cs(w).marginBlockEnd,
  }));

  const bar = card.querySelector(".action-bar");
  const barCs = cs(bar);
  let barWorst = 0, barWho = null;
  const bb = bar.getBoundingClientRect();
  for (const w of card.querySelectorAll(".tray-well")) {
    const wb = w.getBoundingClientRect();
    const ov =
      Math.max(0, Math.min(wb.bottom, bb.bottom) - Math.max(wb.top, bb.top)) *
      Math.max(0, Math.min(wb.right, bb.right) - Math.max(wb.left, bb.left));
    const f = ov / Math.max(1, wb.width * wb.height);
    if (f > barWorst) { barWorst = f; barWho = (w.querySelector(".washi-tag")?.textContent || "?").trim(); }
  }

  const root = getComputedStyle(document.documentElement);
  const tok = {};
  for (const t of [
    "--type-group-title", "--type-option", "--type-tag", "--type-act", "--type-verb",
    "--type-tool", "--type-small", "--type-caption", "--type-subheading", "--type-heading",
    "--ink-press-rule", "--ink-press-quiet", "--tap-floor", "--icon-verb", "--icon-tool", "--icon-act",
  ]) tok[t] = root.getPropertyValue(t).trim();

  const tabs = [...card.querySelectorAll(".mobile-heading-btn")].map((b) => ({
    t: b.innerText.replace(/\s+/g, " ").trim(), box: box(b),
  }));
  const hiddenPanels = [...card.querySelectorAll(".control-panel-filtered .options-row")].filter(
    (r) => r.getBoundingClientRect().width === 0,
  ).length;

  return {
    card: {
      box: box(card),
      scrollH: +card.scrollHeight.toFixed(2),
      clientH: +card.clientHeight.toFixed(2),
      overflow: +(card.scrollHeight - card.clientHeight).toFixed(2),
      fracBelow: +(1 - card.clientHeight / card.scrollHeight).toFixed(4),
      pad: cs(card).padding,
      overflowY: cs(card).overflowY,
    },
    wrapW: wrap ? +wrap.getBoundingClientRect().width.toFixed(2) : null,
    names,
    voices: [...new Set(names.map((n) => n.voice))],
    docHeadings: names.filter((n) => n.rank !== "—").length,
    rows,
    wells,
    bar: {
      box: box(bar),
      position: barCs.position,
      border: barCs.borderTopWidth,
      shadow: barCs.boxShadow,
      z: barCs.zIndex,
      worstWellCoverage: +barWorst.toFixed(4),
      worstWho: barWho,
    },
    tabs,
    hiddenOptionRows: hiddenPanels,
    tok,
    deal: (() => {
      const d = card.querySelector(".deal-btn");
      return d ? { box: box(d), sublabel: d.querySelector(".icon-sublabel")?.textContent?.trim() } : null;
    })(),
    tongue: (() => {
      const t = document.querySelector(".drawer-tab");
      return t ? box(t) : null;
    })(),
  };
};

const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    const { browser, page } = await board(engine, cell);
    try {
      out[`${cell.name}-${engine}`] = await page.evaluate(READ);
    } catch (e) {
      out[`${cell.name}-${engine}`] = { error: String(e) };
    }
    await browser.close();
  }
}
writeFileSync(join(HERE, "..", "base-head.json"), JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out)) {
  if (v.error) { console.log(k, "ERROR", v.error); continue; }
  console.log(
    `${k}: card ${v.card.scrollH}/${v.card.clientH} (over ${v.card.overflow}, ${(v.card.fracBelow * 100).toFixed(1)}% below) · wrap ${v.wrapW} · voices ${v.voices.length} · headings ${v.docHeadings}/${v.names.length} · hiddenRows ${v.hiddenOptionRows} · bar ${v.bar.position} cover ${(v.bar.worstWellCoverage * 100).toFixed(1)}% (${v.bar.worstWho})`,
  );
}
console.log("banked base-head.json");
