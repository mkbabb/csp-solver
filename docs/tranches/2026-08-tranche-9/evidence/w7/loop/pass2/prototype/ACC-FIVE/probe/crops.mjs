/**
 * crops.mjs — the four cited crops, and no more (chair §7).
 *   1 board top-left 330x210 at fills 5 / 50 / 99 / won, one strip, LIGHT chromium
 *   2 the same strip, DARK chromium
 *   3 the armed confirm HOVERED, light, chromium beside webkit
 *   4 one write of twenty, webkit — one arc where HEAD painted four
 *
 *   ACC_FIVE_OUT=<dir> node crops.mjs
 */
import { chromium, webkit } from "playwright";
import sharp from "sharp";
import { BASE, OUT, board } from "./lib.mjs";

const W = 330;
const H = 210;

async function fillTo(page, targetPct) {
  for (let k = 0; k < 90; k++) {
    const now = await page.evaluate(() => {
      const el = document.querySelector('[role="progressbar"]');
      return el ? +el.getAttribute("aria-valuenow") : 0;
    });
    if (now >= targetPct) return now;
    const done = await page.evaluate(() => {
      const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
        (i) => !i.readOnly && !i.value,
      );
      if (!ins.length) return true;
      ins[0].focus();
      return false;
    });
    if (done) break;
    await page.keyboard.type("1");
    await page.waitForTimeout(30);
  }
  return page.evaluate(() => {
    const el = document.querySelector('[role="progressbar"]');
    return el ? +el.getAttribute("aria-valuenow") : 0;
  });
}

async function strip(engineType, scheme, name) {
  const browser = await engineType.launch();
  const ctx = await browser.newContext({
    colorScheme: scheme,
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await ctx.newPage();
  const grid = await board(page);
  const shots = [];
  const labels = [];
  for (const pct of [5, 50, 99]) {
    const got = await fillTo(page, pct);
    await page.waitForTimeout(500);
    const b = await grid.boundingBox();
    shots.push(
      await page.screenshot({
        clip: { x: Math.round(b.x - 10), y: Math.round(b.y - 10), width: W, height: H },
        type: "png",
      }),
    );
    labels.push(got);
  }
  await page
    .locator('[aria-label="Solve puzzle"]')
    .first()
    .click({ timeout: 8000 })
    .catch(() => {});
  await page.waitForTimeout(2600);
  {
    const b = await grid.boundingBox();
    shots.push(
      await page.screenshot({
        clip: { x: Math.round(b.x - 10), y: Math.round(b.y - 10), width: W, height: H },
        type: "png",
      }),
    );
    labels.push("won");
  }
  await ctx.close();
  await browser.close();
  await sharp({
    create: { width: W * 4, height: H, channels: 3, background: { r: 128, g: 128, b: 128 } },
  })
    .composite(shots.map((b, i) => ({ input: b, left: i * W, top: 0 })))
    .png({ compressionLevel: 9, palette: true })
    .toFile(`${OUT}/${name}`);
  console.log(name, "valuenow:", labels.join(" / "));
}

await strip(chromium, "light", "../frames/1-fill-strip-light-chromium.png");
await strip(chromium, "dark", "../frames/2-fill-strip-dark-chromium.png");

// 3 — the armed confirm, hovered, both engines side by side
{
  const shots = [];
  for (const [name, type] of [
    ["chromium", chromium],
    ["webkit", webkit],
  ]) {
    const browser = await type.launch();
    const ctx = await browser.newContext({
      colorScheme: "light",
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 800 },
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 40000 });
    await page.waitForTimeout(900);
    await page.evaluate(() => document.activeElement?.blur?.());
    await page.keyboard.press("Escape").catch(() => {});
    for (let a = 0; a < 3; a++) {
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
    const ribbon = page.locator(".guard-ribbon, .guard-note").first();
    const target = (await ribbon.count()) ? ribbon : page.locator(".guard-leave").first();
    await page.locator(".guard-leave .guard-face").first().hover();
    await page.waitForTimeout(500);
    const b = await target.boundingBox();
    shots.push(
      await page.screenshot({
        clip: {
          x: Math.max(0, Math.round(b.x - 8)),
          y: Math.max(0, Math.round(b.y - 8)),
          width: Math.min(360, Math.round(b.width + 16)),
          height: Math.min(120, Math.round(b.height + 16)),
        },
        type: "png",
      }),
    );
    await ctx.close();
    await browser.close();
  }
  const metas = await Promise.all(shots.map((s) => sharp(s).metadata()));
  const w = Math.max(...metas.map((m) => m.width));
  const h = Math.max(...metas.map((m) => m.height));
  await sharp({
    create: { width: w * 2 + 8, height: h, channels: 3, background: { r: 128, g: 128, b: 128 } },
  })
    .composite(shots.map((b, i) => ({ input: b, left: i * (w + 8), top: 0 })))
    .png({ compressionLevel: 9, palette: true })
    .toFile(`${OUT}/../frames/3-confirm-hovered-light-both.png`);
  console.log("3 banked");
}

// 4 — one write of twenty, webkit: one arc where HEAD painted four
{
  const browser = await webkit.launch();
  const ctx = await browser.newContext({
    colorScheme: "light",
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await ctx.newPage();
  const grid = await board(page);
  await page.evaluate(() => {
    const i = Array.from(document.querySelectorAll(".sudoku-cell input")).find(
      (e) => !e.readOnly && !e.value,
    );
    if (i) i.focus();
  });
  await page.keyboard.type("1");
  await page.waitForTimeout(700);
  const b = await grid.boundingBox();
  await sharp(
    await page.screenshot({
      clip: {
        x: Math.round(b.x - 12),
        y: Math.round(b.y - 12),
        width: Math.round(b.width + 24),
        height: Math.round(b.height + 24),
      },
      type: "png",
    }),
  )
    .resize(420)
    .png({ compressionLevel: 9, palette: true })
    .toFile(`${OUT}/../frames/4-one-write-webkit.png`);
  await ctx.close();
  await browser.close();
  console.log("4 banked");
}
