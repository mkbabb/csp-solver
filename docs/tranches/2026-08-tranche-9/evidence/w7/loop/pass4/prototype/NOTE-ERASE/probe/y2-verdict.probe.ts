/**
 * NOTE-ERASE pass 4 · Y2 — G12'S PAINTED WITNESS. VERDICTS NEVER SETTLE, READ OFF THE PAINT.
 *
 * Pass 3 asserted the rule from `AGES = ["record","state"]` and carried pass 2's settled figures
 * for the quiet rung. What was never witnessed is the claim the rule exists FOR: a grade at the
 * quiet rung is 3.03:1 (teacher-red) and 2.70:1 (gold), so a verdict that settled would be a
 * grade you cannot read. This run solves a real 4×4, waits the settle plus one beat, and reads
 * the verdict's own paint — off the VIGNETTE's node on the gold path (R1 quiets the strip there,
 * so `is-quiet` is asserted rather than assumed) and off the strip's own ink on the refusal.
 *
 * The negative control in the same run: a RECORD-kind line, which does age, read at the same
 * clock. If the two read alike the rule is doing nothing.
 */
import { test, expect, type Page } from "@playwright/test";
import { bank, say, boardReady, refuseAGiven, armHint, ratio } from "./lib";
import sharp from "sharp";

const BEATS_PLUS_ONE = 8 * 125 + 125;

/** Solve the board through the estate's own act — the control panel's Solve puzzle button. */
async function solveIt(page: Page) {
  const btn = page.locator('[aria-label="Solve puzzle"]');
  await btn.first().waitFor({ state: "attached", timeout: 20000 });
  await btn.first().click({ force: true });
  await page.waitForTimeout(2500);
}

/** Painted AA of a node's own darkest ink over its own modal backdrop. */
async function paintedOf(page: Page, selector: string) {
  const box = await page.evaluate((sel) => {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return null;
    return {
      clip: {
        x: Math.max(0, Math.floor(r.left) - 2),
        y: Math.max(0, Math.floor(r.top) - 2),
        width: Math.ceil(r.width) + 4,
        height: Math.ceil(r.height) + 4,
      },
      color: getComputedStyle(el).color,
      text: (el.textContent || "").replace(/\s+/g, " ").trim(),
    };
  }, selector);
  if (!box) return null;
  const buf = await page.screenshot({ clip: box.clip, animations: "disabled" });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const counts = new Map<string, number>();
  const lum = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const px: { L: number; c: number[] }[] = [];
  for (let i = 0; i < data.length; i += ch) {
    const c = [data[i], data[i + 1], data[i + 2]];
    counts.set(c.join(","), (counts.get(c.join(",")) ?? 0) + 1);
    px.push({ L: lum(c[0], c[1], c[2]), c });
  }
  let modal = "255,255,255";
  let best = 0;
  for (const [k, v] of counts) if (v > best) ((best = v), (modal = k));
  const paper = modal.split(",").map(Number);
  const paperL = lum(paper[0], paper[1], paper[2]);
  px.sort((a, b) => Math.abs(b.L - paperL) - Math.abs(a.L - paperL));
  const core = px[0].c;
  const p005 = px[Math.min(px.length - 1, Math.floor(px.length * 0.005))].c;
  // THE MATCHED READ. The vignette is painted OVER the board, so the darkest pixel in its box is
  // often the grid's own ink and the extreme over-reports the verdict's contrast. The gate reads
  // the pixel nearest the node's COMPUTED colour instead, and reports how far it had to go — a
  // large distance means the glyph never painted at that colour and the row is not trustworthy.
  const want = (() => {
    const m = box.color.match(/rgba?\(([^)]+)\)/);
    if (m) return m[1].split(/[,\s/]+/).filter(Boolean).slice(0, 3).map(Number);
    const s = box.color.match(
      /color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?/,
    );
    if (!s) return null;
    const a = s[4] === undefined ? 1 : Number(s[4]);
    return [1, 2, 3].map((k, i) => a * Number(s[k]) * 255 + (1 - a) * paper[i]);
  })();
  const dist = (c: number[]) =>
    want ? Math.hypot(c[0] - want[0], c[1] - want[1], c[2] - want[2]) : Infinity;
  const matched = want ? px.slice().sort((a, b) => dist(a.c) - dist(b.c))[0].c : null;
  return {
    computedColor: box.color,
    text: box.text,
    paper: `rgb(${paper.join(", ")})`,
    inkCorePx: `rgb(${core.join(", ")})`,
    matchedPx: matched ? `rgb(${matched.map(Math.round).join(", ")})` : null,
    matchedDistance: matched ? Math.round(dist(matched) * 10) / 10 : null,
    matchedRatio: matched ? ratio(matched, paper) : null,
    extremeRatio: ratio(core, paper),
    p005Ratio: ratio(p005, paper),
    coverageP:
      Math.round(
        (px.filter((p) => Math.abs(p.L - paperL) > 12).length / px.length) * 1000,
      ) / 10,
  };
}

const ageOf = (page: Page) =>
  page.evaluate(() => ({
    isQuiet: !!document.querySelector(".margin-note-block.is-quiet"),
    age:
      document.querySelector(".margin-note-ink")?.getAttribute("data-note-age") ??
      null,
    inkColor: document.querySelector(".margin-note-ink")
      ? getComputedStyle(document.querySelector(".margin-note-ink")!).color
      : null,
    text: (document.querySelector(".margin-note")?.textContent || "")
      .replace(/\s+/g, " ")
      .trim(),
    vignetteActive:
      getComputedStyle(
        document.querySelector(".completion-vignette") ?? document.body,
      ).display !== "none" && !!document.querySelector(".completion-vignette"),
    vignetteColor: document.querySelector(".vignette-voice")
      ? getComputedStyle(document.querySelector(".vignette-voice")!).color
      : null,
  }));

test.describe("Y2 — G12's painted witness", () => {
  test("a GOLD verdict is still gold a settle plus a beat after it lands", async ({
    page,
  }, info) => {
    await boardReady(page, "?size=2&difficulty=EASY");
    await solveIt(page);
    const atLanding = await ageOf(page);
    await page.waitForTimeout(BEATS_PLUS_ONE);
    const atSettlePlusOne = await ageOf(page);
    const vignettePaint = await paintedOf(page, ".vignette-voice");
    const stripPaint = atSettlePlusOne.isQuiet
      ? null
      : await paintedOf(page, ".margin-note-ink");

    const row = {
      engine: info.project.name,
      board: "4x4 (?size=2), solved through the control panel's own act",
      clockMs: BEATS_PLUS_ONE,
      atLanding,
      atSettlePlusOne,
      vignettePaint,
      stripPaint,
    };
    bank(`y2-gold-${info.project.name}.json`, row);
    say("y2-gold", row);

    expect(atSettlePlusOne.text).toContain("solved it!");
    // R1: the gold path quiets the STRIP and the vignette carries the paint, so the painted read
    // has to happen on the vignette. Asserted, not assumed — this is the `is-quiet` row.
    expect(atSettlePlusOne.isQuiet, "R1 quiets the strip on the gold path").toBe(true);
    // THE RULE: a verdict never reaches the settled rung, at any distance from its arrival.
    expect(atSettlePlusOne.age).not.toBe("settled");
    expect(atSettlePlusOne.inkColor).toBe(atLanding.inkColor);
    expect(vignettePaint, "the vignette painted something").toBeTruthy();
    // The gold itself, not whatever board ink the vignette floats over.
    expect(vignettePaint!.matchedDistance!).toBeLessThanOrEqual(24);
    expect(vignettePaint!.matchedRatio!).toBeGreaterThanOrEqual(4.5);
  });

  test("a TEACHER-RED refusal is still red a settle plus a beat later, and a RECORD is not", async ({
    page,
  }, info) => {
    await boardReady(page);
    await refuseAGiven(page, "5");
    await page.waitForTimeout(400);
    const redAtLanding = await ageOf(page);
    await page.waitForTimeout(BEATS_PLUS_ONE);
    const redAtSettlePlusOne = await ageOf(page);
    const redPaint = await paintedOf(page, ".margin-note-ink");

    // THE CONTROL, same page, same clock: the hint's line is kind `state`, which DOES age.
    const page2 = await page.context().newPage();
    await page2.goto(page.url());
    await page2.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
    await page2.waitForTimeout(1200);
    await armHint(page2);
    const stateAtLanding = await ageOf(page2);
    await page2.waitForTimeout(BEATS_PLUS_ONE);
    const stateAtSettlePlusOne = await ageOf(page2);
    const statePaint = await paintedOf(page2, ".margin-note-ink");
    await page2.close();

    const row = {
      engine: info.project.name,
      clockMs: BEATS_PLUS_ONE,
      verdict: { redAtLanding, redAtSettlePlusOne, redPaint },
      controlStateKind: { stateAtLanding, stateAtSettlePlusOne, statePaint },
    };
    bank(`y2-red-${info.project.name}.json`, row);
    say("y2-red", row);

    expect(redAtSettlePlusOne.age).not.toBe("settled");
    expect(redAtSettlePlusOne.inkColor).toBe(redAtLanding.inkColor);
    expect(redPaint!.extremeRatio).toBeGreaterThanOrEqual(4.5);
    // The control proves the clock ran: the kind that DOES age reached the quiet rung on the
    // same wait, and its ink changed.
    expect(stateAtSettlePlusOne.age).toBe("settled");
    expect(stateAtSettlePlusOne.inkColor).not.toBe(stateAtLanding.inkColor);
    expect(statePaint!.extremeRatio).toBeGreaterThanOrEqual(4.5);
  });
});
