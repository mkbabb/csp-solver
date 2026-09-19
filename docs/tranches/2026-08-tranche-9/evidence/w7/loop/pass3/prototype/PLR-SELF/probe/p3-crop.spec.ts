/**
 * PLR-SELF pass 2 — the FOUR cited crops, and no more (CHAIR §7: at most four per family per
 * pass, ≤150 KB each; numbers and text first). Chromium only — a second engine's copy of the
 * same picture is bytes, not evidence, and the numbers behind each one are banked both engines.
 */
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import sharp from "sharp";
import {
  SOLO,
  DESK,
  PHONE_TALL,
  say,
  settled,
  invite,
  addPeers,
  mark,
  lobby,
  openSheet,
  coarseCtx,
} from "./harness";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/PLR-SELF/frames";

const bank = (name: string, buf: Buffer) => {
  fs.writeFileSync(`${OUT}/${name}`, buf);
  say({ frame: name, bytes: buf.length });
  expect(buf.length, `${name} is under the 150 KB cap`).toBeLessThan(150 * 1024);
};

test("frame 1 — desk light, four at the table, the mark and the `you` row one ink", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "chromium", "one engine per crop (CHAIR §7)");
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 3);
  await page.waitForTimeout(700);
  await openSheet(page);
  await page.mouse.move(900, 740); // the pointer PARKED: a hovered mark is a different pose
  await page.waitForTimeout(700);
  await expect(lobby(page)).toBeVisible();
  bank(
    "1-desk-mark-and-sheet.png",
    await page.screenshot({ clip: { x: 0, y: 0, width: 300, height: 230 } }),
  );
});

test("frame 2 — phone 390x844 coarse dark, seven at the table, the compression line", async ({
  browser,
}, info) => {
  test.skip(info.project.name !== "chromium", "one engine per crop (CHAIR §7)");
  const ctx = await browser.newContext({
    viewport: PHONE_TALL,
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true,
    colorScheme: "dark",
  });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  await invite(a);
  await addPeers(a, 6);
  await a.waitForTimeout(700);
  await openSheet(a);
  await a.waitForTimeout(400);
  const state = await lobby(a).evaluate((el) => ({
    state: el.querySelector(".pl-state")?.textContent?.trim(),
    rows: el.querySelectorAll(".pl-row").length,
    more: el.querySelector(".pl-more")?.textContent?.trim(),
  }));
  say({ frame2: state });
  bank(
    "2-phone-dark-compressed.png",
    await a.screenshot({ clip: { x: 0, y: 0, width: 280, height: 220 } }),
  );
  await ctx.close();
});

test("frame 3 — one strip: the live mark at rest [0] beside the hovered [1]", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "chromium", "one engine per crop (CHAIR §7)");
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 1);
  await page.waitForTimeout(700);
  const box = (await mark(page).boundingBox())!;
  const clip = {
    x: Math.round(box.x) - 2,
    y: Math.round(box.y) - 2,
    width: Math.round(box.width) + 4,
    height: Math.round(box.height) + 4,
  };
  await page.mouse.move(900, 740);
  await page.waitForTimeout(300);
  const rest = await page.screenshot({ clip });
  await mark(page).hover();
  await page.waitForTimeout(200);
  const hovered = await page.screenshot({ clip });
  // The strip is the two crops side by side, composed by sharp so it is ONE cited frame.
  const strip = await sharp({
    create: {
      width: clip.width * 2 + 8,
      height: clip.height,
      channels: 4,
      background: { r: 252, g: 251, b: 249, alpha: 1 },
    },
  })
    .composite([
      { input: rest, left: 0, top: 0 },
      { input: hovered, left: clip.width + 8, top: 0 },
    ])
    .png()
    .toBuffer();
  bank("3-pose-rest-vs-hovered.png", strip);
});

test("frame 4 — the deck's own swatch in a room (the declared F1 delta)", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "chromium", "one engine per crop (CHAIR §7)");
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 2);
  await page.waitForTimeout(700);
  await page.keyboard.press("g");
  await page.waitForTimeout(1400);
  // The CARD, not the dot: a swatch alone is three coloured squares and says nothing about
  // whose they are. The centred card carries the wordmark above them, so the frame reads as
  // "the table, echoed beside the range" — which is what the deck's own comment calls it.
  const box = await page.evaluate(() => {
    const s = document.querySelector(".game-card-swatch");
    if (!s) return null;
    const card = s.closest(".game-card") ?? s.parentElement!;
    const b = card.getBoundingClientRect();
    return {
      x: Math.max(0, Math.round(b.x) - 8),
      y: Math.max(0, Math.round(b.y) - 8),
      width: Math.min(420, Math.round(b.width) + 16),
      height: Math.min(300, Math.round(b.height) + 16),
    };
  });
  expect(box, "the deck draws the table").not.toBeNull();
  bank("4-deck-swatch-in-a-room.png", await page.screenshot({ clip: box! }));
});
