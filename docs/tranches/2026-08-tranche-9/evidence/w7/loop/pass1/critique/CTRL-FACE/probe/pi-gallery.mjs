/**
 * CTRL-FACE pass-1 CRITIC — PI on the gallery, nailed. `.washi-tag` is a SHARED class and
 * `StagingBand.vue:130` renders one (`text="new game" anchor="tag"`), so the face law re-faces a
 * surface this family never claims and never framed. Measured twice per cell: as built, then with
 * HEAD's own `.washi-tag` declarations restored in-page, with a settle between.
 *   BASE=http://127.0.0.1:4242/ node probe/pi-gallery.mjs
 */
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const BASE = process.env.BASE || "http://127.0.0.1:4242/";

const READ = () => {
  const tag = document.querySelector(".washi-tag");
  const cs = getComputedStyle(tag);
  const n = (v) => +parseFloat(v).toFixed(2);
  const r = tag.getBoundingClientRect();
  const card = document.querySelector("#gallery-card-0");
  const cr = card.getBoundingClientRect();
  const deck = document.querySelector(".gallery-viewport") ?? card.parentElement;
  const dr = deck.getBoundingClientRect();
  return {
    family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
    fontSize: n(cs.fontSize),
    weight: cs.fontWeight,
    lineHeight: cs.lineHeight,
    marginTop: n(cs.marginTop),
    marginBottom: n(cs.marginBottom),
    offsetH: +tag.offsetHeight.toFixed(2),
    netFlow: +(n(cs.marginTop) + tag.offsetHeight + n(cs.marginBottom)).toFixed(2),
    paintedBox: { w: +r.width.toFixed(2), h: +r.height.toFixed(2), y: +r.y.toFixed(2) },
    card: { y: +cr.y.toFixed(2), h: +cr.height.toFixed(2) },
    deck: { y: +dr.y.toFixed(2), h: +dr.height.toFixed(2) },
  };
};

const rows = [];
for (const [eng, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await L.launch();
  for (const cell of [
    { name: "gallery-1280x800", w: 1280, h: 800, mobile: false },
    { name: "gallery-390x844", w: 390, h: 844, mobile: true },
  ]) {
    const ctx = await b.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile && eng === "chromium",
      colorScheme: "dark",
    });
    const p = await ctx.newPage();
    await p.goto(BASE + "?view=gallery&size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await p.waitForSelector("#gallery-card-0 .boil-pose", { timeout: 60000 });
    await p.waitForTimeout(2500); // the deck deals and glides — settle before a box is read
    const asBuilt = await p.evaluate(READ);
    await p.evaluate(() => {
      const s = document.createElement("style");
      s.id = "crit-head-ablation";
      s.textContent =
        ".washi-tag{font-family:var(--font-hand)!important;font-size:var(--type-tag)!important;font-weight:500!important;line-height:1.5!important;margin-top:calc(-1.5em - 0.04rem - var(--washi-tag-lift, 0px))!important;}";
      document.head.appendChild(s);
    });
    await p.waitForTimeout(1200);
    const head = await p.evaluate(READ);
    rows.push({ eng, cell: cell.name, asBuilt, headAblation: head });
    await ctx.close();
  }
  await b.close();
}
console.log(JSON.stringify(rows, null, 1));
