/** T9-W7 pass 5 · MRK-ABS — π against the control (74a2b5d9 dist, :4240), prod vs prod (dist A,
 *  :4239), charter row 10: the toggle whose focus rule this diff rewrites is read POSE-PINNED —
 *  the boil parked (PRM) — so its star phases stop being noise. Head-vs-head (control vs control)
 *  runs in the SAME test as the negative control and gives each class its floor. Every rendered
 *  element's tag + computed PAINT properties, one codec payload, both themes, unfocused, after a
 *  real theme flip (the surface is DRIVEN, not read at load). REGIME=default|parked. */
import { test, expect, type Page } from "@playwright/test";
import { bank, mintSudoku, setTheme } from "./abs-lib";
const PROPS = ["color", "fill", "stroke", "stroke-width", "stroke-opacity", "fill-opacity", "font-family", "font-size", "line-height", "background-color", "opacity", "outline-style", "outline-color", "border-top-color", "border-top-width", "border-radius", "filter"];
const REGIME = process.env.REGIME ?? "parked";
async function snap(page: Page) {
  return page.evaluate((PROPS) => [...document.querySelectorAll("body *")].map((n) => {
    const cs = getComputedStyle(n); const r = n.getBoundingClientRect();
    return { tag: n.tagName.toLowerCase(), cls: (n.getAttribute("class") || "").split(/\s+/).slice(0, 2).join("."), p: PROPS.map((k) => cs.getPropertyValue(k)), r: [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 100) / 100) };
  }), PROPS);
}
function diff(a: Awaited<ReturnType<typeof snap>>, b: Awaited<ReturnType<typeof snap>>) {
  const tagSame = a.length === b.length && a.every((x, i) => x.tag === b[i].tag);
  const paint: Record<string, number> = {}; const rect: Record<string, number> = {}; let rectMax = 0; const ex: unknown[] = [];
  if (tagSame) a.forEach((x, i) => { x.p.forEach((v, k) => { if (v !== b[i].p[k]) { const key = `${x.tag}.${x.cls} ${PROPS[k]}`; paint[key] = (paint[key] ?? 0) + 1; if (ex.length < 10) ex.push({ key, a: v, b: b[i].p[k] }); } });
    const dr = Math.max(...x.r.map((v, k) => Math.abs(v - b[i].r[k]))); rectMax = Math.max(rectMax, dr); if (dr > 0.5) { const key = `${x.tag}.${x.cls}`; rect[key] = Math.max(rect[key] ?? 0, Math.round(dr * 100) / 100); } });
  return { nodes: [a.length, b.length], tagSame, paint, rect, rectMax: Math.round(rectMax * 100) / 100, ex };
}
test("π · home · both themes · lane vs control + control vs control", async ({ browser }, info) => {
  test.setTimeout(600000);
  const out: Record<string, unknown> = { engine: info.project.name, regime: REGIME, control: "74a2b5d9 (w7-control dist index-CubiZsMVSwTc.js)", payload: mintSudoku(3) };
  const take = async (base: string, theme: "light" | "dark") => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: REGIME === "parked" ? "reduce" : "no-preference" }); const page = await ctx.newPage();
    await page.goto(`${base}/?size=3&board=${mintSudoku(3)}`);
    await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 60000 }).toBe(81);
    await setTheme(page, theme); await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
    await page.mouse.move(2, 790); await page.waitForTimeout(1500);
    const s = await snap(page); await ctx.close(); return s;
  };
  for (const theme of ["light", "dark"] as const) {
    const lane = await take("http://127.0.0.1:4239", theme), c1 = await take("http://127.0.0.1:4240", theme), c2 = await take("http://127.0.0.1:4240", theme);
    const lv = diff(lane, c1), cc = diff(c1, c2);
    out[theme] = { laneVsControl: lv, controlVsControl: cc };
    console.log(`[π ${info.project.name} ${REGIME} ${theme}] lane-vs-control nodes ${lv.nodes} tags ${lv.tagSame} paintKeys ${Object.keys(lv.paint).length} rectMax ${lv.rectMax} | control-vs-control paintKeys ${Object.keys(cc.paint).length} rectMax ${cc.rectMax}`);
    for (const [k, n] of Object.entries(lv.paint)) console.log(`   L-v-C PAINT ${k} ×${n}${cc.paint[k] ? " (also C-v-C ×" + cc.paint[k] + ")" : ""}`);
    for (const [k, n] of Object.entries(lv.rect)) console.log(`   L-v-C RECT ${k} ${n}${cc.rect[k] ? " (also C-v-C " + cc.rect[k] + ")" : ""}`);
    for (const [k, n] of Object.entries(cc.paint)) if (!lv.paint[k]) console.log(`   C-v-C only PAINT ${k} ×${n}`);
  }
  bank(`pi-${REGIME}-${info.project.name}`, out);
});
