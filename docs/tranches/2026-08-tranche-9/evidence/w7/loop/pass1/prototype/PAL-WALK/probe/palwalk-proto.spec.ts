/**
 * PAL-WALK · PASS-1 PROTOTYPE PROBE — the engine's own bytes, read off the PATCHED product.
 *
 * Nothing here overlays CSS. Every ink string comes from the real `playerIdentity.inkFor` the
 * dev server is serving out of the worktree, so what is measured is what the module paints.
 *
 *   P1  hue exact + chroma + AA + the ring, 144 indices x 4 grounds, both themes
 *   P2  the two-var FALLBACK arm priced on the same bytes (per-band ceilings, not shipped)
 *   P3  solo fingerprint, and the room: k[self] bound, I2 read off the roster
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "fs";

const OUT =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk/readings";
const SOLO = "./?size=3&difficulty=EASY&wire=local";

// ── the per-band ceilings, computed HERE so the fallback arm can be priced without shipping it
const inGamut = (l: number, c: number, h: number): boolean => {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const x = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const y = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const z = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * x - 3.3077115913 * y + 0.2309699292 * z,
    -1.2684380046 * x + 2.6097574011 * y - 0.3413193965 * z,
    -0.0041960863 * x - 0.7034186147 * y + 1.707614701 * z,
  ].every((v) => v >= -1e-4 && v <= 1.0001);
};
const ceilAt = (h: number, band: number): number => {
  if (inGamut(band, 0.166, h)) return 0.166;
  let lo = 0;
  let hi = 0.166;
  for (let k = 0; k < 20; k++) {
    const mid = (lo + hi) / 2;
    if (inGamut(band, mid, h)) lo = mid;
    else hi = mid;
  }
  return lo;
};

const log: string[] = [];
const say = (s: string): void => {
  log.push(s);
  console.log(s);
};

async function settled(page: Page): Promise<void> {
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

test("P1/P2 — the module's own 144 inks, four grounds, both themes", async ({ page }, info) => {
  await page.goto(SOLO);
  await settled(page);

  // THE STRINGS ARE THE PRODUCT'S. No overlay, no table: the page imports the same module the
  // board does and asks it for 144 inks.
  const inks: string[] = await page.evaluate(async () => {
    const m = (await import("/src/games/shared/playerIdentity.ts")) as {
      inkFor: (i: number) => Record<string, string>;
    };
    return Array.from({ length: 144 }, (_, i) => m.inkFor(i)["--color-user-ink"]);
  });
  const req = inks.map((s) => {
    const m = /oklch\(var\(--peer-ink-l\)\s+([\d.]+)\s+([\d.]+)deg\)/.exec(s)!;
    return { C: Number(m[1]), h: Number(m[2]) };
  });
  say(`\n════ ${info.project.name} ════`);
  say(`  requested: ${inks[0]} … ${inks[143]}`);
  say(
    `  requested chroma over 144: mean ${(req.reduce((s, r) => s + r.C, 0) / 144).toFixed(4)}` +
      ` · min ${Math.min(...req.map((r) => r.C)).toFixed(4)}` +
      ` · at the wax ${req.filter((r) => r.C >= 0.166).length}/144`,
  );

  for (const theme of ["light", "dark"] as const) {
    const band = theme === "light" ? 0.5 : 0.8;
    const fallback = req.map((r) => ceilAt(r.h, band));
    await page.evaluate((t) => {
      document.documentElement.classList.toggle("dark", t === "dark");
    }, theme);
    const res = await page.evaluate(
      ({ inks, hues, fallback }) => {
        const cs = getComputedStyle(document.documentElement);
        const bandVar = cs.getPropertyValue("--peer-ink-l").trim();
        const grounds: Record<string, string> = {
          background: cs.getPropertyValue("--color-background").trim(),
          card: cs.getPropertyValue("--color-card").trim(),
        };
        const c = document.createElement("canvas");
        c.width = c.height = 1;
        const g = c.getContext("2d", { willReadFrequently: true })!;
        const paint = (ground: string, css: string, alpha: number): number[] => {
          g.globalAlpha = 1;
          g.globalCompositeOperation = "copy";
          g.fillStyle = ground;
          g.fillRect(0, 0, 1, 1);
          g.globalCompositeOperation = "source-over";
          g.globalAlpha = alpha;
          g.fillStyle = css;
          g.fillRect(0, 0, 1, 1);
          const d = g.getImageData(0, 0, 1, 1).data;
          return [d[0], d[1], d[2]];
        };
        const lin = (v: number): number => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
        const lum = ([r, gg, b]: number[]): number =>
          0.2126 * lin(r / 255) + 0.7152 * lin(gg / 255) + 0.0722 * lin(b / 255);
        const ratio = (a: number[], b: number[]): number => {
          const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
          return (x + 0.05) / (y + 0.05);
        };
        const toOklch = ([R, G, B]: number[]): { L: number; C: number; h: number } => {
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
        // the ink strings, resolved: `var(--peer-ink-l)` is not legal inside a canvas fillStyle
        const resolved = inks.map((s) => s.replace("var(--peer-ink-l)", bandVar));
        const fb = hues.map((h, i) => `oklch(${bandVar} ${fallback[i].toFixed(4)} ${h}deg)`);

        const painted = resolved.map((css, i) => {
          const px = paint("#808080", css, 1);
          const o = toOklch(px);
          return { i, C: +o.C.toFixed(4), h: +o.h.toFixed(2), rgb: px.join(",") };
        });
        const paintedFb = fb.map((css) => {
          const o = toOklch(paint("#808080", css, 1));
          return { C: +o.C.toFixed(4), h: +o.h.toFixed(2) };
        });

        const out: Record<string, unknown> = { band: bandVar, grounds, painted, paintedFb };
        const rows: Record<string, unknown> = {};
        for (const [gname, gcss] of Object.entries(grounds)) {
          const gb = paint(gcss, "rgba(0,0,0,0)", 0);
          for (const [label, alpha] of [
            ["opaque", 1],
            ["ring080", 0.8],
            ["ring055", 0.55],
            ["trace095", 0.95],
          ] as [string, number][]) {
            let worst = { r: 99, i: -1 };
            const bottom: { r: number; i: number }[] = [];
            let under3 = 0;
            let under45 = 0;
            for (let i = 0; i < 144; i++) {
              const r = ratio(paint(gcss, resolved[i], alpha), gb);
              bottom.push({ r: +r.toFixed(3), i });
              if (r < worst.r) worst = { r, i };
              if (r < 3) under3++;
              if (r < 4.5) under45++;
            }
            bottom.sort((p, q) => p.r - q.r);
            rows[`${gname}|${label}`] = {
              worst: +worst.r.toFixed(3),
              worstIndex: worst.i,
              under3,
              under45,
              bottom4: bottom.slice(0, 4),
            };
          }
          // the fallback arm, opaque only (its whole claim is chroma, not pressure)
          let fbWorst = { r: 99, i: -1 };
          for (let i = 0; i < 144; i++) {
            const r = ratio(paint(gcss, fb[i], 1), gb);
            if (r < fbWorst.r) fbWorst = { r, i };
          }
          rows[`${gname}|fallback`] = { worst: +fbWorst.r.toFixed(3), worstIndex: fbWorst.i };
        }
        out.rows = rows;
        return out;
      },
      { inks, hues: req.map((r) => r.h), fallback },
    );

    const painted = res.painted as { i: number; C: number; h: number; rgb: string }[];
    const paintedFb = res.paintedFb as { C: number; h: number }[];
    const gap = (a: number, b: number): number => {
      const d = Math.abs(a - b) % 360;
      return d > 180 ? 360 - d : d;
    };
    const shifts = painted.map((p, i) => gap(p.h, req[i].h));
    const worstShift = Math.max(...shifts);
    const meanC = painted.reduce((s, p) => s + p.C, 0) / 144;
    const meanFb = paintedFb.reduce((s, p) => s + p.C, 0) / 144;
    const dup = new Set(painted.map((p) => p.rgb)).size;

    say(`\n── ${info.project.name} · ${theme} · --peer-ink-l ${res.band as string} ──`);
    say(
      `  HUE EXACT: max |painted − requested| ${worstShift.toFixed(3)}° (i=${shifts.indexOf(worstShift)})` +
        ` · mean ${(shifts.reduce((a, b) => a + b, 0) / 144).toFixed(3)}°`,
    );
    say(
      `  CHROMA painted: mean ${meanC.toFixed(4)} · min ${Math.min(...painted.map((p) => p.C)).toFixed(4)}` +
        ` · distinct bytes ${dup}/144`,
    );
    say(
      `  FALLBACK (per-band ceiling, NOT shipped): painted mean ${meanFb.toFixed(4)}` +
        ` · max hue shift ${Math.max(...paintedFb.map((p, i) => gap(p.h, req[i].h))).toFixed(3)}°`,
    );
    for (const [key, r] of Object.entries(res.rows as Record<string, any>))
      say(
        `  ${key.padEnd(20)} worst ${String(r.worst).padStart(6)}:1 @i=${r.worstIndex}` +
          (r.under3 === undefined
            ? ""
            : ` · under 3:1 ${r.under3}/144 · under 4.5:1 ${r.under45}/144` +
              ` · four worst ${r.bottom4.map((b: any) => `${b.r}@${b.i}`).join(" ")}`),
      );
    fs.writeFileSync(
      `${OUT}/bytes-${info.project.name}-${theme}.json`,
      JSON.stringify({ requested: req, ...res }, null, 1),
    );
  }
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
  fs.writeFileSync(`${OUT}/p1-${info.project.name}.txt`, log.join("\n"));
});

test("P3 — solo byte-identical, the room binds k[self], I2 both directions", async ({
  browser,
}, info) => {
  const out: string[] = [];
  const s = (x: string): void => {
    out.push(x);
    console.log(x);
  };
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);

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
        cellInk: cell ? getComputedStyle(cell).getPropertyValue("--color-user-ink").trim() : "(none)",
        glyphStroke: glyph ? getComputedStyle(glyph).stroke : "(none)",
        leave: !!document.querySelector(".players-leave"),
      };
    });

  const HEAD_R0 = {
    boundCount: 0,
    bound: [],
    rootInk: "#2563eb",
    cellInk: "#2563eb",
    glyphStroke: "rgb(10, 10, 10)",
    leave: false,
  };
  const soloBefore = await fingerprint(a);
  s(`SOLO (untouched board): ${JSON.stringify(soloBefore)}`);
  s(
    `SOLO vs HEAD r0 fingerprint: ${JSON.stringify(soloBefore) === JSON.stringify(HEAD_R0) ? "IDENTICAL" : "DIFFERS"}`,
  );

  // and again after this page WRITES solo — a cell this page authored is exactly where a self
  // binding would land if the room condition were wrong. (The first cell's glyph is a given,
  // so `glyphStroke` reads graphite before the write and the incumbent blue after it: that is
  // HEAD's own behaviour, and `boundCount` is the claim.)
  const write = async (p: Page, idx: number, digit: string): Promise<void> => {
    const cells = p.locator(".sudoku-cell input:not([readonly]):not([disabled])");
    if ((await cells.count()) > idx) {
      await cells.nth(idx).click();
      await p.keyboard.type(digit);
      await p.waitForTimeout(250);
    }
  };
  await write(a, 0, "5");
  const solo = await fingerprint(a);
  s(`SOLO (after writing a digit): ${JSON.stringify(solo)}`);
  s(`SOLO bound elements after writing: ${solo.boundCount}`);

  const link = await invite(a);
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(roster(a)).toHaveCount(2);
  await expect(roster(b)).toHaveCount(2);
  await a.waitForTimeout(400);

  const rows = (p: Page) =>
    p.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>(".controls-card .players-roster .player-row")].map(
        (li) => ({
          slug: li.querySelector(".player-name")?.textContent?.trim() ?? "",
          self: !!li.querySelector(".player-self"),
          inline: li.getAttribute("style") ?? "",
          swatch: getComputedStyle(li.querySelector(".player-swatch")!).backgroundColor,
        }),
      ),
    );
  const ra = await rows(a);
  const rb = await rows(b);
  s(`A rows: ${JSON.stringify(ra)}`);
  s(`B rows: ${JSON.stringify(rb)}`);
  const aSelf = ra.find((r) => r.self)!;
  const aOnB = rb.find((r) => r.slug === aSelf.slug)!;
  const bSelf = rb.find((r) => r.self)!;
  const bOnA = ra.find((r) => r.slug === bSelf.slug)!;
  s(`I2  A self ${aSelf.swatch} vs B paints ${aOnB.swatch} → ${aSelf.swatch === aOnB.swatch ? "GREEN" : "RED"}`);
  s(`I2b B self ${bSelf.swatch} vs A paints ${bOnA.swatch} → ${bSelf.swatch === bOnA.swatch ? "GREEN" : "RED"}`);

  // TWO HANDS ON ONE BOARD — and A writes again INSIDE the room, so its own digit is the one
  // that proves k[self] reaches the board rather than only the roster.
  await write(b, 1, "7");
  await write(a, 2, "3");
  await a.waitForTimeout(700);
  const board = await a.evaluate(() => {
    const hist: Record<string, number> = {};
    const notable: unknown[] = [];
    [...document.querySelectorAll<HTMLElement>(".sudoku-cell")].forEach((c, i) => {
      const path = c.querySelector<SVGPathElement>(".glyph-svg path");
      if (!path) return;
      const st = getComputedStyle(path).stroke;
      hist[st] = (hist[st] ?? 0) + 1;
      const inline = c.getAttribute("style") ?? "";
      if (inline.includes("--color-user-ink"))
        notable.push({ i, inline, stroke: st });
    });
    return { hist, notable };
  });
  s(`A board stroke histogram: ${JSON.stringify(board.hist)}`);
  s(`A board bound cells: ${JSON.stringify(board.notable)}`);

  await a.emulateMedia({ media: "print" });
  await a.waitForTimeout(150);
  s(
    `PRINT glyph stroke: ${await a.evaluate(() => getComputedStyle(document.querySelector(".sudoku-cell .glyph-svg path")!).stroke)}`,
  );
  await a.emulateMedia({ media: "screen", forcedColors: "active" });
  await a.waitForTimeout(150);
  s(
    `FORCED-COLORS glyph stroke: ${await a.evaluate(() => getComputedStyle(document.querySelector(".sudoku-cell .glyph-svg path")!).stroke)}`,
  );
  await a.emulateMedia({ media: "screen", forcedColors: "none" });

  fs.writeFileSync(`${OUT}/p3-${info.project.name}.txt`, out.join("\n"));
  await ctx.close();
});
