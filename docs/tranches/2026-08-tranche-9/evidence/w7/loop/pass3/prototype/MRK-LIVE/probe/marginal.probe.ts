/**
 * T9-W7 pass 3 · MRK-LIVE §1.5 — THE MARGINAL SUBSCRIBER, PRICED.
 *
 * `boilBeat`'s zero-subscriber floor is unreachable on a rendered page (the wordmark and the
 * toggle enrol for the app's life), so the honest question is what ONE more subscriber costs.
 * The prototype (4238) mounts `FocusRing.vue`, which enrols a `useMarkPose` watch; HEAD
 * (74a2b5d9, 4239) has no such component at all. Same page, same idle window, both servers:
 * the delta IS the marginal subscriber.
 *
 * Motion declared: the window is IDLE by construction — the page is left alone for 3×900ms and
 * only DOM writes are counted; the beat itself (125ms) is the thing being priced.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });

async function boardReady(page: Page, q = "?game=sudoku") {
  await page.goto("./" + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400);
}

test("M · the marginal subscriber's idle price", async ({ page, browserName, baseURL }) => {
  await boardReady(page);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(900);
  const rows: unknown[] = [];
  for (let i = 0; i < 3; i++) {
    rows.push(
      await page.evaluate(async () => {
        let records = 0;
        let frames = 0;
        const mo = new MutationObserver((r) => {
          records += r.length;
        });
        mo.observe(document.documentElement, {
          attributes: true,
          childList: true,
          subtree: true,
        });
        let raf = 0;
        const step = () => {
          frames++;
          raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        await new Promise((r) => setTimeout(r, 900));
        cancelAnimationFrame(raf);
        mo.disconnect();
        return {
          domWritesPer900ms: records,
          framesPer900ms: frames,
          hasRing: document.querySelectorAll(".focus-ring").length,
        };
      }),
    );
  }
  const out = { engine: browserName, baseURL, rows };
  writeFileSync(
    join(OUT, `MARGINAL-${baseURL?.endsWith("4239") ? "HEAD" : "PROTO"}-${browserName}.json`),
    JSON.stringify(out, null, 2),
  );
  console.log("M " + JSON.stringify(out));
});
