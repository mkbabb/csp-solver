/**
 * acc-six-proto.probe.ts — ACC-SIX pass 1, THE PROTOTYPE measured on the real surface.
 *
 * The research probe measured HEAD and two OVERLAYS. This one measures the patch itself:
 * a worktree carrying plan steps 1-8, served by its own vite on 127.0.0.1:4241. There is no
 * overlay here — every number is the product's own bytes.
 *
 * Rows, in the order the family's gates are written:
 *   A  kinship under the SIX-anchor ruling (KIN_DEG 5), light and dark, both engines.
 *   B  the pixel census: off-WARM (R2's band verbatim) AND off-ANCHOR (six anchors, 15°).
 *   C  the four 1.4.11 ratios on painted bytes + the painted focus ring + the digit.
 *   D  the meter's symmetry, the count tape's box, its literal, its lifecycle, masthead.
 *   E  print + forced colours on the trace.
 *   F  the armed confirm's destructive verb, both engines, with a subject-count guard.
 *   G  the sparkle glow names a token — 5 runs, token parsed from the live sheet.
 *   H  the filter census (budget 9) and the ring's wobble geometry (unmoved).
 *   I  the crops.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { rgbToOklch, hueDist, parseCss, ratio } from "./oklch";

const BASE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/ACC-SIX";
const OUT = join(BASE, "census");
const FRAMES = join(BASE, "frames");
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });

const KIN_DEG = 5;
const CHROMA_FLOOR = 0.012; // R2's floor, unchanged
const WARM = [40, 115]; // R2's declared house warm band, unchanged
const ANCHOR_ARC = 15; // R2's stated paint arc for a hue-locked ink
const SOLO = "./?size=3&difficulty=EASY";

/** The SIX anchors of the ruling: five crayons + the answer. */
const ANCHORS = [
  "--color-crayon-green",
  "--color-crayon-orange",
  "--color-crayon-rose",
  "--color-crayon-blue",
  "--color-crayon-gold",
  "--color-answer-deep",
];

const ACCENTS: { job: string; token: string; except?: string }[] = [
  { job: "authorship — the digit you write", token: "--color-user-ink" },
  { job: "authorship — your ink, named", token: "--color-blue-ink" },
  { job: "focus — the keyboard ring", token: "--color-blue-ink" },
  { job: "progress — the fill meter", token: "--color-progress-ink" },
  { job: "danger — conflicts, refusals", token: "--color-teacher-red" },
  { job: "danger — the verdict's words", token: "--color-red-ink" },
  { job: "celebration — the solved frame", token: "--color-gold-star" },
  { job: "celebration — the verdict's words", token: "--color-gold-ink" },
  { job: "difficulty — easy", token: "--color-green-ink" },
  { job: "difficulty — medium", token: "--color-orange-ink" },
  { job: "selection — the unit wash", token: "--color-crayon-blue" },
  { job: "answer — the pale rung", token: "--color-answer-pale" },
  { job: "answer — the mid rung", token: "--color-answer-mid" },
  { job: "answer — the deep rung", token: "--color-answer-deep" },
  // The rainbow keeps its exception; stop 2 is now the sixth anchor and pays no toll.
  { job: "answer — solver stop 1", token: "--color-solver-ink-1", except: "discriminability" },
  { job: "answer — solver stop 2", token: "--color-solver-ink-2" },
  { job: "answer — solver stop 3", token: "--color-solver-ink-3", except: "discriminability" },
  { job: "answer — solver stop 4", token: "--color-solver-ink-4", except: "discriminability" },
  { job: "answer — solver stop 5", token: "--color-solver-ink-5", except: "discriminability" },
];

async function boot(page: Page) {
  await page.goto(SOLO);
  await page.waitForSelector(".sudoku-cell", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(900);
}

async function resolve(page: Page, names: string[]): Promise<Record<string, string>> {
  return page.evaluate((ns: string[]) => {
    const probe = document.createElement("div");
    probe.style.position = "fixed";
    probe.style.left = "-9999px";
    document.body.appendChild(probe);
    const out: Record<string, string> = {};
    for (const n of ns) {
      probe.style.setProperty("color", "");
      probe.style.setProperty("color", `var(${n})`);
      out[n] = getComputedStyle(probe).color;
    }
    probe.remove();
    return out;
  }, names);
}

/** Write into the nth WRITABLE cell — the arrow walk lands on givens, which are readonly,
 *  so a keystroke walk silently writes nothing on some deals. This addresses cells by index. */
async function writeNth(page: Page) {
  // TRAP, measured: `input.readOnly` is FALSE on every cell — a GIVEN is refused by the model
  // (T9-W1 §1.1), not by the DOM. So "the nth non-readonly input" addresses givens and writes
  // nothing. The writable cell is the EMPTY one, and it is re-found after every write.
  await page.evaluate(() => {
    const el = Array.from(
      document.querySelectorAll<HTMLInputElement>(".sudoku-cell input"),
    ).find((i) => !i.value);
    if (!el) return;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    setter.call(el, "1");
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForTimeout(300);
}

/** Type n digits into consecutive writable cells — one keystroke per fill event. */
async function fillPartly(page: Page, n = 12) {
  for (let i = 0; i < n; i++) await writeNth(page);
  await page.waitForTimeout(500);
}

interface Px {
  r: number;
  g: number;
  b: number;
}

async function rawOf(
  page: Page,
  clip?: { x: number; y: number; width: number; height: number },
) {
  const buf = await page.screenshot({ clip });
  const img = sharp(buf).raw().ensureAlpha();
  const { data, info } = await img.toBuffer({ resolveWithObject: true });
  return { data, info };
}

test.describe("§ACC-SIX proto", () => {
  for (const scheme of ["light", "dark"] as const) {
    test(`A+B+C — kinship, census and the painted ratios (${scheme})`, async ({
      page,
      browserName,
    }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await boot(page);

      // ── A. kinship under the six-anchor ruling ─────────────────────────────
      const names = [
        ...new Set([
          ...ANCHORS,
          ...ACCENTS.map((a) => a.token),
          "--color-card",
          "--color-background",
          "--grid-line-color",
          "--color-focus-sketch",
        ]),
      ];
      const vals = await resolve(page, names);
      const anchors = ANCHORS.map((a) => {
        const p = parseCss(vals[a])!;
        return { name: a.replace("--color-", ""), ...rgbToOklch(p.r, p.g, p.b) };
      });
      const rows = ACCENTS.map((a) => {
        const p = parseCss(vals[a.token])!;
        const o = rgbToOklch(p.r, p.g, p.b);
        let best = "";
        let bd = 999;
        for (const an of anchors) {
          const d = hueDist(o.h, an.h);
          if (d < bd) {
            bd = d;
            best = an.name;
          }
        }
        return {
          ...a,
          rgb: vals[a.token],
          h: +o.h.toFixed(1),
          C: +o.C.toFixed(3),
          L: +o.L.toFixed(3),
          nearest: best,
          hueDist: +bd.toFixed(1),
          kin: bd <= KIN_DEG,
        };
      });
      const offFamily = rows.filter((r) => !r.kin && !r.except);

      // the deleted token: undeclared custom properties come back as the EMPTY STRING from
      // getPropertyValue (resolving `var(--x)` into `color` instead falls back to the
      // inherited colour and lies GREEN-looking). Read both, and read the served sheet too.
      const focusSketch = await page.evaluate(() => {
        const root = getComputedStyle(document.documentElement).getPropertyValue(
          "--color-focus-sketch",
        );
        let inSheets = false;
        for (const sh of Array.from(document.styleSheets)) {
          let rules: CSSRuleList | null = null;
          try {
            rules = sh.cssRules;
          } catch {
            continue;
          }
          for (const r of Array.from(rules ?? [])) {
            if (r.cssText.includes("--color-focus-sketch")) inSheets = true;
          }
        }
        return { rootValue: root.trim(), inSheets };
      });
      const focusSketchGone = focusSketch.rootValue === "" && !focusSketch.inSheets;

      // ── B. the census ──────────────────────────────────────────────────────
      const circ = (a: number, b: number) => hueDist(a, b);
      const census = async (label: string) => {
        const { data, info } = await rawOf(page);
        const bins = new Array(36).fill(0);
        let chromatic = 0,
          warm = 0,
          kin = 0,
          violet = 0,
          blue = 0;
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
          label,
          width: info.width,
          height: info.height,
          total,
          chromatic,
          chromaticShare: +(chromatic / total).toFixed(5),
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

      const empty = page.locator(".sudoku-cell input:not([readonly])").first();
      await empty.focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(450);
      const focused = await census("cell-focused");

      // ── C1. the RING, on painted bytes ────────────────────────────────────
      const cellBox = await page.evaluate(() => {
        const el = document.querySelector(
          ".game-cell:has(input:focus-visible)",
        ) as HTMLElement | null;
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      });
      let ringPainted: { core: Px | null; ground: Px | null; ratio: number | null } = {
        core: null,
        ground: null,
        ratio: null,
      };
      if (cellBox) {
        const pad = 6;
        const { data, info } = await rawOf(page, {
          x: Math.max(0, Math.floor(cellBox.x - pad)),
          y: Math.max(0, Math.floor(cellBox.y - pad)),
          width: Math.ceil(cellBox.width + pad * 2),
          height: Math.ceil(cellBox.height + pad * 2),
        });
        // TWO readings, because one number was hiding a confound: the ring crosses BOTH the
        // card paper and the graphite grid line, and "the most chromatic blue pixel" is the
        // one over graphite — a darker composite that flatters the ratio. `overPaper` is the
        // ring as the reader meets it on paper (the claim); `worst` keeps the extreme.
        const blues: { px: Px; L: number }[] = [];
        const achroma: Px[] = [];
        for (let i = 0; i < data.length; i += info.channels) {
          const px = { r: data[i], g: data[i + 1], b: data[i + 2] };
          const o = rgbToOklch(px.r, px.g, px.b);
          if (o.h > 235 && o.h < 268 && o.C > 0.05) blues.push({ px, L: o.L });
          if (o.C < 0.02) achroma.push(px);
        }
        blues.sort((a, b) => a.L - b.L);
        // THE RING'S COMPOSITE IS THE MODE, not an extreme. A percentile reads an
        // antialiased edge pixel at one end and the ring-over-graphite crossing at the
        // other; the ring's actual body is a long run of one identical value, so the most
        // FREQUENT blue pixel is the thing a reader sees. The extremes are kept beside it.
        const tally = new Map<string, { px: Px; n: number }>();
        for (const b of blues) {
          const k = `${b.px.r},${b.px.g},${b.px.b}`;
          const e = tally.get(k);
          if (e) e.n++;
          else tally.set(k, { px: b.px, n: 1 });
        }
        const modal = [...tally.values()].sort((a, b) => b.n - a.n)[0] ?? null;
        const overPaper = modal?.px ?? null;
        const worst = blues.length
          ? blues[Math.floor(blues.length * (scheme === "light" ? 0.02 : 0.98))].px
          : null;
        const ground = achroma.length
          ? achroma.sort((a, b) => (scheme === "light" ? b.r - a.r : a.r - b.r))[
              Math.floor(achroma.length * 0.1)
            ]
          : null;
        ringPainted = {
          core: overPaper,
          ground,
          ratio: overPaper && ground ? +ratio(overPaper, ground).toFixed(2) : null,
          worstOverGraphite: worst && ground ? +ratio(worst, ground).toFixed(2) : null,
          bluePixels: blues.length,
          modalCount: modal?.n ?? 0,
        } as typeof ringPainted;
      }

      // ── C2. the TRACE, on painted bytes (a partly-written board) ──────────
      await fillPartly(page, 12);
      const mid = await census("mid-board-12");
      // THE HEAD-COMPARABLE READING. R2's own `mid` is a FULL board — every writable cell
      // written, progress 100 by construction — because a keystroke walk reaches a different
      // number of cells on every deal and the census then moves with the fill, not the arm.
      const fillControl = await page.evaluate(() => {
        const inputs = Array.from(
          document.querySelectorAll<HTMLInputElement>(".sudoku-cell input"),
        ).filter((i) => !i.readOnly);
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
        let n = 0;
        for (const i of inputs) {
          if (!i.value) {
            setter.call(i, "1");
            i.dispatchEvent(new Event("input", { bubbles: true }));
            n++;
          }
        }
        return { writable: inputs.length, wrote: n };
      });
      await page.waitForTimeout(1200);
      const full = await census("full-board");
      const boardBox = await page.evaluate(() => {
        const el = document.querySelector("svg.hand-drawn-grid") as SVGElement | null;
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      });
      let tracePainted: Record<string, unknown> = { found: false };
      if (boardBox) {
        const pad = 14;
        const { data, info } = await rawOf(page, {
          x: Math.max(0, Math.floor(boardBox.x - pad)),
          y: Math.max(0, Math.floor(boardBox.y - pad)),
          width: Math.ceil(boardBox.width + pad * 2),
          height: Math.ceil(boardBox.height + pad * 2),
        });
        let core: Px | null = null,
          bestC = 0;
        const frameCands: { px: Px; L: number }[] = [];
        const cardCands: { px: Px; L: number }[] = [];
        for (let y = 0; y < info.height; y++) {
          for (let x = 0; x < info.width; x++) {
            const i = (y * info.width + x) * info.channels;
            const px = { r: data[i], g: data[i + 1], b: data[i + 2] };
            const o = rgbToOklch(px.r, px.g, px.b);
            if (o.h > 270 && o.h < 320 && o.C > bestC) {
              bestC = o.C;
              core = px;
            }
            const nearEdge =
              x < 22 || y < 22 || x > info.width - 22 || y > info.height - 22;
            if (o.C < 0.03 && nearEdge) frameCands.push({ px, L: o.L });
            if (
              o.C < 0.03 &&
              !nearEdge &&
              x > 60 &&
              y > 60 &&
              x < info.width - 60 &&
              y < info.height - 60
            )
              cardCands.push({ px, L: o.L });
          }
        }
        frameCands.sort((a, b) => a.L - b.L);
        const frame =
          scheme === "light"
            ? frameCands[Math.floor(frameCands.length * 0.002)]
            : frameCands[Math.floor(frameCands.length * 0.998)];
        cardCands.sort((a, b) => a.L - b.L);
        const card = cardCands[Math.floor(cardCands.length * (scheme === "light" ? 0.9 : 0.1))];
        tracePainted = {
          found: !!core,
          core,
          coreOklch: core
            ? (() => {
                const o = rgbToOklch(core!.r, core!.g, core!.b);
                return { L: +o.L.toFixed(4), C: +o.C.toFixed(4), h: +o.h.toFixed(1) };
              })()
            : null,
          frameLine: frame?.px ?? null,
          cardGround: card?.px ?? null,
          ratioTraceOverFrame: core && frame ? +ratio(core, frame.px).toFixed(2) : null,
          ratioTraceOverCard: core && card ? +ratio(core, card.px).toFixed(2) : null,
        };
      }

      // ── C3. the DIGIT as text, and the arithmetic witnesses ───────────────
      const cD = parseCss(vals["--color-card"])!;
      const bG = parseCss(vals["--color-background"])!;
      const gL = parseCss(vals["--grid-line-color"])!;
      const blend = (a: Px, al: number, g: Px) => ({
        r: a.r * al + g.r * (1 - al),
        g: a.g * al + g.g * (1 - al),
        b: a.b * al + g.b * (1 - al),
      });
      const ui = parseCss(vals["--color-user-ink"])!;
      const bi = parseCss(vals["--color-blue-ink"])!;
      const pI = parseCss(vals["--color-progress-ink"])!;
      const arithmetic = {
        "trace @0.95 over grid-line": +ratio(blend(pI, 0.95, gL), gL).toFixed(2),
        "trace @0.95 over card": +ratio(blend(pI, 0.95, cD), cD).toFixed(2),
        "focus ring @0.9 over card": +ratio(blend(bi, 0.9, cD), cD).toFixed(2),
        "digit over card": +ratio(ui, cD).toFixed(2),
        "digit over background": +ratio(ui, bG).toFixed(2),
      };

      writeFileSync(
        join(OUT, `surfaces-proto-${browserName}-${scheme}.json`),
        JSON.stringify(
          {
            engine: browserName,
            scheme,
            KIN_DEG,
            anchors,
            kinshipRows: rows,
            offFamily,
            focusSketchGone,
            focusSketch,
            census: { rest, focused, mid, full },
            fillControl,
            ringPainted,
            tracePainted,
            arithmetic,
            tokens: vals,
          },
          null,
          2,
        ),
      );
      expect(rest.chromatic, "the census must have a subject").toBeGreaterThan(1000);
    });
  }

  // ── D. the meter, the tape, the masthead ────────────────────────────────────
  for (const vp of [
    { name: "desk-1280x800", width: 1280, height: 800, dpr: 1 },
    { name: "phone-393x699", width: 393, height: 699, dpr: 3 },
    { name: "short-900x450", width: 900, height: 450, dpr: 1 },
  ]) {
    test(`D — the meter and the count tape (${vp.name})`, async ({ page, browserName }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
      await boot(page);

      const atZero = await page.evaluate(() => ({
        traceNodes: document.querySelectorAll(".progress-trace").length,
        tapeNodes: document.querySelectorAll(".count-tape").length,
        valuenow: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow") ?? null,
        valuemax: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuemax") ?? null,
        valuetext: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuetext") ?? null,
        label: document.querySelector('[role="progressbar"]')?.getAttribute("aria-label") ?? null,
      }));

      const readTape = () =>
        page.evaluate(() => {
          const svg = document.querySelector("svg.hand-drawn-grid") as SVGGraphicsElement | null;
          const tapeEl = document.querySelector(".count-tape") as HTMLElement | null;
          const bar = document.querySelector('[role="progressbar"]');
          const mast = document.querySelector(".masthead") as HTMLElement | null;
          if (!svg) return null;
          const box = svg.getBoundingClientRect();
          const t = tapeEl?.getBoundingClientRect() ?? null;
          const m = mast?.getBoundingClientRect() ?? null;
          const overlap =
            t && m
              ? Math.max(0, Math.min(t.right, m.right) - Math.max(t.left, m.left)) *
                Math.max(0, Math.min(t.bottom, m.bottom) - Math.max(t.top, m.top))
              : 0;
          const cs = tapeEl ? getComputedStyle(tapeEl) : null;
          const mcs = mast ? getComputedStyle(mast) : null;
          return {
            board: {
              x: +box.x.toFixed(2),
              y: +box.y.toFixed(2),
              w: +box.width.toFixed(2),
              h: +box.height.toFixed(2),
              squareDelta: +(box.height - box.width).toFixed(2),
            },
            masthead: m
              ? {
                  x: +m.x.toFixed(2),
                  y: +m.y.toFixed(2),
                  w: +m.width.toFixed(2),
                  h: +m.height.toFixed(2),
                  bottom: +m.bottom.toFixed(2),
                  zIndex: mcs!.zIndex,
                  background: mcs!.backgroundColor,
                  pointerEvents: mcs!.pointerEvents,
                }
              : null,
            tape: t
              ? {
                  x: +t.x.toFixed(2),
                  y: +t.y.toFixed(2),
                  w: +t.width.toFixed(2),
                  h: +t.height.toFixed(2),
                  text: (tapeEl!.textContent ?? "").trim(),
                  opacity: cs!.opacity,
                  fontSize: cs!.fontSize,
                  fontFamily: cs!.fontFamily.split(",")[0],
                  color: cs!.color,
                  background: cs!.backgroundColor,
                  zIndex: cs!.zIndex,
                  ariaHidden: tapeEl!.getAttribute("aria-hidden"),
                  leftInsetFromBoard: +(t.x - box.x).toFixed(2),
                  topRelBoard: +(t.y - box.y).toFixed(2),
                  aboveBoardTop: t.top < box.y,
                  inLeftQuarter: t.x - box.x < box.width * 0.25,
                  shareOfBoard: +(t.width / box.width).toFixed(3),
                }
              : null,
            mastheadOverlapPx2: +overlap.toFixed(2),
            valuetext: bar?.getAttribute("aria-valuetext") ?? null,
            sameLiteral: t ? (tapeEl!.textContent ?? "").trim() === bar?.getAttribute("aria-valuetext") : null,
          };
        });

      // fill 1 — the tape is laid down
      await writeNth(page);
      const atOne = await readTape();
      // IS THERE INK UNDER THE TAPE? The box-intersection with `.masthead` is a rectangle
      // test, and `.masthead`'s box is a transparent band whose own ink sits well above its
      // bottom edge. What a reader can actually collide with is PAINT, so this hides the tape
      // and reads the pixels its box covered: a uniform field is empty paper.
      const inkUnder = await (async () => {
        const rect = await page.evaluate(() => {
          const t = document.querySelector(".count-tape") as HTMLElement | null;
          if (!t) return null;
          const r = t.getBoundingClientRect();
          t.style.visibility = "hidden";
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        });
        if (!rect) return null;
        const { data, info } = await rawOf(page, {
          x: Math.max(0, Math.floor(rect.x)),
          y: Math.max(0, Math.floor(rect.y)),
          width: Math.max(1, Math.ceil(rect.width)),
          height: Math.max(1, Math.ceil(rect.height)),
        });
        await page.evaluate(() => {
          const t = document.querySelector(".count-tape") as HTMLElement | null;
          if (t) t.style.visibility = "";
        });
        const counts = new Map<string, number>();
        for (let i = 0; i < data.length; i += info.channels) {
          const k = `${data[i]},${data[i + 1]},${data[i + 2]}`;
          counts.set(k, (counts.get(k) ?? 0) + 1);
        }
        const total = info.width * info.height;
        const [modeKey, modeN] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
        const mode = modeKey.split(",").map(Number);
        let differing = 0;
        for (let i = 0; i < data.length; i += info.channels) {
          if (
            Math.abs(data[i] - mode[0]) > 6 ||
            Math.abs(data[i + 1] - mode[1]) > 6 ||
            Math.abs(data[i + 2] - mode[2]) > 6
          )
            differing++;
        }
        return {
          box: rect,
          total,
          modalColor: `rgb(${mode.join(", ")})`,
          modalShare: +(modeN / total).toFixed(4),
          inkedPixels: differing,
          inkedShare: +(differing / total).toFixed(4),
        };
      })();

      // fills 2 and 3 — the count updates in place
      await writeNth(page);
      const atTwo = await readTape();
      await writeNth(page);
      const atThree = await readTape();
      // fill 4, then the rest window + the lift
      await writeNth(page);
      const atFourImmediate = await readTape();
      await page.waitForTimeout(3200);
      const afterRest = await readTape();

      // the meter's geometry, at the 4-cell fill
      const geom = await page.evaluate(() => {
        const svg = document.querySelector("svg.hand-drawn-grid") as SVGGraphicsElement | null;
        if (!svg) return null;
        const box = svg.getBoundingClientRect();
        const paths = Array.from(document.querySelectorAll<SVGPathElement>(".progress-trace"));
        const active =
          paths.find((p) => (p.parentElement as HTMLElement)?.classList.contains("is-active")) ??
          paths[0];
        if (!active) return { box, trace: null };
        const tb = active.getBoundingClientRect();
        const cs = getComputedStyle(active);
        const scale = box.width / 1000;
        const overhang = {
          top: +(box.y - tb.y).toFixed(2),
          left: +(box.x - tb.x).toFixed(2),
          right: +(tb.x + tb.width - (box.x + box.width)).toFixed(2),
          bottom: +(tb.y + tb.height - (box.y + box.height)).toFixed(2),
        };
        return {
          box: { x: +box.x.toFixed(2), y: +box.y.toFixed(2), w: +box.width.toFixed(2) },
          trace: { x: +tb.x.toFixed(2), y: +tb.y.toFixed(2), w: +tb.width.toFixed(2), h: +tb.height.toFixed(2) },
          stroke: cs.stroke,
          strokeOpacity: cs.strokeOpacity,
          strokeCssPx: +(parseFloat(cs.strokeWidth) * scale).toFixed(3),
          transition: cs.transitionProperty + " / " + cs.transitionDuration + " / " + cs.transitionTimingFunction,
          scale: +scale.toFixed(4),
          overhang,
          symmetry: +Math.abs(Math.abs(overhang.top) - Math.abs(overhang.left)).toFixed(2),
        };
      });

      writeFileSync(
        join(OUT, `meter-tape-proto-${browserName}-${vp.name}.json`),
        JSON.stringify(
          { engine: browserName, viewport: vp, atZero, atOne, atTwo, atThree, atFourImmediate, afterRest, geom, inkUnder },
          null,
          2,
        ),
      );
      expect(geom, "the meter must be on the page").not.toBeNull();
    });
  }

  // ── E. print + forced colours ───────────────────────────────────────────────
  test("E — the trace under print and forced colours", async ({ page, browserName }) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await boot(page);
    await fillPartly(page, 4);

    const read = async () =>
      page.evaluate(() => {
        const glyph = document.querySelector(".sudoku-cell .glyph-svg path");
        const line = document.querySelector(".grid-line");
        const trace = document.querySelector(".progress-trace");
        return {
          glyphStroke: glyph ? getComputedStyle(glyph).stroke : null,
          gridLineStroke: line ? getComputedStyle(line).stroke : null,
          traceStroke: trace ? getComputedStyle(trace).stroke : null,
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

    writeFileSync(
      join(OUT, `print-forced-proto-${browserName}.json`),
      JSON.stringify({ engine: browserName, screen, print, forced }, null, 2),
    );
    expect(print.glyphStroke).toBe("rgb(0, 0, 0)");
  });

  // ── F. the armed confirm ────────────────────────────────────────────────────
  for (const scheme of ["light", "dark"] as const) {
    test(`F — the confirm's destructive verb (${scheme})`, async ({ page, browserName }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await boot(page);
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
      await page.waitForSelector(".gallery-viewport", { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(900);
      await page.locator(".gallery-viewport").press("ArrowRight").catch(() => {});
      await page.locator(".gallery-viewport").press("d").catch(() => {});
      await expect
        .poll(() => page.locator(".guard-leave .guard-face").count(), { timeout: 15000 })
        .toBeGreaterThan(0);
      await page.waitForTimeout(500);

      const guard = await page.evaluate(() => {
        const frame = document.querySelector(".guard-note-frame");
        const leave = document.querySelector(".guard-leave .guard-face");
        const keep = document.querySelector(".guard-btn:not(.guard-leave) .guard-face");
        if (!frame || !leave) return null;
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
          subjects: document.querySelectorAll(".guard-leave .guard-face").length,
          leaveColorDeclared: getComputedStyle(leave).color,
          leaveColor: asRgb(getComputedStyle(leave).color, under),
          leaveBgDeclared: getComputedStyle(leave).backgroundColor,
          leaveGround: asRgb(getComputedStyle(leave).backgroundColor, under),
          pageGround,
          keepColor: keep ? asRgb(getComputedStyle(keep).color, under) : null,
          leaveText: (leave.textContent ?? "").trim(),
          keepText: (keep?.textContent ?? "").trim(),
          leaveStrokeWidth: (() => {
            const o = leave.querySelector("svg *") as SVGElement | null;
            return o ? getComputedStyle(o).strokeWidth : null;
          })(),
        };
      });

      const ratios: Record<string, number | null> = {};
      let verbChroma: number | null = null;
      if (guard?.leaveColor && guard.leaveGround) {
        const ink = parseCss(guard.leaveColor)!;
        const gr = parseCss(guard.leaveGround)!;
        const pg = parseCss(guard.pageGround)!;
        verbChroma = +rgbToOklch(ink.r, ink.g, ink.b).C.toFixed(4);
        ratios["destructive verb on its own 5% ground"] = +ratio(ink, gr).toFixed(2);
        ratios["destructive verb on the card"] = +ratio(ink, pg).toFixed(2);
        const keep = parseCss(guard.keepColor ?? "");
        if (keep) ratios["the keep verb on the card"] = +ratio(keep, pg).toFixed(2);
      }
      writeFileSync(
        join(OUT, `guard-proto-${browserName}-${scheme}.json`),
        JSON.stringify({ engine: browserName, scheme, guard, verbChroma, ratios }, null, 2),
      );
      expect(guard, `the guard must be armed (${browserName}/${scheme})`).not.toBeNull();
    });
  }

  // ── G. the glow names a token, 5 runs ───────────────────────────────────────
  test("G — the sparkle glow byte-matches its token, 5 runs", async ({ page, browserName }) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    const runs: unknown[] = [];
    for (let i = 0; i < 5; i++) {
      await boot(page);
      const r = await page.evaluate(() => {
        const el = document.querySelector(".sparkle-icon") as HTMLElement | null;
        if (!el) return null;
        const cs = getComputedStyle(el);
        const probe = document.createElement("div");
        probe.style.position = "fixed";
        probe.style.left = "-9999px";
        document.body.appendChild(probe);
        probe.style.setProperty("color", "var(--sparkle-glow-soft)");
        const soft = getComputedStyle(probe).color;
        probe.style.setProperty("color", "var(--sparkle-glow-strong)");
        const strong = getComputedStyle(probe).color;
        probe.style.setProperty("color", "var(--color-answer-pale)");
        const pale = getComputedStyle(probe).color;
        probe.remove();
        const cv = document.createElement("canvas");
        cv.width = cv.height = 1;
        const ctx = cv.getContext("2d")!;
        const dev = (s: string) => {
          ctx.clearRect(0, 0, 1, 1);
          ctx.fillStyle = "rgb(255,255,255)";
          ctx.fillRect(0, 0, 1, 1);
          ctx.fillStyle = s;
          ctx.fillRect(0, 0, 1, 1);
          const d = ctx.getImageData(0, 0, 1, 1).data;
          return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
        };
        const filter = cs.filter;
        const m = /drop-shadow\(([^)]*\)?[^)]*)\)/.exec(filter);
        return {
          filter,
          filterColor: m ? m[1] : null,
          transitionProperty: cs.transitionProperty,
          transitionDuration: cs.transitionDuration,
          tokenSoft: soft,
          tokenStrong: strong,
          tokenPale: pale,
          softOverWhite: dev(soft),
          filterColorOverWhite: m ? dev(m[1].replace(/^0 0 \d+px\s*/, "")) : null,
        };
      });
      runs.push(r);
      await page.waitForTimeout(150);
    }
    writeFileSync(
      join(OUT, `glow-proto-${browserName}.json`),
      JSON.stringify({ engine: browserName, runs }, null, 2),
    );
    expect(runs.filter(Boolean).length, "the sparkle must be on the page").toBe(5);
  });

  // ── H. the filter census and the ring's geometry ────────────────────────────
  test("H — filter census and the ring's wobble geometry", async ({ page, browserName }) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await boot(page);
    const census = await page.evaluate(() => {
      const out: { sel: string; filter: string; area: number }[] = [];
      let union = 0;
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("*"))) {
        const cs = getComputedStyle(el);
        const f = cs.filter;
        if (!f || f === "none") continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        union += r.width * r.height;
        out.push({
          sel: el.tagName.toLowerCase() + (el.className ? "." + String(el.className).split(" ").filter(Boolean).slice(0, 2).join(".") : ""),
          filter: f,
          area: +(r.width * r.height).toFixed(0),
        });
      }
      return { count: out.length, unionArea: +union.toFixed(0), rows: out };
    });

    // the ring's GEOMETRY must be unmoved: hue changed, the wobble did not.
    const cell = page.locator(".sudoku-cell input:not([readonly])").first();
    await cell.focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(400);
    const ring = await page.evaluate(() => {
      const p = document.querySelector(
        ".game-cell:has(input:focus-visible) .cell-ghost-path",
      ) as SVGPathElement | null;
      if (!p) return null;
      const cs = getComputedStyle(p);
      const d = p.getAttribute("d") ?? "";
      const nums = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
      const mean = nums.reduce((a, b) => a + b, 0) / Math.max(1, nums.length);
      const sigma = Math.sqrt(
        nums.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, nums.length),
      );
      return {
        dLength: d.length,
        vertexCount: nums.length,
        sigma: +sigma.toFixed(4),
        stroke: cs.stroke,
        strokeWidth: cs.strokeWidth,
        strokeOpacity: cs.strokeOpacity,
        fill: cs.fill,
        fillOpacity: cs.fillOpacity,
        animation: cs.animationName + " " + cs.animationDuration + " " + cs.animationTimingFunction,
      };
    });

    // the R6 heading census: how many distinct type voices the page's headings speak
    const headings = await page.evaluate(() => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>("h1,h2,h3,h4,h5,h6,.section-heading,.masthead-title"),
      );
      const voices = new Set<string>();
      const rows = els.map((e) => {
        const cs = getComputedStyle(e);
        const v = `${cs.fontFamily.split(",")[0]}|${cs.fontWeight}|${cs.textTransform}`;
        voices.add(v);
        return { tag: e.tagName.toLowerCase(), cls: String(e.className).slice(0, 40), voice: v };
      });
      return { count: els.length, voices: [...voices], rows };
    });

    writeFileSync(
      join(OUT, `budget-ring-heading-proto-${browserName}.json`),
      JSON.stringify({ engine: browserName, census, ring, headings }, null, 2),
    );
    expect(ring, "the focus ring must be armed").not.toBeNull();
  });

  // ── I. the crops ────────────────────────────────────────────────────────────
  for (const scheme of ["light", "dark"] as const) {
    test(`I — crops (${scheme})`, async ({ page, browserName }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "no-preference" });
      await boot(page);
      const corner = async (tag: string) => {
        const box = await page.evaluate(() => {
          const el = document.querySelector("svg.hand-drawn-grid");
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y };
        });
        if (!box) return;
        await page.screenshot({
          path: join(FRAMES, `${tag}-${browserName}-${scheme}.png`),
          clip: {
            x: Math.max(0, box.x - 24),
            y: Math.max(0, box.y - 24),
            width: 330,
            height: 210,
          },
        });
      };
      await writeNth(page);
      await page.waitForTimeout(700);
      await corner("corner-fill1-tape");
      // fills 2,3,4 then the rest window: the tape lifts
      for (let i = 0; i < 3; i++) await writeNth(page);
      await page.waitForTimeout(3200);
      await corner("corner-fill4-lifted");

      // a focused cell with a written digit and the unit wash: focus a WRITTEN cell by
      // keyboard so `:focus-visible` arms (a click leaves the instant graphite tier).
      await page.locator(".sudoku-cell input").first().focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(500);
      const cellBox = await page.evaluate(() => {
        const el = document.querySelector(".game-cell:has(input:focus-visible)") as HTMLElement | null;
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      });
      if (cellBox) {
        await page.screenshot({
          path: join(FRAMES, `focused-cell-${browserName}-${scheme}.png`),
          clip: {
            x: Math.max(0, cellBox.x - 60),
            y: Math.max(0, cellBox.y - 60),
            width: Math.min(260, cellBox.w + 120),
            height: Math.min(200, cellBox.h + 120),
          },
        });
      }
    });
  }

  test("I2 — the phone pose with the tape, and the print/forced crops", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "one engine's crop is the frame; the numbers carry both");
    await page.setViewportSize({ width: 393, height: 699 });
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
    await boot(page);
    await writeNth(page);
    await page.waitForTimeout(700);
    await page.screenshot({ path: join(FRAMES, `phone-tape-${browserName}.png`), fullPage: false });

    // print + forced-colours crops of the corner
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(400);
    const box = await page.evaluate(() => {
      const el = document.querySelector("svg.hand-drawn-grid");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y };
    });
    if (box) {
      await page.emulateMedia({ media: "print" });
      await page.waitForTimeout(300);
      await page.screenshot({
        path: join(FRAMES, `corner-print-${browserName}.png`),
        clip: { x: Math.max(0, box.x - 24), y: Math.max(0, box.y - 24), width: 330, height: 210 },
      });
      await page.emulateMedia({ media: "screen", forcedColors: "active" });
      await page.waitForTimeout(300);
      await page.screenshot({
        path: join(FRAMES, `corner-forced-${browserName}.png`),
        clip: { x: Math.max(0, box.x - 24), y: Math.max(0, box.y - 24), width: 330, height: 210 },
      });
      await page.emulateMedia({ forcedColors: "none" });
    }
  });
});
