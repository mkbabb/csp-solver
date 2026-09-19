/** CRITIC — the pi delta attributed: the HEAD ablation SCOPED to the staging band's own tape,
 *  so nothing in the (hidden) controls card can be the cause. */
const { chromium, webkit } = await import("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs");
const BASE = process.env.BASE || "http://127.0.0.1:4242/";
const READ = () => {
  const t = document.querySelector(".staging-band .washi-tag");
  const cs = getComputedStyle(t); const r = t.getBoundingClientRect();
  const card = document.querySelector("#gallery-card-0").getBoundingClientRect();
  const band = document.querySelector(".staging-band").getBoundingClientRect();
  const n = (v) => +parseFloat(v).toFixed(2);
  return { family: cs.fontFamily.split(",")[0].replace(/["']/g,"").trim(), px: n(cs.fontSize), weight: cs.fontWeight,
    lh: n(cs.lineHeight), mt: n(cs.marginTop), mb: n(cs.marginBottom), offsetH: t.offsetHeight,
    netFlow: +(n(cs.marginTop) + t.offsetHeight + n(cs.marginBottom)).toFixed(2),
    box: { w: +r.width.toFixed(2), h: +r.height.toFixed(2), y: +r.y.toFixed(2) },
    band: { y: +band.y.toFixed(2), h: +band.height.toFixed(2) }, card: { y: +card.y.toFixed(2) } };
};
const rows = [];
for (const [eng, L] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await L.launch();
  for (const cell of [{ n: "gallery-1280x800", w: 1280, h: 800, m: false }, { n: "gallery-390x844", w: 390, h: 844, m: true }]) {
    const ctx = await b.newContext({ viewport: { width: cell.w, height: cell.h }, hasTouch: cell.m, isMobile: cell.m && eng === "chromium", colorScheme: "dark" });
    const p = await ctx.newPage();
    await p.goto(BASE + "?view=gallery&size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await p.waitForSelector("#gallery-card-0 .boil-pose", { timeout: 60000 });
    await p.waitForTimeout(2500);
    const built = await p.evaluate(READ);
    await p.evaluate(() => {
      const s = document.createElement("style");
      s.textContent = ".staging-band .washi-tag{font-family:var(--font-hand)!important;font-size:var(--type-tag)!important;font-weight:500!important;line-height:1.5!important;margin-top:calc(-1.5em - 0.04rem - var(--washi-tag-lift, 0px))!important;}";
      document.head.appendChild(s);
    });
    await p.waitForTimeout(1000);
    const head = await p.evaluate(READ);
    rows.push({ eng, cell: cell.n, built, head });
    await ctx.close();
  }
  await b.close();
}
console.log(JSON.stringify(rows, null, 1));
