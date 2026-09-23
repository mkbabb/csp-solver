/** T9-W7 pass 6 · MRK-ABS — π DRIVING FOCUS (charter row 9) against 74a2b5d9 (:4240), with a
 *  control-vs-control arm in the same run as the floor. Whole DOM, tag + computed PAINT properties,
 *  each node keyed by its semantic ancestry (tag.firstClass of itself and three ancestors, plus its
 *  ordinal under that key). Poses: (cell) 9×9 cell 0 keyboard-focused; (deck) the gallery with the
 *  viewport keyboard-focused. PRM parks the boil; both themes; one codec payload. */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { mint, setTheme, settled } from "./p6-lib";
const PROPS = ["color", "fill", "stroke", "stroke-width", "stroke-opacity", "fill-opacity", "font-family", "font-size", "background-color", "opacity", "outline-style", "outline-color", "outline-width", "outline-offset", "border-top-color", "border-top-width", "border-radius", "filter", "box-shadow", "visibility"];
async function snap(page: Page) {
  return page.evaluate((PROPS) => {
    const k1 = (n: Element) => `${n.tagName.toLowerCase()}.${(n.getAttribute("class") || "").trim().split(/\s+/)[0]}`;
    const seen = new Map<string, number>(); const out: Record<string, { p: string[]; r: number[] }> = {};
    for (const n of document.querySelectorAll("body *")) {
      const chain = [n, n.parentElement, n.parentElement?.parentElement, n.parentElement?.parentElement?.parentElement].filter(Boolean).map((x) => k1(x!)).reverse().join(" > ");
      const i = seen.get(chain) ?? 0; seen.set(chain, i + 1);
      const cs = getComputedStyle(n); const r = n.getBoundingClientRect();
      out[`${chain} #${i}`] = { p: PROPS.map((k) => cs.getPropertyValue(k)), r: [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 100) / 100) };
    }
    return out;
  }, PROPS);
}
function diff(a: Awaited<ReturnType<typeof snap>>, b: Awaited<ReturnType<typeof snap>>) {
  const onlyA = Object.keys(a).filter((k) => !(k in b)), onlyB = Object.keys(b).filter((k) => !(k in a));
  const paint: Record<string, number> = {}; const ex: Record<string, string> = {}; const rect: Record<string, number> = {};
  for (const k of Object.keys(a)) { if (!(k in b)) continue;
    a[k].p.forEach((v, i) => { if (v !== b[k].p[i]) { const key = `${k.split(" > ").pop()!.replace(/ #\d+$/, "")} :: ${PROPS[i]}`; paint[key] = (paint[key] ?? 0) + 1; ex[key] ??= `${v} → ${b[k].p[i]}`; } });
    const dr = Math.max(...a[k].r.map((v, i) => Math.abs(v - b[k].r[i]))); if (dr > 0.5) { const key = k.split(" > ").pop()!.replace(/ #\d+$/, ""); rect[key] = Math.max(rect[key] ?? 0, Math.round(dr * 100) / 100); } }
  return { nodes: [Object.keys(a).length, Object.keys(b).length], onlyA: onlyA.length, onlyB: onlyB.length, onlyEx: [...onlyA.slice(0, 3), ...onlyB.slice(0, 3)], paint, ex, rect };
}
test("π driving focus", async ({ browser }, info) => {
  test.setTimeout(900000);
  const payload = mint(3); const res: Record<string, unknown> = { engine: info.project.name, control: "74a2b5d9 index-CubiZsMVSwTc.js", payload };
  const take = async (base: string, theme: "light" | "dark", pose: "cell" | "deck") => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" }); const page = await ctx.newPage();
    if (pose === "cell") {
      await page.goto(`${base}/?size=3&board=${payload}`);
      await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 60000 }).toBe(81);
      await setTheme(page, theme); await page.mouse.move(2, 790);
      await page.locator(".board-shell .game-cell .cell-native-input").nth(0).focus(); await page.keyboard.press("Shift");
      await expect.poll(() => page.evaluate(() => document.querySelectorAll(".game-cell:has(input:focus-visible)").length)).toBe(1);
    } else {
      await page.goto(`${base}/?view=gallery&size=3&board=${payload}`);
      await expect(page.locator(".staging-band")).toBeVisible({ timeout: 30000 }); await settled(page);
      await setTheme(page, theme); await page.mouse.move(2, 790);
      await page.locator(".gallery-viewport").focus(); await page.keyboard.press("Shift");
      await expect.poll(() => page.evaluate(() => document.querySelector(".gallery-viewport")!.matches(":focus-visible"))).toBe(true);
    }
    await settled(page);
    const s = await snap(page); await ctx.close(); return s;
  };
  for (const pose of ["cell", "deck"] as const)
    for (const theme of ["light", "dark"] as const) {
      const lane = await take("http://127.0.0.1:4239", theme, pose), c1 = await take("http://127.0.0.1:4240", theme, pose), c2 = await take("http://127.0.0.1:4240", theme, pose);
      const lv = diff(c1, lane), cc = diff(c1, c2);
      res[`${pose}-${theme}`] = { controlVsLane: lv, controlVsControl: cc };
      console.log(`[π ${info.project.name} ${pose} ${theme}] nodes ${lv.nodes} unmatched ${lv.onlyA}/${lv.onlyB} · C-v-C unmatched ${cc.onlyA}/${cc.onlyB} paintKeys ${Object.keys(cc.paint).length} rectKeys ${Object.keys(cc.rect).length}`);
      for (const [k, n] of Object.entries(lv.paint)) console.log(`   PAINT ${k} ×${n}  (${lv.ex[k]})${cc.paint[k] ? `  [C-v-C ×${cc.paint[k]}]` : ""}`);
      for (const [k, v] of Object.entries(lv.rect)) console.log(`   RECT ${k} ${v}${cc.rect[k] ? `  [C-v-C ${cc.rect[k]}]` : ""}`);
      if (lv.onlyEx.length) console.log(`   UNMATCHED e.g. ${lv.onlyEx.join(" | ")}`);
    }
  writeFileSync(`${process.env.OUT}/pi-${info.project.name}.json`, JSON.stringify(res));
});
