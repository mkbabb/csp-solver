/**
 * NOTE-LEDGER pass 1 — the ramp, the strings, the push, the crops.
 *
 * NL-2 RAMP    — full / quiet / rule drawn as real note lines over the note's REAL backdrop,
 *                both themes, read twice: composited colour math (the estate's own
 *                `access.spec.ts` §2.3 method) and PAINTED BYTES off a dsf screenshot.
 * NL-3 PUSH    — a fourth line arrives and the column steps down: frame trace of the motion,
 *                the glyphs' own `filter`/`transform` census, and the PRM arm.
 * NL-4 STRINGS — every voice the ledger would hold, measured against the phone's 258px line.
 * NL-5 CROPS   — one crop at 390 (the stack against the board's foot and the ribbon) and one
 *                at 1280.
 *
 * Read-only on the product: every ledger line is a CLONE of the live `.margin-note-block`.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const OUT = process.env.NL_OUT || join(dirname(new URL(import.meta.url).pathname), "..", "logs");
const FRAMES =
  process.env.NL_FRAMES || join(dirname(new URL(import.meta.url).pathname), "..", "frames");
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });
const bank = (name: string, data: unknown) =>
  writeFileSync(join(OUT, name), JSON.stringify(data, null, 2));
const r2 = (v: number) => Math.round(v * 100) / 100;

const VOICES = [
  "only 8 fits here",
  "that's a given clue",
  "check row 4",
  "the board is clear",
  "solved it!",
];

/** Every string the margin can hold today, from the product's own formatters. */
const ALL_STRINGS = [
  "only 8 fits here", // formatHintNote naked-single
  "8 goes nowhere else in this row", // hidden-single, row
  "8 goes nowhere else in this column", // hidden-single, column (the longest)
  "8 goes nowhere else in this group", // hidden-single, fallback axis
  "the answer is 8", // reveal
  "that's a given clue", // W1 §1.1 refusal
  "check row 4", // conflict, indexed
  "check the greater than signs", // conflict, futoshiki furniture
  "check the thermometer", // conflict, thermo furniture
  "no solution from here", // conflict, unnamed
  "the board is clear", // wipe receipt
  "solved it!", // the grade
  "still solving…", // the slow-solve whisper
  "and 4 more", // THE COUNT — minted by this family, nowhere in src today
];

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
}

async function armHintNote(page: Page) {
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(700);
}

/** The shared mount — the same one `height.probe.ts` uses (clone, re-ink, ramp). */
const MOUNT = (lines: string[]) => {
  const RAMP = ["", "var(--ink-press-quiet)", "var(--ink-press-rule)"];
  const strip = document.querySelector(".board-margin") as HTMLElement | null;
  const live = document.querySelector(".board-margin .margin-note-block") as HTMLElement | null;
  if (!strip || !live) return false;
  document.querySelectorAll("[data-ledger-clone]").forEach((n) => n.remove());
  const liveInk = live.querySelector(".margin-note-ink") as HTMLElement | null;
  if (liveInk) liveInk.textContent = lines[0];
  lines.slice(1).forEach((text, i) => {
    const clone = live.cloneNode(true) as HTMLElement;
    clone.setAttribute("data-ledger-clone", String(i + 1));
    const p = clone.querySelector(".margin-note") as HTMLElement | null;
    const ink = clone.querySelector(".margin-note-ink") as HTMLElement | null;
    if (ink) {
      ink.textContent = text;
      ink.style.animation = "none";
    }
    if (p) {
      p.removeAttribute("role");
      p.removeAttribute("aria-live");
      const rung = RAMP[Math.min(i + 1, RAMP.length - 1)];
      if (rung) p.style.color = rung;
    }
    strip.appendChild(clone);
  });
  return true;
};

/* ── NL-2 · THE RAMP ───────────────────────────────────────────────────────────────────── */

/** Composited contrast, `access.spec.ts` §2.3's method: walk up for the opaque backdrop. */
const COMPOSITE = () => {
  const parse = (c: string): number[] => {
    const m = c.match(/[\d.]+/g)?.map(Number) ?? [];
    if (c.startsWith("color(")) {
      // color(srgb r g b / a) — 0..1 channels
      const [r, g, b, a = 1] = m;
      return [r * 255, g * 255, b * 255, a];
    }
    const [r, g, b, a = 1] = m;
    return [r, g, b, a];
  };
  const over = (fg: number[], bg: number[]) => {
    const a = fg[3];
    return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a)).concat([1]);
  };
  const lum = (c: number[]) => {
    const [r, g, b] = c.slice(0, 3).map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const backdropOf = (el: Element) => {
    let node: Element | null = el;
    let acc: number[] | null = null;
    while (node) {
      const bg = parse(getComputedStyle(node).backgroundColor);
      if (bg[3] > 0) acc = acc ? over(acc, bg) : bg;
      if (acc && acc[3] >= 1) break;
      node = node.parentElement;
    }
    return acc ?? [255, 255, 255, 1];
  };
  const rows = Array.from(document.querySelectorAll(".board-margin .margin-note")).map((n) => {
    const cs = getComputedStyle(n);
    const fg = parse(cs.color);
    const bg = backdropOf(n.parentElement || n);
    const solid = over(fg, bg);
    const [l1, l2] = [lum(solid), lum(bg)].sort((a, b) => b - a);
    return {
      text: (n.textContent || "").trim().slice(0, 36),
      color: cs.color,
      backdrop: `rgb(${bg.slice(0, 3).map(Math.round).join(", ")})`,
      ratio: Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100,
      fontSize: cs.fontSize,
    };
  });
  return rows;
};

for (const rig of [
  { name: "390x844", width: 390, height: 844, dsf: 3, mobile: true },
  { name: "1280x800", width: 1280, height: 800, dsf: 2, mobile: false },
]) {
  for (const theme of ["light", "dark"] as const) {
    test(`NL-2 RAMP — ${rig.name} ${theme}`, async ({ browser, browserName }) => {
      const ctx = await browser.newContext({
        viewport: { width: rig.width, height: rig.height },
        deviceScaleFactor: rig.dsf,
        isMobile: rig.mobile && browserName === "chromium",
        hasTouch: rig.mobile,
      });
      const page = await ctx.newPage();
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      await boardReady(page);
      await armHintNote(page);
      await page.evaluate(MOUNT, VOICES.slice(0, 3));
      await page.waitForTimeout(300);

      const composited = await page.evaluate(COMPOSITE);

      // PAINTED BYTES — one shot per line, at device scale, decoded whole.
      const boxes = await page.evaluate(() =>
        // DOCUMENT-relative, because the third line at 1280×800 is already past the fold —
        // which is itself one of this lane's findings, and a viewport clip cannot reach it.
        Array.from(document.querySelectorAll(".board-margin .margin-note")).map((n) => {
          const r = n.getBoundingClientRect();
          return { x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height };
        }),
      );
      const painted: unknown[] = [];
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        const buf = await page.screenshot({
          fullPage: true,
          clip: { x: b.x, y: b.y, width: Math.max(8, b.w), height: Math.max(8, b.h) },
        });
        const { data, info } = await sharp(buf)
          .raw()
          .toBuffer({ resolveWithObject: true });
        const px: Array<[number, number, number]> = [];
        for (let p = 0; p < data.length; p += info.channels) {
          px.push([data[p], data[p + 1], data[p + 2]]);
        }
        const lum = (c: number[]) => {
          const [r, g, bl] = c.map((v) => {
            const s = v / 255;
            return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
        };
        const lums = px.map(lum).sort((a, b) => a - b);
        // paper = the modal (median) pixel; ink core = the extreme the glyph reaches
        const paper = lums[Math.floor(lums.length / 2)];
        const inkLight = lums[0]; // darkest — light theme's ink
        const inkDark = lums[lums.length - 1]; // lightest — dark theme's ink
        const ink = theme === "light" ? inkLight : inkDark;
        // p1/p99: the honest "core of the stroke" rather than one antialiased outlier
        const core =
          theme === "light"
            ? lums[Math.floor(lums.length * 0.01)]
            : lums[Math.floor(lums.length * 0.99)];
        const ratio = (a: number, b: number) => {
          const [hi, lo] = [a, b].sort((x, y) => y - x);
          return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
        };
        painted.push({
          line: i,
          text: (composited[i] as { text: string })?.text,
          pixels: px.length,
          paperLum: r2(paper * 1000) / 1000,
          inkLum: r2(ink * 1000) / 1000,
          ratioExtreme: ratio(ink, paper),
          ratioCore: ratio(core, paper),
        });
      }

      bank(`ramp-${rig.name}-${theme}-${browserName}.json`, { composited, painted });
      // eslint-disable-next-line no-console
      console.log(
        `${rig.name} ${theme} ${browserName}\n` +
          composited
            .map(
              (c, i) =>
                `  rung ${i} "${c.text}" ${c.color} on ${c.backdrop} → composited ${c.ratio}:1 · painted ${(painted[i] as { ratioExtreme: number }).ratioExtreme}:1 (core ${(painted[i] as { ratioCore: number }).ratioCore}:1) @ ${c.fontSize}`,
            )
            .join("\n"),
      );
      await ctx.close();
    });
  }
}

/* ── NL-3 · THE PUSH ───────────────────────────────────────────────────────────────────── */

test("NL-3 PUSH — a line arrives, the column steps down", async ({ browser, browserName }) => {
  const out: unknown[] = [];
  for (const prm of [false, true]) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: browserName === "chromium",
      hasTouch: true,
    });
    const page = await ctx.newPage();
    await page.emulateMedia({
      reducedMotion: prm ? "reduce" : "no-preference",
      colorScheme: "light",
    });
    await boardReady(page);
    await armHintNote(page);
    await page.evaluate(MOUNT, VOICES.slice(0, 2));
    await page.waitForTimeout(300);

    /**
     * THE PUSH, as the family would draw it: the newest line writes in on the estate's own
     * `ink-write-in 250ms var(--ease-noteWrite)`, the older lines translate down one line box
     * on the same curve and step one rung down the ramp. Colour and transform on the LINE box,
     * never a filter and never a transform on the glyph runs (law 13: no text boils).
     */
    const trace = await page.evaluate(async (usePrm) => {
      const strip = document.querySelector(".board-margin") as HTMLElement;
      const live = document.querySelector(
        ".board-margin .margin-note-block",
      ) as HTMLElement;
      const step = 27.19; // one line box + the strip's 0.4rem gap, measured
      const lines = Array.from(
        strip.querySelectorAll(".margin-note-block"),
      ) as HTMLElement[];
      const dur = usePrm ? 0 : 250;
      const ease = getComputedStyle(document.documentElement)
        .getPropertyValue("--ease-noteWrite")
        .trim();

      // THE ORDER IS FLIP's, and law 6 forces it: every verb fills `backwards`, never
      // `forwards`, so the LAYOUT must land first and the motion plays FROM the old place.
      // Insert the new line (the column commits its new height in one step), then run each
      // older line from `translateY(-step)` back to 0 and step it one rung down the ramp.
      // The board's own y BEFORE the insert: the column's growth is a layout step, and a
      // layout step is not tweened. Whatever this number moves by, the board JUMPS by.
      const boardEl = document.querySelector(".board-wrapper") as HTMLElement;
      const boardBefore = Math.round(boardEl.getBoundingClientRect().y * 100) / 100;

      const fresh = live.cloneNode(true) as HTMLElement;
      fresh.setAttribute("data-ledger-clone", "new");
      const ink = fresh.querySelector(".margin-note-ink") as HTMLElement;
      ink.textContent = "check row 4";
      const p = fresh.querySelector(".margin-note") as HTMLElement;
      p.removeAttribute("role");
      p.removeAttribute("aria-live");
      strip.insertBefore(fresh, strip.firstChild);

      const movers = lines.map((l, i) => {
        const np = l.querySelector(".margin-note") as HTMLElement;
        np.style.color = i === 0 ? "var(--ink-press-quiet)" : "var(--ink-press-rule)";
        return l.animate(
          [{ transform: `translateY(-${step}px)` }, { transform: "translateY(0)" }],
          { duration: dur, easing: ease || "linear", fill: "backwards" },
        );
      });
      const writeIn = fresh.animate(
        [
          { clipPath: "inset(0 100% 0 0)", opacity: 1 },
          { clipPath: "inset(0 0 0 0)", opacity: 1 },
        ],
        { duration: dur, easing: ease || "linear", fill: "backwards" },
      );

      const anims = [...movers, writeIn];
      const board = document.querySelector(".board-wrapper") as HTMLElement;
      const t0 = performance.now();
      const frames: Array<{ t: number; y: number[]; op: number[]; boardY: number }> = [];
      await new Promise<void>((resolve) => {
        const tick = () => {
          const now = performance.now() - t0;
          const blocks = Array.from(
            strip.querySelectorAll(".margin-note-block"),
          ) as HTMLElement[];
          frames.push({
            t: Math.round(now * 100) / 100,
            y: blocks.map((b) => Math.round(b.getBoundingClientRect().y * 100) / 100),
            op: blocks.map((b) => Number(getComputedStyle(b).opacity)),
            boardY: Math.round(board.getBoundingClientRect().y * 100) / 100,
          });
          if (now > 500) resolve();
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });

      // the glyph census: what the TEXT runs themselves wear
      const glyphs = Array.from(strip.querySelectorAll(".margin-note-ink")).map((g) => {
        const cs = getComputedStyle(g);
        return {
          filter: cs.filter,
          transform: cs.transform,
          animation: cs.animationName,
          willChange: cs.willChange,
        };
      });

      return {
        ease,
        declaredDuration: dur,
        boardBefore,
        boardJumpPx:
          Math.round((frames[0].boardY - boardBefore) * 100) / 100,
        animations: anims.map((a) => ({
          duration: (a.effect?.getTiming().duration as number) ?? null,
          easing: a.effect?.getTiming().easing ?? null,
          fill: a.effect?.getTiming().fill ?? null,
          playState: a.playState,
        })),
        frames,
        glyphs,
        // the LAST frame at which anything still moved — the honest settle
        settledAt: (() => {
          let last = 0;
          for (let i = 1; i < frames.length; i++) {
            const moved = frames[i].y.some(
              (v, k) => Math.abs(v - (frames[i - 1].y[k] ?? v)) >= 0.01,
            );
            if (moved) last = frames[i].t;
          }
          return last;
        })(),
        travelPx: (() => {
          const col = frames.map((f) => f.y[1] ?? 0).filter((v) => v > 0);
          return col.length ? Math.round((Math.max(...col) - Math.min(...col)) * 100) / 100 : 0;
        })(),
        // the board may not move: its own rect across every frame of the push
        boardTravelPx:
          Math.round(
            (Math.max(...frames.map((f) => f.boardY)) -
              Math.min(...frames.map((f) => f.boardY))) *
              100,
          ) / 100,
        maxFrameGapMs: Math.round(
          Math.max(...frames.slice(1).map((f, i) => f.t - frames[i].t)) * 100,
        ) / 100,
      };
    }, prm);

    out.push({ engine: browserName, prm, ...trace });
    await ctx.close();
  }
  bank(`push-${browserName}.json`, out);
  // eslint-disable-next-line no-console
  console.log(
    out
      .map((o) => {
        const t = o as {
          prm: boolean;
          ease: string;
          settledAt: number | null;
          travelPx: number;
          boardTravelPx: number;
          maxFrameGapMs: number;
          glyphs: Array<{ filter: string; transform: string }>;
        };
        return `prm=${t.prm} ease=${t.ease} settled=${t.settledAt}ms travel=${t.travelPx}px boardJumpAtInsert=${(o as {boardJumpPx:number}).boardJumpPx}px boardTravelDuringMotion=${t.boardTravelPx}px maxGap=${t.maxFrameGapMs}ms glyphFilters=${JSON.stringify(
          t.glyphs.map((g) => g.filter),
        )} glyphTransforms=${JSON.stringify(t.glyphs.map((g) => g.transform))}`;
      })
      .join("\n"),
  );
});

/* ── NL-4 · THE STRINGS ────────────────────────────────────────────────────────────────── */

test("NL-4 STRINGS — every voice against the phone's 258px line", async ({
  browser,
  browserName,
}) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: browserName === "chromium",
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await armHintNote(page);
  const rows = await page.evaluate((strings) => {
    const live = document.querySelector(
      ".board-margin .margin-note-block",
    ) as HTMLElement;
    const ink = live.querySelector(".margin-note-ink") as HTMLElement;
    const strip = document.querySelector(".board-margin") as HTMLElement;
    const stripW = strip.getBoundingClientRect().width;
    const prev = ink.textContent;
    const out = strings.map((s) => {
      ink.textContent = s;
      const r = live.getBoundingClientRect();
      const inkR = ink.getBoundingClientRect();
      return {
        text: s,
        inkWidth: Math.round(inkR.width * 100) / 100,
        blockHeight: Math.round(r.height * 100) / 100,
        wraps: r.height > 21.5,
        stripWidth: Math.round(stripW * 100) / 100,
      };
    });
    ink.textContent = prev;
    return out;
  }, ALL_STRINGS);
  bank(`strings-${browserName}.json`, rows);
  // eslint-disable-next-line no-console
  console.log(
    rows
      .map(
        (r) =>
          `${r.wraps ? "WRAPS" : "  ok "} ${String(r.inkWidth).padStart(7)}px / ${r.stripWidth}px  "${r.text}"`,
      )
      .join("\n"),
  );
  await ctx.close();
});

/* ── NL-5 · THE CROPS ──────────────────────────────────────────────────────────────────── */

test("NL-5 CROPS — the stack against the board's foot", async ({ browser, browserName }) => {
  if (browserName !== "chromium") test.skip();
  // 390: the board's foot, the two- and three-line stacks, and the ribbon under them.
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const page = await ctx.newPage();
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await boardReady(page);
    await armHintNote(page);
    await page.evaluate(MOUNT, VOICES.slice(0, 3));
    await page.waitForTimeout(350);
    await page.screenshot({
      path: join(FRAMES, "390-stack-three.png"),
      clip: { x: 0, y: 520, width: 390, height: 210 },
    });
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await boardReady(page);
    await armHintNote(page);
    await page.evaluate(MOUNT, VOICES.slice(0, 2));
    await page.waitForTimeout(350);
    // The desk's own arithmetic in one frame: the board's foot at 762.45, the strip's first
    // line at 770.84, the SECOND line at 800.84 — and the viewport's own bottom edge at 800,
    // which the crop runs past on purpose (fullPage, document coordinates).
    await page.screenshot({
      path: join(FRAMES, "1280-stack-two.png"),
      fullPage: true,
      clip: { x: 120, y: 745, width: 460, height: 85 },
    });
    await ctx.close();
  }
});
