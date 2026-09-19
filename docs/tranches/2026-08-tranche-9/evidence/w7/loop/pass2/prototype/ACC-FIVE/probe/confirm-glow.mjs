/**
 * confirm-glow.mjs — G4 (the verb) and G6 (the glow), painted, both engines, both themes.
 *
 * G4: arm the deck guard (a dirty deck always arms at a fine pointer), then read the drawn
 *     verb at REST and HOVERED. Word ratio on the ground it actually wears; the drawn box's
 *     stroke against the same ground (1.4.11, >= 3). Subject-count guard: at least one ribbon
 *     per engine, or the arm is a no-op that greens by absence.
 * G6: the sparkle icon's drop-shadow, byte-matched against crayon-gold at its alpha, five
 *     chromium runs.
 *
 *   ACC_FIVE_OUT=<dir> node confirm-glow.mjs
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import { BASE, OUT, ratio, pixels, hueDelta } from "./lib.mjs";

const out = { verb: {}, glow: {} };

const hexToRgb = (v) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(v.trim());
  if (m) {
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const r = /rgba?\(([^)]+)\)/.exec(v);
  if (r) return r[1].split(/[, ]+/).filter(Boolean).slice(0, 3).map(Number);
  return null;
};

/** The research lane's route, verbatim: g -> staging-deal -> the ribbon, polled. */
async function armRibbon(page) {
  // BLUR FIRST. A focused board input swallows `g` as a digit-cell keystroke and the deck
  // never opens — the arm then reads "no ribbon" and the gate greens by absence.
  // BLUR FIRST. A focused board input swallows `g` as a digit-cell keystroke and the deck
  // never opens — the arm then reads "no ribbon" and the gate greens by absence.
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(200);
  for (let attempt = 0; attempt < 3; attempt++) {
    if (await page.locator(".guard-leave .guard-face").count()) break;
    await page.keyboard.press("g").catch(() => {});
    await page
      .locator(".staging-btn.staging-deal")
      .first()
      .waitFor({ state: "visible", timeout: 6000 })
      .catch(() => {});
    await page.keyboard.press("d").catch(() => {});
    await page
      .locator(".guard-leave .guard-face")
      .waitFor({ state: "visible", timeout: 2500 })
      .catch(() => {});
    if (await page.locator(".guard-leave .guard-face").count()) break;
    await page
      .locator(".staging-btn.staging-deal")
      .first()
      .click({ timeout: 4000 })
      .catch(() => {});
    await page
      .locator(".guard-leave .guard-face")
      .waitFor({ state: "visible", timeout: 3000 })
      .catch(() => {});
  }
  await page.waitForTimeout(500);
  return (await page.locator(".guard-leave .guard-face").count()) > 0;
}

for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      colorScheme: scheme,
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 800 },
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 40000 });
    await page.waitForTimeout(900);
    const armed = await armRibbon(page);
    const rec = { armed, ribbonCount: await page.locator(".guard-leave").count() };
    if (armed) {
      const leave = page.locator(".guard-leave .guard-face").first();
      const read = async (label) => {
        await page.waitForTimeout(350);
        const box = await leave.boundingBox();
        const clip = {
          x: Math.max(0, Math.floor(box.x - 4)),
          y: Math.max(0, Math.floor(box.y - 4)),
          width: Math.ceil(box.width + 8),
          height: Math.ceil(box.height + 8),
        };
        const { px } = await pixels(await page.screenshot({ clip, type: "png" }));
        const chr = px.filter((p) => p.C >= 0.04);
        const ach = px.filter((p) => p.C < 0.04);
        const counts = new Map();
        for (const p of ach) {
          const k = p.rgb.join(",");
          counts.set(k, (counts.get(k) ?? 0) + 1);
        }
        const ground = (counts.size
          ? [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]
          : px[0].rgb.join(",")
        )
          .split(",")
          .map(Number);
        const core = chr.sort((a, b) => b.C - a.C)[0] ?? null;
        const cs = await page.evaluate(() => {
          const f = document.querySelector(".guard-leave .guard-face");
          const outline = document.querySelector(".guard-leave svg path, .guard-leave path");
          return {
            faceColor: f ? getComputedStyle(f).color : null,
            faceBackground: f ? getComputedStyle(f).backgroundColor : null,
            outlineStroke: outline ? getComputedStyle(outline).stroke : null,
            outlineStrokeWidth: outline ? getComputedStyle(outline).strokeWidth : null,
            redInk: getComputedStyle(document.documentElement)
              .getPropertyValue("--color-red-ink")
              .trim(),
          };
        });
        return {
          label,
          groundPainted: ground,
          chromaticPx: chr.length,
          corePainted: core
            ? { rgb: core.rgb, L: +core.L.toFixed(3), C: +core.C.toFixed(3), h: +core.h.toFixed(1) }
            : null,
          ratioOnGround: core ? ratio(core.rgb, ground) : null,
          redInkPainted: hexToRgb(cs.redInk),
          computed: cs,
        };
      };
      rec.rest = await read("rest");
      await leave.hover();
      rec.hover = await read("hover");
      await page.mouse.move(5, 5);
    }
    out.verb[`${engine}/${scheme}`] = rec;
    console.log(
      `  ${engine} ${scheme} verb armed=${armed} rest=${rec.rest?.ratioOnGround} hover=${rec.hover?.ratioOnGround} C=${rec.rest?.corePainted?.C}`,
    );
    await ctx.close();
  }
  await browser.close();
}

// ── G6: the glow, five chromium runs ──
{
  const browser = await chromium.launch();
  const runs = [];
  for (let i = 0; i < 5; i++) {
    const ctx = await browser.newContext({
      colorScheme: "light",
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 800 },
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 40000 });
    await page.waitForTimeout(900);
    const r = await page.evaluate(() => {
      const el = document.querySelector(".sparkle-icon");
      const cs = getComputedStyle(document.documentElement);
      return {
        present: !!el,
        filter: el ? getComputedStyle(el).filter : null,
        transition: el ? getComputedStyle(el).transition : null,
        soft: cs.getPropertyValue("--sparkle-glow-soft").trim(),
        strong: cs.getPropertyValue("--sparkle-glow-strong").trim(),
        crayonGold: cs.getPropertyValue("--color-crayon-gold").trim(),
      };
    });
    runs.push(r);
    await ctx.close();
  }
  await browser.close();
  const gold = hexToRgb(runs[0].crayonGold);
  const m = /rgba?\(([^)]+)\)/.exec(runs[0].soft || "");
  const softRgba = m ? m[1].split(/[,/ ]+/).filter(Boolean).map(Number) : null;
  out.glow = {
    runs,
    crayonGoldRgb: gold,
    softParsed: softRgba,
    byteMatch:
      gold && softRgba
        ? softRgba[0] === gold[0] && softRgba[1] === gold[1] && softRgba[2] === gold[2]
        : null,
    alpha: softRgba ? softRgba[3] : null,
    allFiveIdentical: runs.every((r) => r.filter === runs[0].filter),
  };
  console.log("  glow:", JSON.stringify(out.glow.runs[0]), "byteMatch", out.glow.byteMatch);
}

writeFileSync(`${OUT}/confirm-glow.json`, JSON.stringify(out, null, 2));
console.log("banked", `${OUT}/confirm-glow.json`);
