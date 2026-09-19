/**
 * PLR-SELF pass 2 — G5 (the sheet's AA, on the OPAQUE ground, with the wordmark under it) and
 * the 40-index walk at 100% on both grounds and both themes.
 *
 * The method is the DARKEST PAINTED PIXEL, not a percentile: with a quarter of the state line's
 * box at 204 (the wordmark's bleed) a 2nd-percentile sampler lands on anti-aliased edges and
 * reads 4.38, which is a misreading research banked and corrected. The number that matters is
 * the glyph CORE against the paper that glyph actually sits on.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import { DESK, say, settled, invite, addPeers, mark, openSheet } from "./harness";

const url = (g: string) => `./?game=${g}&size=3&difficulty=EASY&wire=local`;
const lum = (r: number, g: number, b: number) => {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const cr = (a: number, b: number) =>
  +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2);

async function readSheet(page: Page, label: string) {
  const boxes = await page.evaluate(() => {
    const vis = (s: string) =>
      [...document.querySelectorAll(s)].find(
        (e) => (e as HTMLElement).getClientRects().length > 0,
      ) as HTMLElement | undefined;
    const r = (el?: HTMLElement) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: b.x, y: b.y, w: b.width, h: b.height, right: b.right, bottom: b.bottom };
    };
    const sheet = [...document.querySelectorAll("[data-lobby]")].find(
      (e) => getComputedStyle(e).visibility === "visible",
    ) as HTMLElement | undefined;
    return {
      wordmark: r(vis("svg.handwritten-logo")),
      sheet: r(sheet),
      ground: sheet ? getComputedStyle(sheet).backgroundColor : "",
      glyphs: [
        ...document.querySelectorAll(
          "[data-lobby] .lobby-state, [data-lobby] .lobby-qualifier, [data-lobby] .lobby-overflow, [data-lobby] .lobby-name",
        ),
      ]
        .filter((e) => e.getClientRects().length)
        .map((e) => {
          const b = e.getBoundingClientRect();
          return {
            cls: (e.className as string).split(" ")[0],
            text: (e.textContent ?? "").trim().slice(0, 22),
            x: b.x,
            y: b.y,
            w: b.width,
            h: b.height,
          };
        }),
    };
  });

  const rows: unknown[] = [];
  for (const q of boxes.glyphs) {
    const clip = {
      x: Math.max(0, Math.round(q.x)),
      y: Math.max(0, Math.round(q.y)),
      width: Math.max(1, Math.round(q.w)),
      height: Math.max(1, Math.round(q.h)),
    };
    const buf = await page.screenshot({ clip });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    // LUMINANCE, NOT THE RED CHANNEL. A chromatic ink's red byte says nothing about how dark
    // it reads: a green at oklch 0.5 has a low red byte and a high luminance, an amber the
    // reverse. The core is the DARKEST-BY-LUMINANCE pixel and the paper is the modal one,
    // each carrying its own three bytes into the ratio.
    let core: [number, number, number] = [255, 255, 255];
    let coreY = 2;
    const hist = new Map<string, number>();
    for (let i = 0; i < data.length; i += info.channels) {
      const px: [number, number, number] = [data[i], data[i + 1], data[i + 2]];
      const y = lum(px[0], px[1], px[2]);
      hist.set(px.join(","), (hist.get(px.join(",")) ?? 0) + 1);
      if (y < coreY) {
        coreY = y;
        core = px;
      }
    }
    const modes = [...hist.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    const paper = modes
      .map((m) => m[0].split(",").map(Number) as [number, number, number])
      .sort((a, b) => lum(b[0], b[1], b[2]) - lum(a[0], a[1], a[2]))[0];
    rows.push({
      cls: q.cls,
      text: q.text,
      core: core.join(","),
      paper: paper.join(","),
      ratio: cr(coreY, lum(paper[0], paper[1], paper[2])),
    });
  }
  const lap =
    boxes.sheet && boxes.wordmark
      ? !(
          boxes.sheet.right < boxes.wordmark.x ||
          boxes.sheet.x > boxes.wordmark.right ||
          boxes.sheet.bottom < boxes.wordmark.y ||
          boxes.sheet.y > boxes.wordmark.bottom
        )
      : false;
  say({ g: "G5", label, ground: boxes.ground, wordmarkUnderSheet: lap, rows });
  return {
    rows: rows as { cls: string; ratio: number }[],
    lap,
    ground: boxes.ground,
  };
}

for (const game of ["sudoku", "futoshiki"]) {
  for (const theme of ["light", "dark"] as const) {
    test(`G5 — ${game}, ${theme}: every glyph core >= 4.5:1 on the opaque ground`, async ({
      browser,
    }) => {
      const ctx = await browser.newContext({
        viewport: DESK,
        colorScheme: theme,
      });
      const page = await ctx.newPage();
      await page.goto(url(game));
      await settled(page);
      await invite(page);
      await addPeers(page, 3);
      await openSheet(page);
      // Park the pointer far away: a hovered mark swaps a pose, and a pointer over the sheet
      // would be reading a state no reader is in while they read.
      await page.mouse.move(900, 740);
      await page.waitForTimeout(700);
      const { rows, lap, ground } = await readSheet(page, `${game}-${theme}`);
      expect(rows.length, "the sheet has glyphs to read").toBeGreaterThan(3);
      expect(lap, "the wordmark IS under the sheet — that is the whole point").toBe(true);
      // THE GROUND IS OPAQUE, and that is what makes every number below a number: an `rgba`
      // or a `color(... / a)` here would mean the wordmark's 204 bleed is still composing.
      expect(ground, "the sheet's ground is opaque").toMatch(/^rgb\(\d+, \d+, \d+\)$/);
      // 1.4.3 TEXT — the quiet rung: the state line, the qualifiers and the compression line.
      for (const r of rows.filter((x) => x.cls !== "lobby-name"))
        expect(r.ratio, `${r.cls} core vs its own paper`).toBeGreaterThanOrEqual(4.5);
      // 1.4.11 — a row NAME is a player's own walk ink, one of forty hues at L 0.5 / 0.8. The
      // band `index.css:154-162` declares is 3:1 (non-text floor); this asserts the band on
      // PAINTED bytes rather than on the token's arithmetic, and the 40-index sweep below is
      // the same claim over the whole walk.
      for (const r of rows.filter((x) => x.cls === "lobby-name"))
        expect(r.ratio, `${r.cls} "${(r as any).text}" core vs its own paper`).toBeGreaterThanOrEqual(3);
      await ctx.close();
    });
  }
}

test("the 40-index walk at 100% clears 3:1 on background and card, both themes", async ({
  browser,
}) => {
  for (const theme of ["light", "dark"] as const) {
    const ctx = await browser.newContext({ viewport: DESK, colorScheme: theme });
    const page = await ctx.newPage();
    await page.goto(url("sudoku"));
    await settled(page);
    // THROUGH A CANVAS, not through a second `getComputedStyle` round trip. Re-resolving an
    // already-computed `oklch()` string in a fresh element is where the first cut of this probe
    // lost the dark arm: the round trip returned the paper's own bytes for every ink and the
    // sweep read a flat 1.00. A 1x1 canvas fill is the engine's own sRGB rasteriser, which is
    // the same path the screen takes.
    const resolved = await page.evaluate(async () => {
      const m = await import("/src/games/shared/playerIdentity.ts");
      const c = document.createElement("canvas");
      c.width = c.height = 1;
      const g = c.getContext("2d", { willReadFrequently: true })!;
      const paint = (css: string): [number, number, number] => {
        g.clearRect(0, 0, 1, 1);
        g.fillStyle = "#000";
        g.fillStyle = css;
        g.fillRect(0, 0, 1, 1);
        const d = g.getImageData(0, 0, 1, 1).data;
        return [d[0], d[1], d[2]];
      };
      const probe = document.createElement("div");
      document.body.appendChild(probe);
      const read = (bg: string) => {
        const host = document.createElement("div");
        host.style.background = `var(${bg})`;
        probe.appendChild(host);
        const paper = paint(getComputedStyle(host).backgroundColor);
        const inks: [number, number, number][] = [];
        for (let i = 0; i < 40; i++) {
          const el = document.createElement("span");
          const ink = (m as { inkFor(i: number): Record<string, string> }).inkFor(i);
          for (const [k, v] of Object.entries(ink)) el.style.setProperty(k, v);
          el.style.color = "var(--color-user-ink)";
          host.appendChild(el);
          inks.push(paint(getComputedStyle(el).color));
        }
        return { paper, inks };
      };
      const bg = read("--color-background");
      const card = read("--color-card");
      probe.remove();
      return { bg, card };
    });

    const worst: Record<string, number> = {};
    const papers: Record<string, string> = {};
    for (const [where, set] of Object.entries(resolved)) {
      const p = set.paper;
      const pl = lum(p[0], p[1], p[2]);
      papers[where] = p.join(",");
      let w = 99;
      for (const ink of set.inks) w = Math.min(w, cr(lum(ink[0], ink[1], ink[2]), pl));
      worst[where] = w;
    }
    say({ g: "walk40", theme, papers, worst });
    expect(worst.bg, `${theme} background`).toBeGreaterThanOrEqual(3);
    expect(worst.card, `${theme} card`).toBeGreaterThanOrEqual(3);
    await ctx.close();
  }
});
