import { test, expect, type Page } from "@playwright/test";
import { appendFileSync } from "node:fs";

// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto, except where a row names
// the un-reduced arm. PLR-SELF pass-3 RESEARCH probe: read-only measurement of HEAD 74a2b5d9.
// Nothing here asserts a design; every row is a number the synthesizer needs.

const OUT = `${__dirname}/readings.txt`;
const say = (k: string, v: unknown) => {
  const line = `${test.info().project.name}\t${k}\t${typeof v === "string" ? v : JSON.stringify(v)}`;
  appendFileSync(OUT, line + "\n");
  console.log(line);
};

const SOLO = "./?size=3&difficulty=EASY";
const LOCAL = SOLO + "&wire=local";

async function boot(page: Page, url: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url);
  const budget = 20000 * Math.min(3, page.context().pages().length);
  await page.waitForSelector("svg.handwritten-logo", { timeout: budget });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: budget })
    .toBeGreaterThan(0);
}

const box = (page: Page, sel: string) =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: +r.x.toFixed(2),
      y: +r.y.toFixed(2),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
    };
  }, sel);

/** The estate's own counting rule (filterBudget.ts): own computed filter ≠ none AND own
 *  computed display ≠ none. Dev server, not the dist — stated as such. */
const censusCount = (page: Page) =>
  page.evaluate(
    () =>
      [...document.querySelectorAll("*")].filter((el) => {
        const cs = getComputedStyle(el);
        return cs.filter && cs.filter !== "none" && cs.display !== "none";
      }).length,
  );

test("R1 · the head at the desk: the corner, its disclosure, and what it laps", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await boot(page, SOLO);

  say("R1.corner-left", await box(page, ".corner-left"));
  say("R1.attribution-trigger", await box(page, ".corner-left .attribution-trigger"));
  say("R1.logo", await box(page, "svg.handwritten-logo"));
  say("R1.board-cells", await box(page, ".board-cells"));
  say("R1.controls-card", await box(page, ".controls-card"));
  await page.waitForTimeout(2500);
  say("R1.census-closed-settled", await censusCount(page));

  // The head's ONE existing disclosure, opened by the pointer path the mark would copy.
  await page.locator(".corner-left .attribution-trigger").click();
  await page.waitForTimeout(400);
  const card = await box(page, ".corner-left .hover-card");
  say("R1.hover-card-open", card);
  say("R1.census-open", await censusCount(page));
  say(
    "R1.trigger-expanded",
    await page.locator(".corner-left .attribution-trigger").getAttribute("aria-expanded"),
  );

  // CH-71 priced at HEAD: how many live cells the open head disclosure covers, and whether a
  // click at the lapped cell's centre reaches the cell or the card.
  const lap = await page.evaluate(() => {
    const c = document.querySelector(".corner-left .hover-card")!.getBoundingClientRect();
    const cells = [...document.querySelectorAll(".sudoku-cell")];
    const hit: { i: number; owner: string; inter: number }[] = [];
    cells.forEach((cell, i) => {
      const r = cell.getBoundingClientRect();
      const w = Math.min(c.right, r.right) - Math.max(c.left, r.left);
      const h = Math.min(c.bottom, r.bottom) - Math.max(c.top, r.top);
      if (w <= 0 || h <= 0) return;
      const cx = (Math.max(c.left, r.left) + Math.min(c.right, r.right)) / 2;
      const cy = (Math.max(c.top, r.top) + Math.min(c.bottom, r.bottom)) / 2;
      const top = document.elementFromPoint(cx, cy);
      hit.push({
        i,
        owner: top ? `${top.tagName.toLowerCase()}.${top.className}`.slice(0, 60) : "null",
        inter: +(w * h).toFixed(1),
      });
    });
    return hit;
  });
  say("R1.cells-lapped-by-head-disclosure", lap.length);
  say("R1.lap-owners", lap.slice(0, 8));

  // Escape on the incumbent disclosure: does the head have one today?
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  say(
    "R1.escape-closes-attribution",
    await page.locator(".corner-left .attribution-trigger").getAttribute("aria-expanded"),
  );
  // Outside click is App.vue's closeAll.
  await page.mouse.click(900, 740);
  await page.waitForTimeout(250);
  say(
    "R1.outside-click-closes",
    await page.locator(".corner-left .attribution-trigger").getAttribute("aria-expanded"),
  );
});

test("R2 · the live regions and the roster's nodes, solo", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await boot(page, SOLO);
  const regions = await page.evaluate(() =>
    [...document.querySelectorAll("[aria-live], [role=log], [role=status]")].map(
      (el) =>
        `${el.className.toString().split(" ")[0] || el.tagName.toLowerCase()}:${el.getAttribute("role") ?? ""}:${el.getAttribute("aria-live") ?? ""}`,
    ),
  );
  say("R2.live-regions-in-DOM-order", regions);
  say("R2.roster-present-solo", await page.locator(".players-roster").count());
  say("R2.alone-line", await page.locator(".players-alone").innerText());
  say(
    "R2.roster-tabindex-solo",
    await page.evaluate(
      () => document.querySelector(".players-roster")?.getAttribute("tabindex") ?? "(none)",
    ),
  );
  say(
    "R2.roster-sronly-solo",
    await page.evaluate(
      () => document.querySelector(".players-roster")?.classList.contains("sr-only") ?? null,
    ),
  );
});

test("R3 · tokens, and the 40-index walk against the sheet's ground", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await boot(page, SOLO);

  const read = () =>
    page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const names = [
        "--peer-ink-l",
        "--color-popover",
        "--color-card",
        "--color-background",
        "--color-border",
        "--color-user-ink",
        "--color-focus-ring",
        "--type-tag",
        "--type-small",
        "--head-rule",
        "--font-hand",
      ];
      const out: Record<string, string> = {};
      for (const n of names) out[n] = cs.getPropertyValue(n).trim();
      // Painted values of the three grounds, resolved through a real element.
      const paint = (v: string) => {
        const d = document.createElement("div");
        d.style.color = v;
        document.body.appendChild(d);
        const c = getComputedStyle(d).color;
        d.remove();
        return c;
      };
      out["paint(popover)"] = paint("var(--color-popover)");
      out["paint(card)"] = paint("var(--color-card)");
      out["paint(background)"] = paint("var(--color-background)");
      return out;
    });

  say("R3.tokens.light", await read());
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await page.waitForTimeout(150);
  say("R3.tokens.dark", await read());
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
  await page.waitForTimeout(150);

  // Worst-of-40 WCAG 2.x luminance contrast of the walk inks on each ground, painted through a
  // canvas so oklch is resolved by the engine rather than by arithmetic in the spec.
  const walk = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const L = cs.getPropertyValue("--peer-ink-l").trim() || "0.5";
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const ctx = c.getContext("2d")!;
    const px = (color: string) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]] as [number, number, number];
    };
    const lum = ([r, g, b]: [number, number, number]) => {
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a: number, b: number) =>
      (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const grounds: Record<string, [number, number, number]> = {
      popover: px(getComputedStyle(document.body).getPropertyValue("--color-popover") || "#fff"),
    };
    // Resolve the grounds through the cascade rather than the raw token text.
    const probe = document.createElement("div");
    document.body.appendChild(probe);
    for (const g of ["popover", "card", "background"]) {
      probe.style.backgroundColor = `var(--color-${g})`;
      const bg = getComputedStyle(probe).backgroundColor.match(/[\d.]+/g)!.map(Number);
      grounds[g] = [bg[0], bg[1], bg[2]];
    }
    probe.remove();
    const rows: Record<string, { worst: number; at: number }> = {};
    for (const [name, g] of Object.entries(grounds)) {
      let worst = Infinity;
      let at = -1;
      for (let i = 0; i < 40; i++) {
        const hue = ((i * 137.5) % 360).toFixed(1);
        const r = ratio(lum(px(`oklch(${L} 0.11 ${hue}deg)`)), lum(g));
        if (r < worst) {
          worst = r;
          at = i;
        }
      }
      rows[name] = { worst: +worst.toFixed(3), at };
    }
    return { L, grounds, rows };
  });
  say("R3.walk40.light", walk);

  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await page.waitForTimeout(150);
  const walkDark = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const L = cs.getPropertyValue("--peer-ink-l").trim() || "0.8";
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const ctx = c.getContext("2d")!;
    const px = (color: string) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]] as [number, number, number];
    };
    const lum = ([r, g, b]: [number, number, number]) => {
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a: number, b: number) =>
      (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const probe = document.createElement("div");
    document.body.appendChild(probe);
    const grounds: Record<string, [number, number, number]> = {};
    for (const g of ["popover", "card", "background"]) {
      probe.style.backgroundColor = `var(--color-${g})`;
      const bg = getComputedStyle(probe).backgroundColor.match(/[\d.]+/g)!.map(Number);
      grounds[g] = [bg[0], bg[1], bg[2]];
    }
    probe.remove();
    const rows: Record<string, { worst: number; at: number }> = {};
    for (const [name, g] of Object.entries(grounds)) {
      let worst = Infinity;
      let at = -1;
      for (let i = 0; i < 40; i++) {
        const hue = ((i * 137.5) % 360).toFixed(1);
        const r = ratio(lum(px(`oklch(${L} 0.11 ${hue}deg)`)), lum(g));
        if (r < worst) {
          worst = r;
          at = i;
        }
      }
      rows[name] = { worst: +worst.toFixed(3), at };
    }
    return { L, grounds, rows };
  });
  say("R3.walk40.dark", walkDark);
});

test("R4 · the well inside W2's portrait dock, two at the table", async ({ browser }) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.setViewportSize({ width: 1280, height: 800 });
  await boot(a, LOCAL);

  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();

  const b = await ctx.newPage();
  await b.setViewportSize({ width: 390, height: 844 });
  await b.emulateMedia({ reducedMotion: "reduce" });
  await boot(b, link);
  await expect(b.locator(".controls-card .players-roster .player-row")).toHaveCount(2, {
    timeout: 30000,
  });

  // The dock, SHUT.
  say("R4.shut.drawer-tab", await box(b, ".drawer-tab"));
  say("R4.shut.controls-card", await box(b, ".controls-card"));
  say("R4.shut.roster", await box(b, ".players-roster"));
  say(
    "R4.shut.play-controls-inert",
    await b.evaluate(
      () => document.querySelector(".play-controls")?.hasAttribute("inert") ?? null,
    ),
  );

  // Open it and let it SETTLE (the sheet slides ~700ms).
  await b.locator(".drawer-tab").click();
  await b.waitForTimeout(900);
  await expect
    .poll(async () => (await box(b, ".controls-card"))?.y, { timeout: 5000 })
    .not.toBeUndefined();

  const settle = async () => {
    let last = -1;
    for (let i = 0; i < 20; i++) {
      const r = await box(b, ".controls-card");
      if (r && Math.abs(r.y - last) < 0.01) return r;
      last = r?.y ?? -1;
      await b.waitForTimeout(100);
    }
    return await box(b, ".controls-card");
  };
  const card = await settle();
  say("R4.open.controls-card-settled", card);
  say("R4.open.drawer-tab", await box(b, ".drawer-tab"));
  say("R4.open.tab-expanded", await b.locator(".drawer-tab").getAttribute("aria-expanded"));
  say(
    "R4.open.play-controls-inert",
    await b.evaluate(
      () => document.querySelector(".play-controls")?.hasAttribute("inert") ?? null,
    ),
  );

  // The WELL: the tray-well that holds the roster, the roster, one row, the swatch.
  const well = await b.evaluate(() => {
    const wells = [...document.querySelectorAll(".controls-card .tray-well")];
    const w = wells.find((x) => x.querySelector(".players-roster, .players-alone"));
    const r = (el: Element | null) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        x: +b.x.toFixed(2),
        y: +b.y.toFixed(2),
        w: +b.width.toFixed(2),
        h: +b.height.toFixed(2),
      };
    };
    const roster = document.querySelector(".players-roster");
    const row = document.querySelector(".player-row");
    const sw = document.querySelector(".player-swatch");
    const cs = sw ? getComputedStyle(sw) : null;
    return {
      wellIndex: w ? wells.indexOf(w) : -1,
      wellCount: wells.length,
      well: r(w ?? null),
      roster: r(roster),
      rosterMaxH: roster ? getComputedStyle(roster).maxHeight : null,
      rosterOverflow: roster ? getComputedStyle(roster).overflowY : null,
      rosterTabindex: roster?.getAttribute("tabindex") ?? "(none)",
      rosterSrOnly: roster?.classList.contains("sr-only") ?? null,
      row: r(row),
      swatch: r(sw),
      swatchBg: cs?.backgroundColor ?? null,
      rowColor: row ? getComputedStyle(row).color : null,
      cardScrollH: document.querySelector(".controls-card")?.scrollHeight ?? null,
      cardClientH: document.querySelector(".controls-card")?.clientHeight ?? null,
    };
  });
  say("R4.open.well", well);

  // Is the roster REACHABLE by the keyboard today (T7-W2 A4's tabindex="0")?
  const hops = await b.evaluate(async () => {
    const seen: string[] = [];
    const roster = document.querySelector(".players-roster") as HTMLElement | null;
    return { rosterIsFocusable: roster ? roster.tabIndex >= 0 : null, seen };
  });
  say("R4.open.roster-focusable", hops);

  // Self's own row colour vs a peer's — F1's subject, read at HEAD.
  const inks = await b.evaluate(() =>
    [...document.querySelectorAll(".players-roster .player-row")].map((r) => ({
      self: !!r.querySelector(".player-self"),
      color: getComputedStyle(r).color,
      swatch: getComputedStyle(r.querySelector(".player-swatch")!).backgroundColor,
      inlineInk: (r as HTMLElement).style.getPropertyValue("--color-user-ink") || "(none)",
    })),
  );
  say("R4.open.row-inks", inks);

  // The board under the open sheet: what the dock covers.
  say("R4.open.board-cells", await box(b, ".board-cells"));
  say("R4.open.census", await censusCount(b));

  await ctx.close();
});
