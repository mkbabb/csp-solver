/**
 * T9-W7 pass 4 · MRK-ABS — charter rows 1 (the chrome half), 6, 7, 8, 9, 10b.
 * The DOM-walk census, now with the ring HOST resolved (the deck card, the staging and guard
 * faces carry the outline on a descendant) and the band read along each side's NORMAL across
 * the element's OWN outline-offset + width (the pass-3 +-30 px clip never reached the toggle's
 * 54 px ring). Per side: max-changed pixel on the normal, ink = focused, ground = blurred, same
 * pixel; the ground's owner named by elementsFromPoint. ARM=one|two, FORCED=1 for forced-colors.
 */
import { test, expect, type Page } from "@playwright/test";
import { bank, mintSudoku, setTheme, inject, grab, ratio, dist, med, r3 } from "./abs-lib";

const ARM = process.env.ARM ?? "one";
const TWO_L = process.env.TWO_L ?? "#4285ce", TWO_D = process.env.TWO_D ?? "#2f66a8";
const ARM_CSS = ARM === "two" ? `:root{--color-focus-sketch:${TWO_L}!important}:root.dark{--color-focus-sketch:${TWO_D}!important}` : "";
const FORCED = process.env.FORCED === "1";
const WALK = 'a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])';
const HOST: [string, string][] = [[".gallery-viewport", ".game-card.is-center"], [".staging-btn", ".staging-face"], [".guard-btn", ".guard-face"]];

async function listStops(page: Page, scope = "") {
  return page.evaluate(({ sel, scope }) => {
    const vis = (n: Element) => { const r = n.getBoundingClientRect(); const cs = getComputedStyle(n);
      return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
    const out: { key: string; nth: number }[] = []; const seen = new Set<string>();
    const all = [...document.querySelectorAll(sel)];
    all.forEach((n) => { if (!vis(n) || (n as HTMLElement).closest("[inert]")) return;
      if (scope && !(n as HTMLElement).closest(scope)) return;
      const cls = ((n as HTMLElement).className || "").toString().trim().split(/\s+/)[0] || "";
      const key = `${n.tagName.toLowerCase()}${cls ? "." + cls : ""}`; if (seen.has(key)) return; seen.add(key);
      out.push({ key, nth: [...document.querySelectorAll(key.replace(/^(\w+)\.(.*)$/, (_m, t, c) => `${t}.${CSS.escape(c)}`))].indexOf(n) }); });
    return out;
  }, { sel: WALK, scope });
}

async function focusKey(page: Page, key: string, nth: number) {
  await page.evaluate(({ key, nth }) => { const q = key.replace(/^(\w+)\.(.*)$/, (_m, t, c) => `${t}.${CSS.escape(c)}`);
    (document.querySelectorAll(q)[nth] as HTMLElement)?.focus(); }, { key, nth });
  await page.keyboard.press("Shift");
  await page.waitForTimeout(420);
}

export async function bandStop(page: Page, key: string, nth: number) {
  await focusKey(page, key, nth);
  const g = await page.evaluate(({ HOST }) => {
    const el = document.activeElement as HTMLElement; if (!el || el === document.body) return null;
    let host: HTMLElement = el; let hostSel = "self";
    for (const [f, h] of HOST) if (el.matches(f)) { const x = (f === ".gallery-viewport" ? document : el).querySelector(h) as HTMLElement; if (x) { host = x; hostSel = h; } }
    const cs = getComputedStyle(host); const r = host.getBoundingClientRect();
    const fcs = getComputedStyle(el);
    return { hostSel, focusVisible: el.matches(":focus-visible"), colour: cs.outlineColor, style: cs.outlineStyle,
      w: parseFloat(cs.outlineWidth) || 0, off: parseFloat(cs.outlineOffset) || 0, radius: cs.borderRadius,
      rect: { x: r.x, y: r.y, w: r.width, h: r.height }, currentColor: cs.color,
      focusedOutline: `${fcs.outlineWidth} ${fcs.outlineStyle} ${fcs.outlineColor}` };
  }, { HOST });
  if (!g) return { key, focused: false };
  const base = { key, host: g.hostSel, outline: `${g.w}px ${g.style} ${g.colour}`, offset: g.off, radius: g.radius, focusVisible: g.focusVisible, focusedOutline: g.focusedOutline };
  if (g.style === "none" || g.w === 0) return { ...base, banded: false, why: "no outline on the host" };
  const vp = page.viewportSize()!; const M = Math.max(0, g.off) + g.w + 8;
  const x0 = Math.max(0, Math.floor(g.rect.x - M)), y0 = Math.max(0, Math.floor(g.rect.y - M));
  const clip = { x: x0, y: y0, width: Math.min(vp.width - x0, Math.ceil(g.rect.w + 2 * M)), height: Math.min(vp.height - y0, Math.ceil(g.rect.h + 2 * M)) };
  if (clip.width < 4 || clip.height < 4) return { ...base, banded: false, why: "off-viewport" };
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.waitForTimeout(260);
  const A = await grab(page, clip);
  await focusKey(page, key, nth);
  const B = await grab(page, clip);
  const round = parseFloat(g.radius) >= 0.25 * Math.min(g.rect.w, g.rect.h) || /%/.test(g.radius);
  const ts = round ? [0.44, 0.47, 0.5, 0.53, 0.56] : [0.2, 0.26, 0.32, 0.38, 0.44, 0.5, 0.56, 0.62, 0.68, 0.74, 0.8];
  const R = g.rect; const exp = g.colour;
  const m = exp.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?/);
  const EXP = m ? { rgb: [+m[1], +m[2], +m[3]], a: m[4] === undefined ? 1 : +m[4] } : null;
  const sides: Record<string, unknown> = {}; let worst: number | null = null, worstSide: string | null = null, worstPt: number[] | null = null;
  const lo = Math.max(-1, g.off - 2), hi = g.off + g.w + 2;
  for (const side of ["top", "bottom", "left", "right"]) {
    const took: { r: number; ink: number[]; ground: number[]; pt: number[] }[] = []; let sampled = 0;
    for (const t of ts) {
      let best: { r: number; ink: number[]; ground: number[]; pt: number[] } | null = null, bd = 0;
      for (let s = lo; s <= hi; s += 0.5) for (let lat = -1; lat <= 1; lat++) {
        let x = 0, y = 0;
        if (side === "top") { x = R.x + R.w * t + lat; y = R.y - s; }
        if (side === "bottom") { x = R.x + R.w * t + lat; y = R.y + R.h + s; }
        if (side === "left") { x = R.x - s; y = R.y + R.h * t + lat; }
        if (side === "right") { x = R.x + R.w + s; y = R.y + R.h * t + lat; }
        const a = A(x, y), b = B(x, y); if (!a || !b) continue;
        // isTheRing: the changed pixel must BE the computed outline ink (alpha-blended over its
        // ground). A co-changing neighbour (the attribution card opens on focus) is not a ring.
        const want = EXP ? EXP.rgb.map((c, i) => EXP.a * c + (1 - EXP.a) * a[i]) : null;
        if (!want || dist(b, want) > 60) continue;
        const d = dist(a, b); if (d > bd) { bd = d; best = { r: ratio(b, a), ink: b, ground: a, pt: [x, y] }; }
      }
      if (best !== null) sampled++;
      if (best && bd > 12) took.push(best);
    }
    if (!took.length) { sides[side] = { sampled, changed: 0 }; continue; }
    const ink = [0, 1, 2].map((c) => med(took.map((p) => p.ink[c]))); const ground = [0, 1, 2].map((c) => med(took.map((p) => p.ground[c])));
    const w = took.reduce((m, p) => (p.r < m.r ? p : m));
    sides[side] = { sampled, changed: took.length, ink, ground, worst: r3(w.r), worstInk: w.ink, worstGround: w.ground, median: r3(med(took.map((p) => p.r))), under3: took.filter((p) => p.r < 3).length };
    if (worst === null || w.r < worst) { worst = w.r; worstSide = side; worstPt = w.pt; }
  }
  let groundOwner: string | null = null;
  if (worstPt) groundOwner = await page.evaluate(({ x, y, hostSel }) => {
    const host = document.activeElement as HTMLElement;
    const stack = document.elementsFromPoint(x, y).filter((n) => !host.contains(n) && !n.contains(host) && !(hostSel !== "self" && (n as HTMLElement).closest(hostSel)));
    const n = stack[0] as HTMLElement | undefined; if (!n) return "(document)";
    return `${n.tagName.toLowerCase()}${n.classList.length ? "." + [...n.classList].slice(0, 2).join(".") : ""} bg=${getComputedStyle(n).backgroundColor}`;
  }, { x: worstPt[0], y: worstPt[1], hostSel: g.hostSel });
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  return { ...base, banded: worst !== null, worst: worst === null ? null : r3(worst), worstSide, groundOwner, sides, expectedInk: exp };
}

async function arrival(page: Page, key: string, nth: number) {
  return page.evaluate(async ({ key, nth, HOST }) => {
    const q = key.replace(/^(\w+)\.(.*)$/, (_m, t, c) => `${t}.${CSS.escape(c)}`);
    const el = document.querySelectorAll(q)[nth] as HTMLElement; if (!el) return null;
    (document.activeElement as HTMLElement)?.blur?.(); await new Promise((r) => requestAnimationFrame(() => r(null)));
    el.focus(); await new Promise((r) => requestAnimationFrame(() => r(null)));
    let host: HTMLElement = el; for (const [f, h] of HOST) if (el.matches(f)) { const x = (f === ".gallery-viewport" ? document : el).querySelector(h) as HTMLElement; if (x) host = x; }
    const a = getComputedStyle(host); return { colour: a.outlineColor, style: a.outlineStyle };
  }, { key, nth, HOST });
}

async function census(page: Page, label: string, scope = "") {
  const stops = await listStops(page, scope); const rows: Record<string, unknown>[] = [];
  for (const s of stops) {
    const first = await arrival(page, s.key, s.nth);
    const b = await bandStop(page, s.key, s.nth) as Record<string, unknown>;
    rows.push({ ...b, firstFrame: first });
    console.log(`[${label}] ${s.key} host=${b.host} ${b.outline} fv=${b.focusVisible} worst=${b.worst ?? "-"} side=${b.worstSide ?? "-"} owner=${b.groundOwner ?? "-"}`);
    if (s.key.includes("drawer-tab")) {
      // law 39's PROPOSED deletion (instruments/law39-tab-ring-deletion.PROPOSED.diff), read at
      // the same pixels: the tab falls to the base token instead of its dashed currentColor.
      await inject(page, `.drawer-tab:focus-visible{outline:2px solid var(--ring-ink)!important;outline-offset:var(--focus-offset)!important}`, "abs-tab");
      const t = await bandStop(page, s.key, s.nth) as Record<string, unknown>;
      await inject(page, "", "abs-tab");
      rows.push({ ...t, key: `${s.key}[PROPOSED token form]` });
      console.log(`[${label}] ${s.key}[PROPOSED token] ${t.outline} worst=${t.worst ?? "-"} side=${t.worstSide ?? "-"} owner=${t.groundOwner ?? "-"}`);
    }
  }
  return rows;
}

async function armGuard(page: Page) {
  await page.goto(`/?size=3&difficulty=EASY&board=${mintSudoku(3)}`);
  await expect.poll(() => page.locator(".sudoku-cell").count(), { timeout: 60000 }).toBe(81);
  const blank = await page.evaluate(() => { const c = document.querySelectorAll(".sudoku-cell"); for (let i = 0; i < c.length; i++) if (!c[i].querySelector(".glyph-svg")) return i; return -1; });
  await page.evaluate((idx) => { const input = document.querySelectorAll(".sudoku-cell input")[idx] as HTMLInputElement;
    input.focus(); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!; set.call(input, "1");
    input.dispatchEvent(new Event("input", { bubbles: true })); }, blank);
  await page.waitForTimeout(300);
  await page.locator("button.logo-trigger").evaluate((n: HTMLElement) => n.focus());
  await page.keyboard.press("Enter");
  await page.waitForSelector(".staging-band", { timeout: 20000 });
  await page.waitForTimeout(900);
  const vp = page.locator(".gallery-viewport"); await vp.focus();
  for (let i = 0; i < 4; i++) await vp.press("ArrowRight");
  await page.waitForTimeout(700);
  await page.locator(".staging-deal").evaluate((n: HTMLElement) => n.focus());
  await page.keyboard.press("Enter");
  await expect(page.locator(".gallery-guard")).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(700);
}

test("census · home + gallery + armed guard", async ({ page }, info) => {
  const engine = info.project.name; const out: Record<string, unknown> = { engine, arm: ARM, armCss: ARM_CSS, forced: FORCED };
  if (FORCED) await page.emulateMedia({ forcedColors: "active" });
  for (const theme of ["light", "dark"] as const) {
    await page.goto(`/?size=3&board=${mintSudoku(3)}`);
    await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 60000 }).toBe(81);
    await setTheme(page, theme); await inject(page, ARM_CSS, "abs-two"); await page.waitForTimeout(300);
    const home = await census(page, `${engine} ${ARM} ${theme} home`);
    await page.goto(`/?view=gallery&size=3&board=${mintSudoku(3)}`);
    await page.waitForSelector(".staging-band", { timeout: 30000 }); await page.waitForTimeout(900);
    await setTheme(page, theme); await inject(page, ARM_CSS, "abs-two"); await page.waitForTimeout(300);
    const deck = await census(page, `${engine} ${ARM} ${theme} deck`);
    let guard: unknown = null;
    try { await armGuard(page); await setTheme(page, theme); await inject(page, ARM_CSS, "abs-two"); await page.waitForTimeout(300);
      if (!(await page.locator(".gallery-guard").isVisible())) throw new Error("guard dismissed by the theme flip");
      guard = await census(page, `${engine} ${ARM} ${theme} guard`, ".gallery-guard"); }
    catch (e) { guard = { error: String(e).slice(0, 300) }; console.log(`[guard ${theme}] ${String(e).slice(0, 200)}`); }
    out[theme] = { home, deck, guard };
  }
  bank(`census-${ARM}${FORCED ? "-forced" : ""}-${engine}`, out);
  expect(Object.keys(out).length).toBeGreaterThan(3);
});

test("G-ABS-4 · one colour on every game route · 1280x800", async ({ page }, info) => {
  test.skip(FORCED || ARM !== "one", "route census runs on the shipped arm only");
  const engine = info.project.name; const out: Record<string, unknown> = {};
  for (const game of ["sudoku", "futoshiki", "thermo", "killer", "kenken"]) for (const theme of ["light", "dark"] as const) {
    await page.goto(`/?game=${game}`);
    await page.waitForSelector(".board-shell .game-cell", { timeout: 60000 }); await page.waitForTimeout(800);
    await setTheme(page, theme);
    const stops = await listStops(page); const rows: Record<string, unknown>[] = [];
    for (const s of stops) { const first = await arrival(page, s.key, s.nth); await focusKey(page, s.key, s.nth);
      const st = await page.evaluate(({ HOST }) => { const el = document.activeElement as HTMLElement; let host = el;
        for (const [f, h] of HOST) if (el.matches(f)) { const x = (f === ".gallery-viewport" ? document : el).querySelector(h) as HTMLElement; if (x) host = x; }
        const c = getComputedStyle(host); return { colour: c.outlineColor, style: c.outlineStyle, width: c.outlineWidth, fv: el.matches(":focus-visible") }; }, { HOST });
      rows.push({ stop: s.key, ...st, sameFrame: first?.colour === st.colour }); }
    const painted = rows.filter((r) => r.style !== "none");
    const colours = [...new Set(painted.map((r) => `${r.style} ${r.colour}`))];
    out[`${game}-${theme}`] = { stops: rows.length, colours, autos: rows.filter((r) => r.style === "auto").length, sameFrame: `${rows.filter((r) => r.sameFrame).length}/${rows.length}`, rows };
    console.log(`[route ${engine} ${game} ${theme}] stops ${rows.length} · ${colours.join(" | ")} · auto ${rows.filter((r) => r.style === "auto").length}`);
  }
  bank(`routes-${engine}`, out);
});
