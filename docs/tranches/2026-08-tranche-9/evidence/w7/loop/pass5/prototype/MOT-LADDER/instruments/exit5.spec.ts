import { test, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { PINNED_URL, PAYLOAD } from "./board";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MOT-LADDER/readings";
mkdirSync(OUT, { recursive: true });

/**
 * THE EXIT BALLOT, measured (charter row 4; pass-3 §7(h)). Two dists off ONE tree, one
 * variable: `runFold` reads LAST in `nextTick` (the tree, 4246) or one animation frame later
 * (`app-exit-last-rect.diff`, 4238). Every WAAPI mover's FIRST keyframe is recorded at the
 * `Element.prototype.animate` seam, so the DECLARED travel is read off what the engine was
 * handed, not off a sampled frame. Three numbers: the wordmark's exit travel at 390×844 against
 * its rest-pose distance; the board host's exit travel against its entry travel; the desk
 * (1440×900) unchanged between the two arms.
 */
const ARMS = [
  { name: "tree", base: process.env.PW_AFTER ?? "http://127.0.0.1:4246" },
  { name: process.env.PW_EXIT_NAME ?? "exit-last-rect", base: process.env.PW_EXIT ?? "http://127.0.0.1:4238" },
];
const POSES = [
  { name: "390x844-coarse", w: 390, h: 844, touch: true },
  { name: "1440x900-fine", w: 1440, h: 900, touch: false },
];

const HOOK = () => {
  const w = window as unknown as { __anims: unknown[] };
  w.__anims = [];
  const orig = Element.prototype.animate;
  Element.prototype.animate = function (k: Keyframe[] | PropertyIndexedKeyframes | null, o?: number | KeyframeAnimationOptions) {
    try {
      const f = Array.isArray(k) ? k[0] : (k as Record<string, unknown> | null);
      const cls = (this as Element).getAttribute("class") ?? "";
      w.__anims.push({
        tag: (this as Element).tagName,
        cls: cls.slice(0, 50),
        wordmark: !!(this as Element).closest?.(".logo-trigger, h1"),
        host: (this as Element).classList?.contains("board-peek-host") ?? false,
        from: (f?.transform as string) ?? null,
        dur: typeof o === "number" ? o : o?.duration,
        t: performance.now(),
      });
    } catch {
      /* the hook never breaks the page */
    }
    return orig.call(this, k, o as KeyframeAnimationOptions);
  };
};

const travel = (tf: string | null) => {
  const m = /translate\(\s*(-?[\d.]+)px,\s*(-?[\d.]+)px\)\s*scale\(\s*(-?[\d.]+)/.exec(tf ?? "");
  return m ? { dx: +m[1], dy: +m[2], s: +m[3], px: +Math.hypot(+m[1], +m[2]).toFixed(2) } : null;
};

async function settle(p: Page) {
  await p.waitForTimeout(1400);
  await p.waitForFunction(() => document.getAnimations().filter((a) => a.playState === "running").length === 0, null, { timeout: 8000 }).catch(() => {});
}
const wordmarkCentre = (p: Page) =>
  p.evaluate(() => {
    const el = document.querySelector(".logo-trigger") as HTMLElement | null;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: +(r.left + r.width / 2).toFixed(2), y: +(r.top + r.height / 2).toFixed(2), w: +r.width.toFixed(2) };
  });

test("exit5 · the exit's declared travel, tree vs app-exit-last-rect, two poses", async ({ browser, browserName }) => {
  test.setTimeout(600000);
  const rows: unknown[] = [];
  for (const pose of POSES)
    for (const arm of ARMS) {
      const ctx = await browser.newContext({ viewport: { width: pose.w, height: pose.h }, hasTouch: pose.touch });
      const p = await ctx.newPage();
      await p.addInitScript(HOOK);
      await p.goto(arm.base + PINNED_URL);
      await p.locator(".board-cells").first().waitFor();
      await settle(p);
      const restPlay = await wordmarkCentre(p);
      await p.evaluate(() => ((window as any).__anims = []));
      await p.locator("button.logo-trigger").first().click();
      await p.locator(".gallery-viewport").first().waitFor();
      await settle(p);
      const entry = await p.evaluate(() => (window as any).__anims);
      const restGallery = await wordmarkCentre(p);
      await p.evaluate(() => ((window as any).__anims = []));
      await p.keyboard.press("Escape");
      await p.locator(".gallery-viewport").first().waitFor({ state: "detached" }).catch(() => {});
      await settle(p);
      const exit = await p.evaluate(() => (window as any).__anims);
      const pick = (list: any[], which: "wordmark" | "host") =>
        list.filter((a) => a[which] && a.from).map((a) => ({ ...travel(a.from), dur: a.dur, cls: a.cls }));
      rows.push({
        browserName,
        pose: pose.name,
        arm: arm.name,
        payload: PAYLOAD,
        restDistancePx: restPlay && restGallery ? +Math.hypot(restPlay.x - restGallery.x, restPlay.y - restGallery.y).toFixed(2) : null,
        restPlay,
        restGallery,
        entry: { wordmark: pick(entry, "wordmark"), host: pick(entry, "host"), movers: entry.length },
        exit: { wordmark: pick(exit, "wordmark"), host: pick(exit, "host"), movers: exit.length },
      });
      await ctx.close();
    }
  writeFileSync(`${OUT}/exit5${process.env.TAG ?? ""}-${browserName}.json`, JSON.stringify(rows, null, 1) + "\n");
  for (const r of rows as any[])
    console.log(
      `exit5 ${browserName} ${r.pose} ${r.arm}: rest ${r.restDistancePx}px | entry wm ${JSON.stringify(r.entry.wordmark.map((x: any) => x.px))} host ${JSON.stringify(r.entry.host.map((x: any) => x.px))} | exit wm ${JSON.stringify(r.exit.wordmark.map((x: any) => x.px))} host ${JSON.stringify(r.exit.host.map((x: any) => x.px))} (movers ${r.entry.movers}/${r.exit.movers})`,
    );
});
