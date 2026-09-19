// T9-W7 pass 1 · CTRL-TAPE — the two crops the numbers cannot carry.
//   node frames.mjs            # HEAD
//   node frames.mjs --overlay  # via the overlay proxy on 4233
const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion";
const { webkit } = await import(`${ROOT}/web/frontend/node_modules/playwright/index.mjs`);
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const ON = process.argv.includes("--overlay");
const BASE = ON ? "http://127.0.0.1:4233/" : "http://127.0.0.1:4230/";
const TAG = ON ? "after" : "head";
const DIR = join(HERE, "..", "frames");

async function shot(opts, file, clip, act) {
  const browser = await webkit.launch();
  const ctx = await browser.newContext({ ...opts, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => { try { localStorage.clear(); } catch {} });
  const p = await ctx.newPage();
  await p.goto(`${BASE}?size=3&difficulty=EASY`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await p.waitForTimeout(1800);
  if (act) await act(p);
  await p.waitForTimeout(600);
  await p.screenshot({ path: join(DIR, file), clip: await clip(p) });
  await browser.close();
}

// 1 · the 390 sheet: the eight names in one voice, the tape astride, the drawn bar
await shot(
  { viewport: { width: 390, height: 844 }, hasTouch: true },
  `p1-dock390-sheet-${TAG}.png`,
  async (p) => ({ x: 0, y: 130, width: 390, height: 520 }),
  async (p) => {
    if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
      await p.locator(".drawer-tab").click({ force: true });
      await p.waitForTimeout(1000);
    }
  },
);

// 2 · the 1440 rail at scrollTop 500 — R7's own p7 pose, the wrong-pinned tape
await shot(
  { viewport: { width: 1440, height: 900 } },
  `p2-rail1440-scroll500-${TAG}.png`,
  async (p) => {
    const b = await p.evaluate(() => {
      const c = document.querySelector(".controls-card").getBoundingClientRect();
      return { x: Math.floor(c.x) - 8, y: Math.floor(c.y) - 8, width: Math.ceil(c.width) + 16, height: 300 };
    });
    return b;
  },
  async (p) => {
    await p.evaluate(() => {
      const sc = [...document.querySelectorAll(".controls-card")].find((e) => e.scrollHeight - e.clientHeight > 40);
      sc.scrollTop = 500;
    });
  },
);
console.log("frames banked", TAG);
