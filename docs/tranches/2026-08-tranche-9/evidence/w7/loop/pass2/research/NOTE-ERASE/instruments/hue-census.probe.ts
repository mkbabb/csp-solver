/**
 * hue-census.probe.ts — T9-W7 round zero, lane R2 (THE ACCENT FAMILY).
 *
 * Re-runs the formation census (registry F18, 2026-08-10) on THIS tree, after W1–W6.
 * Three readings, all banked as numbers, none as pixels:
 *
 *   A. TOKEN RESOLUTION — every `--color-*` / `--ink-press-*` the @theme block declares,
 *      resolved by the browser in light AND dark, converted to OKLCH.
 *   B. SITE SAMPLING — the NAMED interactive accents, measured where they paint, with
 *      their alpha composited over the ground they sit on (a 7% wash's declared hex is
 *      not what an eye receives; the composite is).
 *   C. PIXEL CENSUS — the real "chromatic content" figure: every pixel of a rendered
 *      viewport, bucketed by OKLCH hue, chromatic iff C >= CHROMA_FLOOR.
 *
 * READ-ONLY on the product. Writes JSON under this lane's evidence dir only.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { rgbToOklch, hueDist, parseCss, over, ratio } from "./oklch";

const OUT =
  // T9-W7 pass-2 NOTE-ERASE: OUT RE-POINTED off r0 (the record is frozen; r0 banks to an
  // absolute path and pass 1 overwrote three r0 census files by running it in place).
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/NOTE-ERASE/census";
mkdirSync(OUT, { recursive: true });

/** A pixel counts as CHROMATIC at OKLCH C >= this. The paper itself is hsl(48 15% 98%),
 *  which is chromatic by any floor above zero — that is the point: the census must see
 *  the warm ground, because the warm ground IS the house family. */
const CHROMA_FLOOR = 0.012;

const SOLO = "./?size=3&difficulty=EASY";

async function boot(page: Page, url = SOLO) {
  await page.goto(url);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 20000 })
    .toBeGreaterThan(0);
}

/** Every custom property the @theme + .dark blocks declare, read off the live root. */
const TOKENS = [
  "--color-background",
  "--color-foreground",
  "--color-card",
  "--color-popover",
  "--color-muted-foreground",
  "--color-accent",
  "--color-border",
  "--color-ring",
  "--color-user-ink",
  "--color-crayon-green",
  "--color-crayon-orange",
  "--color-crayon-rose",
  "--color-crayon-blue",
  "--color-crayon-gold",
  "--color-gold-ink",
  "--color-red-ink",
  "--color-green-ink",
  "--color-orange-ink",
  "--color-solver-ink-1",
  "--color-solver-ink-2",
  "--color-solver-ink-3",
  "--color-solver-ink-4",
  "--color-solver-ink-5",
  "--color-teacher-red",
  "--color-gold-star",
  "--color-focus-sketch",
  "--color-pencil-graphite",
  "--color-progress-ink",
  "--grid-line-color",
  "--ink-press-rule",
  "--ink-press-quiet",
  "--peer-ink-l",
];

/** Resolve a declared token through the browser's own parser (a `var()` chain, a
 *  `color-mix()`, an `hsl()` — all of them land as a device colour this way). */
async function resolveTokens(page: Page): Promise<Record<string, string>> {
  return page.evaluate((names: string[]) => {
    const probe = document.createElement("div");
    probe.style.position = "fixed";
    probe.style.left = "-9999px";
    document.body.appendChild(probe);
    const out: Record<string, string> = {};
    for (const n of names) {
      probe.style.color = "";
      probe.style.setProperty("color", `var(${n})`);
      const c = getComputedStyle(probe).color;
      const raw = getComputedStyle(document.documentElement).getPropertyValue(n).trim();
      out[n] = c && c !== "rgb(0, 0, 0)" ? c : raw || c;
      // `--peer-ink-l` is a scalar, not a colour; keep the raw.
      if (n === "--peer-ink-l") out[n] = raw;
    }
    probe.remove();
    return out;
  }, TOKENS);
}

interface SiteSample {
  job: string;
  site: string;
  selector: string;
  prop: string;
  declared: string | null;
  alpha: number;
  ground: string | null;
  found: boolean;
}

/** The named accent sites, sampled where they paint. `ground` is the nearest opaque
 *  ancestor background — what the wash actually composites over. */
async function sampleSites(page: Page): Promise<SiteSample[]> {
  return page.evaluate(() => {
    const SITES: { job: string; site: string; selector: string; prop: string }[] = [
      { job: "authorship", site: "your digit's stroke", selector: ".sudoku-cell .glyph-svg path", prop: "stroke" },
      { job: "selection", site: "unit wash (row/col/box reach)", selector: ".cell-peer", prop: "background-color" },
      { job: "selection", site: "hover ghost ring (tier 1)", selector: ".game-cell .cell-ghost-path", prop: "stroke" },
      { job: "focus", site: "keyboard ring (tier 2)", selector: ".game-cell:has(input:focus-visible) .cell-ghost-path", prop: "stroke" },
      { job: "danger", site: "conflict ring (tier 3)", selector: ".game-cell.is-invalid .cell-ghost-path", prop: "stroke" },
      { job: "danger", site: "hint laminate wash", selector: ".cell-because", prop: "background-color" },
      { job: "progress", site: "fill meter trace", selector: ".progress-trace", prop: "stroke" },
      { job: "celebration", site: "solved grid line", selector: ".solve-success .grid-line", prop: "stroke" },
      { job: "structure", site: "grid line", selector: ".grid-line", prop: "stroke" },
      { job: "focus", site: "control button ring", selector: ".ctrl-btn:focus-visible", prop: "outline-color" },
      { job: "authorship", site: "roster name", selector: ".player-row .player-name", prop: "color" },
      { job: "authorship", site: "roster swatch", selector: ".player-swatch", prop: "background-color" },
      { job: "danger", site: "margin note, teacher-red", selector: ".margin-note .teacher-red", prop: "color" },
      { job: "celebration", site: "margin note, gold-star", selector: ".margin-note .gold-star", prop: "color" },
      { job: "quiet", site: "margin note, graphite", selector: ".margin-note .graphite", prop: "color" },
      { job: "difficulty", site: "easy chip", selector: ".crayon-green", prop: "color" },
      { job: "difficulty", site: "medium chip", selector: ".crayon-orange", prop: "color" },
      { job: "difficulty", site: "hard chip", selector: ".crayon-rose", prop: "color" },
      { job: "confirm", site: "guard ribbon frame", selector: ".guard-note-frame", prop: "background-color" },
      { job: "confirm", site: "guard face", selector: ".guard-face", prop: "stroke" },
      { job: "chrome", site: "card ground", selector: ".controls-card", prop: "background-color" },
      { job: "chrome", site: "page ground", selector: ".page-root", prop: "background-color" },
      { job: "chrome", site: "washi tab", selector: ".drawer-tab-tongue", prop: "background-color" },
      { job: "chrome", site: "action bar", selector: ".action-bar", prop: "background-color" },
    ];

    function opaqueGround(el: Element): string | null {
      let n: Element | null = el;
      while (n) {
        const bg = getComputedStyle(n).backgroundColor;
        const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i.exec(bg);
        if (m && (m[4] == null || parseFloat(m[4]) >= 0.999)) return bg;
        n = n.parentElement;
      }
      return getComputedStyle(document.body).backgroundColor;
    }

    return SITES.map((s) => {
      const el = document.querySelector(s.selector);
      if (!el) return { ...s, declared: null, alpha: 0, ground: null, found: false };
      const cs = getComputedStyle(el);
      const declared = cs.getPropertyValue(s.prop) || null;
      // stroke/fill carry their opacity on a SIBLING property, never in the colour.
      let alpha = 1;
      if (s.prop === "stroke") alpha = parseFloat(cs.strokeOpacity || "1");
      if (s.prop === "fill") alpha = parseFloat(cs.fillOpacity || "1");
      const m = /rgba\([^)]*[,/]\s*([\d.]+)\s*\)/.exec(declared || "");
      if (m) alpha *= parseFloat(m[1]);
      return { ...s, declared, alpha, ground: opaqueGround(el), found: true };
    });
  });
}

/** C — the pixel census. Screenshot → raw RGB → OKLCH → hue buckets. */
async function pixelCensus(page: Page, label: string) {
  const buf = await page.screenshot({ type: "png" });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const total = info.width * info.height;
  const bins = new Array(36).fill(0); // 10° bins
  let chromatic = 0;
  let sumC = 0;
  for (let i = 0; i < total; i++) {
    const o = i * ch;
    const { C, h } = rgbToOklch(data[o], data[o + 1], data[o + 2]);
    if (C >= CHROMA_FLOOR) {
      chromatic++;
      sumC += C;
      bins[Math.min(35, Math.floor(h / 10))]++;
    }
  }
  return {
    label,
    width: info.width,
    height: info.height,
    pixels: total,
    chromaticPixels: chromatic,
    chromaticShare: chromatic / total,
    meanChroma: chromatic ? sumC / chromatic : 0,
    bins10deg: bins,
    binShares: bins.map((n) => (chromatic ? n / chromatic : 0)),
  };
}

for (const scheme of ["light", "dark"] as const) {
  test(`hue census — ${scheme}`, async ({ page, browserName }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);
    await page.waitForTimeout(900);

    const tokens = await resolveTokens(page);
    const rest = await pixelCensus(page, "rest");
    const sitesRest = await sampleSites(page);

    // ── under interaction ──────────────────────────────────────────────
    // keyboard focus onto an empty cell: tier-2 ring + the unit wash together.
    const emptyCell = page.locator(".sudoku-cell input:not([readonly])").first();
    await emptyCell.focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(450);
    const sitesFocus = await sampleSites(page);
    const focused = await pixelCensus(page, "cell-focused");

    // fill the board partway so the violet trace has arc to draw.
    const wrote = await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll<HTMLInputElement>(".sudoku-cell input"),
      ).filter((i) => !i.readOnly && !i.value);
      return inputs.length;
    });
    for (let i = 0; i < 12; i++) {
      await page.keyboard.type("1");
      await page.keyboard.press("ArrowRight");
    }
    await page.waitForTimeout(700);
    const sitesMid = await sampleSites(page);
    const mid = await pixelCensus(page, "mid-board");

    // hover a control button (fine pointer).
    const ctrl = page.locator(".controls-card .ctrl-btn").first();
    if (await ctrl.count()) {
      await ctrl.hover().catch(() => {});
      await page.waitForTimeout(250);
    }
    const sitesHover = await sampleSites(page);

    // keyboard focus onto a control: the estate's own outline ring.
    const btnRing = await page.evaluate(() => {
      const b = document.querySelector<HTMLElement>(".controls-card .ctrl-btn");
      if (!b) return null;
      b.focus();
      const cs = getComputedStyle(b);
      return {
        outlineColor: cs.outlineColor,
        outlineWidth: cs.outlineWidth,
        outlineStyle: cs.outlineStyle,
        boxShadow: cs.boxShadow,
      };
    });

    // the guard ribbon, armed: dirty board + the gallery's deal intent.
    let guard: Record<string, string> | null = null;
    await page.keyboard.press("Escape").catch(() => {});
    const galleryBtn = page.locator('[aria-label*="gallery" i], .wordmark-picker').first();
    if (await galleryBtn.count()) {
      await galleryBtn.click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(800);
      await page.keyboard.press("d").catch(() => {});
      await page.waitForTimeout(800);
      guard = await page.evaluate(() => {
        const f = document.querySelector(".guard-note-frame");
        const face = document.querySelector(".guard-face");
        if (!f) return null;
        const cf = getComputedStyle(f);
        const cface = face ? getComputedStyle(face) : null;
        return {
          frameBg: cf.backgroundColor,
          frameBorder: cf.borderTopColor,
          frameColor: cf.color,
          faceStroke: cface?.stroke ?? "",
          faceFill: cface?.fill ?? "",
        };
      });
    }

    writeFileSync(
      join(OUT, `census-${browserName}-${scheme}.json`),
      JSON.stringify(
        {
          engine: browserName,
          scheme,
          chromaFloor: CHROMA_FLOOR,
          tokens,
          tokensOklch: Object.fromEntries(
            Object.entries(tokens).map(([k, v]) => {
              const p = parseCss(v);
              if (!p) return [k, null];
              const o = rgbToOklch(p.r, p.g, p.b);
              return [k, { L: +o.L.toFixed(4), C: +o.C.toFixed(4), h: +o.h.toFixed(1), a: p.a }];
            }),
          ),
          emptyCellsAtStart: wrote,
          sites: { rest: sitesRest, focus: sitesFocus, mid: sitesMid, hover: sitesHover },
          controlRing: btnRing,
          guard,
          pixels: { rest, focused, mid },
        },
        null,
        2,
      ),
    );
  });
}

/** The live-session arm: two pages, one context, `?wire=local`. Peer ink is generated,
 *  so the census measures what the FORMULA produces rather than what a table declares. */
test("hue census — live session, peer ink + roster row", async ({ browser, browserName }) => {
  const ctx = await browser.newContext({ colorScheme: "light", reducedMotion: "reduce" });
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();

  const b = await ctx.newPage();
  await b.emulateMedia({ reducedMotion: "reduce" });
  await b.goto(link);
  await b.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2, {
    timeout: 25000,
  });

  // B writes a digit; A must see it in B's ink.
  const bCell = b.locator(".sudoku-cell input:not([readonly])").first();
  await bCell.focus();
  await b.keyboard.type("5");
  await a.waitForTimeout(1500);

  const roster = await a.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".controls-card .players-roster .player-row"));
    return rows.map((r) => {
      const sw = r.querySelector(".player-swatch");
      const nm = r.querySelector(".player-name");
      return {
        inlineInk: (r as HTMLElement).style.getPropertyValue("--color-user-ink"),
        swatchBg: sw ? getComputedStyle(sw).backgroundColor : null,
        nameColor: nm ? getComputedStyle(nm).color : null,
        text: (nm?.textContent ?? "").trim(),
      };
    });
  });

  const authored = await a.evaluate(() => {
    const cells = Array.from(document.querySelectorAll<HTMLElement>(".game-cell"));
    const out: { ink: string; strokeResolved: string }[] = [];
    for (const c of cells) {
      const ink = c.style.getPropertyValue("--color-user-ink");
      if (!ink) continue;
      const p = c.querySelector(".glyph-svg path");
      out.push({ ink, strokeResolved: p ? getComputedStyle(p).stroke : "" });
    }
    return out;
  });

  const peerHues = await a.evaluate(() => {
    // The formula itself, exercised over the first 12 indices — what a 12-person room
    // would be dealt. `playerIdentity.ts:69`: oklch(var(--peer-ink-l) 0.11 (i*137.5)%360).
    return Array.from({ length: 12 }, (_, i) => +((i * 137.5) % 360).toFixed(1));
  });

  const joinWash = await a.evaluate(() => {
    const el = document.querySelector(".join-wash, [class*='join-wash']");
    return el ? getComputedStyle(el).stroke || getComputedStyle(el).backgroundColor : null;
  });

  writeFileSync(
    join(OUT, `census-${browserName}-live.json`),
    JSON.stringify({ engine: browserName, roster, authored, peerHues, joinWash }, null, 2),
  );

  await ctx.close();
});

/** A tiny, self-contained readback so the .md can cite a number without a JSON dive. */
test("kin arithmetic (no page) — the house wheel vs the interactive accents", async () => {
  const anchors: Record<string, string> = {
    "crayon-green": "#2dc653",
    "crayon-orange": "#f4a236",
    "crayon-rose": "#e8315b",
    "crayon-blue": "#4a90d9",
    "crayon-gold": "#c99a2e",
  };
  const accents: Record<string, string> = {
    "user-ink (authorship, light)": "#2563eb",
    "user-ink (authorship, dark)": "#60a5fa",
    "focus-sketch (focus)": "#3a7bc4",
    "progress-ink (progress, light)": "#8b5cf6",
    "progress-ink (progress, dark)": "#7c3aed",
    "solver-ink-1 (answer, light)": "#c2286e",
    "solver-ink-2 (answer, light)": "#7c3aed",
    "solver-ink-3 (answer, light)": "#2059c8",
    "solver-ink-4 (answer, light)": "#047857",
    "solver-ink-5 (answer, light)": "#92600a",
    "gold-ink (celebration, light)": "#8c691d",
    "red-ink (danger, light)": "#d02a52",
    "green-ink (difficulty, light)": "#1d7f35",
    "orange-ink (difficulty, light)": "#a26009",
  };
  const A = Object.fromEntries(
    Object.entries(anchors).map(([k, v]) => {
      const p = parseCss(v)!;
      return [k, rgbToOklch(p.r, p.g, p.b)];
    }),
  );
  const rows = Object.entries(accents).map(([k, v]) => {
    const p = parseCss(v)!;
    const o = rgbToOklch(p.r, p.g, p.b);
    let best = "";
    let bestD = 999;
    for (const [an, ao] of Object.entries(A)) {
      const d = hueDist(o.h, ao.h);
      if (d < bestD) {
        bestD = d;
        best = an;
      }
    }
    return {
      accent: k,
      hex: v,
      L: +o.L.toFixed(4),
      C: +o.C.toFixed(4),
      h: +o.h.toFixed(1),
      nearestAnchor: best,
      hueDist: +bestD.toFixed(1),
    };
  });
  const anchorRows = Object.entries(A).map(([k, o]) => ({
    anchor: k,
    hex: anchors[k],
    L: +o.L.toFixed(4),
    C: +o.C.toFixed(4),
    h: +o.h.toFixed(1),
  }));
  // The two blues, the formation's headline pair.
  const ui = parseCss("#2563eb")!;
  const fs = parseCss("#3a7bc4")!;
  const cb = parseCss("#4a90d9")!;
  const pair = {
    "user-ink vs focus-sketch (OKLCH)": +hueDist(
      rgbToOklch(ui.r, ui.g, ui.b).h,
      rgbToOklch(fs.r, fs.g, fs.b).h,
    ).toFixed(1),
    "user-ink vs crayon-blue (OKLCH)": +hueDist(
      rgbToOklch(ui.r, ui.g, ui.b).h,
      rgbToOklch(cb.r, cb.g, cb.b).h,
    ).toFixed(1),
    "focus-sketch vs crayon-blue (OKLCH)": +hueDist(
      rgbToOklch(fs.r, fs.g, fs.b).h,
      rgbToOklch(cb.r, cb.g, cb.b).h,
    ).toFixed(1),
  };
  // The peer walk: 137.5° golden angle vs the five anchors, 12 indices.
  const peerWalk = Array.from({ length: 12 }, (_, i) => {
    const h = (i * 137.5) % 360;
    let best = "";
    let bestD = 999;
    for (const [an, ao] of Object.entries(A)) {
      const d = hueDist(h, ao.h);
      if (d < bestD) {
        bestD = d;
        best = an;
      }
    }
    return { index: i, hue: +h.toFixed(1), nearestAnchor: best, hueDist: +bestD.toFixed(1) };
  });
  // Contrast ledger for the contrast-bearing exceptions.
  const card = parseCss("#fdfdfc")!;
  const bg = parseCss("hsl(48 15% 98%)") ?? { r: 250, g: 250, b: 247, a: 1 };
  const contrast = {
    "focus-sketch @0.9 over card": +ratio(over({ ...fs, a: 0.9 }, card), card).toFixed(2),
    "crayon-blue @0.9 over card": +ratio(over({ ...cb, a: 0.9 }, card), card).toFixed(2),
    "user-ink over card (text)": +ratio(ui, card).toFixed(2),
    "unit wash 7% crayon-blue over card": +ratio(over({ ...cb, a: 0.07 }, card), card).toFixed(3),
  };
  writeFileSync(
    join(OUT, "kin-arithmetic.json"),
    JSON.stringify({ anchorRows, rows, pair, peerWalk, contrast, bg }, null, 2),
  );
  expect(rows.length).toBeGreaterThan(0);
});
