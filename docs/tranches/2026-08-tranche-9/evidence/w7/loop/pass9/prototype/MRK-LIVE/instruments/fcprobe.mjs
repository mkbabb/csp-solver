// What does the forced-colours focus change paint, column by column, in the deck card's top strip?
import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/paint-lib.mjs";
const base = process.argv[2];
for (const engine of (process.env.ENGINES ?? "chromium").split(",")) {
  const b = await playwright()[engine].launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce", forcedColors: "active" });
  const page = await ctx.newPage();
  await page.goto(base + "/?view=gallery");
  await page.waitForSelector(".gallery-viewport", { timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.keyboard.press("Tab");
  await page.evaluate(() => document.querySelector(".gallery-viewport").focus());
  await page.keyboard.press("Shift");
  await page.waitForTimeout(500);
  const g = await page.evaluate(() => { const v = document.querySelector(".gallery-viewport"); const id = v.getAttribute("aria-activedescendant"); const c = document.getElementById(id); const cs = getComputedStyle(c); const r = c.getBoundingClientRect(); const vr = v.getBoundingClientRect(); const ov = getComputedStyle(v).overflow; return { fv: v.matches(":focus-visible"), ow: cs.outlineWidth, oo: cs.outlineOffset, os: cs.outlineStyle, oc: cs.outlineColor, r: [r.left, r.top, r.right, r.bottom].map(Math.round), vr: [vr.left, vr.top, vr.right, vr.bottom].map(Math.round), ov, cls: c.className }; });
  console.log(engine, JSON.stringify(g));
  const [L, T, R] = g.r;
  const clip = { x: L - 10, y: T - 10, width: 40, height: 14 };
  const on = await page.screenshot({ clip });
  await page.evaluate(() => document.activeElement.blur());
  await page.waitForTimeout(300);
  const off = await page.screenshot({ clip });
  const g2 = await page.evaluate(() => { const c = document.querySelector(".game-card"); const cs = getComputedStyle(c); return { os: cs.outlineStyle, ow: cs.outlineWidth }; });
  console.log("unfocused first card outline", JSON.stringify(g2));
  const dec = async (buf) => page.evaluate(async (s) => { const bm = await createImageBitmap(await (await fetch("data:image/png;base64," + s)).blob()); const c = new OffscreenCanvas(bm.width, bm.height); const x = c.getContext("2d"); x.drawImage(bm, 0, 0); return Array.from(x.getImageData(0, 0, bm.width, bm.height).data); }, buf.toString("base64"));
  const a = await dec(on), z = await dec(off);
  for (let y = 0; y < 14; y++) { let row = ""; for (let x = 0; x < 40; x++) { const i = (y * 40 + x) * 4; const m = Math.max(Math.abs(a[i] - z[i]), Math.abs(a[i + 1] - z[i + 1]), Math.abs(a[i + 2] - z[i + 2])); row += m >= 16 ? "#" : a[i] < 128 ? "o" : "."; } console.log(String(T - 10 + y).padStart(4), row); }
  await b.close();
}
