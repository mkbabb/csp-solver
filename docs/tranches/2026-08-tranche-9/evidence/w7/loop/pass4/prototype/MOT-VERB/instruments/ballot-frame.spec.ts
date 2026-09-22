/**
 * MOT-VERB pass 4 — THE BALLOT FRAME (the owner's row: 19 real re-curves).
 *
 * A still cannot show a curve, so this makes one that can. The subject is the WORST row in the
 * fixed-t table — `.gallery-fade-leave-active`, the deck's leave-only dissolve, `--ease-glassGlide`
 * on the control and `--verb-lift-ease` here, worst |Δprogress| 0.8521 at t = 0.40. Each arm's
 * OWN computed easing drives a paused WAAPI opacity run of the same length, held at exactly
 * t = 0.40, and the deck is photographed there. Same board, same viewport, same instant; the
 * only difference in the two frames is the curve the arm ships.
 */
import { test, type Page } from "@playwright/test";

const ARMS = { after: "http://127.0.0.1:4247", control: "http://127.0.0.1:4248" };
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/MOT-VERB";

async function shoot(page: Page, url: string, name: string, engine: string) {
  await page.goto(`${url}/?view=gallery&board=ballot`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const deck = page.locator(".game-gallery").first();
  await deck.waitFor({ state: "visible", timeout: 10_000 });
  // The rule is `<style scoped>`, so it only matches an element carrying App's scope hash: a
  // detached probe div reads the UA's `ease` on BOTH arms and the frames then differ by nothing
  // (the first cut of this instrument did exactly that and its frames were deleted unread).
  const easing = await page.evaluate(() => {
    const el = document.querySelector(".game-gallery") as HTMLElement;
    el.classList.add("gallery-fade-leave-active");
    const e = getComputedStyle(el).transitionTimingFunction;
    el.classList.remove("gallery-fade-leave-active");
    return e;
  });
  await page.evaluate((ease: string) => {
    const el = document.querySelector(".game-gallery") as HTMLElement;
    const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 4000,
      easing: ease,
      fill: "both",
    });
    a.pause();
    a.currentTime = 1600; // t = 0.40 of the run — the instant the two curves are furthest apart
  }, easing);
  await page.waitForTimeout(200);
  await deck.screenshot({
    path: `${OUT}/frame-deckleave-t040-${name}-${engine}-1280x720-light-mouse.png`,
  });
  return easing;
}

test("the deck's leave at t=0.40, both arms, one instant", async ({ page }, info) => {
  const engine = info.project.name;
  const a = await shoot(page, ARMS.after, "after", engine);
  const c = await shoot(page, ARMS.control, "control", engine);
  console.log(`BALLOT-FRAME[${engine}] after easing=${a} · control easing=${c}`);
});
