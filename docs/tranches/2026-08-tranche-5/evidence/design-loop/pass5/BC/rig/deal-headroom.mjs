/**
 * deal-headroom.mjs — BC-M3's banked arm.
 *
 * Pass-3 B1's second charge: "B flips Deal's fine-1440 headroom +18.47 -> -10.28, unreported."
 * Pass 4 answered by narration — "the desktop cells read negative in every arm INCLUDING THE
 * P1 BASE" — with no P1-base arm in the evidence set (pass-4 BC-M3). This is that arm.
 *
 * METHOD, re-derived from the only pass-3 artifact that survived (`pass3/rigB/out-deal-*.json`;
 * the rig SCRIPT was never banked). Every cell in that file satisfies
 *   bandTop  = innerHeight - 296        (the measured soft-keypad band, registry §2)
 *   headroom = bandTop - dealBottom     (dealBottom read at the page's MAXIMUM scroll)
 * so those two identities are the method, reconstructed from the data rather than recited.
 *
 * usage: node deal-headroom.mjs <label> --port=N [--cells=1440x900,390x844]
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "..", "runs");
const FE = resolve(HERE, "../../../../../../../../web/frontend/package.json");
const PW = await import(pathToFileURL(createRequire(FE).resolve("@playwright/test")).href);
const engines = {
  chromium: PW.chromium ?? PW.default?.chromium,
  webkit: PW.webkit ?? PW.default?.webkit,
};

const label = process.argv[2] ?? "head";
const port = +(process.argv.find((a) => a.startsWith("--port="))?.slice(7) ?? 4241);
const cells = (
  process.argv.find((a) => a.startsWith("--cells="))?.slice(8) ?? "1440x900,1280x800,390x844"
)
  .split(",")
  .map((c) => c.split("x").map(Number));

const BAND = 296;

const probe = async (page, w, h) => {
  return page.evaluate(
    ({ BAND }) => {
      const deal = document.querySelector(".deal-btn") ?? document.querySelector("[class*='deal']");
      if (!deal) return { err: "no deal button" };
      const doc = document.documentElement;
      const maxScroll = Math.max(0, doc.scrollHeight - innerHeight);
      window.scrollTo(0, maxScroll);
      const r = deal.getBoundingClientRect();
      const bandTop = innerHeight - BAND;
      return {
        regime: {
          coarse: matchMedia("(pointer: coarse)").matches,
          row: matchMedia("(min-width: 1024px)").matches,
          rail: !!document.querySelector(".controls-card .control-panel-wrap"),
          card: !!document.querySelector(".mobile-board-width .control-panel-wrap"),
        },
        maxScroll,
        dealBottom: +r.bottom.toFixed(2),
        bandTop,
        headroom: +(bandTop - r.bottom).toFixed(2),
        clears: bandTop - r.bottom > 0,
      };
    },
    { BAND },
  );
};

const out = { label, port, ts: new Date().toISOString(), cells: {} };
for (const [name, launch] of Object.entries(engines)) {
  const b = await launch.launch();
  for (const [w, h] of cells) {
    const isCoarse = w < 1024;
    const ctx = await b.newContext({
      viewport: { width: w, height: h },
      isMobile: isCoarse,
      hasTouch: isCoarse,
    });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${port}/?game=sudoku&size=3&difficulty=EASY`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
    await page.waitForTimeout(1800);
    const r = await probe(page, w, h);
    const key = `${w}x${h}`;
    out.cells[key] = { ...(out.cells[key] ?? {}), [name]: r };
    console.log(
      `${label.padEnd(9)} ${key.padEnd(9)} ${name.padEnd(9)} headroom ${String(
        r.headroom,
      ).padStart(9)}  dealBottom ${String(r.dealBottom).padStart(8)}  bandTop ${
        r.bandTop
      }  maxScroll ${r.maxScroll}  coarse=${r.regime?.coarse} rail=${r.regime?.rail}`,
    );
    await ctx.close();
  }
  await b.close();
}
mkdirSync(OUT, { recursive: true });
writeFileSync(resolve(OUT, `deal-headroom-${label}.json`), JSON.stringify(out, null, 1));
