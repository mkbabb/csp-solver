// T9-W7 pass 2 · CRITIQUE · CTRL-TAPE — probe 2: the rows the prototype did not build.
//  A. the LOUD-FALLBACK row (delete the publisher; is the failure loud, or is it a blank card?)
//  B. the BOOT frame (what the reader sees before the ResizeObserver's first callback)
//  C. the DECK's own tape, with StagingBand's real selector (pi)
//  D. the CROSSING measured against two reference lines (the disagreement)
//  E. the RING from painted bytes on four grounds, both themes
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, webkit } = require(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js",
);

const ENGINE = process.argv[2] || "chromium";
const BASE = process.argv[3] || "http://127.0.0.1:4233";
const launcher = ENGINE === "webkit" ? webkit : chromium;
const out = { engine: ENGINE };
const browser = await launcher.launch();

async function openSheet(page) {
  const tab = page.locator("#drawer-tab, .drawer-tab").first();
  if (await tab.count()) {
    await tab.click({ force: true }).catch(() => {});
    await page.waitForTimeout(900);
  }
}

// ── A. THE ABSENT PUBLISHER ───────────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/sudoku`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await openSheet(page);
  const before = await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    const s = document.querySelector(".scene-controls");
    return {
      maxHeight: getComputedStyle(c).maxHeight,
      clientH: c.clientHeight,
      sheetChrome: getComputedStyle(s).getPropertyValue("--sheet-chrome").trim(),
      sheetTop: +s.getBoundingClientRect().top.toFixed(2),
      caseH: +document.querySelector(".drawer-case").getBoundingClientRect().height.toFixed(2),
    };
  });
  const after = await page.evaluate(() => {
    // the publisher never ran: strip BOTH published terms, exactly as a boot frame has them
    document.documentElement.style.removeProperty("--masthead-foot");
    document.documentElement.style.removeProperty("--case-offset");
    const c = document.querySelector(".controls-card");
    const s = document.querySelector(".scene-controls");
    return {
      maxHeight: getComputedStyle(c).maxHeight,
      clientH: c.clientHeight,
      scrollH: c.scrollHeight,
      sheetChrome: getComputedStyle(s).getPropertyValue("--sheet-chrome").trim(),
      sheetTop: +s.getBoundingClientRect().top.toFixed(2),
      caseH: +document.querySelector(".drawer-case").getBoundingClientRect().height.toFixed(2),
      cardBottomVsViewport: +(
        c.getBoundingClientRect().bottom - window.innerHeight
      ).toFixed(2),
      footBottomVsViewport: +(
        document.querySelector("#card-foot").getBoundingClientRect().bottom - window.innerHeight
      ).toFixed(2),
      wordmarkFoot: +(
        document.querySelector("svg.handwritten-logo")?.getBoundingClientRect().bottom ?? -1
      ).toFixed(2),
    };
  });
  out.absentPublisher = { before, after };
  await ctx.close();
}

// ── B. THE BOOT FRAME ─────────────────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  // Sample the card's cap every animation frame from first paint; keep the first 8 distinct.
  await page.addInitScript(() => {
    window.__caps = [];
    const tick = () => {
      const c = document.querySelector(".controls-card");
      const s = document.querySelector(".scene-controls");
      if (c) {
        const mh = getComputedStyle(c).maxHeight;
        const sc = s ? getComputedStyle(s).getPropertyValue("--sheet-chrome").trim() : "";
        const last = window.__caps[window.__caps.length - 1];
        if (!last || last.maxHeight !== mh)
          window.__caps.push({
            t: +performance.now().toFixed(1),
            maxHeight: mh,
            sheetChrome: sc,
            h: +c.getBoundingClientRect().height.toFixed(2),
          });
      }
      if (window.__caps.length < 8 && performance.now() < 6000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.goto(`${BASE}/sudoku`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  out.bootCaps = await page.evaluate(() => window.__caps);
  await ctx.close();
}

// ── C. THE DECK ───────────────────────────────────────────────────────────────────────────
{
  for (const [name, w, h] of [
    ["deck-390x844", 390, 844],
    ["deck-1280x800", 1280, 800],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    out[name] = await page.evaluate(() => {
      const pick = (sel) => document.querySelector(sel);
      const box = (e) =>
        e
          ? `${e.getBoundingClientRect().width.toFixed(2)}x${e.getBoundingClientRect().height.toFixed(2)}`
          : null;
      const band =
        pick(".staging-band") ||
        [...document.querySelectorAll("*")].find((e) => /staging/i.test(e.className || ""));
      const bandTape = band?.querySelector(".washi-label");
      const cards = [...document.querySelectorAll("[class*='card-wordmark'], .game-card")];
      return {
        bandFound: !!band,
        bandClass: band ? String(band.className).slice(0, 60) : null,
        bandH: band ? +band.getBoundingClientRect().height.toFixed(2) : null,
        bandTapeTag: bandTape?.tagName ?? null,
        bandTapeBox: box(bandTape),
        bandTapeFont: bandTape ? getComputedStyle(bandTape).fontSize : null,
        bandTapeText: bandTape?.textContent.trim().slice(0, 20) ?? null,
        firstCardY: cards[0] ? +cards[0].getBoundingClientRect().top.toFixed(2) : null,
        allWashiTags: [...document.querySelectorAll(".washi-label")].map((e) => ({
          tag: e.tagName,
          t: e.textContent.trim().slice(0, 14),
          f: getComputedStyle(e).fontSize,
        })),
        headings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(
          (h) => `${h.tagName}:${h.textContent.trim().slice(0, 14)}`,
        ),
        hasControlsCard: !!document.querySelector(".controls-card"),
      };
    });
    await ctx.close();
  }
}

// ── D. THE CROSSING, TWO REFERENCE LINES ──────────────────────────────────────────────────
{
  for (const [name, w, h, dock] of [
    ["rail-1440x900", 1440, 900, false],
    ["seal-1280x800", 1280, 800, false],
    ["dock-390x844", 390, 844, true],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: dock });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/sudoku`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    if (dock) await openSheet(page);
    out[`crossing-${name}`] = await page.evaluate(() => {
      const card = document.querySelector(".controls-card");
      return [...card.querySelectorAll(".tray-well")].map((well) => {
        const tag = well.querySelector(":scope > .washi-tag");
        const svg = well.querySelector(":scope > .outline-svg, :scope > svg.outline-svg");
        const path = svg?.querySelector(".boil-pose.is-active path") ?? svg?.querySelector("path");
        const tr = tag?.getBoundingClientRect();
        const wr = well.getBoundingClientRect();
        return {
          name: tag?.textContent.trim().slice(0, 12) ?? "?",
          // reference 1: the PAINTED path's own bbox top (the stroke the eye reads)
          crossVsPath: path ? +(tr.bottom - path.getBoundingClientRect().top).toFixed(2) : null,
          pathTop: path ? +path.getBoundingClientRect().top.toFixed(2) : null,
          // reference 2: the well's BORDER-BOX top (the layout edge)
          crossVsWellBox: +(tr.bottom - wr.top).toFixed(2),
          tapeTop: +tr.top.toFixed(2),
          tapeBottom: +tr.bottom.toFixed(2),
          wellTop: +wr.top.toFixed(2),
          svgFound: !!svg,
        };
      });
    });
    await ctx.close();
  }
}

// ── E. THE RING, FROM PAINTED BYTES ───────────────────────────────────────────────────────
function lum(r, g, b) {
  const f = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
{
  const sharp = require(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp",
  );
  out.ring = {};
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: scheme,
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/sudoku`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    const targets = await page.evaluate(() => {
      const card = document.querySelector(".controls-card");
      const chips = [...card.querySelectorAll('[role="radio"], .option-chip, button')];
      const pickBy = (re) =>
        chips.findIndex((c) => re.test((c.textContent || c.getAttribute("aria-label") || "").trim()));
      return {
        n: chips.length,
        idx: {
          chosenLevel: pickBy(/^Easy$/i),
          sizeChip: pickBy(/^9.?.?9$|^9x9$/i),
          deal: pickBy(/deal/i),
        },
      };
    });
    const rows = {};
    for (const [label, i] of Object.entries(targets.idx)) {
      if (i < 0) continue;
      const shot = await page.evaluate(async (i) => {
        const card = document.querySelector(".controls-card");
        const chips = [...card.querySelectorAll('[role="radio"], .option-chip, button')];
        const el = chips[i];
        el.scrollIntoView({ block: "center" });
        el.focus();
        const r = el.getBoundingClientRect();
        return {
          focusVisible: el.matches(":focus-visible"),
          rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        };
      }, i);
      await page.waitForTimeout(200);
      const pad = 8;
      const clip = {
        x: Math.max(0, Math.floor(shot.rect.x - pad)),
        y: Math.max(0, Math.floor(shot.rect.y - pad)),
        width: Math.ceil(shot.rect.w + pad * 2),
        height: Math.ceil(shot.rect.h + pad * 2),
      };
      if (clip.width < 4 || clip.height < 4) continue;
      const buf = await page.screenshot({ clip });
      const raw = await sharp(buf).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
      const png = { width: raw.info.width, height: raw.info.height, data: raw.data };
      // The ring band: the pad ring around the element's box, excluding the interior.
      const inner = { x0: pad + 1, y0: pad + 1, x1: png.width - pad - 1, y1: png.height - pad - 1 };
      let ringLum = null,
        groundLum = null;
      const lums = [];
      for (let y = 0; y < png.height; y++)
        for (let x = 0; x < png.width; x++) {
          const inInner = x > inner.x0 && x < inner.x1 && y > inner.y0 && y < inner.y1;
          const o = (png.width * y + x) << 2;
          const L = lum(png.data[o], png.data[o + 1], png.data[o + 2]);
          if (!inInner) lums.push(L);
        }
      lums.sort((a, b) => a - b);
      // the ring is the extreme against the paper: take the 2nd percentile and the median
      const dark = lums[Math.floor(lums.length * 0.02)];
      const med = lums[Math.floor(lums.length * 0.5)];
      const light = lums[Math.floor(lums.length * 0.98)];
      ringLum = scheme === "light" ? dark : light;
      groundLum = med;
      const hi = Math.max(ringLum, groundLum),
        lo = Math.min(ringLum, groundLum);
      rows[label] = {
        focusVisible: shot.focusVisible,
        ratio: +((hi + 0.05) / (lo + 0.05)).toFixed(2),
        ringLum: +ringLum.toFixed(4),
        groundLum: +groundLum.toFixed(4),
      };
    }
    out.ring[scheme] = rows;
    await ctx.close();
  }
}

console.log(JSON.stringify(out, null, 1));
await browser.close();
