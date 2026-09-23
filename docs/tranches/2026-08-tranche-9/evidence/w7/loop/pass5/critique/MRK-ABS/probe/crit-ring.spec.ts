import { test, expect, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
type RGB = number[];
const lin = (c: number) => (c / 255 <= 0.04045 ? c / 255 / 12.92 : Math.pow((c / 255 + 0.055) / 1.055, 2.4));
const lum = (c: RGB) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (a: RGB, b: RGB) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
const dist = (a: RGB, b: RGB) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
const r3 = (x: number) => Math.round(x * 1000) / 1000;
function mint(sub: number): string {
  const n = sub * sub; let cells = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const i = r * n + c; const keep = i > 1 && (r * 7 + c * 3) % 5 < 2; cells += (keep ? ((r * sub + Math.floor(r / sub) + c) % n) + 1 : 0).toString(36); }
  return btoa(String.fromCharCode(1) + `${sub}.${cells}`).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
const settled = (page: Page) => expect.poll(() => page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && a.effect?.getTiming().iterations !== Infinity).length), { timeout: 15000 }).toBe(0);
async function setTheme(page: Page, want: "light" | "dark") {
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
  if ((await isDark()) !== (want === "dark")) { await page.locator("button.sun-moon-toggle").first().focus(); await page.keyboard.press("Enter"); await expect.poll(isDark, { timeout: 10000 }).toBe(want === "dark"); }
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.()); await settled(page);
}
async function pixels(page: Page, clip: { x: number; y: number; width: number; height: number }) {
  const png = await page.screenshot({ clip, scale: "css" });
  const data: number[] = await page.evaluate(async ({ b64, w, h }) => { const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode(); const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d")!; g.drawImage(img, 0, 0); return Array.from(g.getImageData(0, 0, w, h).data); }, { b64: png.toString("base64"), w: clip.width, h: clip.height });
  return (x: number, y: number): RGB | null => { const px = Math.round(x - clip.x), py = Math.round(y - clip.y); if (px < 0 || py < 0 || px >= clip.width || py >= clip.height) return null; const o = (py * clip.width + px) * 4; return [data[o], data[o + 1], data[o + 2]]; };
}
const ARM = process.env.ARM ?? "x";
test("crit: whole ring of cell 0 at 16x16 + G9 box reconciliation", async ({ page }, info) => {
  test.setTimeout(240000);
  const engine = info.project.name;
  const payload = mint(4);
  await page.goto(`/?size=4&board=${payload}`);
  await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(256);
  await expect.poll(() => page.evaluate(() => new URLSearchParams(location.search).get("board"))).toBe(payload);
  const out: any = { engine, arm: ARM, payload };
  // G9: the ghost's own cell square through its CTM vs the DOM cell box (cells 0, 17, 255)
  out.box = await page.evaluate(() => [0, 17, 255].map((i) => {
    const cell = document.querySelectorAll(".board-shell .game-cell")[i] as HTMLElement;
    const p = cell.querySelector(".cell-ghost-path") as SVGPathElement; const m = p.getScreenCTM()!;
    const svg = p.ownerSVGElement!; const vb = svg.getAttribute("viewBox");
    const N = 16, cs = 1000 / N, r = Math.floor(i / N), c = i % N;
    const gx = m.e + m.a * c * cs, gy = m.f + m.d * r * cs, gw = m.a * cs;
    const b = cell.getBoundingClientRect();
    return { i, viewBox: vb, ghostSquare: [gx, gy, gw].map((v) => Math.round(v * 1000) / 1000), domCell: [b.x, b.y, b.width].map((v) => Math.round(v * 1000) / 1000), scale: m.a };
  }));
  out.rings = {};
  for (const theme of ["light", "dark"] as const) {
    await setTheme(page, theme);
    const geom = () => page.evaluate(() => { const cell = document.querySelectorAll(".board-shell .game-cell")[0] as HTMLElement; const p = cell.querySelector(".cell-ghost-path") as SVGPathElement; const m = p.getScreenCTM()!;
      const pts = [...p.getAttribute("d")!.matchAll(/[ML]\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g)].map((g) => [m.e + m.a * +g[1], m.f + m.d * +g[2]]); const r = cell.getBoundingClientRect(); return { pts, box: { x: r.x, y: r.y, w: r.width, h: r.height } }; });
    const g0 = await geom();
    const clip = { x: Math.max(0, Math.floor(g0.box.x - 20)), y: Math.max(0, Math.floor(g0.box.y - 20)), width: Math.ceil(g0.box.w + 40), height: Math.ceil(g0.box.h + 40) };
    await settled(page); const before = await pixels(page, clip);
    await page.locator(".board-shell .game-cell .cell-native-input").nth(0).focus(); await page.keyboard.press("Shift");
    await expect.poll(() => page.evaluate(() => document.querySelectorAll(".game-cell:has(input:focus-visible)").length)).toBe(1);
    await settled(page); const g = await geom(); const after = await pixels(page, clip);
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
    const nv = g.pts.length % 4 === 1 ? g.pts.length - 1 : g.pts.length; const q = nv / 4;
    const sides: any = {};
    const names = ["top", "right", "bottom", "left"];
    const all: number[] = []; let unpainted = 0;
    for (let s = 0; s < 4; s++) {
      const side = g.pts.slice(s * q, (s + 1) * q).concat([g.pts[((s + 1) * q) % nv]]);
      const took: number[] = []; let un = 0;
      for (let i = 0; i < 60; i++) {
        const t = ((i + 0.5) / 60) * (side.length - 1); const k = Math.min(side.length - 2, Math.floor(t)), f = t - k;
        const x = side[k][0] + f * (side[k + 1][0] - side[k][0]), y = side[k][1] + f * (side[k + 1][1] - side[k][1]);
        let best: { d: number; r: number } | null = null;
        for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) { const a = after(x + dx, y + dy), b = before(x + dx, y + dy); if (!a || !b) continue; const d = dist(a, b); if (!best || d > best.d) best = { d, r: ratio(a, b) }; }
        if (best && best.d >= 8) took.push(best.r); else un++;
      }
      took.sort((a, b) => a - b);
      sides[names[s]] = { painted: took.length, unpainted: un, worst: took.length ? r3(took[0]) : null, median: took.length ? r3(took[Math.floor(took.length / 2)]) : null, under3: took.filter((v) => v < 3).length };
      all.push(...took); unpainted += un;
    }
    all.sort((a, b) => a - b);
    out.rings[theme] = { sides, whole: { painted: all.length, unpainted, worst: r3(all[0]), median: r3(all[Math.floor(all.length / 2)]), under3: all.filter((v) => v < 3).length, fracUnder3: r3(all.filter((v) => v < 3).length / (all.length + unpainted)) } };
  }
  writeFileSync(`${process.env.OUT}/ring-${ARM}-${engine}.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out));
});

const WALK = 'a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])';
test("crit: deck centre card ring painted extent (PRM) + the landed walk's stop set", async ({ page }, info) => {
  test.setTimeout(180000);
  const engine = info.project.name;
  await page.emulateMedia({ reducedMotion: "reduce" });
  const out: any = { engine, arm: ARM };
  // the landed G-ABS-3 walk's stop set on its own route (9×9 board)
  await page.goto(`/?size=3&board=${mint(3)}`);
  await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(81);
  out.boardRouteStops = await page.evaluate((sel) => { const o: string[] = []; for (const n of document.querySelectorAll<HTMLElement>(sel)) { const r = n.getBoundingClientRect(); const cs = getComputedStyle(n); if (!r.width || !r.height || cs.visibility === "hidden" || cs.display === "none" || n.closest("[inert]")) continue; const k = `${n.tagName.toLowerCase()}.${(n.getAttribute("class") || "").trim().split(/\s+/)[0]}`; if (!o.includes(k)) o.push(k); } return o; }, WALK);
  // the deck
  await page.goto(`/?view=gallery&size=3&board=${mint(3)}`);
  await expect(page.locator(".gallery-viewport")).toBeVisible({ timeout: 60000 });
  await settled(page);
  out.activeAtLoad = await page.evaluate(() => { const a = document.activeElement as HTMLElement; return `${a?.tagName}.${a?.className}`.slice(0, 80) + " fv=" + (a?.matches?.(":focus-visible") ?? false); });
  await page.mouse.click(5, 795); await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.()); await settled(page);
  out.ringBefore = await page.evaluate(() => { const c = document.querySelector(".game-card.is-center") as HTMLElement; return getComputedStyle(c).outlineStyle + " " + getComputedStyle(c).outlineColor; });
  const card = await page.evaluate(() => { const c = document.querySelector(".game-card.is-center") as HTMLElement; const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  const M = 14; const clip = { x: Math.max(0, Math.floor(card.x - M)), y: Math.max(0, Math.floor(card.y - M)), width: Math.ceil(card.w + 2 * M), height: Math.min(800 - Math.max(0, Math.floor(card.y - M)), Math.ceil(card.h + 2 * M)) };
  const off = await pixels(page, clip);
  await page.locator(".gallery-viewport").focus(); await page.keyboard.press("Shift"); await settled(page);
  const ring = await page.evaluate(() => { const c = document.querySelector(".game-card.is-center") as HTMLElement; const cs = getComputedStyle(c); return { colour: cs.outlineColor, style: cs.outlineStyle, w: parseFloat(cs.outlineWidth), off: parseFloat(cs.outlineOffset), radius: cs.borderRadius, fv: (document.activeElement as HTMLElement).matches(":focus-visible") }; });
  const on = await pixels(page, clip);
  await page.screenshot({ path: `${process.env.OUT}/deck-on-${ARM}-${engine}.png`, clip });
  const inkRGBA = await page.evaluate(() => { const c = document.querySelector(".game-card.is-center") as HTMLElement; const cv = document.createElement("canvas").getContext("2d")!; cv.fillStyle = getComputedStyle(c).outlineColor; cv.fillRect(0, 0, 1, 1); const d = cv.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; });
  out.ring = ring;
  let isRing = 0, ringTotal = 0; const rs: number[] = [];
  for (const side of ["top", "bottom", "left", "right"]) {
    const len = side === "top" || side === "bottom" ? card.w : card.h;
    for (let u = 2; u < len - 2; u += 1) {
      ringTotal++; let hit: number | null = null;
      for (let s = ring.off; s <= ring.off + ring.w; s += 0.5) {
        const x = side === "left" ? card.x - s : side === "right" ? card.x + card.w + s : card.x + u;
        const y = side === "top" ? card.y - s : side === "bottom" ? card.y + card.h + s : card.y + u;
        const a = off(x, y), b = on(x, y); if (!a || !b) continue;
        const want = [0, 1, 2].map((i) => inkRGBA[3] * inkRGBA[i] + (1 - inkRGBA[3]) * a[i]);
        if (dist(b, want) <= 45 && dist(a, b) > 24) { const r = ratio(a, b); hit = hit === null ? r : Math.max(hit, r); }
      }
      if (hit !== null) { isRing++; rs.push(hit); }
    }
  }
  rs.sort((a, b) => a - b);
  out.isRing = { positions: ringTotal, ringInk: isRing, fraction: r3(isRing / ringTotal), worst: rs.length ? r3(rs[0]) : null, median: rs.length ? r3(rs[Math.floor(rs.length / 2)]) : null, under3: rs.filter((v) => v < 3).length };
  // perimeter positions (1 px step) where the ring band changed paint; band = offset-1 .. offset+width+1 outside the box
  let total = 0, painted = 0; const per: any = {};
  for (const side of ["top", "bottom", "left", "right"]) {
    let t = 0, p = 0; const len = side === "top" || side === "bottom" ? card.w : card.h;
    for (let u = 2; u < len - 2; u += 1) {
      let best = 0;
      for (let s = ring.off - 1; s <= ring.off + ring.w + 1; s += 0.5) {
        const x = side === "left" ? card.x - s : side === "right" ? card.x + card.w + s : card.x + u;
        const y = side === "top" ? card.y - s : side === "bottom" ? card.y + card.h + s : card.y + u;
        const a = off(x, y), b = on(x, y); if (!a || !b) continue; best = Math.max(best, dist(a, b));
      }
      t++; if (best > 24) p++;
    }
    per[side] = { positions: t, changed: p }; total += t; painted += p;
  }
  out.deck = { per, total, painted, fraction: r3(painted / total) };
  writeFileSync(`${process.env.OUT}/deck-${ARM}-${engine}.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out));
});
