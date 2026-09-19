/**
 * PLR-SELF pass-3 CRITIC's own rows. Nothing here trusts the prototype's numbers: every
 * reading is taken against the critic's own server (4238 = the prototype worktree) and, for
 * the pi rows, against the HEAD control (4239 = the main tree, src frozen at 74a2b5d9).
 *
 * C1  G4c REPRODUCED, and the question the lane did not ask: when the lapped tap dismisses,
 *     does it ALSO reach the cell?
 * C2  PI on the surfaces this wave does not claim: the controls card, the board, the dock tab,
 *     solo and in a room, against the HEAD control.
 * C3  AA recomputed from COMPUTED colours (the composite, not a glyph-core sample).
 * C4  --head-rule: can the born-RED see an absent PUBLISHER, or only an absent registration?
 * C5  the filter census with the sheet open.
 */
import { expect, test, type Page } from "@playwright/test";
import {
  DESK,
  PHONE_SHORT,
  PHONE_TALL,
  SOLO,
  addPeers,
  coarseCtx,
  invite,
  lobby,
  mark,
  openSheet,
  say,
  settled,
  settleFilters,
} from "./harness";

const HEAD = "http://127.0.0.1:4239";

async function boxes(page: Page) {
  return page.evaluate(() => {
    const b = (s: string) => {
      const e = document.querySelector(s);
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return {
        x: +r.x.toFixed(1),
        y: +r.y.toFixed(1),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
      };
    };
    return {
      card: b(".controls-card"),
      grid: b(".sudoku-board, .game-grid, .board-grid"),
      wrapper: b(".board-wrapper"),
      well: b(".players-well"),
      tab: b(".drawer-tab"),
      cornerLeft: b(".corner-left"),
      cell0: b(".sudoku-cell"),
    };
  });
}

// ── C1 ─────────────────────────────────────────────────────────────────────────────────────
test("C1 — the short phone's lap, reproduced, and what the lapped tap actually reaches", async ({
  browser,
}, info) => {
  const ctx = await coarseCtx(browser, PHONE_SHORT, info.project.name === "chromium");
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  await invite(a);
  await addPeers(a, 4);
  await a.waitForTimeout(600);
  await openSheet(a);

  const geom = await a.evaluate(() => {
    const l = [...document.querySelectorAll("[data-lobby]")].find(
      (e) => getComputedStyle(e).visibility === "visible",
    )!;
    const s = l.getBoundingClientRect();
    const cs = getComputedStyle(l);
    const cells = [...document.querySelectorAll(".sudoku-cell")]
      .map((c, i) => {
        const b = c.getBoundingClientRect();
        const ix = [Math.max(b.left, s.left), Math.min(b.right, s.right)];
        const iy = [Math.max(b.top, s.top), Math.min(b.bottom, s.bottom)];
        return {
          i,
          lx: +((ix[0] + ix[1]) / 2).toFixed(1),
          ly: +((iy[0] + iy[1]) / 2).toFixed(1),
          lapW: +(ix[1] - ix[0]).toFixed(1),
          lapH: +(iy[1] - iy[0]).toFixed(1),
          laps: ix[1] > ix[0] && iy[1] > iy[0],
        };
      })
      .filter((c) => c.laps);
    return {
      sheet: {
        x: +s.x.toFixed(1),
        y: +s.y.toFixed(1),
        w: +s.width.toFixed(1),
        h: +s.height.toFixed(1),
        bottom: +s.bottom.toFixed(1),
      },
      zIndex: cs.zIndex,
      radius: cs.borderRadius,
      cells,
    };
  });

  const probeAt = (x: number, y: number) =>
    a.evaluate(
      ({ x, y }) => {
        const el = document.elementFromPoint(x, y);
        const stack = document
          .elementsFromPoint(x, y)
          .slice(0, 4)
          .map((e) => `${e.tagName.toLowerCase()}.${(e.className || "").toString().split(" ")[0]}`);
        return {
          top: el
            ? `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}`
            : "",
          stack,
        };
      },
      { x, y },
    );

  const rows: unknown[] = [];
  for (const c of geom.cells) {
    if (!(await lobby(a).isVisible().catch(() => false))) await openSheet(a);
    const before = await a.evaluate(
      () => document.querySelectorAll(".sudoku-cell.is-selected, .game-cell.is-selected").length,
    );
    const hit = await probeAt(c.lx, c.ly);
    await a.mouse.click(c.lx, c.ly);
    await a.waitForTimeout(280);
    const after = await a.evaluate(() => ({
      shut: ![...document.querySelectorAll("[data-lobby]")].some(
        (e) => getComputedStyle(e).visibility === "visible",
      ),
      selected: document.querySelectorAll(".sudoku-cell.is-selected, .game-cell.is-selected")
        .length,
      activeInCell: !!document.activeElement?.closest(".sudoku-cell, .game-cell"),
      activeCls: (document.activeElement?.className || "").toString().split(" ")[0],
    }));
    rows.push({ i: c.i, lx: c.lx, ly: c.ly, lapW: c.lapW, lapH: c.lapH, hit, before, ...after });
  }
  say({ c: "C1", sheet: geom.sheet, zIndex: geom.zIndex, radius: geom.radius, rows });
  expect(geom.cells.length).toBeGreaterThan(0);
});

// ── C2 ─────────────────────────────────────────────────────────────────────────────────────
for (const [label, vp] of [
  ["desk", DESK],
  ["phone-tall", PHONE_TALL],
] as const) {
  test(`C2 — pi on the unclaimed estate, ${label}: prototype vs HEAD (74a2b5d9)`, async ({
    browser,
  }, info) => {
    const coarse = label !== "desk";
    const ctx = coarse
      ? await coarseCtx(browser, vp, info.project.name === "chromium")
      : await browser.newContext({ viewport: vp });
    const a = await ctx.newPage();
    await a.goto(SOLO);
    await settled(a);
    await a.waitForTimeout(800);
    const proto = await boxes(a);

    const b = await ctx.newPage();
    await b.goto(`${HEAD}/${SOLO.replace("./", "")}`);
    await settled(b);
    await b.waitForTimeout(800);
    const head = await boxes(b);

    const delta: Record<string, unknown> = {};
    for (const k of Object.keys(proto) as (keyof typeof proto)[]) {
      const p = proto[k];
      const h = head[k];
      if (!p || !h) {
        delta[k] = { proto: p, head: h };
        continue;
      }
      const d = { dx: +(p.x - h.x).toFixed(1), dy: +(p.y - h.y).toFixed(1), dw: +(p.w - h.w).toFixed(1), dh: +(p.h - h.h).toFixed(1) };
      if (d.dx || d.dy || d.dw || d.dh) delta[k] = { proto: p, head: h, ...d };
    }
    say({ c: "C2", label, solo: true, proto, head, delta });

    // …and again with three at the table on BOTH trees (the roster's own surface).
    await invite(a);
    await addPeers(a, 2);
    await a.waitForTimeout(700);
    await invite(b);
    await addPeers(b, 2);
    await b.waitForTimeout(700);
    const protoRoom = await boxes(a);
    const headRoom = await boxes(b);
    say({ c: "C2-room", label, proto: protoRoom, head: headRoom });
    await ctx.close();
  });
}

// ── C3 ─────────────────────────────────────────────────────────────────────────────────────
test("C3 — AA on the sheet, recomputed from computed colours", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  await invite(a);
  await addPeers(a, 3);
  await a.waitForTimeout(700);
  for (const theme of ["light", "dark"]) {
    await a.emulateMedia({ colorScheme: theme as "light" | "dark" });
    await a.waitForTimeout(400);
    if (!(await lobby(a).isVisible().catch(() => false))) await openSheet(a);
    const read = await a.evaluate(() => {
      const parse = (s: string): [number, number, number, number] => {
        const d = document.createElement("canvas");
        d.width = d.height = 1;
        const cx = d.getContext("2d")!;
        cx.clearRect(0, 0, 1, 1);
        cx.fillStyle = s;
        cx.fillRect(0, 0, 1, 1);
        const p = cx.getImageData(0, 0, 1, 1).data;
        return [p[0], p[1], p[2], p[3] / 255];
      };
      const over = (
        fg: [number, number, number, number],
        bg: [number, number, number, number],
      ): [number, number, number] => [
        fg[0] * fg[3] + bg[0] * (1 - fg[3]),
        fg[1] * fg[3] + bg[1] * (1 - fg[3]),
        fg[2] * fg[3] + bg[2] * (1 - fg[3]),
      ];
      const lum = (c: [number, number, number]) => {
        const f = (v: number) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
      };
      const ratio = (a: [number, number, number], b: [number, number, number]) => {
        const [x, y] = [lum(a) + 0.05, lum(b) + 0.05];
        return +(Math.max(x, y) / Math.min(x, y)).toFixed(2);
      };
      const l = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => getComputedStyle(e).visibility === "visible",
      )!;
      const ground = parse(getComputedStyle(l).backgroundColor);
      const groundRGB: [number, number, number] = [ground[0], ground[1], ground[2]];
      const rows = [...l.querySelectorAll(".pl-state, .pl-name, .pl-qualifier, .pl-more")].map(
        (e) => {
          const cs = getComputedStyle(e);
          const fg = parse(cs.color);
          return {
            cls: e.className,
            text: (e.textContent || "").trim(),
            color: cs.color,
            alpha: fg[3],
            ratio: ratio(over(fg, [...groundRGB, 1] as [number, number, number, number]), groundRGB),
          };
        },
      );
      return {
        groundCss: getComputedStyle(l).backgroundColor,
        ground: groundRGB,
        groundAlpha: ground[3],
        rows,
      };
    });
    say({ c: "C3", theme, ...read });
  }
  await ctx.close();
});

// ── C4 ─────────────────────────────────────────────────────────────────────────────────────
test("C4 — --head-rule: what the born-RED can and cannot see", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const before = await a.evaluate(() => {
    const root = document.documentElement;
    const pr = document.querySelector(".page-root")!;
    const corner = document.querySelector(".corner-left")!;
    return {
      atRoot: getComputedStyle(root).getPropertyValue("--head-rule").trim(),
      atPageRoot: getComputedStyle(pr).getPropertyValue("--head-rule").trim(),
      atCorner: getComputedStyle(corner).getPropertyValue("--head-rule").trim(),
      cornerTop: getComputedStyle(corner).top,
      registered: [...document.styleSheets].some((s) => {
        try {
          return [...s.cssRules].some(
            (r) => (r as CSSRule & { name?: string }).name === "--head-rule",
          );
        } catch {
          return false;
        }
      }),
    };
  });
  // THE PUBLISHER, GONE — not the registration. `--head-rule: initial` on `.page-root` is
  // exactly "the publisher never shipped": a registered property falls to its initial-value,
  // an unregistered one to the guaranteed-invalid value and thence to any fallback.
  const after = await a.evaluate(() => {
    const st = document.createElement("style");
    st.textContent = ".page-root { --head-rule: initial !important; }";
    document.head.appendChild(st);
    const pr = document.querySelector(".page-root")!;
    const corner = document.querySelector(".corner-left")!;
    const right = document.querySelector(".corner-right")!;
    return {
      atPageRoot: getComputedStyle(pr).getPropertyValue("--head-rule").trim(),
      cornerTop: getComputedStyle(corner).top,
      rightTop: getComputedStyle(right).top,
      cornerY: +document.querySelector(".corner-left")!.getBoundingClientRect().y.toFixed(1),
    };
  });
  say({ c: "C4", before, after });
  await ctx.close();
});

// ── C5 ─────────────────────────────────────────────────────────────────────────────────────
test("C5 — the filter census with the sheet open", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const shut = await settleFilters(a);
  await invite(a);
  await addPeers(a, 2);
  await a.waitForTimeout(600);
  await openSheet(a);
  const open = await settleFilters(a);
  // the incumbent card too — the head's other sheet, hovered (a click toggles it shut)
  await a.keyboard.press("Escape");
  await a.locator(".attribution-trigger").first().hover();
  await a.waitForTimeout(400);
  const card = await settleFilters(a);
  const markBox = await mark(a).boundingBox();
  say({ c: "C5", shut, open, card, markBox });
  await ctx.close();
});
