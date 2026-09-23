/** PLR-SELF pass 5 — the dist crops: the edge ballot and the pose floor, ONE minted payload. */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
const CTRL = "http://127.0.0.1:4230", PROTO = "http://127.0.0.1:4231";
const OUT = process.env.PLR_OUT!;
async function settle(p: Page, sel: string) {
  let last = ""; await expect.poll(async () => { const v = await p.locator(sel).first().evaluate((e) => getComputedStyle(e).opacity + getComputedStyle(e).transform + e.getBoundingClientRect().height); const s = v === last; last = v; return s; }, { intervals: [150] }).toBe(true);
}
const givens = (page: Page) => page.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".sudoku-cell input")].map((i) => (/given clue/.test(i.getAttribute("aria-label") ?? "") && i.value ? i.value : "0")).join(""));
test("frames", async ({ browser }, info) => {
  test.skip(info.project.name !== "chromium", "one engine per crop; the numbers carry both");
  const open = async (base: string, q = "") => { const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: "light" }); const p = await ctx.newPage(); await p.goto(base + "/?size=3&difficulty=EASY" + q); await p.locator(".sudoku-cell .glyph-svg").first().waitFor({ state: "attached", timeout: 60000 }); await p.evaluate(() => document.fonts.ready.then(() => 0)); return { ctx, p }; };
  const m = await open(CTRL); const g = await givens(m.p);
  const payload = await m.p.evaluate((g) => btoa(String.fromCharCode(1) + "3." + g).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), g); await m.ctx.close();
  const q = `&board=${payload}`;
  console.log(`PAYLOAD ${payload}`);
  const clip = { x: 0, y: 0, width: 300, height: 240 };
  const shots: Buffer[] = [];
  for (const [base, what] of [[CTRL, "card"], [PROTO, "card"], [PROTO, "lobby"]] as const) {
    const { ctx, p } = await open(base, q);
    expect(await givens(p)).toBe(g);
    // hold the boil still so the two arms differ by the edge alone
    if (what === "card") { await p.locator(".corner-left .attribution-trigger").hover(); await settle(p, ".corner-left .hover-card.is-open"); }
    else { await p.locator("[data-player-mark]:visible").click(); await settle(p, "[data-lobby].is-open"); await p.mouse.move(1270, 790); }
    shots.push(await p.screenshot({ clip, scale: "css" }));
    await ctx.close();
  }
  const gap = 8, W = clip.width * 3 + gap * 2;
  await sharp({ create: { width: W, height: clip.height, channels: 3, background: "#ffffff" } })
    .composite(shots.map((b, i) => ({ input: b, left: i * (clip.width + gap), top: 0 })))
    .png({ compressionLevel: 9, palette: true }).toFile(`${OUT}/1-edge-control-card-vs-drawn-card-and-lobby.png`);
  // THE POSE FLOOR: the stub at rest and picked up, ×4 nearest.
  const { ctx, p } = await open(PROTO, q);
  const mk = p.locator("[data-player-mark]:visible");
  const b = await mk.boundingBox(); const c = { x: Math.floor(b!.x), y: Math.floor(b!.y), width: Math.ceil(b!.width), height: Math.ceil(b!.height) };
  await p.mouse.move(1270, 790); await settle(p, "[data-player-mark]:visible");
  const rest = await p.screenshot({ clip: c, scale: "css" });
  await mk.hover(); await settle(p, "[data-player-mark]:visible");
  const lifted = await p.screenshot({ clip: c, scale: "css" });
  const k = 4, up = async (buf: Buffer) => sharp(buf).resize(c.width * k, c.height * k, { kernel: "nearest" }).png().toBuffer();
  await sharp({ create: { width: c.width * k * 2 + 16, height: c.height * k, channels: 3, background: "#ffffff" } })
    .composite([{ input: await up(rest), left: 0, top: 0 }, { input: await up(lifted), left: c.width * k + 16, top: 0 }])
    .png({ compressionLevel: 9, palette: true }).toFile(`${OUT}/3-pose-floor-rest-vs-lifted-x4.png`);
  // the moved-pixel count, the pose floor's own number
  const raw = async (buf: Buffer) => (await sharp(buf).removeAlpha().raw().toBuffer());
  const [r0, r1] = [await raw(rest), await raw(lifted)];
  let moved = 0, inked = 0; for (let i = 0; i < r0.length; i += 3) { const d = Math.max(Math.abs(r0[i] - r1[i]), Math.abs(r0[i + 1] - r1[i + 1]), Math.abs(r0[i + 2] - r1[i + 2])); if (d >= 8) moved++; if (Math.min(r0[i], r1[i]) < 200) inked++; }
  console.log(`POSEFLOOR box ${c.width}x${c.height} inked ${inked} moved>=8 ${moved}`);
  await ctx.close();
});
