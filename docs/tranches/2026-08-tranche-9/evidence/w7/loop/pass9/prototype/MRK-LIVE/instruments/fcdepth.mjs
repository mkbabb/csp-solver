// Per-strip forced-colours focus paint (the G-LIVE-21 hostPaint recipe) for the deck card and the
// staging face, with an optional injected sheet (CSS env) — to read a cure before writing it.
import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/paint-lib.mjs";
const base = process.argv[2];
const css = process.env.CSS ?? "";
const dec = (page, buf) => page.evaluate(async (s) => { const bm = await createImageBitmap(await (await fetch("data:image/png;base64," + s)).blob()); const c = new OffscreenCanvas(bm.width, bm.height); const x = c.getContext("2d"); x.drawImage(bm, 0, 0); return Array.from(x.getImageData(0, 0, bm.width, bm.height).data); }, buf.toString("base64"));
const mv = (u, v, i) => Math.max(Math.abs(u[i] - v[i]), Math.abs(u[i + 1] - v[i + 1]), Math.abs(u[i + 2] - v[i + 2])) >= 16;
async function strips(page, sel, focus) {
  const geo = await page.evaluate((sel) => { const el = document.querySelector(sel); const cs = getComputedStyle(el); const w = parseFloat(cs.outlineWidth) || 0; const p = Math.ceil(w + Math.abs(parseFloat(cs.outlineOffset) || 0) + 2); const r = el.getBoundingClientRect(); const L = Math.floor(r.left), T = Math.floor(r.top), R = Math.ceil(r.right), B = Math.ceil(r.bottom);
    return [["top", R - L, { x: L - p, y: T - p, width: R - L + 2 * p, height: p }], ["bottom", R - L, { x: L - p, y: B, width: R - L + 2 * p, height: p }], ["left", B - T, { x: L - p, y: T, width: p, height: B - T }], ["right", B - T, { x: R, y: T, width: p, height: B - T }]]; }, sel);
  const shoot = () => Promise.all(geo.map(([, , c]) => page.screenshot({ clip: c })));
  const on = await shoot(); await page.evaluate(() => document.activeElement.blur()); await page.waitForTimeout(200); const off = await shoot(); await focus(); await page.waitForTimeout(200); const again = await shoot();
  const out = [];
  for (let i = 0; i < 4; i++) { const [p, q, r] = [await dec(page, on[i]), await dec(page, off[i]), await dec(page, again[i])]; let n = 0; for (let j = 0; j < p.length; j += 4) if (!mv(p, r, j) && mv(p, q, j)) n++; out.push(`${geo[i][0]} ${(n / geo[i][1]).toFixed(3)}`); }
  return out.join(" · ");
}
for (const engine of (process.env.ENGINES ?? "chromium,webkit").split(",")) {
  const b = await playwright()[engine].launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce", forcedColors: "active" });
  const page = await ctx.newPage();
  await page.goto(base + "/?view=gallery");
  await page.waitForSelector(".gallery-viewport", { timeout: 60000 });
  await page.waitForTimeout(1500);
  if (css) await page.addStyleTag({ content: css });
  const fv = async () => { await page.evaluate(() => document.querySelector(".gallery-viewport").focus()); };
  await page.keyboard.press("Tab"); await fv(); await page.keyboard.press("Shift"); await page.waitForTimeout(400);
  const id = await page.evaluate(() => document.querySelector(".gallery-viewport").getAttribute("aria-activedescendant"));
  console.log(engine, "card", await strips(page, "#" + id, fv));
  await page.locator(".staging-btn:not([disabled])").first().focus(); await page.keyboard.press("Shift"); await page.waitForTimeout(300);
  await page.evaluate(() => document.activeElement.setAttribute("data-x", ""));
  console.log(engine, "staging", await strips(page, "[data-x]", () => page.evaluate(() => document.querySelector("[data-x]").focus())));
  await b.close();
}
