/**
 * T9-W7 round zero · lane R3 (THE MARKS) — the census probes for §6 (focus rings), §4 (the fill
 * meter) and §7 (the hint note's life). Read-only on the product; every number is taken on THIS
 * tree (uncommitted W3/W6 included), never cited from the 2026-08-10 formation census.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/NOTE-ERASE/logs";
mkdirSync(OUT, { recursive: true });
const bank = (name: string, data: unknown) =>
  writeFileSync(join(OUT, name), JSON.stringify(data, null, 2));

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
}

/** What the focused element wears, verbatim off the cascade. */
const READ_FOCUS = () => {
  const el = document.activeElement as HTMLElement | null;
  if (!el || el === document.body) return null;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const cell = el.closest(".game-cell");
  const ghost = cell?.querySelector(".cell-ghost-path") as SVGPathElement | null;
  const gcs = ghost ? getComputedStyle(ghost) : null;
  return {
    tag: el.tagName.toLowerCase(),
    cls: (el.getAttribute("class") || "").split(/\s+/).filter(Boolean).slice(0, 4).join(" "),
    name: (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 34),
    focusVisible: el.matches(":focus-visible"),
    box: [Math.round(r.width), Math.round(r.height)],
    outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
    outlineOffset: cs.outlineOffset,
    boxShadow: cs.boxShadow === "none" ? "none" : cs.boxShadow.slice(0, 60),
    radius: cs.borderRadius,
    // the house-hand alternative, when the affordance is a drawn path instead of a rect
    ghostStroke: gcs ? `${gcs.stroke} w=${gcs.strokeWidth} o=${gcs.strokeOpacity}` : null,
  };
};

test("R3-b FOCUS RINGS — the whole tab order, and what each stop wears", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());

  const stops: unknown[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press("Tab");
    const s = (await page.evaluate(READ_FOCUS)) as Record<string, unknown> | null;
    if (!s) break;
    const key = `${s.tag}.${s.cls}`;
    if (seen.has(key)) continue; // one row per treatment, not per instance
    seen.add(key);
    stops.push(s);
  }

  // The gallery's own ring (the deck ring after W3) — its own page state.
  await page.goto("./");
  await page.waitForSelector(".gallery-viewport", { timeout: 30000 });
  await page.waitForTimeout(900);
  const galleryStops: unknown[] = [];
  const gseen = new Set<string>();
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const s = (await page.evaluate(READ_FOCUS)) as Record<string, unknown> | null;
    if (!s) break;
    const key = `${s.tag}.${s.cls}`;
    if (gseen.has(key)) continue;
    gseen.add(key);
    galleryStops.push(s);
  }

  const report = { engine: browserName, boardStops: stops, galleryStops };
  bank(`focus-${browserName}.json`, report);
  console.log("FOCUS " + JSON.stringify(report));
  expect(stops.length, "the board must have a tab order to census").toBeGreaterThan(3);
});

test("R3-c THE FILL METER — placement, form, label, hue, growth", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);

  const geom = async () =>
    page.evaluate(() => {
      const trace = document.querySelector("path.progress-trace") as SVGPathElement | null;
      const frame = document.querySelector("path.frame-line") as SVGPathElement | null;
      const svg = document.querySelector("svg.hand-drawn-grid") as SVGSVGElement | null;
      const bar = document.querySelector('[role="progressbar"]') as HTMLElement | null;
      const paper = document.querySelector(".board-paper, .board-card, .game-board") as HTMLElement | null;
      const scale = svg ? svg.getBoundingClientRect().width / (svg.viewBox.baseVal.width || 1) : 0;
      const cs = trace ? getComputedStyle(trace) : null;
      const r3 = (v: number) => Math.round(v * 1000) / 1000;
      return {
        traceMounted: !!trace,
        traceNodes: document.querySelectorAll("path.progress-trace").length,
        strokeWidthUser: cs ? parseFloat(cs.strokeWidth) : null,
        strokeWidthPx: cs ? r3(parseFloat(cs.strokeWidth) * scale) : null,
        stroke: cs?.stroke ?? null,
        strokeOpacity: cs?.strokeOpacity ?? null,
        dashOffset: cs?.strokeDashoffset ?? null,
        traceBox: trace ? (() => { const b = trace.getBBox(); return [r3(b.x), r3(b.y), r3(b.width), r3(b.height)]; })() : null,
        frameBox: frame ? (() => { const b = frame.getBBox(); return [r3(b.x), r3(b.y), r3(b.width), r3(b.height)]; })() : null,
        svgRect: svg ? (() => { const b = svg.getBoundingClientRect(); return [r3(b.x), r3(b.y), r3(b.width), r3(b.height)]; })() : null,
        paperRect: paper ? (() => { const b = paper.getBoundingClientRect(); return [r3(b.x), r3(b.y), r3(b.width), r3(b.height)]; })() : null,
        scale: r3(scale),
        bar: bar
          ? {
              role: bar.getAttribute("role"),
              label: bar.getAttribute("aria-label"),
              now: bar.getAttribute("aria-valuenow"),
              valuetext: bar.getAttribute("aria-valuetext"),
              visibleBox: (() => { const b = bar.getBoundingClientRect(); return [r3(b.width), r3(b.height)]; })(),
              visibleText: (bar.textContent || "").trim(),
            }
          : null,
        // Is any VISIBLE text anywhere on the page that names this meter?
        visibleLabelCandidates: Array.from(document.querySelectorAll("body *"))
          .filter((n) => {
            const t = (n.textContent || "").trim().toLowerCase();
            return (
              n.children.length === 0 &&
              /\bfill(ed)?\b|\bprogress\b|\b\d{1,3}\s?%/.test(t) &&
              (n as HTMLElement).getBoundingClientRect().width > 0
            );
          })
          .map((n) => `${n.tagName.toLowerCase()}.${(n.getAttribute("class") || "").split(/\s+/)[0]}: ${(n.textContent || "").trim().slice(0, 40)}`),
      };
    });

  const before = await geom();

  // Type one digit into the first empty cell and re-read — the growth per keystroke.
  const typed = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll(".game-cell input")) as HTMLInputElement[];
    const empty = inputs.find((i) => !i.value);
    if (!empty) return null;
    empty.focus();
    return true;
  });
  if (typed) {
    await page.keyboard.press("1");
    await page.waitForTimeout(500);
  }
  const after = await geom();

  // Where the violet sits relative to the paper edge — the "straddle" the owner sees.
  const straddle = await page.evaluate(() => {
    const trace = document.querySelector("path.progress-trace") as SVGPathElement | null;
    const svg = document.querySelector("svg.hand-drawn-grid") as SVGSVGElement | null;
    const paper = document.querySelector(".board-paper, .board-card, .game-board") as HTMLElement | null;
    if (!trace || !svg) return null;
    const scale = svg.getBoundingClientRect().width / (svg.viewBox.baseVal.width || 1);
    const sr = svg.getBoundingClientRect();
    const b = trace.getBBox();
    const w = parseFloat(getComputedStyle(trace).strokeWidth);
    const r2 = (v: number) => Math.round(v * 100) / 100;
    const pr = paper?.getBoundingClientRect();
    return {
      // the trace's INK band, in page px, on each side of the board svg's own box
      topInkPx: [r2(sr.y + (b.y - w / 2) * scale), r2(sr.y + (b.y + w / 2) * scale)],
      leftInkPx: [r2(sr.x + (b.x - w / 2) * scale), r2(sr.x + (b.x + w / 2) * scale)],
      svgBoxPx: [r2(sr.x), r2(sr.y), r2(sr.width), r2(sr.height)],
      paperBoxPx: pr ? [r2(pr.x), r2(pr.y), r2(pr.width), r2(pr.height)] : null,
      paperCls: paper?.className?.toString().slice(0, 40) ?? null,
    };
  });

  const report = { engine: browserName, before, after, straddle };
  bank(`fillmeter-${browserName}.json`, report);
  console.log("FILLMETER " + JSON.stringify(report));
  expect(before.bar, "the fill meter must publish a progressbar").not.toBeNull();
});

test("R3-d THE HINT NOTE — what retracts it, and what does not", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });

  const note = () =>
    page.evaluate(() => {
      const n = document.querySelector(".margin-note");
      const ink = document.querySelector(".margin-note-ink");
      if (!n) return null;
      const cs = getComputedStyle(n);
      const ics = ink ? getComputedStyle(ink) : null;
      const r = (ink ?? n).getBoundingClientRect();
      return {
        text: (n.textContent || "").replace(/\s+/g, " ").trim(),
        tone: (n.getAttribute("class") || "").replace("margin-note", "").trim(),
        opacity: cs.opacity,
        inkOpacity: ics?.opacity ?? null,
        visible: r.width > 0 && r.height > 0,
        quiet: !!document.querySelector(".margin-note-block.is-quiet"),
        role: n.getAttribute("role"),
        ariaLive: n.getAttribute("aria-live"),
      };
    });

  /** Arm the hint: focus an empty cell, press H once (the first press NAMES, the second inks). */
  async function armHint() {
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll(".game-cell input")) as HTMLInputElement[];
      const empty = inputs.find((i) => !i.value);
      empty?.focus();
    });
    await page.keyboard.press("h");
    await page.waitForTimeout(900);
    return note();
  }

  const acts: { act: string; note: unknown; armed?: unknown }[] = [];

  // Each act gets a FRESH arm, so one act's retraction never masks the next's.
  const sequence: [string, () => Promise<void>][] = [
    ["wait 30s (does it age out?)", async () => { await page.waitForTimeout(30000); }],
    ["arrow to another cell", async () => { await page.keyboard.press("ArrowRight"); await page.waitForTimeout(400); }],
    ["type a digit", async () => { await page.keyboard.press("5"); await page.waitForTimeout(600); }],
    ["undo (Meta+z)", async () => { await page.keyboard.press("Meta+z"); await page.waitForTimeout(700); }],
    ["toggle dark mode", async () => { await page.locator("button.sun-moon-toggle").first().click({ timeout: 5000 }).catch(() => {}); await page.waitForTimeout(900); }],
    ["press P (pencil mode)", async () => { await page.keyboard.press("p"); await page.waitForTimeout(500); }],
    ["hold K (engine peek)", async () => { await page.keyboard.down("k"); await page.waitForTimeout(600); await page.keyboard.up("k"); await page.waitForTimeout(400); }],
    ["blur the board (click the masthead)", async () => { await page.locator("body").click({ position: { x: 5, y: 5 } }).catch(() => {}); await page.waitForTimeout(500); }],
    ["scroll the page", async () => { await page.mouse.wheel(0, 600).catch(() => {}); await page.waitForTimeout(400); }],
    ["reload-free navigation: open the gallery (Escape)", async () => { await page.keyboard.press("Escape"); await page.waitForTimeout(800); }],
  ];

  for (const [name, act] of sequence) {
    await boardReady(page);
    const armed = await armHint();
    await act();
    const after = await note();
    acts.push({ act: name, armed, note: after });
  }

  const report = { engine: browserName, acts };
  bank(`hintnote-${browserName}.json`, report);
  console.log("HINTNOTE " + JSON.stringify(report));
  expect(acts.length).toBe(sequence.length);
});
