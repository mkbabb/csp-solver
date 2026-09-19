/**
 * MRK-ABS pass-1 · §6 — THE GRADED FOCUS LAW, measured from PAINTED BYTES.
 *
 * R3-f's ratios (r0/r3-marks/logs/focus-contrast-*.json) are hex arithmetic over the ancestor
 * chain. This lane's law says a ratio is read from the engine's own pixels, so every number
 * below comes from a screenshot decoded with sharp: the ring's ink is the pixel that CHANGED
 * when the control took focus, and its ground is that same pixel before it did.
 *
 * Arms:
 *   MA-3a  HEAD inventory — what each off-board control paints, both themes, both engines.
 *   MA-3b  THE TOKEN — `2px solid var(--color-focus-sketch)`, `outline-offset: 3px`, applied by
 *          `addStyleTag` to every off-board control (the six bespoke rules overridden, the UA
 *          default replaced), the board's house hand untouched. Ratios re-read from pixels.
 *   MA-3c  FOUR GROUNDS — the token ink over `--color-card` and `--color-background`, light and
 *          dark, from painted patches; plus the dark arm the token lacks today.
 *   MA-3d  THE DECK RING under the token — reach vs the scrollport's air (spoken-gallery §3.7
 *          pins WHOLE: outlineOffset + outlineWidth ≤ air).
 *
 * The overlay writes the token on `:focus` as well as `:focus-visible`: R3 measured that
 * programmatic focus does not match `:focus-visible` on a button in either engine, and a ratio
 * is a property of the two colours, not of the selector that armed them. The LAW proposed for
 * the product is `:focus-visible` only — stated in the record, not measured through here.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const EV =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/MRK-ABS";
const OUT = join(EV, "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

/** The proposed law, as a stylesheet. The board keeps the house hand; everything off it
 *  takes ONE designed rect; the UA default is replaced nowhere-by-default. */
const TOKEN_CSS = `
  /* the token, everywhere off the board. TWO EXEMPTIONS, both measured:
     - .cell-native-input keeps the house hand (the board is where the page is drawn);
     - .gallery-viewport keeps outline:none, because spoken-gallery.spec.ts §3.7 pins exactly
       ONE ring owner and it is the aria-activedescendant card, not the scrollport. A blanket
       [tabindex] token catches the scrollport and reds that spec. */
  :is(button, a, [tabindex]):not(.cell-native-input):not(.gallery-viewport):focus-visible,
  :is(button, a, [tabindex]):not(.cell-native-input):not(.gallery-viewport):focus {
    outline: 2px solid var(--color-focus-sketch) !important;
    outline-offset: 3px !important;
  }
  /* the six bespoke rects, overridden by the token */
  .logo-trigger:focus, .logo-trigger:focus-visible,
  .drawer-tab:focus, .drawer-tab:focus-visible,
  .staging-btn:focus .staging-face, .staging-btn:focus-visible .staging-face,
  .guard-btn:focus .guard-face, .guard-btn:focus-visible .guard-face,
  .gallery-viewport:focus .game-card.is-center,
  .gallery-viewport:focus-visible .game-card.is-center {
    outline: 2px solid var(--color-focus-sketch) !important;
    outline-offset: 3px !important;
  }
  /* the toggle keeps its ornament geometry (54px), takes the token's stroke. ':root' is load
     bearing: the blanket rule above is (0,2,1) and would otherwise out-specify a bare
     '.sun-moon-toggle:focus' (0,2,0), pull the ring to offset 3 and bury it under the art —
     the exact defect T9-W2 §2.4 cured. Measured: the light toggle painted ZERO changed pixels
     before this line was added. */
  :root .sun-moon-toggle:focus, :root .sun-moon-toggle:focus-visible {
    outline: 2px solid var(--color-focus-sketch) !important;
    outline-offset: calc(2px - var(--toggle-bleed, 0px)) !important;
  }
  /* the dark arm the token lacks today */
  html.dark, .dark {
    --color-focus-sketch: #6aabeb;
  }
`;

type RGB = [number, number, number];
const lum = ([r, g, b]: RGB) => {
  const f = (x: number) => {
    const v = x / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a: RGB, b: RGB) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
};

async function raw(buf: Buffer) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
}

/** The ring's ink = the pixel that moved furthest when focus arrived, SEARCHED ONLY IN THE
 *  RING'S OWN ANNULUS — the band between the element's border box and the box grown by
 *  (offset + width + 2). Without that window the strongest change on this product is the washi
 *  tooltip a focused icon button reveals (`SheetWashiLabel.vue:120-122`), and the number comes
 *  back describing a tooltip. Ground = the same pixel before focus. Both from engine bytes. */
async function ringInk(
  before: Buffer,
  after: Buffer,
  annulus: { inner: [number, number, number, number]; outer: [number, number, number, number] },
) {
  const A = await raw(before);
  const B = await raw(after);
  if (A.w !== B.w || A.h !== B.h) return null;
  const [ix0, iy0, ix1, iy1] = annulus.inner;
  const [ox0, oy0, ox1, oy1] = annulus.outer;
  let best = -1;
  let ink: RGB = [0, 0, 0];
  let ground: RGB = [0, 0, 0];
  let changed = 0;
  for (let y = 0; y < A.h; y++) {
    for (let x = 0; x < A.w; x++) {
      const inOuter = x >= ox0 && x <= ox1 && y >= oy0 && y <= oy1;
      const inInner = x > ix0 && x < ix1 && y > iy0 && y < iy1;
      if (!inOuter || inInner) continue;
      const i = y * A.w + x;
      const a: RGB = [A.data[i * A.ch], A.data[i * A.ch + 1], A.data[i * A.ch + 2]];
      const b: RGB = [B.data[i * B.ch], B.data[i * B.ch + 1], B.data[i * B.ch + 2]];
      const d = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
      if (d > 12) changed++;
      if (d > best) {
        best = d;
        ink = b;
        ground = a;
      }
    }
  }
  return { ink, ground, changedPx: changed, ratio: ratio(ink, ground), delta: best };
}

const SUBJECTS: [string, string][] = [
  ["ctrl-btn", ".ctrl-btn"],
  ["icon-btn", ".icon-btn"],
  ["info-btn", ".info-btn"],
  ["drawer-tab", ".drawer-tab"],
  ["logo-trigger", ".logo-trigger"],
  ["sun-moon-toggle", ".sun-moon-toggle"],
  ["attribution-trigger", ".attribution-trigger"],
  ["masthead-link", "footer a, header a"],
];

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForTimeout(1200);
}

async function groundBytes(page: Page) {
  // Two painted patches: the card the controls sit on, and the page ground behind it.
  const probe = await page.evaluate(() => {
    const card = document.querySelector(".controls-card") ?? document.querySelector("[class*='card']");
    const cr = card?.getBoundingClientRect();
    return {
      card: cr ? { x: Math.round(cr.left + 4), y: Math.round(cr.top + 4) } : null,
      bg: { x: 3, y: 3 },
    };
  });
  const out: Record<string, RGB | null> = { card: null, background: null };
  for (const [k, p] of [
    ["card", probe.card],
    ["background", probe.bg],
  ] as const) {
    if (!p) continue;
    const buf = await page.screenshot({ clip: { x: p.x, y: p.y, width: 3, height: 3 } });
    const r = await raw(buf);
    out[k] = [r.data[0], r.data[1], r.data[2]];
  }
  return out;
}

for (const theme of ["light", "dark"] as const) {
  for (const arm of ["head", "token"] as const) {
    test(`MA-3 ${arm.toUpperCase()} · ${theme} — focus ink from painted bytes`, async ({
      page,
      browserName,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      await boardReady(page);
      if (arm === "token") await page.addStyleTag({ content: TOKEN_CSS });
      await page.waitForTimeout(250);

      const grounds = await groundBytes(page);
      const tokenVar = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--color-focus-sketch").trim(),
      );
      const ghostStroke = await page.evaluate(() => {
        const p = document.querySelector(".cell-ghost-path");
        return p ? getComputedStyle(p).stroke : null;
      });

      const rows: unknown[] = [];
      for (const [name, sel] of SUBJECTS) {
        const el = page.locator(sel).first();
        if ((await el.count()) === 0) {
          rows.push({ name, sel, found: 0 });
          continue;
        }
        const box = await el.boundingBox().catch(() => null);
        if (!box) {
          rows.push({ name, sel, found: 1, visible: false });
          continue;
        }
        const M = 60; // enough margin for the toggle's 54px ornament offset
        const clip = {
          x: Math.max(0, box.x - M),
          y: Math.max(0, box.y - M),
          width: Math.min(1280 - Math.max(0, box.x - M), box.width + M * 2),
          height: Math.min(800 - Math.max(0, box.y - M), box.height + M * 2),
        };
        await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
        await page.waitForTimeout(120);
        const before = await page.screenshot({ clip });
        await el.evaluate((n: HTMLElement) => n.focus());
        await page.waitForTimeout(220);
        const after = await page.screenshot({ clip });
        const style = await el.evaluate((n: HTMLElement) => {
          const cs = getComputedStyle(n);
          return {
            outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
            offset: cs.outlineOffset,
            offsetPx: parseFloat(cs.outlineOffset) || 0,
            widthPx: parseFloat(cs.outlineWidth) || 0,
            focusVisible: n.matches(":focus-visible"),
          };
        });
        // The annulus, in clip-local device-independent px (dpr 1 here).
        const bx0 = box.x - clip.x;
        const by0 = box.y - clip.y;
        const reach = style.offsetPx + style.widthPx + 2;
        const ink = await ringInk(before, after, {
          inner: [bx0 + 1, by0 + 1, bx0 + box.width - 1, by0 + box.height - 1],
          outer: [bx0 - reach, by0 - reach, bx0 + box.width + reach, by0 + box.height + reach],
        });
        rows.push({ name, sel, found: 1, ...style, ...(ink ?? {}) });
      }

      // THE HOUSE HAND, same instrument: the board's own ring is drawn INSIDE the cell, so the
      // window is the cell box itself rather than an annulus outside it.
      {
        const cell = page.locator(".game-cell").nth(40);
        const box = await cell.boundingBox().catch(() => null);
        if (box) {
          const clip = { x: box.x - 6, y: box.y - 6, width: box.width + 12, height: box.height + 12 };
          await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
          await page.waitForTimeout(150);
          const before = await page.screenshot({ clip });
          await page.evaluate(() => {
            const i = document.querySelectorAll<HTMLInputElement>(".game-cell input")[40];
            i?.focus();
          });
          await page.keyboard.press("ArrowRight");
          await page.keyboard.press("ArrowLeft");
          await page.waitForTimeout(350);
          const after = await page.screenshot({ clip });
          const ink = await ringInk(before, after, {
            inner: [-1, -1, -1, -1],
            outer: [0, 0, clip.width, clip.height],
          });
          const stroke = await page.evaluate(() => {
            const p = document.querySelector(".game-cell:has(input:focus-visible) .cell-ghost-path");
            if (!p) return null;
            const cs = getComputedStyle(p);
            return { stroke: cs.stroke, strokeWidth: cs.strokeWidth, strokeOpacity: cs.strokeOpacity };
          });
          rows.push({ name: "game-cell (house hand)", sel: ".cell-ghost-path", found: 1, ...(stroke ?? {}), ...(ink ?? {}) });
        }
      }

      const painted = rows.filter((r: any) => (r.changedPx ?? 0) > 6).length;
      const report = {
        engine: browserName,
        theme,
        arm,
        tokenVar,
        ghostStroke,
        grounds,
        tokenOverGrounds: grounds.card && grounds.background
          ? {
              overCard: null as number | null,
              overBackground: null as number | null,
            }
          : null,
        subjectsPainted: painted,
        rows,
      };
      // the token ink, composited by the engine, is the ring's own bytes: take the first row
      // that painted and score it against BOTH grounds.
      const firstInk = (rows.find((r: any) => r.ink) as any)?.ink as RGB | undefined;
      if (firstInk && grounds.card && grounds.background && report.tokenOverGrounds) {
        report.tokenOverGrounds.overCard = ratio(firstInk, grounds.card);
        report.tokenOverGrounds.overBackground = ratio(firstInk, grounds.background);
      }
      bank(`focus-${arm}-${theme}-${browserName}.json`, report);
      console.log(`FOCUS ${arm} ${theme} ${browserName} painted=${painted}`);
      expect(painted, "subject-count guard: at least three controls must paint a ring").toBeGreaterThanOrEqual(3);
    });
  }
}

test("MA-3d THE DECK RING under the token — reach vs air", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("./?view=gallery&size=3&difficulty=EASY");
  await page.waitForSelector(".game-gallery", { timeout: 30000 });
  await page.waitForTimeout(1200);

  const read = async (tag: string) => {
    await page.evaluate(() => document.querySelector<HTMLElement>(".gallery-viewport")?.focus());
    await page.keyboard.press("Home");
    await page.waitForTimeout(900);
    const home = await page.evaluate(() => {
      const vp = document.querySelector<HTMLElement>(".gallery-viewport");
      if (!vp) return null;
      const card = document.getElementById(vp.getAttribute("aria-activedescendant") ?? "");
      if (!card) return null;
      const cs = getComputedStyle(card);
      const reach = parseFloat(cs.outlineOffset) + parseFloat(cs.outlineWidth);
      const c = card.getBoundingClientRect();
      const v = vp.getBoundingClientRect();
      const r1 = (x: number) => Math.round(x * 10) / 10;
      const air = [c.left - v.left, v.right - c.right, c.top - v.top, v.bottom - c.bottom].map(r1);
      return {
        id: card.id,
        viewportOutline: getComputedStyle(vp).outlineStyle,
        outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
        offset: cs.outlineOffset,
        reachPx: r1(reach),
        airPx: air,
        headroomPx: r1(Math.min(...air) - reach),
        whole: Math.min(...air) >= reach,
      };
    });
    return { tag, home };
  };

  const head = await read("head");
  await page.addStyleTag({ content: TOKEN_CSS });
  await page.waitForTimeout(250);
  const token = await read("token");
  bank(`deckring-token-${browserName}.json`, { engine: browserName, head, token });
  console.log("DECKRING " + JSON.stringify({ head, token }));
  expect(head.home, "the deck must publish an active option").not.toBeNull();
});
