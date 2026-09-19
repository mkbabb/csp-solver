/**
 * acc-six.surfaces.probe.ts — ACC-SIX pass 1, the surfaces this family touches, measured
 * on PAINTED BYTES rather than on hex arithmetic.
 *
 *   A. THE FOUR RATIOS — the fill trace against the two grounds it crosses in each theme,
 *      and the board focus ring against the card, read out of a real screenshot: the trace
 *      core pixel, the un-traced graphite frame pixel, the card pixel. Hex arithmetic is
 *      reported beside them as a cross-check, never as the claim.
 *   B. THE PIXEL CENSUS — R2's census re-run under the arm: rest / focused / mid-board,
 *      both themes, off-family share before and after.
 *   C. THE METER — the overhang, per side, in CSS px, against the board box; the stripe's
 *      rendered width; what shows at 0%; and the scratch COUNT TAPE, injected and measured.
 *   D. PRINT + FORCED COLOURS — the two arms index.css:894-952 ships, proven by emulation
 *      to be unmoved by the overlay.
 *   E. THE GUARD — the destructive face in --color-red-ink, measured on its own ground.
 *
 *   ACC_SIX_ARM=HEAD|a|b npx playwright test --config .../acc-six.config.ts -g "§ACC-SIX"
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { rgbToOklch, parseCss, ratio } from "./oklch";
import { overlayFor, TAPE_CSS, TAPE_TEXT, type Arm } from "../proto/overlay";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-SIX/census";
const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-SIX/frames";
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });

const ARM = (process.env.ACC_SIX_ARM ?? "HEAD") as Arm;
const CHROMA_FLOOR = 0.012; // R2's floor, unchanged
const WARM = [40, 115]; // R2's declared house warm band, unchanged
const SOLO = "./?size=3&difficulty=EASY";

async function boot(page: Page, extraCss = "") {
  const css = (overlayFor(ARM) ?? "") + extraCss;
  if (css) {
    await page.addInitScript((c: string) => {
      const add = () => {
        const s = document.createElement("style");
        s.id = "acc-six-overlay";
        s.textContent = c;
        document.head.appendChild(s);
      };
      if (document.head) add();
      else document.addEventListener("DOMContentLoaded", add);
    }, css);
  }
  await page.goto(SOLO);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 30000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(900);
}

async function tokens(page: Page, names: string[]) {
  return page.evaluate((ns: string[]) => {
    const p = document.createElement("div");
    p.style.position = "fixed";
    p.style.left = "-9999px";
    document.body.appendChild(p);
    const out: Record<string, string> = {};
    for (const n of ns) {
      p.style.setProperty("color", `var(${n})`);
      out[n] = getComputedStyle(p).color;
    }
    p.remove();
    return out;
  }, names);
}

/** Write 12 digits so the trace has arc drawn AND arc still bare — both grounds present
 *  in ONE screenshot, which is what makes the ratio a painted-byte reading. */
async function fillPartly(page: Page, n = 12) {
  const cell = page.locator(".sudoku-cell input:not([readonly])").first();
  await cell.focus();
  for (let i = 0; i < n; i++) {
    await page.keyboard.type("1");
    await page.keyboard.press("ArrowRight");
  }
  await page.waitForTimeout(800);
}

interface Px { r: number; g: number; b: number }

async function rawOf(page: Page, clip?: { x: number; y: number; width: number; height: number }) {
  const buf = await page.screenshot({ clip });
  const img = sharp(buf).raw().ensureAlpha();
  const { data, info } = await img.toBuffer({ resolveWithObject: true });
  return { data, info };
}

test.describe(`§ACC-SIX [${ARM}]`, () => {
  for (const scheme of ["light", "dark"] as const) {
    test(`A+B — painted-byte ratios and the pixel census (${scheme})`, async ({ page, browserName }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await boot(page);

      const t = await tokens(page, [
        "--color-card", "--color-background", "--grid-line-color",
        "--color-progress-ink", "--color-focus-sketch", "--color-user-ink",
        "--color-solver-ink-2", "--color-red-ink",
      ]);

      // ── the census ────────────────────────────────────────────────────────
      // R2's band (warm 40–115°) is kept VERBATIM as the first reading, and a second
      // reading is added beside it, because R2's own band cannot see this family's cure:
      // the warm arc EXCLUDES two of its own five anchors (crayon-green 147.0°,
      // crayon-blue 251.4°), so a blue that becomes perfectly kin to crayon-blue is still
      // "off-family" by that band. ANCHOR-KIN share asks the question the law asks — is
      // this pixel near an ANCHOR — at a stated arc, over the arm's own anchor set.
      const ANCHOR_ARC = 15; // stated, not tuned: the paint arc a hue-locked ink spans once
      //                        antialiasing and 0.95 stroke-opacity blend it toward its ground
      const anchorHues = await page.evaluate((names: string[]) => {
        const p = document.createElement("div");
        p.style.position = "fixed"; p.style.left = "-9999px";
        document.body.appendChild(p);
        const out: Record<string, string> = {};
        for (const n of names) { p.style.setProperty("color", `var(${n})`); out[n] = getComputedStyle(p).color; }
        p.remove();
        return out;
      }, [
        "--color-crayon-green", "--color-crayon-orange", "--color-crayon-rose",
        "--color-crayon-blue", "--color-crayon-gold",
        ...(ARM === "a" ? ["--color-crayon-violet"] : ARM === "b" ? ["--color-answer-deep"] : []),
      ]);
      const anchors = Object.entries(anchorHues)
        .map(([k, v]) => { const p = parseCss(v); return p ? { name: k, h: rgbToOklch(p.r, p.g, p.b).h } : null; })
        .filter(Boolean) as { name: string; h: number }[];
      const circ = (a: number, b: number) => { const d = Math.abs(((a - b) % 360) + 360) % 360; return d > 180 ? 360 - d : d; };

      const census = async (label: string) => {
        const { data, info } = await rawOf(page);
        const bins = new Array(36).fill(0);
        let chromatic = 0, warm = 0, kin = 0, violet = 0, blue = 0;
        const total = info.width * info.height;
        for (let i = 0; i < data.length; i += info.channels) {
          const o = rgbToOklch(data[i], data[i + 1], data[i + 2]);
          if (o.C < CHROMA_FLOOR) continue;
          chromatic++;
          bins[Math.floor(o.h / 10) % 36]++;
          if (o.h >= WARM[0] && o.h <= WARM[1]) warm++;
          if (anchors.some((a) => circ(o.h, a.h) <= ANCHOR_ARC)) kin++;
          if (o.h >= 285 && o.h <= 305) violet++;
          if (o.h >= 245 && o.h <= 270) blue++;
        }
        const c = Math.max(1, chromatic);
        return {
          label, width: info.width, height: info.height, total,
          chromatic, chromaticShare: +(chromatic / total).toFixed(5),
          warmShare: +(warm / c).toFixed(4),
          offFamilyShare: +(1 - warm / c).toFixed(4),
          anchorKinShare: +(kin / c).toFixed(4),
          offAnchorShare: +(1 - kin / c).toFixed(4),
          violetBinShare: +(violet / c).toFixed(4),
          blueBinShare: +(blue / c).toFixed(4),
          bins10deg: bins,
        };
      };
      const rest = await census("rest");

      // ── focused ───────────────────────────────────────────────────────────
      const empty = page.locator(".sudoku-cell input:not([readonly])").first();
      await empty.focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(450);
      const focused = await census("cell-focused");

      // the RING, on painted bytes: the focused cell's box, expanded.
      const cellBox = await page.evaluate(() => {
        const el = document.querySelector(".game-cell:has(input:focus-visible)") as HTMLElement | null;
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      });
      let ringPainted: { core: Px | null; ground: Px | null; ratio: number | null } = { core: null, ground: null, ratio: null };
      if (cellBox) {
        const pad = 6;
        const { data, info } = await rawOf(page, {
          x: Math.max(0, Math.floor(cellBox.x - pad)), y: Math.max(0, Math.floor(cellBox.y - pad)),
          width: Math.ceil(cellBox.width + pad * 2), height: Math.ceil(cellBox.height + pad * 2),
        });
        let core: Px | null = null, bestC = 0;
        const achroma: Px[] = [];
        for (let i = 0; i < data.length; i += info.channels) {
          const px = { r: data[i], g: data[i + 1], b: data[i + 2] };
          const o = rgbToOklch(px.r, px.g, px.b);
          if (o.h > 225 && o.h < 285 && o.C > bestC) { bestC = o.C; core = px; }
          if (o.C < 0.02) achroma.push(px);
        }
        // the ground the ring is drawn on = the cell's paper: the modal achromatic pixel
        const ground = achroma.length
          ? achroma.sort((a, b) => (scheme === "light" ? b.r - a.r : a.r - b.r))[Math.floor(achroma.length * 0.1)]
          : null;
        ringPainted = { core, ground, ratio: core && ground ? +ratio(core, ground).toFixed(2) : null };
      }

      // ── mid-board ─────────────────────────────────────────────────────────
      // THE CONFOUND, NAMED AND KILLED. A 12-keystroke walk reaches a different number of
      // writable cells on every deal (the deal is generated per load and this tree exposes
      // no seed), so `mid` was not comparable across arms — HEAD dark reached progress 10
      // where arm b reached 20 on the first pass of this probe, and the census moved with
      // the fill rather than with the arm. `mid` is now FULL BOARD: every writable cell
      // written, progress 100 by construction, identical arc in every run.
      await fillPartly(page, 12);
      const midPartial = await census("mid-board-12-keystrokes");
      const filled = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll<HTMLInputElement>(".sudoku-cell input"))
          .filter((i) => !i.readOnly);
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
        let n = 0;
        for (const i of inputs) { if (!i.value) { setter.call(i, "1"); i.dispatchEvent(new Event("input", { bubbles: true })); n++; } }
        return { writable: inputs.length, wrote: n };
      });
      await page.waitForTimeout(900);
      const mid = await census("full-board");

      const progressNow = await page.evaluate(() => {
        const el = document.querySelector('[role="progressbar"]');
        return el ? +(el.getAttribute("aria-valuenow") ?? "0") : null;
      });

      // ── A. the trace, on painted bytes ────────────────────────────────────
      const boardBox = await page.evaluate(() => {
        const el = document.querySelector("svg.hand-drawn-grid") as SVGElement | null;
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      });
      let tracePainted: Record<string, unknown> = { found: false };
      if (boardBox) {
        const pad = 14;
        const clip = {
          x: Math.max(0, Math.floor(boardBox.x - pad)), y: Math.max(0, Math.floor(boardBox.y - pad)),
          width: Math.ceil(boardBox.width + pad * 2), height: Math.ceil(boardBox.height + pad * 2),
        };
        const { data, info } = await rawOf(page, clip);
        let core: Px | null = null, bestC = 0;
        const frameCands: { px: Px; L: number }[] = [];
        const cardCands: { px: Px; L: number }[] = [];
        for (let y = 0; y < info.height; y++) {
          for (let x = 0; x < info.width; x++) {
            const i = (y * info.width + x) * info.channels;
            const px = { r: data[i], g: data[i + 1], b: data[i + 2] };
            const o = rgbToOklch(px.r, px.g, px.b);
            // the trace core: the most chromatic pixel in the violet arc
            if (o.h > 270 && o.h < 320 && o.C > bestC) { bestC = o.C; core = px; }
            // the graphite frame: achromatic, within 16px of the board box edge
            const nearEdge = x < 22 || y < 22 || x > info.width - 22 || y > info.height - 22;
            if (o.C < 0.03 && nearEdge) frameCands.push({ px, L: o.L });
            // the card: achromatic, well inside
            if (o.C < 0.03 && !nearEdge && x > 60 && y > 60 && x < info.width - 60 && y < info.height - 60)
              cardCands.push({ px, L: o.L });
          }
        }
        // the frame LINE's core is the extreme of the near-edge achromatic population
        frameCands.sort((a, b) => a.L - b.L);
        const frame = scheme === "light" ? frameCands[Math.floor(frameCands.length * 0.002)] : frameCands[Math.floor(frameCands.length * 0.998)];
        cardCands.sort((a, b) => a.L - b.L);
        const card = cardCands[Math.floor(cardCands.length * (scheme === "light" ? 0.9 : 0.1))];
        tracePainted = {
          found: !!core,
          core, coreOklch: core ? (() => { const o = rgbToOklch(core!.r, core!.g, core!.b); return { L: +o.L.toFixed(4), C: +o.C.toFixed(4), h: +o.h.toFixed(1) }; })() : null,
          frameLine: frame?.px ?? null, cardGround: card?.px ?? null,
          ratioTraceOverFrame: core && frame ? +ratio(core, frame.px).toFixed(2) : null,
          ratioTraceOverCard: core && card ? +ratio(core, card.px).toFixed(2) : null,
        };
      }

      // hex-arithmetic cross-check on the SAME tokens (never the claim; the witness)
      const pI = parseCss(t["--color-progress-ink"])!;
      const gL = parseCss(t["--grid-line-color"])!;
      const cD = parseCss(t["--color-card"])!;
      const blend = (a: Px, al: number, g: Px) => ({ r: a.r * al + g.r * (1 - al), g: a.g * al + g.g * (1 - al), b: a.b * al + g.b * (1 - al) });
      const arithmetic = {
        "trace @0.95 over grid-line": +ratio(blend(pI, 0.95, gL), gL).toFixed(2),
        "trace @0.95 over card": +ratio(blend(pI, 0.95, cD), cD).toFixed(2),
        "trace opaque over grid-line": +ratio(pI, gL).toFixed(2),
        "trace opaque over card": +ratio(pI, cD).toFixed(2),
        "focus ring @0.9 over card": (() => { const f = parseCss(t["--color-focus-sketch"])!; return +ratio(blend(f, 0.9, cD), cD).toFixed(2); })(),
        "focus ring opaque over card": (() => { const f = parseCss(t["--color-focus-sketch"])!; return +ratio(f, cD).toFixed(2); })(),
        "user-ink as text over card": (() => { const u = parseCss(t["--color-user-ink"])!; return +ratio(u, cD).toFixed(2); })(),
        "user-ink as text over background": (() => { const u = parseCss(t["--color-user-ink"])!; const b = parseCss(t["--color-background"])!; return +ratio(u, b).toFixed(2); })(),
      };

      writeFileSync(
        join(OUT, `surfaces-${ARM}-${browserName}-${scheme}.json`),
        JSON.stringify({ arm: ARM, engine: browserName, scheme, tokens: t, progressNow, census: { rest, focused, midPartial, mid }, fillControl: filled, ringPainted, tracePainted, arithmetic }, null, 2),
      );

      expect(rest.chromatic, "the census must have a subject").toBeGreaterThan(1000);
    });
  }

  test("C — the meter's geometry, and the count tape priced", async ({ page, browserName }) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await boot(page, TAPE_CSS);

    const atZero = await page.evaluate(() => ({
      traceNodes: document.querySelectorAll(".progress-trace").length,
      valuenow: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow") ?? null,
      valuetext: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuetext") ?? null,
      label: document.querySelector('[role="progressbar"]')?.getAttribute("aria-label") ?? null,
    }));

    await fillPartly(page, 3);

    const geom = await page.evaluate(() => {
      const svg = document.querySelector("svg.hand-drawn-grid") as SVGGraphicsElement | null;
      if (!svg) return null;
      const box = svg.getBoundingClientRect();
      const paths = Array.from(document.querySelectorAll<SVGPathElement>(".progress-trace"));
      // the ACTIVE pose is the one whose group carries .is-active
      const active = paths.find((p) => (p.parentElement as HTMLElement)?.classList.contains("is-active")) ?? paths[0];
      if (!active) return { box, trace: null };
      const tb = active.getBoundingClientRect();
      const cs = getComputedStyle(active);
      const scale = box.width / 1000;
      return {
        box: { x: box.x, y: box.y, w: box.width, h: box.height },
        trace: { x: tb.x, y: tb.y, w: tb.width, h: tb.height },
        strokeWidth: cs.strokeWidth, strokeOpacity: cs.strokeOpacity, stroke: cs.stroke,
        scale,
        strokeCssPx: parseFloat(cs.strokeWidth) * scale,
        overhang: { top: +(box.y - tb.y).toFixed(2), left: +(box.x - tb.x).toFixed(2),
          right: +(tb.x + tb.width - (box.x + box.width)).toFixed(2),
          bottom: +(tb.y + tb.height - (box.y + box.height)).toFixed(2) },
        valuenow: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow") ?? null,
      };
    });

    // ── the COUNT TAPE, injected at the frame's head and measured ──────────
    const tape = await page.evaluate((text: string) => {
      const svg = document.querySelector("svg.hand-drawn-grid") as SVGGraphicsElement | null;
      if (!svg) return null;
      const host = svg.parentElement as HTMLElement;
      const cs = getComputedStyle(host);
      if (cs.position === "static") host.style.position = "relative";
      const n = document.createElement("span");
      n.className = "acc-six-tape";
      n.textContent = text;
      host.appendChild(n);
      const box = svg.getBoundingClientRect();
      const hb = host.getBoundingClientRect();
      // at the frame's HEAD: the top-left of the drawn frame, sitting on the paper above it
      n.style.left = `${box.x - hb.x + 12}px`;
      n.style.top = `${box.y - hb.y - 22}px`;
      const r = n.getBoundingClientRect();
      const ncs = getComputedStyle(n);
      return { text, w: +r.width.toFixed(2), h: +r.height.toFixed(2), font: ncs.fontFamily, size: ncs.fontSize, color: ncs.color,
        clearsBoard: r.bottom <= box.y + 1, boardTop: box.y, tapeBottom: r.bottom };
    }, TAPE_TEXT(3, 20));

    // The FILL-FORCED button's own word, so the tape's string can be checked for collision.
    const fillWord = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll(".icon-sublabel, .ctrl-btn, button"));
      return els.map((e) => (e.textContent ?? "").trim()).filter((s) => /fill/i.test(s)).slice(0, 6);
    });

    writeFileSync(
      join(OUT, `meter-${ARM}-${browserName}.json`),
      JSON.stringify({ arm: ARM, atZero, geom, tape, fillWord }, null, 2),
    );
    expect(geom, "the meter must be on the page").not.toBeNull();
  });

  test("C2 — the meter and the tape on the phone (393×699 dpr3)", async ({ page, browserName }) => {
    await page.setViewportSize({ width: 393, height: 699 });
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await boot(page, TAPE_CSS);
    await fillPartly(page, 3);
    const out = await page.evaluate((text: string) => {
      const svg = document.querySelector("svg.hand-drawn-grid") as SVGGraphicsElement | null;
      if (!svg) return null;
      const box = svg.getBoundingClientRect();
      const active = Array.from(document.querySelectorAll<SVGPathElement>(".progress-trace"))
        .find((p) => (p.parentElement as HTMLElement)?.classList.contains("is-active"));
      const scale = box.width / 1000;
      const host = svg.parentElement as HTMLElement;
      if (getComputedStyle(host).position === "static") host.style.position = "relative";
      const n = document.createElement("span");
      n.className = "acc-six-tape";
      n.textContent = text;
      host.appendChild(n);
      const r = n.getBoundingClientRect();
      return {
        boardW: +box.width.toFixed(2), scale: +scale.toFixed(4),
        strokeCssPx: active ? +(parseFloat(getComputedStyle(active).strokeWidth) * scale).toFixed(3) : null,
        tape: { w: +r.width.toFixed(2), h: +r.height.toFixed(2), size: getComputedStyle(n).fontSize },
        tapeShareOfBoard: +(r.width / box.width).toFixed(3),
        valuenow: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow") ?? null,
      };
    }, TAPE_TEXT(3, 20));
    writeFileSync(join(OUT, `meter-phone-${ARM}-${browserName}.json`), JSON.stringify({ arm: ARM, out }, null, 2));
    expect(out, "the phone board must be on the page").not.toBeNull();
  });

  test("D — print and forced-colors arms unmoved", async ({ page, browserName }) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await boot(page);
    await fillPartly(page, 3);

    const read = async () =>
      page.evaluate(() => {
        const glyph = document.querySelector(".sudoku-cell .glyph-svg path");
        const line = document.querySelector(".grid-line");
        const trace = document.querySelector(".progress-trace");
        const probe = document.createElement("div");
        probe.style.position = "fixed"; probe.style.left = "-9999px";
        document.body.appendChild(probe);
        probe.style.setProperty("color", "var(--color-user-ink)");
        const ui = getComputedStyle(probe).color;
        probe.style.setProperty("color", "var(--grid-line-color)");
        const gl = getComputedStyle(probe).color;
        probe.remove();
        return {
          glyphStroke: glyph ? getComputedStyle(glyph).stroke : null,
          gridLineStroke: line ? getComputedStyle(line).stroke : null,
          traceStroke: trace ? getComputedStyle(trace).stroke : null,
          userInkToken: ui, gridLineToken: gl,
        };
      });

    const screen = await read();
    await page.emulateMedia({ media: "print" });
    await page.waitForTimeout(250);
    const print = await read();
    await page.emulateMedia({ media: "screen", forcedColors: "active" });
    await page.waitForTimeout(250);
    const forced = await read();
    await page.emulateMedia({ forcedColors: "none" });

    writeFileSync(join(OUT, `print-forced-${ARM}-${browserName}.json`), JSON.stringify({ arm: ARM, screen, print, forced }, null, 2));
    expect(print.glyphStroke, "print must ink the glyph true black whatever user-ink is").toBe("rgb(0, 0, 0)");
  });

  test("E — the confirm's destructive face", async ({ page, browserName }) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await boot(page);
    // R2's own arming path (accent-states.probe.ts:236-241): a dirty board written through
    // the estate's value-setter recipe, then the deck, then the deal intent.
    const blank = await page.evaluate(() => {
      const cells = document.querySelectorAll(".sudoku-cell");
      for (let i = 0; i < cells.length; i++) if (!cells[i].querySelector(".glyph-svg")) return i;
      return -1;
    });
    if (blank >= 0) {
      await page.locator(".sudoku-cell").nth(blank).click();
      await page.evaluate((idx: number) => {
        const input = document.querySelectorAll(".sudoku-cell input")[idx] as HTMLInputElement;
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
        setter.call(input, "1");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }, blank);
      await page.waitForTimeout(400);
    }
    await page.locator("button.logo-trigger").click();
    await page.waitForSelector(".gallery-viewport", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(700);
    await page.locator(".gallery-viewport").press("ArrowRight").catch(() => {});
    await page.locator(".gallery-viewport").press("d").catch(() => {});
    await page.waitForTimeout(900);

    const guard = await page.evaluate(() => {
      const frame = document.querySelector(".guard-note-frame");
      const leave = document.querySelector(".guard-leave .guard-face");
      const keep = document.querySelector(".guard-btn:not(.guard-leave) .guard-face");
      if (!frame) return null;
      // Resolve ANY colour string to device bytes through the engine itself — `color-mix()`
      // and `oklch()` come back in forms a regex does not price, and a 8%-alpha ground is
      // not a ground at all: walk until the stack is OPAQUE, compositing as we go.
      const cv = document.createElement("canvas");
      cv.width = cv.height = 1;
      const ctx = cv.getContext("2d")!;
      const dev = (s: string, under: [number, number, number] = [255, 255, 255]) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = `rgb(${under[0]},${under[1]},${under[2]})`;
        ctx.fillRect(0, 0, 1, 1);
        ctx.fillStyle = s;
        ctx.fillRect(0, 0, 1, 1);
        const d = ctx.getImageData(0, 0, 1, 1).data;
        return [d[0], d[1], d[2]] as [number, number, number];
      };
      const groundOf = (el: Element | null) => {
        const stack: string[] = [];
        let n: Element | null = el;
        while (n) {
          const bg = getComputedStyle(n).backgroundColor;
          if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") stack.push(bg);
          n = n.parentElement;
        }
        let acc: [number, number, number] = [255, 255, 255];
        for (let i = stack.length - 1; i >= 0; i--) acc = dev(stack[i], acc);
        return `rgb(${acc[0]}, ${acc[1]}, ${acc[2]})`;
      };
      const asRgb = (s: string | null, under: [number, number, number]) => {
        if (!s) return null;
        const d = dev(s, under);
        return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
      };
      const pageGround = groundOf(frame);
      const pg = /rgb\((\d+), (\d+), (\d+)\)/.exec(pageGround)!;
      const under: [number, number, number] = [+pg[1], +pg[2], +pg[3]];
      return {
        frameBg: getComputedStyle(frame).backgroundColor,
        frameBorderTop: getComputedStyle(frame).borderTopColor,
        leaveColor: leave ? asRgb(getComputedStyle(leave).color, under) : null,
        leaveBgDeclared: leave ? getComputedStyle(leave).backgroundColor : null,
        // the verb's OWN ground = the page ground with the 8% (or red 8%) mix laid over it
        leaveGround: leave ? asRgb(getComputedStyle(leave).backgroundColor, under) : null,
        pageGround,
        keepColor: keep ? asRgb(getComputedStyle(keep).color, under) : null,
        keepGround: pageGround,
        leaveText: (leave?.textContent ?? "").trim(),
        keepText: (keep?.textContent ?? "").trim(),
      };
    });

    const ratios: Record<string, number | null> = {};
    if (guard?.leaveColor && guard.leaveGround) {
      const ink = parseCss(guard.leaveColor);
      const gr = parseCss(guard.leaveGround);
      const pg = parseCss(guard.pageGround);
      if (ink && gr) ratios["destructive verb on its own 8% ground"] = +ratio(ink, gr).toFixed(2);
      if (ink && pg) ratios["destructive verb on the card"] = +ratio(ink, pg).toFixed(2);
      const keep = parseCss(guard.keepColor ?? "");
      if (keep && pg) ratios["the keep verb on the card"] = +ratio(keep, pg).toFixed(2);
    }
    writeFileSync(join(OUT, `guard-${ARM}-${browserName}.json`), JSON.stringify({ arm: ARM, guard, ratios }, null, 2));
    expect(guard, `the guard must be armed for this row to mean anything (${browserName})`).not.toBeNull();
  });

  test("G — the KILL: the sixth vs a revealed answer, told apart by form", async ({ page, browserName }) => {
    // The sixth IS solver stop 2's hue by construction (0.0–0.6°). The kill condition is
    // therefore not "are they different colours" — they are the SAME colour — but "can a
    // player tell the fill meter from a revealed answer". The only separators left are
    // FORM, WEIGHT and PLACE, so those are what gets measured.
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await boot(page);
    await fillPartly(page, 3);
    const before = await page.evaluate(() => {
      const svg = document.querySelector("svg.hand-drawn-grid")!.getBoundingClientRect();
      const t = document.querySelector<SVGPathElement>(".progress-trace");
      const cs = t ? getComputedStyle(t) : null;
      return {
        board: { x: svg.x, y: svg.y, w: svg.width, h: svg.height },
        traceStrokeUser: cs ? parseFloat(cs.strokeWidth) : null,
        traceStrokeCss: cs ? parseFloat(cs.strokeWidth) * (svg.width / 1000) : null,
        traceOpacity: cs?.strokeOpacity ?? null,
        traceLinecap: cs?.strokeLinecap ?? null,
      };
    });
    const solve = page.locator('.controls-card button[aria-label="Solve puzzle"]');
    let solved: unknown = null;
    if (await solve.count()) {
      await solve.click();
      await page.waitForTimeout(3500);
      solved = await page.evaluate(() => {
        const svg = document.querySelector("svg.hand-drawn-grid")!.getBoundingClientRect();
        const paths = Array.from(document.querySelectorAll<SVGPathElement>(".sudoku-cell .glyph-svg path"));
        const sample = paths.slice(0, 12).map((p) => {
          const cs = getComputedStyle(p);
          const r = p.getBoundingClientRect();
          return {
            stroke: cs.stroke, strokeWidth: cs.strokeWidth,
            // how far the glyph sits from the board's own edge: the trace lives ON the edge
            insetFromEdge: +Math.min(r.x - svg.x, r.y - svg.y, svg.x + svg.width - (r.x + r.width), svg.y + svg.height - (r.y + r.height)).toFixed(1),
            w: +r.width.toFixed(1), h: +r.height.toFixed(1),
          };
        });
        return { count: paths.length, sample, boardW: svg.width };
      });
    }
    writeFileSync(join(OUT, `kill-form-${ARM}-${browserName}.json`), JSON.stringify({ arm: ARM, before, solved }, null, 2));
    expect(before.traceStrokeCss, "the trace must be measurable").not.toBeNull();
  });

  for (const scheme of ["light", "dark"] as const) {
    test(`F — board-corner crop (${scheme})`, async ({ page, browserName }) => {
      test.skip(browserName !== "chromium", "one engine's crop is the frame; the numbers carry both");
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await boot(page);
      await fillPartly(page, 12);
      const box = await page.evaluate(() => {
        const el = document.querySelector("svg.hand-drawn-grid");
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y };
      });
      if (!box) test.skip();
      await page.screenshot({
        path: join(FRAMES, `board-corner-${ARM}-${scheme}.png`),
        clip: { x: Math.max(0, box!.x - 20), y: Math.max(0, box!.y - 20), width: 330, height: 210 },
      });
    });
  }
});
