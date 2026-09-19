/**
 * PLR-SELF pass-1 PROTOTYPE PROBE — the built mark, on the real surface.
 *
 * Runs against the lane's own dev server (127.0.0.1:4242) serving the PROTOTYPE worktree.
 * Gates G1…G10 of the synthesis, plus the censuses the brief names. Nothing here edits product
 * files; the product change is the worktree's diff.
 */
import { test, expect, type Page, type Browser } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/PLR-SELF";
const SOLO = "./?size=3&difficulty=EASY&wire=local";
const DESK = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };

const say = (o: unknown) => console.log(`PROTO|${JSON.stringify(o)}`);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
/** filterBudget.ts's own note: a COLD load censuses 21 (the boot poses), the settled scene 9. */
async function settleFilters(page: Page) {
  const count = () =>
    page.evaluate(
      () =>
        [...document.querySelectorAll("*")].filter((e) => {
          const cs = getComputedStyle(e);
          return cs.filter && cs.filter !== "none" && cs.display !== "none";
        }).length,
    );
  let last = -1;
  for (let i = 0; i < 40; i++) {
    const n = await count();
    if (n === last) return n;
    last = n;
    await page.waitForTimeout(250);
  }
  return last;
}
async function invite(page: Page): Promise<string> {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  // On a phone the card is a drawer and the verb is behind its tab (the estate's own dock).
  if (!(await verb.isVisible())) {
    await page.locator(".drawer-tab").first().click();
    await page.waitForTimeout(700); // the sheet SLIDES — settle before touching it
  }
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return page.url();
}
/** Synthetic peers on the local arm — the frame a real page sends, from ids this page has never
 *  met, so `mint` hands each the NEXT real walk index. (r0's I4 instrument's own device.) */
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
  await page.waitForTimeout(250);
}

/** THE RESEARCH LANE'S `boardPrint`, VERBATIM — so this lane's hash is comparable to the HEAD
 *  baseline it banked on this tree today (chromium c8a9573efab0 / webkit d71fc9fbc33a). */
const boardPrint = (page: Page) =>
  page.evaluate(() => {
    const cells = [...document.querySelectorAll(".sudoku-cell")].slice(0, 24);
    const rows = cells.map((c) => {
      const cs = getComputedStyle(c);
      const g = c.querySelector(".glyph-svg path") as SVGElement | null;
      return [
        ((c as HTMLElement).getAttribute("style") ?? "").replace(
          /--reveal-delay:[^;]*;?/g,
          "",
        ),
        cs.color,
        cs.getPropertyValue("--color-user-ink").trim(),
        g ? getComputedStyle(g).stroke : "",
      ].join("|");
    });
    const board = document.querySelector(".board-row")?.closest("div,section,main") ?? null;
    const filters = [...document.querySelectorAll("*")].filter((e) => {
      const cs = getComputedStyle(e);
      return cs.filter && cs.filter !== "none" && cs.display !== "none";
    }).length;
    return {
      cells: rows.join("\n"),
      html: board ? board.outerHTML.length : -1,
      filters,
    };
  });

/** AA off the engine's compositor — the research lane's helper, verbatim. */
const aaTable = (
  page: Page,
  inks: string[],
  grounds: { name: string; layers: string[] }[],
) =>
  page.evaluate(
    ({ inks, grounds }) => {
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
        return [d[0], d[1], d[2]] as [number, number, number];
      };
      const lum = ([r, g, b]: number[]) => {
        const f = (v: number) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
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
      const out: Record<string, Record<string, number>> = {};
      const groundBytes: Record<string, number[]> = {};
      for (const g of grounds) groundBytes[g.name] = bytes(g.layers.map(resolve));
      for (const ink of inks) {
        out[ink] = {};
        for (const g of grounds) {
          const ib = bytes([...g.layers.map(resolve), resolve(ink)]);
          out[ink][g.name] = ratio(ib, groundBytes[g.name]);
        }
      }
      return { table: out };
    },
    { inks, grounds },
  );

const geom = (page: Page) =>
  page.evaluate(() => {
    // The head carries TWO AttributionCards (desk + mobile), one painted at any width — as it
    // has since T6.2 — so every read here is scoped to the PAINTED instance. A probe that does
    // not scope reads both lobbies and doubles every row (this lane walked into it and says so).
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
    const painted = (sel: string) =>
      [...document.querySelectorAll(sel)].find(
        (e) => e.getBoundingClientRect().width > 0,
      ) ?? null;
    const mark = painted("[data-player-mark]");
    // the lobby that belongs to the painted mark (shut, it has no box of its own to find by)
    const lobby =
      (mark?.parentElement?.querySelector("[data-lobby]") as HTMLElement | null) ??
      document.querySelector("[data-lobby]");
    const cellBoxes = [...document.querySelectorAll(".sudoku-cell")].map((c) =>
      c.getBoundingClientRect(),
    );
    const rows = lobby ? [...lobby.querySelectorAll(".lobby-row")] : [];
    return {
      trigger: rect(painted(".attribution-trigger")),
      mark: rect(mark),
      markLabel: mark?.getAttribute("aria-label") ?? null,
      markExpanded: mark?.getAttribute("aria-expanded") ?? null,
      markColor: mark ? getComputedStyle(mark).color : null,
      sun: rect(document.querySelector(".corner-right")),
      lobby: rect(lobby),
      lobbyVisible: lobby ? getComputedStyle(lobby).visibility : null,
      lobbyOverflow: lobby
        ? {
            scrollW: (lobby as HTMLElement).scrollWidth,
            clientW: (lobby as HTMLElement).clientWidth,
            scrollH: (lobby as HTMLElement).scrollHeight,
            clientH: (lobby as HTMLElement).clientHeight,
          }
        : null,
      lines: rows.map((e) => ({
        name: e.querySelector(".lobby-name")?.textContent ?? "",
        qualifier: e.querySelector(".lobby-qualifier")?.textContent ?? "",
        color: getComputedStyle(e.querySelector(".lobby-name")!).color,
        nameRight: +(
          e.querySelector(".lobby-name")!.getBoundingClientRect().right
        ).toFixed(1),
        qualX: e.querySelector(".lobby-qualifier")
          ? +e.querySelector(".lobby-qualifier")!.getBoundingClientRect().x.toFixed(1)
          : null,
      })),
      state: lobby?.querySelector(".lobby-state")?.textContent ?? null,
      overflowLine: lobby?.querySelector(".lobby-overflow")?.textContent ?? null,
      boardTop: cellBoxes.length ? +Math.min(...cellBoxes.map((b) => b.top)).toFixed(1) : null,
      boardLeft: cellBoxes.length ? +Math.min(...cellBoxes.map((b) => b.left)).toFixed(1) : null,
      well: rect(document.querySelector(".players-roster")?.closest(".tray-well") ?? null),
      regions: document.querySelectorAll("[aria-live],[role=log],[role=status]").length,
      regionList: [...document.querySelectorAll("[aria-live],[role=log],[role=status]")].map(
        (e) => `${e.tagName.toLowerCase()}.${(e.className || "").toString().split(" ")[0]}`,
      ),
      rosterRole: document.querySelector(".players-roster")?.getAttribute("role") ?? null,
      rosterSrOnly:
        document.querySelector(".players-roster")?.classList.contains("sr-only") ?? null,
      rosterTabindex:
        document.querySelector(".players-roster")?.getAttribute("tabindex") ?? null,
      headOrder: [...document.querySelectorAll("button,a,[tabindex]")]
        .filter((e) => e.getBoundingClientRect().top < 120 && (e as HTMLElement).offsetParent !== null)
        .map((e) => e.getAttribute("aria-label") ?? e.textContent?.trim()?.slice(0, 14))
        .slice(0, 6),
    };
  });

const openMark = async (page: Page) => {
  await page.locator("[data-player-mark]:visible").click();
  await page.waitForTimeout(260); // the 150ms disclosure, settled
};

// ── G1 · G2 · G3 · G4 · G8 · G10 — geometry, census, identity, both viewports ──────────
test("A · head geometry, the sheet, the census and the solo print", async ({ page }, info) => {
  mkdirSync(`${OUT}/frames`, { recursive: true });
  for (const [vpName, vp] of [
    ["desk", DESK],
    ["phone", PHONE],
  ] as const) {
    await page.setViewportSize(vp);
    await page.goto(SOLO);
    await settled(page);
    const soloFilters = await settleFilters(page);
    const solo = await boardPrint(page);
    const h = (s: string) => createHash("sha1").update(s).digest("hex").slice(0, 12);
    const shutSolo = await geom(page);
    say({
      t: "solo",
      engine: info.project.name,
      vp: vpName,
      print: h(solo.cells),
      filters: soloFilters,
      mark: shutSolo.mark,
      trigger: shutSolo.trigger,
      label: shutSolo.markLabel,
      color: shutSolo.markColor,
      sun: shutSolo.sun,
      regions: shutSolo.regions,
      roster: {
        role: shutSolo.rosterRole,
        srOnly: shutSolo.rosterSrOnly,
        tabindex: shutSolo.rosterTabindex,
      },
      boardTop: shutSolo.boardTop,
      headOrder: shutSolo.headOrder,
    });
    // G1: the solo board is the HEAD board. (Baseline: the research lane's banked hash on this
    // tree today — chromium c8a9573efab0 / webkit d71fc9fbc33a, same helper, same 24 cells.)
    expect(shutSolo.mark!.x, "the mark sits after @mbabb").toBeGreaterThan(70);
    expect(shutSolo.markLabel).toBe("no other players");

    // a room of one: still graphite, still `no other players`
    await invite(page);
    await page.waitForTimeout(300);
    const alone = await geom(page);
    // …and then a live room (the 400ms ink, settled, before any colour is read)
    await addPeers(page, 2);
    await page.waitForTimeout(700);
    const live3 = await geom(page);
    const inRoomPrint = await boardPrint(page);
    await openMark(page);
    const open3 = await geom(page);
    const openFilters = await settleFilters(page);
    if (vpName === "phone")
      await page.screenshot({
        path: `${OUT}/frames/${info.project.name}-phone-lobby-3.png`,
        clip: { x: 0, y: 0, width: 268, height: Math.ceil(open3.lobby!.bottom) + 6 },
      });
    say({
      t: "live",
      engine: info.project.name,
      vp: vpName,
      alone: { label: alone.markLabel, color: alone.markColor, mark: alone.mark },
      live: { label: live3.markLabel, color: live3.markColor },
      open: {
        lobby: open3.lobby,
        state: open3.state,
        lines: open3.lines,
        expanded: open3.markExpanded,
        overflowBox: open3.lobbyOverflow,
        visibility: open3.lobbyVisible,
      },
      well: live3.well,
      regions: live3.regions,
      regionList: live3.regionList,
      filters: openFilters,
      boardTop: live3.boardTop,
      boardLeft: live3.boardLeft,
      // G1's within-page half: the board a room is on is the board it was solo. `mint` now hands
      // SELF a walk index, and the one board-side consumer of a player's ink (`authorInk`) skips
      // self-authored cells by id — so nothing on the grid may move.
      printSoloVsRoom: [h(solo.cells), h(inRoomPrint.cells)],
      printSame: solo.cells === inRoomPrint.cells,
    });
    expect(inRoomPrint.cells, "a board in a room is the board you were solo on").toBe(
      solo.cells,
    );
    // G2 — the census does not move with the mark mounted and the sheet OPEN
    expect(openFilters, "filter census unmoved with the sheet open").toBe(soloFilters);
    // G4 — the sheet clears the sun and never overflows its own inner width
    expect(open3.lobby!.x).toBe(0);
    expect(open3.lobby!.right).toBeLessThanOrEqual(256);
    expect(open3.lobby!.right).toBeLessThan(open3.sun!.x);
    expect(open3.lobbyOverflow!.scrollW).toBeLessThanOrEqual(
      open3.lobbyOverflow!.clientW,
    );
    expect(open3.lobbyOverflow!.scrollH).toBeLessThanOrEqual(
      open3.lobbyOverflow!.clientH,
    );

    // the six-line bound: five rows + the state line (self + 5 peers = 6 lines)
    await addPeers(page, 3, 10);
    await page.waitForTimeout(250);
    const six = await geom(page);
    // and the compression line at sixteen at the table
    await addPeers(page, 10, 20);
    await page.waitForTimeout(350);
    const sixteen = await geom(page);
    say({
      t: "bounds",
      engine: info.project.name,
      vp: vpName,
      six: {
        lobby: six.lobby,
        state: six.state,
        rows: six.lines.length,
        overflowLine: six.overflowLine,
      },
      sixteen: {
        lobby: sixteen.lobby,
        state: sixteen.state,
        rows: sixteen.lines.length,
        overflowLine: sixteen.overflowLine,
        names: sixteen.lines.map((l) => l.name),
        inks: sixteen.lines.map((l) => l.color),
      },
      boardTop: sixteen.boardTop,
      boardLeft: sixteen.boardLeft,
      // The sheet clears the board if it ends above it OR stops left of it — on the desk the
      // board is centred at x ≈ 512, so a 256-wide sheet in the corner never meets it.
      clearsBoard:
        sixteen.lobby!.bottom <= (sixteen.boardTop ?? 1e9) ||
        sixteen.lobby!.right <= (sixteen.boardLeft ?? 1e9),
    });
    // THE INCUMBENT, FOR SCALE: the @mbabb card hangs off the same origin, and what IT does to
    // the board is the estate's own precedent for what a head disclosure may cover.
    const incumbent = await page.evaluate(() => {
      const trig = [...document.querySelectorAll(".attribution-trigger")].find(
        (e) => e.getBoundingClientRect().width > 0,
      ) as HTMLElement;
      trig.click();
      const card = trig.parentElement!.querySelector(".hover-card") as HTMLElement;
      const r = card.getBoundingClientRect();
      trig.click();
      return {
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        bottom: +(r.y + r.height).toFixed(1),
      };
    });
    say({ t: "incumbent-card", engine: info.project.name, vp: vpName, incumbent });

    // G4/G8 — six lines, and the sheet inside its own width
    expect(six.lines.length + 1, "six lines at five peers").toBeLessThanOrEqual(6);
    expect(sixteen.overflowLine).toBe("and 12 more");
    if (vpName === "phone") {
      expect(
        sixteen.lobby!.bottom,
        "on a phone the compressed sheet clears the board's top",
      ).toBeLessThanOrEqual(sixteen.boardTop ?? 1e9);
    }

    // frames: the head shut (solo/live) and the open sheet
    const engine = info.project.name;
    if (vpName === "phone") {
      await page.screenshot({
        path: `${OUT}/frames/${engine}-${vpName}-lobby-16.png`,
        clip: { x: 0, y: 0, width: 268, height: Math.ceil(sixteen.lobby!.bottom) + 6 },
      });
    }
    await page.evaluate(() =>
      ([...document.querySelectorAll("[data-player-mark]")].find(
        (e) => e.getBoundingClientRect().width > 0,
      ) as HTMLElement)?.click(),
    );
  }
});

// ── G3 — the tap floor, with its negative control ────────────────────────────────────
test("B · the mark clears 44 in BOTH dimensions under a coarse pointer", async ({
  browser,
}, info) => {
  const ctx = await browser.newContext({
    viewport: PHONE,
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: info.project.name === "chromium",
  });
  const page = await ctx.newPage();
  await page.goto(SOLO);
  await settled(page);
  const m = await page.evaluate(() => {
    const b = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    ) as HTMLElement;
    const r = b.getBoundingClientRect();
    // the negative control: a box declaring the floor MINUS 4, in the same head, same rules
    const ctrl = document.createElement("button");
    ctrl.style.cssText = "min-width:40px;min-height:40px;padding:0;border:none";
    b.parentElement!.appendChild(ctrl);
    const cr = ctrl.getBoundingClientRect();
    ctrl.remove();
    return {
      coarse: matchMedia("(pointer: coarse)").matches,
      mark: { w: +r.width.toFixed(1), h: +r.height.toFixed(1) },
      control: { w: +cr.width.toFixed(1), h: +cr.height.toFixed(1) },
      tapFloor: getComputedStyle(
        document.querySelector(".page-root") ?? document.body,
      ).getPropertyValue("--tap-floor"),
    };
  });
  say({ t: "tap-floor", engine: info.project.name, ...m });
  expect(m.coarse, "the probe is actually on a coarse pointer").toBe(true);
  expect(m.mark.w).toBeGreaterThanOrEqual(44);
  expect(m.mark.h).toBeGreaterThanOrEqual(44);
  expect(m.control.w, "the negative control fails the width arm").toBeLessThan(44);
  expect(m.control.h, "the negative control fails the height arm").toBeLessThan(44);
  await ctx.close();
});

// ── G5 — AA on the sheet's REAL ground, light and dark ───────────────────────────────
test("C · every ink the sheet paints clears 4.5:1 on its own ground", async ({ page }, info) => {
  await page.goto(SOLO);
  await settled(page);
  for (const theme of ["light", "dark"] as const) {
    await page.evaluate((t) => {
      document.documentElement.classList.toggle("dark", t === "dark");
    }, theme);
    await page.waitForTimeout(120);
    const walk = Array.from(
      { length: 16 },
      (_, i) => `oklch(var(--peer-ink-l) 0.11 ${((i * 137.5) % 360).toFixed(1)}deg)`,
    );
    const { table } = await aaTable(
      page,
      [...walk, "var(--ink-press-quiet)", "var(--color-pencil-graphite)"],
      [
        {
          name: "popover80-over-background",
          layers: ["var(--color-background)", "color-mix(in srgb, var(--color-popover) 80%, transparent)"],
        },
        {
          name: "popover80-over-card",
          layers: ["var(--color-card)", "color-mix(in srgb, var(--color-popover) 80%, transparent)"],
        },
      ],
    );
    const walkRatios = walk.flatMap((w) => Object.values(table[w]));
    say({
      t: "aa",
      engine: info.project.name,
      theme,
      worstWalk: Math.min(...walkRatios),
      quiet: table["var(--ink-press-quiet)"],
      graphite: table["var(--color-pencil-graphite)"],
      perIndexWorst: walk.map((w) => Math.min(...Object.values(table[w]))),
    });
    expect(Math.min(...walkRatios), `first-16 walk on the sheet, ${theme}`).toBeGreaterThanOrEqual(4.5);
    expect(
      Math.min(...Object.values(table["var(--ink-press-quiet)"])),
      `the quiet rung on the sheet, ${theme}`,
    ).toBeGreaterThanOrEqual(4.5);
  }
});

// ── G6 · G7 — the regions, and M19 whole ─────────────────────────────────────────────
async function joinPair(browser: Browser) {
  const ctx = await browser.newContext({ viewport: DESK });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  return { ctx, a, b, link };
}

test("D · M19 — a third arrival moves no focus, opens nothing, and still says so", async ({
  browser,
}, info) => {
  const { ctx, a, link } = await joinPair(browser);
  await expect.poll(() => a.locator("[data-player-mark]:visible").getAttribute("aria-label")).toBe(
    "1 other player",
  );
  const regions = await a.evaluate(
    () => document.querySelectorAll("[aria-live],[role=log],[role=status]").length,
  );
  // park the focus in a cell, sheet shut
  await a.locator(".sudoku-cell").first().click();
  const before = await a.evaluate(() => {
    const e = document.activeElement as HTMLElement | null;
    return { tag: e?.tagName ?? "", cls: e?.className ?? "", id: e?.id ?? "" };
  });
  const c = await ctx.newPage();
  await c.goto(link);
  await settled(c);
  await expect
    .poll(() => a.locator("[data-player-mark]:visible").getAttribute("aria-label"))
    .toBe("2 other players");
  const after = await a.evaluate(() => {
    const e = document.activeElement as HTMLElement | null;
    const mark = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    ) as HTMLElement;
    const lobby = mark.parentElement!.querySelector("[data-lobby]") as HTMLElement;
    return {
      focus: { tag: e?.tagName ?? "", cls: e?.className ?? "", id: e?.id ?? "" },
      lobbyVisibility: getComputedStyle(lobby).visibility,
      label: [...document.querySelectorAll("[data-player-mark]")]
        .find((e) => e.getBoundingClientRect().width > 0)
        ?.getAttribute("aria-label"),
      regions: document.querySelectorAll("[aria-live],[role=log],[role=status]").length,
      rosterRole: document.querySelector(".players-roster")?.getAttribute("role"),
      rosterRows: document.querySelectorAll(".players-roster .player-row").length,
    };
  });
  say({ t: "m19", engine: info.project.name, regions, before, after });
  expect(after.focus).toEqual(before); // focus unmoved
  expect(after.lobbyVisibility).toBe("hidden"); // nothing opened
  expect(after.label).toBe("2 other players"); // and it still said so
  expect(after.regions).toBe(regions); // G6 — no region minted, none lost
  expect(after.rosterRole).toBe("log");
  await ctx.close();
});

// ── the pair, in frames, both themes ─────────────────────────────────────────────────
test("E · frames — the head shut, solo and live, both viewports and both themes", async ({
  browser,
}, info) => {
  const engine = info.project.name;
  for (const [vpName, vp] of [
    ["desk", DESK],
    ["phone", PHONE],
  ] as const) {
    const ctx = await browser.newContext({
      viewport: vp,
      deviceScaleFactor: vpName === "phone" ? 3 : 1,
      hasTouch: vpName === "phone",
      isMobile: vpName === "phone" && engine === "chromium",
    });
    const page = await ctx.newPage();
    await page.goto(SOLO);
    await settled(page);
    const clip = { x: 0, y: 0, width: 200, height: 52 };
    await page.screenshot({ path: `${OUT}/frames/${engine}-${vpName}-solo-light.png`, clip });
    await invite(page);
    // THE WIRE IS BUILT ASYNCHRONOUSLY. `?s=` appears before `joinSession` has awaited its
    // identity import and constructed the channel, and a BroadcastChannel has no replay — peers
    // posted into that gap are simply lost (measured here: webkit's phone pass read a quiet
    // mark and a room of one).
    await page.waitForTimeout(500);
    await addPeers(page, 2);
    await page.waitForTimeout(700); // the 400ms ink, settled
    const live = await geom(page);
    await page.screenshot({ path: `${OUT}/frames/${engine}-${vpName}-live-light.png`, clip });
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    await page.waitForTimeout(600);
    const dark = await geom(page);
    await page.screenshot({ path: `${OUT}/frames/${engine}-${vpName}-live-dark.png`, clip });
    if (vpName === "phone") {
      await openMark(page);
      const open = await geom(page);
      say({ t: "dark-lobby", engine, lobby: open.lobby, lines: open.lines, state: open.state });
    }
    say({
      t: "frames",
      engine,
      vp: vpName,
      liveColor: live.markColor,
      darkColor: dark.markColor,
      mark: live.mark,
      trigger: live.trigger,
    });
    await ctx.close();
  }
});
