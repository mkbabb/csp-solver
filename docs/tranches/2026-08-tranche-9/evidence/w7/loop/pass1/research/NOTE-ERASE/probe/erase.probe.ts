/**
 * T9-W7 §7 · NOTE-ERASE (THE ERASER) — pass-1 lane probe.
 *
 * Read-only on the product. Everything the family proposes is injected over the LIVE
 * MarginNote with `addStyleTag` / `page.evaluate`; no source file is touched.
 *
 *   E1  the three lives at HEAD + the clock's born-RED rows (arm a / arm b)
 *   E2  the rub-out, frame-traced (clip + opacity only; PRM same-frame)
 *   E3  the quiet rung, by PAINTED BYTES, 16px hand face on the note's real backdrop
 *   E4  the peer rows on `?wire=local` (elsewhere / the named cell / a join)
 *   E5  the board leaving (Escape to the gallery)
 *   E6  the refusal note's life
 *
 * Banks JSON under ../logs. Prints tagged `NE|` lines.
 */
import { test, expect, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
const FRAMES = join(HERE, "..", "frames");
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));
const say = (k: string, v: unknown) => console.log(`NE|${k}|${JSON.stringify(v)}`);

const BOARD = "?size=3&difficulty=EASY";

async function boardReady(page: Page, query = BOARD) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
}

/** The note, as the r0 R3-d reader saw it, plus this family's fields. */
const readNote = (page: Page) =>
  page.evaluate(() => {
    const n = document.querySelector<HTMLElement>(".margin-note");
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!n) return null;
    const cs = getComputedStyle(n);
    const ics = ink ? getComputedStyle(ink) : null;
    const r = (ink ?? n).getBoundingClientRect();
    const r1 = (x: number) => Math.round(x * 10) / 10;
    return {
      text: (n.textContent || "").replace(/\s+/g, " ").trim(),
      tone: (n.getAttribute("class") || "").replace("margin-note", "").trim(),
      opacity: cs.opacity,
      inkOpacity: ics?.opacity ?? null,
      color: ics?.color ?? cs.color,
      fontSize: cs.fontSize,
      fontFamily: cs.fontFamily.split(",")[0],
      filter: ics?.filter ?? "none",
      transform: ics?.transform ?? "none",
      box: { w: r1(r.width), h: r1(r.height), x: r1(r.left), y: r1(r.top) },
      inViewport:
        r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= window.innerHeight,
      quiet: !!document.querySelector(".margin-note-block.is-quiet"),
      role: n.getAttribute("role"),
      ariaLive: n.getAttribute("aria-live"),
      becauseCells: document.querySelectorAll(".game-cell.is-because").length,
      becauseEmpty: [
        ...document.querySelectorAll<HTMLElement>(".game-cell.is-because"),
      ].filter((c) => !(c.querySelector("input") as HTMLInputElement)?.value).length,
    };
  });

/** Arm the hint: focus an empty cell, press H once (first press NAMES, second inks). */
async function armHint(page: Page) {
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(900);
  return readNote(page);
}

/** The backdrop the note is actually painted over, composited bottom-up (access.spec 2.3's idiom). */
const backdropOf = (page: Page, sel: string) =>
  page.evaluate((sel) => {
    const parse = (c: string): [number, number, number, number] => {
      const s = c.trim();
      if (!s || s === "transparent") return [0, 0, 0, 0];
      let m = /^color\(\s*srgb\s+([^)]+)\)$/i.exec(s);
      if (m) {
        const parts = m[1].split("/");
        const rgb = parts[0].trim().split(/\s+/).map(Number);
        const a =
          parts[1] === undefined
            ? 1
            : Number(parts[1].trim().replace("%", "")) /
              (parts[1].includes("%") ? 100 : 1);
        return [rgb[0] * 255, rgb[1] * 255, rgb[2] * 255, a];
      }
      m = /^rgba?\(([^)]+)\)$/i.exec(s);
      if (m) {
        const p = m[1].split(/[,/]/).map((x) => x.trim());
        const n = p.map((x) => (x.endsWith("%") ? Number(x.slice(0, -1)) / 100 : Number(x)));
        return [n[0], n[1], n[2], p[3] === undefined ? 1 : n[3]];
      }
      return [0, 0, 0, 0];
    };
    const over = (
      fg: [number, number, number, number],
      bg: [number, number, number, number],
    ): [number, number, number, number] => {
      const a = fg[3] + bg[3] * (1 - fg[3]);
      if (a === 0) return [0, 0, 0, 0];
      const ch = (i: number) => (fg[i] * fg[3] + bg[i] * bg[3] * (1 - fg[3])) / a;
      return [ch(0), ch(1), ch(2), a];
    };
    const lum = (c: [number, number, number, number]) => {
      const f = (x: number) => {
        const v = x / 255;
        return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
    };
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) return null;
    const layers: [number, number, number, number][] = [];
    const chain: string[] = [];
    for (let n: Element | null = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c[3] > 0) {
        layers.push(c);
        chain.push(
          `${(n as HTMLElement).className || n.tagName} ${getComputedStyle(n).backgroundColor}`,
        );
      }
      if (c[3] >= 1) break;
    }
    let bg: [number, number, number, number] = [255, 255, 255, 1];
    for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg);
    const fg = over(parse(getComputedStyle(el).color), bg);
    const [l1, l2] = [lum(fg), lum(bg)].sort((x, y) => y - x);
    return {
      sel,
      fgToken: getComputedStyle(el).color,
      bg: `rgb(${bg.slice(0, 3).map(Math.round).join(", ")})`,
      backdropChain: chain,
      ratio: Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100,
    };
  }, sel);

/** WCAG ratio from two 8-bit sRGB triples. */
function ratio(a: number[], b: number[]) {
  const lum = (c: number[]) => {
    const f = (x: number) => {
      const v = x / 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
}

/** PAINTED BYTES: screenshot the note's own box, read the engine's raster back. */
async function paintedBytes(page: Page, name: string, keepFrame = false) {
  const box = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    const r = ink.getBoundingClientRect();
    return {
      x: Math.floor(r.left) - 2,
      y: Math.floor(r.top) - 2,
      width: Math.ceil(r.width) + 4,
      height: Math.ceil(r.height) + 4,
    };
  });
  if (!box || box.width <= 4 || box.height <= 4) return null;
  const buf = await page.screenshot({ clip: box });
  if (keepFrame) writeFileSync(join(FRAMES, name + ".png"), buf);
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const counts = new Map<string, number>();
  const lum = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const lums: { L: number; px: number[] }[] = [];
  for (let i = 0; i < data.length; i += ch) {
    const px = [data[i], data[i + 1], data[i + 2]];
    counts.set(px.join(","), (counts.get(px.join(",")) ?? 0) + 1);
    lums.push({ L: lum(px[0], px[1], px[2]), px });
  }
  // The modal pixel IS the paper (the note is thin ink on a wide box).
  let modal = "255,255,255";
  let best = 0;
  for (const [k, v] of counts) if (v > best) ((best = v), (modal = k));
  const paper = modal.split(",").map(Number);
  const paperL = lum(paper[0], paper[1], paper[2]);
  // THE INK IS WHATEVER IS FARTHEST FROM THE PAPER — dark ink on light paper in the light
  // theme, LIGHT ink on dark paper in the dark one. Ranking by darkness alone reads the dark
  // theme's own paper as its ink and returns 1.00.
  lums.sort((a, b) => Math.abs(b.L - paperL) - Math.abs(a.L - paperL));
  const extreme = lums[0].px;
  const p005 = lums[Math.min(lums.length - 1, Math.floor(lums.length * 0.005))].px;
  const p02 = lums[Math.min(lums.length - 1, Math.floor(lums.length * 0.02))].px;
  return {
    boxPx: box,
    devicePixels: { w: info.width, h: info.height },
    paper: `rgb(${paper.join(", ")})`,
    inkCorePx: `rgb(${extreme.join(", ")})`,
    extremeRatio: ratio(extreme, paper),
    p005Ratio: ratio(p005, paper),
    p02Ratio: ratio(p02, paper),
    coverageP:
      Math.round(
        (lums.filter((l) => Math.abs(l.L - paperL) > 12).length / lums.length) * 1000,
      ) / 10,
  };
}

// ── THE FAMILY'S PROTOTYPE OVERLAY ────────────────────────────────────────────────────
// Injected verbatim from ../proto/rub-out.css by `addStyleTag` and ../proto/note-life.js
// by `addInitScript`; both are copied inline here so the probe is runnable standalone.
const RUB_OUT_CSS = `
/* NOTE-ERASE prototype — the write-in's mirror. Clip and opacity ONLY; the glyphs never
   move and nothing filters. The write-in is  inset(0 100% 0 0) -> inset(0 0 0 0)  on
   --ease-noteWrite over 250ms; the rub-out is that run backwards, on the erase family's
   own curve: the line goes from its END, back to its start. NO fill (law 6 / FILL_ALLOWLIST):
   the node leaves on animationend, so the end pose is "not there". */
@keyframes ink-rub-out {
  from { clip-path: inset(0 0 0 0); }
  to   { clip-path: inset(0 100% 0 0); }
}
@keyframes ink-rub-out-fade {
  from { opacity: 1; }
  to   { opacity: 0; }
}
.margin-note-ink[data-note-state="erasing"] {
  animation:
    ink-rub-out var(--note-rub-dur, 180ms) var(--ease-accelIn),
    ink-rub-out-fade var(--note-rub-dur, 180ms) var(--ease-accelIn);
}
/* arm (b): the settle. The note stops being the loudest ink on the page after eight beats
   and waits. Colour only — no opacity, no geometry, nothing that could promote a layer. */
.margin-note-ink[data-note-age="settled"] {
  color: var(--ink-press-quiet);
  transition: color var(--note-settle-dur, 500ms) var(--ease-standard);
}
`;

test("E1 the three lives at HEAD, and the clock's born-RED rows", async ({
  page,
  browserName,
}) => {
  const rows: unknown[] = [];
  for (const [vp, w, h] of [
    ["phone 390x844", 390, 844],
    ["desk 1280x800", 1280, 800],
  ] as const) {
    for (const scheme of ["light", "dark"] as const) {
      await page.setViewportSize({ width: w, height: h });
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
      await boardReady(page);
      const armed = await armHint(page);
      const backdrop = await backdropOf(page, ".margin-note-ink");
      // arm (b), prototyped: settle to the quiet rung after eight beats (8 x 125ms).
      await page.addStyleTag({ content: RUB_OUT_CSS });
      const t0 = Date.now();
      await page.waitForTimeout(1000);
      await page.evaluate(() =>
        document
          .querySelector<HTMLElement>(".margin-note-ink")
          ?.setAttribute("data-note-age", "settled"),
      );
      await page.waitForTimeout(700);
      const settled = await readNote(page);
      const settledBackdrop = await backdropOf(page, ".margin-note-ink");
      rows.push({
        viewport: vp,
        scheme,
        armed,
        backdropAtHead: backdrop,
        settledProto: settled,
        settledBackdrop,
        settleDelayMs: Date.now() - t0,
      });
    }
  }

  // The 30s idle row, re-derived on THIS tree, once per engine (opacity is theme-invariant).
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  const armed30 = await armHint(page);
  await page.waitForTimeout(30000);
  const after30 = await readNote(page);

  // THE RE-READ: is a retracted hint recoverable, and does the model agree with the note?
  // (arm (a)'s hidden cost — if the note leaves while `hintReasoning` stays armed, the next
  // H press INKS instead of naming.)
  await boardReady(page);
  const a1 = await armHint(page);
  await page.keyboard.press("h"); // second press consumes: inks the digit
  await page.waitForTimeout(900);
  const consumed = await readNote(page);
  const a2 = await armHint(page); // can the reader get a note back at all?

  const report = {
    engine: browserName,
    rows,
    idle30s: { armed: armed30, after30 },
    reRead: { armed: a1, afterSecondPress: consumed, reArmed: a2 },
  };
  bank(`e1-lives-${browserName}.json`, report);
  say("E1", { engine: browserName, idle30sOpacity: after30?.opacity, text: after30?.text });
  expect(rows.length).toBe(4);
});

test("E2 the rub-out, frame-traced", async ({ page, browserName }) => {
  const traces: unknown[] = [];
  for (const [vp, w, h] of [
    ["phone 390x844", 390, 844],
    ["desk 1280x800", 1280, 800],
  ] as const) {
    for (const prm of [false, true]) {
      for (const dur of prm ? [180] : [125, 180]) {
        await page.setViewportSize({ width: w, height: h });
        await page.emulateMedia({
          reducedMotion: prm ? "reduce" : "no-preference",
          colorScheme: "light",
        });
        await boardReady(page);
        await armHint(page);
        await page.addStyleTag({ content: RUB_OUT_CSS });
        const trace = await page.evaluate(async (dur) => {
          const ink = document.querySelector<HTMLElement>(".margin-note-ink");
          if (!ink) return null;
          ink.style.setProperty("--note-rub-dur", dur + "ms");
          const samples: {
            t: number;
            clip: string;
            opacity: string;
            filter: string;
            transform: string;
            anim: string;
          }[] = [];
          let ended = -1;
          const t0 = performance.now();
          ink.addEventListener("animationend", () => {
            if (ended < 0) ended = performance.now() - t0;
          });
          ink.setAttribute("data-note-state", "erasing");
          await new Promise<void>((res) => {
            const tick = () => {
              const cs = getComputedStyle(ink);
              samples.push({
                t: Math.round((performance.now() - t0) * 10) / 10,
                clip: cs.clipPath,
                opacity: cs.opacity,
                filter: cs.filter,
                transform: cs.transform,
                anim: cs.animationName,
              });
              if (performance.now() - t0 > Math.max(dur * 2.2, 400)) res();
              else requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          });
          // Nothing on the ANCESTORS may filter or transform either (no text boil).
          const chain: string[] = [];
          for (let n: HTMLElement | null = ink; n; n = n.parentElement) {
            const cs = getComputedStyle(n);
            if (cs.filter !== "none" || cs.transform !== "none")
              chain.push(`${n.className || n.tagName}: filter=${cs.filter} transform=${cs.transform}`);
          }
          return { samples, endedMs: Math.round(ended * 10) / 10, dirtyAncestors: chain };
        }, dur);
        const s = trace?.samples ?? [];
        const distinct = new Set(s.map((x) => x.clip)).size;
        traces.push({
          viewport: vp,
          prm,
          durMs: dur,
          frames: s.length,
          distinctClipStates: distinct,
          endedMs: trace?.endedMs,
          firstFrameMs: s[0]?.t,
          anyFilter: s.some((x) => x.filter !== "none"),
          anyTransform: s.some((x) => x.transform !== "none"),
          dirtyAncestors: trace?.dirtyAncestors,
          head: s.slice(0, 4),
          tail: s.slice(-2),
        });
      }
    }
  }
  const report = { engine: browserName, traces };
  bank(`e2-wipe-${browserName}.json`, report);
  say("E2", traces.map((t: any) => ({ vp: t.viewport, prm: t.prm, dur: t.durMs, frames: t.frames, ended: t.endedMs, filter: t.anyFilter })));
  expect(traces.length).toBeGreaterThan(0);
});

test("E3 the quiet rung, by painted bytes, on the phone's hand face", async ({
  page,
  browserName,
}) => {
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
    await boardReady(page);
    const armed = await armHint(page);
    await page.addStyleTag({ content: RUB_OUT_CSS });
    const full = await paintedBytes(page, `note-full-${scheme}-${browserName}`);
    const fullComposite = await backdropOf(page, ".margin-note-ink");
    await page.evaluate(() =>
      document
        .querySelector<HTMLElement>(".margin-note-ink")
        ?.setAttribute("data-note-age", "settled"),
    );
    await page.waitForTimeout(800);
    const quiet = await paintedBytes(
      page,
      `note-quiet-${scheme}-${browserName}`,
      browserName === "chromium",
    );
    const quietComposite = await backdropOf(page, ".margin-note-ink");
    rows.push({
      scheme,
      fontSize: armed?.fontSize,
      fontFamily: armed?.fontFamily,
      text: armed?.text,
      full: { painted: full, composite: fullComposite },
      quiet: { painted: quiet, composite: quietComposite },
    });
  }
  const report = { engine: browserName, dpr: 1, rows };
  bank(`e3-quiet-rung-${browserName}.json`, report);
  say("E3", rows.map((r: any) => ({
    scheme: r.scheme,
    fullComposite: r.full.composite?.ratio,
    fullPainted: r.full.painted?.p005Ratio,
    quietComposite: r.quiet.composite?.ratio,
    quietPainted: r.quiet.painted?.p005Ratio,
  })));
  expect(rows.length).toBe(2);
});

test("E3b the same rung at DPR 3 — the real phone's raster", async ({ browser, browserName }) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
    await boardReady(page);
    await armHint(page);
    await page.addStyleTag({ content: RUB_OUT_CSS });
    const full = await paintedBytes(page, `dpr3-full-${scheme}-${browserName}`);
    await page.evaluate(() =>
      document
        .querySelector<HTMLElement>(".margin-note-ink")
        ?.setAttribute("data-note-age", "settled"),
    );
    await page.waitForTimeout(800);
    const quiet = await paintedBytes(page, `dpr3-quiet-${scheme}-${browserName}`);
    rows.push({ scheme, full, quiet });
  }
  bank(`e3b-dpr3-${browserName}.json`, { engine: browserName, dpr: 3, rows });
  say("E3b", rows.map((r: any) => ({ scheme: r.scheme, full: r.full?.p005Ratio, quiet: r.quiet?.p005Ratio })));
  await ctx.close();
  expect(rows.length).toBe(2);
});

test("E4 the peer rows on the wire", async ({ browser, browserName }) => {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  const a = await ctx.newPage();
  await a.goto("./" + BOARD + "&wire=local");
  await a.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await a.waitForTimeout(1200);
  await a
    .locator('.controls-card button[aria-label="Play together on this board"]')
    .click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();

  // ROW 1 — a JOIN. The note must stand.
  const armedJoin = await armHint(a);
  const b = await ctx.newPage();
  await b.emulateMedia({ reducedMotion: "reduce" });
  await b.goto(link);
  await b.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await b.waitForTimeout(1500);
  const afterJoin = await readNote(a);

  /** The cell the note names: the one EMPTY cell in the armed argument's `is-because` set. */
  const namedCell = async (p: Page) =>
    p.evaluate(() => {
      const cells = [...document.querySelectorAll<HTMLElement>(".game-cell")];
      const idx: number[] = [];
      cells.forEach((c, i) => {
        if (
          c.classList.contains("is-because") &&
          !(c.querySelector("input") as HTMLInputElement)?.value
        )
          idx.push(i);
      });
      return idx;
    });

  const write = async (p: Page, i: number, digit: string) => {
    const cell = p.locator(".sudoku-cell input").nth(i);
    await cell.click();
    await cell.fill(digit);
    await p.waitForTimeout(1200);
  };
  const firstEmptyExcept = (p: Page, except: number[]) =>
    p.evaluate(
      (except) =>
        [...document.querySelectorAll(".sudoku-cell input")].findIndex(
          (i, k) => !(i as HTMLInputElement).value && !except.includes(k),
        ),
      except,
    );

  // ROW 2 — a peer writes ELSEWHERE. The family says: the note stands. (born-RED at HEAD.)
  await boardReady(a, BOARD + "&wire=local");
  // re-establish the room after the reload
  await a
    .locator('.controls-card button[aria-label="Play together on this board"]')
    .click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link2 = a.url();
  await b.goto(link2);
  await b.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await b.waitForTimeout(1500);
  const armedElsewhere = await armHint(a);
  const named = await namedCell(a);
  const elsewhere = await firstEmptyExcept(b, named);
  await write(b, elsewhere, "1");
  const afterPeerElsewhere = await readNote(a);

  // ROW 3 — a peer writes THE NAMED CELL. The family says: erased (and HEAD agrees, by luck).
  const armedNamed = await armHint(a);
  const named2 = await namedCell(a);
  let afterPeerNamed: unknown = null;
  if (named2.length) {
    await write(b, named2[0], "1");
    afterPeerNamed = await readNote(a);
  }

  const report = {
    engine: browserName,
    join: { armed: armedJoin, after: afterJoin },
    peerElsewhere: {
      armed: armedElsewhere,
      namedCells: named,
      wroteCell: elsewhere,
      after: afterPeerElsewhere,
    },
    peerNamedCell: { armed: armedNamed, namedCells: named2, after: afterPeerNamed },
  };
  bank(`e4-peer-${browserName}.json`, report);
  say("E4", {
    join: afterJoin?.text,
    elsewhere: afterPeerElsewhere?.text,
    named: (afterPeerNamed as any)?.text,
  });
  await ctx.close();
  expect(report.join.after).not.toBeNull();
});

test("E5 the board leaving — into the gallery, and back", async ({ page, browserName }) => {
  const rows: unknown[] = [];
  // CORRECTION TO R3-d's ROW: Escape does not open the deck. `onWindowEscape`
  // (GameGallery.vue:708) is the DECK's, bound while the deck is mounted; the board's entry
  // verbs are the masthead wordmark and a bare `g` (App.vue:774), and `g` is explicitly
  // refused inside a cell input. So R3-d's "press Escape (gallery)" row measured a board the
  // reader never left. Both real verbs are exercised here.
  for (const [vp, w, h] of [
    ["phone 390x844", 390, 844],
    ["desk 1280x800", 1280, 800],
  ] as const) {
    for (const verb of ["escape (r3-d's row, re-read)", "g", "wordmark"] as const) {
      await page.setViewportSize({ width: w, height: h });
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
      await boardReady(page);
      const armed = await armHint(page);
      if (verb === "escape (r3-d's row, re-read)") {
        await page.keyboard.press("Escape");
      } else if (verb === "g") {
        await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
        await page.keyboard.press("g");
      } else {
        await page
          .locator("button:has(svg.handwritten-logo)")
          .first()
          .click({ timeout: 6000 })
          .catch(() => {});
      }
      await page.waitForTimeout(1400);
      const inGallery = await readNote(page);
      const galleryShown = await page.evaluate(() => ({
        deck: !!document.querySelector(".game-gallery"),
        boardStillMounted: !!document.querySelector('[role="grid"]'),
        noteInsideCard: !!document.querySelector(
          ".game-gallery .margin-note, .gallery-viewport .margin-note",
        ),
      }));
      rows.push({ viewport: vp, verb, armed, inGallery, galleryShown });
    }
  }
  bank(`e5-leaving-${browserName}.json`, { engine: browserName, rows });
  say("E5", rows.map((r: any) => ({ vp: r.viewport, verb: r.verb, gallery: r.galleryShown, text: r.inGallery?.text, y: r.inGallery?.box?.y, inVp: r.inGallery?.inViewport })));
  expect(rows.length).toBe(6);
});

test("E8 the round trip — the note comes back with the reader", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  const armed = await armHint(page);
  const boardAtArm = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i) => (i as HTMLInputElement).value || ".")
      .join(""),
  );
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.keyboard.press("g");
  await page.waitForTimeout(1400);
  const inDeck = await readNote(page);
  // Is the stale sentence still ADDRESSABLE while the deck is up? A 0x0 box is not an answer:
  // `display: none` leaves the a11y tree, a clipped-but-rendered region does not.
  const deckA11y = await page.evaluate(() => {
    const n = document.querySelector<HTMLElement>(".margin-note");
    if (!n) return null;
    const cs = getComputedStyle(n);
    let inertOrHidden = "";
    for (let e: HTMLElement | null = n; e; e = e.parentElement) {
      if (e.hasAttribute?.("inert")) inertOrHidden += `inert:${e.className || e.tagName} `;
      if (e.getAttribute?.("aria-hidden") === "true")
        inertOrHidden += `aria-hidden:${e.className || e.tagName} `;
      if (getComputedStyle(e).display === "none")
        inertOrHidden += `display-none:${e.className || e.tagName} `;
    }
    return {
      display: cs.display,
      visibility: cs.visibility,
      offsetParentNull: n.offsetParent === null,
      rendered: !!n.checkVisibility?.(),
      hiddenBy: inertOrHidden.trim() || "(nothing)",
      text: (n.textContent || "").trim(),
    };
  });
  // The deck's own Escape cancels and unfolds the board back.
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1600);
  const back = await readNote(page);
  const boardOnReturn = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i) => (i as HTMLInputElement).value || ".")
      .join(""),
  );
  const report = {
    engine: browserName,
    armed,
    inDeck,
    deckA11y,
    back,
    boardSame: boardAtArm === boardOnReturn,
    deckGone: await page.evaluate(() => !document.querySelector(".game-gallery")),
  };
  bank(`e8-roundtrip-${browserName}.json`, report);
  say("E8", {
    inDeckBox: inDeck?.box,
    inDeckText: inDeck?.text,
    backText: back?.text,
    backBox: back?.box,
    boardSame: report.boardSame,
  });
  expect(back).not.toBeNull();
});

test("E7 arm (a)'s hidden cost — the note leaves, the argument does not", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });

  // THE PRM TRAP, measured first. `index.css:1157-1171` puts `animation: none !important` on
  // `.margin-note-ink` under reduced motion, so an exit whose REMOVAL is gated on
  // `animationend` never fires at all and the note becomes immortal for exactly the readers
  // who asked for less motion. Same overlay, reduced motion on.
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await armHint(page);
  await page.addStyleTag({ content: RUB_OUT_CSS });
  const prmArm = await page.evaluate(async () => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    let fired = false;
    ink.addEventListener("animationend", () => ((fired = true), (ink.style.display = "none")), {
      once: true,
    });
    ink.setAttribute("data-note-state", "erasing");
    await new Promise((r) => setTimeout(r, 600));
    const r = ink.getBoundingClientRect();
    return {
      animationName: getComputedStyle(ink).animationName,
      animationEndFired: fired,
      stillPainted: r.width > 0 && r.height > 0,
      opacity: getComputedStyle(ink).opacity,
    };
  });

  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  const armed = await armHint(page);
  await page.addStyleTag({ content: RUB_OUT_CSS });

  // THE CLOCK ENDS (arm a), prototyped the only way a lane without a source patch can do it:
  // the NOTE is rubbed out. The MODEL is untouched, because `hintReasoning` is the model's and
  // no overlay can reach it — which is precisely the coupling this row is here to price.
  await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return;
    ink.setAttribute("data-note-state", "erasing");
    ink.addEventListener("animationend", () => (ink.style.display = "none"), {
      once: true,
    });
  });
  await page.waitForTimeout(600);
  const afterClock = await readNote(page);
  const boardBefore = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i) => (i as HTMLInputElement).value || ".")
      .join(""),
  );
  // The reader, seeing no sentence, asks for a hint again.
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(900);
  const boardAfter = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i) => (i as HTMLInputElement).value || ".")
      .join(""),
  );
  const afterPress = await readNote(page);

  // DETERMINISM — is the sentence the same one when the board has not changed? Ink it, undo
  // the ink, ask again.
  await boardReady(page);
  const first = await armHint(page);
  await page.keyboard.press("h"); // ink it
  await page.waitForTimeout(700);
  await page.keyboard.press("Meta+z"); // put the board back
  await page.waitForTimeout(900);
  const second = await armHint(page);

  const report = {
    engine: browserName,
    prmArm,
    armed,
    afterClock,
    becauseStillLit: afterClock?.becauseCells,
    boardChangedByTheNextHPress: boardBefore !== boardAfter,
    afterPress,
    determinism: { first: first?.text, afterUndoThenH: second?.text },
  };
  bank(`e7-arm-a-cost-${browserName}.json`, report);
  say("E7", {
    prm: prmArm,
    because: report.becauseStillLit,
    inked: report.boardChangedByTheNextHPress,
    first: first?.text,
    second: second?.text,
  });
  expect(afterClock).not.toBeNull();
});

test("E6 the refusal note's life", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  // Write at a GIVEN: W1 §1.1 refuses and speaks.
  const givenIdx = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")].findIndex(
      (i) => !!(i as HTMLInputElement).value,
    ),
  );
  const cell = page.locator(".sudoku-cell input").nth(givenIdx);
  await cell.click();
  await page.keyboard.press("5");
  await page.waitForTimeout(700);
  const refused = await readNote(page);
  await page.waitForTimeout(30000);
  const after30 = await readNote(page);
  // A second refusal on the SAME cell: does the note re-write, or sit unchanged?
  await cell.click();
  await page.keyboard.press("6");
  await page.waitForTimeout(700);
  const refusedAgain = await readNote(page);
  bank(`e6-refusal-${browserName}.json`, {
    engine: browserName,
    refused,
    after30,
    refusedAgain,
  });
  say("E6", { refused: refused?.text, after30: after30?.text, tone: after30?.tone });
  expect(refused).not.toBeNull();
});

test("E9 one grammar — the other two voices at the settle rung, and the repeat", async ({
  page,
  browserName,
}) => {
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
    await boardReady(page);
    await armHint(page);
    await page.addStyleTag({ content: RUB_OUT_CSS });
    for (const tone of ["graphite", "teacher-red", "gold-star"] as const) {
      // TOKEN-LEVEL read: the tone class carries the colour, so the note wears each of the
      // three in turn and the backdrop compositor reads what a reader would meet. (The words
      // are not the subject here; W1 owns those.)
      await page.evaluate((tone) => {
        const n = document.querySelector<HTMLElement>(".margin-note");
        if (n) n.className = `margin-note ${tone}`;
        const ink = document.querySelector<HTMLElement>(".margin-note-ink");
        ink?.removeAttribute("data-note-age");
        ink?.style.removeProperty("color");
      }, tone);
      await page.waitForTimeout(120);
      const full = await backdropOf(page, ".margin-note-ink");
      const fullPainted = await paintedBytes(page, `tone-${tone}-${scheme}-${browserName}`);
      // …and the same tone at the quiet rung's 68%, which is what a settle would do to it.
      await page.evaluate(() => {
        const ink = document.querySelector<HTMLElement>(".margin-note-ink");
        if (!ink) return;
        const c = getComputedStyle(ink).color;
        ink.style.color = `color-mix(in srgb, ${c} 68%, transparent)`;
      });
      await page.waitForTimeout(120);
      const settled = await backdropOf(page, ".margin-note-ink");
      const settledPainted = await paintedBytes(
        page,
        `tone-${tone}-68-${scheme}-${browserName}`,
      );
      rows.push({
        scheme,
        tone,
        fullRatio: full?.ratio,
        fullPainted: fullPainted?.p005Ratio,
        settledRatio: settled?.ratio,
        settledPainted: settledPainted?.p005Ratio,
        fg: full?.fgToken,
      });
    }
  }

  // THE REPEAT — the same sentence twice. `setMargin` writes the string the ref already holds,
  // so nothing in the DOM mutates: no write-in replays and an `aria-atomic` region announces
  // nothing. The board's own second voice cured exactly this at GameBoard.vue's `announce()`
  // (empty, then write on the next flush); the margin never got the cure.
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  const givenIdx = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")].findIndex(
      (i) => !!(i as HTMLInputElement).value,
    ),
  );
  const cell = page.locator(".sudoku-cell input").nth(givenIdx);
  await cell.click();
  await page.keyboard.press("5");
  await page.waitForTimeout(700);
  // Not awaited yet: the in-page promise stays pending until the second refusal has landed,
  // so the observer is watching across the act rather than before or after it.
  const repeatPromise = page.evaluate(() => {
    const block = document.querySelector<HTMLElement>(".margin-note-block");
    if (!block) return Promise.resolve(null);
    let starts = 0;
    let mutations = 0;
    block.addEventListener("animationstart", () => starts++);
    const mo = new MutationObserver((m) => (mutations += m.length));
    mo.observe(block, { childList: true, subtree: true, characterData: true });
    return new Promise<{ starts: number; mutations: number; text: string }>((res) => {
      (window as unknown as { __neDone: () => void }).__neDone = () => {
        mo.disconnect();
        res({ starts, mutations, text: (block.textContent || "").trim() });
      };
    });
  });
  await page.waitForTimeout(200);
  await cell.click();
  await page.keyboard.press("6"); // the SAME refusal, a second time
  await page.waitForTimeout(900);
  await page.evaluate(() => (window as unknown as { __neDone: () => void }).__neDone());
  const repeatRead = await repeatPromise;

  bank(`e9-grammar-${browserName}.json`, {
    engine: browserName,
    tones: rows,
    repeatRefusal: repeatRead,
  });
  say("E9", { tones: rows, repeat: repeatRead });
  expect(rows.length).toBe(6);
});
