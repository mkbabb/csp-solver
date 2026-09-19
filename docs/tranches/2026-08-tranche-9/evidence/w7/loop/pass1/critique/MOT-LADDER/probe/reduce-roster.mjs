import { chromium, webkit } from "playwright";

const BASE = process.env.BASE ?? "http://127.0.0.1:4244";

const WALK = () => {
  const out = [];
  const seen = new Set();
  for (const el of document.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    const durs = cs.transitionDuration.split(",").map((s) => s.trim());
    const props = cs.transitionProperty.split(",").map((s) => s.trim());
    const live = durs
      .map((d, i) => ({ d, p: props[i] ?? props[0] }))
      .filter((x) => parseFloat(x.d) > 0);
    if (!live.length) continue;
    const key =
      el.tagName + "." + (el.getAttribute("class") ?? "") + "|" + cs.transitionDuration;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.getAttribute("class") ?? "").slice(0, 70),
      props: live.map((x) => `${x.p} ${x.d}`).join(", "),
    });
  }
  return out;
};

const RUNGS = () => {
  const cs = getComputedStyle(document.documentElement);
  return Object.fromEntries(
    ["whisper", "leave", "note", "dusk", "step", "throw"].map((r) => [
      r,
      cs.getPropertyValue(`--motion-${r}`).trim(),
    ]),
  );
};

async function run(engine, name) {
  const b = await engine.launch();
  const res = { engine: name };
  for (const media of ["reduce", "no-preference"]) {
    const ctx = await b.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      reducedMotion: media,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "/?game=sudoku", { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    res.rungs = await page.evaluate(RUNGS);
    res[`scene-${media}`] = await page.evaluate(WALK);
    // open the gallery (wordmark)
    const mark = page.locator(".handwritten-logo, .wordmark, [aria-label*='gallery' i]").first();
    try {
      await mark.click({ timeout: 3000 });
      await page.waitForTimeout(1200);
      res[`gallery-${media}`] = await page.evaluate(WALK);
    } catch {
      res[`gallery-${media}`] = "could not open gallery";
    }
    await ctx.close();
  }
  await b.close();
  return res;
}

const out = [];
out.push(await run(chromium, "chromium"));
out.push(await run(webkit, "webkit"));
console.log(JSON.stringify(out, null, 1));
