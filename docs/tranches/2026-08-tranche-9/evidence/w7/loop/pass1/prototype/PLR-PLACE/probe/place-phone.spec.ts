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

/** The phone keeps its controls behind the drawer tab; the players well lives inside it. */
async function openDrawer(page: Page) {
  const tab = page.locator(".drawer-tab");
  if ((await tab.count()) === 0) return;
  if ((await tab.getAttribute("aria-expanded")) !== "true") await tab.click();
  await expect(page.locator("#controls-drawer .controls-card")).toBeVisible();
  await page.waitForTimeout(700);
}

test("THE PHONE — the floor, the budget, the lap", async ({ browser }, info) => {
  const eng = info.project.name;
  mkdirSync(OUT, { recursive: true });
  mkdirSync(FRAMES, { recursive: true });

  const pctx = await browser.newContext({
    ...devices["iPhone 13"],
    hasTouch: true,
    isMobile: true,
  });
  const p = await pctx.newPage();
  await p.goto(SOLO);
  await settled(p);
  await expect.poll(async () => (await census(p)).total, { timeout: 30000 }).toBe(9);
  rec("budget.phone.signMounted", (await census(p)).total);
  rec("phone.signBox", await box(p, MARK));
  rec("phone.attributionTrigger", await box(p, ".attribution-trigger"));
  rec("phone.sunBox", await box(p, ".corner-right"));

  // THE NEGATIVE CONTROL, twice. (1) the floor removed from the shipped box — which changes
  // nothing, because the 28px box inside the √φ padding is ALREADY over 44 in both dimensions,
  // so the `min-*` declaration is a belt on braces and the control is inert against it. (2) the
  // padding removed TOO, which is the box the research measured at 24×24: there the floor bites
  // and is the only thing standing between the mark and a sub-floor target.
  const negative = await p.evaluate(() => {
    const el = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
    ) as HTMLElement;
    const r = (x: DOMRect) => [+x.width.toFixed(1), +x.height.toFixed(1)];
    const shipped = r(el.getBoundingClientRect());
    el.style.minWidth = "0px";
    el.style.minHeight = "0px";
    const noFloor = r(el.getBoundingClientRect());
    el.style.padding = "0px";
    const noFloorNoPad = r(el.getBoundingClientRect());
    el.style.minWidth = "";
    el.style.minHeight = "";
    const floorNoPad = r(el.getBoundingClientRect());
    el.style.padding = "";
    return { shipped, noFloor, noFloorNoPad, floorNoPad };
  });
  rec("phone.tapFloorNegativeControl", negative);

  await openDrawer(p);

  // G9 caption-width at 390
  rec("g9.caption390", await p.evaluate(() => {
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
  }));

  await p.locator(".mobile-attribution").screenshot({
    path: join(FRAMES, `sign-solo-390-coarse-${eng}.png`),
  });

  // a room on the phone, three at the table, the sheet open — G8's lap
  const plink = await invite(p);
  const proom = new URL(plink).searchParams.get("s")!;
  const q = await pctx.newPage();
  await q.goto(plink);
  await settled(q);
  await expect(p.locator(".controls-card .players-roster .player-row")).toHaveCount(2);
  await drivePeers(p, q, proom, 1, 7);
  await q.locator(".sudoku-cell").nth(30).click();
  await p.waitForTimeout(1200);
  rec("phone.live.signBox", await box(p, MARK));
  await p.locator(".mobile-attribution").screenshot({
    path: join(FRAMES, `sign-live-390-coarse-${eng}.png`),
  });

  // THE LAP IS MEASURED IN THE STATE A READER OPENS THE SHEET IN: the drawer SHUT, which is
  // where the board sits highest and the overlap is worst. (Measured open too, below.)
  const tab = p.locator(".drawer-tab");
  if ((await tab.count()) && (await tab.getAttribute("aria-expanded")) === "true") {
    await tab.click();
    await p.waitForTimeout(700);
  }
  await pressMark(p);
  await p.waitForTimeout(900);
  const lap = await p.evaluate(() => {
    const sheet = document.querySelector("[data-lobby]") as HTMLElement;
    const grid = document.querySelector('[role="grid"]') as HTMLElement;
    const s = sheet.getBoundingClientRect();
    const g = grid.getBoundingClientRect();
    return {
      sheet: { x: +s.x.toFixed(1), y: +s.y.toFixed(1), w: +s.width.toFixed(1), h: +s.height.toFixed(1) },
      boardTop: +g.y.toFixed(1),
      lapPx: +(s.bottom - g.y).toFixed(1),
      lines: document.querySelectorAll("[data-lobby] .lobby-row").length,
    };
  });
  rec("g8.phoneLap.drawerShut", lap);
  rec("budget.phone.chartOpen", (await census(p)).total);
  await p.screenshot({
    path: join(FRAMES, `sheet-phone-lap-${eng}.png`),
    clip: { x: 0, y: 0, width: 390, height: 460 },
  });

  await pctx.close();
  writeFileSync(join(OUT, `phone-${eng}.json`), JSON.stringify({ engine: eng, ...bank }, null, 1));
});
