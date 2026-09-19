/**
 * MRK-ABS pass-2 (PROTOTYPE) · G-ABS-4 + G-ABS-5 — THE LAW, computed.
 *
 * G-ABS-4: every tab stop in the product (plus the deck's activedescendant card, which is
 * published rather than focused) computes ONE outline colour per theme, and `outline-style:
 * auto` — the browser's own ring, which is engine-defined and which WebKit paints at 1.78-2.15:1
 * — appears nowhere.
 * G-ABS-5: `.dark` computes a different `--color-focus-sketch` than light (it had no dark arm
 * at HEAD, so the board's own ring read 3.76 there).
 *
 * The walk is programmatic focus, not Tab: WebKit's macOS traversal does not stop on buttons at
 * all, so a Tab walk censuses one engine and lies about the other. Measured on this tree, both
 * engines arm `:focus-visible` on a button under `el.focus()` (`scout.probe.ts`), which is what
 * makes the two censuses comparable.
 *
 * SETTLE: read TWICE — same frame, and after 400ms. `transition-colors` (Tailwind v4) covers
 * `outline-color`, so any control carrying it fades the ring's colour in from `currentColor`
 * over its own duration, and a same-frame read censuses the START of that fade, not the law.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

const TABBABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

async function ready(page: Page, query: string, sel: string) {
  await page.goto("./" + query);
  await page.waitForSelector(sel, { timeout: 60000 });
  await page.waitForTimeout(1300);
}

async function census(page: Page, settleMs: number) {
  return page.evaluate(
    async ({ TABBABLE, settleMs }) => {
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const els = Array.from(document.querySelectorAll<HTMLElement>(TABBABLE)).filter((e) => {
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
      });
      const rows: Record<string, unknown>[] = [];
      for (const el of els) {
        (document.activeElement as HTMLElement)?.blur?.();
        await sleep(30);
        el.focus();
        await sleep(settleMs);
        const cs = getComputedStyle(el);
        // the ring may ride a descendant face (.staging-face / .guard-face)
        const face = el.querySelector<HTMLElement>(".staging-face, .guard-face");
        const fcs = face ? getComputedStyle(face) : null;
        const own = {
          style: cs.outlineStyle,
          color: cs.outlineColor,
          width: cs.outlineWidth,
          offset: cs.outlineOffset,
        };
        const faceRing = fcs
          ? {
              style: fcs.outlineStyle,
              color: fcs.outlineColor,
              width: fcs.outlineWidth,
              offset: fcs.outlineOffset,
            }
          : null;
        const ring = own.style !== "none" ? own : faceRing && faceRing.style !== "none" ? faceRing : own;
        rows.push({
          tag: el.tagName,
          cls: (el.className || "").toString().split(" ").slice(0, 2).join("."),
          focusVisible: el.matches(":focus-visible"),
          ringOn: faceRing && own.style === "none" && faceRing.style !== "none" ? "face" : "self",
          ...ring!,
        });
      }
      (document.activeElement as HTMLElement)?.blur?.();
      return rows;
    },
    { TABBABLE, settleMs },
  );
}

for (const theme of ["light", "dark"] as const) {
  test(`G-ABS-4 one focus colour · ${theme} — the board page`, async ({ page, browserName }) => {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
    await ready(page, "?size=3&difficulty=EASY", '[role="grid"] [role="gridcell"]');

    const sameFrame = await census(page, 0);
    const settled = await census(page, 400);

    const vars = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      return {
        focusSketch: cs.getPropertyValue("--color-focus-sketch").trim(),
        focusRing: cs.getPropertyValue("--focus-ring").trim(),
        focusOffset: cs.getPropertyValue("--focus-offset").trim(),
        dark: document.documentElement.classList.contains("dark"),
      };
    });

    const painted = settled.filter((r) => r.style !== "none");
    const colours = [...new Set(painted.map((r) => r.color as string))];
    const autos = settled.filter((r) => r.style === "auto");
    const sameFrameColours = [
      ...new Set(sameFrame.filter((r) => r.style !== "none").map((r) => r.color as string)),
    ];

    const report = {
      engine: browserName,
      theme,
      vars,
      stops: settled.length,
      paintedStops: painted.length,
      distinctColoursSettled: colours,
      distinctColoursSameFrame: sameFrameColours,
      outlineStyleAuto: autos.length,
      rows: settled,
    };
    bank(`focuslaw-${theme}-${browserName}.json`, report);
    console.log(
      `FOCUSLAW ${theme} ${browserName} stops=${settled.length} painted=${painted.length} colours=${JSON.stringify(colours)} sameFrame=${sameFrameColours.length} auto=${autos.length} var=${vars.focusSketch}`,
    );

    expect(painted.length, "at least three controls must carry a ring").toBeGreaterThanOrEqual(3);
    expect(autos.length, "outline-style:auto must appear nowhere in the tab order").toBe(0);
    expect(colours.length, `one outline colour per theme, got ${JSON.stringify(colours)}`).toBe(1);
  });
}

test("G-ABS-5 the dark arm — .dark computes a different focus ink", async ({
  page,
  browserName,
}) => {
  const read = async (theme: "light" | "dark") => {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
    await ready(page, "?size=3&difficulty=EASY", '[role="grid"] [role="gridcell"]');
    return page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const ghost = document.querySelector(".cell-ghost-path");
      return {
        focusSketch: cs.getPropertyValue("--color-focus-sketch").trim(),
        crayonBlue: cs.getPropertyValue("--color-crayon-blue").trim(),
        dark: document.documentElement.classList.contains("dark"),
        ghostStrokeVar: ghost ? getComputedStyle(ghost).stroke : null,
      };
    });
  };
  const light = await read("light");
  const dark = await read("dark");
  bank(`darkarm-${browserName}.json`, { engine: browserName, light, dark });
  console.log(`DARKARM ${browserName} light=${light.focusSketch} dark=${dark.focusSketch}`);
  expect(dark.dark, "the dark arm must actually be in dark mode").toBe(true);
  expect(dark.focusSketch, "the dark arm must differ from light").not.toBe(light.focusSketch);
  expect(dark.focusSketch, "the dark arm is an ALIAS onto the crayon: zero new hex").toBe(
    dark.crayonBlue,
  );
});

test("G-ABS-4b the deck — the activedescendant card is the one ring owner", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await ready(page, "?view=gallery&size=3&difficulty=EASY", ".game-gallery");
  await page.evaluate(() => document.querySelector<HTMLElement>(".gallery-viewport")?.focus());
  await page.keyboard.press("Home");
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => {
    const vp = document.querySelector<HTMLElement>(".gallery-viewport");
    if (!vp) return null;
    const card = document.getElementById(vp.getAttribute("aria-activedescendant") ?? "");
    const owners = Array.from(document.querySelectorAll<HTMLElement>(".game-card")).filter(
      (c) => getComputedStyle(c).outlineStyle !== "none",
    );
    const cs = card ? getComputedStyle(card) : null;
    return {
      viewportOutlineStyle: getComputedStyle(vp).outlineStyle,
      ownerCount: owners.length,
      activeId: card?.id ?? null,
      cardOutline: cs ? `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}` : null,
      cardOffset: cs?.outlineOffset ?? null,
    };
  });
  bank(`deckowner-${browserName}.json`, { engine: browserName, ...r });
  console.log("DECKOWNER " + JSON.stringify(r));
  expect(r?.viewportOutlineStyle, "the scrollport is not a ring owner").toBe("none");
  expect(r?.ownerCount, "exactly one card wears the ring").toBe(1);
});
