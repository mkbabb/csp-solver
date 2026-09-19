// T9-W7 pass 3 · RESEARCH · CTRL-RULE — THE THIRD OCCLUDER, MEASURED (critique gap 3/4).
//
// `ConfirmRibbon.vue:113` is `position: absolute; bottom: 100%; z-index: 70; background:
// var(--color-card); width: max-content; max-width: min(20rem, 92%)`. The prototype's occlusion
// predicate filters `sticky|fixed` (`prototype/CTRL-RULE/instruments/census.mjs:150`), so an
// OPAQUE ABSOLUTE BOX OVER LIVE CONTROLS is invisible to it — the same blind spot as the
// pseudo-element, one position value over.
//
// This reads, while the ribbon is armed on a dirty board: the ribbon's rect, its ∩ with every
// control in the card and in the foot, and the control rows that share its visual band (the
// critic's frame-3 finding — `keep [clear] ff Ask Live` on one baseline). The ribbon's own two
// verbs are excluded; they are its content, not its victims.
//
// READ-ONLY on product files.
//
//   node ribbon-intersect.mjs   [BASE=http://127.0.0.1:4231/]
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://127.0.0.1:4231/";

const READ = () => {
  const rib = document.querySelector(".confirm-ribbon");
  if (!rib) return { armed: false };
  const rb = rib.getBoundingClientRect();
  const frac = (a, b) => {
    const w = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const h = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return b.width && b.height ? (w * h) / (b.width * b.height) : 0;
  };
  const scope = [document.querySelector(".controls-card"), document.querySelector("#card-foot")]
    .filter(Boolean)
    .flatMap((r) => [
      ...r.querySelectorAll('button, [tabindex="0"], input, select, a[href]'),
    ])
    .filter((e) => !rib.contains(e))
    .filter((e) => {
      const b = e.getBoundingClientRect();
      return b.width > 0 && b.height > 0;
    });
  const hit = [];
  let bandShare = [];
  for (const e of scope) {
    const b = e.getBoundingClientRect();
    const f = frac(rb, b);
    if (f > 0) hit.push({ t: (e.textContent || "").trim().slice(0, 18), frac: +f.toFixed(3) });
    // the BAND test: a control whose vertical centre falls inside the ribbon's band reads on
    // the ribbon's own line even when x-disjoint (frame 3's `keep [clear] ff Ask Live`).
    const mid = b.top + b.height / 2;
    if (mid >= rb.top && mid <= rb.bottom)
      bandShare.push({
        t: (e.textContent || "").trim().slice(0, 18),
        x: +b.left.toFixed(1),
        y: +mid.toFixed(1),
      });
  }
  const verbs = [...rib.querySelectorAll(".confirm-face")].map((v) => {
    const b = v.getBoundingClientRect();
    return { t: v.textContent.trim(), w: +b.width.toFixed(2), h: +b.height.toFixed(2) };
  });
  const foot = document.querySelector("#card-foot")?.getBoundingClientRect();
  return {
    armed: true,
    ribbon: {
      x: +rb.left.toFixed(2),
      y: +rb.top.toFixed(2),
      w: +rb.width.toFixed(2),
      h: +rb.height.toFixed(2),
      z: getComputedStyle(rib).zIndex,
      position: getComputedStyle(rib).position,
      bg: getComputedStyle(rib).backgroundColor,
    },
    footWidth: foot ? +foot.width.toFixed(2) : null,
    ribbonShareOfFoot: foot ? +(rb.width / foot.width).toFixed(3) : null,
    verbs,
    controlsIntersected: hit,
    controlsSharingTheBand: bandShare,
  };
};

const out = { base: BASE, generated: new Date().toISOString(), engines: {} };
for (const engine of ["chromium", "webkit"]) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    hasTouch: true,
    colorScheme: "light",
  });
  await ctx.addInitScript(() => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", "light");
    } catch {}
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1200);

  // DIRTY THE BOARD — a given refuses the write at the model too, so type until a digit lands
  // (the pass-2 probe defect, cured there and carried here).
  const cells = page.locator(".game-cell input:not([readonly]):not([disabled])");
  const n = Math.min(await cells.count(), 12);
  let dirty = false;
  for (let i = 0; i < n && !dirty; i++) {
    await cells
      .nth(i)
      .click({ force: true })
      .catch(() => {});
    await page.keyboard.type("1");
    await page.waitForTimeout(220);
    dirty = await cells
      .nth(i)
      .inputValue()
      .then((v) => v.trim() === "1")
      .catch(() => false);
  }
  await page.waitForTimeout(300);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").first().click({ force: true });
    await page.waitForTimeout(950); // THE SHEET SLIDES
  }
  await page
    .locator("#card-foot button", { hasText: /^clear$/i })
    .first()
    .click({ force: true })
    .catch(() => {});
  await page.waitForTimeout(600);
  out.engines[engine] = { dirty, ...(await page.evaluate(READ)) };
  console.log(
    engine,
    "dirty",
    dirty,
    "|",
    JSON.stringify({
      ribbon: out.engines[engine].ribbon,
      share: out.engines[engine].ribbonShareOfFoot,
      hit: out.engines[engine].controlsIntersected,
      band: out.engines[engine].controlsSharingTheBand,
    }),
  );
  await browser.close();
}
writeFileSync(join(OUT, "ribbon-intersect.json"), JSON.stringify(out, null, 2));
console.log("EXIT OK");
