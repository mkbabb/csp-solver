// CTRL-TABS critic — THE pi ABLATION on `--type-option`. typography.css moves the token
// 22px → 20px for every width below 1024. `OptionSelector` is also the gallery's
// (`StagingBand.vue`, `GameCard.vue`), so the question is whether a surface this wave does not
// claim moved. Measured, then ablated: the token is put back to 1.375rem in the page and the
// same nodes are read again. A non-zero delta on a gallery node is a pi row.
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4237/";
const OUT = process.env.OUT || "/tmp/critic-pi.json";

const census = () => {
  const band = document.querySelector(".staging-band");
  const inCard = (el) => !!el.closest(".controls-card");
  const rows = [...document.querySelectorAll(".option-btn, .option-selector button, [class*=option] button, .staging-band button")]
    .map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        t: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 12),
        fs: cs.fontSize,
        w: +r.width.toFixed(2),
        h: +r.height.toFixed(2),
        x: +r.x.toFixed(2),
        y: +r.y.toFixed(2),
        where: inCard(el) ? "card" : el.closest(".staging-band") ? "gallery-band" : "other",
      };
    })
    .filter((r) => r.w > 0);
  return {
    hasBand: !!band,
    bandRect: band
      ? (({ x, y, width, height }) => ({ x: +x.toFixed(2), y: +y.toFixed(2), w: +width.toFixed(2), h: +height.toFixed(2) }))(
          band.getBoundingClientRect(),
        )
      : null,
    token: getComputedStyle(document.documentElement).getPropertyValue("--type-option").trim(),
    rows,
  };
};

const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const [w,h,url] of [[900,500,"?view=gallery"],[834,1112,"?view=gallery"],[900,500,""],[834,1112,""]]) {
    const browser = await (engine === "webkit" ? webkit : chromium).launch();
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
      isMobile: engine === "chromium" ? true : undefined,
      hasTouch: true,
      colorScheme: "light",
    });
    const page = await ctx.newPage();
    await page.goto(BASE + url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);
    const shipped = await page.evaluate(census);
    await page.addStyleTag({ content: ":root{--type-option:1.375rem !important}" });
    await page.waitForTimeout(400);
    const ablated = await page.evaluate(census);
    const moved = shipped.rows
      .map((r, i) => ({ ...r, was: ablated.rows[i] }))
      .filter((r) => r.was && (r.fs !== r.was.fs || Math.abs(r.w - r.was.w) > 0.01 || Math.abs(r.h - r.was.h) > 0.01));
    out[`${w}x${h}${url ? "-gallery" : "-board"}-${engine}`] = {
      token: shipped.token,
      tokenAblated: ablated.token,
      hasBand: shipped.hasBand,
      bandRect: shipped.bandRect,
      bandRectAblated: ablated.bandRect,
      rowCount: shipped.rows.length,
      movedCount: moved.length,
      movedGallery: moved.filter((m) => m.where !== "card").slice(0, 8),
      movedCard: moved.filter((m) => m.where === "card").length,
    };
    await browser.close();
  }
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("EXIT-OK", OUT);
