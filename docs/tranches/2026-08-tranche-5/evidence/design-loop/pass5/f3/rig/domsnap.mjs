/**
 * PASS-5 F3 · domsnap.mjs — the T′ identity instrument.
 *
 * The T′ collapse's safety property is that it changes SOURCE, never RENDER. That property is
 * measurable, so it is measured: for each arm this captures, for the mounted control panel,
 * (a) the normalized element tree — tag + classes + a11y surface, with `useId` serials erased,
 * and (b) every element's rounded rect. Two arms are identical iff both blobs match byte for
 * byte. A diff is a finding, never a rounding note.
 *
 * BORN-RED ARM: `--ablate` injects one extra washi label into the mobile card before capture —
 * the exact class of divergence a careless collapse would ship (the fine-pointer hover washi
 * leaking onto coarse). The instrument must see it. Run it before trusting a green.
 *
 * Usage: node domsnap.mjs <baseURL> <engine> <outfile> [--ablate] [--mobile|--rail]
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const [, , baseURL, engineName, outfile, ...flags] = process.argv;
const ablate = flags.includes("--ablate");
const rail = flags.includes("--rail");
const engine = engineName === "webkit" ? webkit : chromium;

const capture = (rootSel) => {
  const root = document.querySelector(rootSel);
  if (!root) return { error: `no ${rootSel}` };
  // `useId` mints per-instance serials (v-0-1…); they carry no design meaning and differ
  // between mounts, so they are erased rather than compared.
  const norm = (s) =>
    (s ?? "").replace(/\bv-\d+-\d+\b/g, "ID").replace(/\s+/g, " ").trim();
  const nodes = [];
  const walk = (el, depth) => {
    const r = el.getBoundingClientRect();
    nodes.push({
      d: depth,
      tag: el.tagName.toLowerCase(),
      cls: norm(el.className.toString()),
      role: el.getAttribute("role"),
      label: norm(el.getAttribute("aria-label")),
      labelledby: el.getAttribute("aria-labelledby") ? "ID" : null,
      expanded: el.getAttribute("aria-expanded"),
      text: el.children.length === 0 ? norm(el.textContent).slice(0, 40) : null,
      rect: [
        Math.round(r.left * 100) / 100,
        Math.round(r.top * 100) / 100,
        Math.round(r.width * 100) / 100,
        Math.round(r.height * 100) / 100,
      ],
      disp: getComputedStyle(el).display,
    });
    for (const c of el.children) walk(c, depth + 1);
  };
  walk(root, 0);
  return { count: nodes.length, nodes };
};

const browser = await engine.launch();
const ctx = await browser.newContext({
  viewport: rail ? { width: 1440, height: 900 } : { width: 390, height: 664 },
  hasTouch: !rail,
  isMobile: !rail && engineName !== "webkit",
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto(`${baseURL}/?size=3&difficulty=EASY`, { waitUntil: "load" });
await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
await page.addStyleTag({ content: ".tuner-toggle{display:none !important}" });
await page
  .waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, {
    timeout: 20000,
  })
  .catch(() => {});
await page.waitForTimeout(600);

if (ablate) {
  // the divergence a careless collapse ships: one hover-washi leaking into the coarse card
  await page.evaluate(() => {
    const host = document.querySelector(".control-panel-wrap .deal-btn");
    const w = document.createElement("span");
    w.className = "washi-label";
    w.textContent = "Deal";
    host?.appendChild(w);
  });
  await page.waitForTimeout(150);
}

const snap = await page.evaluate(capture, ".control-panel-wrap");
await browser.close();
writeFileSync(outfile, JSON.stringify(snap, null, 1));
console.log(`${outfile}\tnodes=${snap.count}\tablate=${ablate}\trail=${rail}`);
