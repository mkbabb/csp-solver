// PLR-COUNT pass-6 CRITIC instruments: helpers copied verbatim from e2e/player-tally.spec.ts (lines 1-200, 588-663).
/**
 * THE TALLY (T9-W7 PLR-COUNT) — the count a reader takes without reading, as rows.
 *
 * One counting base: the strokes, the glyph, the accessible name, the register's rows and its
 * foot all count everyone at this board. One threshold: five. What this file holds is the
 * behaviour a screenshot cannot — the name against the glyph (2.5.3), the width table, the
 * crossing (no survivor ever re-draws; the only stroke that draws is one the tally did not
 * hold a tick ago), a departure landing mid-draw, the keys, the phone budgets, the deck that
 * has no mark, the board's own ink under a room, the third join a reader is not pulled out
 * by, a quiet peer's qualifier on a fixed clock, reduced motion engaged mid-draw, two movers on
 * one clock, and two rows read off PAINTED bytes (the sheet's quiet lines on their ground; the
 * written count's ink against one stroke), each with its negative control in the same run. The
 * mark is seated on the §11 leader's substrate (`@pencil/chrome/PlayerMark`); its disclosure
 * rows, the keys and the seam included, are `player-mark.spec.ts`'s.
 *
 * PRM: live, because every row here asserts a RESTING pose or a same-frame swap — the draw-in
 * is the one tween on this surface and no assertion reads it mid-flight; the reduced-motion
 * arm of the draw-in is asserted by `emulateMedia` below rather than inferred.
 *
 * LOCAL (O-12): CI is browserless; this is an instrument, run against a dev server by hand.
 */
import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const mark = (page: Page) => page.locator("[data-player-mark]:visible").first();

/**
 * THE ESTATE IS KEYED ON THE OWNER'S FORK (PLR-COUNT pass-5 critic, gap 3). `SIX_ARM` is read
 * from the component's own source, so a run under any arm asserts THAT arm's promises and no
 * other's: a row written for arm (a) and run under (c) was the pass-5 blind spot.
 */
const SIX_ARM = /const SIX_ARM = "(title|heading|remainder)"/.exec(
  readFileSync(
    fileURLToPath(new URL("../src/pencil/chrome/PlayerMark/PlayerMark.vue", import.meta.url)),
    "utf8",
  ),
)![1] as "title" | "heading" | "remainder";
/** What the mark writes at N people under this arm (null: nothing written). */
const writtenAt = (N: number) =>
  N <= 5 ? null : SIX_ARM === "remainder" ? String(N - 5) : String(N);
/** The mark's accessible name at N people under this arm. */
const nameAt = (N: number) =>
  N === 1
    ? "1 player"
    : N > 5 && SIX_ARM === "remainder"
      ? `5 players and ${N - 5} more`
      : `${N} players`;
/** How many people a name counts: `6 players` is 6, arm (c)'s `5 players and 1 more` is 6. */
const countOf = (label: string | null) =>
  (label ?? "").match(/\d+/g)?.reduce((a, d) => a + Number(d), 0) ?? 0;

/** A pose is settled when two reads 150ms apart agree (the leader's `stable`, one rule). */
async function stable(read: () => Promise<unknown>) {
  let last: unknown = Symbol("unread");
  await expect
    .poll(
      async () => {
        const v = JSON.stringify(await read());
        const same = v === last;
        last = v;
        return same;
      },
      { intervals: [150], timeout: 8000 },
    )
    .toBe(true);
}
/** The sheet fades and scales; every box read here is of the SETTLED pose. */
const settle = (page: Page) =>
  stable(() =>
    page
      .locator("[data-lobby]:visible")
      .first()
      .evaluate((e) => [e.getBoundingClientRect().height, getComputedStyle(e).opacity]),
  );
/** Every drawn stroke has landed: each dash reads 0. */
const inked = (page: Page) =>
  expect.poll(async () => (await head(page)).offs.every((v) => v === "0")).toBe(true);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

let cursor = 0;
/** k people arrive on the local arm. The page answers each ack and inks them from its own
 *  walk, so the indices are the room's real ones. */
async function peers(page: Page, room: string, k: number) {
  if (k <= 0) return;
  const from = cursor;
  cursor += k;
  const was = countOf(await mark(page).getAttribute("aria-label", { timeout: 5000 })) || 1;
  await page.evaluate(
    ({ room, k, from }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < k; i++)
        w.__ch.postMessage({ kind: "hi", data: {}, from: `tally-${from + i}` });
    },
    { room, k, from },
  );
  // the room has heard all k when the mark's name counts them, and every stroke has landed
  await expect
    .poll(async () => countOf(await mark(page).getAttribute("aria-label", { timeout: 5000 })))
    .toBe(was + k);
  await inked(page);
}


// ── Painted bytes, decoded IN the page (the estate's idiom, `multiplayer.spec.ts:466`) ─────
// Ground = the modal colour of the crop's four 6px corners. `d` = a pixel's manhattan distance
// from it. A crop comes back as a histogram of `d`, so one normaliser can serve many crops (G16),
// and its core (the largest `d`). Text contrast is not read here: that is G14's glyph-text
// statistic, whose population is keyed on the glyph and not on the crop's own maximum.
type Painted = { hist: number[]; core: number };
async function painted(page: Page, png: Awaited<ReturnType<Page["screenshot"]>>): Promise<Painted> {
  return page.evaluate(
    async ({ b64 }) => {
      const bmp = await createImageBitmap(
        await (await fetch(`data:image/png;base64,${b64}`)).blob(),
      );
      const W = bmp.width;
      const H = bmp.height;
      const g = new OffscreenCanvas(W, H).getContext("2d")!;
      g.drawImage(bmp, 0, 0);
      const px = g.getImageData(0, 0, W, H).data;
      const at = (x: number, y: number) => {
        const i = (y * W + x) * 4;
        return [px[i], px[i + 1], px[i + 2]];
      };
      const tally = new Map<string, number>();
      for (const [ox, oy] of [
        [0, 0],
        [W - 6, 0],
        [0, H - 6],
        [W - 6, H - 6],
      ])
        for (let y = oy; y < oy + 6; y++)
          for (let x = ox; x < ox + 6; x++) {
            const k = at(x, y).join(",");
            tally.set(k, (tally.get(k) ?? 0) + 1);
          }
      const ground = [...tally].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
      const hist = new Array(766).fill(0);
      let core = 0;
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          const q = at(x, y);
          const d =
            Math.abs(q[0] - ground[0]) + Math.abs(q[1] - ground[1]) + Math.abs(q[2] - ground[2]);
          hist[d]++;
          core = Math.max(core, d);
        }
      return { hist, core };
    },
    { b64: png.toString("base64") },
  );
}
/** INK WEIGHT, DEFINED ONCE (G16): Σ over pixels with d > 8 of min(1, d / D), ÷ dpr². D is ONE
 *  normaliser for every crop compared (the largest core among them), never a crop's own. */
const inkOf = (h: number[], D: number, dpr: number) =>
  +(h.reduce((s, n, d) => (d > 8 ? s + n * Math.min(1, d / D) : s), 0) / (dpr * dpr)).toFixed(2);
/** The alpha of a computed colour in ANY serialisation: `rgba(r, g, b, a)`, `rgb(r g b / a)`,
 *  `color(srgb r g b / a)`, `oklch(… / a)`. A comma regex never sees the modern slash form. */
function alphaOf(c: string): number {
  if (c === "transparent") return 0;
  const slash = c.match(/\/\s*([\d.]+)(%?)\s*\)\s*$/);
  if (slash) return parseFloat(slash[1]) / (slash[2] ? 100 : 1);
  const legacy = c.match(/^rgba?\(([^)]*)\)$/);
  if (legacy) {
    const parts = legacy[1].split(/[\s,]+/).filter(Boolean);
    return parts.length === 4 ? parseFloat(parts[3]) : 1;
  }
  return 1;
}

const head = (page: Page) =>
  page.evaluate(() => {
    const m = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    ) as HTMLElement | undefined;
    const pose = m?.querySelector(".pt-pose");
    const b = m?.getBoundingClientRect();
    return {
      label: m?.getAttribute("aria-label") ?? null,
      width: b ? +b.width.toFixed(2) : null,
      height: b ? +b.height.toFixed(2) : null,
      strokes: pose ? pose.querySelectorAll("path").length : 0,
      written: m?.querySelector(".pt-count")?.textContent ?? null,
      writtenPx: m?.querySelector(".pt-count")
        ? getComputedStyle(m.querySelector(".pt-count")!).fontSize
        : null,
      ds: pose ? [...pose.querySelectorAll("path")].map((p) => p.getAttribute("d")) : [],
      offs: pose
        ? [...pose.querySelectorAll("path")].map((p) => p.getAttribute("stroke-dashoffset"))
        : [],
    };
  });
type GlyphText = { n: number; median: number | null; median2: number | null; under: number | null };
async function glyphText(page: Page, sel: string, tag: string): Promise<GlyphText> {
  const el = page.locator(sel).first();
  await el.evaluate((e, t) => e.setAttribute("data-aa-probe", t), tag);
  const b = (await el.boundingBox())!;
  const clip = {
    x: Math.floor(b.x) - 2,
    y: Math.floor(b.y) - 2,
    width: Math.ceil(b.width) + 4,
    height: Math.ceil(b.height) + 4,
  };
  const snap = async () =>
    (await page.screenshot({ clip, animations: "disabled" })).toString("base64");
  const probe = `html body [data-aa-probe="${tag}"]:not(#aa-none)`;
  const dark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  const ref = dark ? "#ffffff" : "#000000";
  const A = await snap();
  const A2 = await snap();
  const off = await page.addStyleTag({
    content: `${probe} { color: transparent !important; -webkit-text-fill-color: transparent !important; }`,
  });
  const B = await snap();
  await off.evaluate((t) => (t as HTMLElement).remove());
  const on = await page.addStyleTag({
    content: `${probe} { color: ${ref} !important; -webkit-text-fill-color: ${ref} !important; opacity: 1 !important; filter: none !important; mask-image: none !important; -webkit-mask-image: none !important; text-shadow: none !important; }`,
  });
  const R = await snap();
  await on.evaluate((t) => (t as HTMLElement).remove());
  await el.evaluate((e) => e.removeAttribute("data-aa-probe"));
  return page.evaluate(
    async ({ A, A2, B, R, dark }) => {
      const decode = async (b64: string) => {
        const bmp = await createImageBitmap(
          await (await fetch(`data:image/png;base64,${b64}`)).blob(),
        );
        const g = new OffscreenCanvas(bmp.width, bmp.height).getContext("2d")!;
        g.drawImage(bmp, 0, 0);
        return g.getImageData(0, 0, bmp.width, bmp.height).data;
      };
      const [a, a2, bg, r] = await Promise.all([A, A2, B, R].map(decode));
      const lin = (c: number) =>
        (c /= 255) <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      const L = (d: Uint8ClampedArray, i: number) =>
        0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
      const ratio = (x: number, y: number) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
      const li = dark ? 1 : 0;
      const one: number[] = [];
      const two: number[] = [];
      for (let i = 0; i < bg.length; i += 4) {
        const lg = L(bg, i);
        if (Math.abs(li - lg) < 1e-6) continue;
        if (Math.abs(L(r, i) - lg) / Math.abs(li - lg) < 0.5) continue;
        one.push(ratio(L(a, i), lg));
        two.push(ratio(L(a2, i), lg));
      }
      const med = (xs: number[]) =>
        xs.length ? +[...xs].sort((m, n) => m - n)[Math.floor(xs.length / 2)].toFixed(3) : null;
      return {
        n: one.length,
        median: med(one),
        median2: med(two),
        under: one.length ? +(one.filter((c) => c < 4.5).length / one.length).toFixed(3) : null,
      };
    },
    { A, A2, B, R, dark },
  );
}
const QUIET = [".pl-state", ".pl-qual", ".pl-more"] as const;
const X1B = QUIET.map((q) => `html body [data-lobby] ${q}`).join(", ") +
  " { -webkit-mask-image: linear-gradient(to right, #000 1.2em, rgba(0, 0, 0, 0.25) 1.2em) !important;" +
  " mask-image: linear-gradient(to right, #000 1.2em, rgba(0, 0, 0, 0.25) 1.2em) !important; }";
const X2 = QUIET.map((q) => `html.dark body [data-lobby] ${q}`).join(", ") +
  " { color: rgb(70, 68, 66) !important; }";
const holds = (r: GlyphText) =>
  r.n > 0 && (r.median ?? 0) >= 4.5 && (r.median2 ?? 0) >= 4.5;


import { appendFileSync } from "node:fs";
const OUT = process.env.CRIT_OUT!;
const log = (tag: string, o: unknown) => {
  const l = `${tag} ${JSON.stringify(o)}`;
  appendFileSync(OUT, l + "\n");
  console.log(l);
};

// ── CRIT-A · the blind band of G14's median: fade the LAST f of each line's TEXT to 25 % alpha
// (the X1b ink, placed at the tail instead of after 1.2em) and read the landed statistic.
for (const theme of ["light", "dark"] as const)
  for (const dpr of [1, 2])
    test.describe(`crit-A tail fade · ${theme} · dpr ${dpr}`, () => {
      test.skip(theme === "light" && dpr === 1, "ungated cell (T9-R6)");
      test.use({
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: dpr,
        colorScheme: theme,
        contextOptions: { reducedMotion: "reduce" },
      });
      test(`tail fade ${theme} dpr ${dpr}`, async ({ page }) => {
        const room = `crit-tail-${theme}-${dpr}-${Date.now()}`;
        await page.goto(`/?size=3&difficulty=EASY&wire=local&s=${room}`);
        await settled(page);
        await peers(page, room, 15);
        await mark(page).click();
        await settle(page);
        const out: Record<string, unknown> = {};
        for (const f of [0, 0.1, 0.2, 0.3, 0.4, 0.5]) {
          await page.evaluate((f) => {
            for (const q of [".pl-state", ".pl-qual", ".pl-more"]) {
              const e = [...document.querySelectorAll<HTMLElement>(`[data-lobby] ${q}`)].find(
                (x) => x.getBoundingClientRect().width > 0,
              )!;
              const r = document.createRange();
              r.selectNodeContents(e);
              const tb = r.getBoundingClientRect();
              const eb = e.getBoundingClientRect();
              const cut = tb.left - eb.left + tb.width * (1 - f);
              const g = f ? `linear-gradient(to right, #000 ${cut}px, rgba(0, 0, 0, 0.25) ${cut}px)` : "";
              e.style.setProperty("mask-image", g);
              e.style.setProperty("-webkit-mask-image", g);
            }
          }, f);
          const row: Record<string, unknown> = {};
          for (const q of QUIET) {
            const r = await glyphText(page, `[data-lobby]:visible ${q}`, `t${f}${q}`);
            row[q] = { ...r, holds: holds(r) };
          }
          out[String(f)] = row;
        }
        log("CRIT-A", { engine: test.info().project.name, theme, dpr, out });
      });
    });

// ── CRIT-B · ink per person, N = 1..16, under whatever SIX_ARM the source holds, ONE normaliser
// across the whole run; and at 16 the name against the sheet's own `and N more`.
for (const theme of ["light", "dark"] as const)
  test.describe(`crit-B ink per N · ${theme}`, () => {
    test.use({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
      colorScheme: theme,
      contextOptions: { reducedMotion: "reduce" },
    });
    test(`ink per N ${SIX_ARM} ${theme}`, async ({ page }) => {
      const room = `crit-inkn-${theme}-${Date.now()}`;
      await page.goto(`/?size=3&difficulty=EASY&wire=local&s=${room}`);
      await settled(page);
      await page.mouse.move(640, 790);
      const crops: { N: number; w: number; label: string | null; p: Painted }[] = [];
      let at = 1;
      for (let N = 1; N <= 16; N++) {
        await peers(page, room, N - at);
        at = N;
        await stable(() => mark(page).evaluate((e) => e.getBoundingClientRect().width));
        const h = await head(page);
        crops.push({ N, w: h.width!, label: h.label, p: await painted(page, await mark(page).screenshot({ animations: "disabled" })) });
      }
      const D = Math.max(...crops.map((c) => c.p.core));
      const ink = crops.map((c) => ({ N: c.N, w: c.w, label: c.label, ink: inkOf(c.p.hist, D, 2) }));
      const drops = ink.filter((c, i) => i > 0 && c.ink < ink[i - 1].ink).map((c) => `${c.N - 1}->${c.N}: ${ink[c.N - 2].ink}->${c.ink}`);
      await mark(page).click();
      await settle(page);
      const sheet = page.locator("[data-lobby]:visible").first();
      const state = (await sheet.locator(".pl-state").textContent())?.trim();
      const more = (await sheet.locator(".pl-more").textContent())?.trim();
      log("CRIT-B", { engine: test.info().project.name, arm: SIX_ARM, theme, D, ink, drops, at16: { name: await mark(page).getAttribute("aria-label"), state, more } });
    });
  });
