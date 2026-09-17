// T9-W7 r0 · lane R7 — probe 5. Who draws the box around the floating bar (M04)? And the
// desktop rail's wrong-tag-pinned crop (M03's money shot). Plus the moon/tongue collision
// the owner's Frame B shows ("the controls chip over the moon").
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "frames");
const BASE = "http://127.0.0.1:4247/";
const out = {};

async function open(engine, w, h, mobile, dark) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile || undefined,
    hasTouch: mobile,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light");
    } catch {
      /* private */
    }
  }, dark);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page
    .waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, {
      timeout: 20000,
    })
    .catch(() => {});
  await page.waitForTimeout(1600);
  return { browser, page };
}

// ── M04 · who paints a border near the bar ─────────────────────────────────
async function barChrome(engine) {
  const { browser, page } = await open(engine, 390, 844, true, true);
  await page.locator(".drawer-tab").click();
  await page.waitForTimeout(950);
  const r = await page.evaluate(() => {
    const bar = document.querySelector(".action-bar");
    const bb = bar.getBoundingClientRect();
    // every HandDrawnOutline svg on the page, and whether its rect encloses the bar
    const outlines = [...document.querySelectorAll("svg")]
      .filter((s) => /outline|hand-drawn|sketch/i.test(s.getAttribute("class") || "") || s.closest(".outline-container"))
      .map((s) => {
        const b = s.getBoundingClientRect();
        const host = s.closest("[class]");
        return {
          cls: (s.getAttribute("class") || "").slice(0, 32),
          host: (host?.className?.baseVal ?? String(host?.className || "")).slice(0, 44),
          box: [+b.x.toFixed(1), +b.y.toFixed(1), +b.width.toFixed(1), +b.height.toFixed(1)],
          enclosesBar: b.left <= bb.left + 2 && b.right >= bb.right - 2 && b.top <= bb.top + 2 && b.bottom >= bb.bottom - 2,
        };
      });
    const card = document.querySelector(".controls-card");
    const cb = card.getBoundingClientRect();
    const ccs = getComputedStyle(card);
    return {
      bar: [+bb.x.toFixed(1), +bb.y.toFixed(1), +bb.width.toFixed(1), +bb.height.toFixed(1)],
      barOwnBorder: [ccs && getComputedStyle(bar).borderTopWidth, getComputedStyle(bar).outlineStyle, getComputedStyle(bar).boxShadow].join(" | ").slice(0, 60),
      card: [+cb.x.toFixed(1), +cb.y.toFixed(1), +cb.width.toFixed(1), +cb.height.toFixed(1)],
      cardBorder: ccs.borderTopWidth + " " + ccs.borderTopStyle,
      cardEnclosesBar: cb.bottom >= bb.bottom - 2,
      barOverflowsCardByPx: +(bb.bottom - cb.bottom).toFixed(1),
      outlines: outlines.filter((o) => o.enclosesBar || Math.abs(o.box[1] + o.box[3] - bb.bottom) < 60),
      outlineCount: outlines.length,
    };
  });
  // the moon vs the risen tongue (Frame B: "the controls chip over the moon")
  r.moon = await page.evaluate(() => {
    const m = document.querySelector(".toggle-moon, .sun-moon-toggle");
    const t = document.querySelector(".drawer-tab");
    if (!m || !t) return null;
    const mb = m.getBoundingClientRect();
    const tb = t.getBoundingClientRect();
    const ov =
      Math.max(0, Math.min(mb.bottom, tb.bottom) - Math.max(mb.top, tb.top)) *
      Math.max(0, Math.min(mb.right, tb.right) - Math.max(mb.left, tb.left));
    return {
      toggle: [+mb.x.toFixed(1), +mb.y.toFixed(1), +mb.width.toFixed(1), +mb.height.toFixed(1)],
      tongue: [+tb.x.toFixed(1), +tb.y.toFixed(1), +tb.width.toFixed(1), +tb.height.toFixed(1)],
      overlapPx2: +ov.toFixed(1),
    };
  });
  await browser.close();
  return r;
}

// ── M03 · the rail's wrong-tag-pinned crop ─────────────────────────────────
async function railCrop(engine) {
  const { browser, page } = await open(engine, 1440, 900, false, false);
  const info = await page.evaluate(async () => {
    const sc = [...document.querySelectorAll(".controls-card")].find(
      (e) => e.scrollHeight - e.clientHeight > 40,
    );
    sc.scrollTop = 500;
    await new Promise((r) => setTimeout(r, 300));
    const b = sc.getBoundingClientRect();
    return {
      card: [+b.x.toFixed(1), +b.y.toFixed(1), +b.width.toFixed(1), +b.height.toFixed(1)],
      pinned: [...document.querySelectorAll(".tray-well .washi-tag")]
        .filter((e) => e.getBoundingClientRect().top <= b.top + 30)
        .map((e) => e.textContent.trim()),
      onScreenGroups: [...document.querySelectorAll(".tray-well")]
        .filter((w) => {
          const wb = w.getBoundingClientRect();
          return wb.bottom > b.top + 4 && wb.top < b.bottom - 4;
        })
        .map((w) => (w.querySelector(".washi-tag")?.textContent || "?").trim()),
    };
  });
  await page.screenshot({
    path: resolve(OUT, `p7-${engine}-rail-wrongtag-1440x900.png`),
    clip: { x: info.card[0] - 8, y: info.card[1] - 8, width: Math.min(360, info.card[2] + 16), height: 260 },
  });
  await browser.close();
  return info;
}

out.barChrome_webkit = await barChrome("webkit");
out.barChrome_chromium = await barChrome("chromium");
out.railCrop_webkit = await railCrop("webkit");
writeFileSync(resolve(HERE, "probe-r7e.json"), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 1));
