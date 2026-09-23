/**
 * NOTE-ERASE pass 6 · the rows re-run once (charter 12, 13, 5, 8): PRM's leave and the repeat's
 * hole; the solve act; the board voice's hole on a repeated deal; the parked record's rect vs
 * paint (F-ERASE-2, one arm); the hook's PRICE (a settle still tweening when its line is rubbed
 * out) with the hook's ablation in the same run; and the `2lh` seating built IN PAGE on the tree
 * dist (the reserve at one line vs two, and the block's own `lh`), five cells. BUILT dist, one payload.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import { bank, say, boardReady, armHint, refuseAGiven, watchLeave, leaveResult, PROTO, CONTROL, PAYLOAD } from "./lib";

test("PRM's leave, and the repeat's hole", async ({ browser }, info) => {
  const rows: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD };
  for (const rm of ["reduce", "no-preference"] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: rm });
    const page = await ctx.newPage();
    await boardReady(page, PROTO);
    await refuseAGiven(page, "5");
    await page.waitForTimeout(600);
    await watchLeave(page, false);
    await page.keyboard.press("5");
    rows[rm] = await leaveResult(page, true);
    await ctx.close();
  }
  bank(`prm-hole-${info.project.name}.json`, rows);
  say("prm", rows);
  const r = rows.reduce as { animationDuration: string };
  expect(r.animationDuration.split(",").every((d) => parseFloat(d) === 0)).toBe(true);
});

test("solve: an armed hint note meets Solve", async ({ browser }, info) => {
  const rows: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD };
  for (const rm of ["reduce", "no-preference"] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: rm });
    const page = await ctx.newPage();
    await boardReady(page, PROTO);
    await armHint(page, 0);
    const armed = await page.evaluate(() => ({
      text: (document.querySelector(".margin-note")?.textContent || "").trim(),
      age: document.querySelector(".margin-note-ink")?.getAttribute("data-note-age") ?? null,
    }));
    await watchLeave(page, false);
    await page.locator('.controls-card button[aria-label="Solve puzzle"]').click();
    const leave = await leaveResult(page, true);
    await expect.poll(() => page.evaluate(() => (document.querySelector(".margin-note")?.textContent || "").trim()), { timeout: 15000 }).toContain("solved it");
    await page.waitForTimeout(1500);
    const after = await page.evaluate(() => ({
      text: (document.querySelector(".margin-note")?.textContent || "").trim(),
      tone: document.querySelector(".margin-note")?.className,
      age: document.querySelector(".margin-note-ink")?.getAttribute("data-note-age") ?? null,
    }));
    rows[rm] = { armed, leave, after };
    await ctx.close();
  }
  bank(`solve-${info.project.name}.json`, rows);
  say("solve", rows);
  expect((rows.reduce as { armed: { text: string } }).armed.text).not.toBe("");
});

test("the board voice's hole on a repeated deal", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const rows: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD };
  for (const [arm, base] of [["tree", PROTO], ["control", CONTROL]] as const) {
    await boardReady(page, base);
    const deal = async () => {
      await page.getByRole("button", { name: /deal a new board/i }).first().click({ timeout: 8000 });
      await page.waitForTimeout(150);
      await page.getByRole("button", { name: /press again to deal/i }).first().click({ timeout: 4000 }).catch(() => {});
    };
    await deal();
    await page.waitForTimeout(2600);
    const watch = page.evaluate(() => {
      const t0 = performance.now();
      const node = () => Array.from(document.querySelectorAll<HTMLElement>('[aria-live="polite"]')).filter((n) => !n.classList.contains("margin-note"))[0];
      const trail: { t: number; text: string }[] = [{ t: 0, text: (node()?.textContent || "").replace(/\s+/g, " ").trim() }];
      return new Promise<{ t: number; text: string }[]>((res) => {
        const poll = () => {
          const t = Math.round((performance.now() - t0) * 10) / 10;
          const now = (node()?.textContent || "").replace(/\s+/g, " ").trim();
          if (now !== trail[trail.length - 1].text) trail.push({ t, text: now });
          if (performance.now() - t0 > 4200) res(trail);
          else requestAnimationFrame(poll);
        };
        requestAnimationFrame(poll);
      });
    });
    await deal();
    const trail = await watch;
    const i = trail.findIndex((r, k) => k > 0 && r.text === "");
    rows[arm] = { trail, shape: trail.map((r) => (r.text === "" ? "''" : "X")).join(","), holeMs: i >= 0 && i + 1 < trail.length ? Math.round((trail[i + 1].t - trail[i].t) * 10) / 10 : null };
  }
  bank(`voice-hole-${info.project.name}.json`, rows);
  say("voice", rows);
});

test("park: the record's rect vs its paint (F-ERASE-2, one arm)", async ({ page }, info) => {
  await boardReady(page, PROTO);
  await armHint(page, 0);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press("g");
  let prev = "";
  for (let i = 0; i < 40; i++) {
    const r = await page.evaluate(() => JSON.stringify(document.querySelector(".margin-note-ink")?.getBoundingClientRect()));
    if (r === prev && i > 5) break;
    prev = r;
    await page.waitForTimeout(100);
  }
  const parked = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    const r = ink.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    const clippers: string[] = [];
    for (let n: HTMLElement | null = ink.parentElement; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.overflow !== "visible" || cs.clipPath !== "none") {
        const nr = n.getBoundingClientRect();
        clippers.push(`${n.tagName.toLowerCase()}.${(n.getAttribute("class") || "").split(/\s+/)[0]} overflow=${cs.overflow} bottom=${Math.round(nr.bottom * 100) / 100} containsNote=${nr.top <= r.top && nr.bottom >= r.bottom}`);
      }
    }
    return {
      text: (document.querySelector(".margin-note")?.textContent || "").trim(),
      box: { x: Math.round(r.x * 100) / 100, y: Math.round(r.y * 100) / 100, w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100 },
      hit: hit ? `${hit.tagName.toLowerCase()}.${(hit.getAttribute("class") || "").split(/\s+/)[0]}` : null,
      clippers,
    };
  });
  let bytes = null;
  if (parked && parked.box.w > 0) {
    const clip = { x: Math.floor(parked.box.x), y: Math.floor(parked.box.y), width: Math.ceil(parked.box.w), height: Math.ceil(parked.box.h) };
    const buf = await page.screenshot({ clip });
    const { data, info: im } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const counts = new Map<string, number>();
    for (let i = 0; i < data.length; i += im.channels) {
      const k = `${data[i]},${data[i + 1]},${data[i + 2]}`;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    bytes = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${v}px rgb(${k})`);
  }
  const row = { engine: info.project.name, payload: PAYLOAD, parked, bytes };
  bank(`park-${info.project.name}.json`, row);
  say("park", row);
  expect(parked).not.toBeNull();
});

// THE PRICE (charter 13): the settle's dusk colour step is mid-tween when the line is rubbed out.
// Every frame's computed colour is sampled from arrival to removal; the hook arm and the hook's
// ABLATION (the inline write stripped before Vue reads the clock) run in the same test.
async function priceArm(page: Page, ablate: boolean, delayMs: number) {
  await boardReady(page, PROTO);
  await armHint(page, 0);
  await page.evaluate(() => {
    const frames: { t: number; color: string; age: string | null; leaving: boolean; clip: string; op: string }[] = [];
    (window as unknown as { __frames: typeof frames }).__frames = frames;
    const t0 = performance.now();
    const tick = () => {
      const el = document.querySelector<HTMLElement>(".margin-note-ink");
      if (el) {
        const cs = getComputedStyle(el);
        frames.push({ t: Math.round((performance.now() - t0) * 10) / 10, color: cs.color, age: el.getAttribute("data-note-age"), leaving: el.classList.contains("note-leave-active"), clip: cs.clipPath, op: cs.opacity });
      } else frames.push({ t: Math.round((performance.now() - t0) * 10) / 10, color: "", age: null, leaving: false, clip: "", op: "" });
      if (performance.now() - t0 < 4000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.waitForFunction(() => document.querySelector(".margin-note-ink")?.getAttribute("data-note-age") === "settled", undefined, { polling: "raf", timeout: 5000 });
  await page.waitForTimeout(delayMs);
  await watchLeave(page, ablate);
  await page.keyboard.press("h");
  await page.waitForTimeout(1200);
  const frames = await page.evaluate(() => (window as unknown as { __frames: { t: number; color: string; age: string | null; leaving: boolean; clip: string; op: string }[] }).__frames);
  const iS = frames.findIndex((f) => f.age === "settled");
  const iL = frames.findIndex((f) => f.leaving);
  const iGone = frames.findIndex((f, k) => k > iL && iL >= 0 && f.color === "");
  return {
    settledAtMs: frames[iS]?.t, leaveAtMs: frames[iL]?.t, intoTweenMs: iL >= 0 && iS >= 0 ? Math.round((frames[iL].t - frames[iS].t) * 10) / 10 : null,
    fresh: frames[Math.max(0, iS - 1)]?.color, lastBeforeLeave: frames[iL - 1], leaveFrames: frames.slice(iL, iL + 4), afterGone: frames[iGone]?.t,
    settledEnd: null as string | null,
  };
}
test("price: a settle still tweening when its line is rubbed out", async ({ page }, info) => {
  test.setTimeout(200000);
  const rows: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD };
  for (const [k, ablate] of [["hook", false], ["ABLATED", true]] as const) rows[k] = await priceArm(page, ablate, 90);
  // The settled rung's END colour, read at rest on the same payload (the value frame 1 snaps to).
  await boardReady(page, PROTO);
  await armHint(page, 0);
  await page.waitForTimeout(2000);
  rows.settledEnd = await page.evaluate(() => getComputedStyle(document.querySelector(".margin-note-ink")!).color);
  bank(`price-${info.project.name}.json`, rows);
  say("price", rows);
});

// THE 2lh SEATING, built in page on the tree dist (charter 8). Arm A: the reserve as shipped (one
// line, derived). Arm B: two lines of the SAME derivation. Arm C: `min-height: 2lh` (ACC-SIX's
// form) — which resolves against the BLOCK's own line-height, not the voice's.
const SEAT_CELLS = [
  { label: "390x844-coarse", w: 390, h: 844, touch: true },
  { label: "393x699-coarse", w: 393, h: 699, touch: true },
  { label: "1280x800-fine", w: 1280, h: 800, touch: false },
  { label: "844x390-coarse", w: 844, h: 390, touch: true },
  { label: "812x375-coarse", w: 812, h: 375, touch: true },
];
const ARMS: Record<string, string> = {
  A: "",
  B: ".margin-note-block{min-height:calc(2 * var(--type-body) * var(--type-leading-caption)) !important}",
  C: ".margin-note-block{min-height:2lh !important}",
};
test("seating: one line vs two lines vs 2lh, five cells", async ({ browser }, info) => {
  test.setTimeout(300000);
  const rows: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD, tree: "index-B5bclKNTuHnj.js" };
  for (const c of SEAT_CELLS) {
    const cell: Record<string, unknown> = {};
    for (const [arm, css] of Object.entries(ARMS)) {
      const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, hasTouch: c.touch });
      const page = await ctx.newPage();
      await boardReady(page, PROTO);
      if (css) await page.addStyleTag({ content: css });
      await page.waitForTimeout(400);
      cell[arm] = await page.evaluate(() => {
        const r2 = (x: number) => Math.round(x * 100) / 100;
        const y = (s: string) => { const e = document.querySelector(s); return e ? r2(e.getBoundingClientRect().top) : null; };
        const blk = document.querySelector<HTMLElement>(".margin-note-block")!;
        const probe = document.createElement("div");
        probe.style.cssText = "position:absolute;visibility:hidden;height:1lh";
        blk.appendChild(probe);
        const lhBlock = probe.getBoundingClientRect().height;
        probe.remove();
        const cs = getComputedStyle(document.documentElement);
        return {
          coarse: matchMedia("(pointer: coarse)").matches,
          strip: r2(blk.getBoundingClientRect().height),
          minH: getComputedStyle(blk).minHeight,
          blockLineHeight: getComputedStyle(blk).lineHeight, blockFont: getComputedStyle(blk).fontSize, lhBlock: r2(lhBlock),
          voiceLine: r2(parseFloat(getComputedStyle(document.querySelector(".margin-note")!).lineHeight)),
          typeBody: cs.getPropertyValue("--type-body").trim(), leading: cs.getPropertyValue("--type-leading-caption").trim(),
          board: y(".board-wrapper"), controls: y(".play-controls") ?? y(".controls-card"), tab: y(".drawer-tab"), voice: y(".board-voice"), masthead: y(".masthead"),
          docH: document.documentElement.scrollHeight,
        };
      });
      await ctx.close();
    }
    rows[c.label] = cell;
  }
  bank(`seat-${info.project.name}.json`, rows);
  say("seat", rows);
});
