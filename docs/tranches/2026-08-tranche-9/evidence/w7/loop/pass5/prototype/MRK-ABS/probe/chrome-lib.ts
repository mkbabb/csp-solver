// T9-W7 pass 5 · MRK-ABS — the chrome band read (pass-4 p4-census bandStop, COPIED), plus:
// the LAWS' core distribution (max / p30 / median / fraction < 3) over every sample line and the
// sensitivity row (worst line at 50/70/90/100 % of the median per-line peak change + share < 3).
// Ring-OFF = the same pixels with focus blurred. isTheRing: the changed pixel must BE the computed
// outline ink over its ground (Δ ≤ 60), or it is not read.
import type { Page } from "@playwright/test";
import { grab, ratio, d1, med, q, r3, mintSudoku, setTheme, inject } from "./abs-lib";
import { expect } from "@playwright/test";
export const WALK = 'a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])';
export const HOST: [string, string][] = [[".gallery-viewport", ".game-card.is-center"], [".staging-btn", ".staging-face"], [".guard-btn", ".guard-face"]];
export async function listStops(page: Page, scope = "") {
  return page.evaluate(({ sel, scope }) => {
    const vis = (n: Element) => { const r = n.getBoundingClientRect(); const cs = getComputedStyle(n); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
    const out: { key: string; nth: number }[] = []; const seen = new Set<string>();
    [...document.querySelectorAll(sel)].forEach((n) => { if (!vis(n) || (n as HTMLElement).closest("[inert]")) return; if (scope && !(n as HTMLElement).closest(scope)) return;
      const cls = ((n as HTMLElement).className || "").toString().trim().split(/\s+/)[0] || ""; const key = `${n.tagName.toLowerCase()}${cls ? "." + cls : ""}`; if (seen.has(key)) return; seen.add(key);
      out.push({ key, nth: [...document.querySelectorAll(key.replace(/^(\w+)\.(.*)$/, (_m, t, c) => `${t}.${CSS.escape(c)}`))].indexOf(n) }); });
    return out;
  }, { sel: WALK, scope });
}
export async function focusKey(page: Page, key: string, nth: number) {
  await page.evaluate(({ key, nth }) => { const q = key.replace(/^(\w+)\.(.*)$/, (_m, t, c) => `${t}.${CSS.escape(c)}`); (document.querySelectorAll(q)[nth] as HTMLElement)?.focus(); }, { key, nth });
  await page.keyboard.press("Shift"); await page.waitForTimeout(420);
}
export async function bandStop(page: Page, key: string, nth: number) {
  await focusKey(page, key, nth);
  const g = await page.evaluate(({ HOST }) => {
    const el = document.activeElement as HTMLElement; if (!el || el === document.body) return null;
    let host: HTMLElement = el; let hostSel = "self";
    for (const [f, h] of HOST) if (el.matches(f)) { const x = (f === ".gallery-viewport" ? document : el).querySelector(h) as HTMLElement; if (x) { host = x; hostSel = h; } }
    const cs = getComputedStyle(host); const r = host.getBoundingClientRect();
    return { hostSel, focusVisible: el.matches(":focus-visible"), colour: cs.outlineColor, style: cs.outlineStyle, w: parseFloat(cs.outlineWidth) || 0, off: parseFloat(cs.outlineOffset) || 0, radius: cs.borderRadius, rect: { x: r.x, y: r.y, w: r.width, h: r.height } };
  }, { HOST });
  if (!g) return { key, focused: false } as Record<string, unknown>;
  const base = { key, host: g.hostSel, outline: `${g.w}px ${g.style} ${g.colour}`, offset: g.off, focusVisible: g.focusVisible };
  if (g.style === "none" || g.w === 0) return { ...base, banded: false, why: "no outline on the host" };
  const vp = page.viewportSize()!; const M = Math.max(0, g.off) + g.w + 8;
  const x0 = Math.max(0, Math.floor(g.rect.x - M)), y0 = Math.max(0, Math.floor(g.rect.y - M));
  const clip = { x: x0, y: y0, width: Math.min(vp.width - x0, Math.ceil(g.rect.w + 2 * M)), height: Math.min(vp.height - y0, Math.ceil(g.rect.h + 2 * M)) };
  if (clip.width < 4 || clip.height < 4) return { ...base, banded: false, why: "off-viewport" };
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.()); await page.waitForTimeout(260);
  const A = await grab(page, clip); await focusKey(page, key, nth); const B = await grab(page, clip);
  const round = parseFloat(g.radius) >= 0.25 * Math.min(g.rect.w, g.rect.h) || /%/.test(g.radius);
  const ts = round ? [0.44, 0.47, 0.5, 0.53, 0.56] : [0.2, 0.26, 0.32, 0.38, 0.44, 0.5, 0.56, 0.62, 0.68, 0.74, 0.8];
  const R = g.rect; const m = g.colour.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?/);
  // LAWS P4: `color-mix(…, transparent)` serialises as `color(srgb r g b / a)` — parse the alpha.
  const mc = g.colour.match(/color\(srgb\s+([\d.e-]+)\s+([\d.e-]+)\s+([\d.e-]+)(?:\s*\/\s*([\d.e-]+))?/);
  const EXP = m ? { rgb: [+m[1], +m[2], +m[3]], a: m[4] === undefined ? 1 : +m[4] }
    : mc ? { rgb: [+mc[1] * 255, +mc[2] * 255, +mc[3] * 255], a: mc[4] === undefined ? 1 : +mc[4] } : null;
  const lo = Math.max(-1, g.off - 2), hi = g.off + g.w + 2;
  const lines: { side: string; best: { r: number; ink: number[]; ground: number[]; pt: number[]; d: number }; scan: { d: number; r: number }[] }[] = [];
  const sides: Record<string, unknown> = {};
  for (const side of ["top", "bottom", "left", "right"]) {
    let sampled = 0; const took: number[] = [];
    for (const t of ts) {
      let best: { r: number; ink: number[]; ground: number[]; pt: number[]; d: number } | null = null; const scan: { d: number; r: number }[] = [];
      for (let s = lo; s <= hi; s += 0.5) for (let lat = -1; lat <= 1; lat++) {
        let x = 0, y = 0;
        if (side === "top") { x = R.x + R.w * t + lat; y = R.y - s; } if (side === "bottom") { x = R.x + R.w * t + lat; y = R.y + R.h + s; }
        if (side === "left") { x = R.x - s; y = R.y + R.h * t + lat; } if (side === "right") { x = R.x + R.w + s; y = R.y + R.h * t + lat; }
        const a = A(x, y), b = B(x, y); if (!a || !b) continue;
        const want = EXP ? EXP.rgb.map((c, i) => EXP.a * c + (1 - EXP.a) * a[i]) : null; if (!want || d1(b, want) > 60) continue;
        const d = d1(a, b); scan.push({ d, r: ratio(b, a) }); if (!best || d > best.d) best = { r: ratio(b, a), ink: b, ground: a, pt: [x, y], d };
      }
      if (best) sampled++;
      if (best && best.d > 12) { lines.push({ side, best, scan }); took.push(best.r); }
    }
    sides[side] = took.length ? { sampled, changed: took.length, worst: r3(Math.min(...took)), median: r3(med(took)), under3: took.filter((v) => v < 3).length } : { sampled, changed: 0 };
  }
  const rs = lines.map((l) => l.best.r);
  if (!rs.length) return { ...base, banded: false, why: "no changed pixel is the ring's ink", sides };
  const w = lines.reduce((a, l) => (l.best.r < a.best.r ? l : a));
  const Mx = med(lines.map((l) => Math.max(...l.scan.map((p) => p.d))));
  const sensitivity = [0.5, 0.7, 0.9, 1.0].map((f) => { const per = lines.map((l) => l.scan.filter((p) => p.d >= f * Mx * 0.999)).filter((c) => c.length).map((c) => Math.min(...c.map((p) => p.r)));
    return { at: `${Math.round(f * 100)}%`, worst: per.length ? r3(Math.min(...per)) : null, under3: `${per.filter((v) => v < 3).length}/${per.length}` }; });
  const groundOwner = await page.evaluate(({ x, y, hostSel }) => { const host = document.activeElement as HTMLElement;
    const stack = document.elementsFromPoint(x, y).filter((n) => !host.contains(n) && !n.contains(host) && !(hostSel !== "self" && (n as HTMLElement).closest(hostSel)));
    const n = stack[0] as HTMLElement | undefined; return n ? `${n.tagName.toLowerCase()}${n.classList.length ? "." + [...n.classList].slice(0, 2).join(".") : ""}` : "(document)"; }, { x: w.best.pt[0], y: w.best.pt[1], hostSel: g.hostSel });
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  return { ...base, banded: true, lines: rs.length, core: { max: r3(Math.max(...rs)), p30: r3(q(rs, 0.3)), median: r3(med(rs)), worst: r3(Math.min(...rs)), fracUnder3: r3(rs.filter((v) => v < 3).length / rs.length) },
    sensitivity, worstSide: w.side, worstInk: w.best.ink, worstGround: w.best.ground, groundOwner, sides };
}
export async function arrival(page: Page, key: string, nth: number) {
  return page.evaluate(async ({ key, nth, HOST }) => {
    const q = key.replace(/^(\w+)\.(.*)$/, (_m, t, c) => `${t}.${CSS.escape(c)}`); const el = document.querySelectorAll(q)[nth] as HTMLElement; if (!el) return null;
    (document.activeElement as HTMLElement)?.blur?.(); await new Promise((r) => requestAnimationFrame(() => r(null)));
    el.focus(); await new Promise((r) => requestAnimationFrame(() => r(null)));
    let host: HTMLElement = el; for (const [f, h] of HOST) if (el.matches(f)) { const x = (f === ".gallery-viewport" ? document : el).querySelector(h) as HTMLElement; if (x) host = x; }
    const a = getComputedStyle(host); return { colour: a.outlineColor, style: a.outlineStyle };
  }, { key, nth, HOST });
}
export async function armGuard(page: Page, base: string) {
  await page.goto(`${base}/?size=3&difficulty=EASY&board=${mintSudoku(3)}`);
  await expect.poll(() => page.locator(".sudoku-cell").count(), { timeout: 60000 }).toBe(81);
  const blank = await page.evaluate(() => { const c = document.querySelectorAll(".sudoku-cell"); for (let i = 0; i < c.length; i++) if (!c[i].querySelector(".glyph-svg")) return i; return -1; });
  await page.evaluate((idx) => { const input = document.querySelectorAll(".sudoku-cell input")[idx] as HTMLInputElement; input.focus();
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!; set.call(input, "1"); input.dispatchEvent(new Event("input", { bubbles: true })); }, blank);
  await page.waitForTimeout(300);
  await page.locator("button.logo-trigger").evaluate((n: HTMLElement) => n.focus()); await page.keyboard.press("Enter");
  await page.waitForSelector(".staging-band", { timeout: 20000 }); await page.waitForTimeout(900);
  const vp = page.locator(".gallery-viewport"); await vp.focus(); for (let i = 0; i < 4; i++) await vp.press("ArrowRight");
  await page.waitForTimeout(700);
  await page.locator(".staging-deal").evaluate((n: HTMLElement) => n.focus()); await page.keyboard.press("Enter");
  await expect(page.locator(".gallery-guard")).toBeVisible({ timeout: 10000 }); await page.waitForTimeout(700);
}
export { setTheme, inject };
