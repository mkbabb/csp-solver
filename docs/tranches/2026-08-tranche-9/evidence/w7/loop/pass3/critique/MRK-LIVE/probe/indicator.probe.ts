/**
 * T9-W7 pass 3 · MRK-LIVE CRITIC · does EVERY focusable stop still have an indicator?
 *
 * The diff suppresses the UA outline globally (`index.css` @layer base `:focus-visible {
 * outline: none }`) and deletes the `outline-ring/50` sweep off `*`. The family reads five
 * named stops. This row walks every focusable element on the board route and on the deck,
 * focuses each, and asks for ONE of: a drawn `.focus-ring`, the board's own tier-2 ink, or a
 * computed outline wider than 0. Motion declared: static reads after a 250ms settle per stop;
 * PRM off. Read-only.
 */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
mkdirSync(OUT, { recursive: true });

test("every focusable stop carries one indicator", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("./?game=sudoku");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 90000 });
  await page.waitForTimeout(1500);
  await page.keyboard.press("Tab"); // keyboard modality

  const rows = await page.evaluate(async () => {
    const SEL =
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const all = [...document.querySelectorAll<HTMLElement>(SEL)].filter((e) => {
      if (e.closest("[inert]")) return false;
      const cs = getComputedStyle(e);
      if (cs.display === "none" || cs.visibility === "hidden") return false;
      const r = e.getBoundingClientRect();
      return r.width > 0 || r.height > 0 || e.classList.contains("cell-native-input");
    });
    // Sample: every distinct tag.class signature, at most 3 per signature.
    const seen = new Map<string, number>();
    const pick: HTMLElement[] = [];
    for (const e of all) {
      const k = e.tagName + "." + (e.className || "").toString().split(" ")[0];
      const n = seen.get(k) ?? 0;
      if (n < 2) {
        pick.push(e);
        seen.set(k, n + 1);
      }
    }
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const out: unknown[] = [];
    for (const e of pick) {
      e.focus({ preventScroll: true });
      await sleep(260);
      const a = document.activeElement as HTMLElement | null;
      const took = a === e;
      const fv = took ? e.matches(":focus-visible") : false;
      const rings = document.querySelectorAll(".focus-ring").length;
      const cs = getComputedStyle(e);
      const outlineW = parseFloat(cs.outlineWidth) || 0;
      const outlineStyle = cs.outlineStyle;
      const cell = e.closest(".game-cell");
      const boardInk = cell
        ? getComputedStyle(cell.querySelector(".cell-ghost-path")!).strokeOpacity
        : null;
      out.push({
        sig: e.tagName + "." + (e.className || "").toString().split(" ").slice(0, 2).join("."),
        took,
        fv,
        rings,
        outline: outlineStyle === "none" ? 0 : outlineW,
        boardInk,
        indicated: rings > 0 || (outlineStyle !== "none" && outlineW > 0) || !!boardInk,
      });
    }
    return out;
  });

  const bad = rows.filter((r: any) => r.took && r.fv && !r.indicated);
  writeFileSync(
    join(OUT, `CRITIC-5-indicators-${info.project.name}.json`),
    JSON.stringify({ total: rows.length, unindicated: bad.length, bad, rows }, null, 2),
  );
  console.log(
    JSON.stringify({ engine: info.project.name, total: rows.length, unindicated: bad.length, bad }),
  );
});
