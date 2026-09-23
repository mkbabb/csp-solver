// CTRL-RULE pass-6 CRITIC probes (rulecrit6). Scratch; moved out before return.
import { test, expect, type Page } from "@playwright/test";

const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const ARM = () => (test.info().project.use.baseURL?.includes("4241") ? "control" : "lane");
const out = (tag: string, o: unknown) => console.log(`[RC6] ${tag} ${test.info().project.name} ${ARM()} ${JSON.stringify(o)}`);

async function load(page: Page) {
  await page.goto(`./?size=3&board=${BOARD}`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 20000 }).toBeGreaterThan(0);
}
async function settled(page: Page, sel = ".drawer-case") {
  let last = NaN;
  await expect
    .poll(async () => {
      const t = await page.evaluate((s) => { const r = document.querySelector(s)?.getBoundingClientRect(); return r ? r.top + r.left * 1000 + r.height * 7 : -1; }, sel);
      const same = Math.abs(t - last) < 0.01; last = t; return same;
    }, { intervals: [120] })
    .toBe(true);
}
async function openCard(page: Page, touch: boolean) {
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    if (touch) await page.locator(".drawer-tab").tap(); else await page.locator(".drawer-tab").click();
  }
  await settled(page);
}

// ── A · the coarse rail: π on the five surfaces, and the ruler gate under two width plants ──
const RAIL = () => {
  const cas = document.querySelector(".drawer-case")!.getBoundingClientRect();
  const foot = getComputedStyle(document.getElementById("card-foot")!);
  const verbs = [...document.querySelectorAll<HTMLElement>(".action-verbs > .icon-btn")].map((b) => {
    const cs = getComputedStyle(b);
    return { w: b.getBoundingClientRect().width, gutter: b.querySelector("svg")!.getBoundingClientRect().width + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) };
  });
  const card = document.querySelector(".controls-card") as HTMLElement;
  return { caseW: +cas.width.toFixed(2), ruler: +(verbs.reduce((s, v) => s + v.gutter, 0) + parseFloat(foot.paddingLeft) + parseFloat(foot.paddingRight)).toFixed(2), faceAdds: +Math.max(...verbs.map((v) => v.w - v.gutter)).toFixed(2), n: verbs.length, overflow: card.scrollWidth - card.clientWidth };
};
const PI = () => {
  const b = (s: string) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [+r.left.toFixed(2), +r.top.toFixed(2), +r.width.toFixed(2)]; };
  return { masthead: b(".masthead"), logo: b("svg.handwritten-logo"), tab: b(".drawer-tab"), host: b(".board-peek-host"), cell0: b(".sudoku-cell"), case: b(".drawer-case") };
};
test.describe("A rail", () => {
  test.use({ viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: true });
  test("A rail pi + ruler plants", async ({ page }) => {
    await load(page);
    await openCard(page, true);
    out("A.coarse", await page.evaluate(() => matchMedia("(pointer: coarse)").matches));
    out("A.pi", await page.evaluate(PI));
    if (ARM() === "control") return;
    const gate = (a: ReturnType<typeof RAIL>) => a.n === 4 && a.faceAdds <= 0.5 && Math.abs(a.caseW - a.ruler) < 0.5 && a.overflow === 0;
    const r0 = await page.evaluate(RAIL);
    out("A.rail.shipped", { ...r0, gateGreen: gate(r0) });
    for (const [name, css] of [
      ["P1a verb padding 0.9rem", ".action-verbs > .icon-btn { padding-inline: 0.9rem !important; }"],
      ["P1b foot padding 1.4rem", "#card-foot { padding-inline: 1.4rem !important; }"],
      ["P1c verb gap 1rem", ".action-verbs { column-gap: 1rem !important; gap: 1rem !important; }"],
    ] as const) {
      const tag = await page.addStyleTag({ content: css });
      await settled(page);
      const r = await page.evaluate(RAIL);
      out(`A.rail.${name}`, { ...r, gateGreen: gate(r), pi: await page.evaluate(PI) });
      await tag.evaluate((n) => (n as Element).remove());
      await settled(page);
    }
  });
});

// ── B · the seam: case top vs the wordmark ink, the tab, and the publisher's write count ──
for (const cell of [
  { n: "390x844 fine", v: { width: 390, height: 844 }, t: false },
  { n: "360x800 fine", v: { width: 360, height: 800 }, t: false },
  { n: "390x800 fine", v: { width: 390, height: 800 }, t: false },
  { n: "390x844 coarse", v: { width: 390, height: 844 }, t: true },
  { n: "430x932 coarse", v: { width: 430, height: 932 }, t: true },
  { n: "360x800 coarse", v: { width: 360, height: 800 }, t: true },
  { n: "768x1024 coarse", v: { width: 768, height: 1024 }, t: true },
  { n: "820x1180 coarse", v: { width: 820, height: 1180 }, t: true },
  { n: "600x960 fine", v: { width: 600, height: 960 }, t: false },
]) {
  test.describe(`B seam ${cell.n}`, () => {
    test.use({ viewport: cell.v, hasTouch: cell.t, isMobile: cell.t });
    test(`B seam ${cell.n}`, async ({ page }) => {
      await page.addInitScript(() => {
        (window as any).__mf = [] as string[];
        new MutationObserver(() => {
          const v = document.documentElement.style.getPropertyValue("--masthead-foot");
          const a = (window as any).__mf as string[];
          if (v && a[a.length - 1] !== v) a.push(v);
        }).observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
      });
      await load(page);
      const before = await page.evaluate(() => ((window as any).__mf as string[]).length);
      await openCard(page, cell.t);
      const r = await page.evaluate(() => {
        const ink = document.querySelector("svg.handwritten-logo")!.getBoundingClientRect().bottom;
        const cas = document.querySelector(".drawer-case")!.getBoundingClientRect();
        const tab = document.querySelector(".drawer-tab")?.getBoundingClientRect();
        const card = document.querySelector(".controls-card") as HTMLElement;
        return { air: +(cas.top - ink).toFixed(2), caseTop: +cas.top.toFixed(2), caseH: +cas.height.toFixed(2), tabTop: tab ? +tab.top.toFixed(2) : null, cardClientH: card.clientHeight, mf: (window as any).__mf, sheetChrome: getComputedStyle(document.querySelector(".drawer-case")!).getPropertyValue("--sheet-chrome") };
      });
      // a page scroll: does the published foot follow the ink?
      await page.evaluate(() => window.scrollTo(0, 120));
      await page.waitForFunction(() => true);
      const s = await page.evaluate(() => ({ scrollY: window.scrollY, ink: +document.querySelector("svg.handwritten-logo")!.getBoundingClientRect().bottom.toFixed(2), mf: document.documentElement.style.getPropertyValue("--masthead-foot") }));
      out(`B.${cell.n}`, { ...r, writesAtLoad: before, afterScroll: s });
    });
  });
}

// ── C · the M18 paint row, verbatim statistic + the §2.4 per-column core@50, shipped vs the 55% revert ──
const PAINT = async (page: Page, clip: { x: number; y: number; width: number; height: number }, hideCss: string) => {
  const on = (await page.screenshot({ clip })).toString("base64");
  const hide = await page.addStyleTag({ content: hideCss });
  const off = (await page.screenshot({ clip })).toString("base64");
  await hide.evaluate((n) => (n as Element).remove());
  return page.evaluate(async ({ on, off }) => {
    const px = async (b64: string) => { const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob()); const c = new OffscreenCanvas(bmp.width, bmp.height); const g = c.getContext("2d")!; g.drawImage(bmp, 0, 0); return g.getImageData(0, 0, bmp.width, bmp.height); };
    const [a, b] = [await px(on), await px(off)];
    const { width: w, height: h } = a;
    const lin = (c: number) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    const L = (d: Uint8ClampedArray, o: number) => 0.2126 * lin(d[o]) + 0.7152 * lin(d[o + 1]) + 0.0722 * lin(d[o + 2]);
    const moved: { move: number; r: number }[] = [];
    let cols = 0;
    const x0 = Math.floor(w * 0.05), x1 = Math.ceil(w * 0.95);
    const colCore: number[] = []; // §2.4: per column, pixels whose move ≥ 50% of that column's max move
    for (let x = x0; x < x1; x++) {
      let hit = false; const col: { move: number; r: number }[] = [];
      for (let y = 0; y < h; y++) {
        const o = (y * w + x) * 4;
        const d = Math.max(Math.abs(a.data[o] - b.data[o]), Math.abs(a.data[o + 1] - b.data[o + 1]), Math.abs(a.data[o + 2] - b.data[o + 2]));
        if (d <= 24) continue;
        hit = true;
        const [la, lb] = [L(a.data, o), L(b.data, o)];
        const p = { move: Math.abs(la - lb), r: (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05) };
        moved.push(p); col.push(p);
      }
      if (hit) cols++;
      if (col.length) { const mx = Math.max(...col.map((p) => p.move)); for (const p of col) if (p.move >= 0.5 * mx) colCore.push(p.r); }
    }
    const moves = moved.map((p) => p.move).sort((m, n) => m - n);
    const ref = moves.length ? moves[Math.floor(0.98 * (moves.length - 1))] : 0;
    const core = moved.filter((p) => p.move >= 0.5 * ref).map((p) => p.r).sort((m, n) => m - n);
    colCore.sort((m, n) => m - n);
    return {
      coverage: +(cols / Math.max(1, x1 - x0)).toFixed(3),
      coreMedian: core.length ? +core[core.length >> 1].toFixed(3) : 1,
      coreUnder3: core.length ? +(core.filter((r) => r < 3).length / core.length).toFixed(3) : 1,
      col50Median: colCore.length ? +colCore[colCore.length >> 1].toFixed(3) : 1,
      col50Under3: colCore.length ? +(colCore.filter((r) => r < 3).length / colCore.length).toFixed(3) : 1,
      n: core.length,
    };
  }, { on, off });
};
for (const cell of [
  { n: "1280x800 fine dpr1", u: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 }, t: false },
  { n: "390x844 coarse dpr1", u: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }, t: true },
  { n: "390x844 coarse dpr2", u: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, t: true },
]) {
  test.describe(`C m18 ${cell.n}`, () => {
    test.use(cell.u);
    for (const theme of ["light", "dark"] as const) {
      test(`C m18 ${cell.n} ${theme}`, async ({ page }) => {
        if (ARM() === "control") return;
        await page.emulateMedia({ colorScheme: theme });
        await page.addInitScript((t) => { try { localStorage.setItem("sudoku-color-scheme", t); } catch { /* */ } }, theme);
        await load(page);
        await openCard(page, cell.t);
        const rule = page.locator("#card-foot svg.ruled-line");
        const box = (await rule.boundingBox())!;
        const clip = { x: box.x, y: box.y - 3, width: box.width, height: box.height + 6 };
        for (const [arm, css] of [
          ["shipped68", ""],
          ["revert55", "#card-foot svg.ruled-line path { stroke: var(--ink-press-rule) !important; }"],
          ["ink60", "#card-foot svg.ruled-line path { stroke: color-mix(in srgb, var(--color-pencil-graphite, #262626) 60%, transparent) !important; }"],
        ] as const) {
          const tag = css ? await page.addStyleTag({ content: css }) : null;
          const stroke = await page.evaluate(() => getComputedStyle(document.querySelector("#card-foot svg.ruled-line path")!).stroke);
          const p1 = await PAINT(page, clip, "#card-foot svg.ruled-line { visibility: hidden !important; }");
          const p2 = await PAINT(page, clip, "#card-foot svg.ruled-line { visibility: hidden !important; }");
          const holds = p1.coverage >= 0.9 && p1.coreMedian >= 3.0;
          out(`C.${cell.n}.${theme}.${arm}`, { stroke, gateGreen: holds, p1, p2 });
          if (tag) await tag.evaluate((n) => (n as Element).remove());
        }
      });
    }
  });
}

// ── D · the cross tap's ANSWER: after the re-target, 'yes' does the tapped verb's act ──
test.describe("D cross-tap answer", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test("D re-targeted question answers the right verb", async ({ page }) => {
    if (ARM() === "control") return;
    await load(page);
    const fp = () => page.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].map((c) => (c.querySelector(".glyph-svg") ? "g" : ".") + ((c.querySelector("input") as HTMLInputElement | null)?.value ?? "")).join(""));
    const blank = await page.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].findIndex((c) => !c.querySelector(".glyph-svg")));
    const input = page.locator(".board-cells input").nth(blank);
    await input.tap();
    await page.keyboard.type("5");
    await expect(input).toHaveValue("5");
    const givens0 = await page.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getAttribute("aria-label")).join("|"));
    await openCard(page, true);
    const deal = page.locator(".mobile-control-panel").getByRole("button", { name: "Deal a new board" });
    const clear = page.locator("#controls-drawer").getByRole("button", { name: "Clear the board" });
    const standing = () => page.locator(".confirm-ribbon").evaluateAll((rs) => rs.map((r) => r.getAttribute("aria-label")));
    await deal.tap();
    await expect.poll(standing).toEqual(["start a new board?"]);
    await clear.tap();
    await expect.poll(standing).toEqual(["clear the board?"]);
    await page.locator(".confirm-ribbon .confirm-go").tap();
    await expect.poll(standing).toEqual([]);
    await expect.poll(() => input.inputValue()).toBe("");
    const givens1 = await page.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getAttribute("aria-label")).join("|"));
    out("D.clearAnswered", { cleared: (await input.inputValue()) === "", sameBoard: givens0 === givens1, labelSample: givens0.slice(0, 60) });
    expect(givens1).toBe(givens0);
  });
});
