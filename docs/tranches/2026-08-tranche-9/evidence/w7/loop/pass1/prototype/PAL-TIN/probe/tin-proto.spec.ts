/**
 * PAL-TIN pass-1 PROTOTYPE PROBE — the landed tin, measured on the real surface.
 *
 * PRM: live, because the draw-in row (P8) is the measurement; every geometry read waits for
 * the animation to settle first and the PRM arm re-runs under emulateMedia.
 *
 * Runs against the lane's own dev server (127.0.0.1:4245) serving the PROTOTYPE worktree.
 * Nothing here is a product file.
 */
import { test, expect, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/PAL-TIN";
const READ = join(OUT, "readings");
const FRAMES = join(OUT, "frames");
mkdirSync(READ, { recursive: true });
mkdirSync(FRAMES, { recursive: true });

const SOLO9 = "./?size=3&difficulty=EASY&wire=local";
const SOLO16 = "./?size=4&difficulty=EASY&wire=local";

const bank = (name: string, data: unknown) =>
  writeFileSync(join(READ, name), JSON.stringify(data, null, 1));

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".game-cell .glyph-svg, .game-cell input").count(), {
      timeout: 60000,
    })
    .toBeGreaterThan(0);
  await page.waitForTimeout(600);
}

/** The portrait fold keeps the card in the dock; the sheet SLIDES, so settle ~700ms. */
async function openDock(page: Page) {
  const tab = page.locator(".drawer-tab");
  if (await tab.count()) {
    if ((await tab.getAttribute("aria-expanded")) !== "true") {
      await tab.click();
      await page.waitForTimeout(900);
    }
  }
}

async function openRoom(page: Page): Promise<string> {
  await openDock(page);
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return new URL(page.url()).searchParams.get("s")!;
}

/** n fake peers say `hi` on the room's own channel — the product's own presence path. The
 *  page answers each with `st` (it holds the board), which is where `k` is agreed. */
async function fillRoom(page: Page, room: string, n: number) {
  return page.evaluate(
    async ({ room, n }) => {
      const w = window as unknown as Record<string, unknown>;
      const ch = new BroadcastChannel(`board:${room}`);
      w.__ch = ch;
      w.__st = null;
      ch.onmessage = (ev: MessageEvent) => {
        if (ev.data?.kind === "st") w.__st = ev.data.data;
      };
      // The room's own channel has to exist before anybody says hello — a `hi` posted into a
      // wire that has not attached is simply never heard (measured: one peer short at 390).
      await new Promise((r) => setTimeout(r, 700));
      const ids: string[] = [];
      for (let i = 0; i < n; i++) {
        // `zz…` so the page is always the lowest id in the room and therefore the one that
        // owes the board — the `st` this rig reads is the product's own snapshot path.
        const id = `zz${String(i).padStart(2, "0")}-peer${i}`;
        ids.push(id);
        ch.postMessage({ kind: "hi", data: {}, from: id });
        await new Promise((r) => setTimeout(r, 60));
      }
      // The board is owed to the LOWEST id in the room, so a page that does not hold it sends
      // no `st`. Re-say hello until the snapshot lands (or give up and let the row say so).
      for (const id of ids) ch.postMessage({ kind: "hi", data: {}, from: id }); // second pass
      for (let t = 0; t < 12 && !w.__st; t++) {
        ch.postMessage({ kind: "hi", data: {}, from: ids[ids.length - 1] });
        await new Promise((r) => setTimeout(r, 400));
      }
      await new Promise((r) => setTimeout(r, 400));
      return { ids, st: w.__st };
    },
    { room, n },
  );
}

/** A peer writes a digit — a real `op` on the wire, admitted by the real ledger. */
async function peerWrites(page: Page, from: string, pos: number, value: number) {
  await page.evaluate(
    ({ from, pos, value }) => {
      const w = window as unknown as Record<string, any>;
      const st = w.__st;
      w.__lam = (w.__lam ?? 1000) + 1;
      w.__ch.postMessage({
        kind: "op",
        data: {
          p: pos,
          v: value,
          s: 0,
          l: w.__lam,
          a: from,
          e: st.e,
          ea: st.ea,
        },
        from,
      });
    },
    { from, pos, value },
  );
  await page.waitForTimeout(250);
}

/* ══ P1 · AA on the engine's own bytes ══════════════════════════════════════════ */
test("P1 — five sticks, four grounds, declared = painted", async ({ page }, info) => {
  await page.goto(SOLO9);
  await settled(page);
  const rows = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const cv = document.createElement("canvas");
    cv.width = cv.height = 4;
    const g = cv.getContext("2d", { willReadFrequently: true })!;
    const paint = (css: string, alpha = 1, under?: string) => {
      g.globalAlpha = 1;
      g.clearRect(0, 0, 4, 4);
      if (under) {
        g.fillStyle = under;
        g.fillRect(0, 0, 4, 4);
      }
      g.globalAlpha = alpha;
      g.fillStyle = css;
      g.fillRect(0, 0, 4, 4);
      g.globalAlpha = 1;
      const d = g.getImageData(1, 1, 1, 1).data;
      return [d[0], d[1], d[2]] as [number, number, number];
    };
    const lum = ([r, gg, b]: number[]) => {
      const f = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b);
    };
    const ratio = (a: number[], b: number[]) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
      return (x + 0.05) / (y + 0.05);
    };
    const out: Record<string, unknown> = {};
    for (const theme of ["light", "dark"]) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      const c2 = getComputedStyle(document.documentElement);
      const grounds = {
        background: c2.getPropertyValue("--color-background").trim(),
        card: c2.getPropertyValue("--color-card").trim(),
      };
      const sticks: Record<string, unknown> = {};
      for (let i = 1; i <= 5; i++) {
        const declared = c2.getPropertyValue(`--color-peer-${i}`).trim();
        // what a real element resolves it to (the engine's own parse of the declaration)
        const probe = document.createElement("span");
        probe.style.color = `var(--color-peer-${i})`;
        document.body.appendChild(probe);
        const resolved = getComputedStyle(probe).color;
        probe.remove();
        const painted = paint(declared);
        const ground: Record<string, number> = {};
        for (const [gn, gv] of Object.entries(grounds)) {
          ground[gn] = +ratio(painted, paint(gv)).toFixed(3);
        }
        sticks[`peer-${i}`] = {
          declared,
          resolved,
          painted: `rgb(${painted.join(", ")})`,
          agree: `rgb(${painted.join(", ")})` === resolved,
          ...ground,
        };
      }
      out[theme] = { grounds, sticks };
    }
    document.documentElement.classList.remove("dark");
    return out;
  });
  bank(`p1-aa-${info.project.name}.json`, rows);
  const all: number[] = [];
  let disagreed = 0;
  for (const theme of ["light", "dark"] as const) {
    const t = rows[theme] as any;
    for (const [n, s] of Object.entries<any>(t.sticks)) {
      all.push(s.background, s.card);
      if (!s.agree) disagreed++;
      console.log(
        `TIN-P1|${info.project.name}|${theme}|${n}|${s.declared}|painted=${s.painted}|agree=${s.agree}|bg=${s.background}|card=${s.card}`,
      );
    }
  }
  console.log(`TIN-P1|${info.project.name}|worst=${Math.min(...all)}|disagreed=${disagreed}`);
  expect(disagreed, "declared = painted byte-for-byte").toBe(0);
  expect(Math.min(...all), "AA 4.5:1 on four grounds").toBeGreaterThanOrEqual(4.5);
});

/* ══ P2 · the peer cursor ring at its DRAWN pressure ════════════════════════════ */
test("P2 — the ring's drawn opacity over card and background", async ({ page }, info) => {
  await page.goto(SOLO9);
  await settled(page);
  const room = await openRoom(page);
  const { ids, st } = await fillRoom(page, room, 1);
  expect(st, "the page published its board").toBeTruthy();
  // a peer points at a cell — the real `cur` path, so the real ring paints
  await page.evaluate(
    ({ from, st }) => {
      const w = window as unknown as Record<string, any>;
      w.__ch.postMessage({ kind: "cur", data: { p: 10, e: st.e, ea: st.ea }, from });
    },
    { from: ids[0], st },
  );
  await page.waitForTimeout(500);
  const drawn = await page.evaluate(() => {
    const el = document.querySelector(".game-cell.is-peer-cursor .cell-ghost-path");
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      strokeOpacity: cs.strokeOpacity,
      stroke: cs.stroke,
      strokeWidth: cs.strokeWidth,
    };
  });
  const sweep = await page.evaluate(() => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 4;
    const g = cv.getContext("2d", { willReadFrequently: true })!;
    const over = (ink: string, ground: string, alpha: number) => {
      g.globalAlpha = 1;
      g.fillStyle = ground;
      g.fillRect(0, 0, 4, 4);
      g.globalAlpha = alpha;
      g.fillStyle = ink;
      g.fillRect(0, 0, 4, 4);
      g.globalAlpha = 1;
      const d = g.getImageData(1, 1, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    const flat = (c: string) => {
      g.globalAlpha = 1;
      g.clearRect(0, 0, 4, 4);
      g.fillStyle = c;
      g.fillRect(0, 0, 4, 4);
      const d = g.getImageData(1, 1, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    const lum = ([r, gg, b]: number[]) => {
      const f = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b);
    };
    const ratio = (a: number[], b: number[]) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
      return (x + 0.05) / (y + 0.05);
    };
    const out: Record<string, unknown> = {};
    for (const theme of ["light", "dark"]) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      const cs = getComputedStyle(document.documentElement);
      const grounds = {
        background: cs.getPropertyValue("--color-background").trim(),
        card: cs.getPropertyValue("--color-card").trim(),
      };
      for (const alpha of [0.55, 0.75, 0.8]) {
        const worst: Record<string, number> = {};
        for (let i = 1; i <= 5; i++) {
          const ink = cs.getPropertyValue(`--color-peer-${i}`).trim();
          for (const [gn, gv] of Object.entries(grounds)) {
            worst[`peer-${i}/${gn}`] = +ratio(over(ink, gv, alpha), flat(gv)).toFixed(3);
          }
        }
        out[`${theme}@${alpha}`] = worst;
      }
    }
    document.documentElement.classList.remove("dark");
    return out;
  });
  bank(`p2-ring-${info.project.name}.json`, { drawn, sweep });
  const at = (k: string) => Math.min(...Object.values(sweep[k] as Record<string, number>));
  const w080 = Math.min(at("light@0.8"), at("dark@0.8"));
  const w075 = Math.min(at("light@0.75"), at("dark@0.75"));
  const w055 = Math.min(at("light@0.55"), at("dark@0.55"));
  console.log(
    `TIN-P2|${info.project.name}|drawn=${drawn?.strokeOpacity}|0.80worst=${w080}|0.75control=${w075}|0.55HEAD=${w055}`,
  );
  expect(drawn?.strokeOpacity, "the rule that actually paints").toBe("0.8");
  expect(w080, "3:1 at the drawn pressure").toBeGreaterThanOrEqual(3.0);
  expect(w075, "the negative control is under").toBeLessThan(3.0);
  expect(w055, "HEAD's pressure is under").toBeLessThan(3.0);
});

/* ══ P3 · solo mounts nothing ═══════════════════════════════════════════════════ */
test("P3 — solo: zero ticks, and the fingerprint", async ({ page }, info) => {
  await page.goto(SOLO9);
  await settled(page);
  const fp = await page.evaluate(() => {
    const cell = document.querySelectorAll(".game-cell");
    const cs = getComputedStyle(document.documentElement);
    const inputs = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
    const glyphs = [...document.querySelectorAll(".game-cell .glyph-svg path")];
    const r = (e: Element) => {
      const b = e.getBoundingClientRect();
      return [b.x, b.y, b.width, b.height].map((n) => +n.toFixed(2)).join(",");
    };
    return {
      ticks: document.querySelectorAll(".glyph-tick").length,
      rosterTicks: document.querySelectorAll(".roster-tick").length,
      cells: cell.length,
      userInk: cs.getPropertyValue("--color-user-ink").trim(),
      glyphStrokes: [...new Set(glyphs.map((g) => getComputedStyle(g).stroke))],
      boardRect: r(document.querySelector(".board-wrapper") ?? document.body),
      cellRects: [...cell].slice(0, 12).map(r).join("|"),
      filled: inputs.filter((i) => i.value).length,
      ghostFill: getComputedStyle(
        document.querySelector(".game-cell .cell-ghost-path")!,
      ).fillOpacity,
    };
  });
  bank(`p3-solo-${info.project.name}.json`, fp);
  console.log(`TIN-P3|${info.project.name}|${JSON.stringify(fp)}`);
  expect(fp.ticks, "a solo board mounts no tick").toBe(0);
  expect(fp.rosterTicks, "no roster tick either").toBe(0);
  expect(fp.userInk, "solo keeps the incumbent blue").toBe("#2563eb");
});

/* ══ P4 · the sixteen-person roster ═════════════════════════════════════════════ */
for (const [label, w, h] of [
  ["desk", 1280, 800],
  ["phone", 390, 844],
] as const) {
  test(`P4 — sixteen people, five inks (${label})`, async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    await page.goto(SOLO9);
    await settled(page);
    const room = await openRoom(page);
    await fillRoom(page, room, 15);
    // the phone keeps the roster in the dock — open it and let the sheet settle
    if (label === "phone") {
      const tab = page.locator('button[aria-label*="controls" i], .dock-tab').first();
      if (await tab.count()) {
        await tab.click({ force: true }).catch(() => {});
        await page.waitForTimeout(900);
      }
    }
    await page.waitForTimeout(600);
    const read = await page.evaluate(() => {
      const rows = [...document.querySelectorAll(".players-roster .player-row")];
      const inks = new Set<string>();
      const detail = rows.map((li) => {
        const sw = li.querySelector(".player-swatch");
        const nm = li.querySelector(".player-name");
        const tick = li.querySelector(".roster-tick");
        const paint = sw ? getComputedStyle(sw).backgroundColor : "";
        if (paint) inks.add(paint);
        const lb = li.getBoundingClientRect();
        const tb = tick?.getBoundingClientRect();
        return {
          slug: nm?.textContent?.trim() ?? "",
          ink: paint,
          rowH: +lb.height.toFixed(2),
          swatchH: sw ? +sw.getBoundingClientRect().height.toFixed(2) : 0,
          ticks: tick ? tick.querySelectorAll("path").length : 0,
          tickH: tb ? +tb.height.toFixed(2) : 0,
          tickStroke: tick
            ? getComputedStyle(tick.querySelector("path")!).stroke
            : "",
          inLineBox: tb ? tb.top >= lb.top - 0.5 && tb.bottom <= lb.bottom + 0.5 : true,
        };
      });
      return {
        rows: rows.length,
        distinctInks: [...inks],
        withTick: detail.filter((d) => d.ticks > 0).length,
        allInLineBox: detail.every((d) => d.inLineBox),
        rowHeights: [...new Set(detail.map((d) => d.rowH))],
        detail,
      };
    });
    bank(`p4-roster-${label}-${info.project.name}.json`, read);
    console.log(
      `TIN-P4|${info.project.name}|${label}|rows=${read.rows}|inks=${read.distinctInks.length}|withTick=${read.withTick}|rowH=${read.rowHeights.join("/")}|inLineBox=${read.allInLineBox}`,
    );
    if (label === "desk" && info.project.name === "chromium") {
      // The well scrolls (max-height 7.5rem) — scroll it to the sharers so the frame carries
      // the legend claim: the same mark beside a name that sits under that player's digits.
      const roster = page.locator(".controls-card .players-roster");
      await roster.evaluate((e) => (e.scrollTop = 76));
      await page.waitForTimeout(300);
      await roster.screenshot({ path: join(FRAMES, "roster-sixteen-light.png") });
    }
    expect(read.rows, "sixteen at the table").toBe(16);
    expect(read.distinctInks.length, "five pencils").toBe(5);
    expect(read.withTick, "eleven sharers carry a tick").toBe(11);
    expect(read.allInLineBox, "every tick inside its row's line box").toBe(true);
    await ctx.close();
  });
}

/* ══ P5 · the tick on a digit, dpr3 ═════════════════════════════════════════════ */
for (const [label, url, size] of [
  ["9x9", SOLO9, 9],
  ["16x16", SOLO16, 16],
] as const) {
  test(`P5 — the tick under a digit, dpr3 (${label})`, async ({ browser }, info) => {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 3,
    });
    const page = await ctx.newPage();
    await page.goto(url);
    await settled(page);
    const room = await openRoom(page);
    const { ids, st } = await fillRoom(page, room, 8);
    expect(st).toBeTruthy();
    // index 5 = amber again, one lap: the sixth pencil. index 0 is the page itself (amber, no
    // lap), so two adjacent cells carry the same ink and only the tick tells them apart.
    const sixth = ids[4]; // self=0, peers take 1..8 → ids[4] is index 5
    const first = ids[0]; // index 1 — green, no tick (the control that isn't amber)
    const empty = await page.evaluate(() => {
      const ins = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
      return ins.map((i, n) => (i.value || i.disabled ? -1 : n)).filter((n) => n >= 0);
    });
    // A SIDE-BY-SIDE PAIR, both free, both in one row — the frame's claim needs two cells the
    // eye reads together, so the write positions are chosen for adjacency rather than taken
    // off the top of the list.
    const pairStart =
      empty.find((n) => empty.includes(n + 1) && n % size < size - 1) ?? empty[0];
    const [a, b] = [pairStart, empty.includes(pairStart + 1) ? pairStart + 1 : empty[1]];
    await peerWrites(page, sixth, a, 1);
    // A green control elsewhere on the board (index 1, no lap), and `b` is left free for YOU:
    // you are index 0, the same amber as the sixth player, and only the tick separates you.
    await peerWrites(page, first, empty[empty.length - 1], 2);
    await page.waitForTimeout(900);
    // THE CELL IS THE ONE THAT CARRIES THE TICK, found in the DOM rather than by arithmetic:
    // the deal is fresh every run, so an input index is not a cell index.
    const tickIdx = await page.evaluate(() =>
      [...document.querySelectorAll(".game-cell")].findIndex((c) => c.querySelector(".glyph-tick")),
    );
    expect(tickIdx, "a tick is mounted on the board").toBeGreaterThanOrEqual(0);
    const read = await page.evaluate(
      ({ a }) => {
        const cells = [...document.querySelectorAll(".game-cell")];
        const cell = cells[a];
        const tick = cell?.querySelector(".glyph-tick");
        const glyph = cell?.querySelector(".glyph-svg");
        const cb = cell.getBoundingClientRect();
        const paths = tick ? [...tick.querySelectorAll("path")] : [];
        const boxes = paths.map((p) => p.getBoundingClientRect());
        const top = Math.min(...boxes.map((r) => r.top));
        const bot = Math.max(...boxes.map((r) => r.bottom));
        const gb = glyph
          ? [...glyph.querySelectorAll("path")].reduce(
              (acc: DOMRect | null, p) => {
                const r = p.getBoundingClientRect();
                return acc
                  ? (new DOMRect(
                      Math.min(acc.x, r.x),
                      Math.min(acc.y, r.y),
                      Math.max(acc.right, r.right) - Math.min(acc.x, r.x),
                      Math.max(acc.bottom, r.bottom) - Math.min(acc.y, r.y),
                    ) as DOMRect)
                  : r;
              },
              null as DOMRect | null,
            )
          : null;
        return {
          cell: { h: +cb.height.toFixed(2), w: +cb.width.toFixed(2), top: cb.top, bottom: cb.bottom },
          strokes: paths.length,
          tickTop: +top.toFixed(2),
          tickBottom: +bot.toFixed(2),
          tickHeightPct: +(((bot - top) / cb.height) * 100).toFixed(2),
          bandStart: +(cb.top + cb.height * 0.825).toFixed(2),
          insideBand: top >= cb.top + cb.height * 0.825 - 0.75 && bot <= cb.bottom + 0.75,
          glyphBottom: gb ? +gb.bottom.toFixed(2) : null,
          overlapsGlyph: gb ? top < gb.bottom - 0.5 : null,
          stroke: paths[0] ? getComputedStyle(paths[0]).stroke : "",
          strokeWidthPx: paths[0] ? getComputedStyle(paths[0]).strokeWidth : "",
          ink: getComputedStyle(cell).getPropertyValue("--color-user-ink").trim(),
          neighbourInk: getComputedStyle(cells[a + 1] ?? cell)
            .getPropertyValue("--color-user-ink")
            .trim(),
          totalTicks: document.querySelectorAll(".glyph-tick").length,
        };
      },
      { a: tickIdx },
    );
    // print + forced colours, and the un-widened negative control
    await page.evaluate(
      ({ a }) => {
        const cell = document.querySelectorAll(".game-cell")[a];
        const tick = cell.querySelector(".glyph-tick")!;
        const clone = tick.cloneNode(true) as SVGElement;
        clone.setAttribute("class", "tick-control");
        clone.querySelectorAll("path").forEach((p) => {
          p.setAttribute("class", "");
          (p as SVGPathElement).style.stroke = "var(--color-user-ink)";
          (p as SVGPathElement).style.fill = "none";
        });
        cell.appendChild(clone);
      },
      { a: tickIdx },
    );
    const modes: Record<string, unknown> = {};
    for (const [mode, media] of [
      ["print", { media: "print" as const }],
      ["forced", { forcedColors: "active" as const }],
    ]) {
      try {
        await page.emulateMedia(media as never);
        await page.waitForTimeout(220);
        modes[mode] = await page.evaluate(
          ({ a }) => {
            const cell = document.querySelectorAll(".game-cell")[a];
            const t = cell.querySelector(".glyph-tick path");
            const c = cell.querySelector(".tick-control path");
            const g = cell.querySelector(".glyph-svg path");
            return {
              tick: t ? getComputedStyle(t).stroke : "(none)",
              control: c ? getComputedStyle(c).stroke : "(none)",
              digit: g ? getComputedStyle(g).stroke : "(none)",
            };
          },
          { a: tickIdx },
        );
      } catch (e) {
        modes[mode] = { error: String(e).slice(0, 120) };
      }
      await page.emulateMedia({ media: "screen", forcedColors: "none" }).catch(() => {});
    }
    bank(`p5-tick-${label}-${info.project.name}.json`, { read, modes });
    console.log(
      `TIN-P5|${info.project.name}|${label}|cell=${read.cell.h}px|strokes=${read.strokes}|tickH%=${read.tickHeightPct}|band=${read.insideBand}|overlapGlyph=${read.overlapsGlyph}|stroke=${read.stroke}|sw=${read.strokeWidthPx}|ink=${read.ink}|neighbour=${read.neighbourInk}`,
    );
    console.log(`TIN-P5|${info.project.name}|${label}|modes=${JSON.stringify(modes)}`);
    if (info.project.name === "chromium" && label === "9x9") {
      // THE FRAME'S CLAIM: two adjacent cells in the SAME pencil, told apart by the tick alone.
      // You are index 0 (amber, no lap) in this room and the sixth player is index 5 (amber,
      // one lap), so your own write beside theirs is the whole design in one crop.
      const cells = page.locator(".game-cell");
      const near = await page.evaluate(
        ({ i, b }) => {
          const cs = [...document.querySelectorAll(".game-cell")];
          for (const j of [b, i + 1, i - 1]) {
            const inp = cs[j]?.querySelector("input") as HTMLInputElement | null;
            if (inp && !inp.disabled && !inp.value) return j;
          }
          return -1;
        },
        { i: tickIdx, b },
      );
      if (near >= 0) {
        await cells.nth(near).locator("input").fill("9");
        await page.waitForTimeout(800);
        // drop the focus ring — the frame is about two inks, not about the selection
        await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
        await page.waitForTimeout(400);
      }
      const pair = await page.evaluate(
        ({ i, j }) => {
          const cs = [...document.querySelectorAll(".game-cell")];
          const ink = (n: number) =>
            getComputedStyle(cs[n]).getPropertyValue("--color-user-ink").trim();
          return {
            tickCellInk: ink(i),
            mineInk: j >= 0 ? ink(j) : "(none)",
            mineTicks: j >= 0 ? cs[j].querySelectorAll(".glyph-tick").length : -1,
          };
        },
        { i: tickIdx, j: near },
      );
      console.log(`TIN-P5|chromium|pair=${JSON.stringify(pair)}`);
      bank("p5-pair-chromium.json", pair);
      const box1 = await cells.nth(tickIdx).boundingBox();
      const box2 = await cells.nth(near >= 0 ? near : tickIdx + 1).boundingBox();
      if (box1 && box2) {
        await page.screenshot({
          path: join(FRAMES, "two-cells-amber-and-tick-light.png"),
          clip: {
            x: Math.min(box1.x, box2.x) - 4,
            y: Math.min(box1.y, box2.y) - 4,
            width: Math.abs(box2.x - box1.x) + box1.width + 8,
            height: Math.max(box1.height, box2.height) + 8,
          },
        });
      }
    }
    if (info.project.name === "webkit" && label === "16x16") {
      await page.emulateMedia({ colorScheme: "dark" });
      await page.evaluate(() => document.documentElement.classList.add("dark"));
      await page.waitForTimeout(500);
      const box = await page.locator(".game-cell").nth(tickIdx).boundingBox();
      if (box)
        await page.screenshot({
          path: join(FRAMES, "tick-16x16-dark.png"),
          clip: {
            x: box.x - 6,
            y: box.y - 6,
            width: box.width * 3 + 12,
            height: box.height * 2 + 12,
          },
        });
    }
    expect(read.strokes, "one lap, one stroke").toBe(1);
    expect(read.insideBand, "the tick sits in the lower 17.5% band").toBe(true);
    expect(read.overlapsGlyph, "it never touches the digit's box").toBe(false);
    await ctx.close();
  });
}

/* ══ P6 · the draw-in ═══════════════════════════════════════════════════════════ */
test("P6 — the tick draws in behind the digit, and PRM snaps", async ({ browser }, info) => {
  for (const prm of ["live", "reduce"] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    if (prm === "reduce") await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(SOLO9);
    await settled(page);
    const room = await openRoom(page);
    const { ids, st } = await fillRoom(page, room, 8);
    expect(st).toBeTruthy();
    const empty = await page.evaluate(() => {
      const ins = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
      return ins.map((i, n) => (i.value || i.disabled ? -1 : n)).filter((n) => n >= 0);
    });
    const pos = empty[3];
    await peerWrites(page, ids[4], pos, 4);
    await page.waitForTimeout(150);
    const trace = await page.evaluate(
      async () => {
        const p = document.querySelector(".glyph-tick path") as SVGPathElement | null;
        if (!p) return null;
        const cs = getComputedStyle(p);
        const anim = (p as unknown as { getAnimations?: () => Animation[] }).getAnimations?.() ?? [];
        const a = anim[0] as (Animation & { animationName?: string }) | undefined;
        const eff = a?.effect?.getTiming?.();
        return {
          animationName: cs.animationName,
          duration: cs.animationDuration,
          delay: cs.animationDelay,
          easing: cs.animationTimingFunction,
          fill: cs.animationFillMode,
          runtimeDelay: eff?.delay ?? null,
          runtimeDuration: eff?.duration ?? null,
          dashoffsetNow: cs.strokeDashoffset,
          digitAnim: (() => {
            const g = document.querySelector(".glyph-tick")
              ?.parentElement?.querySelector(".glyph-svg path");
            return g ? getComputedStyle(g).animationDelay : "(none)";
          })(),
        };
      },
    );
    console.log(`TIN-P6|${info.project.name}|${prm}|${JSON.stringify(trace)}`);
    bank(`p6-drawin-${prm}-${info.project.name}.json`, trace);
    if (prm === "live") {
      expect(trace?.animationName).toContain("pencil-draw-on");
      expect(trace?.duration).toBe("0.35s");
      expect(trace?.delay).toBe("0.09s");
    } else {
      expect(trace?.animationName, "PRM snaps: the primitive's own reduce arm").toBe("none");
    }
    await ctx.close();
  }
});

/* ══ P7 · filter census with sixteen people at the table ════════════════════════ */
test("P7 — filterBudget with a sixteen-player board", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto(SOLO9);
  await settled(page);
  const room = await openRoom(page);
  const { ids, st } = await fillRoom(page, room, 15);
  expect(st).toBeTruthy();
  const empty = await page.evaluate(() => {
    const ins = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
    return ins.map((i, n) => (i.value || i.disabled ? -1 : n)).filter((n) => n >= 0);
  });
  for (let i = 0; i < 6; i++) await peerWrites(page, ids[i + 4], empty[i], (i % 9) + 1);
  await page.waitForTimeout(1200);
  const census = await page.evaluate(() => {
    const live: string[] = [];
    for (const el of Array.from(document.querySelectorAll("*"))) {
      const cs = getComputedStyle(el);
      if (cs.filter !== "none" && cs.display !== "none") {
        live.push(
          `${el.tagName.toLowerCase()}.${(el.getAttribute("class") || "").split(/\s+/)[0]}`,
        );
      }
    }
    return {
      count: live.length,
      live,
      ticks: document.querySelectorAll(".glyph-tick").length,
      rosterTicks: document.querySelectorAll(".roster-tick").length,
    };
  });
  bank(`p7-census-${info.project.name}.json`, census);
  console.log(
    `TIN-P7|${info.project.name}|filters=${census.count}|ticks=${census.ticks}|rosterTicks=${census.rosterTicks}|${census.live.join(",")}`,
  );
  expect(census.count, "the census does not move").toBe(9);
  expect(census.ticks, "ticks are mounted on the board").toBeGreaterThan(0);
});
