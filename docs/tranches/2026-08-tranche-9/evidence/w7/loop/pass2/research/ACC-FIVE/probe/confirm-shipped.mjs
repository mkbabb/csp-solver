/**
 * confirm-shipped.mjs — ACC-FIVE pass 2, row 9. The confirm's face, measured AS SHIPPED.
 *
 * Pass 1 priced the destructive verb by compositing `color-mix(--color-red-ink 5%)` over the
 * note's background through a 1x1 canvas (4.55/4.58 chromium/webkit; the critic's own
 * composite 4.631; the source comment says 4.56). All three are arithmetic on tokens. The
 * charter asks for the sentence that PAINTS: the word's own darkest ink against the ground's
 * own modal byte, off a screenshot of the armed ribbon, plus the thing pass 1 did not price —
 * the drawn BOX, which takes `currentColor` from `.guard-face` and turns red with the word
 * (HandDrawnOutline strokes `currentColor`; `.guard-leave .guard-face { color: red-ink }`).
 *
 * Reports, per engine x theme: computed color/background; the painted ground; the painted ink
 * core; the painted box stroke; and the three ratios that bind — word/ground (1.4.3, AA 4.5),
 * box/ground and box/card (1.4.11, 3.0).
 *
 *   BASE=http://127.0.0.1:4236 OUT=<dir> node confirm-shipped.mjs
 */
import { chromium, webkit } from "playwright";
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const OUT = process.env.OUT || ".";
const lum = ([r, g, b]) => {
  const f = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};

const out = {};
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
    await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
    await page.waitForTimeout(700);

    // arm the guard — the pass-1 lane's route, verbatim
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

    const meta = await page.evaluate(() => {
      const leave = document.querySelector(".guard-leave .guard-face");
      const keep = document.querySelector(".guard-keep .guard-face");
      const note = document.querySelector(".guard-note");
      if (!leave) return null;
      const cs = getComputedStyle(leave);
      const svgPath = leave.querySelector("svg path") || leave.parentElement?.querySelector("svg path");
      return {
        text: leave.textContent?.trim() ?? "",
        color: cs.color,
        background: cs.backgroundColor,
        keepColor: keep ? getComputedStyle(keep).color : null,
        keepBackground: keep ? getComputedStyle(keep).backgroundColor : null,
        noteBg: note ? getComputedStyle(note).backgroundColor : null,
        boxStroke: svgPath ? getComputedStyle(svgPath).stroke : null,
        boxStrokeWidth: svgPath ? getComputedStyle(svgPath).strokeWidth : null,
        boxIsCurrentColor: svgPath ? svgPath.getAttribute("stroke") : null,
      };
    });
    if (!meta) {
      out[`${engine}/${scheme}`] = { reached: false };
      await ctx.close();
      continue;
    }

    // the FACE's own box, inset 3px so the drawn frame's stroke is out of the ground sample
    const box = await page.locator(".guard-leave .guard-face").first().boundingBox();
    const inset = 3;
    const clip = {
      x: Math.max(0, Math.floor(box.x + inset)),
      y: Math.max(0, Math.floor(box.y + inset)),
      width: Math.max(1, Math.ceil(box.width - 2 * inset)),
      height: Math.max(1, Math.ceil(box.height - 2 * inset)),
    };
    // and a second crop OUTSIDE the face, for the paper the face sits on
    const outerBuf = await page.screenshot({
      clip: {
        x: Math.max(0, Math.floor(box.x - 14)),
        y: Math.max(0, Math.floor(box.y + box.height / 2)),
        width: 6,
        height: 4,
      },
      type: "png",
    });
    const outer = await sharp(outerBuf).raw().toBuffer({ resolveWithObject: true });
    const paperRgb = [outer.data[0], outer.data[1], outer.data[2]];
    const buf = await page.screenshot({ clip, type: "png" });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels;
    const px = [];
    for (let i = 0; i < info.width * info.height; i++) {
      const o = i * ch;
      px.push([data[o], data[o + 1], data[o + 2]]);
    }
    const key = (p) => p.join(",");
    const counts = new Map();
    for (const p of px) counts.set(key(p), (counts.get(key(p)) || 0) + 1);
    const modal = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    const ground = modal[0].split(",").map(Number);

    // ink core: for light, the lowest-luminance chromatic pixel; for dark, the highest
    const chromatic = px.filter((p) => rgbToOklch(p[0], p[1], p[2]).C >= 0.06);
    const sorted = chromatic.sort((a, b) => lum(a) - lum(b));
    const inkCore = scheme === "light" ? sorted[0] : sorted[sorted.length - 1];
    const inkP5 =
      scheme === "light"
        ? sorted[Math.floor(sorted.length * 0.02)]
        : sorted[Math.floor(sorted.length * 0.98)];

    const parse = (s) => (s.match(/\d+/g) || []).slice(0, 3).map(Number);
    const strokeRgb = meta.boxStroke ? parse(meta.boxStroke) : null;
    const cardRgb = await page.evaluate(() => {
      const el = document.createElement("span");
      el.style.color = "var(--color-card)";
      document.body.appendChild(el);
      const c = getComputedStyle(el).color;
      el.remove();
      return c;
    });

    const o = rgbToOklch(inkCore[0], inkCore[1], inkCore[2]);
    out[`${engine}/${scheme}`] = {
      reached: true,
      meta,
      groundPaintedModal: ground,
      paperBesideFace: paperRgb,
      groundVsPaper: ratio(ground, paperRgb),
      top3: [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([k2, n]) => ({ rgb: k2.split(",").map(Number), share: +(n / px.length).toFixed(3) })),
      groundModalShare: +(modal[1] / px.length).toFixed(3),
      inkCorePainted: inkCore,
      inkP2Painted: inkP5,
      inkOklch: { L: +o.L.toFixed(3), C: +o.C.toFixed(3), h: +o.h.toFixed(1) },
      chromaticPx: chromatic.length,
      ratios: {
        "wordCore/groundPainted": ratio(inkCore, ground),
        "wordP2/groundPainted": ratio(inkP5, ground),
        "boxStroke/groundPainted": strokeRgb ? ratio(strokeRgb, ground) : null,
        "boxStroke/card": strokeRgb ? ratio(strokeRgb, parse(cardRgb)) : null,
        "boxStroke/paperBeside": strokeRgb ? ratio(strokeRgb, paperRgb) : null,
      },
      cardRgb,
    };
    console.log(
      `== ${engine} ${scheme} | word "${meta.text}" color ${meta.color} bg ${meta.background}\n   box stroke ${meta.boxStroke} (attr ${meta.boxIsCurrentColor}, w ${meta.boxStrokeWidth})\n   painted 5% ground ${ground} (${(modal[1] / px.length).toFixed(3)} of face) · paper beside ${paperRgb} · ground/paper ${ratio(ground, paperRgb)}\n   ink core ${inkCore}\n   word/ground ${ratio(inkCore, ground)} · box/ground ${strokeRgb ? ratio(strokeRgb, ground) : "-"} · box/card ${strokeRgb ? ratio(strokeRgb, parse(cardRgb)) : "-"}`,
    );
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(`${OUT}/confirm-shipped.json`, JSON.stringify(out, null, 2));
console.log("banked", `${OUT}/confirm-shipped.json`);
