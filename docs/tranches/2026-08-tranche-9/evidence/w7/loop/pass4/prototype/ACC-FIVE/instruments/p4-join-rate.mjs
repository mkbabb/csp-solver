/**
 * ACC-FIVE pass 4 · THE JOIN RING'S RE-CUT, PRICED (pass-3 critique §3.5).
 *
 * The join ring inherited `poseFronts` from the fill gauge and nobody priced it: `useJoinWash`
 * drives `joinProgress` from `createSequenceSubscription`'s onProgress over 740–1180 ms, which
 * on a 120 Hz panel is ~140 frames — roughly 560 `d` writes and ~60 ms of JS per join, against a
 * fill gauge that declared 15. It replaced a `strokeDashoffset` style write that cost no re-parse
 * at all, so the cost went UP.
 *
 * The join is driven the product's own way (`join-language.spec.ts`'s route): A boots on
 * `?wire=local`, presses the well's verb, and B opens the URL A's address bar now carries —
 * ONE browser context, because the local transport is a `BroadcastChannel` scoped to an origin
 * within a context. A's `.join-pose path` `d` writes are what this counts, at no-preference.
 *
 *   node p4-join-rate.mjs <base> <outdir>
 */
import { chromium, webkit } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = process.argv[2] ?? "http://127.0.0.1:4236";
const OUT = process.argv[3] ?? ".";
mkdirSync(OUT, { recursive: true });

const OBSERVE = () => {
  const w = window;
  w.__join = { d: 0, frames: 0, first: 0, last: 0 };
  const seen = new Set();
  const attach = () => {
    document.querySelectorAll(".join-pose path").forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      new MutationObserver((recs) => {
        const t = performance.now();
        for (const r of recs) {
          if (r.attributeName !== "d") continue;
          w.__join.d++;
          if (!w.__join.first) w.__join.first = t;
          if (t - w.__join.last > 0.5) w.__join.frames++;
          w.__join.last = t;
        }
      }).observe(el, { attributes: true, attributeFilter: ["d"] });
    });
  };
  attach();
  new MutationObserver(attach).observe(document.body, { childList: true, subtree: true });
};

const rows = [];
for (const [name, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  const ctx = await browser.newContext({
    colorScheme: "light",
    reducedMotion: "no-preference",
    viewport: { width: 1280, height: 800 },
  });
  const a = await ctx.newPage();
  await a.addInitScript(OBSERVE);
  await a.goto(BASE + "/?wire=local");
  await a.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await a.waitForTimeout(2500);
  await a.evaluate(OBSERVE);

  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  let invited = null;
  try {
    await verb.waitFor({ state: "visible", timeout: 15000 });
    await verb.click();
    await a.waitForTimeout(1200);
    invited = await a.evaluate(() => location.href);
  } catch (e) {
    rows.push({ engine: name, error: `invite verb unreachable: ${String(e).slice(0, 120)}` });
    await browser.close();
    continue;
  }

  const b = await ctx.newPage();
  await b.goto(invited);
  await b.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  // the wash is 740–1180 ms; watch A for twice that
  await a.waitForTimeout(4000);

  const join = await a.evaluate(() => ({
    d: window.__join.d,
    frames: window.__join.frames,
    span: window.__join.last - window.__join.first,
  }));
  const poses = await a.evaluate(() => document.querySelectorAll(".join-pose").length);
  rows.push({
    engine: name,
    invited: !!invited,
    joinPoses: poses,
    dWrites: join.d,
    recutFrames: join.frames,
    spanMs: +join.span.toFixed(1),
    recutsPerSec: join.span > 0 ? +((join.frames / join.span) * 1000).toFixed(1) : 0,
  });
  await browser.close();
}
writeFileSync(`${OUT}/join-rate.json`, JSON.stringify(rows, null, 2));
for (const r of rows)
  console.log(
    r.error
      ? `${r.engine}: ${r.error}`
      : `${r.engine}: join poses ${r.joinPoses} d-writes ${r.dWrites} re-cut frames ${r.recutFrames} ` +
        `span ${r.spanMs}ms RATE ${r.recutsPerSec}/s`,
  );
