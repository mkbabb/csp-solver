/**
 * PLR-COUNT pass-2 CRITIC probe. Four questions the prototype's own battery does not ask:
 *
 *  C1  the roster's INK reads — `join-language.spec.ts:97` and `:165` read `.player-row`'s
 *      computed `color` as the peer's ink, and the rule that carried it was deleted.
 *  C2  the width table and the accessible name, re-measured independently (G3 / G7).
 *  C3  pi — `.attribution-trigger` / `.corner-left` rect census, prototype :4243 against the
 *      MAIN tree at HEAD :4244, deck and playing, desk and phone.
 *  C4  the register's names: does a slug clip inside the 16rem sheet, and does the quiet
 *      qualifier (`N seconds ago`) ever render?
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(__dirname, "..", "readings");
fs.mkdirSync(OUT, { recursive: true });
const bank = (name: string, engine: string, data: unknown) =>
  fs.writeFileSync(path.join(OUT, `${name}-${engine}.json`), JSON.stringify(data, null, 1));

const DESK = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

async function peers(page: Page, room: string, k: number, tag: string) {
  if (k <= 0) return;
  await page.evaluate(
    ({ room, k, tag }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < k; i++)
        w.__ch.postMessage({ kind: "hi", data: {}, from: `${tag}-${i}` });
    },
    { room, k, tag },
  );
  await page.waitForTimeout(800);
}

// ── C1 · the roster's ink reads, as join-language.spec.ts makes them ───────────────────────
test("C1 the well's rows still carry the peer's ink to their text", async ({
  browser,
}, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  const room = `c1-${info.project.name}`;
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  await peers(page, room, 2, "c1p");

  const read = await page.evaluate(() => {
    const rows = [...document.querySelectorAll(".controls-card .player-row")];
    const self = rows.find((r) => r.querySelector(".player-self"));
    const peer = rows.find((r) => !r.querySelector(".player-self"));
    const g = (el: Element | null | undefined, prop: string) =>
      el ? getComputedStyle(el).getPropertyValue(prop) : null;
    const trace = document.querySelector(".join-trace");
    return {
      rows: rows.length,
      selfRowColor: g(self, "color"),
      peerRowColor: g(peer, "color"),
      peerRowInkVar: g(peer, "--color-user-ink").trim(),
      peerSwatchBg: g(peer?.querySelector(".player-swatch"), "background-color"),
      peerNameColor: g(peer?.querySelector(".player-name"), "color"),
      traceStroke: trace ? getComputedStyle(trace).stroke : null,
      rosterSrOnly: document
        .querySelector(".players-roster")
        ?.classList.contains("sr-only"),
    };
  });
  bank("c1-roster-ink", info.project.name, read);
  await ctx.close();

  // join-language.spec.ts:163-171 — "the peer's row and their swatch are one colour, and it is
  // not your own". Both halves, as that spec asserts them.
  expect(read.rows, "two rows in the well").toBe(3);
  expect(read.peerRowColor, "peer row colour != self row colour").not.toBe(
    read.selfRowColor,
  );
  expect(read.peerSwatchBg, "swatch == the row's colour").toBe(read.peerRowColor);
});

// ── C2 · the width table and the name, independently ──────────────────────────────────────
test("C2 width table and accessible name", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  const room = `c2-${info.project.name}`;
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);

  const rows: Record<string, unknown> = {};
  let at = 1;
  for (const N of [1, 3, 5, 6]) {
    await peers(page, room, N - at, `c2p${N}`);
    at = N;
    rows[`N${N}`] = await page.evaluate(() => {
      const marks = [...document.querySelectorAll("[data-player-mark]")].filter(
        (m) => m.getBoundingClientRect().width > 0,
      );
      const m = marks[0] as HTMLElement | undefined;
      const b = m?.getBoundingClientRect();
      const pose = m?.querySelector(".pt-pose");
      return {
        w: b ? +b.width.toFixed(2) : null,
        h: b ? +b.height.toFixed(2) : null,
        label: m?.getAttribute("aria-label") ?? null,
        strokes: pose ? pose.querySelectorAll("path").length : 0,
        count: m?.querySelector(".pt-count")?.textContent ?? null,
      };
    });
  }
  const filters = await page.evaluate(() => ({
    defs: document.querySelectorAll("filter").length,
    live: [...document.querySelectorAll("*")].filter((e) => {
      const cs = getComputedStyle(e);
      return cs.filter && cs.filter !== "none" && cs.display !== "none";
    }).length,
  }));
  bank("c2-width", info.project.name, { rows, filters });
  await ctx.close();

  for (const [N, want] of [
    [1, 44],
    [3, 51.66],
    [5, 72.92],
    [6, 44],
  ] as const) {
    expect(Math.abs((rows[`N${N}`] as any).w - want), `width at N=${N}`).toBeLessThan(0.51);
  }
  expect(filters.live, "filterBudget 9").toBe(9);
});

// ── C3 · pi: the head's rects against the MAIN tree at HEAD ───────────────────────────────
test("C3 the head's rect census against HEAD", async ({ browser }, info) => {
  const census = async (base: string, view: "playing" | "gallery", box: typeof DESK) => {
    const ctx = await browser.newContext({
      viewport: box,
      hasTouch: box.width < 500,
      isMobile: box.width < 500,
    });
    const page = await ctx.newPage();
    const url =
      view === "playing"
        ? `${base}/?size=3&difficulty=EASY`
        : `${base}/?size=3&difficulty=EASY&view=gallery`;
    await page.goto(url);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await page.waitForTimeout(1200);
    const out = await page.evaluate(() => {
      const r = (sel: string) => {
        const els = [...document.querySelectorAll(sel)].filter(
          (e) => e.getBoundingClientRect().width > 0,
        );
        const e = els[0];
        if (!e) return null;
        const b = e.getBoundingClientRect();
        return {
          x: +b.x.toFixed(2),
          y: +b.y.toFixed(2),
          w: +b.width.toFixed(2),
          h: +b.height.toFixed(2),
        };
      };
      return {
        trigger: r(".attribution-trigger"),
        corner: r(".corner-left, .mobile-attribution"),
        logo: r("svg.handwritten-logo"),
        board: r(".sudoku-grid, .game-board, .board-frame"),
        card: r(".controls-card"),
      };
    });
    await ctx.close();
    return out;
  };

  const out: Record<string, unknown> = {};
  for (const [tag, box] of [
    ["desk", DESK],
    ["phone", PHONE],
  ] as const)
    for (const view of ["playing", "gallery"] as const) {
      const proto = await census("http://127.0.0.1:4243", view, box);
      const head = await census("http://127.0.0.1:4244", view, box);
      out[`${tag}-${view}`] = { proto, head };
    }
  bank("c3-pi-rects", info.project.name, out);

  // The deck carries no mark at all, so NOTHING on it may move.
  for (const tag of ["desk", "phone"]) {
    const { proto, head } = out[`${tag}-gallery`] as any;
    expect(JSON.stringify(proto.trigger), `${tag} deck trigger`).toBe(
      JSON.stringify(head.trigger),
    );
  }
});

// ── C4 · the register's names and the quiet qualifier ─────────────────────────────────────
test("C4 the sheet's names and the quiet rung", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  const room = `c4-${info.project.name}`;
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  await peers(page, room, 4, "c4p");
  await page.locator("[data-player-mark]:visible").first().click();
  await page.waitForTimeout(800);

  const read = await page.evaluate(() => {
    const l = [...document.querySelectorAll("[data-lobby]")].find(
      (e) => getComputedStyle(e).visibility === "visible",
    ) as HTMLElement | undefined;
    if (!l) return null;
    const names = [...l.querySelectorAll(".pl-name")] as HTMLElement[];
    return {
      sheetW: +l.getBoundingClientRect().width.toFixed(2),
      names: names.map((n) => ({
        text: n.textContent,
        client: n.clientWidth,
        scroll: n.scrollWidth,
        clipped: n.scrollWidth > n.clientWidth,
      })),
      qualifiers: [...l.querySelectorAll(".pl-qualifier")].map((q) => q.textContent),
      overflowStyle: names[0] ? getComputedStyle(names[0]).textOverflow : null,
      groundPaint: getComputedStyle(l).backgroundColor,
      nameColor: names[0] ? getComputedStyle(names[0]).color : null,
      stateColor: (() => {
        const s = l.querySelector(".pl-state");
        return s ? getComputedStyle(s).color : null;
      })(),
    };
  });
  bank("c4-names", info.project.name, read);
  await ctx.close();
  expect(read).not.toBeNull();
});
