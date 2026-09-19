/**
 * PLR-PLACE · PROBE 6 — PERSISTENCE, PRM, AND THE OPT-OUT.
 *
 * Three questions the family's third kill condition turns on — "a true but private fact on the
 * most persistent surface":
 *
 *   PERSISTENCE  is the head's left corner actually the most persistent surface? Measured by
 *                walking into the gallery and asking whether the @mbabb mark is still painted,
 *                desk and phone.
 *   PRM          under `prefers-reduced-motion: reduce`, a dot must STEP and never glide. The
 *                prototype declares no transition, so this reads the computed value rather
 *                than asserting an intention.
 *   OPT-OUT      can a peer stop broadcasting their place WITHOUT a new message kind? Driven:
 *                a peer that sends only `cur {p: null}`, and a peer that sends no `cur` at all.
 *                Both are already in the grammar; this measures what the room then holds.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const HOME = process.env.PLC_HOME || join(__dirname, "..");
const PROTO = join(HOME, "proto", "mount-miniature.js");
const OUT = join(HOME, "logs");
const say = (k: string, v: unknown) =>
  console.log(`PLC|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
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

const headRead = (p: Page) =>
  p.evaluate(() => {
    const read = (sel: string) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        painted: r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none",
        x: +r.x.toFixed(1),
        y: +r.y.toFixed(1),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        display: cs.display,
      };
    };
    return {
      desk: read(".corner-left"),
      phone: read(".mobile-attribution"),
      gallery: !!document.querySelector(".game-gallery, [data-gallery], .gallery-deck"),
      bodyClasses: document.documentElement.className,
    };
  });

test("PERSISTENCE, PRM, OPT-OUT", async ({ browser }, info) => {
  const out: Record<string, unknown> = {};

  // ── PERSISTENCE ──────────────────────────────────────────────────────────────────────
  for (const [label, w, h] of [
    ["desk-1280", 1280, 800],
    ["phone-390", 390, 844],
  ] as Array<[string, number, number]>) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      ...(w < 500 ? { deviceScaleFactor: 3, isMobile: true, hasTouch: true } : {}),
    });
    const p = await ctx.newPage();
    await p.goto(SOLO);
    await settled(p);
    const board = await headRead(p);
    // into the gallery, by the product's own entry: `g`, or the wordmark (App.vue's §BEAT 0).
    await p.locator("body").click({ position: { x: 5, y: 500 } }).catch(() => {});
    await p.keyboard.press("g");
    await p.waitForTimeout(1600);
    const gallery = await headRead(p);
    out[`persistence.${label}`] = { board, gallery };
    say(`persistence.${label}`, { board, gallery });
    await ctx.close();
  }

  // ── PRM ──────────────────────────────────────────────────────────────────────────────
  const prmCtx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const prm = await prmCtx.newPage();
  await prm.goto(SOLO);
  await settled(prm);
  await prm.addScriptTag({ path: PROTO });
  const prmRead = await prm.evaluate(async () => {
    const host = document.createElement("div");
    host.id = "plc-prm";
    host.style.cssText = "position:fixed;right:0;bottom:0;z-index:9999;";
    document.body.appendChild(host);
    await (
      window as unknown as { __PLC: { mount: (o: unknown) => Promise<HTMLElement> } }
    ).__PLC.mount({
      size: 24,
      boardSize: 9,
      strokeUnits: 12,
      dotUnits: (1000 / 9) * 0.32,
      peers: [{ index: 1, pos: 40 }],
      host,
    });
    const dot = host.querySelector("circle") as SVGCircleElement;
    const cs = getComputedStyle(dot);
    return {
      prm: matchMedia("(prefers-reduced-motion: reduce)").matches,
      transition: cs.transitionProperty,
      transitionDuration: cs.transitionDuration,
      animation: cs.animationName,
      willChange: cs.willChange,
      filter: cs.filter,
    };
  });
  say("prm", prmRead);
  out.prm = prmRead;
  await prmCtx.close();

  // ── OPT-OUT, inside the grammar ──────────────────────────────────────────────────────
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const room = new URL(link).searchParams.get("s")!;
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);

  await a.evaluate((r) => {
    const w = window as unknown as { __st: unknown; __ch: BroadcastChannel };
    w.__st = null;
    const ch = new BroadcastChannel(`board:${r}`);
    w.__ch = ch;
    ch.onmessage = (ev: MessageEvent) => {
      if (ev.data?.kind === "st") w.__st = ev.data.data;
    };
  }, room);
  await b.evaluate(() => {
    const ch = new BroadcastChannel(
      `board:${new URL(location.href).searchParams.get("s")}`,
    );
    ch.postMessage({ kind: "hi", data: {}, from: "p-probe111111" });
    ch.close();
  });
  await a.waitForTimeout(600);

  const optOut = await a.evaluate(async () => {
    const w = window as unknown as {
      __st: { e: number; ea: string } | null;
      __ch: BroadcastChannel;
    };
    if (!w.__st) return { err: "no st" };
    const { e, ea } = w.__st;
    // A: a peer who says "looked away" and never says anything else — the opt-out, in the
    //    wire's own word, with no new kind.
    w.__ch.postMessage({ kind: "hi", data: { ack: true }, from: "p-quiet00000a" });
    w.__ch.postMessage({ kind: "cur", data: { p: null, e, ea }, from: "p-quiet00000a" });
    // B: a peer who sends no `cur` at all — present, placeless.
    w.__ch.postMessage({ kind: "hi", data: { ack: true }, from: "p-silent0000b" });
    // C: an ordinary peer, for the control.
    w.__ch.postMessage({ kind: "hi", data: { ack: true }, from: "p-normal0000c" });
    w.__ch.postMessage({ kind: "cur", data: { p: 33, e, ea }, from: "p-normal0000c" });
    await new Promise((r) => setTimeout(r, 500));
    const m = (await import(
      /* @vite-ignore */ "/src/games/shared/useSession.ts"
    )) as {
      peerCursors: { value: Record<string, number | null> };
      session: { players: { value: Array<{ slug: string; self: boolean; id: string }> } };
    };
    return {
      cursors: m.peerCursors.value,
      rosterIds: m.session.players.value.map((p) => p.id),
      quietInRoster: m.session.players.value.some((p) => p.id === "p-quiet00000a"),
      silentInRoster: m.session.players.value.some((p) => p.id === "p-silent0000b"),
      quietHasPlace: m.peerCursors.value["p-quiet00000a"] !== null &&
        m.peerCursors.value["p-quiet00000a"] !== undefined,
      silentHasPlace: "p-silent0000b" in m.peerCursors.value,
    };
  });
  say("optOut", optOut);
  out.optOut = optOut;

  // What the BOARD already shows for the same fact — the peer-cursor ring (gameCell.css:225-241)
  const ring = await a.evaluate(() => {
    const el = document.querySelector(".peer-cursor, [class*='peer-cursor']") as Element | null;
    if (!el) return { mounted: false };
    const cs = getComputedStyle(el);
    return {
      mounted: true,
      strokeOpacity: cs.strokeOpacity,
      fillOpacity: cs.fillOpacity,
      strokeWidth: cs.strokeWidth,
    };
  });
  say("boardRing", ring);
  out.boardRing = ring;

  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, `voice-${info.project.name}.json`), JSON.stringify(out, null, 1));
  await ctx.close();
});
