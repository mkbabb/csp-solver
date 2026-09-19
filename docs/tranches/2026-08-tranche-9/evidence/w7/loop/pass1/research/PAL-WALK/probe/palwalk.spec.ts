/**
 * PAL-WALK · PASS-1 PROBE. Read-only on the product: every colour change is an `addStyleTag`
 * overlay applied to a live page, never a source patch.
 *
 *   P1  the engine's own bytes for all 144 arc-walk indices at C 0.166 on four grounds,
 *       opaque AND at the pressures the ring and the trace are drawn at, plus the SHIPPED
 *       walk through the identical code as the control
 *   P2  the sRGB gamut, read as the chroma the ENGINE actually painted (not arithmetic)
 *   P3  the overlay on a live two-page room: solo byte-identical, the room bound to k[self],
 *       I2 re-run under it
 *   P4  two crops
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "fs";
import path from "path";

const WALK = JSON.parse(
  fs.readFileSync(path.join(__dirname, "walk.json"), "utf8"),
) as {
  guard: number;
  variant: string;
  step: number;
  L: number;
  open: [number, number][];
  chroma: number;
  hues: number[];
  shipped: number[];
};
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/PAL-WALK";
const SOLO = "./?size=3&difficulty=EASY&wire=local";
const log: string[] = [];
const say = (s: string) => {
  log.push(s);
  console.log(s);
};

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
    .toBeGreaterThan(0);
}
async function invite(page: Page): Promise<string> {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return page.url();
}
const roster = (p: Page) => p.locator(".controls-card .players-roster .player-row");

/** The overlay: every shipped walk hue remapped to its arc-walk twin at the wax chroma, plus
 *  the k[self] binding, gated on a room actually existing (`.players-leave` is `v-if` on
 *  `session.roomId`). `selfHue` null = do not bind self (the control arm). */
function overlayCss(selfHue: number | null): string {
  const rules: string[] = [];
  for (let i = 0; i < 40; i++) {
    const from = WALK.shipped[i].toFixed(1);
    const to = WALK.hues[i].toFixed(2);
    rules.push(
      `[style*="0.11 ${from}deg"]{--color-user-ink:oklch(var(--peer-ink-l) ${WALK.chroma} ${to}deg)!important}`,
    );
  }
  if (selfHue !== null)
    rules.push(
      `body:has(.players-leave){--color-user-ink:oklch(var(--peer-ink-l) ${WALK.chroma} ${selfHue.toFixed(2)}deg)!important}`,
    );
  return rules.join("\n");
}

// ── P1 + P2 · the engine's bytes ───────────────────────────────────────────────────────────
test("P1/P2 — 144 indices, four grounds, engine bytes", async ({ page }, info) => {
  await page.goto(SOLO);
  await settled(page);

  for (const theme of ["light", "dark"] as const) {
    await page.evaluate((t) => {
      document.documentElement.classList.toggle("dark", t === "dark");
    }, theme);
    const res = await page.evaluate(
      ({ hues, shipped, chroma }) => {
        const cs = getComputedStyle(document.documentElement);
        const band = cs.getPropertyValue("--peer-ink-l").trim();
        const grounds: Record<string, string> = {
          background: cs.getPropertyValue("--color-background").trim(),
          card: cs.getPropertyValue("--color-card").trim(),
        };
        const c = document.createElement("canvas");
        c.width = c.height = 1;
        const g = c.getContext("2d", { willReadFrequently: true })!;
        const paint = (ground: string, css: string, alpha: number) => {
          g.globalAlpha = 1;
          g.globalCompositeOperation = "copy";
          g.fillStyle = ground;
          g.fillRect(0, 0, 1, 1);
          g.globalCompositeOperation = "source-over";
          g.globalAlpha = alpha;
          g.fillStyle = css;
          g.fillRect(0, 0, 1, 1);
          const d = g.getImageData(0, 0, 1, 1).data;
          return [d[0], d[1], d[2]] as [number, number, number];
        };
        const lin = (v: number) =>
          v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        const lum = ([r, gg, b]: number[]) =>
          0.2126 * lin(r / 255) + 0.7152 * lin(gg / 255) + 0.0722 * lin(b / 255);
        const ratio = (a: number[], b: number[]) => {
          const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
          return (x + 0.05) / (y + 0.05);
        };
        // sRGB -> OKLCH, to read back the chroma the engine ACTUALLY painted
        const toOklch = ([R, G, B]: number[]) => {
          const [r, gg, b] = [R, G, B].map((v) => lin(v / 255));
          const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * gg + 0.0514459929 * b);
          const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * gg + 0.1073969566 * b);
          const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * gg + 0.6299787005 * b);
          const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
          const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
          const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
          let h = (Math.atan2(Bb, A) * 180) / Math.PI;
          if (h < 0) h += 360;
          return { L, C: Math.hypot(A, Bb), h };
        };
        const out: any = { band, grounds: {}, gamut: {}, painted: {}, control: {} };
        for (const [gname, gcss] of Object.entries(grounds)) {
          const gb = paint(gcss, "rgba(0,0,0,0)", 0);
          const rows: any = {};
          for (const [label, alpha] of [
            ["opaque", 1],
            ["ring055", 0.55],
            ["trace095", 0.95],
            ["trace065", 0.65],
            ["trace045", 0.45],
          ] as [string, number][]) {
            let worst = { r: 99, i: -1 };
            let under3 = 0,
              under45 = 0;
            for (let i = 0; i < 144; i++) {
              const px = paint(gcss, `oklch(${band} ${chroma} ${hues[i]}deg)`, alpha);
              const r = ratio(px, gb);
              if (r < worst.r) worst = { r, i };
              if (r < 3) under3++;
              if (r < 4.5) under45++;
            }
            rows[label] = {
              worst: +worst.r.toFixed(3),
              worstIndex: worst.i,
              under3,
              under45,
            };
          }
          // the CONTROL: the shipped walk at C 0.110, identical code
          const ctl: any = {};
          for (const [label, alpha] of [
            ["opaque", 1],
            ["ring055", 0.55],
            ["trace095", 0.95],
            ["trace065", 0.65],
            ["trace045", 0.45],
          ] as [string, number][]) {
            let worst = { r: 99, i: -1 };
            let under3 = 0;
            for (let i = 0; i < 144; i++) {
              const px = paint(gcss, `oklch(${band} 0.11 ${shipped[i]}deg)`, alpha);
              const r = ratio(px, gb);
              if (r < worst.r) worst = { r, i };
              if (r < 3) under3++;
            }
            ctl[label] = { worst: +worst.r.toFixed(3), worstIndex: worst.i, under3 };
          }
          out.grounds[gname] = rows;
          out.control[gname] = ctl;
        }
        // gamut: the chroma the engine painted, opaque on a mid grey (no ground blend)
        const painted = [];
        let clipped = 0;
        const seen = new Map<string, number[]>();
        let alike = 0;
        for (let i = 0; i < 144; i++) {
          const px = paint("#808080", `oklch(${band} ${chroma} ${hues[i]}deg)`, 1);
          const o = toOklch(px);
          painted.push({ i, C: +o.C.toFixed(4), h: +o.h.toFixed(2), rgb: px.join(",") });
          if (o.C < chroma - 0.004) clipped++;
          const key = px.join(",");
          if (seen.has(key)) alike++;
          seen.set(key, px);
        }
        const c16 = painted.slice(0, 16).map((p) => p.C);
        out.gamut = {
          clipped,
          distinct: seen.size,
          exactDuplicates: alike,
          meanC: +(painted.reduce((s, p) => s + p.C, 0) / 144).toFixed(4),
          minC: +Math.min(...painted.map((p) => p.C)).toFixed(4),
          minC16: +Math.min(...c16).toFixed(4),
          worstHueShift: +Math.max(
            ...painted.map((p, i) => {
              const d = Math.abs(p.h - hues[i]) % 360;
              return d > 180 ? 360 - d : d;
            }),
          ).toFixed(2),
          all: painted,
        };
        // and the control's gamut at 0.110 full circle
        let ctlClipped = 0;
        const ctlPainted = [];
        for (let i = 0; i < 144; i++) {
          const px = paint("#808080", `oklch(${band} 0.11 ${shipped[i]}deg)`, 1);
          const o = toOklch(px);
          ctlPainted.push({ i, C: +o.C.toFixed(4), h: +o.h.toFixed(2), rgb: px.join(",") });
          if (o.C < 0.11 - 0.004) ctlClipped++;
        }
        out.gamutControl = { clipped: ctlClipped, all: ctlPainted };
        return out;
      },
      { hues: WALK.hues, shipped: WALK.shipped, chroma: WALK.chroma },
    );

    say(`\n── ${info.project.name} · ${theme} · --peer-ink-l ${res.band} ──`);
    for (const [gname, rows] of Object.entries<any>(res.grounds)) {
      for (const [label, r] of Object.entries<any>(rows))
        say(
          `  ARC  ${gname.padEnd(10)} ${label.padEnd(8)} worst ${r.worst.toFixed(2)}:1 @i=${r.worstIndex}` +
            ` · under 3:1 ${r.under3}/144 · under 4.5:1 ${r.under45}/144`,
        );
      for (const [label, r] of Object.entries<any>(res.control[gname]))
        say(
          `  CTL  ${gname.padEnd(10)} ${label.padEnd(8)} worst ${r.worst.toFixed(2)}:1 @i=${r.worstIndex}` +
            ` · under 3:1 ${r.under3}/144`,
        );
    }
    say(
      `  GAMUT arc@0.166: engine gamut-mapped ${res.gamut.clipped}/144 · distinct painted ${res.gamut.distinct}/144` +
        ` · exact duplicates ${res.gamut.exactDuplicates} · mean painted C ${res.gamut.meanC}` +
        ` · min C ${res.gamut.minC} (first 16: ${res.gamut.minC16}) · worst hue shift ${res.gamut.worstHueShift}deg`,
    );
    say(`  GAMUT shipped@0.110: engine gamut-mapped ${res.gamutControl.clipped}/144`);
    fs.writeFileSync(
      `${OUT}/probe/bytes-${info.project.name}-${theme}.json`,
      JSON.stringify(res, null, 1),
    );
  }
  fs.writeFileSync(`${OUT}/probe/p1-${info.project.name}.txt`, log.join("\n"));
});

// ── P3 · the overlay on a live room ────────────────────────────────────────────────────────
test("P3 — solo byte-identical, the room bound to k[self], I2 under the overlay", async ({
  browser,
}, info) => {
  const out: string[] = [];
  const s = (x: string) => {
    out.push(x);
    console.log(x);
  };
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);

  // the SOLO fingerprint: every element carrying a --color-user-ink declaration, plus the
  // resolved value on the board and on the roster
  const fingerprint = (p: Page) =>
    p.evaluate(() => {
      const bound = [...document.querySelectorAll<HTMLElement>("[style]")]
        .filter((e) => e.getAttribute("style")!.includes("--color-user-ink"))
        .map((e) => `${e.tagName}.${e.className}|${e.getAttribute("style")}`);
      const cell = document.querySelector<HTMLElement>(".sudoku-cell");
      const glyph = document.querySelector<HTMLElement>(".sudoku-cell .glyph-svg path");
      return {
        boundCount: bound.length,
        bound: bound.slice(0, 8),
        rootInk: getComputedStyle(document.documentElement)
          .getPropertyValue("--color-user-ink")
          .trim(),
        cellInk: cell
          ? getComputedStyle(cell).getPropertyValue("--color-user-ink").trim()
          : "(none)",
        glyphStroke: glyph ? getComputedStyle(glyph).stroke : "(none)",
        leave: !!document.querySelector(".players-leave"),
      };
    });

  const before = await fingerprint(a);
  await a.addStyleTag({ content: overlayCss(WALK.hues[0]) });
  await a.waitForTimeout(150);
  const after = await fingerprint(a);
  s(`SOLO before: ${JSON.stringify(before)}`);
  s(`SOLO after : ${JSON.stringify(after)}`);
  s(
    `SOLO IDENTICAL: ${JSON.stringify(before) === JSON.stringify(after) ? "YES" : "NO"}`,
  );

  // now a room
  const link = await invite(a);
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await b.addStyleTag({ content: overlayCss(WALK.hues[1]) });
  await expect(roster(a)).toHaveCount(2);
  await expect(roster(b)).toHaveCount(2);
  await a.waitForTimeout(300);

  const rows = (p: Page) =>
    p.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>(".controls-card .players-roster .player-row")].map(
        (li) => ({
          slug: li.querySelector(".player-name")?.textContent?.trim() ?? "",
          self: !!li.querySelector(".player-self"),
          inline: li.getAttribute("style") ?? "",
          swatch: getComputedStyle(li.querySelector(".player-swatch")!).backgroundColor,
          name: getComputedStyle(li.querySelector(".player-name")!).color,
        }),
      ),
    );
  const ra = await rows(a);
  const rb = await rows(b);
  s(`A rows: ${JSON.stringify(ra)}`);
  s(`B rows: ${JSON.stringify(rb)}`);
  const aSelf = ra.find((r) => r.self)!;
  const aOnB = rb.find((r) => r.slug === aSelf.slug)!;
  s(`I2 · A's own swatch = ${aSelf.swatch} · what B paints for A = ${aOnB.swatch}`);
  s(`I2 · ${aSelf.swatch === aOnB.swatch ? "GREEN" : "RED"} under the overlay`);
  const bSelf = rb.find((r) => r.self)!;
  const bOnA = ra.find((r) => r.slug === bSelf.slug)!;
  s(`I2b · B's own swatch = ${bSelf.swatch} · what A paints for B = ${bOnA.swatch}`);
  s(`I2b · ${bSelf.swatch === bOnA.swatch ? "GREEN" : "RED"} under the overlay`);
  s(`ROOM · A's leave button present: ${await a.locator(".players-leave").count()}`);
  s(
    `ROOM · A's root --color-user-ink now: ${await a.evaluate(() => getComputedStyle(document.body).getPropertyValue("--color-user-ink").trim())}`,
  );

  // write a digit on each page so the board carries two hands, then read the glyph strokes
  const write = async (p: Page, idx: number, digit: string) => {
    const cells = p.locator(".sudoku-cell input:not([readonly]):not([disabled])");
    const n = await cells.count();
    if (n > idx) {
      await cells.nth(idx).click();
      await p.keyboard.type(digit);
      await p.waitForTimeout(250);
    }
  };
  await write(a, 0, "5");
  await write(b, 1, "7");
  await a.waitForTimeout(600);
  const strokes = await a.evaluate(() => {
    const seen: Record<string, number> = {};
    const notable: any[] = [];
    [...document.querySelectorAll<HTMLElement>(".sudoku-cell")].forEach((c, i) => {
      const path = c.querySelector<SVGPathElement>(".glyph-svg path");
      if (!path) return;
      const st = getComputedStyle(path).stroke;
      seen[st] = (seen[st] ?? 0) + 1;
      const inline = c.getAttribute("style") ?? "";
      const given = c.classList.contains("is-given") || !!c.querySelector("input[readonly]");
      if (!given || inline.includes("--color-user-ink"))
        notable.push({
          i,
          given,
          inline: inline.includes("--color-user-ink") ? inline : "",
          stroke: st,
          resolved: getComputedStyle(c).getPropertyValue("--color-user-ink").trim(),
        });
    });
    return { histogram: seen, notable: notable.slice(0, 12) };
  });
  s(`A board stroke histogram: ${JSON.stringify(strokes.histogram)}`);
  s(`A board non-given / peer-bound cells: ${JSON.stringify(strokes.notable)}`);

  // print + forced-colors arms
  await a.emulateMedia({ media: "print" });
  await a.waitForTimeout(150);
  s(
    `PRINT · glyph stroke: ${await a.evaluate(() => getComputedStyle(document.querySelector(".sudoku-cell .glyph-svg path")!).stroke)}`,
  );
  await a.emulateMedia({ media: "screen", forcedColors: "active" });
  await a.waitForTimeout(150);
  s(
    `FORCED-COLORS · glyph stroke: ${await a.evaluate(() => getComputedStyle(document.querySelector(".sudoku-cell .glyph-svg path")!).stroke)}`,
  );
  await a.emulateMedia({ media: "screen", forcedColors: "none" });

  fs.writeFileSync(`${OUT}/probe/p3-${info.project.name}.txt`, out.join("\n"));
  await ctx.close();
});
