/**
 * THE GRAFT, MEASURED — PLR-SELF's disclosure isolation, on PLR-SELF's own worktree.
 *
 * PLR-COUNT's #1 pass-1 defect is that its `#mark` slot lands INSIDE `AttributionCard`'s root
 * div, the one carrying `@mouseenter="onHoverEnter"`, so hovering the tally opens the @mbabb
 * card and a press stacks two popovers on one anchor. PLR-SELF's diff moves the four hover
 * handlers one level in, onto a `.attribution-disclosure` div, and hangs the `#mark` slot
 * beside that div as a flex sibling. This asks the two questions that decide whether the graft
 * is the cure:
 *
 *   1. does hovering the mark still open the attribution card?
 *   2. is the card's own pose byte-identical after the handlers moved?
 *
 * Read-only: the worktree is served as it stands (`wf_e58b4764-0fc-46`, port 4243).
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(__dirname, "..", "readings");
const bank = (name: string, engine: string, data: unknown) => {
  fs.writeFileSync(path.join(OUT, `${name}-${engine}.json`), JSON.stringify(data, null, 1));
  console.log(`${name}|${engine}|${JSON.stringify(data)}`);
};
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

const read = (p: Page) =>
  p.evaluate(() => {
    const box = (el: Element | null) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        x: +b.x.toFixed(2),
        y: +b.y.toFixed(2),
        w: +b.width.toFixed(2),
        h: +b.height.toFixed(2),
        opacity: cs.opacity,
        visibility: cs.visibility,
        z: cs.zIndex,
      };
    };
    const vis = (sel: string) =>
      [...document.querySelectorAll(sel)].find((e) => e.getBoundingClientRect().width > 0) ??
      null;
    const trig = vis(".attribution-trigger");
    const mark =
      ([...document.querySelectorAll("button")].find(
        (b) =>
          /player/i.test(b.getAttribute("aria-label") ?? "") &&
          b.getBoundingClientRect().width > 0,
      ) as HTMLElement | undefined) ?? null;
    return {
      card: box(vis(".hover-card")),
      trigger: box(trig),
      triggerExpanded: trig?.getAttribute("aria-expanded") ?? null,
      mark: box(mark ?? null),
      markName: mark?.getAttribute("aria-label") ?? null,
      markExpanded: mark?.getAttribute("aria-expanded") ?? null,
      lobby: box(vis("[data-lobby]")),
      disclosureNode: !!vis(".attribution-disclosure"),
      hoverHandlersOn: (() => {
        // which node is the hover region: the fixed corner, or a child?
        const corner = vis(".corner-left") ?? vis(".mobile-attribution");
        const disc = vis(".attribution-disclosure");
        return {
          cornerIsCorner: !!corner,
          discIsChildOfCorner: !!(corner && disc && corner.contains(disc) && corner !== disc),
          markIsInsideDisc: !!(disc && mark && disc.contains(mark)),
        };
      })(),
    };
  });

test("the graft: hovering the mark, and the card's pose", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto("./?size=3&difficulty=EASY&wire=local");
  await settled(page);
  await page.waitForTimeout(600);

  const rest = await read(page);
  await page.locator(".attribution-trigger:visible").first().hover();
  await page.waitForTimeout(400);
  const hoverTrigger = await read(page);
  await page.mouse.move(640, 700);
  await page.waitForTimeout(500);

  const markSel = 'button[aria-label*="player" i]:visible';
  const hasMark = (await page.locator(markSel).count()) > 0;
  let hoverMark: unknown = null;
  let pressMark: unknown = null;
  if (hasMark) {
    await page.locator(markSel).first().hover();
    await page.waitForTimeout(400);
    hoverMark = await read(page);
    await page.locator(markSel).first().click();
    await page.waitForTimeout(700);
    pressMark = await read(page);
  }
  bank("graft-disclosure", info.project.name, {
    hasMark,
    rest,
    hoverTrigger,
    hoverMark,
    pressMark,
  });
  await ctx.close();
});
