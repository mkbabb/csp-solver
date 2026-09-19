/**
 * PLR-SELF pass-2 CRITIC probe. Non-author readings, both engines.
 *
 * PROTO = the prototype worktree on 127.0.0.1:4245. HEAD = the main tree (a8fee1f5) on
 * 127.0.0.1:4246, read-only, as the pi control. Every line printed with `CRIT|`.
 */
import { test, expect, type Page } from "@playwright/test";

const PROTO = "http://127.0.0.1:4245";
const HEAD = "http://127.0.0.1:4246";
const SOLO = "/?size=3&difficulty=EASY&wire=local";
const say = (o: unknown) => console.log(`CRIT|${JSON.stringify(o)}`);

async function settled(page: Page): Promise<void> {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".game-cell .glyph-svg, .sudoku-cell .glyph-svg").count(), {
      timeout: 60000,
    })
    .toBeGreaterThan(0);
}

async function invite(page: Page): Promise<string> {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  if (!(await verb.isVisible())) {
    await page.locator(".drawer-tab").first().click();
    await page.waitForTimeout(700);
  }
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  await expect
    .poll(() => page.locator(".players-roster .player-row").count(), { timeout: 20000 })
    .toBe(1);
  return page.url();
}

async function addPeers(page: Page, n: number, from = 1): Promise<void> {
  const room = new URL(page.url()).searchParams.get("s")!;
  await page.evaluate(
    ({ room, n, from }) => {
      const ch = new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < n; i++)
        ch.postMessage({ kind: "hi", data: {}, from: `synth-${from + i}` });
      setTimeout(() => ch.close(), 0);
    },
    { room, n, from },
  );
  await expect
    .poll(() => page.locator(".players-roster .player-row").count(), { timeout: 20000 })
    .toBe(n + from);
}

/** Rect census of the head, as one comparable object. */
const HEAD_SELECTORS = [
  ".corner-left",
  ".mobile-attribution",
  ".attribution-trigger",
  ".corner-right",
  "svg.handwritten-logo",
  ".dark-mode-toggle",
];

async function headCensus(page: Page) {
  return page.evaluate((sels) => {
    const r = (e: Element) => {
      const b = e.getBoundingClientRect();
      return [
        +b.x.toFixed(2),
        +b.y.toFixed(2),
        +b.width.toFixed(2),
        +b.height.toFixed(2),
      ];
    };
    const out: Record<string, unknown> = {};
    for (const s of sels) {
      const els = [...document.querySelectorAll(s)];
      out[s] = els.map((e) => ({
        rect: r(e),
        vis: getComputedStyle(e).display !== "none",
      }));
    }
    return out;
  }, HEAD_SELECTORS);
}

// ── 1 · pi: the head in the DECK, where this family claims nothing ────────────────────────
for (const vp of [
  { name: "desk-1280", width: 1280, height: 800 },
  { name: "phone-390", width: 390, height: 844 },
]) {
  test(`pi deck head ${vp.name}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const a = await ctx.newPage();
    const b = await ctx.newPage();
    await a.goto(`${PROTO}/`);
    await b.goto(`${HEAD}/`);
    for (const p of [a, b]) await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await a.waitForTimeout(1200);
    await b.waitForTimeout(1200);
    const proto = await headCensus(a);
    const head = await headCensus(b);
    say({ t: "pi-deck", engine: info.project.name, vp: vp.name, proto, head });
    await ctx.close();
  });
}

// ── 2 · the room: I2, G10, G2, G3 re-run by a non-author ──────────────────────────────────
test("room readings desk", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto(`${PROTO}${SOLO}`);
  await settled(a);

  // filters BEFORE a room, shut
  const census = async () =>
    a.evaluate(
      () =>
        [...document.querySelectorAll("*")].filter((e) => {
          const cs = getComputedStyle(e);
          return cs.filter && cs.filter !== "none" && cs.display !== "none";
        }).length,
    );
  const settleFilters = async () => {
    let last = -1;
    for (let i = 0; i < 40; i++) {
      const n = await census();
      if (n === last) return n;
      last = n;
      await a.waitForTimeout(250);
    }
    return last;
  };
  const filtersSolo = await settleFilters();

  await invite(a);
  await addPeers(a, 2);

  const mark = a.locator("[data-player-mark]:visible");
  await expect(mark).toHaveCount(1);
  // MOTION.presenceInkMs is 400 and it starts at the join: a reading taken the instant the
  // roster settles is MID-FLIGHT, not rest. Settle it.
  const midFlight = await mark.evaluate((e) => getComputedStyle(e).color);
  await a.waitForTimeout(900);
  const rest = await mark.evaluate((e) => getComputedStyle(e).color);
  const restPose = await mark.evaluate(
    (e) => e.querySelector("path")!.getAttribute("d")!.length,
  );
  await mark.hover();
  await a.waitForTimeout(150);
  const hovered = await mark.evaluate((e) => getComputedStyle(e).color);
  const hoverPose = await mark.evaluate(
    (e) => e.querySelector("path")!.getAttribute("d")!.length,
  );
  // I2: my own swatch in the well vs my own ink on the mark vs my own lobby row
  const selfSwatch = await a.evaluate(() => {
    const li = [...document.querySelectorAll(".players-roster .player-row")].find((e) =>
      e.querySelector(".player-self"),
    )!;
    return getComputedStyle(li.querySelector(".player-swatch")!).backgroundColor;
  });
  await mark.click();
  await a.waitForTimeout(400);
  const lobbyOpen = await a.locator("[data-lobby]:visible").count();
  const selfRow = await a.evaluate(() => {
    const rows = [...document.querySelectorAll("[data-lobby] .lobby-row")];
    const hit = rows.find((r) => r.textContent?.includes("you"));
    return hit ? getComputedStyle(hit.querySelector(".lobby-name")!).color : "";
  });
  const filtersOpen = await settleFilters();
  const markBox = await mark.boundingBox();
  const lobbyBox = await a.locator("[data-lobby]:visible").boundingBox();
  const stateLine = await mark.getAttribute("aria-label");
  say({
    t: "room",
    engine: info.project.name,
    filtersSolo,
    filtersOpen,
    midFlight,
    rest,
    hovered,
    restPose,
    hoverPose,
    selfSwatch,
    selfRow,
    lobbyOpen,
    markBox,
    lobbyBox,
    stateLine,
  });
  await ctx.close();
});

// ── 3 · AA, computed by the critic from the tokens the page actually resolves ─────────────
for (const theme of ["light", "dark"] as const) {
  test(`aa walk ${theme}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: theme,
    });
    const a = await ctx.newPage();
    await a.goto(`${PROTO}${SOLO}`);
    await a.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await a.waitForTimeout(800);
    const readings = await a.evaluate(() => {
      const paint = (css: string): [number, number, number] => {
        const c = document.createElement("canvas");
        c.width = c.height = 4;
        const g = c.getContext("2d", { colorSpace: "srgb" })!;
        g.fillStyle = css;
        g.fillRect(0, 0, 4, 4);
        const d = g.getImageData(1, 1, 1, 1).data;
        return [d[0], d[1], d[2]];
      };
      const over = (
        fg: [number, number, number],
        alpha: number,
        bg: [number, number, number],
      ): [number, number, number] =>
        [0, 1, 2].map((i) => Math.round(fg[i] * alpha + bg[i] * (1 - alpha))) as [
          number,
          number,
          number,
        ];
      const cs = getComputedStyle(document.documentElement);
      const popover = cs.getPropertyValue("--color-popover").trim();
      const bg = cs.getPropertyValue("--color-background").trim();
      const card = cs.getPropertyValue("--color-card").trim();
      const l = cs.getPropertyValue("--peer-ink-l").trim();
      // the quiet rung, resolved to its composited pieces
      const probe = document.createElement("span");
      probe.style.color = "var(--ink-press-quiet)";
      document.body.appendChild(probe);
      const quiet = getComputedStyle(probe).color;
      probe.remove();
      const walk: Record<string, [number, number, number]> = {};
      for (let i = 0; i < 40; i++)
        walk[String(i)] = paint(`oklch(${l} 0.11 ${((i * 137.5) % 360).toFixed(1)}deg)`);
      return {
        popoverRaw: popover,
        popover: paint(popover),
        bg: paint(bg),
        card: paint(card),
        peerInkL: l,
        quietRaw: quiet,
        walk,
        over: over([38, 38, 38], 0.68, paint(popover)),
      };
    });
    say({ t: "aa", engine: info.project.name, theme, readings });
    await ctx.close();
  });
}

// ── 4 · coarse phone: tap floor + the sheet's lap, re-read ────────────────────────────────
test("coarse phone mark", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: info.project.name === "chromium",
  });
  const a = await ctx.newPage();
  await a.goto(`${PROTO}${SOLO}`);
  await settled(a);
  await invite(a);
  await addPeers(a, 4);
  const mark = a.locator("[data-player-mark]:visible");
  const box = await mark.boundingBox();
  await mark.click();
  await a.waitForTimeout(400);
  const sheet = await a.locator("[data-lobby]:visible").boundingBox();
  const grid = await a.evaluate(() => {
    const g = document.querySelector(".board-wrapper, .game-board, .sudoku-board");
    return g ? g.getBoundingClientRect().top : null;
  });
  const rows = await a.locator("[data-lobby]:visible .lobby-row").count();
  const overflow = await a.locator("[data-lobby]:visible .lobby-overflow").innerText().catch(() => "");
  say({ t: "coarse", engine: info.project.name, box, sheet, grid, rows, overflow });
  await ctx.close();
});
