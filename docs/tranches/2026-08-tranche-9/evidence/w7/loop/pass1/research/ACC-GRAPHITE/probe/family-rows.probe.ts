/**
 * family-rows.probe.ts — ACC-GRAPHITE pass 1, the rows the arm census does not carry.
 *
 *   1. THE KINSHIP ROWS UNDER THE ARM — r0's `accent-kinship.probe.ts` rows 1, 2 and 4 are RED
 *      at HEAD on `--color-user-ink` and `--color-progress-ink` and on the sparkle's inline
 *      literal. Re-asserted here with the family's overlay injected, so the record says which
 *      RED the family actually turns. (Row 3, the control focus ring, is NOT this family's:
 *      it is the same two-line change either way, and the vacuity guard stands.)
 *   2. THE ROOM — what a SOLO board binds and what a room binds, read off a live two-page
 *      `?wire=local` session. The family's whole claim about authorship rests on this.
 *   3. THE GUARD — the destructive confirm, measured under the arm: the verb told apart by
 *      weight and words alone, at the AA text floor.
 *   4. PRINT and FORCED COLORS — the two arms the family must leave standing, proven by
 *      emulation rather than by reading the stylesheet.
 *
 * READ-ONLY on the product. Writes JSON under this lane's evidence dir only.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { rgbToOklch, hueDist, parseCss, ratio } from "./oklch";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-GRAPHITE/readings";
mkdirSync(OUT, { recursive: true });

const PROTO =
  process.env.ACC_PROTO ||
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-GRAPHITE/proto";
const ARM_FILE = `${PROTO}/G3-whole-family.css`;
const KIN_DEG = 5;
const ANCHORS = [
  "--color-crayon-green",
  "--color-crayon-orange",
  "--color-crayon-rose",
  "--color-crayon-blue",
  "--color-crayon-gold",
];
const SOLO = "./?size=3&difficulty=EASY";

async function boot(page: Page, url = SOLO) {
  await page.goto(url);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 30000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(800);
}

async function arm(page: Page) {
  await page.addStyleTag({ content: readFileSync(ARM_FILE, "utf8") });
  await page.waitForTimeout(300);
}

async function resolve(page: Page, names: string[]) {
  return page.evaluate((ns: string[]) => {
    const probe = document.createElement("div");
    probe.style.position = "fixed";
    probe.style.left = "-9999px";
    document.body.appendChild(probe);
    const out: Record<string, string> = {};
    for (const n of ns) {
      probe.style.setProperty("color", `var(${n})`);
      out[n] = getComputedStyle(probe).color;
    }
    probe.remove();
    return out;
  }, names);
}

// ── 1. kinship rows 1/2/4 under the arm ────────────────────────────────────────
for (const scheme of ["light", "dark"] as const) {
  test(`kinship under the arm (${scheme}) — rows 1/2 turn, and here is what is left`, async ({
    page,
    browserName,
  }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);
    const names = [
      ...ANCHORS,
      "--color-user-ink",
      "--color-focus-sketch",
      "--color-progress-ink",
      "--color-pencil-graphite",
      "--color-crayon-blue",
    ];
    const before = await resolve(page, names);
    await arm(page);
    const after = await resolve(page, names);

    const anchorsO = ANCHORS.map((a) => {
      const p = parseCss(after[a])!;
      return { name: a.replace("--color-", ""), ...rgbToOklch(p.r, p.g, p.b) };
    });
    const row = (tokenValue: string) => {
      const p = parseCss(tokenValue)!;
      const o = rgbToOklch(p.r, p.g, p.b);
      let best = "";
      let bd = 999;
      for (const an of anchorsO) {
        const d = hueDist(o.h, an.h);
        if (d < bd) {
          bd = d;
          best = an.name;
        }
      }
      return {
        rgb: tokenValue,
        h: +o.h.toFixed(1),
        C: +o.C.toFixed(4),
        nearest: best,
        hueDist: +bd.toFixed(1),
        achromatic: o.C < 0.012,
        kinOrAchromatic: o.C < 0.012 || bd <= KIN_DEG,
      };
    };

    // The PAINTED marks, not just the token: under the arm the ring's ink is set on the rule,
    // not on the token, so the token alone would lie.
    const painted = await page.evaluate(() => {
      const cell = document.querySelector<HTMLInputElement>(".sudoku-cell input:not([readonly])");
      cell?.focus();
      const host = document.querySelector(".game-cell:has(input:focus-visible)");
      const ghost = host?.querySelector<SVGPathElement>(".cell-ghost-path");
      const trace = document.querySelector<SVGPathElement>(".progress-trace");
      const wash = document.querySelector(".cell-peer");
      const sparkle = document.querySelector(".sparkle-icon");
      return {
        ringStroke: ghost ? getComputedStyle(ghost).stroke : null,
        ringWidth: ghost ? getComputedStyle(ghost).strokeWidth : null,
        traceStroke: trace ? getComputedStyle(trace).stroke : null,
        washBg: wash ? getComputedStyle(wash).backgroundColor : null,
        sparkleFilter: sparkle ? getComputedStyle(sparkle).filter : null,
      };
    });

    const rec = {
      engine: browserName,
      scheme,
      KIN_DEG,
      before: Object.fromEntries(
        ["--color-user-ink", "--color-focus-sketch", "--color-progress-ink"].map((k) => [
          k,
          row(before[k]),
        ]),
      ),
      after: Object.fromEntries(
        [
          "--color-user-ink",
          "--color-focus-sketch",
          "--color-progress-ink",
          "--color-crayon-blue",
        ].map((k) => [k, row(after[k])]),
      ),
      painted,
      sparkleLiteralGone: painted.sparkleFilter
        ? !/rgba?\(\s*196/.test(painted.sparkleFilter)
        : null,
    };
    writeFileSync(join(OUT, `kin-arm-${scheme}-${browserName}.json`), JSON.stringify(rec, null, 2));
    console.log("KIN " + scheme + " " + browserName + " " + JSON.stringify(rec, null, 2));
  });
}

// ── 2. the room ────────────────────────────────────────────────────────────────
test("the room — what a solo board binds, and what a room binds", async ({
  browser,
  browserName,
}) => {
  const ctx = await browser.newContext({ colorScheme: "light", reducedMotion: "reduce" });
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");

  const solo = await a.evaluate(() => {
    const cells = Array.from(document.querySelectorAll<HTMLElement>(".game-cell"));
    return {
      cellsWithInkBinding: cells.filter((c) => c.style.getPropertyValue("--color-user-ink")).length,
      rosterRows: document.querySelectorAll(".controls-card .players-roster .player-row").length,
      hostInk:
        document.querySelector<HTMLElement>(".board-host, #app")?.style.getPropertyValue(
          "--color-user-ink",
        ) ?? "",
    };
  });

  await a
    .locator('.controls-card button[aria-label="Play together on this board"]')
    .click({ timeout: 15000 });
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const b = await ctx.newPage();
  await b.emulateMedia({ reducedMotion: "reduce" });
  await b.goto(link);
  await b.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2, {
    timeout: 30000,
  });
  await a.waitForTimeout(800);

  const room = await a.evaluate(() => {
    const rows = Array.from(
      document.querySelectorAll<HTMLElement>(".controls-card .players-roster .player-row"),
    );
    const cells = Array.from(document.querySelectorAll<HTMLElement>(".game-cell"));
    return {
      rosterRows: rows.map((r) => ({
        inlineInk: r.style.getPropertyValue("--color-user-ink"),
        text: (r.querySelector(".player-name")?.textContent ?? "").trim(),
        swatch: r.querySelector(".player-swatch")
          ? getComputedStyle(r.querySelector(".player-swatch")!).backgroundColor
          : null,
        isSelf: /you/i.test(r.textContent ?? ""),
      })),
      cellsWithInkBinding: cells.filter((c) => c.style.getPropertyValue("--color-user-ink")).length,
    };
  });

  // and after the peer writes: whose cells carry a binding
  const bCell = b.locator(".sudoku-cell input:not([readonly])").first();
  await bCell.focus();
  await b.keyboard.type("5");
  await a.waitForTimeout(1600);
  const afterWrite = await a.evaluate(() => {
    const cells = Array.from(document.querySelectorAll<HTMLElement>(".game-cell"));
    const bound = cells
      .map((c, i) => ({ i, ink: c.style.getPropertyValue("--color-user-ink") }))
      .filter((x) => x.ink);
    const mine = cells
      .map((c) => c.querySelector("input")?.getAttribute("aria-label") ?? "")
      .filter((l) => /your entry/i.test(l)).length;
    return { bound, myEntryCells: mine };
  });

  const rec = { engine: browserName, solo, room, afterWrite };
  writeFileSync(join(OUT, `room-${browserName}.json`), JSON.stringify(rec, null, 2));
  console.log("ROOM " + JSON.stringify(rec, null, 2));
  await ctx.close();
});

// ── 3. the guard, under the arm ────────────────────────────────────────────────
test("the guard — the destructive verb, by weight and words", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);
  await arm(page);
  const cell = page.locator(".sudoku-cell input:not([readonly])").first();
  await cell.focus();
  await page.keyboard.type("1");
  await page.waitForTimeout(400);
  const gallery = page.locator('[aria-label*="gallery" i], .wordmark-picker').first();
  if (await gallery.count()) {
    await gallery.click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(900);
    await page.keyboard.press("d").catch(() => {});
    await page.waitForTimeout(900);
  }
  const guard = await page.evaluate(() => {
    const f = document.querySelector(".guard-note-frame");
    if (!f) return null;
    const cs = getComputedStyle(f);
    const faces = Array.from(document.querySelectorAll<HTMLElement>(".guard-btn, .guard-face"));
    return {
      frameBg: cs.backgroundColor,
      frameBorderTop: cs.borderTopColor,
      text: (f.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 160),
      faces: faces.map((b) => {
        const c = getComputedStyle(b);
        return {
          cls: b.className,
          text: (b.textContent ?? "").trim(),
          color: c.color,
          background: c.backgroundColor,
          fontWeight: c.fontWeight,
          fontSize: c.fontSize,
          outline: `${c.outlineWidth} ${c.outlineStyle} ${c.outlineColor}`,
        };
      }),
    };
  });
  writeFileSync(join(OUT, `guard-${browserName}.json`), JSON.stringify(guard, null, 2));
  console.log("GUARD " + JSON.stringify(guard, null, 2));
});

// ── 4. print and forced colors, under the arm ──────────────────────────────────
test("print and forced colors survive the arm", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);
  await page.keyboard.press("Tab");
  const cell = page.locator(".sudoku-cell input:not([readonly])").first();
  await cell.focus();
  await page.keyboard.type("1");
  await page.waitForTimeout(500);
  await arm(page);

  const read = async () =>
    page.evaluate(() => {
      const glyphs = Array.from(document.querySelectorAll<SVGPathElement>(".glyph-svg path"));
      const line = document.querySelector<SVGPathElement>(".grid-line");
      const ghost = document.querySelector<SVGPathElement>(".cell-ghost-path");
      const trace = document.querySelector<SVGPathElement>(".progress-trace");
      const cellEl = document.querySelector(".game-cell:has(input:focus-visible)");
      return {
        glyphStrokes: Array.from(new Set(glyphs.map((g) => getComputedStyle(g).stroke))).slice(0, 6),
        gridLine: line ? getComputedStyle(line).stroke : null,
        ghostStroke: ghost ? getComputedStyle(ghost).stroke : null,
        traceStroke: trace ? getComputedStyle(trace).stroke : null,
        cellOutline: cellEl
          ? `${getComputedStyle(cellEl).outlineWidth} ${getComputedStyle(cellEl).outlineStyle} ${getComputedStyle(cellEl).outlineColor}`
          : null,
      };
    });

  const screen = await read();
  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(300);
  const print = await read();
  await page.emulateMedia({ media: "screen", forcedColors: "active" });
  await page.waitForTimeout(300);
  const forced = await read();
  await page.emulateMedia({ forcedColors: "none" });

  const rec = { engine: browserName, screen, print, forced };
  writeFileSync(join(OUT, `modes-${browserName}.json`), JSON.stringify(rec, null, 2));
  console.log("MODES " + JSON.stringify(rec, null, 2));
});
