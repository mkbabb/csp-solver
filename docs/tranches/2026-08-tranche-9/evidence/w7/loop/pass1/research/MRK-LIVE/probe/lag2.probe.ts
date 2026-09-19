/**
 * T9-W7 pass 1 · MRK-LIVE §6 — THE LAG, MEASURED HONESTLY.
 *
 * r1's 732px reading was an ARTIFACT, and the artifact is itself a finding: clicking the dock
 * tongue moves it between berths (`DrawerTab` — four berths, T9-W2 §2.7), a berth change is a
 * DOM move, a DOM move is an unmount, and the tongue LOSES FOCUS. Both mountings then hide
 * their ring and a hidden ring's rect is (0,0,0,0) — 732px from the tongue's centre. So that
 * arm measures focus loss, not lag.
 *
 * This file measures the three things that really move a focused control:
 *   A  SCROLL — the controls card scrolls under a focused button. Nothing fires a focus event.
 *   B  THE SHEET'S GLIDE — focus a button INSIDE the dock, then close the dock. Focus survives
 *      (the button is not re-parented), and the sheet carries it ~520ms on a transform.
 *   C  A VIEWPORT RESIZE — the same control, a new rect, no focus event.
 * And it prices the cure: `follow: "raf"` is a permanent rAF subscriber, which is exactly the
 * shape `boilBeat.ts` exists to refuse ("45 sparse writers ≈ one continuous one").
 */
import { test, expect, type Page } from "@playwright/test";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
const RING = readFileSync(join(HERE, "..", "proto", "focus-ring.js"), "utf8");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1400);
}

async function installRing(page: Page, opts: Record<string, unknown>) {
  await page.evaluate(RING);
  await page.evaluate(() => (window as any).__houseRing.init());
  return page.evaluate((o) => (window as any).__houseRing.install(o), opts);
}

const TRACK = `async (sel, ms) => {
  const el = document.querySelector(sel);
  const out = [];
  let lostFocus = false;
  const t0 = performance.now();
  while (performance.now() - t0 < ms) {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    if (document.activeElement !== el) lostFocus = true;
    const svg = document.querySelector(".house-focus-ring");
    if (!svg || !el) continue;
    if (svg.style.display === "none") { out.push({ t: Math.round(performance.now()-t0), hidden: true, d: null }); continue; }
    const a = svg.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    out.push({ t: Math.round(performance.now()-t0), hidden: false,
      d: Math.round(Math.hypot(a.left + a.width/2 - (b.left + b.width/2), a.top + a.height/2 - (b.top + b.height/2)) * 100) / 100 });
  }
  const live = out.filter((o) => !o.hidden).map((o) => o.d);
  return {
    samples: out.length, hiddenSamples: out.filter((o) => o.hidden).length, lostFocus,
    maxOffsetPx: live.length ? Math.max(...live) : null,
    meanOffsetPx: live.length ? Math.round((live.reduce((a,b)=>a+b,0)/live.length)*100)/100 : null,
    lastOffsetPx: live.length ? live[live.length-1] : null,
    over2pxSamples: live.filter((d) => d > 2).length,
  };
}`;

for (const follow of ["focusin", "raf", "events"] as const) {
  test(`MRK-LIVE-r1b THE LAG (follow=${follow}) — scroll, sheet glide, resize`, async ({
    page,
    browserName,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });

    // ── A. SCROLL, 1280×800, a focused control in the scrolling controls card.
    await page.setViewportSize({ width: 1280, height: 800 });
    await boardReady(page);
    await installRing(page, { mode: "singleton", follow });
    await page.evaluate(() =>
      document.querySelector<HTMLElement>(".ctrl-btn")?.focus(),
    );
    await page.waitForTimeout(300);
    const scrollP = page.evaluate(({ fn, a }) => (eval(fn) as any)(...a), {
      fn: TRACK,
      a: [".ctrl-btn", 900],
    });
    await page.evaluate(() => {
      const sc =
        document.querySelector(".controls-card") ??
        document.querySelector(".control-rail") ??
        document.scrollingElement!;
      (sc as HTMLElement).scrollTop = 240;
    });
    const scroll = await scrollP;

    // ── B. THE SHEET'S GLIDE, 393×699. Open the dock, focus a button INSIDE it, close it.
    await page.setViewportSize({ width: 393, height: 699 });
    await boardReady(page);
    await installRing(page, { mode: "singleton", follow });
    await page.evaluate(() =>
      document.querySelector<HTMLElement>(".drawer-tab")?.click(),
    );
    await page.waitForTimeout(900); // the sheet SLIDES: settle ~700ms
    const inDock = await page.evaluate(() => {
      const b = document.querySelector<HTMLElement>(".ctrl-btn");
      b?.focus();
      return {
        focused: document.activeElement?.className?.toString().slice(0, 40) ?? null,
        rect: b?.getBoundingClientRect().top ?? null,
      };
    });
    await page.waitForTimeout(300);
    const glideP = page.evaluate(({ fn, a }) => (eval(fn) as any)(...a), {
      fn: TRACK,
      a: [".ctrl-btn", 1400],
    });
    await page.evaluate(() =>
      document.querySelector<HTMLElement>(".drawer-tab")?.click(),
    );
    const glide = await glideP;

    // ── C. RESIZE with a control focused.
    await page.setViewportSize({ width: 1280, height: 800 });
    await boardReady(page);
    await installRing(page, { mode: "singleton", follow });
    await page.evaluate(() =>
      document.querySelector<HTMLElement>(".ctrl-btn")?.focus(),
    );
    await page.waitForTimeout(300);
    const resizeP = page.evaluate(({ fn, a }) => (eval(fn) as any)(...a), {
      fn: TRACK,
      a: [".ctrl-btn", 900],
    });
    await page.setViewportSize({ width: 1024, height: 800 });
    const resize = await resizeP;

    // ── THE PRICE of follow:"raf": a permanent rAF chain while anything is focused.
    const rafCost = await page.evaluate(async () => {
      const t0 = performance.now();
      const d: number[] = [];
      let last = t0;
      await new Promise<void>((res) => {
        const tick = () => {
          const t = performance.now();
          d.push(t - last);
          last = t;
          if (t - t0 < 900) requestAnimationFrame(tick);
          else res();
        };
        requestAnimationFrame(tick);
      });
      const s = [...d].sort((a, b) => a - b);
      return {
        frames: d.length,
        medianMs: Math.round(s[Math.floor(s.length / 2)] * 100) / 100,
        maxMs: Math.round(Math.max(...d) * 100) / 100,
        over33: d.filter((x) => x > 33).length,
        ringPositions: (window as any).__houseRing.stats().positions,
      };
    });

    const out = { engine: browserName, follow, scroll, inDock, glide, resize, rafCost };
    bank(`lag2-${follow}-${browserName}.json`, out);
    console.log(`LAG2[${follow}] ` + JSON.stringify(out, null, 2));
    expect(out).toBeTruthy();
  });
}

test("MRK-LIVE-r6 THE SPECS UNDER THE OVERLAY — one ring owner, zero unnamed images", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.setViewportSize({ width: 1280, height: 800 });

  // §3.7 — with the house ring up, the deck must still publish exactly ONE ring owner and
  // `.gallery-viewport` must still compute `outline-style: none`.
  await page.goto("./?view=gallery&size=3&difficulty=EASY");
  await page.waitForSelector(".game-gallery", { timeout: 30000 });
  await page.waitForSelector("#gallery-card-0 .boil-pose", { timeout: 30000 });
  await installRing(page, { mode: "singleton", follow: "raf" });
  await page.evaluate(() => (window as any).__houseRing.suppressIncumbents());
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".gallery-viewport")?.focus(),
  );
  await page.keyboard.press("Home");
  await page.waitForTimeout(700);
  const deck = await page.evaluate(() => {
    const vp = document.querySelector<HTMLElement>(".gallery-viewport")!;
    const owners: string[] = [];
    if (getComputedStyle(vp).outlineStyle !== "none") owners.push("the scrollport");
    for (const c of Array.from(document.querySelectorAll<HTMLElement>(".game-card")))
      if (getComputedStyle(c).outlineStyle !== "none") owners.push(c.id);
    const rings = document.querySelectorAll(".house-focus-ring");
    const svg = rings[0] as SVGElement | undefined;
    const r = svg?.getBoundingClientRect();
    const card = document.getElementById(vp.getAttribute("aria-activedescendant") ?? "");
    const c = card?.getBoundingClientRect();
    return {
      cssOwners: owners,
      viewportOutlineStyle: getComputedStyle(vp).outlineStyle,
      drawnRings: rings.length,
      // The singleton follows the FOCUSED element, which is the scrollport — the deck's ring
      // is published by aria-activedescendant, which carries no focus event at all.
      ringOnScrollportNotCard:
        !!r && !!c && Math.abs(r.width - vp.getBoundingClientRect().width) < 40,
      ringWidth: r ? Math.round(r.width) : null,
      viewportWidth: Math.round(vp.getBoundingClientRect().width),
      activeCardWidth: c ? Math.round(c.width) : null,
      activeDescendant: vp.getAttribute("aria-activedescendant"),
    };
  });

  // a11y 3.5 — with the living ring's three extra paths mounted, no named image node appears.
  await boardReady(page);
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs[40]?.focus();
  });
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  const PROTO = readFileSync(join(HERE, "..", "proto", "living-ring.js"), "utf8");
  await page.evaluate(PROTO);
  await page.evaluate(() => (window as any).__mrkLive.init());
  await page.evaluate(() => (window as any).__mrkLive.arm({}));
  await page.evaluate(() => (window as any).__mrkLive.mountActive({}));
  await page.waitForTimeout(500);
  // a11y.spec.ts:117's own census, verbatim: `unnamed` is a difference of two role queries.
  const total = await page.getByRole("img").count();
  const named = await page.getByRole("img", { name: /\S/ }).count();
  const posePaths = await page.evaluate(() => ({
    posePaths: document.querySelectorAll(".mrk-live-pose").length,
    poseAriaHidden: Array.from(document.querySelectorAll(".mrk-live-pose")).every(
      (p) => p.closest("[aria-hidden='true']") !== null,
    ),
  }));

  const out = {
    engine: browserName,
    deck,
    imageNodesTotal: total,
    imageNodesNamed: named,
    unnamedImages: total - named,
    posePaths,
  };
  bank(`specs-overlay-${browserName}.json`, out);
  console.log("SPECSOVERLAY " + JSON.stringify(out, null, 2));
  expect(out).toBeTruthy();
});
