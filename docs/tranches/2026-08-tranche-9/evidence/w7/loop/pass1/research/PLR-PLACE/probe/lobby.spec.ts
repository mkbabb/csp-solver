/**
 * PLR-PLACE · PROBE 4 — THE LOBBY, THE FLOOR, THE BUDGET, AND SIXTEEN DOTS.
 *
 * A real two-page room on `?wire=local`, then N further peers driven onto the SAME channel
 * as the wire's own frames (`hi` + `cur` from fresh ids at the room's live epoch — exactly
 * what a peer publishes; `localWire.onmessage` treats any message from an unseen id as a
 * join, `useSession.ts:240-242`). Nothing is forged that the grammar does not carry: id,
 * slug, ink index and cursor, and not one fact more.
 *
 * Then the prototype is mounted (`proto/mount-miniature.js`) and measured:
 *   · the lobby chart at ~96px with the names beside it, in the @mbabb card's pose
 *   · the 44×44 floor per dimension on a 24px mark in the phone's 250.5px free band
 *   · `filterBudget` 9 by exact match WITH the miniature mounted
 *   · the DOM cost per peer
 *   · sixteen dots on a 9×9 and on a 16×16: how many land in one cell
 *   · two crops, each cited in the record
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const HOME = process.env.PLC_HOME || join(__dirname, "..");
const PROTO = join(HOME, "proto", "mount-miniature.js");
const OUT = join(HOME, "logs");
const FRAMES = join(HOME, "frames");
const say = (k: string, v: unknown) =>
  console.log(`PLC|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);

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

/** The live-filter census, the `filterBudget` counting rule: own filter ≠ none AND own
 *  display ≠ none (filterBudget.ts, "Counting rule"). */
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

test("THE LOBBY — sixteen peers, the chart, the floor, the budget", async ({
  browser,
}, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const room = new URL(link).searchParams.get("s")!;
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);

  const before = await census(a);
  say("budget.before", before.total);

  // ── Fourteen more, onto the same channel, in the wire's own words ────────────────────
  await a.evaluate((r) => {
    const w = window as unknown as { __st: unknown; __ch: BroadcastChannel };
    w.__st = null;
    const ch = new BroadcastChannel(`board:${r}`);
    w.__ch = ch;
    ch.onmessage = (ev: MessageEvent) => {
      if (ev.data?.kind === "st") w.__st = ev.data.data;
    };
  }, room);
  // provoke an `st` so the epoch is in hand
  await b.evaluate(() => {
    const ch = new BroadcastChannel(
      `board:${new URL(location.href).searchParams.get("s")}`,
    );
    ch.postMessage({ kind: "hi", data: {}, from: "p-probe000000" });
    ch.close();
  });
  await a.waitForTimeout(600);

  const drive = await a.evaluate((n) => {
    const w = window as unknown as {
      __st: { e: number; ea: string } | null;
      __ch: BroadcastChannel;
    };
    if (!w.__st) return "no st captured";
    const { e, ea } = w.__st;
    for (let i = 0; i < n; i++) {
      const id = `p-fake${String(i).padStart(8, "0")}`;
      w.__ch.postMessage({ kind: "hi", data: { ack: true }, from: id });
      // a cursor on a distinct cell, so sixteen dots are sixteen places
      w.__ch.postMessage({ kind: "cur", data: { p: i * 5 + 1, e, ea }, from: id });
    }
    return `drove ${n}`;
  }, 14);
  say("peers.drive", drive);
  await a.waitForTimeout(800);

  const roster = await a.evaluate(() =>
    [...document.querySelectorAll(".controls-card .players-roster .player-row")].map(
      (li) => ({
        name: li.querySelector(".player-name")?.textContent?.trim() ?? "",
        self: !!li.querySelector(".player-self"),
        ink:
          (li as HTMLElement).style.getPropertyValue("--color-user-ink") || "(self: none)",
        swatch: getComputedStyle(li.querySelector(".player-swatch")!).backgroundColor,
      }),
    ),
  );
  say("roster.n", roster.length);
  say("roster", roster);

  const rosterBox = await a.evaluate(() => {
    const ul = document.querySelector(".controls-card .players-roster") as HTMLElement;
    const r = ul.getBoundingClientRect();
    const cs = getComputedStyle(ul);
    return {
      w: +r.width.toFixed(1),
      h: +r.height.toFixed(1),
      scrollH: ul.scrollHeight,
      maxHeight: cs.maxHeight,
      overflow: cs.overflowY,
      rowsVisible: +(r.height / (ul.scrollHeight / Math.max(1, ul.children.length))).toFixed(
        1,
      ),
    };
  });
  say("roster.box", rosterBox);

  // ── The live cursors, read off the session module itself ─────────────────────────────
  const cursors = await a.evaluate(async () => {
    const m = (await import(
      /* @vite-ignore */ "/src/games/shared/useSession.ts"
    )) as { peerCursors: { value: Record<string, number | null> } };
    return m.peerCursors.value;
  });
  say("peerCursors", cursors);

  // ── The 16-dot chart: how many dots share a cell, 9×9 and 16×16 ─────────────────────
  const collisions = await a.evaluate((cur: Record<string, number | null>) => {
    const pos = Object.values(cur).filter((p): p is number => typeof p === "number");
    const out: Record<string, unknown> = {};
    for (const n of [9, 16]) {
      const cells = pos.map((p) => `${Math.floor(p / n)},${p % n}`);
      const dup = cells.length - new Set(cells).size;
      // nearest-neighbour distance in CELLS, for the "can a reader tell them apart" question
      let minD = 99;
      for (let i = 0; i < pos.length; i++)
        for (let j = i + 1; j < pos.length; j++) {
          const d = Math.hypot(
            Math.floor(pos[i] / n) - Math.floor(pos[j] / n),
            (pos[i] % n) - (pos[j] % n),
          );
          if (d < minD) minD = d;
        }
      out[`${n}x${n}`] = {
        dots: pos.length,
        sameCell: dup,
        minNeighbourCells: +minD.toFixed(2),
        minNeighbourPxAt24: +((minD * 24) / n).toFixed(2),
        minNeighbourPxAt96: +((minD * 96) / n).toFixed(2),
      };
    }
    return out;
  }, cursors);
  say("dots.16", collisions);

  await a.addScriptTag({ path: PROTO });

  // ── THE LOBBY at 96px, in the @mbabb card's pose ─────────────────────────────────────
  const lobby = await a.evaluate(async (cur: Record<string, number | null>) => {
    const pi = (await import(
      /* @vite-ignore */ "/src/games/shared/playerIdentity.ts"
    )) as { slugFor: (id: string, taken: ReadonlySet<string>) => string };
    document.querySelector("#plc-lobby")?.remove();
    const card = document.createElement("div");
    card.id = "plc-lobby";
    // AttributionCard's measured pose (R5 F14): 256 wide, popover at 80%, 2px border at
    // 30%, radius 16, padding 16, hung off --head-rule at left: 0.
    card.style.cssText = [
      "position:fixed",
      "top:calc(var(--head-rule, 0.75rem) + 40px)",
      "left:0",
      "z-index:9999",
      "width:256px",
      "padding:16px",
      "border-radius:16px",
      "background:color-mix(in srgb, var(--color-popover) 80%, transparent)",
      "border:2px solid color-mix(in srgb, var(--color-border) 30%, transparent)",
      "display:flex",
      "gap:12px",
      "align-items:flex-start",
      "font-family:var(--font-hand)",
    ].join(";");
    const chart = document.createElement("div");
    chart.id = "plc-lobby-chart";
    const names = document.createElement("ul");
    names.id = "plc-lobby-names";
    names.style.cssText =
      "list-style:none;margin:0;padding:0;font-size:var(--type-tag);line-height:1.35;flex:1 1 auto;min-width:0;";
    const taken = new Set<string>();
    const ids = Object.keys(cur);
    ids.forEach((id, i) => {
      const slug = pi.slugFor(id, taken);
      taken.add(slug);
      const li = document.createElement("li");
      li.textContent = slug;
      li.style.cssText = `--color-user-ink: oklch(var(--peer-ink-l) 0.11 ${((i + 1) * 137.5) % 360}deg); color: var(--color-user-ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`;
      names.appendChild(li);
    });
    card.appendChild(chart);
    card.appendChild(names);
    document.body.appendChild(card);
    const peers = ids.map((id, i) => ({ index: i + 1, pos: cur[id] }));
    await (
      window as unknown as { __PLC: { mount: (o: unknown) => Promise<HTMLElement> } }
    ).__PLC.mount({
      size: 96,
      boardSize: 9,
      strokeUnits: 12,
      dotUnits: (1000 / 9) * 0.32,
      peers,
      host: chart,
    });
    const r = card.getBoundingClientRect();
    const nr = names.getBoundingClientRect();
    const first = names.firstElementChild as HTMLElement;
    return {
      cardW: +r.width.toFixed(1),
      cardH: +r.height.toFixed(1),
      namesW: +nr.width.toFixed(1),
      namesH: +nr.height.toFixed(1),
      rows: names.children.length,
      rowH: first ? +first.getBoundingClientRect().height.toFixed(2) : 0,
      fontPx: first ? getComputedStyle(first).fontSize : "",
      clipped: [...names.children].filter(
        (c) => (c as HTMLElement).scrollWidth > (c as HTMLElement).clientWidth,
      ).length,
      attributionCardH: 151,
    };
  }, cursors);
  say("lobby.96", lobby);

  const afterLobby = await census(a);
  say("budget.withLobby", afterLobby.total);

  // ── THE DOM COST per peer ────────────────────────────────────────────────────────────
  const domCost = await a.evaluate(() => {
    const chart = document.querySelector("#plc-lobby-chart") as HTMLElement;
    const svg = chart.querySelector("svg")!;
    return {
      nodesInChart: chart.querySelectorAll("*").length,
      dots: svg.querySelectorAll("circle").length,
      pathsInChart: svg.querySelectorAll("path").length,
      markupBytes: chart.innerHTML.length,
      perDot: +(
        chart.innerHTML.length / Math.max(1, svg.querySelectorAll("circle").length)
      ).toFixed(0),
      lobbyNodes: document.querySelector("#plc-lobby")!.querySelectorAll("*").length,
    };
  });
  say("dom.cost", domCost);

  // ── THE CROP: the lobby ──────────────────────────────────────────────────────────────
  mkdirSync(FRAMES, { recursive: true });
  if (info.project.name === "chromium") {
    await a
      .locator("#plc-lobby")
      .screenshot({ path: join(FRAMES, "lobby-96-16-names-light-1280.png") });
  }

  await a.evaluate(() => document.querySelector("#plc-lobby")?.remove());

  // ── THE CLUSTER: the same fourteen, all working one 3×3 box ──────────────────────────
  // The spread above is the flattering case. People do not spread; they work the region they
  // are arguing about. This is the chart's real density test.
  const cluster = await a.evaluate(() => {
    const box = [0, 1, 2, 9, 10, 11, 18, 19, 20]; // the top-left 3×3 of a 9×9
    const pos = Array.from({ length: 14 }, (_, i) => box[i % box.length]);
    const out: Record<string, unknown> = {};
    for (const n of [9, 16]) {
      const cells = pos.map((p) => `${Math.floor(p / 9)},${p % 9}`);
      const counts: Record<string, number> = {};
      for (const c of cells) counts[c] = (counts[c] ?? 0) + 1;
      const stacked = Object.values(counts).filter((v) => v > 1).length;
      out[`${n}x${n}`] = {
        dots: pos.length,
        distinctCells: new Set(cells).size,
        cellsHoldingMoreThanOne: stacked,
        deepestStack: Math.max(...Object.values(counts)),
        cellPitchPxAt24: +(24 / n).toFixed(2),
        cellPitchPxAt96: +(96 / n).toFixed(2),
      };
    }
    return out;
  });
  say("dots.cluster", cluster);

  // ── THE MASTHEAD MARK at 24px + THE 44×44 FLOOR, on a REAL coarse phone ─────────────
  // Its own context: `--tap-floor` is declared once inside the shared `(pointer: coarse)`
  // rule (R6 law 38), so a fine-pointer 390px page reads the token as EMPTY and the floor
  // measured there is the fallback, not the product's. A first pass of this probe did
  // exactly that and printed `tapFloorToken: ""`.
  const phoneCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const phone = await phoneCtx.newPage();
  await phone.goto(SOLO);
  await settled(phone);
  // the bake, so the census is the SETTLED scene the budget gates (filterBudget.ts: the boot
  // window carries +8 `svg.rest-pose` and +4 `g.logo-pose` and reads 21)
  await expect
    .poll(() => census(phone).then((c) => c.total), { timeout: 30000, intervals: [500] })
    .toBe(9);
  await phone.addScriptTag({ path: PROTO });
  const floor = await phone.evaluate(async () => {
    const attribution = document.querySelector(
      ".mobile-attribution .attribution-trigger, .mobile-attribution button",
    ) as HTMLElement | null;
    const ab = attribution?.getBoundingClientRect();
    const sun = document.querySelector(
      ".corner-right, .dark-mode-toggle",
    ) as HTMLElement | null;
    const sb = sun?.getBoundingClientRect();
    document.querySelector("#plc-mark")?.remove();
    const btn = document.createElement("button");
    btn.id = "plc-mark";
    btn.type = "button";
    btn.setAttribute("aria-label", "who is on this board");
    // The floor is a TOKEN (`--tap-floor: 2.75rem`, R6 law 38) — read it, never assume 44.
    btn.style.cssText = [
      "position:fixed",
      "top:var(--head-rule, 0.75rem)",
      `left:${(ab?.right ?? 76).toFixed(1)}px`,
      "z-index:41",
      "min-width:var(--tap-floor, 2.75rem)",
      "min-height:var(--tap-floor, 2.75rem)",
      "display:inline-flex",
      "align-items:center",
      "justify-content:center",
      "background:transparent",
      "border:none",
      "padding:0",
    ].join(";");
    document.body.appendChild(btn);
    await (
      window as unknown as { __PLC: { mount: (o: unknown) => Promise<HTMLElement> } }
    ).__PLC.mount({
      size: 24,
      boardSize: 9,
      strokeUnits: 12,
      dotUnits: (1000 / 9) * 0.32,
      peers: [
        { index: 1, pos: 10 },
        { index: 2, pos: 40 },
        { index: 3, pos: 70 },
      ],
      host: btn,
    });
    const bb = btn.getBoundingClientRect();
    return {
      tapFloorToken: getComputedStyle(document.documentElement)
        .getPropertyValue("--tap-floor")
        .trim(),
      attribution: ab
        ? { x: +ab.x.toFixed(1), y: +ab.y.toFixed(1), w: +ab.width.toFixed(1), h: +ab.height.toFixed(1) }
        : null,
      sun: sb
        ? { x: +sb.x.toFixed(1), y: +sb.y.toFixed(1), w: +sb.width.toFixed(1), h: +sb.height.toFixed(1) }
        : null,
      freeBand: ab && sb ? +(sb.x - ab.right).toFixed(1) : null,
      mark: { x: +bb.x.toFixed(1), y: +bb.y.toFixed(1), w: +bb.width.toFixed(1), h: +bb.height.toFixed(1) },
      clearsFloorW: bb.width >= 44,
      clearsFloorH: bb.height >= 44,
      bandLeftAfterMark: ab && sb ? +(sb.x - bb.right).toFixed(1) : null,
      overlapsSun: sb ? bb.right > sb.x : null,
      overlapsAttribution: ab ? bb.x < ab.right : null,
    };
  });
  say("floor.390", floor);

  // negative control: the SAME mark without the floor — it must fail the assertion it passes
  const neg = await phone.evaluate(() => {
    const btn = document.querySelector("#plc-mark") as HTMLElement;
    btn.style.minWidth = "0";
    btn.style.minHeight = "0";
    const bb = btn.getBoundingClientRect();
    return { w: +bb.width.toFixed(1), h: +bb.height.toFixed(1) };
  });
  say("floor.negativeControl", neg);
  await phone.evaluate(() => {
    const btn = document.querySelector("#plc-mark") as HTMLElement;
    btn.style.minWidth = "var(--tap-floor, 2.75rem)";
    btn.style.minHeight = "var(--tap-floor, 2.75rem)";
  });

  const phoneCensus = await census(phone);
  say("budget.phoneWithMark", phoneCensus.total);
  say("budget.phoneRows", phoneCensus.rows);

  if (info.project.name === "chromium") {
    await phone.screenshot({
      path: join(FRAMES, "mark-24-n3-head-390.png"),
      clip: { x: 0, y: 0, width: 390, height: 56 },
    });
  }

  // ── SOLO: the EMPTY miniature, which is the family's own teaching claim ─────────────
  const solo = await phone.evaluate(async () => {
    const btn = document.querySelector("#plc-mark") as HTMLElement;
    btn.innerHTML = "";
    await (
      window as unknown as { __PLC: { mount: (o: unknown) => Promise<HTMLElement> } }
    ).__PLC.mount({
      size: 24,
      boardSize: 9,
      strokeUnits: 12,
      dotUnits: 0,
      peers: [],
      host: btn,
    });
    const svg = btn.querySelector("svg")!;
    return {
      dots: svg.querySelectorAll("circle").length,
      paths: svg.querySelectorAll("path").length,
      markupBytes: btn.innerHTML.length,
    };
  });
  say("solo.empty", solo);
  if (info.project.name === "chromium") {
    await phone.screenshot({
      path: join(FRAMES, "solo-empty-24-head-390.png"),
      clip: { x: 0, y: 0, width: 200, height: 56 },
    });
  }

  mkdirSync(OUT, { recursive: true });
  writeFileSync(
    join(OUT, `lobby-${info.project.name}.json`),
    JSON.stringify(
      {
        engine: info.project.name,
        roster,
        rosterBox,
        cursors,
        collisions,
        lobby,
        domCost,
        cluster,
        floor,
        neg,
        solo,
        budget: {
          before: before.total,
          withLobby: afterLobby.total,
          phoneWithMark: phoneCensus.total,
          phoneRows: phoneCensus.rows,
        },
      },
      null,
      1,
    ),
  );
  await phoneCtx.close();
  await ctx.close();
});
