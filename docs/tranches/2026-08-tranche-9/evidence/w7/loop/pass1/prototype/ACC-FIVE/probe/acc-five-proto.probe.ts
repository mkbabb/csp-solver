/**
 * acc-five-proto.probe.ts — the three rows the PROTOTYPE adds beside the research lane's 6-11.
 *
 * ── ROW 12 · THE GAUGE YIELDS TO PRINT AND TO FORCED COLOURS (born RED) ───────────
 * `.progress-trace` had neither arm at HEAD: a printed worksheet drew the gauge in whatever
 * the progress ink resolved to, and a forced-colours reader got a hue they had asked not to
 * receive. The row asserts #000 under print and the system ink under forced colours, and it
 * asserts them AT THE WIN too, because that is where the trace now takes a second colour.
 *
 * ── ROW 13 · THE DESTRUCTIVE VERB, AT NIGHT (born RED) ────────────────────────────
 * The research lane priced the confirm's face in light only. Dark collapses --color-red-ink
 * into the rose wax, and the ground is that same wax at 5%, so the number has to be taken
 * again rather than inferred.
 *
 * ── ROW 14 · NO STOCK HEX (born RED) ──────────────────────────────────────────────
 * A source scan, not a paint read: the four Tailwind literals the family retires must be
 * gone from index.css and HandwrittenGlyph.vue. This is the row that keeps the cure from
 * being re-spelled by hand somewhere the census cannot see.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { rgbToOklch, ratio } from "./oklch";

const OUT = process.env.ACC_FIVE_OUT ?? "/tmp";
mkdirSync(OUT, { recursive: true });
const SRC =
  process.env.ACC_FIVE_SRC ??
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-42/web/frontend/src";
const SOLO = "./?size=3&difficulty=EASY";

async function boot(page: Page) {
  await page.goto(SOLO);
  await page.waitForSelector(".sudoku-cell", { timeout: 25000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 25000 })
    .toBeGreaterThan(0);
}

/** fill every blank so the gauge exists to measure */
async function fillBoard(page: Page) {
  const n = await page.evaluate(
    () =>
      Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
        (i) => !(i as HTMLInputElement).readOnly && !(i as HTMLInputElement).value,
      ).length,
  );
  for (let k = 0; k < n + 4; k++) {
    const done = await page.evaluate(() => {
      const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
        (i) => !(i as HTMLInputElement).readOnly,
      ) as HTMLInputElement[];
      const e = ins.findIndex((i) => !i.value);
      if (e < 0) return true;
      ins[e].focus();
      return false;
    });
    if (done) break;
    await page.keyboard.type("1");
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(600);
}

const traceStroke = (page: Page) =>
  page.evaluate(() => {
    const t = document.querySelector(".progress-pose.is-active .progress-trace");
    const p = document.createElement("div");
    p.style.cssText = "position:fixed;left:-9999px;color:CanvasText";
    document.body.appendChild(p);
    const canvasText = getComputedStyle(p).color;
    p.remove();
    return {
      stroke: t ? getComputedStyle(t).stroke : null,
      canvasText,
      solved: !!document.querySelector(".solve-success"),
    };
  });

/* ── ROW 12 ───────────────────────────────────────────────────────────────────── */
test("ACC-FIVE row 12 — the fill trace yields to print and to forced colours", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);
  await fillBoard(page);

  await page.emulateMedia({ media: "print" });
  const printBefore = await traceStroke(page);
  await page.emulateMedia({ media: "screen", forcedColors: "active" });
  const forcedBefore = await traceStroke(page);
  await page.emulateMedia({ forcedColors: "none" });

  // and again AT THE WIN, where `.solve-success` gives the trace its second colour
  await page
    .locator('[aria-label="Solve puzzle"]')
    .first()
    .click({ timeout: 8000 })
    .catch(() => {});
  await page.waitForTimeout(1400);
  const screenWin = await traceStroke(page);
  await page.emulateMedia({ media: "print" });
  const printWin = await traceStroke(page);
  await page.emulateMedia({ media: "screen", forcedColors: "active" });
  const forcedWin = await traceStroke(page);
  await page.emulateMedia({ forcedColors: "none" });

  writeFileSync(
    join(OUT, `row12-trace-print-forced-${browserName}.json`),
    JSON.stringify(
      { printBefore, forcedBefore, screenWin, printWin, forcedWin },
      null,
      2,
    ),
  );
  expect(printBefore.stroke, "the printed gauge is true black").toBe("rgb(0, 0, 0)");
  expect(forcedBefore.stroke, "forced colours hand the gauge the system ink").toBe(
    forcedBefore.canvasText,
  );
  expect(screenWin.solved, "the win was reached").toBe(true);
  expect(printWin.stroke, "the printed gauge stays black AT THE WIN").toBe("rgb(0, 0, 0)");
  expect(forcedWin.stroke, "forced colours hold AT THE WIN").toBe(forcedWin.canvasText);
});

/* ── ROW 13 ───────────────────────────────────────────────────────────────────── */
test("ACC-FIVE row 13 — the destructive verb at night", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await boot(page);

  const cell = page.locator(".sudoku-cell input:not([readonly])").first();
  await cell.focus();
  await page.keyboard.type("5");
  await page.waitForTimeout(250);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(200);
  for (let attempt = 0; attempt < 3; attempt++) {
    if (await page.locator(".guard-leave .guard-face").count()) break;
    await page.keyboard.press("g").catch(() => {});
    await page
      .locator(".staging-btn.staging-deal")
      .first()
      .waitFor({ state: "visible", timeout: 6000 })
      .catch(() => {});
    await page.keyboard.press("d").catch(() => {});
    await page
      .locator(".guard-leave .guard-face")
      .waitFor({ state: "visible", timeout: 2500 })
      .catch(() => {});
    if (await page.locator(".guard-leave .guard-face").count()) break;
    await page
      .locator(".staging-btn.staging-deal")
      .first()
      .click({ timeout: 4000 })
      .catch(() => {});
    await page
      .locator(".guard-leave .guard-face")
      .waitFor({ state: "visible", timeout: 3000 })
      .catch(() => {});
  }
  await page.waitForTimeout(400);

  const guard = await page.evaluate(() => {
    const leave = document.querySelector<HTMLElement>(".guard-leave .guard-face");
    const keep = document.querySelector<HTMLElement>(".guard-keep .guard-face");
    const note = document.querySelector<HTMLElement>(".guard-note");
    if (!leave) return null;
    const cs = getComputedStyle(leave);
    return {
      leaveColor: cs.color,
      leaveBg: cs.backgroundColor,
      keepColor: keep ? getComputedStyle(keep).color : null,
      noteBg: note ? getComputedStyle(note).backgroundColor : null,
      text: leave.textContent?.trim() ?? "",
    };
  });

  let row: Record<string, unknown> = { scheme: "dark", reached: !!guard, guard };
  if (guard) {
    // PAINTED BYTES, not hex arithmetic: the 5% ground is a color-mix the engine gamut-maps
    // itself, so the ratio is taken through the same 1x1 canvas the research lane used.
    const painted = await page.evaluate(
      (j: { bg: string; fg: string; note: string }) => {
        const cv = document.createElement("canvas");
        cv.width = cv.height = 1;
        const ctx = cv.getContext("2d")!;
        const read = () => {
          const d = ctx.getImageData(0, 0, 1, 1).data;
          return [d[0], d[1], d[2]] as [number, number, number];
        };
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = j.note;
        ctx.fillRect(0, 0, 1, 1);
        ctx.fillStyle = j.bg;
        ctx.fillRect(0, 0, 1, 1);
        const ground = read();
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = j.note;
        ctx.fillRect(0, 0, 1, 1);
        ctx.fillStyle = j.fg;
        ctx.fillRect(0, 0, 1, 1);
        const ink = read();
        return { ground, ink };
      },
      {
        bg: guard.leaveBg,
        fg: guard.leaveColor,
        note: guard.noteBg ?? "rgb(0,0,0)",
      },
    );
    const o = rgbToOklch(painted.ink[0], painted.ink[1], painted.ink[2]);
    const asRgb = (c: [number, number, number]) => ({ r: c[0], g: c[1], b: c[2] });
    row = {
      ...row,
      painted,
      inkOklch: { L: +o.L.toFixed(4), C: +o.C.toFixed(4), h: +o.h.toFixed(1) },
      ratioOnOwnGround: +ratio(asRgb(painted.ink), asRgb(painted.ground)).toFixed(2),
      chromatic: o.C >= 0.02,
    };
  }
  writeFileSync(
    join(OUT, `row13-guard-dark-${browserName}.json`),
    JSON.stringify(row, null, 2),
  );
  expect(guard, `the guard ribbon was not reached in ${browserName} (dark)`).not.toBeNull();
  expect(row.chromatic, "the dark verb carries the danger ink").toBe(true);
  expect(
    row.ratioOnOwnGround as number,
    "the dark destructive verb at AA on its own ground",
  ).toBeGreaterThanOrEqual(4.5);
});

/* ── ROW 14 ───────────────────────────────────────────────────────────────────── */
test("ACC-FIVE row 14 — no stock hex survives in the token estate", async () => {
  const files = {
    "assets/index.css": readFileSync(join(SRC, "assets/index.css"), "utf8"),
    "pencil/glyph/HandwrittenGlyph.vue": readFileSync(
      join(SRC, "pencil/glyph/HandwrittenGlyph.vue"),
      "utf8",
    ),
  };
  const banned = [/#2563eb/i, /#60a5fa/i, /#8b5cf6/i, /rgba\(\s*196\s*,\s*181\s*,\s*253/i];
  const hits: string[] = [];
  for (const [name, text] of Object.entries(files))
    for (const re of banned) {
      const m = text.match(new RegExp(re.source, "gi"));
      if (m) hits.push(`${name}: ${re.source} x${m.length}`);
    }
  // the dark progress alias to #7c3aed must no longer be the progress token's value
  const css = files["assets/index.css"];
  const progressDark = /--color-progress-ink:\s*(#[0-9a-f]{6})/gi;
  const values = [...css.matchAll(progressDark)].map((m) => m[1].toLowerCase());
  writeFileSync(join(OUT, "row14-stock-hex.json"), JSON.stringify({ hits, values }, null, 2));
  expect(hits, "no stock Tailwind hex may survive in index.css or the glyph").toEqual([]);
  expect(values, "both progress arms are the new gold ink tier").toEqual([
    "#a47903",
    "#7d6902",
  ]);
});
