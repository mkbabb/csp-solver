import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28/web/frontend/e2e/lib/paint-lib.mjs";
const G = "var(--color-pencil-graphite, var(--grid-line-color))";
const refs = {
  p7: `#card-foot svg.ruled-line path { stroke: ${G} !important; }`,
  opac: `#card-foot svg.ruled-line, #card-foot svg.ruled-line path { opacity: 1 !important; } #card-foot svg.ruled-line path { stroke: ${G} !important; }`,
  sop: `#card-foot svg.ruled-line path { stroke-opacity: 1 !important; stroke: ${G} !important; }`,
  filt: `#card-foot svg.ruled-line, #card-foot svg.ruled-line path { filter: none !important; } #card-foot svg.ruled-line path { stroke: ${G} !important; }`,
  p8: `#card-foot#card-foot svg.ruled-line, #card-foot#card-foot svg.ruled-line path { opacity: 1 !important; stroke-opacity: 1 !important; filter: none !important; } #card-foot#card-foot svg.ruled-line path { stroke: ${G} !important; }`,
};
const engine = process.argv[2] ?? "chromium";
const browser = await playwright()[engine].launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: engine === "chromium", hasTouch: true });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4231/?size=3&difficulty=EASY");
await page.waitForSelector(".sudoku-cell .glyph-svg");
await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await page.locator(".drawer-tab").tap();
await page.waitForTimeout(2500);
const box = await page.locator("#card-foot svg.ruled-line").boundingBox();
const clip = { x: box.x, y: box.y - 3, width: box.width, height: box.height + 6 };
console.log("clip", JSON.stringify(clip), "dpr", await page.evaluate(() => devicePixelRatio));
const shot = async (css) => { const t = css ? await page.addStyleTag({ content: css }) : null; const b = (await page.screenshot({ clip })).toString("base64"); if (t) await t.evaluate((n) => n.remove()); return b; };
for (let rep = 0; rep < 2; rep++) for (const [k, ref] of Object.entries(refs)) {
  const on = await shot(null), off = await shot("#card-foot svg.ruled-line { visibility: hidden !important; }"), full = await shot(ref);
  const r = await page.evaluate(async ({ on, off, full }) => {
    const px = async (b64) => { const bmp = await createImageBitmap(await (await fetch("data:image/png;base64," + b64)).blob()); const c = new OffscreenCanvas(bmp.width, bmp.height); const g = c.getContext("2d"); g.drawImage(bmp, 0, 0); return g.getImageData(0, 0, bmp.width, bmp.height); };
    const [a, b, f] = [await px(on), await px(off), await px(full)];
    const mv = []; let same = 0, tot = 0;
    for (let o = 0; o < a.data.length; o += 4) { let k = 0; for (let c = 1; c < 3; c++) if (Math.abs(f.data[o + c] - b.data[o + c]) > Math.abs(f.data[o + k] - b.data[o + k])) k = c; const d = Math.abs(f.data[o + k] - b.data[o + k]); if (d > 24) mv.push({ d, o, k }); tot++; if (a.data[o]===b.data[o]) same++; }
    const ds = mv.map((m) => m.d).sort((x, y) => x - y); const ref = ds[Math.floor(0.98 * (ds.length - 1))];
    const al = mv.filter((m) => m.d >= 0.5 * ref).map((m) => (a.data[m.o + m.k] - b.data[m.o + m.k]) / (f.data[m.o + m.k] - b.data[m.o + m.k])).sort((x, y) => x - y);
    return { n: al.length, alpha: +al[al.length >> 1].toFixed(3), p25: +al[al.length >> 2].toFixed(3), full98: ref };
  }, { on, off, full });
  console.log(engine, rep, k, JSON.stringify(r));
}
await browser.close();
