/**
 * BC6-G1 live proof, both arms, against the BUILT dist on :4251.
 *
 *   ARM A (the cure)            a SUB-PIXEL nudge of the rendered box must NOT re-key the bake.
 *   ARM B (negative control)    a WHOLE-PIXEL nudge MUST re-key it, or the latch is just frozen.
 *
 * The nudge rides `--logo-scale`, which the SFC's CSS already multiplies into `--logo-height`;
 * width follows by the SVG's aspect ratio, so scaling is a real layout change the ResizeObserver
 * sees — not a poked ref.
 */
import { webkit, chromium } from "@playwright/test";

const BASE = "http://localhost:4251";
const GAMES = ["sudoku", "futoshiki", "thermo", "killer", "kenken"];

async function read(page) {
  return page.evaluate(async () => {
    const svg = document.querySelector("svg.handwritten-logo");
    const img = svg.querySelector("image.logo-pose-bmp");
    const href = img?.getAttribute("href") ?? null;
    const nat = await new Promise((ok) => {
      if (!href) return ok(null);
      const i = new Image();
      i.onload = () => ok(i.naturalWidth);
      i.onerror = () => ok(null);
      i.src = href;
    });
    return { w: +svg.getBoundingClientRect().width.toFixed(4), href, nat };
  });
}

async function arm(engine, name) {
  const b = await engine.launch();
  const rows = [];
  for (const game of GAMES) {
    const ctx = await b.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?game=${game}&size=3&difficulty=EASY`);
    await page.waitForSelector("svg.handwritten-logo image.logo-pose-bmp");
    await page.waitForTimeout(1200);
    const base = await read(page);

    // ARM A — sub-pixel. 1.0008 on a ~380px box is ~0.30 css px, well under one pixel and
    // an order above the 0.0313 px margin the incumbent's 1px grid was operating on.
    await page.evaluate(() =>
      document.documentElement.style.setProperty("--logo-scale", "1.0008"),
    );
    await page.waitForTimeout(1400);
    const sub = await read(page);

    // ARM B — whole-pixel. 1.05 on the same box is ~19 css px.
    await page.evaluate(() =>
      document.documentElement.style.setProperty("--logo-scale", "1.05"),
    );
    await page.waitForTimeout(1600);
    const whole = await read(page);

    rows.push({
      game,
      baseW: base.w,
      baseNat: base.nat,
      subW: sub.w,
      subDeltaPx: +(sub.w - base.w).toFixed(4),
      subNat: sub.nat,
      A_subPixelHeldKey: sub.href === base.href && sub.nat === base.nat,
      wholeW: whole.w,
      wholeDeltaPx: +(whole.w - base.w).toFixed(4),
      wholeNat: whole.nat,
      B_wholePixelRekeyed: whole.nat !== base.nat,
    });
    await ctx.close();
  }
  await b.close();
  console.log(`\n== ${name} ==`);
  for (const r of rows) console.log(JSON.stringify(r));
  const a = rows.every((r) => r.A_subPixelHeldKey);
  const bb = rows.every((r) => r.B_wholePixelRekeyed);
  console.log(`${name}: ARM A (sub-pixel held) ${a ? "PASS" : "FAIL"} 5/5=${
    rows.filter((r) => r.A_subPixelHeldKey).length
  } · ARM B (whole-pixel re-keyed) ${bb ? "PASS" : "FAIL"} 5/5=${
    rows.filter((r) => r.B_wholePixelRekeyed).length
  }`);
}

await arm(webkit, "webkit");
await arm(chromium, "chromium");
