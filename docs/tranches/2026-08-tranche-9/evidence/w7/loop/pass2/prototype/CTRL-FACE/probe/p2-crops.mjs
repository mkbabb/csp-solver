/**
 * CTRL-FACE pass 2 — the three cited poses, both engines shot, one banked per pose.
 * OUTDIR=<dir> BASE=http://127.0.0.1:4234/ node p2-crops.mjs
 */
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { statSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE || "http://127.0.0.1:4234/";
const OUTDIR = process.env.OUTDIR || "/tmp";

async function open(b, { w, h, mobile, theme, eng }) {
  const ctx = await b.newContext({
    viewport: { width: w, height: h },
    hasTouch: mobile,
    isMobile: mobile && eng === "chromium",
    deviceScaleFactor: 2,
    colorScheme: theme,
  });
  const p = await ctx.newPage();
  await p.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await p.waitForSelector(".controls-card", { state: "attached", timeout: 60000 });
  await p.waitForTimeout(1500);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await p.locator(".drawer-tab").click({ force: true });
    await p.waitForTimeout(950); // the sheet SLIDES — settle before a frame
  }
  return { ctx, p };
}

const clipFrom = (r, pad = 6) => ({
  x: Math.max(0, Math.floor(r.x - pad)),
  y: Math.max(0, Math.floor(r.y - pad)),
  width: Math.ceil(r.width + pad * 2),
  height: Math.ceil(r.height + pad * 2),
});

for (const [eng, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await L.launch();

  // POSE 1 — dock DARK, sheet up, `size` open: the printed tape at its leading over the tab row.
  {
    const { ctx, p } = await open(b, { w: 390, h: 844, mobile: true, theme: "dark", eng });
    const clip = await p.evaluate(() => {
      const card = document.querySelector(".controls-card");
      const r = card.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: Math.min(340, r.height) };
    });
    await p.screenshot({ path: join(OUTDIR, `pose1-dock-dark-tape-over-tabs-${eng}.png`), clip: clipFrom(clip) });
    await ctx.close();
  }

  // POSE 2 — dock LIGHT, scrolled to put the `checking` tape over the `candidates` caption.
  {
    const { ctx, p } = await open(b, { w: 390, h: 844, mobile: true, theme: "light", eng });
    const clip = await p.evaluate(async () => {
      const card = document.querySelector(".controls-card");
      const tape = Array.from(card.querySelectorAll(".tray-well > .washi-tag")).find(
        (t) => t.innerText.trim() === "checking",
      );
      const cap = Array.from(card.querySelectorAll(".zone-row-label")).find(
        (c) => c.innerText.trim() === "candidates",
      );
      if (!tape || !cap) return null;
      tape.scrollIntoView({ block: "center", behavior: "instant" });
      await new Promise((r) => setTimeout(r, 400));
      const t = tape.getBoundingClientRect();
      const c = cap.getBoundingClientRect();
      const top = Math.min(t.top, c.top);
      return { x: card.getBoundingClientRect().left, y: top - 40, width: card.getBoundingClientRect().width, height: Math.max(t.bottom, c.bottom) - top + 80 };
    });
    if (clip) {
      await p.waitForTimeout(350);
      await p.screenshot({ path: join(OUTDIR, `pose2-dock-light-ink-gate-${eng}.png`), clip: clipFrom(clip) });
    }
    await ctx.close();
  }

  // POSE 3 — rail 1280×800 light: `new game` on tape over `size` at full press (the U-10 frame).
  {
    const { ctx, p } = await open(b, { w: 1280, h: 800, mobile: false, theme: "light", eng });
    const clip = await p.evaluate(() => {
      const card = document.querySelector(".controls-card");
      const r = card.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: Math.min(330, r.height) };
    });
    await p.screenshot({ path: join(OUTDIR, `pose3-rail-light-new-game-${eng}.png`), clip: clipFrom(clip) });
    await ctx.close();
  }
  await b.close();
}

for (const f of [
  "pose1-dock-dark-tape-over-tabs",
  "pose2-dock-light-ink-gate",
  "pose3-rail-light-new-game",
])
  for (const eng of ["chromium", "webkit"]) {
    const p = join(OUTDIR, `${f}-${eng}.png`);
    try {
      console.log(p, statSync(p).size, "B");
    } catch {
      console.log(p, "MISSING");
    }
  }
