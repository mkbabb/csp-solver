/**
 * PLR-COUNT pass 2 — THE GATE BATTERY, on the prototype's own surface.
 *
 * Every row here is one of the family's born-RED gates read as bytes off the running page.
 * Nothing is asserted that is not also banked: the JSON beside this file is the reading, the
 * `expect`s are the gate. Both engines, both regimes, the settle the dock sheet asks for.
 */
import { test, expect, type Page, type Browser } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(__dirname, "..", "readings");
fs.mkdirSync(OUT, { recursive: true });
const bank = (name: string, engine: string, data: unknown) => {
  fs.writeFileSync(
    path.join(OUT, `${name}-${engine}.json`),
    JSON.stringify(data, null, 1),
  );
};

const DESK = { width: 1280, height: 800 };
const TALL = { width: 390, height: 844 };
const SHORT = { width: 390, height: 664 };

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

let cursor = 0;
/** k synthetic peers say hello on the local arm; the page answers each ack and inks them from
 *  its own walk — the same driver the research lane measured with. */
async function peers(page: Page, room: string, k: number) {
  if (k <= 0) return;
  const from = cursor;
  cursor += k;
  await page.evaluate(
    ({ room, k, from }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < k; i++)
        w.__ch.postMessage({ kind: "hi", data: {}, from: `pp-${from + i}` });
    },
    { room, k, from },
  );
  await page.waitForTimeout(700);
}
async function bye(page: Page, room: string, id: string) {
  await page.evaluate(
    ({ room, id }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      w.__ch.postMessage({ kind: "bye", data: {}, from: id });
    },
    { room, id },
  );
}

const mark = (page: Page) => page.locator("[data-player-mark]:visible").first();

/** The head, as the page reports it: one mark, its box, its name, and what it draws. */
const headState = () =>
  ((): unknown => {
    const r = (el: Element | null) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        x: +b.x.toFixed(2),
        y: +b.y.toFixed(2),
        w: +b.width.toFixed(2),
        h: +b.height.toFixed(2),
        bottom: +b.bottom.toFixed(2),
        right: +b.right.toFixed(2),
      };
    };
    const marks = [...document.querySelectorAll("[data-player-mark]")];
    const vis = marks.filter((m) => m.getBoundingClientRect().width > 0);
    const m = vis[0] as HTMLElement | undefined;
    const pose = m?.querySelector(".pt-pose");
    return {
      marksInDom: marks.length,
      marksVisible: vis.length,
      box: r(m ?? null),
      label: m?.getAttribute("aria-label") ?? null,
      expanded: m?.getAttribute("aria-expanded") ?? null,
      strokes: pose ? pose.querySelectorAll("path").length : 0,
      countText: m?.querySelector(".pt-count")?.textContent ?? null,
      dashoffsets: pose
        ? [...pose.querySelectorAll("path")].map((p) => p.getAttribute("stroke-dashoffset"))
        : [],
      ds: pose ? [...pose.querySelectorAll("path")].map((p) => p.getAttribute("d")) : [],
      transforms: pose
        ? [...pose.querySelectorAll("path")].map((p) => p.getAttribute("transform"))
        : [],
    };
  })();

/** The sheet, once it has settled open. */
const sheetState = () =>
  ((): unknown => {
    const r = (el: Element | null) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        x: +b.x.toFixed(2),
        y: +b.y.toFixed(2),
        w: +b.width.toFixed(2),
        h: +b.height.toFixed(2),
        bottom: +b.bottom.toFixed(2),
        right: +b.right.toFixed(2),
      };
    };
    const all = [...document.querySelectorAll("[data-lobby]")];
    const l = all.find((e) => e.getBoundingClientRect().width > 0) as HTMLElement | undefined;
    if (!l) return { lobbies: all.length, open: 0 };
    const cs = getComputedStyle(l);
    const rows = [...l.querySelectorAll(".pl-row")];
    return {
      lobbies: all.length,
      open: all.filter((e) => getComputedStyle(e).visibility === "visible").length,
      box: r(l),
      ground: cs.backgroundColor,
      state: l.querySelector(".pl-state")?.textContent ?? null,
      rows: rows.length,
      names: rows.map((x) => x.querySelector(".pl-name")?.textContent ?? ""),
      qualifiers: rows.map((x) => x.querySelector(".pl-qualifier")?.textContent ?? ""),
      rowInks: rows.map((x) =>
        getComputedStyle(x.querySelector(".pl-row-mark path")!).stroke,
      ),
      more: l.querySelector(".pl-more")?.textContent ?? null,
      focusables: l.querySelectorAll(
        "a,button,input,select,textarea,[tabindex]:not([tabindex='-1'])",
      ).length,
    };
  })();

async function open(page: Page) {
  await mark(page).click();
  await page.waitForTimeout(750); // the sheet SLIDES; settle past the 150ms fade
}

// ── A · G3 width · G7 one base · G16 tap floor · the sheet's rows ──────────────────────────
test("A the width table, the one base and the row budget", async ({ browser }, info) => {
  const out: Record<string, unknown> = {};
  for (const [vp, box] of [
    ["desk", DESK],
    ["tall", TALL],
    ["short", SHORT],
  ] as const) {
    const coarse = vp !== "desk";
    const ctx = await browser.newContext({
      viewport: box,
      hasTouch: coarse,
      isMobile: coarse,
    });
    const page = await ctx.newPage();
    const room = `a-${vp}-${info.project.name}`;
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);

    const rows: Record<string, unknown> = {};
    let at = 1;
    for (const N of [1, 2, 3, 4, 5, 6, 16]) {
      await peers(page, room, N - at);
      at = N;
      const head = (await page.evaluate(headState)) as Record<string, unknown>;
      await open(page);
      const sheet = await page.evaluate(sheetState);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      rows[`N${N}`] = { head, sheet };
    }
    out[vp] = {
      rows,
      tapFloor: await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--tap-floor"),
      ),
    };
    await ctx.close();
  }
  bank("a-width-base", info.project.name, out);

  // G3 — the measured table, desk and phone alike (the mark's box does not know the regime).
  const desk = (out.desk as any).rows;
  for (const [N, want] of [
    [1, 44],
    [2, 44],
    [3, 51.66],
    [4, 62.28],
    [5, 72.92],
    [6, 44],
    [16, 44],
  ] as const) {
    expect(Math.abs(desk[`N${N}`].head.box.w - want), `width at N=${N}`).toBeLessThan(1.5);
  }
  // G7 — one counting base: the name counts everyone, and the glyph's digits are in the name.
  for (const N of [1, 2, 3, 4, 5, 6, 16]) {
    const h = desk[`N${N}`].head;
    expect(h.label).toBe(N === 1 ? "1 player" : `${N} players`);
    if (h.countText) expect(h.label).toContain(h.countText);
    expect(h.strokes).toBe(N <= 5 ? N : 0);
  }
  // G16 — the floor, both dimensions, coarse.
  expect((out.tall as any).rows.N1.head.box.w).toBeGreaterThanOrEqual(44);
  expect((out.tall as any).rows.N1.head.box.h).toBeGreaterThanOrEqual(44);
});

// ── B · G9 the crossing ────────────────────────────────────────────────────────────────────
test("B the crossing re-draws nothing, and a middle bye slides no d", async ({
  browser,
}, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  const room = `b-${info.project.name}`;
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  const ids = Array.from({ length: 5 }, (_, i) => `bpeer-${i}`);
  await page.evaluate(
    ({ room, ids }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      for (const id of ids) w.__ch.postMessage({ kind: "hi", data: {}, from: id });
    },
    { room, ids },
  );
  await page.waitForTimeout(900);
  const six = (await page.evaluate(headState)) as any;

  // 6 → 5: the number gives way to five strokes. Nothing may tween.
  await bye(page, room, ids[4]);
  const samples: unknown[] = [];
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(80);
    samples.push(await page.evaluate(() => {
      const pose = document.querySelector("[data-player-mark] .pt-pose");
      return pose
        ? [...pose.querySelectorAll("path")].map((p) => p.getAttribute("stroke-dashoffset"))
        : [];
    }));
  }
  const five = (await page.evaluate(headState)) as any;

  // a MIDDLE bye: 5 → 4, and the survivors keep their own geometry byte for byte.
  await bye(page, room, ids[1]);
  await page.waitForTimeout(700);
  const four = (await page.evaluate(headState)) as any;

  const survived = five.ds.filter((d: string) => four.ds.includes(d)).length;
  bank("b-crossing", info.project.name, {
    six: { strokes: six.strokes, count: six.countText },
    five: { strokes: five.strokes, ds: five.ds.map((d: string) => d.length) },
    samples,
    four: { strokes: four.strokes, ds: four.ds.map((d: string) => d.length) },
    survivedIdentical: survived,
    transformsFive: five.transforms,
    transformsFour: four.transforms,
  });
  expect(six.strokes).toBe(0);
  expect(six.countText).toBe("6");
  expect(five.strokes).toBe(5);
  // G9a — no surviving stroke's dashoffset ever left 0 on the downward crossing.
  for (const s of samples) expect((s as string[]).every((v) => v === "0")).toBe(true);
  expect(four.strokes).toBe(4);
  // G9b — four of the five `d`s are the same bytes they were; only the departed one is gone.
  expect(survived).toBe(4);
  await ctx.close();
});

// ── C · G11 keys ───────────────────────────────────────────────────────────────────────────
test("C the keys contract off el.focus()", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  const room = `c-${info.project.name}`;
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  await peers(page, room, 2);

  const expanded = () =>
    page.evaluate(
      () =>
        document.querySelector("[data-player-mark]")?.getAttribute("aria-expanded") ?? null,
    );
  const focusMark = () =>
    page.evaluate(() =>
      (document.querySelector("[data-player-mark]") as HTMLElement).focus(),
    );

  await focusMark();
  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
  const afterSpace = await expanded();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const afterEsc = await expanded();

  await focusMark();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  const afterEnter = await expanded();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const afterEsc2 = await expanded();

  // THE WEBKIT ROW: a MOUSE-opened sheet, shut with Escape. `@pointerdown.prevent` means the
  // mark never takes focus on a press, so a wrapper-bound Escape never hears the key — that is
  // the defect pass 1 shipped, and the window binding is what cures it.
  await mark(page).click();
  await page.waitForTimeout(400);
  const afterMouse = await expanded();
  const activeOnOpen = await page.evaluate(
    () => document.activeElement?.tagName + "." + (document.activeElement?.className || ""),
  );
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const afterMouseEsc = await expanded();

  bank("c-keys", info.project.name, {
    afterSpace,
    afterEsc,
    afterEnter,
    afterEsc2,
    afterMouse,
    activeOnOpen,
    afterMouseEsc,
  });
  expect(afterSpace).toBe("true");
  expect(afterEsc).toBe("false");
  expect(afterEnter).toBe("true");
  expect(afterEsc2).toBe("false");
  expect(afterMouse).toBe("true");
  expect(afterMouseEsc).toBe("false");
  await ctx.close();
});

// ── C2 · the Tab route (chromium only, and the skip says why) ──────────────────────────────
test("C2 Tab reaches the mark after @mbabb", async ({ browser }, info) => {
  test.skip(
    info.project.name === "webkit",
    "PW-WebKit on darwin honours the system 'Tab moves to text boxes and lists only' " +
      "preference, so Tab does not visit a <button>; the route is asserted in chromium and " +
      "the mark's own focus contract is asserted off el.focus() in row C for both engines.",
  );
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  const room = `c2-${info.project.name}`;
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  await peers(page, room, 2);
  await page.evaluate(() =>
    (document.querySelector(".attribution-trigger") as HTMLElement).focus(),
  );
  await page.keyboard.press("Tab");
  const landed = await page.evaluate(
    () => document.activeElement?.getAttribute("data-player-mark") !== null,
  );
  bank("c2-tab", info.project.name, { landed });
  expect(landed).toBe(true);
  await ctx.close();
});

// ── D · G8 three bounds ────────────────────────────────────────────────────────────────────
test("D the three bounds, and every lapped tap dismisses", async ({ browser }, info) => {
  const out: Record<string, unknown> = {};
  for (const [vp, box] of [
    ["desk", DESK],
    ["tall", TALL],
    ["short", SHORT],
  ] as const) {
    const coarse = vp !== "desk";
    const ctx = await browser.newContext({
      viewport: box,
      hasTouch: coarse,
      isMobile: coarse,
    });
    const page = await ctx.newPage();
    const room = `d-${vp}-${info.project.name}`;
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    await peers(page, room, 15);
    await open(page);
    const geom = await page.evaluate(() => {
      const r = (el: Element | null) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          x: +b.x.toFixed(2),
          y: +b.y.toFixed(2),
          w: +b.width.toFixed(2),
          h: +b.height.toFixed(2),
          bottom: +b.bottom.toFixed(2),
          right: +b.right.toFixed(2),
        };
      };
      const l = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => e.getBoundingClientRect().width > 0,
      ) as HTMLElement | undefined;
      const lb = l?.getBoundingClientRect();
      const cells = [...document.querySelectorAll(".sudoku-cell")];
      const lapped = lb
        ? cells
            .map((c, i) => ({ c, i, b: c.getBoundingClientRect() }))
            .filter(
              (x) =>
                x.b.left < lb.right &&
                x.b.right > lb.left &&
                x.b.top < lb.bottom &&
                x.b.bottom > lb.top,
            )
        : [];
      // what a tap on a lapped cell would actually hit, with the sheet up
      const hits = lapped.slice(0, 6).map((x) => {
        const el = document.elementFromPoint(
          x.b.left + x.b.width / 2,
          x.b.top + x.b.height / 2,
        );
        return el ? el.tagName + "." + (el.className?.toString().split(" ")[0] ?? "") : null;
      });
      return {
        sheet: r(l ?? null),
        sun: r(document.querySelector(".corner-right") ?? null),
        wordmark: r(document.querySelector("svg.handwritten-logo")),
        grid: r(document.querySelector(".board-grid") ?? document.querySelector("svg.hand-drawn-grid")),
        cells: cells.length,
        lapped: lapped.length,
        lappedIdx: lapped.map((x) => x.i).slice(0, 8),
        hits,
        centres: lapped
          .slice(0, 3)
          .map((x) => [+(x.b.left + x.b.width / 2).toFixed(1), +(x.b.top + x.b.height / 2).toFixed(1)]),
      };
    });
    // a lapped tap DISMISSES, and reaches no control
    let dismissed: boolean | null = null;
    if ((geom as any).lapped > 0) {
      const [cx, cy] = (geom as any).centres[0];
      await page.mouse.click(cx, cy);
      await page.waitForTimeout(400);
      dismissed = await page.evaluate(
        () =>
          [...document.querySelectorAll("[data-lobby]")].every(
            (e) => getComputedStyle(e).visibility === "hidden",
          ),
      );
    }
    out[vp] = { ...(geom as object), dismissed };
    await ctx.close();
  }
  bank("d-bounds", info.project.name, out);
  for (const vp of ["desk", "tall", "short"] as const) {
    const g = out[vp] as any;
    expect(g.sheet.right, `${vp} sheet clears the sun`).toBeLessThan(g.sun.x);
    if (g.lapped > 0) {
      expect(g.dismissed, `${vp} lapped tap dismisses`).toBe(true);
      expect(
        g.hits.every((h: string | null) => h && !/BUTTON|INPUT|A\./.test(h)),
        `${vp} lapped tap reaches no control`,
      ).toBe(true);
    }
  }
  // the tall phone clears the grid; the short one laps by the law
  expect((out.tall as any).sheet.bottom).toBeLessThan((out.tall as any).grid.y);
});

// ── E · G12 the deck has no mark ───────────────────────────────────────────────────────────
test("E no mark before a board exists", async ({ browser }, info) => {
  const out: Record<string, unknown> = {};
  for (const [vp, box] of [
    ["desk", DESK],
    ["tall", TALL],
  ] as const) {
    const ctx = await browser.newContext({
      viewport: box,
      hasTouch: vp !== "desk",
      isMobile: vp !== "desk",
    });
    const page = await ctx.newPage();
    await page.goto("./?view=gallery");
    await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await page.waitForTimeout(1200);
    out[vp] = await page.evaluate(() => ({
      marks: document.querySelectorAll("[data-player-mark]").length,
      lobbies: document.querySelectorAll("[data-lobby]").length,
      regions: [...document.querySelectorAll("[aria-live]")].map(
        (e) => e.className?.toString().split(" ")[0] ?? e.tagName,
      ),
    }));
    await ctx.close();
  }
  bank("e-pregame", info.project.name, out);
  expect((out.desk as any).marks).toBe(0);
  expect((out.tall as any).marks).toBe(0);
});

// ── F · G6 the six-node roll ───────────────────────────────────────────────────────────────
test("F the live regions, in order", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  await page.goto("./?size=3&difficulty=EASY&wire=local&s=f-regions");
  await settled(page);
  const playing = await page.evaluate(() =>
    [...document.querySelectorAll("[aria-live]")].map(
      (e) => e.className?.toString().split(" ")[0] || e.tagName.toLowerCase(),
    ),
  );
  await page.goto("./?view=gallery");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page.waitForTimeout(800);
  const deck = await page.evaluate(() =>
    [...document.querySelectorAll("[aria-live]")].map(
      (e) => e.className?.toString().split(" ")[0] || e.tagName.toLowerCase(),
    ),
  );
  bank("f-regions", info.project.name, { playing, deck });
  expect(playing.length).toBe(6);
  await ctx.close();
});

// ── G · G5 the filter census with the tally boiling and the sheet open ─────────────────────
test("G the filter census, both regimes", async ({ browser }, info) => {
  const out: Record<string, unknown> = {};
  const count = () => ({
    defs: document.querySelectorAll("filter").length,
    live: [...document.querySelectorAll("*")].filter((e) => {
      const cs = getComputedStyle(e);
      return cs.filter && cs.filter !== "none" && cs.display !== "none";
    }).length,
  });
  for (const [vp, box] of [
    ["desk", DESK],
    ["tall", TALL],
  ] as const) {
    const ctx = await browser.newContext({
      viewport: box,
      hasTouch: vp !== "desk",
      isMobile: vp !== "desk",
    });
    const page = await ctx.newPage();
    const room = `g-${vp}-${info.project.name}`;
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    await peers(page, room, 3);
    await page.waitForTimeout(1200); // let the tally boil through a beat or two
    const closed = await page.evaluate(count);
    await open(page);
    const opened = await page.evaluate(count);
    out[vp] = { closed, opened };
    await ctx.close();
  }
  bank("g-filters", info.project.name, out);
  for (const vp of ["desk", "tall"] as const) {
    expect((out[vp] as any).closed.live).toBe(9);
    expect((out[vp] as any).opened.live).toBe(9);
  }
});

// ── H · the graft: one anchor, one popover ─────────────────────────────────────────────────
test("H the card does not open under the register", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  const room = `h-${info.project.name}`;
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  await peers(page, room, 2);

  const read = () =>
    page.evaluate(() => {
      const r = (el: Element | null) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          x: +b.x.toFixed(2),
          y: +b.y.toFixed(2),
          w: +b.width.toFixed(2),
          h: +b.height.toFixed(2),
          opacity: cs.opacity,
          visibility: cs.visibility,
        };
      };
      const l = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => e.getBoundingClientRect().width > 0,
      );
      const lb = l?.getBoundingClientRect();
      const atRow = lb
        ? document.elementFromPoint(lb.x + 40, lb.y + 55)
        : null;
      return {
        card: r(document.querySelector(".corner-left .hover-card")),
        trigger: document
          .querySelector(".corner-left .attribution-trigger")
          ?.getAttribute("aria-expanded"),
        lobby: r(l ?? null),
        atRow: atRow ? atRow.tagName + "." + (atRow.className?.toString().split(" ")[0] ?? "") : null,
      };
    });

  const before = await read();
  await mark(page).hover();
  await page.waitForTimeout(500);
  const onHover = await read();
  await open(page);
  const onPress = await read();
  bank("h-graft", info.project.name, { before, onHover, onPress });

  expect(onHover.card!.opacity).toBe("0");
  expect(onHover.trigger).toBe("false");
  expect(onPress.card!.opacity).toBe("0");
  expect(onPress.lobby!.opacity).toBe("1");
  expect(onPress.atRow).not.toContain("IMG");
  await ctx.close();
});

// ── I · G10 the seam: a mouse press sends no `cur` and the cell keeps focus ────────────────
test("I the seam, on a real pair", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const a = await ctx.newPage();
  await a.goto("./?size=3&difficulty=EASY&wire=local");
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const b = await ctx.newPage();
  await b.goto(a.url());
  await settled(b);
  await a.bringToFront();
  await a.waitForTimeout(900);

  // A puts its caret in a cell: B grows a ghost.
  const cell = a.locator(".sudoku-cell input").first();
  await cell.click();
  await a.waitForTimeout(700);
  const ghostBefore = await b.evaluate(
    () => document.querySelectorAll(".is-peer-cursor, [data-peer-cursor]").length,
  );
  const focusBefore = await a.evaluate(() => document.activeElement?.tagName ?? null);

  await mark(a).click();
  await a.waitForTimeout(800);
  const focusAfter = await a.evaluate(() => document.activeElement?.tagName ?? null);
  const expandedAfter = await a.evaluate(
    () => document.querySelector("[data-player-mark]")?.getAttribute("aria-expanded"),
  );
  await b.waitForTimeout(600);
  const ghostAfter = await b.evaluate(
    () => document.querySelectorAll(".is-peer-cursor, [data-peer-cursor]").length,
  );
  bank("i-seam", info.project.name, {
    ghostBefore,
    ghostAfter,
    focusBefore,
    focusAfter,
    expandedAfter,
  });
  expect(focusBefore).toBe("INPUT");
  expect(focusAfter).toBe("INPUT"); // the press never took the caret
  expect(expandedAfter).toBe("true");
  expect(ghostAfter).toBe(ghostBefore); // and no `cur` went out: the ghost never moved
  await ctx.close();
});

// ── J · G4 re-aimed: self's cells bind nothing, a peer's bind ─────────────────────────────
test("J the binding, both halves", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const a = await ctx.newPage();
  await a.goto("./?size=3&difficulty=EASY&wire=local");
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const b = await ctx.newPage();
  await b.goto(a.url());
  await settled(b);
  await a.bringToFront();
  await a.waitForTimeout(900);

  const bindings = (p: Page) =>
    p.evaluate(() => {
      const cells = [...document.querySelectorAll(".sudoku-cell")];
      return {
        cells: cells.length,
        bound: cells.filter((c) =>
          (c.getAttribute("style") ?? "").includes("--color-user-ink"),
        ).length,
      };
    });
  const write = async (p: Page, digit: string, skip: number) => {
    const idx = await p.evaluate(
      () =>
        [...document.querySelectorAll(".sudoku-cell input")].findIndex(
          (i) => !(i as HTMLInputElement).value,
        ),
    );
    if (idx < 0) return false;
    const cell = p.locator(".sudoku-cell input").nth(idx + skip);
    await cell.click();
    await cell.fill(digit);
    await p.waitForTimeout(700);
    return true;
  };

  const empty = await bindings(a);
  await write(a, "5", 0);
  await a.waitForTimeout(500);
  const afterSelf = await bindings(a);
  await b.bringToFront();
  await write(b, "6", 9);
  await b.waitForTimeout(500);
  await a.bringToFront();
  await a.waitForTimeout(1200);
  const afterPeer = await bindings(a);

  bank("j-binding", info.project.name, { empty, afterSelf, afterPeer });
  expect(empty.bound).toBe(0);
  expect(afterSelf.bound).toBe(0);
  expect(afterPeer.bound).toBeGreaterThanOrEqual(1);
  await ctx.close();
});

// ── K · G15 M19: a third join moves no focus and opens no sheet ────────────────────────────
test("K the label mutates and nothing else does", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  const room = `k-${info.project.name}`;
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  await peers(page, room, 1);
  const cell = page.locator(".sudoku-cell input").first();
  await cell.click();
  await page.waitForTimeout(400);
  const before = await page.evaluate(() => ({
    label: document.querySelector("[data-player-mark]")?.getAttribute("aria-label"),
    active: document.activeElement?.tagName,
    open: [...document.querySelectorAll("[data-lobby]")].filter(
      (e) => getComputedStyle(e).visibility === "visible",
    ).length,
  }));
  await peers(page, room, 1);
  await page.waitForTimeout(600);
  const after = await page.evaluate(() => ({
    label: document.querySelector("[data-player-mark]")?.getAttribute("aria-label"),
    active: document.activeElement?.tagName,
    open: [...document.querySelectorAll("[data-lobby]")].filter(
      (e) => getComputedStyle(e).visibility === "visible",
    ).length,
  }));
  bank("k-m19", info.project.name, { before, after });
  expect(before.label).toBe("2 players");
  expect(after.label).toBe("3 players");
  expect(after.active).toBe(before.active);
  expect(after.open).toBe(0);
  await ctx.close();
});
