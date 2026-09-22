/**
 * MRK-ABS pass 4 — π at rest against the control (74a2b5d9, the chair's pre-built dist on
 * :4240): every rendered element's tag + computed PAINT properties, prototype (:4239) vs control,
 * same encoded board, both themes, unfocused. Rect deltas are banked beside, never alone.
 */
import { test, expect, type Page } from "@playwright/test";
import { bank, mintSudoku, setTheme } from "./abs-lib";
const PROPS = ["color", "fill", "stroke", "stroke-width", "stroke-opacity", "fill-opacity", "font-family", "font-size", "line-height", "background-color", "opacity", "outline-style", "border-top-color", "border-top-width", "filter"];
async function snap(page: Page) {
  return page.evaluate((PROPS) => [...document.querySelectorAll("body *")].map((n) => {
    const cs = getComputedStyle(n); const r = n.getBoundingClientRect();
    return { tag: n.tagName.toLowerCase(), cls: (n.getAttribute("class") || "").split(/\s+/).slice(0, 2).join("."),
      p: PROPS.map((k) => cs.getPropertyValue(k)), r: [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 100) / 100) };
  }), PROPS);
}
test("π at rest · home · both themes", async ({ browser }, info) => {
  const out: Record<string, unknown> = { engine: info.project.name, control: "74a2b5d9 (w7-control dist index-CubiZsMVSwTc.js)" };
  for (const theme of ["light", "dark"] as const) {
    const S: Record<string, Awaited<ReturnType<typeof snap>>> = {};
    for (const [arm, base] of [["proto", process.env.PROTO ?? "http://127.0.0.1:4234"], ["control", process.env.CTRL ?? "http://127.0.0.1:4235"]] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } }); const page = await ctx.newPage();
      await page.goto(`${base}/?size=3&board=${mintSudoku(3)}`);
      await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 60000 }).toBe(81);
      await setTheme(page, theme); await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
      await page.mouse.move(2, 790); await page.waitForTimeout(1500);
      S[arm] = await snap(page); await ctx.close();
    }
    const a = S.proto, b = S.control; const tagSame = a.length === b.length && a.every((x, i) => x.tag === b[i].tag);
    const paint: Record<string, number> = {}; let rectMax = 0; const rectKeys: Record<string, number> = {}; const rectCount: Record<string, number> = {}; const examples: unknown[] = [];
    if (tagSame) a.forEach((x, i) => { x.p.forEach((v, k) => { if (v !== b[i].p[k]) { const key = `${x.tag}.${x.cls} ${PROPS[k]}`; paint[key] = (paint[key] ?? 0) + 1; if (examples.length < 12) examples.push({ key, proto: v, control: b[i].p[k] }); } });
      const dr = Math.max(...x.r.map((v, k) => Math.abs(v - b[i].r[k]))); rectMax = Math.max(rectMax, dr); if (dr > 0.5) { const key = `${x.tag}.${x.cls}`; rectKeys[key] = Math.max(rectKeys[key] ?? 0, Math.round(dr * 100) / 100); rectCount[key] = (rectCount[key] ?? 0) + 1; } });
    out[theme] = { nodes: [a.length, b.length], tagSame, paintDeltaKeys: paint, maxRectDelta: rectMax, rectKeys, examples };
    console.log(`[π ${info.project.name} ${theme}] nodes ${a.length}/${b.length} tags ${tagSame ? "same" : "DIFFER"} paint-delta keys ${Object.keys(paint).length} maxRect ${rectMax}`);
    for (const [k, n] of Object.entries(paint)) console.log(`   ${k} ×${n}`);
    for (const [k, n] of Object.entries(rectKeys)) console.log(`   RECT ${k} max ${n} ×${rectCount[k]}`);
  }
  bank(`pi${process.env.TAG ?? ""}-${info.project.name}`, out);
});
