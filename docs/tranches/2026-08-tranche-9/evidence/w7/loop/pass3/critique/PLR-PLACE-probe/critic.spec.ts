import { test, expect, type Page } from "@playwright/test";

/** PASS-3 CRITIC's own probe for PLR-PLACE. Nothing here is the prototype's spec. */

const PROTO = process.env.CRIT_PROTO || "http://127.0.0.1:4246";
const HEAD = process.env.CRIT_HEAD || "http://127.0.0.1:4247";
const LOCAL = "/?size=3&difficulty=EASY&wire=local";
const SOLO = "/?size=3&difficulty=EASY";

const cellInput = (p: Page, i: number) => p.locator(".sudoku-cell input").nth(i);
const sign = (p: Page) => p.locator("[data-player-mark]:visible");

async function boot(page: Page, url: string) {
  await page.goto(url);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 30000 })
    .toBeGreaterThan(0);
}

async function table(browser: import("@playwright/test").Browser, n: number) {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, PROTO + LOCAL);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const peers: Page[] = [];
  for (let i = 0; i < n - 1; i++) {
    const p = await ctx.newPage();
    await boot(p, a.url());
    peers.push(p);
  }
  for (const p of [a, ...peers])
    await expect(p.locator(".controls-card .players-roster .player-row")).toHaveCount(n, {
      timeout: 20000,
    });
  return { ctx, a, peers };
}

// ── C1 · the query, with THREE peers on the chart (the prototype's G16 has one dot) ──────
test("C1 — query with 3 peer dots: peer row vs SELF row", async ({ browser }) => {
  const { ctx, a, peers } = await table(browser, 4);
  for (let i = 0; i < peers.length; i++) await cellInput(peers[i], 10 + i * 7).click();
  await cellInput(a, 40).click();
  await sign(a).click();
  await expect(a.locator(".chart-dot")).toHaveCount(3, { timeout: 6000 });

  const rowSel = "[data-lobby].is-open .pl-row[data-peer]";
  const opac = () =>
    a.evaluate(() =>
      [...document.querySelectorAll("[data-lobby].is-open .chart-dot")].map(
        (d) => getComputedStyle(d).opacity,
      ),
    );

  const before = await opac();
  // which row is SELF? the one whose swatch is a ring (no fill circle r=4)
  const selfIdx = await a.evaluate(() => {
    const rows = [...document.querySelectorAll("[data-lobby].is-open .pl-row[data-peer]")];
    return rows.findIndex((r) => !!r.querySelector('circle[fill="none"]'));
  });
  const peerIdx = selfIdx === 0 ? 1 : 0;

  await a.locator(rowSel).nth(peerIdx).hover();
  await a.waitForTimeout(150);
  const onPeer = await opac();

  await a.locator(rowSel).nth(selfIdx).hover();
  await a.waitForTimeout(150);
  const onSelf = await opac();

  console.log(
    "C1 " +
      JSON.stringify({ selfIdx, peerIdx, before, onPeer, onSelf, selfRing: await a.locator(".chart-self").count() }),
  );
  await ctx.close();
});

// ── C2 · re-Shown: does the room get your cell back? ─────────────────────────────────────
test("C2 — Hidden then Shown: what the wire carries", async ({ browser }) => {
  const { ctx, a, peers } = await table(browser, 2);
  const b = peers[0];
  await cellInput(a, 40).click();
  await a.evaluate(() => {
    (window as unknown as { __cur: unknown[] }).__cur = [];
    const room = new URL(location.href).searchParams.get("s") ?? "x";
    const bc = new BroadcastChannel(`board:${room}`);
    bc.onmessage = (e) => {
      const m = e.data as { kind?: string; data?: unknown };
      if (m && m.kind === "cur") (window as unknown as { __cur: unknown[] }).__cur.push(m.data);
    };
  });
  const chip = (t: string) => a.locator(`.controls-card .ctrl-btn:text-is("${t}")`).first();
  await chip("Hidden").click();
  await a.waitForTimeout(400);
  const afterHidden = await a.evaluate(() => (window as { __cur?: unknown[] }).__cur ?? []);
  // B's view of A's ghost after Hidden
  await b.waitForTimeout(300);
  const ghostAfterHidden = await b.locator(".sudoku-cell .peer-cursor, .sudoku-cell .cell-peer").count();
  await chip("Shown").click();
  await a.waitForTimeout(600);
  const afterShown = await a.evaluate(() => (window as { __cur?: unknown[] }).__cur ?? []);
  // A's own ring back?
  await sign(a).click();
  await a.waitForTimeout(400);
  const selfRing = await a.locator(".chart-self").count();
  // B's chart: does A have a dot?
  await sign(b).click();
  await b.waitForTimeout(1200);
  const bDots = await b.locator(".chart-dot").count();
  console.log(
    "C2 " +
      JSON.stringify({ afterHidden, ghostAfterHidden, afterShown, selfRingOnA: selfRing, dotsOnB: bDots }),
  );
  await ctx.close();
});

// ── C3 · <filter> census, shut / open solo / open live, on THIS dev tree ─────────────────
test("C3 — live filter count through the three poses", async ({ browser }) => {
  const ctx = await browser.newContext();
  const solo = await ctx.newPage();
  await boot(solo, PROTO + SOLO);
  const count = (p: Page) => p.evaluate(() => document.querySelectorAll("filter").length);
  const shut = await count(solo);
  await sign(solo).click();
  await solo.waitForTimeout(400);
  const openSolo = await count(solo);
  await ctx.close();

  const { ctx: c2, a, peers } = await table(browser, 3);
  for (let i = 0; i < peers.length; i++) await cellInput(peers[i], 10 + i * 7).click();
  await cellInput(a, 40).click();
  await sign(a).click();
  await expect(a.locator(".chart-dot")).toHaveCount(2, { timeout: 6000 });
  const openLive = await count(a);
  console.log("C3 " + JSON.stringify({ shut, openSolo, openLive }));
  await c2.close();
});

// ── C4 · 16×16 pitch (the spec's G14 asks 4/9/16; the landed gate tests 9 only) ──────────
test("C4 — pitch at 4x4 and 16x16", async ({ browser }) => {
  const ctx = await browser.newContext();
  const out: Record<string, unknown> = {};
  for (const [name, size] of [["4x4", "2"], ["16x16", "4"]] as const) {
    const p = await ctx.newPage();
    await boot(p, `${PROTO}/?size=${size}&difficulty=EASY`);
    await sign(p).click();
    await p.waitForTimeout(500);
    out[name] = await p.evaluate(() => {
      const svg = document.querySelector("[data-lobby].is-open .place-chart") as SVGSVGElement | null;
      if (!svg) return null;
      const box = svg.getBoundingClientRect();
      return { w: box.width, h: box.height, vb: svg.viewBox.baseVal.width };
    });
    await p.close();
  }
  console.log("C4 " + JSON.stringify(out));
  await ctx.close();
});

// ── C5 · π rect census, prototype vs HEAD, SOLO, one declared regime ─────────────────────
test("C5 — pi against HEAD 74a2b5d9, solo", async ({ browser }) => {
  const SEL = [".controls-card", ".action-bar", ".board-wrapper", ".page-root", ".tray-well"];
  const read = async (base: string, w: number, h: number, coarse: boolean) => {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      hasTouch: coarse,
      isMobile: coarse,
      deviceScaleFactor: 1,
    });
    const p = await ctx.newPage();
    await boot(p, base + SOLO);
    const regime = await p.evaluate(() => ({
      coarse: matchMedia("(pointer: coarse)").matches,
      hover: matchMedia("(hover: hover)").matches,
    }));
    const rects = await p.evaluate((sel) => {
      const o: Record<string, number[] | null> = {};
      for (const s of sel) {
        const el = document.querySelector(s) as HTMLElement | null;
        if (!el) {
          o[s] = null;
          continue;
        }
        const r = el.getBoundingClientRect();
        o[s] = [
          Math.round(r.x * 100) / 100,
          Math.round(r.y * 100) / 100,
          Math.round(r.width * 100) / 100,
          Math.round(r.height * 100) / 100,
        ];
      }
      return o;
    }, SEL);
    await ctx.close();
    return { regime, rects };
  };
  const out: Record<string, unknown> = {};
  for (const arm of [
    ["390x844-coarse", 390, 844, true],
    ["1280x800-fine", 1280, 800, false],
  ] as const) {
    const pr = await read(PROTO, arm[1], arm[2], arm[3]);
    const hd = await read(HEAD, arm[1], arm[2], arm[3]);
    const delta: Record<string, unknown> = {};
    for (const s of SEL) {
      const a = pr.rects[s];
      const b = hd.rects[s];
      delta[s] = a && b ? a.map((v, i) => Math.round((v - b[i]) * 100) / 100) : [a, b];
    }
    out[arm[0]] = { regimeProto: pr.regime, regimeHead: hd.regime, delta };
  }
  console.log("C5 " + JSON.stringify(out));
});

// ── C6 · does the sheet OPEN on where the room is now? ───────────────────────────────────
test("C6 — first paint latency of the dots", async ({ browser }) => {
  const { ctx, a, peers } = await table(browser, 3);
  for (let i = 0; i < peers.length; i++) await cellInput(peers[i], 10 + i * 7).click();
  await cellInput(a, 40).click();
  await a.waitForTimeout(2000); // everybody has been still for 2s: nothing is "unsettled"
  const t0 = Date.now();
  await sign(a).click();
  const at0 = await a.locator(".chart-dot").count();
  await expect(a.locator(".chart-dot")).toHaveCount(2, { timeout: 6000 });
  const t1 = Date.now() - t0;
  // now close and re-open: does a stale position paint?
  await sign(a).click();
  await a.waitForTimeout(200);
  await sign(a).click();
  await a.waitForTimeout(60);
  const reopen = await a.locator(".chart-dot").count();
  console.log("C6 " + JSON.stringify({ dotsAtOpen: at0, msToFirstDots: t1, dotsOnReopen60ms: reopen }));
  await ctx.close();
});
