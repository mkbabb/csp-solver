/**
 * PLR-SELF pass 2 — G7 (M19-whole) · G8 (keys, off el.focus()) · G9 (the real Tab route and the
 * ring) · G11 (the focusout seam). The rig constraint research banked: WebKit here will not Tab
 * to a `<button>` (macOS full-keyboard-access is off and Playwright inherits it), and a
 * programmatic focus arms `:focus-visible` on neither engine — so the key contract and the tab
 * route are two rows, and the second is chromium's with a loud skip.
 */
import { test, expect, type BrowserContext } from "@playwright/test";
import { SOLO, DESK, say, settled, invite, addPeers, mark, lobby } from "./harness";

test("G8 — Space opens, Space closes, Enter opens, Escape closes; focus never leaves", async ({
  page,
}) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 1);
  await page.waitForTimeout(600);

  const m = mark(page);
  await m.evaluate((el: HTMLElement) => el.focus());
  const read = async (label: string) => {
    await page.waitForTimeout(220);
    const r = await m.evaluate((el) => ({
      expanded: el.getAttribute("aria-expanded"),
      focused: el === document.activeElement,
      inSheet: !!document.activeElement?.hasAttribute("data-lobby"),
      activeRole: document.activeElement?.getAttribute("role") ?? "",
      activeName: document.activeElement?.getAttribute("aria-label") ?? "",
    }));
    return { label, ...r };
  };
  // THE TRAIL CHANGED SHAPE AT PASS 3, and the shape IS the disposition: a keyboard open hands
  // focus to the sheet, so the key that shuts it is Escape and not a second Space — Space
  // belongs to whatever has focus, and after the open that is the sheet.
  const trail = [await read("focused")];
  await page.keyboard.press("Space");
  trail.push(await read("space-1"));
  await page.keyboard.press("Escape");
  trail.push(await read("escape-1"));
  await page.keyboard.press("Enter");
  trail.push(await read("enter-1"));
  await page.keyboard.press("Escape");
  trail.push(await read("escape-2"));

  say({ g: "G8", trail });
  expect(trail[1].expanded, "Space opens").toBe("true");
  expect(trail[2].expanded, "Escape closes").toBe("false");
  expect(trail[3].expanded, "Enter opens (one activation, not two)").toBe("true");
  expect(trail[4].expanded, "Escape closes it again").toBe("false");
  // PASS 3, THE A4 DISPOSITION: a KEYBOARD open moves focus INTO the sheet, which is the whole
  // of how the rows became AT-readable when the roster lost its `tabindex`. Pass 2's "focus
  // stays on the mark through all five" is the assertion this replaces, and the two cannot
  // both be true.
  expect(trail[1].inSheet, "Space opens AND hands focus to the sheet").toBe(true);
  expect(trail[1].activeRole, "which is a named group").toBe("group");
  expect(trail[1].activeName, "named by the state line").toBe("1 other player");
  expect(trail[2].focused, "Escape returns focus to the mark — focus WAS inside").toBe(true);
  expect(trail[3].inSheet, "Enter opens it the same way").toBe(true);
  expect(trail[4].focused, "and Escape returns it again").toBe(true);
});

test("G9 — the real Tab route arms :focus-visible, the ring and pose [1]", async ({
  page,
}, info) => {
  test.skip(
    info.project.name === "webkit",
    "WebKit in this rig will not Tab to a <button>: macOS full-keyboard-access is off by " +
      "default and Playwright inherits it (research row A — 30 hops, isActive false). The key " +
      "CONTRACT is asserted on both engines by G8; this row reads the ring, which only a real " +
      "Tab can arm, so it runs on chromium and is loudly skipped here rather than silently " +
      "weakened.",
  );
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 1);
  await page.waitForTimeout(600);

  const m = mark(page);
  const restD = await m.evaluate(
    (el) => el.querySelector("path")?.getAttribute("d") ?? "",
  );
  let hops = 0;
  for (; hops < 30; hops++) {
    await page.keyboard.press("Tab");
    if (await m.evaluate((el) => el === document.activeElement)) break;
  }
  await page.waitForTimeout(150);
  const got = await m.evaluate((el) => ({
    isActive: el === document.activeElement,
    focusVisible: el.matches(":focus-visible"),
    outlineStyle: getComputedStyle(el).outlineStyle,
    outlineWidth: getComputedStyle(el).outlineWidth,
    outlineColor: getComputedStyle(el).outlineColor,
    outlineOffset: getComputedStyle(el).outlineOffset,
    color: getComputedStyle(el).color,
    d: el.querySelector("path")?.getAttribute("d") ?? "",
  }));
  say({ g: "G9", hops, ...got, poseMoved: got.d !== restD });
  expect(got.isActive, "Tab reaches the mark").toBe(true);
  expect(got.focusVisible).toBe(true);
  expect(got.outlineStyle).toBe("dashed");
  expect(got.outlineWidth).toBe("2px");
  expect(got.outlineOffset).toBe("3px");
  expect(got.outlineColor, "the ring is currentColor — the mark's own ink").toBe(
    got.color,
  );
  expect(got.d, "and the stub is picked up").not.toBe(restD);
});

test("G11 — a mouse press on the mark sends no cur frame and the cell keeps focus", async ({
  page,
}) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 1);
  await page.waitForTimeout(600);

  // Tap the wire: every frame this page SENDS, recorded off the room's own channel.
  await page.evaluate(() => {
    const room = new URL(location.href).searchParams.get("s")!;
    const w = window as unknown as Record<string, unknown>;
    const seen: unknown[] = [];
    w.__frames = seen;
    const ch = new BroadcastChannel(`board:${room}`);
    ch.onmessage = (e: MessageEvent) => seen.push(e.data);
    w.__tap = ch;
  });

  const cell = page.locator(".sudoku-cell input").first();
  await cell.click();
  await page.waitForTimeout(400);
  const before = await page.evaluate(() => ({
    frames: ((window as any).__frames as any[]).length,
    active: document.activeElement?.className ?? "",
  }));
  await page.evaluate(() => ((window as any).__frames as any[]).splice(0));

  await mark(page).click();
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => {
    const frames = (window as any).__frames as any[];
    const el = document.activeElement as HTMLElement | null;
    return {
      kinds: frames.map((f) => f?.kind),
      cur: frames.filter((f) => f?.kind === "cur").length,
      active: el?.tagName.toLowerCase() + "." + (el?.className || ""),
      inCell: !!el?.closest(".sudoku-cell"),
      expanded: document
        .querySelector("[data-player-mark]")
        ?.getAttribute("aria-expanded"),
    };
  });
  say({ g: "G11", before, after });
  expect(after.expanded, "the press still opens the sheet").toBe("true");
  expect(after.cur, "and it tells the room nothing").toBe(0);
  expect(after.inCell, "the cell you were writing in keeps focus").toBe(true);
});

test("G7 — a third page joins: focus unmoved, the sheet shut, the name mutated", async ({
  browser,
}) => {
  const ctx: BrowserContext = await browser.newContext({ viewport: DESK });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await a.bringToFront();
  await expect.poll(() => a.locator(".players-roster .player-row").count()).toBe(2);

  const cell = a.locator(".sudoku-cell input").first();
  await cell.click();
  const before = await a.evaluate(() => ({
    active: document.activeElement?.getAttribute("aria-label") ?? "",
    label: document.querySelector("[data-player-mark]")?.getAttribute("aria-label"),
    lobbyVisible: [...document.querySelectorAll("[data-lobby]")].some(
      (e) => getComputedStyle(e).visibility === "visible",
    ),
  }));

  const c = await ctx.newPage();
  await c.goto(link);
  await settled(c);
  await a.bringToFront();
  await expect.poll(() => a.locator(".players-roster .player-row").count()).toBe(3);
  await a.waitForTimeout(600);
  const after = await a.evaluate(() => ({
    active: document.activeElement?.getAttribute("aria-label") ?? "",
    label: document.querySelector("[data-player-mark]")?.getAttribute("aria-label"),
    lobbyVisible: [...document.querySelectorAll("[data-lobby]")].some(
      (e) => getComputedStyle(e).visibility === "visible",
    ),
  }));
  say({ g: "G7", before, after });
  expect(after.active, "a remote arrival moves nobody's focus").toBe(before.active);
  expect(after.lobbyVisible, "and opens no sheet").toBe(false);
  expect(after.label, "the name says so").not.toBe(before.label);
  expect(after.label).toBe("2 other players");
  await ctx.close();
});
