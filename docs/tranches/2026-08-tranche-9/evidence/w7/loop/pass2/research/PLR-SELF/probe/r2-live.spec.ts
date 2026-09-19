/**
 * PLR-SELF pass-2 RESEARCH probe, part 2 — the LIVE mark: what hover and focus do to the ink,
 * the 400ms transition mid-flight, and the sheet's ground with real rows in it.
 * Read-only on product files. Both engines, 127.0.0.1:4241 (prototype worktree).
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const DESK = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };
const say = (o: unknown) => console.log(`R2LIVE|${JSON.stringify(o)}`);
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/PLR-SELF/probe";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function invite(page: Page): Promise<void> {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  if (!(await verb.isVisible())) {
    await page.locator(".drawer-tab").first().click();
    await page.waitForTimeout(700);
  }
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
}
/** Two REAL pages in one room — the local arm is a BroadcastChannel, so a second tab is a
 *  second player and `mint` walks it a real index. Synthetic `hi` frames were not enough: a
 *  peer must answer the ack to enter the roster. */
async function secondPage(page: Page, n = 1): Promise<Page[]> {
  const url = page.url();
  const out: Page[] = [];
  for (let i = 0; i < n; i++) {
    const p = await page.context().newPage();
    await p.setViewportSize(DESK);
    await p.goto(url);
    await settled(p);
    out.push(p);
  }
  await page.waitForTimeout(900);
  return out;
}
const mark = (page: Page) => page.locator("[data-player-mark]:visible");

test("F · the live mark under hover and under focus", async ({ page }, ti) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  const peers = await secondPage(page, 1);

  const m = mark(page);
  const snap = async (label: string) => ({
    case: label,
    live: await m.evaluate((el) => el.classList.contains("is-live")),
    color: await m.evaluate((el) => getComputedStyle(el).color),
    stubFill: await m.evaluate((el) => getComputedStyle(el.querySelector("path")!).fill),
    outline: await m.evaluate(
      (el) =>
        `${getComputedStyle(el).outlineStyle} ${getComputedStyle(el).outlineWidth} ${getComputedStyle(el).outlineColor}`,
    ),
    label: await m.getAttribute("aria-label"),
    rosterRows: await page.locator(".player-row").count(),
  });

  // Pointer parked far away, sheet shut.
  await page.mouse.move(640, 700);
  await page.waitForTimeout(700);
  const rest = await snap("rest-live-pointer-away");

  // MID-FLIGHT: drive the room back to one and out again is expensive; instead sample the
  // transition the moment the class flips by re-mounting a peer.
  await peers[0].close();
  await page.waitForTimeout(1200);
  const solo = await snap("solo-after-leave");
  const p2 = await page.context().newPage();
  await p2.setViewportSize(DESK);
  const nav = p2.goto(page.url());
  const samples: { t: number; color: string }[] = [];
  const t0 = Date.now();
  for (let i = 0; i < 40; i++) {
    samples.push({
      t: Date.now() - t0,
      color: await m.evaluate((el) => getComputedStyle(el).color),
    });
    await page.waitForTimeout(40);
  }
  await nav;
  await page.waitForTimeout(900);
  const live2 = await snap("live-again");

  // HOVER on the live mark.
  await m.hover();
  await page.waitForTimeout(700);
  const hovered = await snap("hovered");
  await page.mouse.move(640, 700);
  await page.waitForTimeout(700);
  const unhovered = await snap("pointer-parked-away");

  // FOCUS-VISIBLE on the live mark, reached by Tab only.
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press("Tab");
    if (await m.evaluate((el) => el === document.activeElement)) break;
  }
  await page.waitForTimeout(700); // the 400ms ink, settled
  const focusedSettled = await snap("focus-visible-settled");

  say({
    t: "F",
    engine: ti.project.name,
    rest,
    solo,
    live2,
    hovered,
    unhovered,
    focusedSettled,
    midflight: samples,
  });
});

test("G · the sheet with rows in it — geometry and the painted ground", async ({ page }, ti) => {
  for (const vp of [DESK, PHONE]) {
    await page.setViewportSize(vp);
    await page.goto(SOLO);
    await settled(page);
    await invite(page);
    await secondPage(page, 3);
    await page.setViewportSize(vp);
    await page.waitForTimeout(600);

    await mark(page).click();
    await page.waitForTimeout(750);
    await page.mouse.move(vp.width / 2, vp.height - 40); // park the pointer OFF the mark
    await page.waitForTimeout(700);

    const geo = await page.evaluate(() => {
      const r = (s: string) => {
        const el = [...document.querySelectorAll(s)].find(
          (e) => (e as HTMLElement).getClientRects().length > 0,
        ) as HTMLElement | undefined;
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          x: +b.x.toFixed(1),
          y: +b.y.toFixed(1),
          w: +b.width.toFixed(1),
          h: +b.height.toFixed(1),
          bottom: +b.bottom.toFixed(1),
          right: +b.right.toFixed(1),
        };
      };
      const sheet = document.querySelector("[data-lobby]") as HTMLElement | null;
      const quiet = [...document.querySelectorAll("[data-lobby] *")]
        .filter((e) => (e.textContent ?? "").trim().length && e.children.length === 0)
        .map((e) => {
          const b = e.getBoundingClientRect();
          return {
            cls: (e.className as string) || e.tagName,
            text: (e.textContent ?? "").trim().slice(0, 28),
            color: getComputedStyle(e).color,
            x: +b.x.toFixed(1),
            y: +b.y.toFixed(1),
            w: +b.width.toFixed(1),
            h: +b.height.toFixed(1),
          };
        });
      return {
        sheet: r("[data-lobby]"),
        wordmark: r("svg.handwritten-logo"),
        board: r(".game-board, .board-frame, .sudoku-grid"),
        mark: r("[data-player-mark]"),
        scroll: sheet
          ? { sh: sheet.scrollHeight, ch: sheet.clientHeight }
          : null,
        rows: quiet,
      };
    });

    let ground: unknown = null;
    if (geo.sheet) {
      const clip = {
        x: Math.max(0, Math.round(geo.sheet.x)),
        y: Math.max(0, Math.round(geo.sheet.y)),
        width: Math.round(geo.sheet.w),
        height: Math.round(geo.sheet.h),
      };
      const buf = await page.screenshot({ clip });
      const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
      const hist = new Map<string, number>();
      for (let i = 0; i < data.length; i += info.channels)
        hist.set(
          `${data[i]},${data[i + 1]},${data[i + 2]}`,
          (hist.get(`${data[i]},${data[i + 1]},${data[i + 2]}`) ?? 0) + 1,
        );
      const top = [...hist.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
      ground = { clip, px: info.width * info.height, distinct: hist.size, top };
      if (vp.width === 1280 && ti.project.name === "chromium")
        await sharp(buf).png({ compressionLevel: 9 }).toFile(`${OUT}/sheet-desk-live.png`);
    }
    say({ t: "G", engine: ti.project.name, vp: vp.width, geo, ground });
  }
});
