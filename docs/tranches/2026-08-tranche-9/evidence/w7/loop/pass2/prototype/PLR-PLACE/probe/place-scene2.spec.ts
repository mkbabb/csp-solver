/**
 * PLR-PLACE · PASS-2 GATES — the desk scene.
 *
 * Runs against the pass-2 worktree's dev server (127.0.0.1:4243). Everything is read off the
 * real surface: the product's own `PlayerSign`, `PlayerLobby`, `PlaceChart`. Every opening is a
 * REAL press (`locator.click()`), never `el.click()` inside `page.evaluate` — the whole family
 * turns on what a real press does to focus, so a synthetic one proves nothing.
 *
 * Rows: r0 I3 (:visible + the Enter arm) · G2 self-ring · G3 seam · G4 head-still · G5 opt-out
 *       G6 M19 · G7 census · G9 caption · G10 board-unbound · G11 regions · G14 pitch
 *       G16 query · G17 keys.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const HOME =
  process.env.PLC_HOME ||
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/PLR-PLACE";
const OUT = join(HOME, "logs");
const say = (k: string, v: unknown) =>
  console.log(`PLC|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);
const bank: Record<string, unknown> = {};
const rec = (k: string, v: unknown) => {
  bank[k] = v;
  say(k, v);
};

const MARK = "[data-player-mark]";
const LOBBY = "[data-lobby]";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

/** The VISIBLE mark — the head mounts both instances, one of them `display: none`. */
function mark(page: Page) {
  return page.locator(MARK).locator("visible=true").first();
}
function sheet(page: Page) {
  return page.locator(`${LOBBY}:visible`);
}
/** A REAL press, then the slide settles (~700ms budget on a sheet declared at 150ms). */
async function press(page: Page) {
  await mark(page).click();
  await page.waitForTimeout(800);
}

const census = (p: Page) =>
  p.evaluate(() => {
    let total = 0;
    for (const el of document.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      if (cs.filter === "none" || cs.display === "none") continue;
      total++;
    }
    return total;
  });

const box = (p: Page, sel: string) =>
  p.evaluate((s) => {
    const el = [...document.querySelectorAll(s)].find(
      (e) =>
        (e as HTMLElement).offsetParent !== null ||
        getComputedStyle(e).position === "fixed",
    ) as HTMLElement | undefined;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: +r.x.toFixed(1),
      y: +r.y.toFixed(1),
      w: +r.width.toFixed(1),
      h: +r.height.toFixed(1),
    };
  }, sel);

async function invite(page: Page): Promise<string> {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return page.url();
}

/** Listen to the room's own frames from a SECOND page — the wire as a peer hears it. */
async function tapWire(p: Page, room: string) {
  await p.evaluate((r) => {
    const w = window as unknown as {
      __curs: { t: number; p: number | null; from: string }[];
      __tap?: BroadcastChannel;
    };
    w.__curs = [];
    w.__tap?.close();
    const ch = new BroadcastChannel(`board:${r}`);
    w.__tap = ch;
    ch.onmessage = (ev: MessageEvent) => {
      if (ev.data?.kind === "cur")
        w.__curs.push({ t: Date.now(), p: ev.data.data?.p ?? null, from: ev.data.from });
    };
  }, room);
}
const drainWire = (p: Page) =>
  p.evaluate(
    () =>
      (window as unknown as { __curs: { t: number; p: number | null; from: string }[] })
        .__curs.slice(),
  );

async function drivePeers(a: Page, b: Page, room: string, n: number, spread = 5) {
  await a.evaluate((r) => {
    const w = window as unknown as { __st: unknown; __ch: BroadcastChannel };
    w.__st = null;
    const ch = new BroadcastChannel(`board:${r}`);
    w.__ch = ch;
    ch.onmessage = (ev: MessageEvent) => {
      if (ev.data?.kind === "st") w.__st = ev.data.data;
    };
  }, room);
  await b.evaluate(() => {
    const ch = new BroadcastChannel(
      `board:${new URL(location.href).searchParams.get("s")}`,
    );
    ch.postMessage({ kind: "hi", data: {}, from: "p-probe000000" });
    ch.close();
  });
  await a.waitForTimeout(600);
  const drove = await a.evaluate(
    ([count, step]) => {
      const w = window as unknown as {
        __st: { e: number; ea: string } | null;
        __ch: BroadcastChannel;
      };
      if (!w.__st) return "no st captured";
      const { e, ea } = w.__st;
      for (let i = 0; i < count; i++) {
        const id = `p-fake${String(i).padStart(8, "0")}`;
        w.__ch.postMessage({ kind: "hi", data: { ack: true }, from: id });
        w.__ch.postMessage({ kind: "cur", data: { p: i * step + 1, e, ea }, from: id });
      }
      return `drove ${count}`;
    },
    [n, spread],
  );
  await a.waitForTimeout(1200);
  return drove;
}

test("THE DESK SCENE — I3, the seam, the ring, the query, the keys", async ({
  browser,
}, info) => {
  const eng = info.project.name;
  mkdirSync(OUT, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);

  // ── r0 I3, MOVED: the box is MOUNTED now, so the row reads `:visible`, 1 of 2 ───────────
  rec("i3.lobbyNodes", await a.locator(LOBBY).count());
  rec("i3.lobbyVisibleBefore", await sheet(a).count());
  const i3 = await a.evaluate(() => {
    const out: { x: number; y: number; w: number; h: number; name: string }[] = [];
    for (const b of document.querySelectorAll("button")) {
      const r = b.getBoundingClientRect();
      const name = b.getAttribute("aria-label") || b.textContent?.trim() || "";
      if (r.width === 0) continue;
      if (!/player/i.test(name)) continue;
      if (r.x < 200 && r.y < 120)
        out.push({
          x: +r.x.toFixed(1),
          y: +r.y.toFixed(1),
          w: +r.width.toFixed(1),
          h: +r.height.toFixed(1),
          name,
        });
    }
    return out;
  });
  rec("i3.candidates", i3);
  expect(i3.length, "I3: one head mark named /player/").toBe(1);

  // G7 filter census, polled to settled, sign mounted + sheet SHUT
  await expect.poll(async () => await census(a), { timeout: 30000 }).toBe(9);
  rec("g7.desk.shut", await census(a));

  await press(a);
  rec("i3.lobbyVisibleAfter", await sheet(a).count());
  expect(await sheet(a).count(), "I3 MOVED: 1 of 2 visible").toBe(1);
  rec("g7.desk.open.solo", await census(a));
  rec("solo.stateLine", (await sheet(a).locator(".lobby-state").textContent())?.trim());
  rec("solo.signBox", await box(a, MARK));
  rec("solo.lobbyBox", await box(a, LOBBY));

  // G2 self-ring, SOLO, under a REAL press: the ring paints because `lastCell` outlives focus.
  await a.keyboard.press("Escape");
  await a.waitForTimeout(300);
  await a.locator(".sudoku-cell").nth(40).click(); // a real MOUSE press on a cell
  await a.waitForTimeout(200);
  const focusBeforePress = await a.evaluate(
    () => document.activeElement?.closest(".sudoku-cell")?.getAttribute("aria-label") ?? "",
  );
  await press(a);
  const g2mouse = {
    focusBeforePress,
    focusAfterPress: await a.evaluate(
      () =>
        document.activeElement?.closest(".sudoku-cell")?.getAttribute("aria-label") ?? "",
    ),
    selfRings: await sheet(a).locator(".chart-self").count(),
  };
  rec("g2.mouse.solo", g2mouse);

  // G2 keyboard arm: a real Tab route to the sign, then Enter. The cell loses focus honestly
  // and the chart survives from `lastCell`.
  await a.keyboard.press("Escape");
  await a.waitForTimeout(300);
  await a.locator(".sudoku-cell").nth(22).click();
  await a.waitForTimeout(200);
  await mark(a).focus();
  await a.waitForTimeout(150);
  const focusOnSign = await a.evaluate(
    () => document.activeElement?.getAttribute("data-player-mark") !== null,
  );
  await a.keyboard.press("Enter");
  await a.waitForTimeout(800);
  const g2key = {
    focusOnSign,
    open: await sheet(a).count(),
    selfRings: await sheet(a).locator(".chart-self").count(),
    expanded: await mark(a).getAttribute("aria-expanded"),
  };
  rec("g2.keyboard.solo", g2key);

  // G17: Escape closes a KEYBOARD-opened sheet; Space toggles.
  await a.keyboard.press("Escape");
  await a.waitForTimeout(300);
  rec("g17.escapeAfterEnter", await sheet(a).count());
  await mark(a).focus();
  await a.keyboard.press(" ");
  await a.waitForTimeout(700);
  rec("g17.spaceOpens", await sheet(a).count());
  await a.keyboard.press(" ");
  await a.waitForTimeout(500);
  rec("g17.spaceCloses", await sheet(a).count());

  // G14 pitch, at three sizes. The chart box is 10.667·N and the dot is 8.00 whatever N is.
  const pitchAt = async (size: number) => {
    await a.goto(`./?size=${size}&difficulty=EASY&wire=local`);
    await settled(a);
    await a.locator(".sudoku-cell").nth(3).click();
    await a.waitForTimeout(200);
    await press(a);
    const g = await a.evaluate(() => {
      const svg = document.querySelector("[data-lobby] .place-chart") as SVGElement | null;
      if (!svg) return null;
      const r = svg.getBoundingClientRect();
      const ring = document.querySelector("[data-lobby] .chart-self") as SVGElement | null;
      const rr = ring?.getBoundingClientRect();
      return {
        chart: +r.width.toFixed(2),
        ringBox: rr ? +rr.width.toFixed(2) : null,
      };
    });
    await a.keyboard.press("Escape");
    return g;
  };
  const pitch: Record<string, unknown> = {};
  for (const [label, size] of [
    ["4x4", 2],
    ["9x9", 3],
    ["16x16", 4],
  ] as const) {
    pitch[label] = await pitchAt(size);
  }
  rec("g14.pitch", pitch);

  // ── A ROOM ───────────────────────────────────────────────────────────────────────────
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const room = new URL(link).searchParams.get("s")!;
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);
  await a.waitForTimeout(500);
  rec("live.signLabel", await mark(a).getAttribute("aria-label"));
  rec(
    "live.signColor",
    await a.evaluate(() => {
      const el = [...document.querySelectorAll("[data-player-mark]")].find(
        (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
      ) as HTMLElement;
      return getComputedStyle(el).color;
    }),
  );

  // ── G3 SEAM — a mouse press on the sign sends NO `cur`, and B's ghost of A survives ───
  await tapWire(b, room);
  await a.locator(".sudoku-cell").nth(40).click();
  await a.waitForTimeout(500);
  const beforePress = await drainWire(b);
  const ghostBefore = await b.evaluate(
    () => document.querySelectorAll(".game-cell.is-peer-cursor, .cell-peer").length,
  );
  await press(a); // THE PRESS
  await a.waitForTimeout(400);
  const afterPress = await drainWire(b);
  const ghostAfter = await b.evaluate(
    () => document.querySelectorAll(".game-cell.is-peer-cursor, .cell-peer").length,
  );
  rec("g3.seam", {
    framesBeforePress: beforePress.map((f) => f.p),
    framesAfterPress: afterPress.map((f) => f.p),
    newFramesOnPress: afterPress.length - beforePress.length,
    ghostBefore,
    ghostAfter,
    cellKeptFocus: await a.evaluate(
      () => document.activeElement?.closest(".sudoku-cell") !== null,
    ),
    selfRings: await sheet(a).locator(".chart-self").count(),
  });

  // B settles on a cell; A's chart grows a dot.
  await b.locator(".sudoku-cell").nth(60).click();
  await a.waitForTimeout(1400);
  rec("live.chartDots", await sheet(a).locator(".chart-dot").count());
  rec("live.rows", await sheet(a).locator(".pl-row").allTextContents());
  rec("g7.desk.open.live", await census(a));
  rec("g11.chartAriaHidden", await sheet(a).locator(".place-chart").getAttribute("aria-hidden"));

  // G16 QUERY — hover a row, the OTHER dots dim.
  await drivePeers(a, b, room, 3, 7);
  await a.waitForTimeout(400);
  if ((await sheet(a).count()) === 0) await press(a);
  const dotsNow = await sheet(a).locator(".chart-dot").count();
  const rowsNow = await sheet(a).locator(".pl-row").count();
  let query: unknown = { skipped: "no dots" };
  if (dotsNow >= 2) {
    const peerId = await sheet(a)
      .locator(".pl-row[data-peer]")
      .nth(1)
      .getAttribute("data-peer");
    await sheet(a).locator(`.pl-row[data-peer="${peerId}"]`).hover();
    await a.waitForTimeout(200);
    query = await a.evaluate((id) => {
      const out: { peer: string | null; opacity: string }[] = [];
      for (const d of document.querySelectorAll("[data-lobby] .chart-dot"))
        out.push({
          peer: d.getAttribute("data-peer"),
          opacity: getComputedStyle(d).opacity,
        });
      return { hovered: id, dots: out };
    }, peerId);
    await a.mouse.move(640, 700);
    await a.waitForTimeout(200);
  }
  rec("g16.query", { dots: dotsNow, rows: rowsNow, ...(query as object) });
  rec(
    "g16.afterLeave",
    await a.evaluate(() =>
      [...document.querySelectorAll("[data-lobby] .chart-dot")].map(
        (d) => getComputedStyle(d).opacity,
      ),
    ),
  );

  // ── G4 HEAD-STILL — a peer sweeps a board with a held key; the head must not move ─────
  await a.keyboard.press("Escape");
  await a.waitForTimeout(400);
  await a.evaluate(() => {
    const w = window as unknown as { __mut: number; __obs?: MutationObserver };
    w.__mut = 0;
    const el = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
    )!;
    const obs = new MutationObserver((recs) => {
      w.__mut += recs.length;
    });
    obs.observe(el, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
    w.__obs = obs;
  });
  await b.locator(".sudoku-cell").nth(0).click();
  for (let i = 0; i < 60; i++) {
    await b.keyboard.press("ArrowRight");
    await b.waitForTimeout(90);
  }
  await a.waitForTimeout(600);
  rec("g4.headStill", {
    mutations: await a.evaluate(() => (window as unknown as { __mut: number }).__mut),
    sweepKeys: 60,
    sheetShut: (await sheet(a).count()) === 0,
  });

  // ── G5 OPT-OUT + OPENING SENDS NOTHING ───────────────────────────────────────────────
  await tapWire(b, room);
  await a.locator(".sudoku-cell").nth(10).click();
  await a.waitForTimeout(400);
  const beforeOpen = (await drainWire(b)).length;
  await press(a);
  await a.waitForTimeout(400);
  const afterOpen = (await drainWire(b)).length;
  await a.keyboard.press("Escape");
  await a.waitForTimeout(300);
  const t0 = Date.now();
  await a
    .locator('.controls-card [role="group"]', { hasText: "your cell" })
    .locator('button:has-text("Hidden")')
    .first()
    .click();
  await a.waitForTimeout(250);
  const afterHidden = await drainWire(b);
  await a.locator(".sudoku-cell").nth(20).click();
  await a.waitForTimeout(200);
  await a.locator(".sudoku-cell").nth(30).click();
  await a.waitForTimeout(600);
  const afterMoves = await drainWire(b);
  rec("g5.optOut", {
    framesOnOpen: afterOpen - beforeOpen,
    firstFrameMs: afterHidden.length ? afterHidden[afterHidden.length - 1].t - t0 : null,
    framesAfterHidden: afterHidden.slice(beforeOpen).map((f) => f.p),
    framesAfterTwoMoves: afterMoves.slice(beforeOpen).map((f) => f.p),
  });
  await press(b);
  rec("g5.peerView", {
    rows: await sheet(b).locator(".pl-row").count(),
    dots: await sheet(b).locator(".chart-dot").count(),
  });
  await b.keyboard.press("Escape");
  // your own ring goes out with your dot
  await press(a);
  rec("g5.selfRingWhileHidden", await sheet(a).locator(".chart-self").count());
  await a.keyboard.press("Escape");
  await a
    .locator('.controls-card [role="group"]', { hasText: "your cell" })
    .locator('button:has-text("Shown")')
    .first()
    .click();
  await a.waitForTimeout(300);

  // ── G6 M19-WHOLE — a third join moves no focus, opens no surface, mutates the label ───
  await a.locator(".sudoku-cell").first().click();
  const focusBefore = await a.evaluate(
    () => document.activeElement?.getAttribute("aria-label") ?? "",
  );
  const labelBefore = await mark(a).getAttribute("aria-label");
  const c = await ctx.newPage();
  await c.goto(link);
  await settled(c);
  await a.waitForTimeout(900);
  rec("g6.m19", {
    focusBefore,
    focusAfter: await a.evaluate(
      () => document.activeElement?.getAttribute("aria-label") ?? "",
    ),
    sheetVisible: await sheet(a).count(),
    labelBefore,
    labelAfter: await mark(a).getAttribute("aria-label"),
  });
  await c.close();
  await a.waitForTimeout(400);

  // ── G10 board-unbound, in a room, after a self write ─────────────────────────────────
  await a.locator(".sudoku-cell").nth(41).click();
  await a.keyboard.press("5");
  await a.waitForTimeout(400);
  rec(
    "g10.room",
    await a.evaluate(() => {
      const cells = [...document.querySelectorAll(".sudoku-cell")];
      return {
        cells: cells.length,
        bound: cells.filter((c) =>
          (c as HTMLElement).style.getPropertyValue("--color-user-ink"),
        ).length,
      };
    }),
  );

  // ── G11 live regions, in order ───────────────────────────────────────────────────────
  rec(
    "g11.regions",
    await a.evaluate(() => {
      const all = [...document.querySelectorAll("[aria-live]")];
      return all.map((e) => ({
        cls: (e.getAttribute("class") || "").split(" ")[0],
        live: e.getAttribute("aria-live"),
        role: e.getAttribute("role"),
      }));
    }),
  );

  // ── G9 caption width at 1023 ─────────────────────────────────────────────────────────
  await a.setViewportSize({ width: 1023, height: 800 });
  await a.waitForTimeout(600);
  rec(
    "g9.caption1023",
    await a.evaluate(() => {
      const el = [...document.querySelectorAll(".zone-row-label")].find(
        (e) => e.textContent?.trim() === "your cell",
      ) as HTMLElement | undefined;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        scrollW: el.scrollWidth,
        wraps: el.scrollWidth > Math.ceil(r.width),
      };
    }),
  );

  await ctx.close();
  writeFileSync(
    join(OUT, `scene2-${eng}.json`),
    JSON.stringify({ engine: eng, ...bank }, null, 1),
  );
});
