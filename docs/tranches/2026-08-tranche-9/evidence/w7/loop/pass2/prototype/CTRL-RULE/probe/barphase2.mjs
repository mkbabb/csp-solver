// The foot's rule reads ~2.59 at 390/chromium whatever the seed, against 3.53 for the seven
// card rules in the same session. Seed, stroke and ink are all held; what is left is where the
// band lands on the device grid. Sweep the phase.
const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;
const rl = (r, g, b) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [rl(...a), rl(...b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  hasTouch: true,
  isMobile: true,
  colorScheme: "light",
});
await ctx.addInitScript(() => {
  try {
    localStorage.clear();
    localStorage.setItem("sudoku-color-scheme", "light");
  } catch {}
});
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4231/?size=3&difficulty=EASY", {
  waitUntil: "domcontentloaded",
});
await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
await page.waitForTimeout(1200);
if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
  await page.locator(".drawer-tab").first().click({ force: true });
  await page.waitForTimeout(950);
}
async function read(sel) {
  const box = await page.evaluate((s) => {
    const el = document.querySelector(s);
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x),
      y: Math.max(0, Math.round(r.y - 4)),
      width: Math.round(r.width),
      height: Math.round(r.height + 8),
      _y: r.y,
      _h: r.height,
    };
  }, sel);
  const clip = { x: box.x, y: box.y, width: box.width, height: box.height };
  const buf = await page.screenshot({ clip });
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = (x, y) => {
    const o = (y * info.width + x) * info.channels;
    return [data[o], data[o + 1], data[o + 2]];
  };
  let ground = px(0, 0),
    bl = -1;
  for (let x = 0; x < info.width; x++)
    for (let y = 0; y < info.height; y++) {
      const c = px(x, y),
        L = rl(...c);
      if (L > bl) {
        bl = L;
        ground = c;
      }
    }
  const cols = [];
  for (let x = 0; x < info.width; x++) {
    let best = 1;
    for (let y = 0; y < info.height; y++) best = Math.max(best, ratio(px(x, y), ground));
    cols.push(best);
  }
  return { worst: +Math.min(...cols).toFixed(3), y: box._y, h: box._h };
}
console.log("card rule[0]", JSON.stringify(await read(".rp-rule")));
for (const sw of [2, 2.25, 2.5, 3]) {
  const tag = await page.addStyleTag({ content: `:root{--rp-rule-stroke:${sw}}` });
  await page.waitForTimeout(140);
  console.log("stroke", sw, "bar", JSON.stringify(await read(".bar-rule")), "card", JSON.stringify(await read(".rp-rule")));
  await page.evaluate((h) => h.remove(), tag);
}
await browser.close();
