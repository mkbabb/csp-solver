import { test, expect, type Page, type Browser } from "@playwright/test";

// PRM: frozen — nothing here watches a tween; every number is read off a settled surface.
// PAL-TIN pass-3 CRITIC probe. Independent of the prototype's own spec: the compositing and
// the contrast arithmetic are re-derived here, not imported.

const LOCAL = "./?size=3&difficulty=EASY&wire=local";

function srgbToLin(c: number) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
function lum([r, g, b]: number[]) {
  return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
}
function ratio(a: number[], b: number[]) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
function over(fg: number[], alpha: number, bg: number[]) {
  return fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));
}
function parse(css: string): number[] {
  const m = css.match(/-?[\d.]+/g);
  if (!m) throw new Error("unparseable colour " + css);
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function boot(page: Page, url: string) {
  await page.goto(url);
  await settled(page);
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
async function room(browser: Browser, n: number) {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, LOCAL);
  const link = await invite(a);
  const pages = [a];
  for (let i = 1; i < n; i++) {
    const p = await ctx.newPage();
    await boot(p, link.replace(/^https?:\/\/[^/]+\//, "./"));
    pages.push(p);
  }
  await expect
    .poll(() => a.locator(".controls-card .players-roster .player-row").count(), {
      timeout: 30000,
    })
    .toBe(n);
  return { ctx, pages };
}
async function setDark(page: Page, dark: boolean) {
  await page.evaluate((d) => {
    document.documentElement.classList.toggle("dark", d);
  }, dark);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r(null))));
}

const out: string[] = [];
const say = (s: string) => {
  out.push(s);
  console.log("CRITIC " + s);
};

test.afterAll(() => {
  console.log("=== CRITIC SUMMARY ===\n" + out.join("\n"));
});

test("tin: AA + ring painted, both arms, re-derived", async ({ page, browserName }) => {
  await boot(page, LOCAL);
  for (const dark of [false, true]) {
    await setDark(page, dark);
    const vals = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const g = (n: string) => cs.getPropertyValue(n).trim();
      const probe = document.createElement("div");
      document.body.appendChild(probe);
      const hex = (v: string) => {
        probe.style.color = v;
        const c = getComputedStyle(probe).color;
        return c;
      };
      const r: Record<string, string> = {};
      for (let i = 1; i <= 5; i++) {
        r[`peer-${i}`] = hex(g(`--color-peer-${i}`));
        r[`ring-${i}`] = hex(g(`--color-peer-${i}-ring`));
      }
      r["bg"] = hex(g("--color-background"));
      r["card"] = hex(g("--color-card"));
      r["popover"] = hex(g("--color-popover"));
      probe.remove();
      return r;
    });
    const arm = dark ? "dark" : "light";
    const aa: number[] = [];
    for (let i = 1; i <= 5; i++) {
      for (const ground of ["bg", "card", "popover"]) {
        aa.push(ratio(parse(vals[`peer-${i}`]), parse(vals[ground])));
      }
    }
    say(
      `${browserName} ${arm} AA stick-over-grounds worst ${Math.min(...aa).toFixed(3)} (15 readings)`,
    );
    // THE RING, re-composited here: stroke at alpha 0.55 over a 4% fill of the same colour
    // over the board's ground.
    const rings: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const c = parse(vals[`ring-${i}`]);
      const bg = parse(vals["bg"]);
      const fill = over(c, 0.04, bg);
      const stroke = over(c, 0.55, fill);
      rings.push(`${i}:${ratio(stroke, fill).toFixed(3)}`);
    }
    say(`${browserName} ${arm} RING vs own 4% fill @a=0.55  ${rings.join(" ")}`);
    const digits: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const c = parse(vals[`peer-${i}`]);
      const bg = parse(vals["bg"]);
      const fill = over(c, 0.04, bg);
      const stroke = over(c, 0.55, fill);
      digits.push(`${i}:${ratio(stroke, fill).toFixed(3)}`);
    }
    say(`${browserName} ${arm} DIGIT-ink in the same ring  ${digits.join(" ")}`);
  }
});

test("tin: seven players, two homes, filter census, tape cover", async ({
  browser,
  browserName,
}) => {
  const { ctx, pages } = await room(browser, 7);
  const a = pages[0];
  const geo = await a.evaluate(() => {
    const rows = [...document.querySelectorAll(".controls-card .players-roster .player-row")];
    const swatch = new Set(
      rows.map(
        (r) =>
          getComputedStyle(r.querySelector(".player-swatch")!).backgroundColor,
      ),
    );
    const ticks = [...document.querySelectorAll(".roster-tick")];
    const inName = ticks.filter((t) => t.closest(".player-name")).length;
    const pill = document.querySelector(".player-self");
    return {
      rows: rows.length,
      swatches: [...swatch],
      ticks: ticks.length,
      inName,
      glyphTick: document.querySelectorAll(".glyph-tick").length,
      pillX: pill ? +pill.getBoundingClientRect().x.toFixed(3) : null,
      filters: [...document.querySelectorAll("*")].filter((e) => {
        const f = getComputedStyle(e).filter;
        return f && f !== "none";
      }).length,
    };
  });
  say(
    `${browserName} SEVEN rows=${geo.rows} swatchColours=${geo.swatches.length} roster-tick=${geo.ticks} insideName=${geo.inName} glyph-tick=${geo.glyphTick} filterCensus=${geo.filters} pillX=${geo.pillX}`,
  );

  // The tape over a peer cell — does it cover an interactive element (W2 §2.5 class law)?
  const cells = a.locator(".sudoku-cell");
  const n = await cells.count();
  let hovered = false;
  for (let i = 0; i < n && !hovered; i++) {
    await cells.nth(i).hover();
    if (await a.locator(".washi-label, [class*='washi']").first().isVisible().catch(() => false)) {
      hovered = true;
    }
  }
  const cover = await a.evaluate(() => {
    const tape = document.querySelector(
      ".author-tape, [class*='author'] [class*='washi'], [class*='washi']",
    ) as HTMLElement | null;
    if (!tape) return { tape: false, covered: 0, tickInTape: 0 };
    const tr = tape.getBoundingClientRect();
    const cells = [...document.querySelectorAll(".sudoku-cell")];
    const covered = cells.filter((c) => {
      const r = c.getBoundingClientRect();
      const ix = Math.min(tr.right, r.right) - Math.max(tr.left, r.left);
      const iy = Math.min(tr.bottom, r.bottom) - Math.max(tr.top, r.top);
      return ix > 1 && iy > 1;
    }).length;
    return {
      tape: true,
      covered,
      tickInTape: tape.querySelectorAll(".roster-tick").length,
      rect: [tr.x, tr.y, tr.width, tr.height].map((v) => +v.toFixed(2)),
    };
  });
  say(`${browserName} TAPE ${JSON.stringify(cover)}`);
  await ctx.close();
});

test("pi: five-player roster row children", async ({ browser, browserName }) => {
  const { ctx, pages } = await room(browser, 5);
  const a = pages[0];
  const rects = await a.evaluate(() => {
    const rows = [...document.querySelectorAll(".controls-card .players-roster .player-row")];
    return rows.map((r) =>
      [...r.querySelectorAll("*")].map((c) => {
        const b = c.getBoundingClientRect();
        return `${c.className}|${b.x.toFixed(2)},${b.y.toFixed(2)},${b.width.toFixed(2)},${b.height.toFixed(2)}`;
      }),
    );
  });
  say(`${browserName} PI5 ${JSON.stringify(rects)}`);
  await ctx.close();
});
