// T9-W7 pass1 · CTRL-RULE — the closing readings: the bar as the case's foot (geometry done
// right), the seam UNDER the overlay, access 2.1/2.2/2.3, the draw-on cost, the tongue's
// quick set, and the level tap count.
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE || "http://127.0.0.1:4231/";
const PROTO = readFileSync(join(HERE, "..", "proto", "ruled-page.js"), "utf8");
const out = {};

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
    try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light"); } catch {}
  }, dark);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1400);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  return { browser, page };
}
const apply = async (page, opts) => {
  await page.addScriptTag({ type: "module", content: PROTO });
  await page.waitForFunction(() => !!window.__rp, { timeout: 15000 });
  const r = await page.evaluate((o) => window.__rp(o), opts);
  await page.waitForTimeout(400);
  return r;
};

/* 1 · THE BAR AS THE CASE'S FOOT — the scrollport shortened by the bar's own band */
const footPatch = async (page) =>
  page.evaluate(async () => {
    const card = document.querySelector(".controls-card");
    const bar = document.querySelector(".action-bar");
    const caseEl = card.parentElement;
    const barH = Math.ceil(bar.getBoundingClientRect().height);
    const caseH = caseEl.getBoundingClientRect().height;
    caseEl.style.setProperty("padding-bottom", `${barH}px`, "important");
    caseEl.style.setProperty("box-sizing", "border-box", "important");
    card.style.setProperty("max-height", `${Math.round(caseH - barH)}px`, "important");
    card.style.setProperty("height", `${Math.round(caseH - barH)}px`, "important");
    await new Promise((r) => setTimeout(r, 200));
    return { barH, caseH };
  });

for (const engine of ["chromium", "webkit"]) {
  for (const cell of [
    { name: "dock-390x844", w: 390, h: 844, mobile: true },
    { name: "land-900x500", w: 900, h: 500, mobile: true },
    { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
  ]) {
    const { browser, page } = await board(engine, cell);
    await apply(page, { arm: "above", release: true, barOut: true });
    const patched = await footPatch(page);
    const r = await page.evaluate(async () => {
      const card = document.querySelector(".controls-card");
      const bar = document.querySelector(".action-bar");
      const cs = getComputedStyle(bar);
      const own = parseFloat(cs.borderTopWidth) > 0 || cs.outlineStyle !== "none" ||
        cs.boxShadow !== "none" || !!bar.querySelector(":scope > .outline-container, :scope > svg.outline-svg");
      const states = [];
      const max = Math.max(0, card.scrollHeight - card.clientHeight);
      for (const st of [0, Math.round(max / 2), max]) {
        card.scrollTop = st;
        await new Promise((r2) => setTimeout(r2, 220));
        const bb = bar.getBoundingClientRect();
        let worst = 0, who = null;
        for (const g of document.querySelectorAll(".rp-group")) {
          const gb = g.getBoundingClientRect();
          const ov = Math.max(0, Math.min(gb.bottom, bb.bottom) - Math.max(gb.top, bb.top)) *
                     Math.max(0, Math.min(gb.right, bb.right) - Math.max(gb.left, bb.left));
          const f = ov / Math.max(1, gb.width * gb.height);
          if (f > worst) { worst = f; who = g.dataset.group; }
        }
        states.push({ at: card.scrollTop, worst: +worst.toFixed(4), who });
      }
      card.scrollTop = 0;
      const bb = bar.getBoundingClientRect(), cb = card.getBoundingClientRect();
      return { own, states, bar: [+bb.y.toFixed(1), +bb.height.toFixed(1)],
               card: [+cb.y.toFixed(1), +cb.height.toFixed(1)],
               scrollH: card.scrollHeight, clientH: card.clientHeight,
               gap: +(bb.top - cb.bottom).toFixed(2) };
    });
    out[`foot-${cell.name}-${engine}`] = { ...r, patched };
    console.log(`foot ${cell.name} ${engine}: own=${r.own} card ${JSON.stringify(r.card)} ${r.scrollH}/${r.clientH} bar ${JSON.stringify(r.bar)} gap ${r.gap} · coverage ${r.states.map((s) => `${s.at}:${(s.worst * 100).toFixed(1)}%`).join(" ")}`);
    await browser.close();
  }
}

/* 2 · THE SEAM UNDER THE OVERLAY — does a taller card push the case into the wordmark? */
for (const engine of ["chromium", "webkit"]) {
  for (const cell of [
    { name: "375x812", w: 375, h: 812, mobile: true },
    { name: "390x844", w: 390, h: 844, mobile: true },
    { name: "430x932", w: 430, h: 932, mobile: true },
  ]) {
    const { browser, page } = await board(engine, cell);
    const before = await page.evaluate(() => {
      const svg = document.querySelector(".drawer-case > svg.outline-svg");
      const wm = document.querySelector("svg.handwritten-logo");
      return svg && wm ? +(svg.getBoundingClientRect().top - wm.getBoundingClientRect().bottom).toFixed(2) : null;
    });
    await apply(page, { arm: "above", release: true, barOut: true });
    await footPatch(page);
    const after = await page.evaluate(() => {
      const svg = document.querySelector(".drawer-case > svg.outline-svg");
      const wm = document.querySelector("svg.handwritten-logo");
      const caseEl = document.querySelector(".drawer-case");
      const card = document.querySelector(".controls-card");
      return {
        clearance: svg && wm ? +(svg.getBoundingClientRect().top - wm.getBoundingClientRect().bottom).toFixed(2) : null,
        caseTop: +caseEl.getBoundingClientRect().top.toFixed(2),
        caseH: +caseEl.getBoundingClientRect().height.toFixed(2),
        sheetChrome: getComputedStyle(document.querySelector(".scene-controls")).getPropertyValue("--sheet-chrome"),
        scroll: [card.scrollHeight, card.clientHeight],
      };
    });
    out[`seam3-${cell.name}-${engine}`] = { before, after };
    console.log(`seam(overlay) ${cell.name} ${engine}: before ${before} → after ${after.clearance} · caseTop ${after.caseTop} h ${after.caseH} · chrome ${after.sheetChrome} · card ${after.scroll}`);
    await browser.close();
  }
}

/* 3 · ACCESS 2.1 / 2.2 / 2.3 against the overlay, plus the level tap count and the floor */
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true });
  await apply(page, { arm: "above", release: true, barOut: true });
  await footPatch(page);
  const r = await page.evaluate(async () => {
    const card = document.querySelector(".controls-card");
    const vis = (el) => {
      const b = el.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      const inter = Math.max(0, Math.min(b.bottom, c.bottom) - Math.max(b.top, c.top)) *
                    Math.max(0, Math.min(b.right, c.right) - Math.max(b.left, c.left));
      return b.width * b.height ? inter / (b.width * b.height) : 0;
    };
    // 2.1 — no control focuses into a >=96% burial
    const buried = [];
    for (const el of card.querySelectorAll("button, [tabindex]:not([tabindex='-1']), a[href]")) {
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) continue;
      el.focus();
      await new Promise((r2) => setTimeout(r2, 40));
      const f = vis(el);
      if (f <= 0.04) buried.push({ t: (el.textContent || el.getAttribute("aria-label") || "?").trim().slice(0, 20), vis: +f.toFixed(3) });
    }
    // 2.2 — no covered control in the drawer subtree stays tabbable
    const drawer = document.querySelector(".scene-controls");
    const tabbables = [...drawer.querySelectorAll("button, [tabindex]:not([tabindex='-1']), a[href]")]
      .filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; });
    // 2.3 — sublabel / chip text ratios come from painted bytes in the contrast run; here the
    // structural half: every chip carries a name and a pressed state
    const chips = [...card.querySelectorAll(".ctrl-btn")];
    const unnamed = chips.filter((c) => !c.textContent.trim()).length;
    const unpressed = chips.filter((c) => !c.hasAttribute("aria-pressed")).length;
    // the level tap count from the open sheet: the options are never hidden now
    const lvl = [...card.querySelectorAll('.rp-group[data-group="level"] .ctrl-btn')];
    const floor = [];
    for (const b of card.querySelectorAll("button")) {
      const x = b.getBoundingClientRect();
      if (!x.width) continue;
      if (x.width < 44 || x.height < 44)
        floor.push({ t: (b.textContent || b.getAttribute("aria-label") || "?").trim().slice(0, 18), w: +x.width.toFixed(1), h: +x.height.toFixed(1) });
    }
    return {
      buried, tabbables: tabbables.length, chips: chips.length, unnamed, unpressed,
      levelOptions: lvl.length, levelTapsFromOpenSheet: lvl.length ? 1 : null,
      under44: floor,
      headings: [...card.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => h.textContent.trim()),
    };
  });
  out[`access-390-${engine}`] = r;
  console.log(`access 390 ${engine}: 2.1 buried ${r.buried.length} ${JSON.stringify(r.buried)} · 2.2 tabbable-in-drawer ${r.tabbables} · chips ${r.chips} unnamed ${r.unnamed} unpressed ${r.unpressed} · level opts ${r.levelOptions} taps ${r.levelTapsFromOpenSheet} · under44 ${JSON.stringify(r.under44)} · headings ${JSON.stringify(r.headings)}`);
  await browser.close();
}

/* 4 · THE DRAW-ON COST at mount, and the tongue's quick set */
for (const engine of ["chromium", "webkit"]) {
  for (const drawOn of [true, false]) {
    const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true });
    const t0 = Date.now();
    await page.addScriptTag({ type: "module", content: PROTO });
    await page.waitForFunction(() => !!window.__rp, { timeout: 15000 });
    const timing = await page.evaluate(async (d) => {
      const t = performance.now();
      await window.__rp({ arm: "above", release: true, barOut: true, drawOn: d });
      const built = performance.now() - t;
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const longs = performance.getEntriesByType("longtask")?.length ?? null;
      let filters = 0;
      document.querySelectorAll("*").forEach((e) => {
        const cs = getComputedStyle(e);
        if (cs.filter !== "none" && cs.display !== "none") filters++;
      });
      return { buildMs: +built.toFixed(1), longs, filters,
               rules: document.querySelectorAll(".rp-rule").length,
               animated: [...document.querySelectorAll(".rp-rule path")].filter((p) => p.classList.contains("pencil-draw-on")).length };
    }, drawOn);
    out[`drawon-${drawOn}-${engine}`] = { ...timing, wallMs: Date.now() - t0 };
    console.log(`draw-on=${drawOn} ${engine}: build ${timing.buildMs}ms · rules ${timing.rules} animated ${timing.animated} · filters ${timing.filters}`);
    await browser.close();
  }
}

/* 5 · THE TONGUE — what fits on 92x48 */
for (const engine of ["chromium"]) {
  const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true });
  await page.evaluate(() => { document.querySelector(".drawer-tab")?.click(); });
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => {
    const t = document.querySelector(".drawer-tab");
    const b = t?.getBoundingClientRect();
    const word = t?.querySelector(".washi-label, .drawer-tab-word, span");
    const wb = word?.getBoundingClientRect();
    const board = document.querySelector(".sudoku-board, .board-paper, .game-board");
    const bb = board?.getBoundingClientRect();
    return {
      tongue: b ? [+b.x.toFixed(1), +b.y.toFixed(1), +b.width.toFixed(1), +b.height.toFixed(1)] : null,
      word: wb ? [+wb.width.toFixed(1), +wb.height.toFixed(1)] : null,
      wordFace: word ? getComputedStyle(word).fontSize + " " + getComputedStyle(word).fontFamily.split(",")[0] : null,
      boardW: bb ? +bb.width.toFixed(1) : null,
      freeEdge: bb && b ? +(bb.width - b.width).toFixed(1) : null,
    };
  });
  out.tongue = r;
  console.log("tongue:", JSON.stringify(r));
  await browser.close();
}

writeFileSync(join(HERE, "..", "fix4.json"), JSON.stringify(out, null, 1));
console.log("banked fix4.json");
