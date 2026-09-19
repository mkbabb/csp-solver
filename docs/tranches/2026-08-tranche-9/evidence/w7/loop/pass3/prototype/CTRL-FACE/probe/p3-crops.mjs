/** T9-W7 pass 3 · CTRL-FACE · the three cited crops. */
import { chromium, webkit } from "playwright";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/CTRL-FACE/frames";

async function dock(engine, name, scheme, file, sel, pad = 8) {
  const b = await engine.launch();
  const ctx = await b.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: name === "chromium",
    colorScheme: scheme,
    reducedMotion: "reduce",
  });
  const p = await ctx.newPage();
  await p.goto("http://127.0.0.1:4234/?size=3&difficulty=EASY", { waitUntil: "load" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
  await p.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  const tab = p.locator(".drawer-tab");
  if (await tab.isVisible().catch(() => false)) {
    await tab.tap();
    await p.waitForTimeout(900);
  }
  const el = p.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(300);
  const box = await el.boundingBox();
  await p.screenshot({
    path: `${OUT}/${file}`,
    clip: {
      x: Math.max(0, box.x - pad),
      y: Math.max(0, box.y - pad),
      width: Math.min(390, box.width + pad * 2),
      height: box.height + pad * 2,
    },
  });
  await b.close();
  console.log(`${file}: ${JSON.stringify(box)}`);
}

async function chipZoom(engine, name, file) {
  const b = await engine.launch();
  const ctx = await b.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 4,
    hasTouch: true,
    isMobile: name === "chromium",
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const p = await ctx.newPage();
  await p.goto("http://127.0.0.1:4234/?size=3&difficulty=EASY", { waitUntil: "load" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
  await p.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  const tab = p.locator(".drawer-tab");
  if (await tab.isVisible().catch(() => false)) {
    await tab.tap();
    await p.waitForTimeout(900);
  }
  const chip = p.locator('.controls-card .tray-well .ctrl-btn[aria-pressed="true"]').first();
  await chip.scrollIntoViewIfNeeded();
  await p.waitForTimeout(250);
  await chip.screenshot({ path: `${OUT}/${file}` });
  await b.close();
  console.log(file);
}

await dock(chromium, "chromium", "dark", "f1-dock-dark-pencils-lane-chromium.png", ".tray-well:nth-of-type(2), .tray-well:has(.zone-row-label)");
await dock(chromium, "chromium", "light", "f2-dock-light-checking-over-what-fits-chromium.png", ".zone-row:has(.zone-row-label)", 4);
await chipZoom(chromium, "chromium", "f3a-chip-mark-4x-chromium.png");
await chipZoom(webkit, "webkit", "f3b-chip-mark-4x-webkit.png");
