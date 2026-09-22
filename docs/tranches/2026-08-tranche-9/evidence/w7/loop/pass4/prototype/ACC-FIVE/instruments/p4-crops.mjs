/**
 * ACC-FIVE pass 4 · the two cited crops, RE-SHOT AT no-preference.
 *
 * Both pass-3 crops were PRM end states (critique §3.2) — the mechanism this family invented had
 * zero browser execution in its own evidence. These retire them one for one (chair §6.11: a
 * pass-4 crop is a replacement naming the crop it retires), and both are taken with the tween
 * RUNNING:
 *
 *   win-light-nopref.png    retires pass3/prototype/ACC-FIVE/frames/lift-light-chromium.png
 *   win-dark-contrast.png   retires pass3/prototype/ACC-FIVE/frames/lift-dark-chromium.png
 *
 * The panes are composed on a CANVAS IN THE PAGE — no Node image library is installed for a
 * gate, and the compositing engine is the one that painted the panes.
 *
 *   node p4-crops.mjs <url> <outdir>
 */
import { chromium, webkit } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";

const URL_ = process.argv[2] ?? "http://127.0.0.1:4236/?size=3&difficulty=EASY";
const OUT = process.argv[3] ?? ".";
mkdirSync(OUT, { recursive: true });

const valuenow = (page) =>
  page.evaluate(() => {
    const el = document.querySelector('[role="progressbar"]');
    return el ? Number(el.getAttribute("aria-valuenow")) : -1;
  });

async function fillUntil(page, stopAt, max = 90) {
  for (let n = 0; n < max; n++) {
    if ((await valuenow(page)) >= stopAt) break;
    const ok = await page.evaluate(() => {
      const b = document.querySelector('[aria-label*="Hint" i]');
      if (!b || b.disabled) return false;
      b.click();
      return true;
    });
    if (!ok) break;
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.waitForTimeout(700);
  return valuenow(page);
}

const COMPOSE = async ({ panes, labels, scale }) => {
  const imgs = [];
  for (const p of panes) {
    const im = new Image();
    im.src = "data:image/png;base64," + p;
    await im.decode();
    imgs.push(im);
  }
  const lh = 16;
  const w = Math.max(...imgs.map((i) => i.naturalWidth));
  const h = imgs.reduce((a, i) => a + i.naturalHeight + lh, 0);
  const c = document.createElement("canvas");
  c.width = Math.round(w * scale);
  c.height = Math.round(h * scale);
  const x = c.getContext("2d");
  x.fillStyle = "#808080";
  x.fillRect(0, 0, c.width, c.height);
  x.scale(scale, scale);
  let y = 0;
  x.font = "11px ui-monospace, monospace";
  for (let i = 0; i < imgs.length; i++) {
    x.fillStyle = "#111";
    x.fillRect(0, y, w, lh);
    x.fillStyle = "#eee";
    x.fillText(labels[i], 4, y + 11);
    y += lh;
    x.drawImage(imgs[i], 0, y);
    y += imgs[i].naturalHeight;
  }
  return c.toDataURL("image/png").split(",")[1];
};

async function shoot({ type, scheme, contrast, name, retires }) {
  const browser = await type.launch();
  const ctx = await browser.newContext({
    colorScheme: scheme,
    reducedMotion: "no-preference",
    contrast,
    viewport: { width: 1280, height: 800 },
  });
  const page = await ctx.newPage();
  await page.goto(URL_);
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1400);
  const witness = await page.evaluate(() => ({
    prm: matchMedia("(prefers-reduced-motion: reduce)").matches,
    more: matchMedia("(prefers-contrast: more)").matches,
    coarse: matchMedia("(pointer: coarse)").matches,
  }));
  const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
  const clip = {
    x: Math.round(box.x + box.width * 0.12),
    y: Math.round(box.y - 8),
    width: Math.round(box.width * 0.6),
    height: 22,
  };
  const grab = async () => (await page.screenshot({ clip })).toString("base64");

  const panes = [];
  const labels = [];
  panes.push(await grab());
  labels.push("1 · no gauge (progress 0) — the ground");
  const v1 = await fillUntil(page, 40);
  panes.push(await grab());
  labels.push(`2 · fill ${v1}% — gold ink, the tween RUNNING (no-preference)`);
  const v2 = await fillUntil(page, 88);
  panes.push(await grab());
  labels.push(`3 · fill ${v2}% — the last pressure before the win`);
  // the win is the product's own Solve act, not a threshold: filling by Hint reaches
  // `aria-valuenow` 100 and `.solve-success` never lands (measured, pass 4).
  await page.evaluate(() => document.querySelector('[aria-label="Solve puzzle"]')?.click());
  await page.waitForTimeout(2000);
  const won = await page.evaluate(() => !!document.querySelector(".solve-success"));
  panes.push(await grab());
  labels.push(`4 · WIN (solve-success=${won}) — the lift, one pressure harder`);

  const b64 = await page.evaluate(COMPOSE, { panes, labels, scale: 1 });
  writeFileSync(`${OUT}/${name}`, Buffer.from(b64, "base64"));
  console.log(
    `${name}: ${witness.prm ? "PRM" : "no-preference"} contrast=${contrast} coarse=${witness.coarse} ` +
      `panes ${panes.length} bytes ${Buffer.from(b64, "base64").length} retires ${retires}`,
  );
  await browser.close();
}

await shoot({
  type: chromium,
  scheme: "light",
  contrast: "no-preference",
  name: "win-light-nopref.png",
  retires: "pass3 lift-light-chromium.png",
});
await shoot({
  type: webkit,
  scheme: "dark",
  contrast: "more",
  name: "win-dark-contrast.png",
  retires: "pass3 lift-dark-chromium.png",
});
