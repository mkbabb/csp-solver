/** MOT-VERB pass 3 — the fold's TURN, isolated. Finds the control that opens the gallery by
 *  reading the page's own buttons, then samples `.board-peek-host`'s transform per frame. */
import { expect, test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const AFTER = process.env.MOT_VERB_AFTER ?? "http://127.0.0.1:4247";
const OUT = process.env.MOT_VERB_OUT ?? "/tmp/mot-verb";

test("F the fold TURNS", async ({ browser }, info) => {
  const out: Record<string, unknown> = {};
  for (const pose of [
    { name: "desk-1440", w: 1440, h: 900, touch: false },
    { name: "dock-390", w: 390, h: 844, touch: true },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: pose.w, height: pose.h },
      deviceScaleFactor: pose.touch ? 3 : 1,
      hasTouch: pose.touch,
      isMobile: pose.touch,
    });
    const page = await ctx.newPage();
    await page.goto(`${AFTER}/?size=3&difficulty=EASY`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
    await page.waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 20000 });
    await page.waitForTimeout(900);
    const controls = await page.evaluate(() =>
      Array.from(document.querySelectorAll("button, a, [role=button]")).map((el) => ({
        tag: el.tagName,
        cls: (el.className || "").toString().slice(0, 60),
        label: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40),
      })),
    );
    // Whatever names the deck is the way back to it.
    const idx = controls.findIndex((c) => /puzzle|gallery|game|choose|back/i.test(`${c.label} ${c.cls}`));
    let frames: string[] = [];
    let running: unknown = "(no control found)";
    if (idx >= 0) {
      const target = page.locator("button, a, [role=button]").nth(idx);
      const trace = page.evaluate(
        () =>
          new Promise<string[]>((resolve) => {
            const seen: string[] = [];
            let n = 0;
            const tick = () => {
              const el = document.querySelector(".board-peek-host") as HTMLElement | null;
              seen.push(el ? getComputedStyle(el).transform : "(absent)");
              if (++n < 70) requestAnimationFrame(tick);
              else resolve(seen);
            };
            requestAnimationFrame(tick);
          }),
      );
      await target.click({ force: true }).catch(() => {});
      await page.waitForTimeout(260); // BEAT 1: the fold starts after the chrome-leave window
      running = await page.evaluate(() =>
        document
          .getAnimations()
          .filter((a) => a.playState === "running")
          .map((a) => {
            const t = a.effect?.getTiming() ?? {};
            return { id: (a as Animation & { id?: string }).id ?? "", easing: t.easing, duration: t.duration, fill: t.fill };
          }),
      );
      frames = await trace;
    }
    out[pose.name] = {
      control: idx >= 0 ? controls[idx] : null,
      running,
      liveFrames: frames.filter((f) => f !== "none" && f !== "(absent)").length,
      frames: frames.slice(0, 10),
    };
    await ctx.close();
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/f-fold-turn-${info.project.name}.json`, JSON.stringify(out, null, 2));
  expect(out).toBeTruthy();
});
