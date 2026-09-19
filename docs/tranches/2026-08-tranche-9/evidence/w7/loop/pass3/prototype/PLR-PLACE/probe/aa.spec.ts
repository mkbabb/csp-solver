import { test, expect, type Browser, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

/**
 * G13 — EVERY AA ROW FROM PAINTED BYTES.
 *
 * The subgrid finding (a `color-mix` projection 4× under the paint) says the model errs, so no
 * row here is computed from a token: each is a WCAG ratio between the EXTREME painted pixel of
 * the element's own clip and that clip's modal ground, decoded off a `deviceScaleFactor: 1`
 * screenshot. A 1px antialiased line never reaches its token and this is the number that says
 * what it reaches.
 */

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/PLR-PLACE/logs";
const LOCAL = "./?size=3&difficulty=EASY&wire=local";

const lum = (r: number, g: number, b: number) => {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a: number[], b: number[]) => {
  const la = lum(a[0], a[1], a[2]);
  const lb = lum(b[0], b[1], b[2]);
  return +(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05))).toFixed(3);
};

async function readClip(page: Page, box: { x: number; y: number; width: number; height: number }) {
  const png = await page.screenshot({
    clip: {
      x: Math.max(0, Math.floor(box.x)),
      y: Math.max(0, Math.floor(box.y)),
      width: Math.max(1, Math.ceil(box.width)),
      height: Math.max(1, Math.ceil(box.height)),
    },
  });
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const counts = new Map<string, number>();
  const px: number[][] = [];
  for (let i = 0; i < data.length; i += info.channels) {
    const p = [data[i], data[i + 1], data[i + 2]];
    px.push(p);
    const k = p.join(",");
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  let ground = [255, 255, 255];
  let best = -1;
  for (const [k, n] of counts) if (n > best) ((best = n), (ground = k.split(",").map(Number)));
  // the EXTREME pixel: the one whose luminance is furthest from the ground's
  const lg = lum(ground[0], ground[1], ground[2]);
  let ink = ground;
  let far = -1;
  for (const p of px) {
    const d = Math.abs(lum(p[0], p[1], p[2]) - lg);
    if (d > far) ((far = d), (ink = p));
  }
  return { ground, ink, ratio: ratio(ink, ground), pixels: px.length };
}

async function scene(browser: Browser, dark: boolean) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const a = await ctx.newPage();
  if (dark) await a.addInitScript(() => localStorage.setItem("theme", "dark"));
  await a.goto(LOCAL);
  await a.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => a.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
    .toBeGreaterThan(0);
  if (dark)
    await a.evaluate(() => document.documentElement.classList.add("dark"));
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled({ timeout: 20000 });
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const b = await ctx.newPage();
  await b.goto(a.url());
  await b.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => a.locator(".controls-card .players-roster .player-row").count(), { timeout: 30000 })
    .toBe(2);
  await b.locator(".sudoku-cell input").nth(12).click();
  await a.bringToFront();
  await a.locator(".sudoku-cell input").nth(40).click();
  const signClip = await a.locator("[data-player-mark]:visible").boundingBox();
  const signFrame = await readClip(a, signClip!);
  await a.locator("[data-player-mark]:visible").click();
  await a.waitForTimeout(1400); // the fade, then the 700 ms settle for the peer's dot
  const rows: Record<string, unknown> = { "sign frame (28px, live)": signFrame };
  for (const [name, sel] of [
    ["state line (quiet ink)", "[data-lobby].is-open .lobby-state"],
    ["chart frame", "[data-lobby].is-open .chart-frame"],
    ["chart subgrid rule", "[data-lobby].is-open .chart-rule"],
    ["peer dot", "[data-lobby].is-open .chart-dot"],
    ["your ring", "[data-lobby].is-open .chart-self"],
    ["row name", "[data-lobby].is-open .pl-name"],
  ] as const) {
    const el = a.locator(sel).first();
    if ((await el.count()) === 0) {
      rows[name] = "absent";
      continue;
    }
    const bb = await el.boundingBox();
    rows[name] = bb ? await readClip(a, bb) : "no box";
  }
  // the lap: what the sheet is actually painted OVER
  const over = await a.evaluate(() => {
    const s = document.querySelector("[data-lobby].is-open")!.getBoundingClientRect();
    const w = document.querySelector("svg.handwritten-logo")?.getBoundingClientRect();
    if (!w) return null;
    const x = Math.max(0, Math.min(s.right, w.right) - Math.max(s.left, w.left));
    const y = Math.max(0, Math.min(s.bottom, w.bottom) - Math.max(s.top, w.top));
    return +(x * y).toFixed(1);
  });
  await ctx.close();
  return { theme: dark ? "dark" : "light", overWordmarkPx2: over, rows };
}

test("painted AA, both themes", async ({ browser }) => {
  test.setTimeout(300000);
  const out = { light: await scene(browser, false), dark: await scene(browser, true) };
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/aa-painted.json`, JSON.stringify(out, null, 2));
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(out, null, 2));
});
