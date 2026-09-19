/**
 * MRK-WASH pass-1 PROTOTYPE · the two DESK frames, re-cut so the pose the gate reads is the pose
 * in the picture: an EMPTY selected cell, a peer's cursor two squares along IN THE SAME ROW (so
 * it sits inside your unit and the exclusivity rule is visible on it), and a neutral neighbour
 * off the unit. Crop centred between you and the peer.
 */
import { chromium, webkit } from "playwright";
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { FRAMES } from "./lib.mjs";

const save = async (buf, name, colors = 96) => {
  const out = await sharp(buf).png({ palette: true, colors, effort: 10 }).toBuffer();
  writeFileSync(join(FRAMES, name), out);
  console.log(`FRAME ${name} ${out.length} B`);
};

const desk = async (engine, theme, name) => {
  const browser = await engine.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: theme,
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  const a = await ctx.newPage();
  await a.goto("http://127.0.0.1:4240/?size=3&difficulty=EASY&wire=local");
  await a.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await a.waitForTimeout(1500);
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await a.waitForFunction(() => new URL(location.href).searchParams.get("s") !== null, { timeout: 20000 });

  // Two EMPTY cells in one row, two columns apart.
  const pair = await a.evaluate(() => {
    const cells = Array.from(document.querySelectorAll(".game-cell"));
    for (let r = 2; r < 7; r++)
      for (let c = 0; c < 6; c++) {
        const i = r * 9 + c, j = r * 9 + c + 2;
        if (!cells[i].querySelector("input").value && !cells[j].querySelector("input").value)
          return { i, j };
      }
    return null;
  });

  const b = await ctx.newPage();
  await b.goto(a.url());
  await b.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await b.waitForTimeout(1600);
  await b.evaluate((p) => document.querySelectorAll(".game-cell input")[p.j]?.focus(), pair);
  await a.bringToFront();
  await a.waitForTimeout(1200);
  await a.evaluate((p) => document.querySelectorAll(".game-cell input")[p.i]?.focus(), pair);
  await a.waitForTimeout(800);

  const box = await a.evaluate((p) => {
    const cs = document.querySelectorAll(".game-cell");
    const r1 = cs[p.i].getBoundingClientRect(), r2 = cs[p.j].getBoundingClientRect();
    return { cx: (r1.x + r2.right) / 2, cy: r1.y + r1.height / 2 };
  }, pair);
  const clip = {
    x: Math.max(0, Math.round(box.cx - 165)),
    y: Math.max(0, Math.round(box.cy - 105)),
    width: 330,
    height: 210,
  };
  await save(await a.screenshot({ clip, type: "png" }), name);
  console.log(`  pose ${name} you=${pair.i} peer=${pair.j}`);
  await ctx.close();
  await browser.close();
};

await desk(chromium, "light", "a-desk-peer-light-chromium.png");
await desk(webkit, "dark", "a-desk-peer-dark-webkit.png");
