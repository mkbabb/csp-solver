/**
 * MOT-VERB pass 5 — T9-B10's frame, RE-SHOT ON ONE PAYLOAD (pass-4 critique §2.2: the pass-4
 * pair was easy vs hard, two deals, under a sentence that said one board). The subject is the
 * worst row of the generated fixed-t table: `.gallery-fade-leave-active`, the deck's leave-only
 * dissolve (control `--ease-glassGlide`, this tree `--verb-lift-ease`, |Δprogress| 0.8521 at
 * t = 0.40). Each arm's OWN computed easing drives a paused WAAPI opacity run held at t = 0.40.
 * Held: engine (chromium), theme (light), viewport (1280×800), pointer (fine), board (the
 * encoded payload, read back from the live face in both arms). The one variable: the curve.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import { PAYLOAD, ARMS, OUT, givens } from "./board";
const CROPS = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MOT-VERB";

async function shoot(page: Page, url: string) {
  await page.goto(`${url}/?game=sudoku&view=gallery&board=${PAYLOAD}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const g = await givens(page);
  const easing = await page.evaluate(() => {
    const el = document.querySelector(".game-gallery") as HTMLElement;
    el.classList.add("gallery-fade-leave-active");
    const e = getComputedStyle(el).transitionTimingFunction;
    el.classList.remove("gallery-fade-leave-active");
    const a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 4000, easing: e, fill: "both" });
    a.pause();
    a.currentTime = 1600;
    return e;
  });
  await page.waitForTimeout(300);
  const opacity = await page.evaluate(() => getComputedStyle(document.querySelector(".game-gallery")!).opacity);
  const buf = await page.screenshot({ clip: { x: 0, y: 60, width: 1280, height: 560 } });
  return { g, easing, opacity, buf };
}
test("T9-B10 · the deck's leave at t=0.40 · after | control · one payload", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "one engine by design (the ballot pair holds the engine)");
  await page.setViewportSize({ width: 1280, height: 800 });
  const A = await shoot(page, ARMS.after), C = await shoot(page, ARMS.control);
  console.log(`B10 payload=${PAYLOAD} givensEqual=${A.g === C.g && A.g.length === 81} after easing=${A.easing} opacity=${A.opacity} · control easing=${C.easing} opacity=${C.opacity}`);
  expect(A.g).toBe(C.g);
  const W = 640, H = 280;
  const a = await sharp(A.buf).resize(W, H).toBuffer(), c = await sharp(C.buf).resize(W, H).toBuffer();
  await sharp({ create: { width: W * 2 + 8, height: H, channels: 3, background: "#888" } })
    .composite([{ input: a, left: 0, top: 0 }, { input: c, left: W + 8, top: 0 }])
    .png({ palette: true, quality: 70, compressionLevel: 9 })
    .toFile(`${CROPS}/t9-b10-deckleave-t040-after-left-control-right-chromium-light-1280x800-fine.png`);
});
