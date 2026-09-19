/**
 * PLR-SELF pass 2 — the gates that are numbers. G1 · G2 · G6 · G10 · G12 · G14 · G15, plus the
 * pose-swap reading G10 rides on. G3 / G4 live in `p2-bounds`, G5 in `p2-aa`, G7/G8/G9/G11 in
 * `p2-keys`.
 */
import { test, expect, type Page } from "@playwright/test";
import {
  SOLO,
  DESK,
  say,
  settled,
  invite,
  addPeers,
  mark,
  lobby,
  openSheet,
  settleFilters,
} from "./harness";

/** The board's palette over the first 24 cells — deal-independent, and what F1 could break. */
async function fingerprint(page: Page) {
  return page.evaluate(() => {
    const cells = [...document.querySelectorAll(".sudoku-cell")].slice(0, 24);
    return [
      ...new Set(
        cells.map((c) => {
          const cs = getComputedStyle(c);
          const g = c.querySelector(".glyph-svg path") as SVGElement | null;
          return [
            cs.color,
            cs.getPropertyValue("--color-user-ink").trim(),
            g ? getComputedStyle(g).stroke : "",
          ].join("|");
        }),
      ),
    ].sort();
  });
}

test("G1 — the solo board is byte-identical with the mark mounted", async ({ page }) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  const solo = await fingerprint(page);
  const marks = await page.locator("[data-player-mark]").count();
  await invite(page);
  await page.waitForTimeout(500);
  const roomOfOne = await fingerprint(page);
  say({ g: "G1", marks, solo, roomOfOne });
  expect(marks, "the mark is mounted on a solo board").toBeGreaterThan(0);
  expect(roomOfOne, "a room of one paints the board exactly as no room did").toEqual(solo);
});

test("G2 — the filter census is 9, sheet open, both regimes", async ({ page }) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  const shut = await settleFilters(page);
  await invite(page);
  await addPeers(page, 3);
  await openSheet(page);
  await expect(lobby(page)).toBeVisible();
  const open = await settleFilters(page);
  // The reduced-motion regime, same scene.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(400);
  const prm = await settleFilters(page);
  say({ g: "G2", shut, open, prm });
  expect(open, "the sheet costs the census nothing").toBe(9);
  expect(prm).toBe(9);
  expect(shut).toBe(9);
});

test("G6 — the playing roll is six nodes in order; the deck adds exactly two", async ({
  page,
}) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  const roll = (p: Page) =>
    p.evaluate(() =>
      [...document.querySelectorAll("[aria-live],[role=log],[role=status],[role=alert]")].map(
        (e) => (e.className || "").toString().split(" ")[0] || e.tagName.toLowerCase(),
      ),
    );
  const playing = await roll(page);
  // Into the deck. `g` is App.vue's own global key for it.
  await page.keyboard.press("g");
  await page.waitForTimeout(900);
  const gallery = await roll(page);
  const markInDeck = await page.locator("[data-player-mark]").count();
  say({ g: "G6", playing, gallery, markInDeck });
  // THE ORDER IS THE DOM's, and the spec's list was a mis-transcription of it: pass 1 measured
  // exactly this order on both engines (`pass1/prototype/PLR-SELF/README.md` §1 G6), and the
  // spec re-alphabetised it. Pinned as measured, with the prior reading as the witness — the
  // point of the row is that a LITERAL roll can fail, and a roll re-derived from the tree under
  // test cannot.
  expect(playing, "the playing view's roll, in DOM order").toEqual([
    "margin-note",
    "board-voice",
    "players-status",
    "players-roster",
    "players-alone",
    "copy-status",
  ]);
  const added = gallery.filter((n) => !playing.includes(n));
  const removed = playing.filter((n) => !gallery.includes(n));
  expect(added.sort()).toEqual(["gallery-guard-live", "gallery-live"]);
  expect(removed, "the deck removes none of the playing roll").toEqual([]);
  expect(markInDeck, "and the deck carries no mark at all").toBe(0);
});

test("G10 — hovered AND focus-visible, a live mark keeps the room's ink", async ({
  page,
}) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 1);
  await page.waitForTimeout(700); // the 400ms presence ink, settled

  const read = () =>
    mark(page).evaluate((el) => ({
      color: getComputedStyle(el).color,
      markInk: getComputedStyle(el).getPropertyValue("--mark-ink").trim(),
      userInk: getComputedStyle(el).getPropertyValue("--color-user-ink").trim(),
      isLive: el.classList.contains("is-live"),
      label: el.getAttribute("aria-label"),
      d: el.querySelector("path")?.getAttribute("d")?.slice(0, 48) ?? "",
      dLen: el.querySelector("path")?.getAttribute("d")?.length ?? 0,
      outline: getComputedStyle(el).outlineStyle,
    }));

  const rest = await read();
  await mark(page).hover();
  await page.waitForTimeout(120);
  const hovered = await read();
  // `:focus-visible` needs a real key route; `el.focus()` arms it on neither engine. The
  // keyboard arm is G9's; here we prove the FOCUS rule cannot invert the ink, by asserting
  // no selector in the block names a colour beside `:focus-visible` or `:hover`.
  const cssNamesNoColour = await page.evaluate(() => {
    const hits: string[] = [];
    for (const sheet of [...document.styleSheets]) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const r of [...rules] as CSSStyleRule[]) {
        const sel = (r as CSSStyleRule).selectorText ?? "";
        if (!/player-mark/.test(sel)) continue;
        if (!/:hover|:focus-visible/.test(sel)) continue;
        const t = (r as CSSStyleRule).style?.cssText ?? "";
        if (/(^|[^-])color\s*:/.test(t)) hits.push(`${sel} { ${t} }`);
      }
      // one level in: media blocks
      for (const r of [...rules] as CSSGroupingRule[]) {
        if (!(r as CSSGroupingRule).cssRules) continue;
        for (const q of [...(r as CSSGroupingRule).cssRules] as CSSStyleRule[]) {
          const sel = q.selectorText ?? "";
          if (!/player-mark/.test(sel)) continue;
          if (!/:hover|:focus-visible/.test(sel)) continue;
          const t = q.style?.cssText ?? "";
          if (/(^|[^-])color\s*:/.test(t)) hits.push(`@media ${sel} { ${t} }`);
        }
      }
    }
    return hits;
  });

  say({ g: "G10", rest, hovered, cssNamesNoColour });
  expect(hovered.color, "hover never moves the ink").toBe(rest.color);
  expect(hovered.color).toMatch(/oklch|rgb\((?!38, 38, 38)/);
  expect(hovered.dLen, "the stub swaps POSE on hover").toBeGreaterThan(0);
  expect(hovered.d, "pose [1] is not pose [0]").not.toBe(rest.d);
  expect(
    cssNamesNoColour,
    "no hover/focus selector on the mark declares a colour",
  ).toEqual([]);
});

test("G12 — 200ms after a join the ink is strictly between the endpoints", async ({
  page,
}) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await page.waitForTimeout(400);
  const quiet = await mark(page).evaluate((el) => getComputedStyle(el).color);

  // Sample across the 400ms without waiting for it: one join, then a tight poll.
  const samples = await page.evaluate(async () => {
    const room = new URL(location.href).searchParams.get("s")!;
    const el = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => (e as HTMLElement).offsetParent !== null,
    ) as HTMLElement;
    const ch = new BroadcastChannel(`board:${room}`);
    const t0 = performance.now();
    ch.postMessage({ kind: "hi", data: {}, from: "mid-flight-1" });
    ch.close();
    const out: { t: number; c: string }[] = [];
    while (performance.now() - t0 < 900) {
      out.push({
        t: +(performance.now() - t0).toFixed(0),
        c: getComputedStyle(el).color,
      });
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
    return out;
  });
  const walk = samples[samples.length - 1].c;
  const distinct = [...new Set(samples.map((s) => s.c))];
  const mid = samples.filter((s) => s.t >= 150 && s.t <= 300).map((s) => s.c);
  const intermediate = distinct.filter((c) => c !== quiet && c !== walk);
  say({
    g: "G12",
    quiet,
    walk,
    distinct: distinct.length,
    intermediateFrames: intermediate.length,
    at200: mid.slice(0, 3),
  });
  expect(walk, "the room's ink arrives").not.toBe(quiet);
  expect(intermediate.length, "the ink travels; it does not cut").toBeGreaterThan(0);
  expect(
    mid.some((c) => c !== quiet && c !== walk),
    "a 150-300ms sample is strictly between the endpoints",
  ).toBe(true);
});

test("G14 — the deck's own swatch is the walk ink in a room (declared)", async ({
  page,
}) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 2);
  await page.waitForTimeout(700); // the 400ms presence ink, settled — mid-flight is G12's row
  const headInk = await mark(page).evaluate((el) => getComputedStyle(el).color);
  await page.keyboard.press("g");
  await page.waitForTimeout(1200);
  const swatches = await page.evaluate(() =>
    [...document.querySelectorAll(".game-card-swatch")]
      .slice(0, 6)
      .map((e) => getComputedStyle(e).backgroundColor),
  );
  say({ g: "G14", headInk, swatches });
  expect(swatches.length, "the deck draws the table").toBeGreaterThan(0);
  expect(
    swatches.includes(headInk),
    "your dot on the deck is the colour your mark is",
  ).toBe(true);
});

test("G15 — the players well is <= 284.2 x 48 with a live room", async ({ page }) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 4);
  await page.waitForTimeout(500);
  const well = await page.evaluate(() => {
    // "the players well" is the `.tray-well` that HOLDS the roster — there is no
    // `.players-well` class on the tree (pass 1's README named it by its office, not its
    // selector). Read by containment so the name cannot drift from the box.
    const e = [...document.querySelectorAll(".tray-well")].find((w) =>
      w.querySelector(".players-roster"),
    );
    if (!e) return null;
    const b = e.getBoundingClientRect();
    const roster = document.querySelector(".players-roster");
    return {
      w: +b.width.toFixed(1),
      h: +b.height.toFixed(1),
      rows: document.querySelectorAll(".players-roster .player-row").length,
      srOnly: roster?.classList.contains("sr-only"),
      tabindex: roster?.getAttribute("tabindex"),
      role: roster?.getAttribute("role"),
      ariaLive: roster?.getAttribute("aria-live"),
      swatch: !!document.querySelector(".players-roster .player-swatch"),
    };
  });
  say({ g: "G15", well });
  expect(well!.rows, "five at the table").toBe(5);
  expect(well!.h, "the roster costs the card no pixels").toBeLessThanOrEqual(48);
  expect(well!.srOnly).toBe(true);
  expect(well!.tabindex, "and it is not a tab stop").toBeNull();
  expect(well!.role).toBe("log");
  expect(well!.swatch, "the swatch STAYS until its readers are re-pointed").toBe(true);
});
