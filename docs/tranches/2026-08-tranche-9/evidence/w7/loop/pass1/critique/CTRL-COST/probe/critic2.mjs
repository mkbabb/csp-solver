#!/usr/bin/env node
/**
 * CTRL-COST · PASS-1 CRITIC PROBE, PART 2.
 *
 *   S1 · THE RIBBON'S RESERVATION, TESTED AS A CURE. `.play-controls` leaves the fold's ribbon
 *        when the sheet rises and `scene.css` holds the band open with `--fold-tools-h` (a
 *        published measurement with a 3.5rem literal fallback). So: the wordmark's foot, the
 *        board's box and the ribbon's height, before and after the sheet opens.
 *   S2 · THE BERTH WITH THE BAND'S TOP SCROLLED OUT. Part 1 hovered through playwright, which
 *        scrolls the target into view and so re-parks the band. This one moves the mouse to
 *        live coordinates with the card scrolled, and asks whether the tape is on screen.
 *   S3 · THE GALLERY, PRICED. `g` opens the deck. The staging axis labels are `.section-heading`
 *        too, so the ROW-3 deletion re-ranks them below 768 — proto against a HEAD tree, same
 *        page, same engine: the type AND the geometry it moves.
 *
 *   node critic2.mjs <protoBase> <headBase> <out.json>
 */
import fs from "node:fs";
import { chromium, webkit } from "playwright";

const [PROTO, HEAD, OUT] = process.argv.slice(2);
if (!PROTO || !HEAD || !OUT) throw new Error("usage: critic2.mjs <protoBase> <headBase> <out>");
const out = { bases: { PROTO, HEAD }, sheetWalk: {}, berthScrolled: {}, gallery: {} };

const box = (s) => {
  const el = document.querySelector(s);
  if (!el) return null;
  const b = el.getBoundingClientRect();
  return [+b.x.toFixed(2), +b.y.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)];
};

const poseRead = () => {
  const b = (s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)];
  };
  const fold = document.querySelector(".fold-tools");
  return {
    wordmark: b("svg.handwritten-logo"),
    board: b(".board-host, .game-board, [role='grid']"),
    drawerCase: b(".drawer-case"),
    foldTools: b(".fold-tools"),
    foldToolsVar: fold ? getComputedStyle(fold).getPropertyValue("--fold-tools-h").trim() : null,
    ribbonButtons: document.querySelectorAll("#fold-tools button").length,
  };
};

for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();

  // ── S1 ────────────────────────────────────────────────────────────────────────────────
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: engine === "chromium",
      deviceScaleFactor: 1,
      baseURL: PROTO,
    });
    const page = await ctx.newPage();
    await page.goto("./?size=3&difficulty=EASY");
    await page.waitForSelector("svg.handwritten-logo", { timeout: 45000 });
    await page.waitForSelector(".controls-card", { state: "attached", timeout: 45000 });
    await page.waitForTimeout(1600);
    const shut = await page.evaluate(poseRead);
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(1100);
    const open = await page.evaluate(poseRead);
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(1100);
    const back = await page.evaluate(poseRead);
    out.sheetWalk[`dock-${engine}`] = { shut, open, back };
    await ctx.close();
  }

  // ── S2 ────────────────────────────────────────────────────────────────────────────────
  {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
      baseURL: PROTO,
    });
    const page = await ctx.newPage();
    await page.goto("./?size=3&difficulty=EASY");
    await page.waitForSelector(".controls-card", { state: "attached", timeout: 45000 });
    await page.waitForTimeout(1600);
    // park the card at its bottom, then hover whatever caption is on screen, by coordinates
    const rows = await page.evaluate(() => {
      const c = document.querySelector(".controls-card");
      c.scrollTop = c.scrollHeight;
      return null;
    });
    await page.waitForTimeout(400);
    const spots = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".band-row-caption")).map((el) => {
        const r = el.getBoundingClientRect();
        return { text: el.innerText.trim(), x: r.x + r.width - 8, y: r.y + r.height / 2 };
      }),
    );
    const readTape = () => {
      const card = document.querySelector(".controls-card");
      const cb = card.getBoundingClientRect();
      const vis = Array.from(document.querySelectorAll(".washi-label")).filter((t) => {
        const cs = getComputedStyle(t);
        return cs.visibility !== "hidden" && +cs.opacity > 0.5;
      });
      return vis.map((t) => {
        const b = t.getBoundingClientRect();
        return {
          text: t.innerText.trim().slice(0, 40),
          box: [+b.x.toFixed(1), +b.y.toFixed(1), +b.width.toFixed(1), +b.height.toFixed(1)],
          clippedAbovePort: +Math.max(0, cb.top - b.top).toFixed(1),
          clippedBelowPort: +Math.max(0, b.bottom - cb.bottom).toFixed(1),
          fullyOffPort: b.bottom <= cb.top || b.top >= cb.bottom,
        };
      });
    };
    for (const s of spots) {
      if (s.y < 0 || s.y > 800) {
        out.berthScrolled[`${engine}-${s.text}`] = { offViewport: true };
        continue;
      }
      await page.mouse.move(s.x, s.y);
      await page.waitForTimeout(450);
      out.berthScrolled[`${engine}-${s.text}`] = {
        at: [+s.x.toFixed(1), +s.y.toFixed(1)],
        tapes: await page.evaluate(readTape),
      };
      await page.mouse.move(3, 3);
      await page.waitForTimeout(200);
    }
    await ctx.close();
  }

  // ── S3 ────────────────────────────────────────────────────────────────────────────────
  for (const [tree, base] of [
    ["proto", PROTO],
    ["head", HEAD],
  ]) {
    for (const [cell, w, h] of [
      ["390x844", 390, 844],
      ["1280x800", 1280, 800],
    ]) {
      const ctx = await browser.newContext({
        viewport: { width: w, height: h },
        hasTouch: w < 800,
        isMobile: w < 800 && engine === "chromium",
        deviceScaleFactor: 1,
        baseURL: base,
      });
      const page = await ctx.newPage();
      await page.goto("./?size=3&difficulty=EASY");
      await page.waitForSelector("svg.handwritten-logo", { timeout: 45000 });
      await page.waitForTimeout(1600);
      await page.keyboard.press("g");
      await page.waitForTimeout(2200);
      out.gallery[`${tree}-${cell}-${engine}`] = await page.evaluate(() => {
        const b = (s) => {
          const el = document.querySelector(s);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return [+r.x.toFixed(1), +r.y.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)];
        };
        return {
          axes: Array.from(document.querySelectorAll(".staging-axis-label")).map((e) => ({
            text: e.innerText.trim().slice(0, 14),
            px: +parseFloat(getComputedStyle(e).fontSize).toFixed(3),
            family: getComputedStyle(e).fontFamily.split(",")[0].replace(/["']/g, ""),
            box: (() => {
              const r = e.getBoundingClientRect();
              return [+r.x.toFixed(1), +r.y.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)];
            })(),
          })),
          slip: b(".staging-slip"),
          band: b(".staging-band"),
          centerCard: b(".gallery-card.is-center, .gallery-card"),
          deck: b(".gallery-deck, .gallery"),
          filters: document.querySelectorAll("filter").length,
        };
      });
      await ctx.close();
    }
  }

  await browser.close();
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("wrote", OUT);
