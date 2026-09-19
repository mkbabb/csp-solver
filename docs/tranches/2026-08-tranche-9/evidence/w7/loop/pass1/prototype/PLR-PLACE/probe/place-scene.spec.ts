/**
 * PLR-PLACE · PROTOTYPE GATES — the scene: I3, the floor, the budget, the speech, the lap.
 *
 * Runs against the PROTOTYPE worktree's dev server (127.0.0.1:4246). Everything below is read
 * off the real surface: no overlay, no injected geometry — the product's own `PlayerSign`,
 * `PlayerLobby` and `PlaceChart`.
 *
 * Rows: r0 I3 · G5 opt-out · G6 M19-whole · G7 filter-census · G8 phone-lap · G9 caption-width
 *       G10 board-unbound · G11 live-regions · geometry (desk + coarse phone) · crops.
 */
import { test, expect, type Page, devices } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const HOME =
  process.env.PLC_HOME ||
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/PLR-PLACE";
const OUT = join(HOME, "logs");
const FRAMES = join(HOME, "frames");
const say = (k: string, v: unknown) =>
  console.log(`PLC|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);
const bank: Record<string, unknown> = {};
const rec = (k: string, v: unknown) => {
  bank[k] = v;
  say(k, v);
};

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function invite(page: Page): Promise<string> {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return page.url();
}

/** The live-filter census, `filterBudget`'s own counting rule (own filter ≠ none AND own
 *  display ≠ none). Polled to the settled 9 first — a cold phone reads 21. */
const census = (p: Page) =>
  p.evaluate(() => {
    const rows: Record<string, number> = {};
    let total = 0;
    for (const el of document.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      if (cs.filter === "none" || cs.display === "none") continue;
      total++;
      const key = `${el.tagName.toLowerCase()}.${(el.getAttribute("class") || "").split(" ")[0] || "(none)"}`;
      rows[key] = (rows[key] ?? 0) + 1;
    }
    return { total, rows };
  });

const box = (p: Page, sel: string) =>
  p.evaluate((s) => {
    const el = [...document.querySelectorAll(s)].find(
      (e) => (e as HTMLElement).offsetParent !== null || getComputedStyle(e).position === "fixed",
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

/** The visible mark — the head mounts both instances, one of them `display: none`. */
const MARK = "[data-player-mark]";
async function pressMark(page: Page) {
  await page.locator(MARK).filter({ has: page.locator("*") }).first();
  const marks = page.locator(MARK);
  const n = await marks.count();
  for (let i = 0; i < n; i++) {
    const m = marks.nth(i);
    if (await m.isVisible()) {
      await m.click();
      return m;
    }
  }
  throw new Error("no visible player mark");
}

/** N further peers onto the same channel, in the wire's own words (`hi` + `cur`). */
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
  await a.waitForTimeout(900);
  return drove;
}

test("THE SCENE — I3, the floor, the budget, the speech, the lap", async ({
  browser,
}, info) => {
  const eng = info.project.name;
  mkdirSync(OUT, { recursive: true });
  mkdirSync(FRAMES, { recursive: true });

  // ── DESK ──────────────────────────────────────────────────────────────────────────────
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);

  // r0 I3, verbatim in its own terms: a button named /player/ in the head's left corner whose
  // press reveals a lobby.
  const i3 = await a.evaluate(() => {
    const out: {
      x: number;
      y: number;
      w: number;
      h: number;
      name: string;
    }[] = [];
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

  rec("solo.signBox", await box(a, MARK));
  rec("solo.attributionTrigger", await box(a, ".attribution-trigger"));

  // budget BEFORE — poll to the settled 9
  await expect.poll(async () => (await census(a)).total, { timeout: 30000 }).toBe(9);
  rec("budget.desk.signMounted", (await census(a)).total);

  const mark = await pressMark(a);
  await a.waitForTimeout(800); // the sheet slides; settle ~700ms before measuring it open
  await expect(a.locator("[data-lobby]")).toBeVisible();
  rec("i3.opensLobby", true);
  rec("solo.lobbyBox", await box(a, "[data-lobby]"));
  rec("solo.stateLine", (await a.locator("[data-lobby] .lobby-state").textContent())?.trim());
  rec("solo.chartDots", await a.locator("[data-lobby] .chart-dot").count());
  rec("budget.desk.chartOpen.solo", (await census(a)).total);
  expect(await mark.getAttribute("aria-expanded")).toBe("true");
  expect(await mark.getAttribute("aria-label")).toBe("no other players");

  // G10 board-unbound, SOLO: 81 cells, zero ink bindings.
  const unboundSolo = await a.evaluate(() => {
    const cells = [...document.querySelectorAll(".sudoku-cell")];
    return {
      cells: cells.length,
      bound: cells.filter((c) =>
        (c as HTMLElement).style.getPropertyValue("--color-user-ink"),
      ).length,
    };
  });
  rec("g10.solo", unboundSolo);

  // crop: the sign SOLO, desk light
  await a.locator(MARK).nth(0).evaluate((el) => el.blur());
  await a.mouse.click(640, 700);
  await a.waitForTimeout(400);
  await a
    .locator(".corner-left")
    .screenshot({ path: join(FRAMES, `sign-solo-1280-light-${eng}.png`) });

  // ── A ROOM ────────────────────────────────────────────────────────────────────────────
  const link = await invite(a);
  const room = new URL(link).searchParams.get("s")!;
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);
  await a.waitForTimeout(500);
  rec("live.signLabel", await a.locator(MARK).first().getAttribute("aria-label"));
  rec("live.signBox", await box(a, MARK));
  rec("live.signColor", await a.evaluate(() => {
    const el = document.querySelector("[data-player-mark]") as HTMLElement;
    return getComputedStyle(el).color;
  }));

  // b looks at a cell, so a's chart has a dot to settle
  await b.locator(".sudoku-cell").nth(40).click();
  await a.waitForTimeout(1200);

  await pressMark(a);
  await a.waitForTimeout(800);
  rec("live.lobbyBox", await box(a, "[data-lobby]"));
  rec("live.stateLine", (await a.locator("[data-lobby] .lobby-state").textContent())?.trim());
  rec("live.chartDots", await a.locator("[data-lobby] .chart-dot").count());
  rec("live.rows", await a.locator("[data-lobby] .lobby-row").allTextContents());
  rec("budget.desk.chartOpen.live", (await census(a)).total);

  // G11 live regions: three in the well, the roster still a log, and the chart mints none.
  const regions = await a.evaluate(() => {
    const all = [...document.querySelectorAll("[aria-live]")].map((e) => ({
      cls: (e.getAttribute("class") || "").split(" ")[0],
      live: e.getAttribute("aria-live"),
      role: e.getAttribute("role"),
    }));
    const well = all.filter((r) => r.cls.startsWith("players-"));
    return { total: all.length, well };
  });
  rec("g11.regions", regions);
  rec("g11.chartAriaHidden", await a.locator("[data-lobby] .place-chart").getAttribute("aria-hidden"));

  // G10 board-unbound IN A ROOM: your own cells still bind nothing.
  const unboundRoom = await a.evaluate(() => {
    const cells = [...document.querySelectorAll(".sudoku-cell")];
    return {
      cells: cells.length,
      bound: cells.filter((c) =>
        (c as HTMLElement).style.getPropertyValue("--color-user-ink"),
      ).length,
    };
  });
  rec("g10.room", unboundRoom);

  // ── G6 M19-WHOLE — a third join must not move focus or open a surface ────────────────
  await a.mouse.click(640, 700); // shut the sheet (outside click)
  await a.waitForTimeout(300);
  await a.locator(".sudoku-cell").first().click();
  const focusBefore = await a.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");
  const labelBefore = await a.locator(MARK).first().getAttribute("aria-label");
  const c = await ctx.newPage();
  await c.goto(link);
  await settled(c);
  await a.waitForTimeout(900);
  const m19 = {
    focusBefore,
    focusAfter: await a.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? ""),
    sheetOpen: await a.locator("[data-lobby]").count(),
    labelBefore,
    labelAfter: await a.locator(MARK).first().getAttribute("aria-label"),
  };
  rec("g6.m19", m19);
  await c.close();
  await a.waitForTimeout(500);

  // ── G5 OPT-OUT — 'hidden' puts one `cur {p:null}` on the wire and then silence ───────
  // The tap is on the RECEIVING page (b), reading the product's own frames off the channel.
  await b.evaluate((r) => {
    const w = window as unknown as { __curs: { t: number; p: number | null; from: string }[] };
    w.__curs = [];
    const ch = new BroadcastChannel(`board:${r}`);
    ch.onmessage = (ev: MessageEvent) => {
      if (ev.data?.kind === "cur")
        w.__curs.push({ t: Date.now(), p: ev.data.data?.p ?? null, from: ev.data.from });
    };
  }, room);
  await a.locator(".sudoku-cell").nth(10).click();
  await a.waitForTimeout(400);
  const t0 = Date.now();
  await a
    .locator('.controls-card [role="group"]', { hasText: "your cell" })
    .locator('button:has-text("hidden")')
    .first()
    .click();
  await a.waitForTimeout(250);
  const afterHidden = await b.evaluate(
    () => (window as unknown as { __curs: { t: number; p: number | null }[] }).__curs.slice(),
  );
  // then MOVE, twice, and prove the wire stays silent
  await a.locator(".sudoku-cell").nth(20).click();
  await a.waitForTimeout(200);
  await a.locator(".sudoku-cell").nth(30).click();
  await a.waitForTimeout(600);
  const afterMoves = await b.evaluate(
    () => (window as unknown as { __curs: { t: number; p: number | null }[] }).__curs.slice(),
  );
  rec("g5.optOut", {
    firstFrameMs: afterHidden.length ? afterHidden[0].t - t0 : null,
    framesRightAfterHidden: afterHidden.map((f) => f.p),
    framesAfterTwoMoves: afterMoves.map((f) => f.p),
  });
  // the row survives on the peer's page, the dot does not
  await pressMark(b);
  await b.waitForTimeout(800);
  rec("g5.peerView", {
    rows: await b.locator("[data-lobby] .lobby-row").count(),
    dots: await b.locator("[data-lobby] .chart-dot").count(),
  });
  await b.mouse.click(640, 700);
  // back on
  await a
    .locator('.controls-card [role="group"]', { hasText: "your cell" })
    .locator('button:has-text("shown")')
    .first()
    .click();
  await a.waitForTimeout(300);

  // ── FIFTEEN AT THE TABLE — the chart and the rows at N = 15 ──────────────────────────
  rec("peers.drive", await drivePeers(a, b, room, 14));
  await pressMark(a);
  await a.waitForTimeout(900);
  const fifteen = {
    signLabel: await a.locator(MARK).first().getAttribute("aria-label"),
    stateLine: (await a.locator("[data-lobby] .lobby-state").textContent())?.trim(),
    dots: await a.locator("[data-lobby] .chart-dot").count(),
    rows: await a.locator("[data-lobby] .lobby-row").allTextContents(),
    lobbyBox: await box(a, "[data-lobby]"),
    rosterRows: await a.locator(".controls-card .players-roster .player-row").count(),
  };
  rec("n15.desk", fifteen);
  rec("budget.desk.chartOpen.n15", (await census(a)).total);
  await a.locator("[data-lobby]").screenshot({ path: join(FRAMES, `sheet-n15-1280-${eng}.png`) });

  // the sign LIVE, desk — dark
  await a.evaluate(() => document.documentElement.classList.add("dark"));
  await a.waitForTimeout(500);
  await a.locator(".corner-left").screenshot({ path: join(FRAMES, `sign-live-1280-dark-${eng}.png`) });
  rec("dark.signColor", await a.evaluate(() => {
    const el = document.querySelector("[data-player-mark]") as HTMLElement;
    return getComputedStyle(el).color;
  }));
  await a.evaluate(() => document.documentElement.classList.remove("dark"));

  // G9 caption-width at 1023 (the rail's own regime boundary)
  await a.setViewportSize({ width: 1023, height: 800 });
  await a.waitForTimeout(600);
  rec("g9.caption1023", await a.evaluate(() => {
    const el = [...document.querySelectorAll(".zone-row-label")].find(
      (e) => e.textContent?.trim() === "your cell",
    ) as HTMLElement | undefined;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      w: +r.width.toFixed(1),
      h: +r.height.toFixed(1),
      scrollW: el.scrollWidth,
      lines: +(r.height / parseFloat(getComputedStyle(el).lineHeight || "1")).toFixed(2),
      wraps: el.scrollWidth > Math.ceil(r.width),
    };
  }));

  await ctx.close();

  writeFileSync(join(OUT, `scene-${eng}.json`), JSON.stringify({ engine: eng, ...bank }, null, 1));
});
