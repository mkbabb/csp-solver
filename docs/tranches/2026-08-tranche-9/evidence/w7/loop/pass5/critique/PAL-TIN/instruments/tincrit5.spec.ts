import { test, expect, type Page } from "@playwright/test";

// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) in `boot()` before every goto. The tally
//   is frame [0] of generateLineBoilFrames and the ring's own row is
//   join-language-prm.spec.ts:153; nothing here watches a tween.

/**
 * THE TIN, ON THE SURFACE (T9-W7 PAL-TIN).
 *
 * Five pencils, each with a RING ARM, and a tally drawn only where there is room for it. The
 * rows below are the ones the arithmetic cannot close:
 *
 *   · §1, the ring PHOTOGRAPHED under the section's statistic (registry-v4 §2.4): the core
 *     median of every pixel the ring moved, ring-off subtracted, all five arms, both themes,
 *     with the stick's own lightness in the same ring as the row's negative control.
 *   · §2, AA: every stick on bg/card/popover, and the ring arm on the tape's paper.
 *   · §2b, the NAME ON THE TAPE, painted: photographed twice, text transparent the second time,
 *     every changed pixel against the ground painted under it.
 *   · the two homes at seven players, and the `you` pill exactly where five players left it.
 *   · print and forced colours reach the roster tick through the widened `index.css` pair.
 *
 * ONE BOARD, ENCODED (`?board=` is a codec payload, not a name): minted with the app's codec
 * from the `74a2b5d9` control's deal, the same payload PAL-WALK's rows read, and every row that
 * reads a board asserts it decoded.
 *
 * ONE BROWSER CONTEXT per room, because the local transport arm is a `BroadcastChannel` and two
 * contexts do not share one (`multiplayer.spec.ts`'s reasoning, verbatim).
 */

const BOARD =
  "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS =
  "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const SOLO = `./?board=${BOARD}`;
const LOCAL = SOLO + "&wire=local";
/** THE SECTION'S STATISTIC (registry-v4 §2.4): the ring's core median clears 3.0 with 0.10 of
 *  headroom. */
const CORE_FLOOR = 3.1;

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

async function boot(page: Page, url: string) {
  // THE PRM ROUTE for every page this file opens (`check-motion-contract` rule 3): the tin reads
  // colour off a settled surface and, from §1b, samples PIXELS out of a screenshot — a boiling
  // grid would make the sample a lottery. Reduced motion lands the estate at pose 0.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url);
  await settled(page);
  const givens = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i) => (i as HTMLInputElement).value || ".")
      .join(""),
  );
  // a joiner reads the room's board, which is the same payload; a written digit is not a given
  if (!new URL(url, "http://x").searchParams.get("s")) expect(givens, "the encoded board decoded").toBe(GIVENS);
}

async function invite(page: Page): Promise<string> {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return page.url();
}

const roster = (page: Page) =>
  page.locator(".controls-card .players-roster .player-row");

/** A room of `n` pages on one board, the product's own invite path. */
async function room(browser: import("@playwright/test").Browser, n: number) {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, LOCAL);
  const link = await invite(a);
  const pages = [a];
  for (let i = 1; i < n; i++) {
    const p = await ctx.newPage();
    await boot(p, link);
    pages.push(p);
  }
  for (const p of pages) await expect(roster(p)).toHaveCount(n, { timeout: 60000 });
  return { ctx, pages };
}

/** WCAG 2.x contrast off two `rgb()` strings the engine itself produced. */
const CONTRAST = `(a, b) => {
  const px = (s) => s.match(/[\\d.]+/g).slice(0, 3).map(Number).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const L = (p) => 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
  const [x, y] = [L(px(a)), L(px(b))].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}`;

/** src-over composite, in the engine's own bytes. */
const OVER = `(fg, alpha, bg) => {
  const n = (s) => s.match(/[\\d.]+/g).slice(0, 3).map(Number);
  const f = n(fg), b = n(bg);
  return 'rgb(' + f.map((v, i) => alpha * v + (1 - alpha) * b[i]).join(', ') + ')';
}`;

/** The product's own key — `useTheme` writes the `dark` CLASS on `<html>` (`useTheme.ts:9-13`),
 *  so the arm is switched the way a reader switches it, then settled over two frames. */
async function setTheme(page: Page, mode: "light" | "dark") {
  await page.evaluate((m) => {
    document.documentElement.classList.toggle("dark", m === "dark");
    return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }, mode);
}

/** Every roster row's children, as `class:x,width` — the no-move guard's reading, in one place
 *  so the five-player and seven-player captures cannot drift apart. */
const ROW_CHILDREN = () =>
  [...document.querySelectorAll(".players-roster .player-row .player-row-cells > *")].map((e) => {
    const r = e.getBoundingClientRect();
    return `${e.className}:${r.x.toFixed(2)},${r.width.toFixed(2)}`;
  });

/** A screenshot's bytes, decoded BY THE BROWSER THAT TOOK IT (PAL-WALK's form): the page holds
 *  a canvas, so the decoder is the engine's own and this file carries none. */
async function rawOf(
  page: Page,
  png: { toString: (enc: string) => string },
): Promise<{ data: number[]; w: number; h: number }> {
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    g.drawImage(img, 0, 0);
    return { data: Array.from(g.getImageData(0, 0, c.width, c.height).data), w: c.width, h: c.height };
  }, png.toString("base64"));
}

const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lumAt = (d: number[], k: number) =>
  0.2126 * lin(d[k] / 255) + 0.7152 * lin(d[k + 1] / 255) + 0.0722 * lin(d[k + 2] / 255);
const ratio = (x: number, y: number) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
const q = (r: number[], f: number) => r[Math.min(r.length - 1, Math.floor(r.length * f))];

/** Seat a peer cursor on cell 40 the product's way — its class and its var — bound to `ink`,
 *  held against the session's own re-render; `null` lifts it. */
async function seat(page: Page, ink: string | null) {
  await page.evaluate((v) => {
    const w = window as unknown as { __tin?: MutationObserver };
    const cell = document.querySelectorAll<HTMLElement>(".game-cell")[40];
    w.__tin?.disconnect();
    if (v === null) {
      cell.classList.remove("is-peer-cursor");
      cell.style.removeProperty("--color-peer-cursor-ink");
      return;
    }
    const set = () => {
      cell.style.setProperty("--color-peer-cursor-ink", v);
      cell.classList.add("is-peer-cursor");
    };
    set();
    const o = new MutationObserver(() => {
      if (!cell.classList.contains("is-peer-cursor")) set();
    });
    o.observe(cell, { attributes: true, attributeFilter: ["class", "style"] });
    w.__tin = o;
  }, ink);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const p = document.querySelectorAll(".game-cell")[40]?.querySelector(".cell-ghost-path");
        return !p || p.getAnimations().every((a) => a.playState !== "running");
      }),
    )
    .toBe(true);
}

/** The ring photographed OFF / ON / OFF: the core is every pixel the ring moved at ≥ 50 % of
 *  the most-moved one (boil noise — a pixel the two OFF shots disagree on — dropped), each read
 *  against the median of eight fill samples. The sensitivity row walks 50/70/90/100 %. */
async function ringCore(page: Page, ink: string) {
  const box = (await page.locator(".game-cell").nth(40).boundingBox())!;
  const clip = {
    x: Math.floor(box.x - 6),
    y: Math.floor(box.y - 6),
    width: Math.ceil(box.width + 12),
    height: Math.ceil(box.height + 12),
  };
  await seat(page, null);
  const A = await rawOf(page, await page.screenshot({ clip }));
  await seat(page, ink);
  const B = await rawOf(page, await page.screenshot({ clip }));
  await seat(page, null);
  const C = await rawOf(page, await page.screenshot({ clip }));
  const s = B.w / clip.width;
  const fills: number[] = [];
  for (const [fx, fy] of [[0.3, 0.2], [0.7, 0.2], [0.2, 0.3], [0.8, 0.3], [0.2, 0.7], [0.8, 0.7], [0.3, 0.8], [0.7, 0.8]]) {
    const x = Math.round((box.x - clip.x + box.width * fx) * s);
    const y = Math.round((box.y - clip.y + box.height * fy) * s);
    fills.push(lumAt(B.data, (y * B.w + x) * 4));
  }
  fills.sort((p, r) => p - r);
  const fillL = fills[fills.length >> 1];
  const mv: [number, number][] = [];
  let top = 0;
  let noise = 0;
  const dist = (X: number[], Y: number[], i: number) =>
    Math.abs(X[i] - Y[i]) + Math.abs(X[i + 1] - Y[i + 1]) + Math.abs(X[i + 2] - Y[i + 2]);
  for (let i = 0; i < B.data.length; i += 4) {
    if (dist(A.data, C.data, i) > 8) {
      noise++;
      continue;
    }
    const d = dist(A.data, B.data, i);
    mv.push([d, i]);
    top = Math.max(top, d);
  }
  const row = (f: number) => {
    const r = mv
      .filter(([d]) => d >= f * top && top > 0)
      .map(([, i]) => ratio(lumAt(B.data, i), fillL))
      .sort((p, t) => p - t);
    return { n: r.length, max: r[r.length - 1], p30: q(r, 0.3), med: q(r, 0.5), under: r.filter((v) => v < 3).length / r.length };
  };
  const core = row(0.5);
  const sens = [0.5, 0.7, 0.9, 1.0]
    .map((f) => {
      const x = row(f);
      return `${f * 100}%: med ${x.med?.toFixed(3)} <3 ${(x.under * 100).toFixed(1)}% (${x.n})`;
    })
    .join(" | ");
  return { core, sens, noise, top };
}
// ── 2b · THE NAME ON THE TAPE, PAINTED ──────────────────────────────────────────────────────
/** PAL-WALK's painted-text instrument (the pass-4 critic's, landed): the label photographed as
 *  drawn, again with its colour transparent, and a third time as the noise control; every pixel
 *  the TEXT changed is read against the ground painted under it (paper, grid line, digit). A
 *  Range over the text bounds the clip, so the board past the paper's torn ends is not read. */
async function paintedName(page: Page, label: ReturnType<Page["locator"]>) {
  const box = await label.evaluate((l) => {
    const r = document.createRange();
    r.selectNodeContents(l.firstChild!);
    const b = r.getBoundingClientRect();
    return { x: b.x, y: b.y, width: b.width, height: b.height };
  });
  const clip = { x: box.x - 1, y: box.y - 1, width: box.width + 2, height: box.height + 2 };
  const ink = await rawOf(page, await page.screenshot({ clip }));
  const spec = await label.evaluate((l) => getComputedStyle(l).color);
  await label.evaluate((l) => ((l as HTMLElement).style.color = "transparent"));
  await expect.poll(() => label.evaluate((l) => getComputedStyle(l).color)).toBe("rgba(0, 0, 0, 0)");
  const bare = await rawOf(page, await page.screenshot({ clip }));
  await label.evaluate((l) => ((l as HTMLElement).style.color = ""));
  await expect.poll(() => label.evaluate((l) => getComputedStyle(l).color)).toBe(spec);
  const again = await rawOf(page, await page.screenshot({ clip }));
  const specRgb = await page.evaluate((css) => {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    g.fillStyle = css;
    g.fillRect(0, 0, 1, 1);
    return Array.from(g.getImageData(0, 0, 1, 1).data.slice(0, 3));
  }, spec);
  const specL = lumAt(specRgb, 0);
  const moved: number[] = [];
  let top = 0;
  let noise = 0;
  const dist = (X: number[], Y: number[], k: number) =>
    Math.abs(X[k] - Y[k]) + Math.abs(X[k + 1] - Y[k + 1]) + Math.abs(X[k + 2] - Y[k + 2]);
  for (let k = 0; k < ink.data.length; k += 4) {
    if (dist(ink.data, again.data, k) > 8) {
      noise++;
      moved.push(0);
      continue;
    }
    const d = dist(ink.data, bare.data, k);
    moved.push(d);
    top = Math.max(top, d);
  }
  const text: number[] = [];
  const painted: { d: number; r: number }[] = [];
  moved.forEach((d, n) => {
    if (d <= 0.2 * top) return;
    const gl = lumAt(bare.data, n * 4);
    text.push(ratio(specL, gl));
    painted.push({ d, r: ratio(lumAt(ink.data, n * 4), gl) });
  });
  return {
    spec,
    textPx: text.length,
    worst: Math.min(...text),
    under45: text.filter((r) => r < 4.5).length,
    noise,
    // THE SENSITIVITY ROW: the painted glyph pixel against its own ground at 50/70/90/100 % of
    // the most-changed pixel — an antialiased edge never reaches its spec colour, so these print.
    sens: [0.5, 0.7, 0.9, 1.0]
      .map((f) => {
        const r = painted.filter((x) => x.d >= f * top).map((x) => x.r).sort((u, v) => u - v);
        return `${f * 100}%: med ${r[r.length >> 1]?.toFixed(3)} · ${r.filter((v) => v < 4.5).length}/${r.length} <4.5`;
      })
      .join(" | "),
  };
}

// ════════ PASS-5 CRITIC (PAL-TIN) — independent rows ════════
import * as fs from "node:fs";
const OUT = process.env.CR_SHOTS || "/tmp";

/** The lane's photograph, plus MY statistic: every core pixel against the SAME pixel with the
 *  ring off (the ground the stroke abuts, pixel for pixel), not against the cell-interior fill. */
async function ringBoth(page: Page, ink: string) {
  const box = (await page.locator(".game-cell").nth(40).boundingBox())!;
  const clip = { x: Math.floor(box.x - 6), y: Math.floor(box.y - 6), width: Math.ceil(box.width + 12), height: Math.ceil(box.height + 12) };
  await seat(page, null);
  const A = await rawOf(page, await page.screenshot({ clip }));
  await seat(page, ink);
  const B = await rawOf(page, await page.screenshot({ clip }));
  await seat(page, null);
  const Cc = await rawOf(page, await page.screenshot({ clip }));
  const s = B.w / clip.width;
  const fills: number[] = [];
  for (const [fx, fy] of [[0.3, 0.2], [0.7, 0.2], [0.2, 0.3], [0.8, 0.3], [0.2, 0.7], [0.8, 0.7], [0.3, 0.8], [0.7, 0.8]]) {
    const x = Math.round((box.x - clip.x + box.width * fx) * s);
    const y = Math.round((box.y - clip.y + box.height * fy) * s);
    fills.push(lumAt(B.data, (y * B.w + x) * 4));
  }
  fills.sort((p, r) => p - r);
  const fillL = fills[fills.length >> 1];
  const dist = (X: number[], Y: number[], i: number) => Math.abs(X[i] - Y[i]) + Math.abs(X[i + 1] - Y[i + 1]) + Math.abs(X[i + 2] - Y[i + 2]);
  let top = 0; const mv: [number, number][] = [];
  for (let i = 0; i < B.data.length; i += 4) { if (dist(A.data, Cc.data, i) > 8) continue; const d = dist(A.data, B.data, i); mv.push([d, i]); top = Math.max(top, d); }
  const core = mv.filter(([d]) => d >= 0.5 * top);
  const vsFill = core.map(([, i]) => ratio(lumAt(B.data, i), fillL)).sort((a, b) => a - b);
  const vsOwn = core.map(([, i]) => ratio(lumAt(B.data, i), lumAt(A.data, i))).sort((a, b) => a - b);
  const st = (r: number[]) => ({ med: q(r, 0.5), p30: q(r, 0.3), under: r.filter((v) => v < 3).length / r.length });
  return { n: core.length, top, fill: st(vsFill), own: st(vsOwn) };
}

test("CRIT ring: lane statistic vs own-ground statistic, five arms both themes, plus the 0.32 / 0.775 plants", async ({ page }, info) => {
  test.slow();
  await boot(page, SOLO);
  const dpr = await page.evaluate(() => devicePixelRatio);
  const plants: Record<string, string[]> = { light: ["#552100", "#2a3900", "#003b3d", "#260094", "#590052"], dark: ["#ff975f", "#9ac900", "#00cfd5", "#a2afff", "#ff7cef"] };
  const lines: string[] = [];
  for (const arm of ["light", "dark"] as const) {
    await setTheme(page, arm);
    for (let k = 1; k <= 5; k++) {
      const r = await ringBoth(page, `var(--color-peer-${k}-ring)`);
      const p = await ringBoth(page, plants[arm][k - 1]);
      const f = (x: { med: number; p30: number; under: number }) => `med ${x.med.toFixed(3)} p30 ${x.p30.toFixed(3)} <3 ${(x.under * 100).toFixed(1)}%`;
      lines.push(`RINGCRIT ${info.project.name} dpr${dpr} ${arm} peer-${k} n${r.n} | vsFill ${f(r.fill)} | vsOwnGround ${f(r.own)} || PLANT ${plants[arm][k - 1]} vsFill ${f(p.fill)} | vsOwn ${f(p.own)}`);
    }
  }
  for (const l of lines) console.log(l);
});

test("CRIT tape: the product's own binding, painted, light and dark, three cells; + the light stick-vs-ring pair", async ({ browser }, info) => {
  test.slow();
  const { ctx, pages } = await room(browser, 2);
  const [a, b] = pages;
  const inputs = (p: Page) => p.locator(".sudoku-cell input");
  const empty = [...GIVENS].flatMap((ch, i) => (ch === "." ? [i] : []));
  const cells = [...empty.filter((i) => i >= 9 && GIVENS[i - 9] !== ".").slice(0, 2), empty[0]];
  for (const x of cells) {
    await inputs(b).nth(x).click();
    await inputs(b).nth(x).fill("7");
    await expect.poll(() => inputs(a).nth(x).inputValue()).toBe("7");
  }
  await inputs(b).nth(GIVENS.indexOf("3")).click({ force: true });
  const label = a.locator(".attribution-tape .washi-label");
  const rows: string[] = [];
  for (const arm of ["light", "dark"] as const) {
    await setTheme(a, arm);
    for (const x of cells) {
      await expect(async () => {
        await a.mouse.move(2, 2);
        await a.locator(".game-cell").nth(x).hover();
        await expect(label).toBeVisible({ timeout: 3000 });
      }).toPass({ timeout: 30000 });
      const t = await paintedName(a, label);
      const digit = await a.locator(".sudoku-cell").nth(x).evaluate((c) => getComputedStyle(c).getPropertyValue("--color-user-ink").trim() || getComputedStyle(c.querySelector("path") ?? c).stroke);
      rows.push(`TAPECRIT ${info.project.name} ${arm} cell ${x} name ${t.spec} (digit's own ink token ${digit}) · worst ${t.worst.toFixed(3)} · ${t.under45}/${t.textPx} px <4.5 · noise ${t.noise} · ${t.sens}`);
      if (x === cells[1]) {
        const tape = a.locator(".attribution-tape .washi-label");
        const bb = (await tape.boundingBox())!;
        const clip = { x: bb.x - 8, y: bb.y - 8, width: bb.width + 16, height: bb.height + 16 };
        fs.writeFileSync(`${OUT}/${info.project.name}-${arm}-name-product.png`, await a.screenshot({ clip }));
        if (process.env.CR_ARMS === "tin") {
          await a.locator(".attribution-tape").evaluate((el) => (el as HTMLElement).style.setProperty("--color-peer-cursor-ink", "var(--color-user-ink)"));
          await expect.poll(() => label.evaluate((l) => getComputedStyle(l).color)).not.toBe(t.spec);
          const stick = await label.evaluate((l) => getComputedStyle(l).color);
          fs.writeFileSync(`${OUT}/${info.project.name}-${arm}-name-stick.png`, await a.screenshot({ clip }));
          rows.push(`TAPECRIT ${info.project.name} ${arm} cell ${x} PAIR ring-arm ${t.spec} vs stick ${stick} (one hover, one cell, the binding the only variable)`);
          await a.locator(".attribution-tape").evaluate((el) => (el as HTMLElement).style.removeProperty("--color-peer-cursor-ink"));
        }
      }
      await a.mouse.move(2, 2);
      await expect(label).toHaveCount(0);
    }
  }
  for (const r of rows) console.log(r);
  await ctx.close();
});

test("CRIT ink isolation: one slug, one cell, the ink the only variable (HEAD's ink vs the tin's arms vs a lifted arm)", async ({ browser }, info) => {
  test.slow();
  const { ctx, pages } = await room(browser, 2);
  const [a, b] = pages;
  const inputs = (p: Page) => p.locator(".sudoku-cell input");
  const empty = [...GIVENS].flatMap((ch, i) => (ch === "." ? [i] : []));
  const cells = [...empty.filter((i) => i >= 9 && GIVENS[i - 9] !== ".").slice(0, 2), empty[0]];
  for (const x of cells) {
    await inputs(b).nth(x).click();
    await inputs(b).nth(x).fill("7");
    await expect.poll(() => inputs(a).nth(x).inputValue()).toBe("7");
  }
  await inputs(b).nth(GIVENS.indexOf("3")).click({ force: true });
  const label = a.locator(".attribution-tape .washi-label");
  const inks: Record<string, string[]> = {
    dark: ["oklch(0.8 0.11 137.5)", "var(--color-peer-1-ring)", "var(--color-peer-2-ring)", "var(--color-peer-3-ring)", "var(--color-peer-4-ring)", "var(--color-peer-5-ring)", "oklch(0.83 0.12 332.1)", "oklch(0.83 0.12 48.2)"],
    light: ["oklch(0.5 0.11 137.5)", "var(--color-peer-1)", "var(--color-peer-2)", "var(--color-peer-5)", "var(--color-peer-1-ring)", "var(--color-peer-2-ring)"],
  };
  const rows: string[] = [];
  for (const arm of ["dark", "light"] as const) {
    await setTheme(a, arm);
    for (const x of cells) {
      await expect(async () => {
        await a.mouse.move(2, 2);
        await a.locator(".game-cell").nth(x).hover();
        await expect(label).toBeVisible({ timeout: 3000 });
      }).toPass({ timeout: 30000 });
      const slug = await label.evaluate((l) => l.textContent?.trim());
      for (const ink of inks[arm]) {
        await a.locator(".attribution-tape").evaluate((t, v) => (t as HTMLElement).style.setProperty("--color-peer-cursor-ink", v), ink);
        await a.waitForTimeout(0);
        const t = await paintedName(a, label);
        rows.push(`ISO ${info.project.name} dpr${await a.evaluate(() => devicePixelRatio)} ${arm} cell ${x} slug ${slug} ink ${ink} -> ${t.spec} · worst ${t.worst.toFixed(3)} · ${t.under45}/${t.textPx} px <4.5`);
        if (x === cells[1] && process.env.CR_SHOTS2 && (ink.includes("peer-2") || ink.startsWith("oklch(0.5") || ink.startsWith("oklch(0.8 "))) {
          const bb = (await label.boundingBox())!;
          fs.writeFileSync(`${process.env.CR_SHOTS2}/${info.project.name}-${arm}-${ink.replace(/[^a-z0-9.]+/gi, "_")}.png`, await a.screenshot({ clip: { x: bb.x - 8, y: bb.y - 8, width: bb.width + 16, height: bb.height + 16 } }));
        }
      }
      await a.locator(".attribution-tape").evaluate((t) => (t as HTMLElement).style.removeProperty("--color-peer-cursor-ink"));
      await a.mouse.move(2, 2);
      await expect(label).toHaveCount(0);
    }
  }
  for (const r of rows) console.log(r);
  await ctx.close();
});
