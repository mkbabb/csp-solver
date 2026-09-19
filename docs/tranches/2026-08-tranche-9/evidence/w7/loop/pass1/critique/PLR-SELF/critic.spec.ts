/**
 * PLR-SELF pass-1 CRITIC probe — independent re-measurement against the prototype worktree
 * (127.0.0.1:4241). Read-only on product files.
 */
import { test, expect, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const say = (o: unknown) => console.log(`CRITIC|${JSON.stringify(o)}`);

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
  await page.waitForTimeout(400);
}
const markState = (page: Page) =>
  page.evaluate(() => {
    const painted = (sel: string) =>
      [...document.querySelectorAll(sel)].find(
        (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
      ) as HTMLElement | null;
    const mark = painted("[data-player-mark]");
    const lobby = mark?.parentElement?.querySelector("[data-lobby]") as HTMLElement | null;
    return {
      expanded: mark?.getAttribute("aria-expanded") ?? null,
      label: mark?.getAttribute("aria-label") ?? null,
      color: mark ? getComputedStyle(mark).color : null,
      lobbyVis: lobby ? getComputedStyle(lobby).visibility : null,
      focused: document.activeElement?.getAttribute("data-player-mark") !== null
        ? "mark"
        : (document.activeElement?.className ?? document.activeElement?.tagName ?? "?"),
    };
  });

test("A · keyboard: Enter and Space on the mark", async ({ page }) => {
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 2);
  // Tab from the document start until the mark holds focus — a real keyboard walk.
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  let hops = 0;
  for (; hops < 25; hops++) {
    await page.keyboard.press("Tab");
    const on = await page.evaluate(
      () => document.activeElement?.hasAttribute("data-player-mark") ?? false,
    );
    if (on) break;
  }
  const reached = await page.evaluate(
    () => document.activeElement?.hasAttribute("data-player-mark") ?? false,
  );
  say({ case: "tab-reaches-mark", reached, hops: hops + 1 });
  const before = await markState(page);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  const afterEnter = await markState(page);
  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
  const afterSpace = await markState(page);
  say({ case: "keyboard", before, afterEnter, afterSpace });
});

test("B · Escape while open, and the hover lift on a LIVE mark", async ({ page }) => {
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 2);
  const live = await markState(page);
  const mark = page.locator("[data-player-mark]").filter({ visible: true }).first();
  await mark.click();
  await page.waitForTimeout(400);
  const open = await markState(page);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const afterEsc = await markState(page);
  say({ case: "escape", live, open, afterEsc });
  // The hover lift, on a mark that is carrying the room's ink.
  await page.mouse.move(5, 500);
  await page.waitForTimeout(300);
  const restColor = (await markState(page)).color;
  const box = await mark.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.waitForTimeout(700);
  const hoverColor = (await markState(page)).color;
  say({ case: "hover-on-live", restColor, hoverColor, same: restColor === hoverColor });
});

test("C · AA recomputed, live-region roll, deck swatch, geometry", async ({ page }) => {
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 15);
  await page.locator("[data-player-mark]").filter({ visible: true }).first().click();
  await page.waitForTimeout(700);
  const out = await page.evaluate(() => {
    const painted = (sel: string) =>
      [...document.querySelectorAll(sel)].find(
        (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
      ) as HTMLElement | null;
    const mark = painted("[data-player-mark]");
    const lobby = mark?.parentElement?.querySelector("[data-lobby]") as HTMLElement | null;
    const rows = lobby ? [...lobby.querySelectorAll(".lobby-row")] : [];
    // ---- AA, composited off the engine ----
    const cv = document.createElement("canvas");
    cv.width = cv.height = 8;
    const cx = cv.getContext("2d", { willReadFrequently: true })!;
    const bytes = (layers: string[]) => {
      cx.clearRect(0, 0, 8, 8);
      for (const l of layers) {
        cx.fillStyle = l;
        cx.fillRect(0, 0, 8, 8);
      }
      const d = cx.getImageData(4, 4, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    const lum = (c: number[]) => {
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
    };
    const ratio = (a: number[], b: number[]) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
      return +((x + 0.05) / (y + 0.05)).toFixed(2);
    };
    const resolve = (css: string) => {
      const p = document.createElement("div");
      p.style.color = css;
      document.body.appendChild(p);
      const c = getComputedStyle(p).color;
      p.remove();
      return c;
    };
    const cs = getComputedStyle(document.documentElement);
    const bg = cs.getPropertyValue("--color-background").trim() || "#ffffff";
    const popover = cs.getPropertyValue("--color-popover").trim() || "#ffffff";
    const card = cs.getPropertyValue("--color-card").trim() || "#ffffff";
    const sheetOverBg = [resolve(bg), resolve(`color-mix(in srgb, ${popover} 80%, transparent)`)];
    const sheetOverCard = [resolve(card), resolve(`color-mix(in srgb, ${popover} 80%, transparent)`)];
    const gBg = bytes(sheetOverBg);
    const gCard = bytes(sheetOverCard);
    const aa = rows.map((r) => {
      const name = r.querySelector(".lobby-name") as HTMLElement;
      const ink = getComputedStyle(name).color;
      return {
        text: name.textContent,
        ink,
        onBg: ratio(bytes([...sheetOverBg, ink]), gBg),
        onCard: ratio(bytes([...sheetOverCard, ink]), gCard),
      };
    });
    const quiet = resolve(cs.getPropertyValue("--ink-press-quiet").trim());
    const state = lobby?.querySelector(".lobby-state") as HTMLElement | null;
    const qual = lobby?.querySelector(".lobby-qualifier") as HTMLElement | null;
    // ---- live regions ----
    const regions = [
      ...document.querySelectorAll("[aria-live],[role=log],[role=status],[role=alert]"),
    ].map((e) => e.className || e.tagName);
    // ---- geometry ----
    const rect = (e: Element | null) => {
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return {
        x: +r.x.toFixed(1),
        y: +r.y.toFixed(1),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        right: +(r.x + r.width).toFixed(1),
        bottom: +(r.y + r.height).toFixed(1),
      };
    };
    const well = painted(".players-well");
    return {
      rowCount: rows.length,
      overflowLine: (lobby?.querySelector(".lobby-overflow") as HTMLElement)?.textContent ?? null,
      aa,
      quietOnSheet: ratio(bytes([...sheetOverBg, quiet]), gBg),
      stateText: state?.textContent ?? null,
      stateColor: state ? getComputedStyle(state).color : null,
      qualColor: qual ? getComputedStyle(qual).color : null,
      regions,
      regionCount: regions.length,
      markRect: rect(mark),
      lobbyRect: rect(lobby),
      lobbyScroll: lobby ? { sh: lobby.scrollHeight, ch: lobby.clientHeight, sw: lobby.scrollWidth, cw: lobby.clientWidth } : null,
      wellRect: rect(well),
      rosterTabindex: (painted(".players-roster") ?? document.querySelector(".players-roster"))?.getAttribute("tabindex") ?? null,
      lobbyCount: document.querySelectorAll("[data-lobby]").length,
      markCount: document.querySelectorAll("[data-player-mark]").length,
      filters: [...document.querySelectorAll("*")].filter((e) => {
        const c = getComputedStyle(e);
        return c.filter && c.filter !== "none" && c.display !== "none";
      }).length,
    };
  });
  say({ case: "sheet-16", ...out });
});

test("D · pi: the deck's roster echo, and the mark on the gallery", async ({ page }) => {
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 2);
  // Back to the gallery — the estate's own route out of a board.
  const back = page.locator('button[aria-label*="gallery" i], button[aria-label*="games" i]');
  const n = await back.count();
  say({ case: "back-candidates", n, labels: await back.evaluateAll((es) => es.map((e) => e.getAttribute("aria-label"))) });
  if (n) {
    await back.first().click();
    await page.waitForTimeout(900);
  }
  const out = await page.evaluate(() => {
    const sw = [...document.querySelectorAll(".game-card-swatch")].map((e) => ({
      style: (e as HTMLElement).getAttribute("style"),
      bg: getComputedStyle(e).backgroundColor,
      parentStyle: (e.parentElement as HTMLElement)?.getAttribute("style"),
    }));
    const painted = (sel: string) =>
      [...document.querySelectorAll(sel)].find(
        (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
      ) as HTMLElement | null;
    const mark = painted("[data-player-mark]");
    return {
      view: document.querySelector(".game-gallery") ? "gallery" : "board",
      swatches: sw,
      markPainted: !!mark,
      markColor: mark ? getComputedStyle(mark).color : null,
      markBox: mark ? mark.getBoundingClientRect().width : null,
    };
  });
  say({ case: "gallery", ...out });
});
