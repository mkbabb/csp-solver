/**
 * R5 round-zero SUBSTRATE PROBE — read-only, both engines.
 *
 * Mirrors e2e/multiplayer.spec.ts's harness (one browser context, `?wire=local`, the
 * product's own invite verb) and measures what the census asks for: the roster's
 * rendering, each peer's ink on the board, the cursor wash, the join wash, the
 * heartbeat's cadence, the presence expiry, the identity store's 8-bound, and the
 * @mbabb mark's geometry in both poses.
 *
 * It asserts almost nothing. It PRINTS, tagged `R5|`, and the numbers are lifted
 * into the lane's .md.
 */
import { test, expect, devices, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const say = (k: string, v: unknown) =>
  console.log(`R5|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
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

const roster = (p: Page) => p.locator(".controls-card .players-roster .player-row");

/** Every roster row on this page: name, resolved swatch colour, resolved name colour. */
const rosterRead = (p: Page) =>
  p.evaluate(() =>
    [...document.querySelectorAll(".controls-card .players-roster .player-row")].map(
      (li) => {
        const sw = li.querySelector(".player-swatch") as HTMLElement;
        const nm = li.querySelector(".player-name") as HTMLElement;
        return {
          name: nm?.textContent?.trim() ?? "",
          self: !!li.querySelector(".player-self"),
          inline: (li as HTMLElement).style.getPropertyValue("--color-user-ink") || "(none)",
          swatch: getComputedStyle(sw).backgroundColor,
          nameColor: getComputedStyle(nm).color,
          rowH: +(li as HTMLElement).getBoundingClientRect().height.toFixed(1),
          swatchPx: +(sw.getBoundingClientRect().width).toFixed(1),
          fontPx: getComputedStyle(nm).fontSize,
        };
      },
    ),
  );

test("the two-page table: roster, board ink, cursor, join wash", async ({ browser }) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);

  // The well BEFORE a room: what a lobby would replace.
  say(
    "well.solo",
    await a.evaluate(() => {
      const w = [...document.querySelectorAll(".controls-card .tray-well")].find((e) =>
        e.textContent?.includes("players"),
      ) as HTMLElement;
      const r = w.getBoundingClientRect();
      return {
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        text: (w.innerText || "").replace(/\n+/g, " / "),
      };
    }),
  );

  const link = await invite(a);
  say("invite.href", new URL(link).search);

  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);

  await expect(roster(a)).toHaveCount(2);
  await expect(roster(b)).toHaveCount(2);

  say("roster.A", await rosterRead(a));
  say("roster.B", await rosterRead(b));

  // The well WITH a room.
  say(
    "well.room",
    await a.evaluate(() => {
      const w = [...document.querySelectorAll(".controls-card .tray-well")].find((e) =>
        e.textContent?.includes("players"),
      ) as HTMLElement;
      const r = w.getBoundingClientRect();
      return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), text: (w.innerText || "").replace(/\n+/g, " / ") };
    }),
  );

  // ── the board: each peer's digit in its author's ink ────────────────────────────
  const empties = await a.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i, n) => ((i as HTMLInputElement).value ? -1 : n))
      .filter((n) => n >= 0)
      .slice(0, 4),
  );
  const cellA = empties[0];
  const cellB = empties[1];
  const inA = a.locator(".sudoku-cell input").nth(cellA);
  await inA.click();
  await inA.fill("5");
  const inB = b.locator(".sudoku-cell input").nth(cellB);
  await inB.click();
  await inB.fill("7");
  await expect.poll(() => b.locator(".sudoku-cell input").nth(cellA).inputValue()).toBe("5");
  await expect.poll(() => a.locator(".sudoku-cell input").nth(cellB).inputValue()).toBe("7");

  const cellInk = (p: Page, n: number) =>
    p.evaluate((i) => {
      const c = document.querySelectorAll(".sudoku-cell")[i] as HTMLElement;
      const g = c.querySelector(".glyph-svg path") as SVGElement | null;
      return {
        varOnCell: getComputedStyle(c).getPropertyValue("--color-user-ink").trim(),
        stroke: g ? getComputedStyle(g).stroke : "(no glyph path)",
        fill: g ? getComputedStyle(g).fill : "",
        aria: (c.querySelector("input") as HTMLInputElement)?.getAttribute("aria-label") ?? "",
      };
    }, n);

  say("board.A-sees-A-cell", await cellInk(a, cellA));
  say("board.A-sees-B-cell", await cellInk(a, cellB));
  say("board.B-sees-A-cell", await cellInk(b, cellA));
  say("board.B-sees-B-cell", await cellInk(b, cellB));

  // ── the cursor wash ─────────────────────────────────────────────────────────────
  const cellC = empties[2];
  await a.locator(".sudoku-cell input").nth(cellC).click();
  await expect
    .poll(() =>
      b.evaluate((i) => {
        const c = document.querySelectorAll(".sudoku-cell")[i] as HTMLElement;
        return c.classList.contains("is-peer-cursor");
      }, cellC),
    )
    .toBe(true);
  say(
    "cursor.B-sees-A",
    await b.evaluate((i) => {
      const c = document.querySelectorAll(".sudoku-cell")[i] as HTMLElement;
      const ghost = c.querySelector(".cell-ghost-path") as SVGElement;
      return {
        peerVar: getComputedStyle(c).getPropertyValue("--color-peer-cursor-ink").trim(),
        stroke: ghost ? getComputedStyle(ghost).stroke : "(none)",
        strokeOpacity: ghost ? getComputedStyle(ghost).strokeOpacity : "",
        fillOpacity: ghost ? getComputedStyle(ghost).fillOpacity : "",
      };
    }, cellC),
  );

  // ── the join wash: a third page arriving ────────────────────────────────────────
  // Past the 1200ms boot-suppression window, so the arrival is an ARRIVAL and not the room
  // this page walked into.
  await a.waitForTimeout(2500);
  const beatsBefore = await a.evaluate(
    async () => (await import("/src/games/shared/useJoinWash.ts")).beats.value,
  );
  const c = await ctx.newPage();
  await c.goto(link);
  await settled(c);
  await expect(roster(a)).toHaveCount(3);
  const wash = await a.evaluate(async () => {
    const m = await import("/src/games/shared/useJoinWash.ts");
    return {
      beats: m.beats.value,
      WASH: m.WASH,
      traceInk: m.traceInk.value,
      traceOpacity: m.traceOpacity.value,
      arriving: m.arriving.value,
    };
  });
  say("joinwash", { beatsBefore, ...wash });
  say(
    "joinwash.ring",
    await a.evaluate(() => {
      const poses = document.querySelectorAll(".join-pose");
      const path = document.querySelector(".join-trace") as SVGElement | null;
      return {
        poses: poses.length,
        active: document.querySelectorAll(".join-pose.is-active").length,
        stroke: path ? getComputedStyle(path).stroke : "(no join-trace)",
        strokeWidth: path ? getComputedStyle(path).strokeWidth : "",
        strokeOpacity: path ? path.getAttribute("stroke-opacity") : "",
        dashOffset: path ? (path as SVGPathElement).style.strokeDashoffset : "",
      };
    }),
  );
  say(
    "roster.scrollport",
    await a.evaluate(() => {
      const ul = document.querySelector(".controls-card .players-roster") as HTMLElement;
      const cs = getComputedStyle(ul);
      return {
        maxHeight: cs.maxHeight,
        clientH: ul.clientHeight,
        scrollH: ul.scrollHeight,
        rowsVisibleAtMax: +(parseFloat(cs.maxHeight) / (ul.scrollHeight / 3)).toFixed(2),
      };
    }),
  );
  say("roster.A-three", await rosterRead(a));
  say("roster.C-three", await rosterRead(c));

  // Three swatches, three distinct colours on ONE page?
  const swA = (await rosterRead(a)).map((r) => r.swatch);
  say("roster.A-distinct-swatches", { n: swA.length, distinct: new Set(swA).size });

  // ── the session's own state, read from the module ───────────────────────────────
  say(
    "session.A",
    await a.evaluate(async () => {
      const s = await import("/src/games/shared/useSession.ts");
      return {
        roomId: s.session.roomId.value,
        live: s.session.live.value,
        players: s.session.players.value.map((p: any) => ({
          slug: p.slug,
          self: p.self,
          ink: p.ink,
        })),
        cursors: s.peerCursors.value,
        authorInkKeys: Object.keys(s.authorInk.value).length,
      };
    }),
  );

  await ctx.close();
});

test("what the ENGINE actually paints for the walk (the gamut question)", async ({
  browser,
}) => {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  await p.goto(SOLO);
  await settled(p);

  const paint = (dark: boolean) =>
    p.evaluate((isDark) => {
      document.documentElement.classList.toggle("dark", isDark);
      const L = getComputedStyle(document.documentElement)
        .getPropertyValue("--peer-ink-l")
        .trim();
      // THE ENGINE'S OWN ANSWER. A 2D canvas paints the colour the compositor would, gamut
      // mapping and all, and `getImageData` reads the bytes back — which no computed-style
      // read can give (both engines serialise `color` back as the `oklch()` it was written as).
      const cv = document.createElement("canvas");
      cv.width = cv.height = 1;
      const g2 = cv.getContext("2d", { willReadFrequently: true })!;
      const px = (css: string) => {
        g2.clearRect(0, 0, 1, 1);
        g2.fillStyle = css;
        g2.fillRect(0, 0, 1, 1);
        const d = g2.getImageData(0, 0, 1, 1).data;
        return [d[0], d[1], d[2]];
      };
      const out: { i: number; h: number; rgb: number[] }[] = [];
      for (let i = 0; i < 16; i++) {
        const h = +((i * 137.5) % 360).toFixed(1);
        out.push({ i, h, rgb: px(`oklch(${L} 0.11 ${h}deg)`) });
      }
      // The whole 144-cycle, hashed, so the engine-vs-maths cross-check is one line rather
      // than 144 rows of paste.
      const all: string[] = [];
      for (let i = 0; i < 144; i++) {
        const h = +((i * 137.5) % 360).toFixed(1);
        all.push(px(`oklch(${L} 0.11 ${h}deg)`).join(","));
      }
      const ground = getComputedStyle(document.body).backgroundColor;
      const card = px(
        getComputedStyle(document.documentElement).getPropertyValue("--color-card").trim(),
      );
      const userInk = px(
        getComputedStyle(document.documentElement).getPropertyValue("--color-user-ink").trim(),
      );
      document.documentElement.classList.toggle("dark", false);
      return { L, ground, card, userInk, out, all144: all.join(";") };
    }, dark);

  const light = await paint(false);
  const dark = await paint(true);
  say("paint.light", { ...light, all144: undefined });
  say("paint.dark", { ...dark, all144: undefined });
  say("paint.all144.light", light.all144);
  say("paint.all144.dark", dark.all144);
  await ctx.close();
});

test("the heartbeat's cadence, and the roster at expiry", async ({ browser }) => {
  test.setTimeout(150000);
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(roster(b)).toHaveCount(2);

  // Listen on the SAME BroadcastChannel the local arm rides and count A's `hi` beats.
  const room = new URL(link).searchParams.get("s")!;
  await b.evaluate((r) => {
    const w = window as any;
    w.__r5 = [];
    const ch = new BroadcastChannel(`board:${r}`);
    ch.onmessage = (ev: MessageEvent) =>
      w.__r5.push({ kind: ev.data?.kind, from: ev.data?.from, t: performance.now() });
  }, room);

  await b.waitForTimeout(34000);
  const frames = await b.evaluate(() => (window as any).__r5);
  const his = frames.filter((f: any) => f.kind === "hi" && !f.from?.startsWith("__"));
  const gaps: number[] = [];
  for (let i = 1; i < his.length; i++) gaps.push(+(his[i].t - his[i - 1].t).toFixed(0));
  say("heartbeat", {
    windowMs: 34000,
    frames: frames.length,
    hi: his.length,
    gapsMs: gaps,
    kinds: [...new Set(frames.map((f: any) => f.kind))],
  });

  // SILENCE A, then watch B's roster. Patching postMessage is the cheapest way to make a
  // page go quiet without a `bye` — exactly the dead-tab-with-a-live-socket class §3.7 cures.
  await a.evaluate(() => {
    BroadcastChannel.prototype.postMessage = function () {};
  });
  const t0 = Date.now();
  await expect.poll(() => roster(b).count(), { timeout: 70000, intervals: [1000] }).toBe(1);
  say("presence.expiry", { droppedAfterMs: Date.now() - t0 });
  say("roster.B-after-expiry", await rosterRead(b));
  say(
    "aloneLine",
    await b.evaluate(
      () =>
        (document.querySelector(".controls-card .players-alone") as HTMLElement)
          ?.textContent ?? "",
    ),
  );
  await ctx.close();
});

test("what a frame costs, and what `k` carries", async ({ browser }) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const room = new URL(link).searchParams.get("s")!;
  await a.evaluate((r) => {
    const w = window as any;
    w.__r5f = [];
    const ch = new BroadcastChannel(`board:${r}`);
    ch.onmessage = (ev: MessageEvent) =>
      w.__r5f.push({
        kind: ev.data?.kind,
        bytes: new TextEncoder().encode(JSON.stringify(ev.data?.data ?? {})).length,
        k: ev.data?.data?.k ? Object.keys(ev.data.data.k).length : undefined,
        kRaw: ev.data?.data?.k,
      });
  }, room);
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(roster(a)).toHaveCount(2);
  await a.waitForTimeout(1500);
  say("frames.cost", await a.evaluate(() => (window as any).__r5f));
  await ctx.close();
});

test("the identity store's 8-bound", async ({ browser }) => {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  await p.goto(SOLO);
  await settled(p);

  const out = await p.evaluate(async () => {
    const m = await import("/src/games/shared/playerIdentity.ts");
    const KEY = "session-identity-v1";
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);

    // ROOMS: claim ten rooms in order, releasing each (the honest single-tab walk).
    const ids: Record<string, string> = {};
    for (let i = 0; i < 10; i++) {
      const room = `room-${i}`;
      ids[room] = m.claimIdentity(room);
      m.releaseIdentity(ids[room]);
      await new Promise((r) => setTimeout(r, 2)); // distinct `at`
    }
    const store = JSON.parse(localStorage.getItem(KEY)!);
    const kept = Object.keys(store.rooms);
    // Return to room-0 — was its binding kept?
    sessionStorage.removeItem(KEY); // a NEW tab: no per-tab half
    const again = m.claimIdentity("room-0");
    const evicted = again !== ids["room-0"];

    // LIVE CLAIMS: nine live pages, none released.
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    const liveIds: string[] = [];
    for (let i = 0; i < 9; i++) {
      sessionStorage.removeItem(KEY); // each "tab" has its own per-tab half
      liveIds.push(m.claimIdentity(`live-${i}`));
    }
    const store2 = JSON.parse(localStorage.getItem(KEY)!);
    const firstStillClaimed = store2.live.includes(liveIds[0]);
    // A tenth page opening live-0's room while live-0 is still up:
    sessionStorage.removeItem(KEY);
    const tenth = m.claimIdentity("live-0");
    return {
      roomsKept: kept.length,
      keptNames: kept,
      room0Evicted: evicted,
      room0Was: ids["room-0"],
      room0Now: again,
      liveCap: store2.live.length,
      firstStillClaimed,
      tenthTookLive0sId: tenth === liveIds[0],
      liveIds0: liveIds[0],
      tenth,
    };
  });
  say("identity.8bound", out);
  await ctx.close();
});

test("the @mbabb mark's geometry, desktop and phone", async ({ browser }) => {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 1280, height: 800 });
  await p.goto(SOLO);
  await settled(p);

  const geom = async (pose: string) =>
    p.evaluate((sel) => {
      const trig = document.querySelector(sel + " .attribution-trigger") as HTMLElement;
      if (!trig) return null;
      const r = trig.getBoundingClientRect();
      const wrap = trig.parentElement as HTMLElement;
      const wr = wrap.getBoundingClientRect();
      const cs = getComputedStyle(trig);
      const sun = document.querySelector(".corner-right") as HTMLElement;
      const sr = sun?.getBoundingClientRect();
      return {
        trigger: { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) },
        wrapper: { x: +wr.x.toFixed(1), y: +wr.y.toFixed(1), w: +wr.width.toFixed(1), h: +wr.height.toFixed(1) },
        font: cs.fontSize + " " + cs.fontFamily.split(",")[0],
        headRule: getComputedStyle(document.documentElement).getPropertyValue("--head-rule").trim() ||
          getComputedStyle(document.querySelector(".page-root") ?? document.body).getPropertyValue("--head-rule").trim(),
        sun: sr ? { x: +sr.x.toFixed(1), y: +sr.y.toFixed(1), w: +sr.width.toFixed(1), h: +sr.height.toFixed(1) } : null,
        vw: window.innerWidth,
      };
    }, sel_(pose));
  function sel_(pose: string) {
    return pose === "desktop" ? ".corner-left" : ".mobile-attribution";
  }

  say("mark.desktop", await geom("desktop"));
  // the card, opened — the lobby's nearest existing idiom
  await p.locator(".corner-left .attribution-trigger").click();
  await expect(p.locator(".corner-left .hover-card")).toHaveClass(/is-open/);
  await p.waitForTimeout(400);
  say(
    "card.desktop",
    await p.evaluate(() => {
      const c = document.querySelector(".corner-left .hover-card") as HTMLElement;
      const r = c.getBoundingClientRect();
      const cs = getComputedStyle(c);
      return {
        x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1),
        bg: cs.backgroundColor, border: cs.border, radius: cs.borderRadius, pad: cs.padding,
        minWidth: cs.minWidth,
        text: (c.innerText || "").replace(/\n+/g, " / "),
      };
    }),
  );

  await p.setViewportSize(devices["iPhone 13"].viewport);
  await p.waitForTimeout(600);
  say("mark.mobile", await geom("mobile"));
  await ctx.close();
});
