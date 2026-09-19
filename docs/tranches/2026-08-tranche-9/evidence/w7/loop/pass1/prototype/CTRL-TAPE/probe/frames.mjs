// T9-W7 pass 1 · CTRL-TAPE PROTOTYPE — the four crops the numbers cannot carry.
//   node frames.mjs <outdir>
// Both engines, crops only, no osascript and no Safari (M19). The dock sheet SLIDES: 700ms+.
const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion";
const { chromium, webkit } = await import(`${ROOT}/web/frontend/node_modules/playwright/index.mjs`);
import { join } from "node:path";
const DIR = process.argv[2];
const BASE = "http://127.0.0.1:4244/";
const engines = { chromium, webkit };

async function shot(engine, opts, file, clip, act) {
  const browser = await engines[engine].launch();
  const ctx = await browser.newContext({ ...opts, deviceScaleFactor: 1 });
  await ctx.addInitScript((d) => {
    try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light"); } catch {}
  }, !!opts.colorScheme && opts.colorScheme === "dark");
  const p = await ctx.newPage();
  await p.goto(`${BASE}?size=3&difficulty=EASY`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await p.waitForTimeout(1600);
  if (act) await act(p);
  await p.waitForTimeout(700);
  await p.screenshot({ path: join(DIR, file), clip: await clip(p) });
  await browser.close();
  console.log("banked", file);
}

const openSheet = async (p) => {
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await p.locator(".drawer-tab").click({ force: true });
    await p.waitForTimeout(950);
  }
};

for (const engine of ["chromium", "webkit"]) {
  // 1 · 390×844 DARK, sheet up — eight tapes, group astride / row flat, the boxed deal,
  //     the wordmark clear of the case stroke (the owner's Frame B pose)
  await shot(engine, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: engine === "chromium", colorScheme: "dark" },
    `p1-dock390-dark-${engine}.png`,
    async (p) => p.evaluate(() => {
      const c = document.querySelector(".controls-card").getBoundingClientRect();
      return { x: 0, y: Math.max(0, Math.floor(c.y) - 46), width: 390, height: Math.min(520, innerHeight - Math.max(0, Math.floor(c.y) - 46)) };
    }),
    openSheet);

  // 2 · 1440×900 rail at scrollTop 500 — R7's own p7 pose: the top tape names the group
  //     under the eye
  await shot(engine, { viewport: { width: 1440, height: 900 } },
    `p2-rail1440-scroll500-${engine}.png`,
    async (p) => p.evaluate(() => {
      const c = document.querySelector(".controls-card").getBoundingClientRect();
      return { x: Math.floor(c.x) - 10, y: Math.floor(c.y) - 10, width: Math.ceil(c.width) + 20, height: 300 };
    }),
    async (p) => {
      await p.evaluate(() => {
        const sc = [...document.querySelectorAll(".controls-card")].find((e) => e.scrollHeight - e.clientHeight > 40);
        sc.scrollTop = 500;
      });
      await p.waitForTimeout(400);
    });

  // 3 · 900×500 sheet up — the bar sticky with its 1.5 frame, and the landscape quick set
  await shot(engine, { viewport: { width: 900, height: 500 }, hasTouch: true, isMobile: engine === "chromium" },
    `p3-land900-bar-${engine}.png`,
    async (p) => p.evaluate(() => {
      const b = document.querySelector(".action-bar").getBoundingClientRect();
      return { x: Math.max(0, Math.floor(b.x)), y: Math.max(0, Math.floor(b.y) - 78), width: Math.min(900, Math.ceil(b.width)), height: Math.min(150, innerHeight - Math.max(0, Math.floor(b.y) - 78)) };
    }),
    openSheet);

  // 4 · 390×844 — the two row tapes, pressed and lifted, with the lifted one's value word
  await shot(engine, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: engine === "chromium" },
    `p4-dock390-tabs-${engine}.png`,
    async (p) => p.evaluate(() => {
      const r = document.querySelector(".mobile-heading-row").getBoundingClientRect();
      const w = document.querySelector(".new-game-zone").getBoundingClientRect();
      return { x: Math.max(0, Math.floor(w.x) - 6), y: Math.max(0, Math.floor(r.y) - 40), width: Math.min(390, Math.ceil(w.width) + 12), height: 118 };
    }),
    openSheet);

  // 5 · 844×390 landscape, sheet SHUT — the quick set on the tongue's flank
  await shot(engine, { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: engine === "chromium" },
    `p5-land844-quickset-${engine}.png`,
    async (p) => p.evaluate(() => {
      const t = document.querySelector(".tongue-strip, .drawer-tab");
      const r = t.getBoundingClientRect();
      return { x: Math.max(0, Math.floor(r.x) - 120), y: Math.max(0, Math.floor(r.y) - 14), width: Math.min(220, innerWidth - Math.max(0, Math.floor(r.x) - 120)), height: Math.min(360, Math.ceil(r.height) + 28) };
    }),
    null);
}
