import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/**
 * MRK-LIVE pass-3 RESEARCH probe, part 2 — the estate's focus indicators AT HEAD (74a2b5d9),
 * read-only, so the synthesizer knows exactly what the one drawn ring replaces and what the
 * modality sentence in `gameCell.css` is worth.
 *
 *  D. THE MODALITY GATE. `gameCell.css:243` claims "a mouse click keeps the instant graphite
 *     tier and only keyboard focus gets the drawn-on ring"; `:315` claims "tap = no ring, key =
 *     ring". The focus target is an `<input type="text">`. This reads `:focus-visible` after a
 *     real mouse click and after a real tap.
 *  E. THE SIX BESPOKE RULES, computed: what each named stop's ring actually is at HEAD, by
 *     programmatic focus (WebKit's Tab reaches form controls only — R3's instrument fact).
 *
 * Motion declared: none sampled; every read is at rest after the board's own settle.
 */

const OUT = path.join(import.meta.dirname, "../readings");
const bank = (name: string, data: unknown) => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2));
};

async function loadSudoku(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await expect
    .poll(() => page.locator(".sudoku-cell").count(), { timeout: 20000 })
    .toBeGreaterThan(0);
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 20000,
  });
}

test.use({ viewport: { width: 1280, height: 800 } });

test("D · the modality gate on the board cell", async ({ page }, info) => {
  await loadSudoku(page);
  const cell = page.locator(".sudoku-cell").nth(40);
  await cell.click();
  const afterClick = await page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null;
    const c = a?.closest<HTMLElement>(".game-cell");
    const p = c?.querySelector<SVGPathElement>(".cell-ghost-path");
    const cs = p ? getComputedStyle(p) : null;
    return {
      active: a?.tagName.toLowerCase() + "." + (a?.className || "").toString().split(/\s+/)[0],
      focusVisible: !!a?.matches(":focus-visible"),
      strokeOpacity: cs?.strokeOpacity ?? null,
      strokeWidth: cs?.strokeWidth ?? null,
      stroke: cs?.stroke ?? null,
    };
  });
  await page.keyboard.press("ArrowRight");
  const afterKey = await page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null;
    const c = a?.closest<HTMLElement>(".game-cell");
    const p = c?.querySelector<SVGPathElement>(".cell-ghost-path");
    const cs = p ? getComputedStyle(p) : null;
    return {
      focusVisible: !!a?.matches(":focus-visible"),
      strokeOpacity: cs?.strokeOpacity ?? null,
      stroke: cs?.stroke ?? null,
    };
  });
  const out = { afterClick, afterKey };
  bank(`D-modality-${info.project.name}.json`, out);
  console.log(`[${info.project.name}] modality ${JSON.stringify(out)}`);
});

test("E · every named stop's indicator at HEAD, by programmatic focus", async ({
  page,
}, info) => {
  await loadSudoku(page);
  const stops = await page.evaluate(() => {
    const SEL = [
      ".sun-moon-toggle",
      ".logo-trigger",
      ".drawer-tab",
      ".attribution-trigger",
      ".ctrl-btn",
      ".icon-btn",
      ".info-btn",
      "a[href]",
      "input.cell-native-input",
    ];
    const seen: {
      sel: string;
      tag: string;
      outlineStyle: string;
      outlineWidth: string;
      outlineOffset: string;
      outlineColor: string;
      focusVisible: boolean;
      box: { w: number; h: number };
      ringOutset: string;
    }[] = [];
    for (const sel of SEL) {
      const el = document.querySelector<HTMLElement>(sel);
      if (!el) {
        seen.push({
          sel,
          tag: "ABSENT",
          outlineStyle: "",
          outlineWidth: "",
          outlineOffset: "",
          outlineColor: "",
          focusVisible: false,
          box: { w: 0, h: 0 },
          ringOutset: "",
        });
        continue;
      }
      el.focus({ preventScroll: true });
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      seen.push({
        sel,
        tag: el.tagName.toLowerCase(),
        outlineStyle: cs.outlineStyle,
        outlineWidth: cs.outlineWidth,
        outlineOffset: cs.outlineOffset,
        outlineColor: cs.outlineColor,
        focusVisible: el.matches(":focus-visible"),
        box: { w: +r.width.toFixed(2), h: +r.height.toFixed(2) },
        ringOutset: cs.getPropertyValue("--focus-ring-outset").trim(),
      });
    }
    return seen;
  });
  bank(`E-stops-${info.project.name}.json`, stops);
  console.log(
    `[${info.project.name}] stops:\n` +
      stops
        .map(
          (s) =>
            `  ${s.sel} <${s.tag}> ${s.box.w}x${s.box.h} outline=${s.outlineStyle} ${s.outlineWidth} off=${s.outlineOffset} ${s.outlineColor} fv=${s.focusVisible}`,
        )
        .join("\n"),
  );
});
