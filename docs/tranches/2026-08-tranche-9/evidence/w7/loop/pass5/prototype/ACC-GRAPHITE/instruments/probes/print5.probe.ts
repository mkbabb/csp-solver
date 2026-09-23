/** ACC-GRAPHITE pass 5 — G9's TAPE ROW (charter row 12): a two-player room (`?wire=local`, DEV only,
 *  one browser context — the local arm is a BroadcastChannel), page B writes, page A points at
 *  B's digit so the attribution tape mounts, then `media: print`. Read on the tape: computed
 *  display/visibility, its box, elementFromPoint at its own centre, and its painted ink; plus the
 *  glyph/ring/tally strokes. Tree dev :4235 vs control dev :4238, one payload mintBoard(3, 30). */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { mintBoard, solution } from "./lib";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const ARMS = [["tree", process.env.TREE_DEV ?? "http://127.0.0.1:4235"], ["control", process.env.CTRL_DEV ?? "http://127.0.0.1:4238"]];
const ENC = mintBoard(3, 30);
async function boot(p: Page, url: string) { await p.goto(url); await p.waitForSelector("svg.handwritten-logo", { timeout: 60_000 }); await expect.poll(() => p.locator(".game-cell .glyph-svg").count(), { timeout: 60_000 }).toBeGreaterThan(0); }
for (const [arm, base] of ARMS) test(`tape-print-${arm}`, async ({ browser }, info) => {
  test.setTimeout(170_000);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const a = await ctx.newPage(), b = await ctx.newPage();
  await boot(a, `${base}/?board=${ENC}&wire=local`);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled({ timeout: 30_000 }); await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s"), { timeout: 30_000 }).not.toBeNull();
  await boot(b, a.url());
  const given = await b.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")));
  const idx = given.findIndex((g, i) => !g && i > 30);
  const cell = b.locator(".game-cell input").nth(idx); await cell.click(); await cell.fill(String(solution(3, idx)));
  await expect.poll(() => a.locator(".game-cell input").nth(idx).inputValue(), { timeout: 20_000 }).toBe(String(solution(3, idx)));
  await a.bringToFront();
  const box = (await a.locator(".game-cell").nth(idx).boundingBox())!;
  await a.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await a.waitForTimeout(800);
  const read = async (media: "screen" | "print") => {
    await a.emulateMedia({ media }); await a.waitForTimeout(400);
    const r = await a.evaluate((i) => {
      const t = document.querySelector(".attribution-tape") as HTMLElement | null;
      const cs = t ? getComputedStyle(t) : null; const lab = (t?.querySelector(".washi-label") ?? t?.firstElementChild ?? t) as HTMLElement | null; const rb = lab?.getBoundingClientRect();
      const hit = rb && rb.width ? document.elementFromPoint(rb.x + rb.width / 2, rb.y + rb.height / 2) : null;
      const g = document.querySelectorAll(".game-cell")[i].querySelector(".glyph-svg path");
      const tal = document.querySelector(".progress-pose.is-active .progress-trace, .progress-trace");
      return { mounted: !!t, display: cs?.display, visibility: cs?.visibility, opacity: cs?.opacity, box: rb ? { x: rb.x, y: rb.y, w: rb.width, h: rb.height } : null,
        hitIsTape: !!(hit && t && (hit === t || t.contains(hit))), hitTag: hit ? `${hit.tagName.toLowerCase()}.${(hit.getAttribute("class") ?? "").split(" ")[0]}` : null,
        peerGlyphStroke: g ? getComputedStyle(g).stroke : null, tallyStroke: tal ? getComputedStyle(tal).stroke : null, userInk: getComputedStyle(document.documentElement).getPropertyValue("--color-user-ink").trim() };
    }, idx);
    let chromatic = null as null | number;
    if (r.box && r.box.w > 0) { const { data, info: im } = await sharp(await a.screenshot({ clip: { x: r.box.x, y: r.box.y, width: r.box.w, height: r.box.h } })).raw().toBuffer({ resolveWithObject: true }); let n = 0; for (let k = 0; k < im.width * im.height; k++) { const R = data[k * im.channels], G = data[k * im.channels + 1], B = data[k * im.channels + 2]; if (Math.max(R, G, B) - Math.min(R, G, B) > 24) n++; } chromatic = n; }
    return { ...r, chromaticPx: chromatic };
  };
  const out = { engine: info.project.name, arm, payload: ENC.slice(0, 18) + "…", room: new URL(a.url()).searchParams.get("s") ? "formed" : "none", cell: idx, screen: await read("screen"), print: await read("print") };
  writeFileSync(`${S}/tape-print-${info.project.name}-${arm}.json`, JSON.stringify(out, null, 1));
  await ctx.close();
});
