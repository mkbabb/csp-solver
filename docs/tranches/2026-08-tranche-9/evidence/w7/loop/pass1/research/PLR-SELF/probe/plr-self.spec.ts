/**
 * PLR-SELF pass-1 PROTOTYPE PROBE — the mark, the two forms, the lobby.
 *
 * Read-only on the product: every pixel this file makes is injected by `page.evaluate` over
 * the live head (`overlay.js`). Runs on the lane's own dev server (127.0.0.1:4241) under the
 * lane's own config. Nothing in src/, e2e/ or scripts/ is touched.
 */
import { test, expect, type Page } from "@playwright/test";
import { readFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const HERE =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/PLR-SELF";
const OVERLAY = readFileSync(`${HERE}/overlay.js`, "utf8");
const SOLO = "./?size=3&difficulty=EASY&wire=local";
const DESK = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };

const say = (o: unknown) => console.log(`PLR|${JSON.stringify(o)}`);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
/** filterBudget.ts's own note: a COLD load censuses 21 (the boot poses), the settled scene 9.
 *  A before/after delta is only honest once the boot poses have retired, so this polls the
 *  census to a fixed point before the baseline is taken. */
async function settleFilters(page: Page) {
  const count = () =>
    page.evaluate(
      () =>
        [...document.querySelectorAll("*")].filter((e) => {
          const cs = getComputedStyle(e);
          return cs.filter && cs.filter !== "none" && cs.display !== "none";
        }).length,
    );
  let last = -1;
  for (let i = 0; i < 40; i++) {
    const n = await count();
    if (n === last) return n;
    last = n;
    await page.waitForTimeout(250);
  }
  return last;
}
async function inject(page: Page) {
  await page.evaluate(OVERLAY);
}
async function invite(page: Page): Promise<string> {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return page.url();
}

/** The head, as the engine paints it. */
const headGeom = (page: Page) =>
  page.evaluate(() => {
    const box = (sel: string) => {
      const e = document.querySelector(sel);
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
    };
    const visible = [...document.querySelectorAll(".attribution-trigger")].find(
      (e) => e.getBoundingClientRect().width > 0,
    );
    const trig = visible
      ? (() => {
          const r = visible.getBoundingClientRect();
          return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
        })()
      : box(".attribution-trigger");
    const sunEl =
      document.querySelector(".corner-right") ??
      document.querySelector("[class*='celestial']") ??
      document.querySelector(".dark-mode-toggle");
    const sun = sunEl
      ? (() => {
          const r = sunEl.getBoundingClientRect();
          return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
        })()
      : null;
    const root = getComputedStyle(document.querySelector(".page-root") ?? document.body);
    return {
      vw: window.innerWidth,
      trigger: trig,
      sun,
      freeBand: trig && sun ? +(sun.x - (trig.x + trig.w)).toFixed(1) : null,
      headRule: root.getPropertyValue("--head-rule").trim(),
      tapFloor: root.getPropertyValue("--tap-floor").trim(),
      typeTag: getComputedStyle(document.documentElement).getPropertyValue("--type-tag").trim(),
    };
  });

/** A solo board's identity: markup + the styles that could possibly carry an ink. */
const boardPrint = (page: Page) =>
  page.evaluate(() => {
    const cells = [...document.querySelectorAll(".sudoku-cell")].slice(0, 24);
    const rows = cells.map((c) => {
      const cs = getComputedStyle(c);
      const g = c.querySelector(".glyph-svg path") as SVGElement | null;
      return [
        // `--reveal-delay` is the deal animation's own per-cell stagger and it CLEARS on its
        // own schedule — it moves between two reads of the same untouched board, so it is not
        // evidence about an overlay. Everything else on the inline style is.
        ((c as HTMLElement).getAttribute("style") ?? "").replace(/--reveal-delay:[^;]*;?/g, ""),
        cs.color,
        cs.getPropertyValue("--color-user-ink").trim(),
        g ? getComputedStyle(g).stroke : "",
      ].join("|");
    });
    const board = document.querySelector(".board-row")?.closest("div,section,main") ?? null;
    // filterBudget.ts's own counting rule, verbatim: own computed `filter` ≠ none AND own
    // computed `display` ≠ none. (On a DEV server this is not the gated 9 — that census runs
    // against the built dist. What this lane asserts is the DELTA, which must be zero.)
    const filters = [...document.querySelectorAll("*")].filter((e) => {
      const cs = getComputedStyle(e);
      return cs.filter && cs.filter !== "none" && cs.display !== "none";
    }).length;
    return {
      cells: rows.join("\n"),
      html: board ? board.outerHTML.length : -1,
      htmlHead: board ? board.outerHTML.slice(0, 120) : "",
      filters,
    };
  });

/** AA, off the engine's own compositor: the ground is PAINTED then the ink is painted on it,
 *  and both are read back as bytes. Never hex arithmetic. */
const aaTable = (page: Page, inks: string[], grounds: { name: string; layers: string[] }[]) =>
  page.evaluate(
    ({ inks, grounds }) => {
      const cv = document.createElement("canvas");
      cv.width = cv.height = 8;
      const cx = cv.getContext("2d", { willReadFrequently: true })!;
      const bytes = (layers: string[]) => {
        cx.clearRect(0, 0, 8, 8);
        // the page's own background is under every sheet
        for (const l of layers) {
          cx.fillStyle = l;
          cx.fillRect(0, 0, 8, 8);
        }
        const d = cx.getImageData(4, 4, 1, 1).data;
        return [d[0], d[1], d[2]] as [number, number, number];
      };
      const lum = ([r, g, b]: number[]) => {
        const f = (v: number) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const ratio = (a: number[], b: number[]) => {
        const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
        return +((x + 0.05) / (y + 0.05)).toFixed(2);
      };
      const resolve = (css: string) => {
        const p = document.createElement("div");
        p.style.color = css;
        document.body.appendChild(p);
        const c = getComputedStyle(p).color;
        p.remove();
        return c;
      };
      const out: Record<string, Record<string, number>> = {};
      const groundBytes: Record<string, number[]> = {};
      for (const g of grounds) groundBytes[g.name] = bytes(g.layers.map(resolve));
      for (const ink of inks) {
        out[ink] = {};
        // THE INK IS PAINTED ON ITS GROUND, not on nothing. `--ink-press-quiet` is a
        // `color-mix(… 68%, transparent)` — read off a cleared canvas it returns its SOLID
        // rgb and reports a contrast it does not have. The stack is the only honest read.
        for (const g of grounds) {
          const ib = bytes([...g.layers.map(resolve), resolve(ink)]);
          out[ink][g.name] = ratio(ib, groundBytes[g.name]);
        }
      }
      return { grounds: groundBytes, table: out };
    },
    { inks, grounds },
  );

const people = (n: number, lastHeard = 8000) =>
  Array.from({ length: n }, (_, i) => ({
    slug: ["mockingbird", "otter", "walrus", "meerkat", "badger", "heron", "quokka", "tapir",
      "lemur", "panda", "ibis", "koala", "civet", "stoat", "vole", "wombat"][i % 16],
    index: i,
    self: i === 0,
    lastHeardMs: i === 0 ? null : lastHeard + i * 1000,
  }));

// ───────────────────────────────────────────────────────────────────────────────────────
test("A · the head's band, both forms, both viewports — geometry and solo identity", async ({
  page,
}, info) => {
  mkdirSync(`${OUT}/frames`, { recursive: true });
  for (const [vpName, vp] of [["desk", DESK], ["phone", PHONE]] as const) {
    await page.setViewportSize(vp);
    await page.goto(SOLO);
    await settled(page);
    await settleFilters(page);
    const head = await headGeom(page);
    const before = await boardPrint(page);
    say({ t: "head", engine: info.project.name, vp: vpName, ...head });

    await inject(page);
    for (const form of ["name", "stub"] as const) {
      await page.evaluate(
        ({ form }) =>
          (window as any).__plrSelf.mount({
            form,
            roster: "mirror",
            people: [{ slug: "tragic-mockingbird", index: null, self: true, lastHeardMs: null }],
            show: 9,
            open: false,
          }),
        { form },
      );
      const shut = await page.evaluate(() => {
        const b = document.querySelector("#plr-self button") as HTMLElement;
        const r = b.getBoundingClientRect();
        const cs = getComputedStyle(b);
        return {
          x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1),
          color: cs.color,
          fontSize: cs.fontSize,
          name: b.getAttribute("aria-label"),
          text: b.textContent?.trim() ?? "",
        };
      });
      await page.locator("#plr-self button").click();
      await page.waitForTimeout(80);
      const open = await page.evaluate(() => {
        const s = document.querySelector("[data-lobby]") as HTMLElement;
        const r = s.getBoundingClientRect();
        return {
          x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1),
          right: +(r.x + r.width).toFixed(1),
          bottom: +(r.y + r.height).toFixed(1),
          state: document.querySelector(".plr-state")?.textContent,
          rows: document.querySelectorAll(".plr-row").length,
        };
      });
      say({ t: "form", engine: info.project.name, vp: vpName, form, shut, open, vw: vp.width });
      // the 44px floor, per dimension
      expect(shut.w, `${form} ${vpName}: the mark clears the tap floor in WIDTH`).toBeGreaterThanOrEqual(44);
      expect(shut.h, `${form} ${vpName}: the mark clears the tap floor in HEIGHT`).toBeGreaterThanOrEqual(44);
      // it is in the head's left corner (R5 I3's own bounds)
      expect(shut.x).toBeLessThan(200);
      expect(shut.y).toBeLessThan(120);
      // the sheet stays on the page
      expect(open.right, `${form} ${vpName}: the sheet stays inside the viewport`).toBeLessThanOrEqual(vp.width);
      if (vpName === "phone" && info.project.name === "chromium") {
        await page
          .locator("#plr-self")
          .screenshot({ path: `${OUT}/frames/phone-${form}-open.png` })
          .catch(() => {});
      }
      await page.locator("#plr-self button").click();
    }
    const after = await boardPrint(page);
    const h = (s: string) => createHash("sha1").update(s).digest("hex").slice(0, 12);
    say({
      t: "solo-identity",
      engine: info.project.name,
      vp: vpName,
      cellsBefore: h(before.cells),
      cellsAfter: h(after.cells),
      same: before.cells === after.cells,
      boardHtmlLen: [before.html, after.html],
      filters: [before.filters, after.filters],
    });
    expect(after.cells, "a solo board is byte-identical under the overlay").toBe(before.cells);
    expect(after.filters, "the live-filter population does not move").toBe(before.filters);
    await page.evaluate(() => (window as any).__plrSelf.unmount());
  }
});

// ───────────────────────────────────────────────────────────────────────────────────────
test("B · the lobby at 3 and at 16 — rows, compression, and AA on the sheet's real ground", async ({
  page,
}, info) => {
  for (const [vpName, vp] of [["desk", DESK], ["phone", PHONE]] as const) {
    await page.setViewportSize(vp);
    await page.goto(SOLO);
    await settled(page);
    await inject(page);
    for (const n of [3, 16]) {
      for (const form of ["name", "stub"] as const) {
        await page.evaluate(
          ({ n, form, rows }) =>
            (window as any).__plrSelf.mount({ form, roster: "mirror", people: rows, show: 9, open: true }),
          { n, form, rows: people(n) },
        );
        await page.waitForTimeout(60);
        const m = await page.evaluate(() => {
          const s = document.querySelector("[data-lobby]") as HTMLElement;
          const r = s.getBoundingClientRect();
          const rows = [...document.querySelectorAll(".plr-row")].map((e) => {
            const rr = e.getBoundingClientRect();
            const name = e.querySelector(".plr-name") as HTMLElement;
            const you = e.querySelector(".plr-you") as HTMLElement | null;
            return {
              h: +rr.height.toFixed(1),
              color: getComputedStyle(e).color,
              nameX: +name.getBoundingClientRect().x.toFixed(1),
              nameRight: +(name.getBoundingClientRect().x + name.getBoundingClientRect().width).toFixed(1),
              youX: you ? +you.getBoundingClientRect().x.toFixed(1) : null,
            };
          });
          return {
            w: +r.width.toFixed(1),
            h: +r.height.toFixed(1),
            bottom: +(r.y + r.height).toFixed(1),
            rows,
            more: document.querySelector(".plr-more")?.textContent ?? null,
            foot: document.querySelector(".plr-foot")?.textContent ?? null,
            state: document.querySelector(".plr-state")?.textContent ?? null,
            youGap: (() => {
              const row = document.querySelector(".plr-row:has(.plr-you)") as HTMLElement | null;
              if (!row) return null;
              const nm = row.querySelector(".plr-name")!.getBoundingClientRect();
              const y = row.querySelector(".plr-you")!.getBoundingClientRect();
              return +(y.x - (nm.x + nm.width)).toFixed(1);
            })(),
          };
        });
        say({ t: "lobby", engine: info.project.name, vp: vpName, n, form, ...m, vh: vp.height });
      }
    }

    // AA — every ink the sheet paints, on FOUR grounds, one of which is the sheet's own
    // (the @mbabb pose is popover at 80%: a translucent ground, so the composite is what counts).
    for (const theme of ["light", "dark"] as const) {
      // The estate's dark arm is a CLASS on <html> (index.css:362 `.dark`), not a data-attr.
      await page.evaluate((t) => {
        document.documentElement.classList.toggle("dark", t === "dark");
      }, theme);
      await page.waitForTimeout(120);
      const inks = [
        ...Array.from({ length: 16 }, (_, i) => `oklch(var(--peer-ink-l) 0.11 ${((i * 137.5) % 360).toFixed(1)}deg)`),
        "var(--color-pencil-graphite)",
        "var(--ink-press-quiet)",
        "var(--color-user-ink)",
      ];
      const aa = await aaTable(page, inks, [
        { name: "background", layers: ["var(--color-background)"] },
        { name: "card", layers: ["var(--color-card)"] },
        { name: "sheet-over-background", layers: ["var(--color-background)", "color-mix(in srgb, var(--color-popover) 80%, transparent)"] },
        { name: "sheet-over-card", layers: ["var(--color-card)", "color-mix(in srgb, var(--color-popover) 80%, transparent)"] },
      ]);
      const worst: Record<string, { ink: string; r: number }> = {};
      for (const [ink, row] of Object.entries(aa.table))
        for (const [g, r] of Object.entries(row))
          if (!worst[g] || r < worst[g].r) worst[g] = { ink, r };
      say({ t: "aa", engine: info.project.name, vp: vpName, theme, grounds: aa.grounds, worst, table: aa.table });
    }
    await page.evaluate(() => document.documentElement.classList.remove("dark"));
    await page.evaluate(() => (window as any).__plrSelf.unmount());
  }
});

// ───────────────────────────────────────────────────────────────────────────────────────
test("C · F1 on a live pair — the mark's ink is the room's ink", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);

  const selfSlug = (p: Page) =>
    p.evaluate(
      () =>
        document
          .querySelector(".controls-card .players-roster .player-row:has(.player-self) .player-name")
          ?.textContent?.trim() ?? "",
    );
  const swatchOf = (p: Page, slug: string) =>
    p.evaluate((s) => {
      const li = [...document.querySelectorAll(".controls-card .players-roster .player-row")].find(
        (e) => e.querySelector(".player-name")?.textContent?.trim() === s,
      );
      return li ? getComputedStyle(li.querySelector(".player-swatch")!).backgroundColor : "(none)";
    }, slug);

  const aSlug = await selfSlug(a);
  const headSelf = await swatchOf(a, aSlug); // HEAD: what A paints for A
  const room = await swatchOf(b, aSlug); // what the room paints for A

  // The F1 cure, prototyped: A's mark reads the ROOM's index for A — `k`, which A's own page
  // already holds (useSession.ts:712 publishes it, :553 adopts it). Read it off the wire the
  // same way the roster does, by reading what B paints and by re-deriving from the index.
  const kIndex = await b.evaluate((slug) => {
    const li = [...document.querySelectorAll(".controls-card .players-roster .player-row")].find(
      (e) => e.querySelector(".player-name")?.textContent?.trim() === slug,
    ) as HTMLElement | null;
    return li ? li.getAttribute("style") : null;
  }, aSlug);

  await inject(a);
  const idx = kIndex ? Number(/\s([\d.]+)deg/.exec(kIndex)?.[1] ?? "NaN") : NaN;
  const index = Number.isFinite(idx) ? Math.round((idx / 137.5) % 144) : 0;
  await a.evaluate(
    ({ slug, index }) =>
      (window as any).__plrSelf.mount({
        form: "stub",
        roster: "mirror",
        people: [{ slug, index, self: true, lastHeardMs: null }],
        show: 9,
        open: false,
      }),
    { slug: aSlug, index },
  );
  const markInk = await a.evaluate(
    () => getComputedStyle(document.querySelector("#plr-self button")!).color,
  );
  say({
    t: "F1",
    engine: info.project.name,
    slug: aSlug,
    headSelfSwatch: headSelf,
    roomPaintsForA: room,
    peerStyle: kIndex,
    derivedIndex: index,
    markInk,
    i2GreenUnderOverlay: markInk === room,
  });
  expect(markInk, "I2 under the overlay: the mark is the room's colour for you").toBe(room);

  // M19 — a third page arrives while A's lobby is SHUT and A is typing.
  await a.locator(".sudoku-cell").first().click();
  const focusBefore = await a.evaluate(() => document.activeElement?.className ?? "(none)");
  const c = await ctx.newPage();
  await c.goto(link);
  await settled(c);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(3);
  const focusAfter = await a.evaluate(() => document.activeElement?.className ?? "(none)");
  const lobbyOpen = await a.evaluate(
    () => (document.querySelector("[data-lobby]") as HTMLElement).style.display !== "none",
  );
  const markNameAfter = await a.evaluate(() =>
    document.querySelector("#plr-self button")!.getAttribute("aria-label"),
  );
  say({
    t: "M19",
    engine: info.project.name,
    focusBefore,
    focusAfter,
    focusMoved: focusBefore !== focusAfter,
    lobbyOpen,
    markNameAfterArrival: markNameAfter,
  });
  expect(focusAfter).toBe(focusBefore);
  expect(lobbyOpen).toBe(false);

  // What the WELL shows, and what MOVE would leave of it.
  const wellNow = await a.evaluate(() => {
    const well = document.querySelector(".controls-card .tray-well:has(.players-roster)") as HTMLElement;
    const r = well.getBoundingClientRect();
    return {
      h: +r.height.toFixed(1),
      w: +r.width.toFixed(1),
      regions: [...well.querySelectorAll("[aria-live], [role='log']")].map((e) => ({
        cls: e.className,
        role: e.getAttribute("role"),
        live: e.getAttribute("aria-live"),
        label: e.getAttribute("aria-label"),
        text: (e.textContent ?? "").trim().slice(0, 60),
      })),
      rosterH: +(
        document.querySelector(".players-roster") as HTMLElement
      ).getBoundingClientRect().height.toFixed(1),
    };
  });
  const wellMoved = await a.evaluate(() => {
    const st = document.createElement("style");
    st.id = "plr-move";
    st.textContent = ".players-roster, .players-status, .players-alone { display: none !important; }";
    document.head.appendChild(st);
    const well = document.querySelector(".controls-card .tray-well:has(.players-leave)") as HTMLElement;
    const r = well.getBoundingClientRect();
    const out = { h: +r.height.toFixed(1), w: +r.width.toFixed(1) };
    st.remove();
    return out;
  });
  say({ t: "well", engine: info.project.name, mirror: wellNow, moveLeaves: wellMoved });
  await ctx.close();
});

// ───────────────────────────────────────────────────────────────────────────────────────
test("D · identity loss — what the sheet would have to say", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const room = new URL(link).searchParams.get("s")!;
  // A SECOND PAGE, because `rosterRows` is gated on `live` and a joiner alone in a room is
  // not live (useSession.ts:672-681 — a table you followed a link into is one you are
  // WAITING on). Without it the roster is empty and the probe would be measuring nothing.
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  const slugOf = (p: Page) =>
    p.evaluate(
      () =>
        document
          .querySelector(".controls-card .players-roster .player-row:has(.player-self) .player-name")
          ?.textContent?.trim() ?? "",
    );
  const rosterOf = (p: Page) =>
    p.evaluate(() =>
      [...document.querySelectorAll(".controls-card .players-roster .player-row")].map((e) => ({
        slug: e.querySelector(".player-name")?.textContent?.trim(),
        self: !!e.querySelector(".player-self"),
        ink: (e as HTMLElement).getAttribute("style"),
      })),
    );
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);
  const before = await slugOf(a);
  const bBefore = await rosterOf(b);

  // THE NINTH ROOM (R5 F5): IDENTITY_CAP = 8 (playerIdentity.ts:98) prunes at every write, so
  // eight other tables evict this one's binding. The per-tab sessionStorage half goes with it —
  // that is what a NEW TAB tomorrow looks like.
  await a.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem("session-identity-v1") ?? "{}");
    const rooms: Record<string, { id: string; at: number }> = {};
    for (let i = 0; i < 8; i++) rooms[`zz${i}`] = { id: `p-00000000000${i}`, at: Date.now() + i };
    localStorage.setItem("session-identity-v1", JSON.stringify({ rooms, live: raw.live ?? [] }));
    sessionStorage.clear();
  });
  await a.goto(link);
  await settled(a);
  await expect(a.locator(".controls-card .players-roster .player-row")).not.toHaveCount(0);
  const after = await slugOf(a);
  const bAfter = await rosterOf(b);
  say({
    t: "identity-loss",
    engine: info.project.name,
    slugBefore: before,
    slugAfter: after,
    changed: before !== after,
    roomBefore: bBefore,
    roomAfter: bAfter,
    // the GHOST: the room keeps the name you lost until the 45s expiry (useSession.ts:624)
    ghostRows: bAfter.length - bBefore.length,
  });
  await ctx.close();
});

// ───────────────────────────────────────────────────────────────────────────────────────
// E · the crops. Chromium only, and that is stated rather than assumed: A's geometry table
// shows the two engines agreeing to ≤0.1px on every box this frame shows, so a second
// engine's bytes would cost the wave's cap and prove nothing it does not already hold.
test("E · crops", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "geometry agrees to 0.1px; one engine's bytes");
  mkdirSync(`${OUT}/frames`, { recursive: true });
  const three = [
    { slug: "tragic-mockingbird", index: 0, self: true, lastHeardMs: null },
    { slug: "literary-panda", index: 1, self: false, lastHeardMs: 9000 },
    { slug: "opposite-heron", index: 2, self: false, lastHeardMs: 26000 },
  ];
  // 1 · THE HEAD, SHUT, BESIDE @mbabb — the clutter question, both forms, one frame each.
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await inject(page);
  for (const form of ["name", "stub"] as const) {
    await page.evaluate(
      ({ form, three }) =>
        (window as any).__plrSelf.mount({ form, roster: "mirror", people: three, show: 9, open: false }),
      { form, three },
    );
    await page.waitForTimeout(60);
    await page.screenshot({
      path: `${OUT}/frames/desk-head-${form}-shut.png`,
      clip: { x: 0, y: 0, width: 260, height: 64 },
    });
  }
  // 2 · THE LOBBY, OPEN, ON THE PHONE — the sheet at three.
  await page.setViewportSize(PHONE);
  await page.goto(SOLO);
  await settled(page);
  await inject(page);
  for (const form of ["name", "stub"] as const) {
    await page.evaluate(
      ({ form, three }) =>
        (window as any).__plrSelf.mount({ form, roster: "mirror", people: three, show: 9, open: true }),
      { form, three },
    );
    await page.waitForTimeout(60);
    await page.screenshot({
      path: `${OUT}/frames/phone-lobby-${form}-open.png`,
      clip: { x: 0, y: 0, width: 340, height: 200 },
    });
  }
  say({ t: "crops", engine: info.project.name, wrote: 4 });
});

// ───────────────────────────────────────────────────────────────────────────────────────
// F · the collisions the sheet walks into, and the `you` gap re-derived at the TEXT.
test("F · what the sheet sits on, and F10 at the glyph", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);

  // F10, re-derived at the TEXT rather than at the box: the `you` qualifier's distance from
  // the last glyph of the name it qualifies (Range.getBoundingClientRect, not the flex box).
  const f10 = await a.evaluate(() => {
    const row = document.querySelector(
      ".controls-card .players-roster .player-row:has(.player-self)",
    ) as HTMLElement;
    const nameEl = row.querySelector(".player-name") as HTMLElement;
    const you = row.querySelector(".player-self") as HTMLElement;
    const r = document.createRange();
    r.selectNodeContents(nameEl);
    const glyphs = r.getBoundingClientRect();
    const box = nameEl.getBoundingClientRect();
    const y = you.getBoundingClientRect();
    return {
      glyphRight: +glyphs.right.toFixed(1),
      boxRight: +box.right.toFixed(1),
      youLeft: +y.x.toFixed(1),
      gapFromGlyph: +(y.x - glyphs.right).toFixed(1),
      gapFromBox: +(y.x - box.right).toFixed(1),
      wellWidth: +(
        document.querySelector(".controls-card .tray-well:has(.players-roster)") as HTMLElement
      ).getBoundingClientRect().width.toFixed(1),
    };
  });
  say({ t: "F10", engine: info.project.name, ...f10 });

  // What a 16-row sheet SITS ON, on the phone: the board, and the sun's own corner.
  await a.setViewportSize(PHONE);
  await a.waitForTimeout(400);
  await inject(a);
  await a.evaluate(
    (rows) => (window as any).__plrSelf.mount({ form: "stub", roster: "mirror", people: rows, show: 9, open: true }),
    people(16),
  );
  await a.waitForTimeout(120);
  const cover = await a.evaluate(() => {
    const s = (document.querySelector("[data-lobby]") as HTMLElement).getBoundingClientRect();
    const boardEl = document.querySelector(".board-row")?.parentElement as HTMLElement | null;
    const board = boardEl?.getBoundingClientRect() ?? null;
    const sunEl = document.querySelector(".corner-right") as HTMLElement | null;
    const sun = sunEl?.getBoundingClientRect() ?? null;
    const overlap = (p: DOMRect | null) =>
      p
        ? {
            w: +Math.max(0, Math.min(s.right, p.right) - Math.max(s.x, p.x)).toFixed(1),
            h: +Math.max(0, Math.min(s.bottom, p.bottom) - Math.max(s.y, p.y)).toFixed(1),
          }
        : null;
    // who paints on top where they meet
    const zOf = (e: Element | null) => (e ? getComputedStyle(e).zIndex : null);
    const meet = sun
      ? document.elementFromPoint(Math.min(s.right, sun.right) - 2, Math.min(s.bottom, sun.bottom) - 2)
      : null;
    return {
      sheet: { x: +s.x.toFixed(1), y: +s.y.toFixed(1), w: +s.width.toFixed(1), h: +s.height.toFixed(1) },
      board: board ? { x: +board.x.toFixed(1), y: +board.y.toFixed(1), w: +board.width.toFixed(1), h: +board.height.toFixed(1) } : null,
      sun: sun ? { x: +sun.x.toFixed(1), y: +sun.y.toFixed(1), w: +sun.width.toFixed(1), h: +sun.height.toFixed(1) } : null,
      overBoard: overlap(board),
      overSun: overlap(sun),
      zSheet: zOf(document.querySelector("[data-lobby]")),
      zSun: zOf(sunEl),
      zMark: zOf(document.getElementById("plr-self")),
      zAttribution: zOf(document.querySelector(".mobile-attribution, .corner-left")),
      atTheMeetingPoint: meet ? meet.className || meet.tagName : null,
    };
  });
  say({ t: "cover", engine: info.project.name, ...cover });
  await ctx.close();
});

// ───────────────────────────────────────────────────────────────────────────────────────
// G · the hand's own metrics: what the two forms actually MEASURE, over the real dictionary.
test("G · the name's width, over the dictionary's extremes", async ({ page }, info) => {
  const WORDS = {
    shortestAnimal: "ant",
    longestAnimal: "tyrannosaurus",
    medianAnimal: "mockingbird",
    shortestSlug: "wet-ant",
    longestSlug: "architectural-caterpillar",
    stateLine16: "16 on this board",
    foot: "last heard from 30 seconds ago",
  };
  for (const [vpName, vp] of [["desk", DESK], ["phone", PHONE]] as const) {
    await page.setViewportSize(vp);
    await page.goto(SOLO);
    await settled(page);
    const m = await page.evaluate((words) => {
      const probe = document.createElement("span");
      probe.style.cssText =
        "position:fixed;visibility:hidden;white-space:nowrap;font-family:var(--font-hand);font-size:var(--type-tag)";
      document.body.appendChild(probe);
      const out: Record<string, number> = {};
      for (const [k, v] of Object.entries(words)) {
        probe.textContent = v as string;
        out[k] = +probe.getBoundingClientRect().width.toFixed(1);
      }
      const cs = getComputedStyle(probe);
      const trig = [...document.querySelectorAll(".attribution-trigger")].find(
        (e) => e.getBoundingClientRect().width > 0,
      )!;
      const tcs = getComputedStyle(trig);
      probe.remove();
      return {
        widths: out,
        handSize: cs.fontSize,
        handFamily: cs.fontFamily.split(",")[0],
        mbabbSize: tcs.fontSize,
        mbabbFamily: tcs.fontFamily.split(",")[0],
        sheetInner: 256 - 32, // the card's 256 min-width less its 16px padding, both sides
      };
    }, WORDS);
    say({ t: "metrics", engine: info.project.name, vp: vpName, ...m });
  }
});

// ───────────────────────────────────────────────────────────────────────────────────────
// H · I3 under the overlay, BY R0'S OWN LOCATOR — and I2 on BOTH pages of the pair.
test("H · I3's locator against the mark, and I2 both ways", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);

  const rosterOf = (p: Page) =>
    p.evaluate(() =>
      [...document.querySelectorAll(".controls-card .players-roster .player-row")].map((e) => ({
        slug: e.querySelector(".player-name")!.textContent!.trim(),
        self: !!e.querySelector(".player-self"),
        swatch: getComputedStyle(e.querySelector(".player-swatch")!).backgroundColor,
      })),
    );
  const ra = await rosterOf(a);
  const rb = await rosterOf(b);
  const aSelf = ra.find((r) => r.self)!.slug;
  const bSelf = rb.find((r) => r.self)!.slug;
  const roomPaintsA = rb.find((r) => r.slug === aSelf)!.swatch;
  const roomPaintsB = ra.find((r) => r.slug === bSelf)!.swatch;
  const idxFrom = (rgbish: string) => {
    const h = Number(/0\.11\s+([\d.]+)/.exec(rgbish)?.[1] ?? "NaN");
    return Number.isFinite(h) ? Math.round(h / 137.5) : 0;
  };
  for (const [p, slug, room] of [
    [a, aSelf, roomPaintsA],
    [b, bSelf, roomPaintsB],
  ] as const) {
    await inject(p);
    await p.evaluate(
      ({ slug, index }) =>
        (window as any).__plrSelf.mount({
          form: "stub",
          roster: "mirror",
          people: [{ slug, index, self: true, lastHeardMs: null }],
          show: 9,
          open: false,
        }),
      { slug, index: idxFrom(room) },
    );
  }
  const markOf = (p: Page) =>
    p.evaluate(() => getComputedStyle(document.querySelector("#plr-self button")!).color);
  say({
    t: "I2-both-pages",
    engine: info.project.name,
    a: { slug: aSelf, mark: await markOf(a), roomPaints: roomPaintsA },
    b: { slug: bSelf, mark: await markOf(b), roomPaints: roomPaintsB },
    greenA: (await markOf(a)) === roomPaintsA,
    greenB: (await markOf(b)) === roomPaintsB,
  });
  expect(await markOf(a)).toBe(roomPaintsA);
  expect(await markOf(b)).toBe(roomPaintsB);

  // I3's locator, VERBATIM from r0's instruments.spec.ts:82.
  const r0Locator = a.getByRole("button", { name: /player|lobby|who.s (here|on this board)/i });
  const byData = a.locator("button[data-player-mark]");
  const mark = byData.first();
  const box = (await mark.boundingBox())!;
  await mark.click();
  const opened = await a.locator("[data-lobby]").isVisible();
  say({
    t: "I3-under-overlay",
    engine: info.project.name,
    r0LocatorCandidates: await r0Locator.count(),
    markAccessibleName: await mark.getAttribute("aria-label"),
    byDataCandidates: await byData.count(),
    x: +box.x.toFixed(1),
    y: +box.y.toFixed(1),
    w: +box.width.toFixed(1),
    h: +box.height.toFixed(1),
    inLeftOfHead: box.x < 200 && box.y < 120,
    pressOpensLobby: opened,
  });
  await ctx.close();
});
