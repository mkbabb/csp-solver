/**
 * proto-crops.mjs — the frames this prototype banks, and no more.
 *
 * No overlay: the tree carries the cure. Every panel is the board's own bounding box (or the
 * button's), palette-quantised, byte size printed so the .md can cite it against the wave's cap.
 *
 *  1/2 board-corner-{light,dark}.png  — 330x210 at the board top-left, the SAME crop R2 banked
 *      at HEAD and the research lane banked under its overlay: read all three side by side.
 *  3   handoff-strip.png  — the corner at fill 5 / 50 / 100 / WON. The family's centre, and the
 *      one thing no number can carry: the gold ink becoming the gold wax on the same line.
 *  4   focus-cell-dark.png — a focused cell with a written digit and the unit wash, dark: the
 *      iso-luminance the owner picks the dark pen on.
 *  5   confirm-{chromium,webkit}.png — the armed guard ribbon, both engines.
 *  6   corner-print.png / corner-forced.png — the same corner under print and forced colours.
 *  7   sparkle-rest-hover.png — the solver button at rest beside the same button hovered.
 *  8   phone-bottom-tab.png — 393x699 dpr3 at W2's bottom-tab pose, the gauge near 50%.
 */
import { chromium, webkit } from "playwright";
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const OUT = process.env.OUT;
mkdirSync(OUT, { recursive: true });
const notes = {};

const png = async (buf) => sharp(buf).png({ palette: true, quality: 82, effort: 9 }).toBuffer();
const bank = async (name, buf) => {
  const out = await png(buf);
  writeFileSync(`${OUT}/${name}.png`, out);
  notes[name] = out.length;
  console.log(name.padEnd(26), out.length, "B");
};

const boot = async (ctx, scheme) => {
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.waitForTimeout(700);
  return page;
};

const typeN = async (page, n) => {
  const cell = page.locator(".sudoku-cell input:not([readonly])").first();
  await cell.focus();
  for (let i = 0; i < n; i++) {
    await page.keyboard.type("1");
    await page.keyboard.press("ArrowRight");
  }
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(700);
};

const browser = await chromium.launch();

/* ── 1/2 the board corner, both themes ─────────────────────────────────────── */
for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    colorScheme: scheme,
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await boot(ctx, scheme);
  await typeN(page, 6);
  const box = await page.locator(".board-wrapper, svg.hand-drawn-grid").first().boundingBox();
  const clip = {
    x: Math.max(0, Math.round(box.x - 10)),
    y: Math.max(0, Math.round(box.y - 10)),
    width: 330,
    height: 210,
  };
  await bank(`board-corner-${scheme}`, await page.screenshot({ clip, type: "png" }));
  await ctx.close();
}

/* ── 4 the focused cell, dark ──────────────────────────────────────────────── */
{
  const ctx = await browser.newContext({
    colorScheme: "dark",
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await boot(ctx, "dark");
  // write a digit, then keyboard-focus it so the ring, the wash and the ink are co-visible
  const cell = page.locator(".sudoku-cell input:not([readonly])").first();
  await cell.focus();
  await page.keyboard.type("7");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(800);
  const box = await page.locator(".game-cell:has(input:focus-visible)").first().boundingBox();
  const b = box ?? (await page.locator(".sudoku-cell").first().boundingBox());
  await bank(
    "focus-cell-dark",
    await page.screenshot({
      clip: {
        x: Math.max(0, Math.round(b.x - 34)),
        y: Math.max(0, Math.round(b.y - 26)),
        width: 150,
        height: 120,
      },
      type: "png",
    }),
  );
  await ctx.close();
}

/* ── 3 the hand-off strip: 5 / 50 / 100 / WON ──────────────────────────────── */
for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    colorScheme: scheme,
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await boot(ctx, scheme);
  const grid = page.locator("svg.hand-drawn-grid").first();
  const fill = () =>
    page.evaluate(() => {
      const el = document.querySelector('[role="progressbar"]');
      return el ? Number(el.getAttribute("aria-valuenow")) : null;
    });
  const corner = async () => {
    const b = await grid.boundingBox();
    return page.screenshot({
      clip: {
        x: Math.max(0, Math.round(b.x - 12)),
        y: Math.max(0, Math.round(b.y - 12)),
        width: 190,
        height: 150,
      },
      type: "png",
    });
  };
  const panels = [];
  const blanks = await page.evaluate(
    () =>
      Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
        (i) => !i.readOnly && !i.value,
      ).length,
  );
  const step = async (want) => {
    for (let k = 0; k < blanks + 4; k++) {
      const v = await fill();
      if (v !== null && v >= want) break;
      const done = await page.evaluate(() => {
        const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
          (i) => !i.readOnly,
        );
        const e = ins.findIndex((i) => !i.value);
        if (e < 0) return true;
        ins[e].focus();
        return false;
      });
      if (done) break;
      await page.keyboard.type("1");
      await page.waitForTimeout(30);
    }
    await page.waitForTimeout(500);
  };
  for (const want of [5, 50, 100]) {
    await step(want);
    panels.push({ at: await fill(), buf: await corner() });
  }
  await page
    .locator('[aria-label="Solve puzzle"]')
    .first()
    .click({ timeout: 8000 })
    .catch(() => {});
  await page.waitForTimeout(1800);
  panels.push({ at: "won", buf: await corner() });

  const metas = await Promise.all(panels.map((p) => sharp(p.buf).metadata()));
  const W = Math.max(...metas.map((m) => m.width));
  const H = Math.max(...metas.map((m) => m.height));
  const strip = await sharp({
    create: {
      width: W * panels.length + 8 * (panels.length - 1),
      height: H,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite(panels.map((p, i) => ({ input: p.buf, left: i * (W + 8), top: 0 })))
    .png({ palette: true, quality: 82, effort: 9 })
    .toBuffer();
  writeFileSync(`${OUT}/handoff-strip-${scheme}.png`, strip);
  notes[`handoff-strip-${scheme}`] = strip.length;
  console.log(
    `handoff-strip-${scheme}`.padEnd(26),
    strip.length,
    "B  panels",
    panels.map((p) => p.at).join(" / "),
  );
  await ctx.close();
}

/* ── 6 print and forced colours, the same corner ───────────────────────────── */
{
  const ctx = await browser.newContext({
    colorScheme: "light",
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await boot(ctx, "light");
  await typeN(page, 6);
  const grid = page.locator("svg.hand-drawn-grid").first();
  const shoot = async () => {
    const b = await grid.boundingBox();
    return page.screenshot({
      clip: {
        x: Math.max(0, Math.round(b.x - 12)),
        y: Math.max(0, Math.round(b.y - 12)),
        width: 190,
        height: 150,
      },
      type: "png",
    });
  };
  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(400);
  const p1 = await shoot();
  await page.emulateMedia({ media: "screen", forcedColors: "active" });
  await page.waitForTimeout(400);
  const p2 = await shoot();
  await page.emulateMedia({ forcedColors: "none" });
  const m = await sharp(p1).metadata();
  const pair = await sharp({
    create: {
      width: m.width * 2 + 8,
      height: m.height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      { input: p1, left: 0, top: 0 },
      { input: p2, left: m.width + 8, top: 0 },
    ])
    .png({ palette: true, quality: 82, effort: 9 })
    .toBuffer();
  writeFileSync(`${OUT}/corner-print-forced.png`, pair);
  notes["corner-print-forced"] = pair.length;
  console.log("corner-print-forced".padEnd(26), pair.length, "B");
  await ctx.close();
}

/* ── 7 the solver button, rest beside hover ────────────────────────────────── */
{
  const ctx = await browser.newContext({
    colorScheme: "light",
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await boot(ctx, "light");
  const btn = page.locator('[aria-label="Solve puzzle"]').first();
  const box = await btn.boundingBox();
  const clip = {
    x: Math.max(0, Math.round(box.x - 12)),
    y: Math.max(0, Math.round(box.y - 12)),
    width: Math.round(box.width + 24),
    height: Math.round(box.height + 24),
  };
  await page.waitForTimeout(400);
  const rest = await page.screenshot({ clip, type: "png" });
  await btn.hover();
  await page.waitForTimeout(600); // settle the 200ms filter tween
  const hover = await page.screenshot({ clip, type: "png" });
  const m = await sharp(rest).metadata();
  const pair = await sharp({
    create: {
      width: m.width * 2 + 8,
      height: m.height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      { input: rest, left: 0, top: 0 },
      { input: hover, left: m.width + 8, top: 0 },
    ])
    .png({ palette: true, quality: 82, effort: 9 })
    .toBuffer();
  writeFileSync(`${OUT}/sparkle-rest-hover.png`, pair);
  notes["sparkle-rest-hover"] = pair.length;
  console.log("sparkle-rest-hover".padEnd(26), pair.length, "B");
  await ctx.close();
}

/* ── 8 the phone, W2's bottom-tab pose, gauge near 50% ─────────────────────── */
{
  const ctx = await browser.newContext({
    colorScheme: "light",
    reducedMotion: "reduce",
    viewport: { width: 393, height: 699 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await boot(ctx, "light");
  const fill = () =>
    page.evaluate(() => {
      const el = document.querySelector('[role="progressbar"]');
      return el ? Number(el.getAttribute("aria-valuenow")) : null;
    });
  for (let k = 0; k < 90; k++) {
    const v = await fill();
    if (v !== null && v >= 50) break;
    const done = await page.evaluate(() => {
      const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
        (i) => !i.readOnly,
      );
      const e = ins.findIndex((i) => !i.value);
      if (e < 0) return true;
      ins[e].focus();
      return false;
    });
    if (done) break;
    await page.keyboard.type("1");
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(700);
  await bank("phone-bottom-tab", await page.screenshot({ type: "png", fullPage: false }));
  console.log("   phone fill:", await fill());
  await ctx.close();
}
await browser.close();

/* ── 5 the armed confirm, both engines ─────────────────────────────────────── */
for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await type.launch();
  const ctx = await b.newContext({
    colorScheme: "light",
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await boot(ctx, "light");
  const cell = page.locator(".sudoku-cell input:not([readonly])").first();
  await cell.focus();
  await page.keyboard.type("5");
  await page.waitForTimeout(250);
  await page.evaluate(() => document.activeElement?.blur());
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
  const ribbon = page.locator(".guard-ribbon, .gallery-guard").first();
  const box = (await ribbon.boundingBox().catch(() => null)) ?? {
    x: 0,
    y: 0,
    width: 400,
    height: 120,
  };
  await bank(
    `confirm-${engine}`,
    await page.screenshot({
      clip: {
        x: Math.max(0, Math.round(box.x - 6)),
        y: Math.max(0, Math.round(box.y - 6)),
        width: Math.min(640, Math.round(box.width + 12)),
        height: Math.min(200, Math.round(box.height + 12)),
      },
      type: "png",
    }),
  );
  await ctx.close();
  await b.close();
}

writeFileSync(`${OUT}/frames.json`, JSON.stringify(notes, null, 2));
console.log(
  "TOTAL",
  Object.values(notes).reduce((a, b) => a + b, 0),
  "B across",
  Object.keys(notes).length,
  "files",
);
