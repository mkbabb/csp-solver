// T9-W7 pass 2 · CRITIQUE · CTRL-TAPE — probe 3: the DECK (pi on an unclaimed surface) and
// the WebKit confirmations of probe 2's two structural rows.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, webkit } = require(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js",
);

const ENGINE = process.argv[2] || "chromium";
const BASE = process.argv[3] || "http://127.0.0.1:4233";
const launcher = ENGINE === "webkit" ? webkit : chromium;
const out = { engine: ENGINE };
const browser = await launcher.launch();

const DECK_READ = () => {
  const band = document.querySelector(".staging-band");
  const bandTape = band?.querySelector(".washi-label");
  const cards = [...document.querySelectorAll(".gallery-card, [id^='gallery-card-']")];
  const box = (e) =>
    e ? `${e.getBoundingClientRect().width.toFixed(2)}x${e.getBoundingClientRect().height.toFixed(2)}` : null;
  return {
    bandH: band ? +band.getBoundingClientRect().height.toFixed(2) : null,
    bandTapeTag: bandTape?.tagName ?? null,
    bandTapeBox: box(bandTape),
    bandTapeFont: bandTape ? getComputedStyle(bandTape).fontSize : null,
    bandTapeText: bandTape?.textContent.trim().slice(0, 20) ?? null,
    firstCardY: cards[0] ? +cards[0].getBoundingClientRect().top.toFixed(2) : null,
    firstCardBox: box(cards[0]),
    galleryVisible: !!document.querySelector(".game-gallery"),
    // the card's own headings while the deck is up: are they still in the tree?
    cardInert: (() => {
      const c = document.querySelector(".controls-card");
      if (!c) return "no card";
      let n = c,
        flags = [];
      while (n && n !== document.documentElement) {
        if (n.inert) flags.push("inert:" + (n.className || n.tagName));
        if (n.getAttribute && n.getAttribute("aria-hidden") === "true")
          flags.push("aria-hidden:" + (n.className || n.tagName));
        if (getComputedStyle(n).display === "none") flags.push("display-none:" + (n.className || n.tagName));
        n = n.parentElement;
      }
      return flags.length ? flags.join(" | ") : "EXPOSED";
    })(),
    domHeadings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(
      (h) => `${h.tagName}:${h.textContent.trim().slice(0, 14)}`,
    ),
  };
};

for (const [name, w, h] of [
  ["deck-390x844", 390, 844],
  ["deck-1280x800", 1280, 800],
]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const trigger = page.locator("button.logo-trigger").first();
  if (await trigger.count()) {
    await trigger.click().catch(() => {});
    await page.locator(".gallery-viewport").waitFor({ state: "visible", timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1600);
  }
  out[name] = await page.evaluate(DECK_READ);
  // the ACCESSIBILITY tree, which is what pi on the deck actually means
  const snap = await page.locator("body").ariaSnapshot().catch(() => "");
  out[name].axHeadings = (snap.match(/^\s*- heading .*$/gm) || []).map((s) => s.trim());
  await ctx.close();
}

// ── THE SEAL + THE ABSENT PUBLISHER + THE BOOT FRAME, on this engine ──────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/sudoku`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  out.seal = await page.evaluate(() => {
    const w = document.querySelector(".control-panel-wrap");
    return { wrapH: +w.getBoundingClientRect().height.toFixed(2), bound: 1283.5 };
  });
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__caps = [];
    const tick = () => {
      const c = document.querySelector(".controls-card");
      if (c) {
        const mh = getComputedStyle(c).maxHeight;
        const last = window.__caps[window.__caps.length - 1];
        if (!last || last.maxHeight !== mh)
          window.__caps.push({
            t: +performance.now().toFixed(1),
            maxHeight: mh,
            h: +c.getBoundingClientRect().height.toFixed(2),
          });
      }
      if (window.__caps.length < 8 && performance.now() < 6000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.goto(`${BASE}/sudoku`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  out.bootCaps = await page.evaluate(() => window.__caps);
  const tab = page.locator("#drawer-tab, .drawer-tab").first();
  if (await tab.count()) {
    await tab.click({ force: true }).catch(() => {});
    await page.waitForTimeout(900);
  }
  out.absentPublisher = await page.evaluate(() => {
    const read = () => {
      const c = document.querySelector(".controls-card");
      const s = document.querySelector(".scene-controls");
      return {
        maxHeight: getComputedStyle(c).maxHeight,
        clientH: c.clientHeight,
        sheetTop: +s.getBoundingClientRect().top.toFixed(2),
        caseH: +document.querySelector(".drawer-case").getBoundingClientRect().height.toFixed(2),
        wordmarkFoot: +(
          document.querySelector("svg.handwritten-logo")?.getBoundingClientRect().bottom ?? -1
        ).toFixed(2),
      };
    };
    const before = read();
    document.documentElement.style.removeProperty("--masthead-foot");
    document.documentElement.style.removeProperty("--case-offset");
    const after = read();
    return { before, after };
  });
  await ctx.close();
}

console.log(JSON.stringify(out, null, 1));
await browser.close();
