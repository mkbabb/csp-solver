import { test, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/MOT-LADDER/readings";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(`${OUT}/${n}.json`, JSON.stringify(d, null, 1) + "\n");

// (b) B12 ABSENCE — the born-RED row. A build with publishMotionRungs() deleted must read
//     the REDUCE page at .icon-btn: duration 0s, property `opacity` (not `all`, not normal).
//     The negative control ships initial-value: 520ms and reads 0.52s, so the row passes and
//     the law is re-silenced — which is why the initial must be 0ms.
test("b · B12 absence and its negative control", async ({ page, browserName }) => {
  const read = async (url: string) => {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    return page.evaluate(() => {
      const el = document.querySelector(".icon-btn");
      const cs = el ? getComputedStyle(el) : null;
      const root = getComputedStyle(document.documentElement);
      return {
        publisherNodes: document.querySelectorAll("style[data-motion-rungs]").length,
        iconBtnFound: !!el,
        transitionDuration: cs?.transitionDuration ?? null,
        transitionProperty: cs?.transitionProperty ?? null,
        rootThrow: root.getPropertyValue("--motion-throw").trim(),
        rootWhisper: root.getPropertyValue("--motion-whisper").trim(),
      };
    });
  };
  const rows = {
    browserName,
    after: await read("http://127.0.0.1:4240/"),
    control74a2b5d9: await read("http://127.0.0.1:4247/"),
    absence: await read("http://127.0.0.1:4248/"),
    absenceNegativeControl520: await read("http://127.0.0.1:4249/"),
  };
  bank(`b-b12-absence-${browserName}`, rows);
  expect(rows.absence.publisherNodes).toBe(0);
});

// (c) THE BOOT-FRAME SAMPLER (CTRL-TAPE's critic's graft). The first frame in which ANY
//     element consumes a --motion-* against the frame the publisher's node lands. 0 keeps
//     registry §2.1's runtime node; >0 hands the agglomerator the build-time cure.
test("c · the boot-frame sampler", async ({ page, browserName }) => {
  await page.addInitScript(() => {
    (window as any).__boot = { frames: [] as Array<Record<string, unknown>>, nodeFrame: -1, consumeFrame: -1 };
    let f = 0;
    const tick = () => {
      const b = (window as any).__boot;
      const node = document.querySelector("style[data-motion-rungs]");
      if (node && b.nodeFrame < 0) b.nodeFrame = f;
      let consumed = false;
      const root = document.documentElement;
      const v = getComputedStyle(root).getPropertyValue("--motion-whisper").trim();
      // A CONSUMER is an element whose computed transition-duration is nonzero AND whose
      // rule reads a rung: approximated by the first element with a nonzero duration.
      for (const el of Array.from(document.querySelectorAll("*")).slice(0, 400)) {
        const d = getComputedStyle(el).transitionDuration;
        if (d && !d.split(",").every((x) => x.trim() === "0s")) { consumed = true; break; }
      }
      if (consumed && b.consumeFrame < 0) b.consumeFrame = f;
      b.frames.push({ f, node: !!node, rootWhisper: v, consumed });
      f++;
      if (f < 30) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.goto("http://127.0.0.1:4240/");
  await page.waitForTimeout(1200);
  const boot = await page.evaluate(() => (window as any).__boot);
  const window_ = boot.consumeFrame < 0 || boot.nodeFrame < 0 ? null : boot.consumeFrame - boot.nodeFrame;
  bank(`c-bootframe-${browserName}`, {
    browserName,
    nodeLandsAtFrame: boot.nodeFrame,
    firstConsumingFrame: boot.consumeFrame,
    windowInFrames: window_,
    firstEightFrames: boot.frames.slice(0, 8),
  });
});

// (j) THE REFUSE TWIN — both consumers compute 0.6s from one binding; index.css carries no 0.6s.
test("j · the refuse twin, one home", async ({ page, browserName }) => {
  await page.goto("http://127.0.0.1:4240/");
  await page.waitForLoadState("networkidle");
  const css = await page.evaluate(async () => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(
      (l) => (l as HTMLLinkElement).href,
    );
    let all = "";
    for (const h of links) all += await (await fetch(h)).text();
    return {
      refuseShakeTerms: (all.match(/animation:\s*refuse-shake[^;}]*/g) ?? []),
      literal06s: (all.match(/refuse-shake\s+0?\.6s/g) ?? []).length,
      refuseDurReads: (all.match(/var\(--refuse-dur\)/g) ?? []).length,
    };
  });
  bank(`j-refuse-${browserName}`, { browserName, ...css });
  expect(css.literal06s).toBe(0);
});
