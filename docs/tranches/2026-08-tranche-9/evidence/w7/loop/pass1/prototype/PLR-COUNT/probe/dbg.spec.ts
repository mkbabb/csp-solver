/**
 * G11 · THE REFACTOR'S OWN GATE — `DifficultyTally` renders the paths it shipped.
 *
 * The rendered `d` attributes of `.dt-stroke` are read off the live page and compared, byte for
 * byte, against the same geometry recomputed through the PRE-extraction call: the literals
 * `TALLY_BOIL = 0.6` and the inline `generateLineBoilFrames(...)` that lived in
 * `DifficultyTally.vue:84-97`. If the extraction moved a number, these disagree.
 *
 * P13 · the sheet's own contrast, read from computed styles on the card ground.
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

const OUT =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr1/out";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

test("P12 G11 DifficultyTally paths are the ones that shipped", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto("./?size=3&difficulty=EASY&wire=local");
  await settled(page);
  // The tally lives in the controls card's new-game well; open whatever holds it.
  await page.waitForSelector(".difficulty-tally", { timeout: 20000 }).catch(() => {});
  const out = await page.evaluate(async () => {
    const gp = await import("/src/pencil/grid/gridPaths.ts");
    const pc = await import("/src/pencil/config/pencilConfig.ts");
    const STROKES = [
      { x1: 11, y1: 9, x2: 11, y2: 35, seed: 11 },
      { x1: 24, y1: 9, x2: 24, y2: 35, seed: 23 },
      { x1: 37, y1: 9, x2: 37, y2: 35, seed: 37 },
      { x1: 50, y1: 9, x2: 50, y2: 35, seed: 53 },
      { x1: 6, y1: 37, x2: 55, y2: 7, seed: 71 },
    ];
    const grain = (pc as any).FILTER_PRESETS["grain-static"]?.grain;
    // THE PRE-EXTRACTION CALL, verbatim: the literal 0.6, not the config key.
    const before = STROKES.map((s) =>
      (gp as any).generateLineBoilFrames(
        s.x1,
        s.y1,
        s.x2,
        s.y2,
        { roughness: 0.95, segments: 4, seed: s.seed, jagged: true },
        0.6,
        (pc as any).BOIL_CONFIG.frameCount,
        grain,
      ),
    );
    const rendered = [...document.querySelectorAll(".difficulty-tally .dt-stroke")].map((p) =>
      p.getAttribute("d"),
    );
    const flatBefore = before.flatMap((fr: string[], i: number) =>
      fr.map((d) => ({ i, d })),
    );
    // Rendered order is pose-major (4 poses × 5 strokes); the recomputation is stroke-major.
    const fc = (pc as any).BOIL_CONFIG.frameCount;
    const expected: string[] = [];
    for (let f = 0; f < fc; f++)
      for (let i = 0; i < STROKES.length; i++) expected.push(before[i][f % before[i].length]);
    const hash = (xs: (string | null)[]) => {
      let h = 0;
      for (const s of xs) for (let k = 0; k < (s ?? "").length; k++) h = (h * 31 + (s ?? "").charCodeAt(k)) | 0;
      return h.toString(16);
    };
    return {
      mounted: rendered.length,
      tallyBoil: (pc as any).BOIL_CONFIG.tallyBoil,
      stagger: (pc as any).MOTION.tallyStaggerMs,
      identical: rendered.length > 0 && rendered.join("|") === expected.join("|"),
      renderedHash: hash(rendered),
      expectedHash: hash(expected),
      sample: rendered[0]?.slice(0, 60) ?? null,
      flat: flatBefore.length,
    };
  });
  fs.writeFileSync(`${OUT}/p12-g11-${info.project.name}.json`, JSON.stringify(out, null, 1));
  console.log(`P12|G11|${info.project.name}|${JSON.stringify(out)}`);
  await ctx.close();
});

/**
 * P14 · I2', RE-POINTED AT THE SURFACE THAT NOW CARRIES THE COLOUR.
 *
 * r0's I2/I4 address `.player-swatch` inside `.players-roster` — a dot this family deletes, so
 * both CRASH against the prototype rather than reading RED (`getComputedStyle(null)`). This asks
 * I2's question of the register's row mark, so the family's claim is measured rather than
 * asserted. It is not a re-cut of an instrument to fit a cure: r0's rows are reported exactly as
 * they came out, and this is reported beside them.
 */
const rowInk = (p: Page, slug: string) =>
  p.evaluate((s) => {
    const lobby = [...document.querySelectorAll("[data-lobby]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    );
    if (!lobby) return "(no sheet)";
    const li = [...lobby.querySelectorAll(".pl-row")].find(
      (e) => e.querySelector(".pl-name")?.textContent?.trim() === s,
    );
    return li ? getComputedStyle(li.querySelector(".pl-row-mark path")!).stroke : "(no row)";
  }, slug);

const selfSlugIn = (p: Page) =>
  p.evaluate(() => {
    const lobby = [...document.querySelectorAll("[data-lobby]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    );
    const li = [...(lobby?.querySelectorAll(".pl-row") ?? [])].find(
      (e) => e.querySelector(".pl-qualifier")?.textContent?.trim() === "you",
    );
    return li?.querySelector(".pl-name")?.textContent?.trim() ?? "";
  });

async function openSheet(p: Page) {
  await p.locator("[data-player-mark]:visible").first().click();
  await p.waitForTimeout(700);
}

test("P14 I2 prime — the register's self row against the room's own ink", async ({
  browser,
}, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto("./?size=3&difficulty=EASY&wire=local");
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await a.waitForTimeout(600);
  await openSheet(a);
  await openSheet(b);
  const aSlug = await selfSlugIn(a);
  const out = {
    engine: info.project.name,
    slug: aSlug,
    onMyPage: await rowInk(a, aSlug),
    onTheirPage: await rowInk(b, aSlug),
  };
  fs.writeFileSync(`${OUT}/p14-i2prime-${info.project.name}.json`, JSON.stringify(out, null, 1));
  console.log(`P14|I2prime|${JSON.stringify(out)}`);
  await ctx.close();
});

test("P13 sheet contrast from computed styles", async ({ browser }, info) => {
  for (const scheme of ["light", "dark"] as const) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      colorScheme: scheme,
    });
    const page = await ctx.newPage();
    const r = `p13${scheme}`;
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${r}`);
    await settled(page);
    await page.evaluate((room) => {
      const ch = new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < 5; i++) ch.postMessage({ kind: "hi", data: {}, from: `probe-peer-${i}` });
    }, r);
    await page.waitForTimeout(250);
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(800);
    const out = await page.evaluate(() => {
      const lum = (rgb: number[]) => {
        const f = rgb.map((c) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
      };
      const parse = (s: string) => (s.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
      const over = (fg: number[], a: number, bg: number[]) =>
        fg.map((c, i) => c * a + bg[i] * (1 - a));
      const ratio = (a: number[], b: number[]) => {
        const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
        return +((l1 + 0.05) / (l2 + 0.05)).toFixed(3);
      };
      const lobby = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => e.getBoundingClientRect().width > 0,
      ) as HTMLElement;
      const cardBg = parse(getComputedStyle(lobby).backgroundColor);
      const pageBg = parse(getComputedStyle(document.body).backgroundColor);
      const rows = [...lobby.querySelectorAll(".pl-row")].map((li) => {
        const stroke = parse(getComputedStyle(li.querySelector(".pl-row-mark path")!).stroke);
        const name = parse(getComputedStyle(li.querySelector(".pl-name")!).color);
        return {
          stroke: getComputedStyle(li.querySelector(".pl-row-mark path")!).stroke,
          onCard: ratio(over(stroke, 0.95, cardBg), cardBg),
          nameOnCard: ratio(name, cardBg),
        };
      });
      const marks = [...document.querySelectorAll("[data-player-mark]")]
        .filter((m) => m.getBoundingClientRect().width > 0)
        .flatMap((m) =>
          [...m.querySelectorAll(".pt-pose.is-active path")].map((p) => {
            const s = parse(getComputedStyle(p).stroke);
            return {
              stroke: getComputedStyle(p).stroke,
              onPage: ratio(over(s, 0.95, pageBg), pageBg),
            };
          }),
        );
      const stateEl = lobby.querySelector(".pl-state")!;
      return {
        cardBg: getComputedStyle(lobby).backgroundColor,
        pageBg: getComputedStyle(document.body).backgroundColor,
        rows,
        marks,
        state: ratio(parse(getComputedStyle(stateEl).color), cardBg),
      };
    });
    fs.writeFileSync(
      `${OUT}/p13-contrast-${scheme}-${info.project.name}.json`,
      JSON.stringify(out, null, 1),
    );
    console.log(`P13|${scheme}|${info.project.name}|${JSON.stringify(out)}`);
    await ctx.close();
  }
});

test("P15 crops, settled, with the DOM counted at the same moment", async ({ browser }, info) => {
  if (info.project.name !== "chromium") test.skip();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  const r = "p15";
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${r}`);
  await settled(page);
  for (const n of [1, 3, 6, 7]) {
    if (n > 1)
      await page.evaluate(
        ({ room, k }) => {
          const w = window as unknown as { __ch?: BroadcastChannel };
          w.__ch ??= new BroadcastChannel(`board:${room}`);
          for (let i = 0; i < k; i++)
            w.__ch.postMessage({ kind: "hi", data: {}, from: `probe-peer-${i}` });
        },
        { room: r, k: n - 1 },
      );
    await page.waitForTimeout(1200);
    const dom = await page.evaluate(() => {
      const m = [...document.querySelectorAll("[data-player-mark]")].find(
        (e) => e.getBoundingClientRect().width > 0,
      ) as HTMLElement;
      const active = m.querySelector(".pt-pose.is-active");
      return {
        label: m.getAttribute("aria-label"),
        paths: active ? active.querySelectorAll("path").length : 0,
        offsets: active
          ? [...active.querySelectorAll("path")].map((p) => p.getAttribute("stroke-dashoffset"))
          : [],
        inks: active
          ? [...active.querySelectorAll("path")].map((p) => getComputedStyle(p).stroke)
          : [],
        count: m.querySelector(".pt-count")?.textContent ?? null,
        width: +m.getBoundingClientRect().width.toFixed(2),
      };
    });
    console.log(`P15|n=${n}|${JSON.stringify(dom)}`);
    await page.screenshot({
      path: `${OUT}/c2-390-light-n${n}.png`,
      clip: { x: 0, y: 0, width: 260, height: 50 },
    });
  }
  await ctx.close();
});

test("P16 the dark crop, settled", async ({ browser }, info) => {
  if (info.project.name !== "chromium") test.skip();
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  await page.goto("./?size=3&difficulty=EASY&wire=local&s=p16");
  await settled(page);
  await page.evaluate(() => {
    const ch = new BroadcastChannel("board:p16");
    for (let i = 0; i < 2; i++) ch.postMessage({ kind: "hi", data: {}, from: `probe-peer-${i}` });
  });
  await page.waitForTimeout(1500);
  const dom = await page.evaluate(() => {
    const m = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    ) as HTMLElement;
    const g = m.querySelector(".pt-pose.is-active");
    return {
      label: m.getAttribute("aria-label"),
      offsets: [...(g?.querySelectorAll("path") ?? [])].map((p) => p.getAttribute("stroke-dashoffset")),
      inks: [...(g?.querySelectorAll("path") ?? [])].map((p) => getComputedStyle(p).stroke),
    };
  });
  console.log(`P16|dark|${JSON.stringify(dom)}`);
  await page.screenshot({
    path: `${OUT}/c2-1280-dark-n3.png`,
    clip: { x: 0, y: 0, width: 260, height: 60 },
  });
  await ctx.close();
});

test("P17 the players well, drawn", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto("./?size=3&difficulty=EASY&wire=local&s=p17");
  await settled(page);
  await page.evaluate(() => {
    const ch = new BroadcastChannel("board:p17");
    for (let i = 0; i < 3; i++) ch.postMessage({ kind: "hi", data: {}, from: `probe-peer-${i}` });
  });
  await page.waitForTimeout(500);
  const out = await page.evaluate(() => {
    const roster = document.querySelector(".players-roster") as HTMLElement;
    const well = roster.closest(".tray-well") as HTMLElement;
    const clipped = +well.getBoundingClientRect().height.toFixed(2);
    roster.classList.remove("sr-only");
    const drawn = +well.getBoundingClientRect().height.toFixed(2);
    roster.classList.add("sr-only");
    return { clipped, withRosterDrawn: drawn, rows: roster.querySelectorAll("li").length };
  });
  fs.writeFileSync(`${OUT}/p17-well-${info.project.name}.json`, JSON.stringify(out, null, 1));
  console.log(`P17|well|${info.project.name}|${JSON.stringify(out)}`);
  await ctx.close();
});
