/**
 * NOTE-ERASE pass 5 · two crops, each a REPLACEMENT (LAWS P4). chromium, BUILT dists, one payload.
 *
 * C1 (retires pass-4 midVerb-over-empty-390-chromium.png): DARK · 390x844 · coarse (hasTouch,
 *    witnessed). Two bands, one variable (the moment): the settled hint at rest, then the same
 *    line mid-rub-out with the clip at ~50 %. The pose is PINNED, not polled: the leaving node's
 *    two animations are paused and seeked to the time whose computed clip is nearest 50 %, and
 *    the node is held by an instance-level `removeChild` shim on `.margin-note` (Vue's own timeout
 *    would otherwise drop it at 151 ms). The shim is the frame's one uncontrolled variable.
 * C2 (retires pass-4 parkRecord-clipped-1280-webkit.png): F-ERASE-1's pair at 1280x800 fine
 *    light. Four bands, the same clip rect: control empty, control fresh, proto empty, proto fresh.
 */
import { test, expect, type Page, type Browser } from "@playwright/test";
import sharp from "sharp";
import { join } from "node:path";
import { bank, say, boardReady, armHint, PROTO, CONTROL, PAYLOAD, FRAMES } from "./lib";

test.skip(({ browserName }) => browserName !== "chromium", "one engine carries the frames");

const stripBox = (p: Page) =>
  p.evaluate(() => {
    const r = document.querySelector<HTMLElement>(".margin-note-block")!.getBoundingClientRect();
    return { x: Math.max(0, Math.floor(r.left) - 6), y: Math.max(0, Math.floor(r.top) - 6), width: Math.ceil(r.width) + 12, height: Math.ceil(r.height) + 12 };
  });

test("C1 dark mid-verb over the settled line", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, colorScheme: "dark", deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await boardReady(page, PROTO);
  const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
  await armHint(page, 0);
  await expect.poll(() => page.evaluate(() => document.querySelector(".margin-note-ink")?.getAttribute("data-note-age")), { timeout: 5000 }).toBe("settled");
  await page.waitForTimeout(500);
  const box = await stripBox(page);
  const rest = await page.screenshot({ clip: box });
  const text = await page.evaluate(() => document.querySelector(".margin-note")?.textContent?.trim());
  await page.evaluate(() => {
    const host = document.querySelector(".margin-note") as HTMLElement & { removeChild: (c: Node) => Node };
    const w = window as unknown as { __held?: Element };
    host.removeChild = function (c: Node) {
      if (c instanceof Element && c.classList.contains("margin-note-ink")) { w.__held = c; return c; }
      return Node.prototype.removeChild.call(this, c) as Node;
    };
    new MutationObserver(() => {
      const el = host.querySelector(".margin-note-ink.note-leave-active");
      if (el) el.getAnimations().forEach((a) => a.pause());
    }).observe(host, { subtree: true, attributes: true, attributeFilter: ["class"] });
  });
  // The second H on the named cell reveals it and the line leaves to empty (R3-g's `second H`).
  await page.keyboard.press("h");
  await expect.poll(() => page.evaluate(() => !!document.querySelector(".margin-note-ink.note-leave-active")), { timeout: 5000 }).toBe(true);
  const pick = await page.evaluate(() => {
    const el = document.querySelector(".margin-note-ink.note-leave-active")!;
    const anims = el.getAnimations();
    const dur = Number(anims[0].effect!.getTiming().duration);
    let best = { t: 0, pct: 0, opacity: "1" };
    for (let t = 0; t <= dur; t += 1) {
      anims.forEach((a) => (a.currentTime = t));
      const cs = getComputedStyle(el);
      const m = cs.clipPath.match(/inset\(\s*0(?:px)?\s+([\d.]+)%/);
      const pct = m ? Number(m[1]) : 0;
      if (Math.abs(pct - 50) < Math.abs(best.pct - 50)) best = { t, pct, opacity: cs.opacity };
    }
    anims.forEach((a) => (a.currentTime = best.t));
    return { ...best, durationMs: dur, names: anims.map((a) => (a as CSSAnimation).animationName) };
  });
  const mid = await page.screenshot({ clip: box });
  await ctx.close();
  const a = await sharp(rest).metadata();
  const out = await sharp({ create: { width: a.width!, height: a.height! * 2 + 4, channels: 3, background: "#808080" } })
    .composite([{ input: rest, top: 0, left: 0 }, { input: mid, top: a.height! + 4, left: 0 }])
    .png({ compressionLevel: 9, palette: true })
    .toFile(join(FRAMES, "c1-midverb-50pct-dark-390x844-coarse-chromium.png"));
  const row = { payload: PAYLOAD, coarse, text, pick, box, bytes: out.size };
  bank("c1-midverb.json", row);
  say("c1", row);
  expect(Math.abs(pick.pct - 50)).toBeLessThan(5);
});

async function band(browser: Browser, base: string, speak: boolean, clip?: { x: number; y: number; width: number; height: number }) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: "light" });
  const page = await ctx.newPage();
  await boardReady(page, base);
  if (speak) await armHint(page, 0);
  await page.waitForTimeout(300);
  const geom = await page.evaluate(() => {
    const b = document.querySelector('[role="grid"]')!.getBoundingClientRect();
    const s = document.querySelector(".margin-note-block")!.getBoundingClientRect();
    return { boardX: b.x, boardW: b.width, boardBottom: b.bottom, stripTop: s.top, stripH: s.height, stripBottom: s.bottom };
  });
  const c = clip ?? { x: Math.floor(geom.boardX) - 8, y: Math.floor(geom.boardBottom) - 14, width: Math.ceil(geom.boardW) + 16, height: Math.ceil(geom.stripBottom - geom.boardBottom) + 30 };
  const png = await page.screenshot({ clip: c });
  await ctx.close();
  return { png, geom, clip: c };
}

test("C2 F-ERASE-1: the strip at rest and spoken, control vs proto, 1280", async ({ browser }) => {
  const pe = await band(browser, PROTO, false);
  const clip = pe.clip;
  const ce = await band(browser, CONTROL, false, clip);
  const cf = await band(browser, CONTROL, true, clip);
  const pf = await band(browser, PROTO, true, clip);
  const bands = [ce, cf, pe, pf];
  const out = await sharp({ create: { width: clip.width, height: clip.height * 4 + 12, channels: 3, background: "#808080" } })
    .composite(bands.map((b, i) => ({ input: b.png, top: i * (clip.height + 4), left: 0 })))
    .png({ compressionLevel: 9, palette: true })
    .toFile(join(FRAMES, "c2-ferase1-strip-pair-light-1280x800-fine-chromium.png"));
  const row = { payload: PAYLOAD, order: ["control empty", "control fresh", "proto empty", "proto fresh"], geom: bands.map((b) => b.geom), clip, bytes: out.size };
  bank("c2-ferase1.json", row);
  say("c2", row);
  expect(out.size).toBeLessThan(150000);
});
