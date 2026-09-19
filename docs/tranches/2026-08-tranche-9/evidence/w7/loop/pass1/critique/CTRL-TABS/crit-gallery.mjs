// T9-W7 pass-1 CRITIC — the GALLERY, which CTRL-TABS does not claim. `?view=gallery`.
// The question: does `--type-option: 22 → 20` at ≤1023.98px move the staging band's chips?
import { chromium, webkit } from "playwright";
const ARMS = { head: "http://127.0.0.1:4242/", proto: "http://127.0.0.1:4240/" };
const CELLS = [
  { name: "390x844", w: 390, h: 844, coarse: true },
  { name: "800x600", w: 800, h: 600, coarse: false },
  { name: "900x500", w: 900, h: 500, coarse: true },
  { name: "1024x768", w: 1024, h: 768, coarse: false },
  { name: "1280x800", w: 1280, h: 800, coarse: false },
];
const read = () => {
  const band = document.querySelector(".staging-band") || document.querySelector("[class*=staging]");
  const chips = [...document.querySelectorAll(".staging-band .ctrl-btn, [class*=staging] .ctrl-btn")].map((e) => {
    const r = e.getBoundingClientRect();
    return { t: e.innerText.trim().slice(0, 10), fs: getComputedStyle(e).fontSize, x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
  });
  const labels = [...document.querySelectorAll(".staging-axis-label")].map((e) => {
    const r = e.getBoundingClientRect();
    return { t: e.innerText.trim().slice(0, 10), fs: getComputedStyle(e).fontSize, ff: getComputedStyle(e).fontFamily.split(",")[0].replace(/["']/g, ""), x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2) };
  });
  const allChips = document.querySelectorAll(".ctrl-btn").length;
  const bandBox = band ? (({ x, y, width, height }) => ({ x: +x.toFixed(2), y: +y.toFixed(2), w: +width.toFixed(2), h: +height.toFixed(2) }))(band.getBoundingClientRect()) : null;
  const cards = [...document.querySelectorAll(".game-card, [class*=gallery-card]")].map((e) => {
    const r = e.getBoundingClientRect();
    return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
  });
  return { chips, labels, allChips, bandBox, cards, opt: getComputedStyle(document.documentElement).getPropertyValue("--type-option").trim(), gt: getComputedStyle(document.documentElement).getPropertyValue("--type-group-title").trim(), view: location.search };
};
const out = {};
for (const engine of ["chromium", "webkit"]) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  for (const cell of CELLS) {
    for (const [arm, base] of Object.entries(ARMS)) {
      const ctx = await browser.newContext({ viewport: { width: cell.w, height: cell.h }, deviceScaleFactor: 1, hasTouch: cell.coarse, isMobile: cell.coarse && engine === "chromium" ? true : undefined, colorScheme: "light" });
      await ctx.addInitScript(() => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", "light"); } catch {} });
      const page = await ctx.newPage();
      await page.goto(base + "?view=gallery", { waitUntil: "domcontentloaded" });
      await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
      await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
      await page.waitForTimeout(2500);
      out[`${cell.name}-${engine}-${arm}`] = await page.evaluate(read);
      await ctx.close();
    }
  }
  await browser.close();
}
for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    const h = out[`${cell.name}-${engine}-head`], p = out[`${cell.name}-${engine}-proto`];
    const fsH = [...new Set(h.chips.map((c) => c.fs))].join("/") || "—";
    const fsP = [...new Set(p.chips.map((c) => c.fs))].join("/") || "—";
    const lH = [...new Set(h.labels.map((c) => c.fs))].join("/") || "—";
    const lP = [...new Set(p.labels.map((c) => c.fs))].join("/") || "—";
    const widthsH = h.chips.map((c) => c.w).join(",");
    const widthsP = p.chips.map((c) => c.w).join(",");
    console.log(
      `${cell.name} ${engine}: chips ${h.chips.length}/${p.chips.length} fs ${fsH} -> ${fsP} | labels fs ${lH} -> ${lP} | --type-option ${h.opt} -> ${p.opt} | --type-group-title ${h.gt} -> ${p.gt}` +
        (widthsH !== widthsP ? `\n    CHIP WIDTHS MOVED: [${widthsH}] -> [${widthsP}]` : "") +
        (JSON.stringify(h.bandBox) !== JSON.stringify(p.bandBox) ? `\n    BAND BOX MOVED: ${JSON.stringify(h.bandBox)} -> ${JSON.stringify(p.bandBox)}` : "") +
        (JSON.stringify(h.cards) !== JSON.stringify(p.cards) ? `\n    CARD BOXES MOVED: ${JSON.stringify(h.cards)} -> ${JSON.stringify(p.cards)}` : ""),
    );
  }
}
