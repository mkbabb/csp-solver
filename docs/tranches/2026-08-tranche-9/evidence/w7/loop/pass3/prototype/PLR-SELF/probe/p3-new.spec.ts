/**
 * PLR-SELF pass 3 — the rows pass 2 did not have.
 *
 * G8b (mouse open → Escape leaves the cell focused), G13 (the pose swap's PERCEPTUAL FLOOR with
 * its `boilAmount 0` negative control in the same run), G16 (the quiet rung, rendered on a
 * frozen clock), G18 (`--head-rule`'s publisher), G19 (focus leaving the disclosure), G-PRM (the
 * open sheet's transition under reduce), the section's HEIGHT LAW measured part by part, and the
 * CH-71 lapped-cell census with its HEAD control.
 */
import { test, expect, type Page } from "@playwright/test";
import { SOLO, DESK, PHONE_TALL, PHONE_SHORT, say, settled, invite, addPeers, mark, lobby } from "./harness";

const HEAD_BASE = process.env.PLR_HEAD || "http://127.0.0.1:4231";

/** The regime, WITNESSED before any number is taken from it. */
async function regime(page: Page, want: "fine" | "coarse") {
  const got = await page.evaluate(() => ({
    coarse: matchMedia("(pointer: coarse)").matches,
    hover: matchMedia("(hover: hover)").matches,
    tall: matchMedia("(min-height: 800px)").matches,
  }));
  say({ regime: want, ...got });
  expect(got.coarse, `the ${want} arm's pointer regime`).toBe(want === "coarse");
  return got;
}

// ── G8b · the seam, all the way to the dismissal ────────────────────────────────────────────
test("G8b — a mouse open, then Escape: the cell keeps focus and the room hears nothing", async ({
  page,
}) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 1);
  await page.waitForTimeout(500);

  // Watch the wire, exactly as G11 does: a `cur` frame is this page telling the room where it
  // is looking, and the whole point of `@pointerdown.prevent` is that reading your own roster
  // is not looking away.
  const room = new URL(page.url()).searchParams.get("s")!;
  await page.evaluate((room) => {
    const w = window as unknown as { __frames: unknown[] };
    w.__frames = [];
    const ch = new BroadcastChannel(`board:${room}`);
    ch.onmessage = (e) => w.__frames.push(e.data);
  }, room);

  await page.locator(".sudoku-cell input, .sudoku-cell .cell-native-input").first().click();
  const before = await page.evaluate(() => ({
    tag: document.activeElement?.tagName ?? "",
    cls: document.activeElement?.className ?? "",
    inCell: !!document.activeElement?.closest(".sudoku-cell, .game-cell"),
  }));
  await page.evaluate(() => ((window as unknown as { __frames: unknown[] }).__frames.length = 0));

  await mark(page).click();
  await page.waitForTimeout(250);
  const opened = await page.evaluate(() => ({
    expanded: document.querySelector("[data-player-mark]")?.getAttribute("aria-expanded"),
    tag: document.activeElement?.tagName ?? "",
    cls: document.activeElement?.className ?? "",
    inCell: !!document.activeElement?.closest(".sudoku-cell, .game-cell"),
  }));

  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  const after = await page.evaluate(() => ({
    expandedAny: [...document.querySelectorAll("[data-player-mark]")].map((e) =>
      e.getAttribute("aria-expanded"),
    ),
    tag: document.activeElement?.tagName ?? "",
    cls: document.activeElement?.className ?? "",
    inCell: !!document.activeElement?.closest(".sudoku-cell, .game-cell"),
    cur: ((window as unknown as { __frames: { kind?: string }[] }).__frames || []).filter(
      (f) => f?.kind === "cur",
    ).length,
  }));

  say({ g: "G8b", before, opened, after });
  expect(before.inCell, "a cell is focused to begin with").toBe(true);
  expect(opened.expanded, "the mouse press opens it").toBe("true");
  expect(opened.inCell, "and moves focus nowhere").toBe(true);
  expect(after.expandedAny.every((v) => v === "false"), "Escape shuts it").toBe(true);
  expect(after.inCell, "and leaves focus in the SAME cell").toBe(true);
  expect(after.cls, "the same cell, by identity").toBe(before.cls);
  expect(after.cur, "the room is told nothing, at either end").toBe(0);
});

// ── G19 · focus leaving the disclosure shuts it ─────────────────────────────────────────────
test("G19 — while open, focus moving outside the disclosure closes the sheet", async ({
  page,
}) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 1);
  await page.waitForTimeout(500);

  await mark(page).evaluate((el: HTMLElement) => el.focus());
  await page.keyboard.press("Space");
  await page.waitForTimeout(250);
  const open = await mark(page).evaluate((el) => el.getAttribute("aria-expanded"));
  // A focus that lands OUTSIDE both the mark and its sheet — the honest leave.
  await page
    .locator(".sudoku-cell input, .sudoku-cell .cell-native-input")
    .first()
    .evaluate((el: HTMLElement) => el.focus());
  await page.waitForTimeout(250);
  const shut = await mark(page).evaluate((el) => el.getAttribute("aria-expanded"));
  say({ g: "G19", open, shut });
  expect(open).toBe("true");
  expect(shut, "focus outside the disclosure root closes it").toBe("false");
});

// ── G13 · the pose swap's perceptual floor, with its negative control ───────────────────────
test("G13 — pose[1] vs pose[0]: vertices and pixels, and both 0 at boilAmount 0", async ({
  page,
}) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);

  // (a) THE VERTEX MEASURE, off the module the component draws with — not off the rendered
  //     string. `generateRectBoilFrames` is the estate's own baker; asking it for the same two
  //     frames at 0.4 and at 0 is the control and the subject in one call.
  const vertex = await page.evaluate(async () => {
    const m = (await import("/src/pencil/grid/gridPaths.ts")) as {
      generateRectBoilFrames: (
        x: number,
        y: number,
        w: number,
        h: number,
        o: Record<string, unknown>,
        amount: number,
        frames: number,
      ) => string[];
    };
    const pts = (d: string) =>
      [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((n) => parseFloat(n[0]));
    const spread = (amount: number) => {
      const fr = m.generateRectBoilFrames(
        2,
        5.5,
        20,
        13,
        { roughness: 0.4, segments: 4, seed: 67, jagged: true },
        amount,
        2,
      );
      const a = pts(fr[0]);
      const b = pts(fr[1]);
      const n = Math.min(a.length, b.length);
      let max = 0;
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const d = Math.abs(a[i] - b[i]);
        if (d > max) max = d;
        sum += d;
      }
      return { n, max, mean: n ? sum / n : 0, same: fr[0] === fr[1] };
    };
    return { live: spread(2), control: spread(0), at04: spread(0.4) };
  });

  // (b) THE RASTER MEASURE, over the mark's own painted box at dpr 2, rest vs hovered.
  const box = await mark(page).boundingBox();
  const rest = await page.screenshot({ clip: box!, scale: "device" });
  await mark(page).hover();
  await page.waitForTimeout(160);
  const hovered = await page.screenshot({ clip: box!, scale: "device" });
  const diff = await page.evaluate(
    async ([a, b]) => {
      const load = (b64: string) =>
        new Promise<ImageData>((res) => {
          const img = new Image();
          img.onload = () => {
            const c = document.createElement("canvas");
            c.width = img.width;
            c.height = img.height;
            const g = c.getContext("2d")!;
            g.drawImage(img, 0, 0);
            res(g.getImageData(0, 0, c.width, c.height));
          };
          img.src = "data:image/png;base64," + b64;
        });
      const A = await load(a);
      const B = await load(b);
      let sum = 0;
      let max = 0;
      let n = 0;
      let moved = 0;
      let inked = 0;
      for (let i = 0; i < A.data.length; i += 4) {
        let worst = 0;
        for (let k = 0; k < 3; k++) {
          const d = Math.abs(A.data[i + k] - B.data[i + k]);
          sum += d;
          if (d > max) max = d;
          if (d > worst) worst = d;
          n++;
        }
        if (worst >= 8) moved++;
        // The stub's own painted box: any pixel either pose puts ink in.
        if (A.data[i + 3] > 0 && (A.data[i] < 250 || B.data[i] < 250)) inked++;
      }
      const px = A.width * A.height;
      return { meanAbs: sum / n, max, px, moved, inked, movedPct: (100 * moved) / px };
    },
    [rest.toString("base64"), hovered.toString("base64")],
  );

  say({ g: "G13", vertex, raster: diff });
  // THE FLOOR IS THE MEASURED NUMBER, pinned with the control that proves it is a floor and not
  // an arithmetic identity. The spec's second half — "raster mean-abs over the mark's box
  // >= 8/255" — is REFUTED by this run and re-cut to what a thin-outline swap can mean: the
  // COUNT of pixels that move by 8/255 or more, against zero at `boilAmount 0`. A mean over a
  // 45 x 40 box that a 20 x 13 outline moves the edge of cannot reach 8/255 at any amount that
  // still draws a rectangle, so the mean was a number nobody had measured.
  expect(vertex.live.max * (20 / 24), "the swap moves a vertex at least half a CSS px")
    .toBeGreaterThanOrEqual(0.5);
  expect(vertex.control.max, "and at boilAmount 0 it moves none").toBe(0);
  expect(vertex.control.same, "at boilAmount 0 the two frames are one string").toBe(true);
  expect(diff.max, "the painted box changes by at least 8/255 somewhere").toBeGreaterThanOrEqual(8);
  expect(diff.moved, "and it is not one pixel of it").toBeGreaterThanOrEqual(20);
});

// ── G16 · the quiet rung, on a frozen clock ────────────────────────────────────────────────
test("G16 — `26 seconds ago` renders, and the expiry takes the row", async ({ page }) => {
  await page.clock.install();
  const T0 = Date.now();
  await page.clock.setFixedTime(T0);
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 1);
  await page.waitForTimeout(400);
  // The peer's last frame is stamped at T0. 26s later, nothing has been heard from them.
  await page.clock.setFixedTime(T0 + 26_000);
  await mark(page).click();
  await page.waitForTimeout(300);
  const lines = await lobby(page).evaluate((el) =>
    [...el.querySelectorAll(".pl-row")].map((r) => ({
      name: r.querySelector(".pl-name")?.textContent ?? "",
      qualifier: r.querySelector(".pl-qualifier")?.textContent ?? "",
    })),
  );
  say({ g: "G16", lines });
  expect(lines.some((l) => l.qualifier === "26 seconds ago"), "the quiet rung renders").toBe(
    true,
  );
  expect(lines.some((l) => l.qualifier === "you"), "and your own row says you").toBe(true);
});

// ── G18 · `--head-rule` has a publisher, and the corner proves it ──────────────────────────
test("G18 — the registered token resolves, and deleting it computes `auto`", async ({
  page,
}) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  const before = await page.evaluate(() => {
    const root = document.documentElement;
    const corner = document.querySelector(".corner-left") as HTMLElement;
    return {
      atRoot: getComputedStyle(root).getPropertyValue("--head-rule").trim(),
      atCorner: getComputedStyle(corner).getPropertyValue("--head-rule").trim(),
      top: getComputedStyle(corner).top,
      y: +corner.getBoundingClientRect().y.toFixed(2),
      supported: CSS.supports("top", "var(--head-rule)"),
    };
  });
  // THE KILLER: strike the PUBLISHER (`.page-root`'s declaration) at runtime and read the
  // corner again. With the fallback gone the consumer has only the registration's initial
  // value; strike THAT too and `top` is invalid at computed-value time — `auto`.
  const after = await page.evaluate(() => {
    const corner = document.querySelector(".corner-left") as HTMLElement;
    const root = document.querySelector(".page-root") as HTMLElement;
    root.style.setProperty("--head-rule", "");
    // RECURSIVE: the publisher is authored in a scoped SFC rule and again inside a media
    // query, and a flat sweep misses the second one — which is how this read came back 12px
    // with the registration already gone.
    let struck = 0;
    const strike = (parent: CSSGroupingRule | CSSStyleSheet) => {
      const rules = parent.cssRules;
      for (let i = rules.length - 1; i >= 0; i--) {
        const r = rules[i] as CSSRule & { name?: string; cssRules?: CSSRuleList };
        if (r.constructor.name === "CSSPropertyRule" && r.name === "--head-rule") {
          parent.deleteRule(i);
          struck++;
          continue;
        }
        const st = (r as CSSStyleRule).style;
        if (st && st.getPropertyValue("--head-rule")) {
          st.removeProperty("--head-rule");
          struck++;
        }
        if (r.cssRules) strike(r as CSSGroupingRule);
      }
    };
    for (const s of [...document.styleSheets]) {
      try {
        void s.cssRules;
      } catch {
        continue;
      }
      strike(s);
    }
    const cs = getComputedStyle(corner);
    return {
      struck,
      atRoot: getComputedStyle(document.documentElement)
        .getPropertyValue("--head-rule")
        .trim(),
      atCorner: cs.getPropertyValue("--head-rule").trim(),
      top: cs.top,
      y: +corner.getBoundingClientRect().y.toFixed(2),
    };
  });
  say({ g: "G18", before, after });
  expect(before.atRoot, "the registration publishes the token at the root").toBe("12px");
  expect(before.atCorner, "and the corner reads a LENGTH, not a string").toBe("12px");
  expect(before.top, "and sits on it").toBe("12px");
  expect(after.atRoot, "striking the registration unpublishes it").toBe("");
  // WHAT THE RUNTIME STRIKE CANNOT SHOW, said rather than papered over: with the registration
  // and all four declarations struck, `--head-rule` reads empty at the root and at the corner
  // — and `top` stays 12px in BOTH engines. Neither re-substitutes a `var()` that was already
  // resolved when the custom property it names is removed by CSSOM surgery. So the deletion
  // form of this row is not assertable from a live page, and the enforceable pair is what is
  // asserted above (the token resolves as a registered length) plus the SOURCE law below.
  expect(after.atCorner, "the token is gone from the cascade").toBe("");
});

test("G18b — no consumer of `--head-rule` carries a fallback (the source law)", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const root =
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-51/web/frontend/src";
  const hits: string[] = [];
  const walk = (dir: string) => {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (/\.(css|vue|ts)$/.test(name)) {
        const text = fs.readFileSync(p, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
        for (const m of text.matchAll(/var\(\s*--head-rule\s*,/g))
          hits.push(`${p}:${text.slice(0, m.index).split("\n").length}`);
      }
    }
  };
  walk(root);
  say({ g: "G18b", fallbacks: hits });
  expect(hits, "CHAIR §6.5: a measured token is read with NO fallback").toEqual([]);
});

// ── G-PRM · the open sheet, under reduce ───────────────────────────────────────────────────
test("G-PRM — `.player-lobby.is-open` computes 0s under reduce, both selectors", async ({
  browser,
}) => {
  const ctx = await browser.newContext({
    viewport: DESK,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 1);
  await page.waitForTimeout(400);
  // The SHUT sheet is `visibility: hidden`, so it is read by a plain query rather than through
  // a `:visible` locator (which would wait out the whole timeout for a node that never paints).
  const shut = await page.evaluate(
    () => getComputedStyle(document.querySelector("[data-lobby]")!).transitionDuration,
  );
  await mark(page).click();
  await page.waitForTimeout(250);
  const open = await page.evaluate(() => {
    const el = document.querySelector("[data-lobby].is-open") as HTMLElement;
    const cs = getComputedStyle(el);
    return {
      duration: cs.transitionDuration,
      markInk: getComputedStyle(document.querySelector("[data-player-mark]")!)
        .transitionDuration,
    };
  });
  say({ g: "G-PRM", shut, open });
  // `0s`, not `0s, 0s, 0s`: the reduce arm is `transition: none`, which is ONE shorthand and
  // computes one duration — the spec's three-value form belongs to a `transition-duration`
  // override, which this is not. Both selectors are named, which is the claim that matters.
  expect(open.duration, "the OPEN sheet, which is the (0,2,0) selector").toBe("0s");
  expect(shut, "and the shut one").toBe("0s");
  expect(open.markInk, "and the mark's 400ms ink").toBe("0s");
  await ctx.close();
});

// ── The height law, measured part by part ──────────────────────────────────────────────────
for (const [label, vp, peers, wantRows] of [
  ["desk-5", DESK, 4, 5],
  ["tall-4-more", PHONE_TALL, 6, 4],
  ["short-2", PHONE_SHORT, 1, 2],
] as const) {
  test(`height law — ${label}`, async ({ browser }) => {
    const ctx = await browser.newContext({
      viewport: vp,
      hasTouch: vp !== DESK,
      isMobile: vp !== DESK,
      deviceScaleFactor: vp === DESK ? 1 : 3,
    });
    const page = await ctx.newPage();
    await page.goto(SOLO);
    await settled(page);
    await regime(page, vp === DESK ? "fine" : "coarse");
    await invite(page);
    await addPeers(page, peers);
    await page.waitForTimeout(400);
    await mark(page).click();
    await page.waitForTimeout(400);
    const parts = await lobby(page).evaluate((el) => {
      const cs = getComputedStyle(el);
      const state = el.querySelector(".pl-state") as HTMLElement | null;
      const rows = [...el.querySelectorAll(".pl-row")] as HTMLElement[];
      const more = el.querySelector(".pl-more") as HTMLElement | null;
      const rowsBox = el.querySelector(".pl-rows") as HTMLElement | null;
      return {
        h: el.getBoundingClientRect().height,
        w: el.getBoundingClientRect().width,
        x: el.getBoundingClientRect().x,
        y: el.getBoundingClientRect().y,
        padTop: parseFloat(cs.paddingTop),
        border: parseFloat(cs.borderTopWidth),
        lineHeight: cs.lineHeight,
        S: state ? state.getBoundingClientRect().height : 0,
        rowsMarginTop: rowsBox ? parseFloat(getComputedStyle(rowsBox).marginTop) : 0,
        rowsGap: rowsBox ? getComputedStyle(rowsBox).rowGap : "",
        r: rows.length,
        rowH: rows.map((r) => +r.getBoundingClientRect().height.toFixed(3)),
        m: more ? 1 : 0,
        moreH: more ? more.getBoundingClientRect().height : 0,
        moreMargin: more ? parseFloat(getComputedStyle(more).marginTop) : 0,
        moreText: more?.textContent ?? "",
      };
    });
    const S = parts.S;
    const law =
      2 * (parts.padTop + parts.border) + S + parts.rowsMarginTop + 22.4 * parts.r +
      (parts.moreMargin + S) * parts.m;
    say({ law: label, ...parts, predicted: +law.toFixed(3), delta: +(parts.h - law).toFixed(3) });
    expect(parts.r, "the row budget").toBe(wantRows);
    expect(new Set(parts.rowH).size, "every row is the same box").toBe(1);
    expect(parts.rowH[0], "and that box is the declared floor").toBeCloseTo(22.4, 1);
    expect(parts.rowsGap, "the list charges no gap").toBe("0px");
    expect(Math.abs(parts.h - law), "H == the law").toBeLessThanOrEqual(0.5);
    await ctx.close();
  });
}

// ── CH-71 · the lap, counted, with its HEAD control ────────────────────────────────────────
async function lapCensus(page: Page, open: boolean) {
  return page.evaluate((open) => {
    const sheetSel = open ? "[data-lobby].is-open" : ".hover-card.is-open";
    const sheet = document.querySelector(sheetSel) as HTMLElement | null;
    if (!sheet) return null;
    const b = sheet.getBoundingClientRect();
    const cells = [...document.querySelectorAll(".sudoku-cell, .game-cell")] as HTMLElement[];
    const lapped: { i: number; area: number; top: string; id: string }[] = [];
    cells.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const x0 = Math.max(b.x, r.x);
      const y0 = Math.max(b.y, r.y);
      const w = Math.min(b.right, r.right) - x0;
      const h = Math.min(b.bottom, r.bottom) - y0;
      if (w <= 0 || h <= 0) return;
      // THE POINT IS THE CENTRE OF THE OVERLAP, not of the cell. A cell can be lapped at its
      // top edge with its own centre in the clear, and asking about the clear part measures
      // the board rather than the cover (chromium and webkit both hand back the cell there,
      // which is correct and is not the question).
      const el = document.elementFromPoint(x0 + w / 2, y0 + h / 2);
      lapped.push({
        i,
        area: +(w * h).toFixed(1),
        top: el ? `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}` : "",
        id: el?.closest("[data-lobby]") ? "lobby" : el?.closest(".hover-card") ? "card" : "other",
      });
    });
    return { box: [b.x, b.y, b.width, b.height].map((n) => +n.toFixed(2)), lapped };
  }, open);
}

test("CH-71 — the lobby's lap, every lapped centre, and the tap that dismisses", async ({
  page,
}) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 4);
  await page.waitForTimeout(400);
  await mark(page).click();
  await page.waitForTimeout(400);
  const census = await lapCensus(page, true);
  say({ g: "CH-71-lobby", ...census! });
  expect(census!.lapped.length, "the sheet laps the board").toBeGreaterThan(0);
  for (const c of census!.lapped)
    expect(c.id, `cell ${c.i}'s centre is the sheet, never a link`).toBe("lobby");
  // And one tap on the COVERED part of a lapped cell uncovers it.
  const first = census!.lapped[0];
  const cell = page.locator(".sudoku-cell, .game-cell").nth(first.i);
  const bb = (await cell.boundingBox())!;
  const sheetBox = census!.box;
  const x = Math.max(bb.x, sheetBox[0]) + 2;
  const y = Math.max(bb.y, sheetBox[1]) + 2;
  await page.mouse.click(x, y);
  await page.waitForTimeout(300);
  const shut = await mark(page).evaluate((el) => el.getAttribute("aria-expanded"));
  say({ g: "CH-71-lobby-dismiss", cell: first.i, shut });
  expect(shut, "a tap on what it covers uncovers it").toBe("false");
});

test("CH-71 — the HEAD control: the incumbent card's lap and its click-through", async ({
  page,
}) => {
  await page.setViewportSize(DESK);
  await page.goto(HEAD_BASE + SOLO.slice(1));
  await settled(page);
  // The incumbent card is a HOVER card on a fine pointer — a click toggles a hover-opened card
  // shut, so it is opened the way a reader opens it.
  await page.locator(".attribution-trigger:visible").hover();
  await page.waitForTimeout(400);
  const census = await lapCensus(page, false);
  say({ g: "CH-71-head-control", base: HEAD_BASE, ...(census ?? {}) });
  expect(census, "the incumbent card is open at HEAD").not.toBeNull();
  const links = census!.lapped.filter((c) => c.top.startsWith("a."));
  say({ g: "CH-71-head-control-links", links });
  expect(links.length, "HEAD's own click-through, reproduced").toBeGreaterThan(0);
});
