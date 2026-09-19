/**
 * PLR-SELF pass-2 RESEARCH probe. Read-only on product files; runs against this lane's own
 * dev server (127.0.0.1:4241, private vite cacheDir) serving the pass-1 PROTOTYPE worktree
 * `wf_e58b4764-0fc-46`. Both engines. Nothing here is a gate — these are the readings a
 * synthesizer needs to write one.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const DESK = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };
const say = (o: unknown) => console.log(`R2SELF|${JSON.stringify(o)}`);

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
    await page.waitForTimeout(700); // the dock SLIDES — settle the pose
  }
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
}
async function addPeers(page: Page, n: number, from = 1) {
  const room = new URL(page.url()).searchParams.get("s")!;
  await page.evaluate(
    ({ room, n, from }) => {
      const ch = new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < n; i++)
        ch.postMessage({ kind: "hi", data: {}, from: `synth-${from + i}` });
      ch.close();
    },
    { room, n, from },
  );
  await page.waitForTimeout(300);
}
/** The mark in the DESK head (the mobile twin is `md:hidden`); `:visible` is the disambiguator. */
const mark = (page: Page) => page.locator("[data-player-mark]:visible");
const styleOf = (page: Page, sel: string, props: string[]) =>
  page.evaluate(
    ({ sel, props }) => {
      const el = [...document.querySelectorAll(sel)].find(
        (e) => (e as HTMLElement).offsetParent !== null || getComputedStyle(e).position === "fixed",
      ) as HTMLElement | undefined;
      if (!el) return null;
      const cs = getComputedStyle(el);
      const out: Record<string, string> = {};
      for (const p of props) out[p] = cs.getPropertyValue(p).trim();
      return out;
    },
    { sel, props },
  );

// ─────────────────────────────────────────────────────────────────────────────────────────
test("A · the keyboard, and what focus does to the ink", async ({ page }, ti) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 1);
  await page.waitForTimeout(600); // the 400ms presence ink, settled

  const m = mark(page);
  const rest = await m.evaluate((el) => ({
    color: getComputedStyle(el).color,
    live: el.classList.contains("is-live"),
    expanded: el.getAttribute("aria-expanded"),
  }));

  // Reach it by TAB only — no click anywhere, so nothing is focused by a press.
  let hops = 0;
  for (; hops < 30; hops++) {
    await page.keyboard.press("Tab");
    if (await m.evaluate((el) => el === document.activeElement)) break;
  }
  const focused = await m.evaluate((el) => ({
    isActive: el === document.activeElement,
    color: getComputedStyle(el).color,
    outlineColor: getComputedStyle(el).outlineColor,
    outlineStyle: getComputedStyle(el).outlineStyle,
    outlineWidth: getComputedStyle(el).outlineWidth,
    stubFill: getComputedStyle(el.querySelector("path")!).fill,
  }));

  const read = async (label: string) => {
    const lobby = page.locator("[data-lobby]:visible");
    return {
      case: label,
      expanded: await m.getAttribute("aria-expanded"),
      lobbyVisible: await lobby.count(),
      focusStays: await m.evaluate((el) => el === document.activeElement),
    };
  };
  await page.keyboard.press("Enter");
  const e1 = await read("enter-1");
  await page.keyboard.press("Enter");
  const e2 = await read("enter-2");
  await page.keyboard.press("Space");
  const s1 = await read("space-open");
  await page.keyboard.press("Escape");
  const esc = await read("escape-while-open");
  await page.keyboard.press("Space");
  const s2 = await read("space-close");

  say({ t: "A", engine: ti.project.name, rest, tabHops: hops + 1, focused, rows: [e1, e2, s1, esc, s2] });
});

// ─────────────────────────────────────────────────────────────────────────────────────────
test("B · the estate's own trigger, with the focus-open mask OFF (coarse)", async ({
  browser,
}, ti) => {
  // The comment at useHoverCard.ts:47 says a coarse keyboard user opens the card with Enter.
  // On coarse the focus-open stands down (`if (coarse.value) return`), so the mask is gone.
  const ctx = await browser.newContext({ viewport: PHONE, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(SOLO);
  await settled(page);
  const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
  const trig = page.locator(".attribution-trigger:visible").first();
  await trig.focus();
  const afterFocus = await trig.getAttribute("aria-expanded");
  await page.keyboard.press("Enter");
  const afterEnter = await trig.getAttribute("aria-expanded");
  await page.keyboard.press("Space");
  const afterSpace = await trig.getAttribute("aria-expanded");
  say({ t: "B", engine: ti.project.name, coarse, afterFocus, afterEnter, afterSpace });
  await ctx.close();
});

// ─────────────────────────────────────────────────────────────────────────────────────────
test("C · the focusout seam, measured on the mark, on the wire", async ({ page }, ti) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 1);
  await page.waitForTimeout(600);

  const room = new URL(page.url()).searchParams.get("s")!;
  await page.evaluate((room) => {
    (window as any).__cur = [];
    const ch = new BroadcastChannel(`board:${room}`);
    ch.onmessage = (e: MessageEvent) => {
      const d = e.data;
      if (d && d.kind === "cur") (window as any).__cur.push(d.data?.p ?? null);
    };
    (window as any).__ch = ch;
  }, room);

  const cell = page.locator(".sudoku-cell input").first();
  await cell.click();
  await page.waitForTimeout(350);
  const afterCell = await page.evaluate(() => [...(window as any).__cur]);

  // A REAL press — a pointer press, which is what a reader does.
  await page.evaluate(() => ((window as any).__cur.length = 0));
  await mark(page).click();
  await page.waitForTimeout(400);
  const afterMouse = await page.evaluate(() => ({
    cur: [...(window as any).__cur],
    active: document.activeElement?.className ?? document.activeElement?.tagName ?? null,
  }));

  // …and the keyboard path: back to a cell, then Tab/Space onto the mark.
  await page.keyboard.press("Escape");
  await cell.click();
  await page.waitForTimeout(350);
  await page.evaluate(() => ((window as any).__cur.length = 0));
  const m = mark(page);
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press("Tab");
    if (await m.evaluate((el) => el === document.activeElement)) break;
  }
  await page.waitForTimeout(350);
  const afterTab = await page.evaluate(() => [...(window as any).__cur]);

  say({ t: "C", engine: ti.project.name, afterCell, afterMouse, afterTab });
  await page.evaluate(() => (window as any).__ch?.close());
});

// ─────────────────────────────────────────────────────────────────────────────────────────
test("D · the sheet's real ground — does the wordmark run under it", async ({ page }, ti) => {
  const OUT =
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/PLR-SELF/probe";
  for (const vp of [DESK, PHONE]) {
    await page.setViewportSize(vp);
    await page.goto(SOLO);
    await settled(page);
    await invite(page);
    await addPeers(page, 5);
    await page.waitForTimeout(600);
    await mark(page).click();
    await page.waitForTimeout(750); // the sheet settles

    const boxes = await page.evaluate(() => {
      const r = (s: string) => {
        const el = [...document.querySelectorAll(s)].find(
          (e) => (e as HTMLElement).getClientRects().length > 0,
        ) as HTMLElement | undefined;
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { x: +b.x.toFixed(1), y: +b.y.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) };
      };
      return {
        sheet: r("[data-lobby]"),
        wordmark: r("svg.handwritten-logo"),
        board: r(".sudoku-grid, .game-grid, .board-grid"),
        sun: r(".celestial, .toggle-crest, .theme-toggle"),
      };
    });

    // The painted truth inside the sheet: sample the sheet's own box and report the
    // background modes (the paper) rather than the modal token the spec assumed.
    let ground: unknown = null;
    if (boxes.sheet) {
      const clip = {
        x: Math.max(0, Math.round(boxes.sheet.x)),
        y: Math.max(0, Math.round(boxes.sheet.y)),
        width: Math.round(boxes.sheet.w),
        height: Math.round(boxes.sheet.h),
      };
      const buf = await page.screenshot({ clip });
      const { data, info } = await sharp(buf)
        .raw()
        .toBuffer({ resolveWithObject: true });
      const hist = new Map<string, number>();
      for (let i = 0; i < data.length; i += info.channels) {
        const k = `${data[i]},${data[i + 1]},${data[i + 2]}`;
        hist.set(k, (hist.get(k) ?? 0) + 1);
      }
      const top = [...hist.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
      ground = { clip, distinct: hist.size, top };
      await sharp(buf).toFile(`${OUT}/ground-${ti.project.name}-${vp.width}.png`);
    }
    say({ t: "D", engine: ti.project.name, vp: vp.width, boxes, ground });
  }
});

// ─────────────────────────────────────────────────────────────────────────────────────────
test("E · the live-region roll, per view; and the deck's own swatch", async ({ page }, ti) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  const roll = () =>
    page.evaluate(() =>
      [...document.querySelectorAll('[aria-live],[role="status"],[role="log"],[role="alert"]')]
        .map((e) => (e.className && typeof e.className === "string" ? e.className.split(" ")[0] : e.tagName))
        .sort(),
    );
  const soloRoll = await roll();
  await invite(page);
  await addPeers(page, 2);
  await page.waitForTimeout(600);
  const roomRoll = await roll();

  const markInk = await mark(page).evaluate((el) => getComputedStyle(el).color);
  // The deck: the gallery's own echo of the table.
  await page.keyboard.press("g");
  await page.waitForTimeout(1400);
  const galleryRoll = await roll();
  const swatches = await page.evaluate(() =>
    [...document.querySelectorAll(".game-card-swatch")].map((e) => ({
      style: e.getAttribute("style"),
      bg: getComputedStyle(e).backgroundColor,
      ink: getComputedStyle(e).getPropertyValue("--color-user-ink").trim(),
    })),
  );
  say({ t: "E", engine: ti.project.name, soloRoll, roomRoll, galleryRoll, markInk, swatches });
});
