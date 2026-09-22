// PRM: live — probe only (PAL-WALK pass 4, deleted before return; banked under evidence/…/probe/).
// A REAL PEER on the RELAY arm: two browser CONTEXTS (BroadcastChannel cannot cross them), the
// dev server built with VITE_RELAY_URL → a local `wrangler dev` of web/relay. The ring and the
// tape are put there by the SESSION, never by the probe.
import { test, expect, type Page, type Browser, type BrowserContext } from "@playwright/test";
import { writeFileSync } from "node:fs";

const RELAY_APP = process.env.PW_RELAY_APP || "http://127.0.0.1:4247";
const OUT = process.env.PW_OUT || "/tmp";
const ARM = process.env.PW_F1_ARM || "yes";
const SOLO = `${RELAY_APP}/?size=3&difficulty=EASY`;

async function settled(page: Page): Promise<void> {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function rawOf(page: Page, png: Buffer) {
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    g.drawImage(img, 0, 0);
    return { data: Array.from(g.getImageData(0, 0, c.width, c.height).data), w: c.width, h: c.height };
  }, png.toString("base64"));
}
/** Two PNGs side by side with a 12px paper gutter — one frame, two arms. */
async function pair(page: Page, a: Buffer, b: Buffer, file: string): Promise<number> {
  const b64 = await page.evaluate(
    async ([x, y]) => {
      const load = async (s: string) => {
        const i = new Image();
        i.src = `data:image/png;base64,${s}`;
        await i.decode();
        return i;
      };
      const [p, q] = [await load(x), await load(y)];
      const c = document.createElement("canvas");
      c.width = p.naturalWidth + q.naturalWidth + 12;
      c.height = Math.max(p.naturalHeight, q.naturalHeight);
      const g = c.getContext("2d")!;
      g.fillStyle = "#808080";
      g.fillRect(0, 0, c.width, c.height);
      g.drawImage(p, 0, 0);
      g.drawImage(q, p.naturalWidth + 12, 0);
      return c.toDataURL("image/png").split(",")[1];
    },
    [a.toString("base64"), b.toString("base64")],
  );
  const buf = Buffer.from(b64, "base64");
  writeFileSync(`${OUT}/${file}`, buf);
  return buf.length;
}
const roster = (p: Page) => p.locator(".controls-card .players-roster .player-row");
const cellInput = (p: Page, i: number) => p.locator(".sudoku-cell input").nth(i);

async function invite(page: Page): Promise<string> {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled({ timeout: 30000 });
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return page.url();
}
const firstEmpty = (page: Page, after = 0): Promise<number> =>
  page.evaluate(
    (k) =>
      [...document.querySelectorAll(".sudoku-cell input")].findIndex(
        (i, n) => n >= k && !(i as HTMLInputElement).value,
      ),
    after,
  );

/** The ring on cell `pos`, photographed twice (without, with), sampled by the pass-3 `isTheRing`
 *  perpendicular scan, plus the THRESHOLD-SENSITIVITY row the LAWS ask of a painted gate. */
async function ringBytes(a: Page, pos: number, show: () => Promise<void>, hide: () => Promise<void>) {
  const box = (await a.locator(".game-cell").nth(pos).boundingBox())!;
  const clip = { x: Math.floor(box.x - 6), y: Math.floor(box.y - 6), width: Math.ceil(box.width + 12), height: Math.ceil(box.height + 12) };
  await hide();
  await expect(a.locator(".game-cell").nth(pos)).not.toHaveClass(/is-peer-cursor/, { timeout: 20000 });
  await a.waitForTimeout(400);
  const shotA = await a.screenshot({ clip });
  await show();
  await expect(a.locator(".game-cell").nth(pos)).toHaveClass(/is-peer-cursor/, { timeout: 20000 });
  await a.waitForTimeout(400); // the 180ms draw-on, finished
  const shotB = await a.screenshot({ clip });
  const A = await rawOf(a, shotA);
  const B = await rawOf(a, shotB);
  const ctx = await a.evaluate((p) => {
    const cell = document.querySelectorAll<HTMLElement>(".game-cell")[p];
    const path = cell.querySelector(".cell-ghost-path") as SVGGraphicsElement;
    const r = path.getBoundingClientRect();
    const bb = path.getBBox();
    const ps = getComputedStyle(path);
    const w = parseFloat(ps.strokeWidth);
    const ink = getComputedStyle(cell).getPropertyValue("--color-peer-cursor-ink").trim();
    // THE GROUND, off the cascade: the first ancestor that paints an opaque background.
    let ground = "", groundOf = "";
    for (let e: HTMLElement | null = cell; e; e = e.parentElement) {
      const bg = getComputedStyle(e).backgroundColor;
      const m = bg.match(/[\d.]+/g);
      if (m && (m.length < 4 || Number(m[3]) > 0.99) && !/^rgba\(0, 0, 0, 0\)$/.test(bg)) {
        ground = bg;
        groundOf = (e.id ? `#${e.id}` : "") + "." + [...e.classList].slice(0, 2).join(".");
        break;
      }
    }
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    const lay = (gr: string, css: string, al: number) => {
      g.globalAlpha = 1; g.globalCompositeOperation = "copy"; g.fillStyle = gr; g.fillRect(0, 0, 1, 1);
      g.globalCompositeOperation = "source-over"; g.globalAlpha = al; g.fillStyle = css; g.fillRect(0, 0, 1, 1);
      const d = g.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]];
    };
    const fill = lay(ground, ink, Number(ps.fillOpacity));
    const stroke = lay(`rgb(${fill})`, ink, Number(ps.strokeOpacity));
    // the digit's box against the ring's inner edge — the gap the fill runs through
    // the INKED digit (the union of its drawn paths), never the glyph's SVG viewport
    const ps2 = [...cell.querySelectorAll<SVGGraphicsElement>(".glyph-svg path")].map((q) => q.getBoundingClientRect()).filter((q) => q.width > 0);
    const glyph = ps2.length ? { left: Math.min(...ps2.map((q) => q.left)), top: Math.min(...ps2.map((q) => q.top)), right: Math.max(...ps2.map((q) => q.right)), bottom: Math.max(...ps2.map((q) => q.bottom)), width: 1 } : undefined;
    const inner = { l: r.left + w, t: r.top + w, r: r.right - w, b: r.bottom - w };
    const gap = glyph && glyph.width > 0
      ? Math.min(glyph.left - inner.l, glyph.top - inner.t, inner.r - glyph.right, inner.b - glyph.bottom)
      : null;
    return { x: r.x, y: r.y, w: r.width, h: r.height, stroke: w * (r.width / (bb.width + w)), ink, ground, groundOf, fill, strokeRgb: stroke, alpha: Number(ps.strokeOpacity), gap };
  }, pos);
  const dpr = A.w / clip.width;
  const at = (I: typeof A, x: number, y: number) => {
    const px = Math.round((x - clip.x) * dpr), py = Math.round((y - clip.y) * dpr);
    if (px < 0 || py < 0 || px >= I.w || py >= I.h) return [] as number[];
    const i = (py * I.w + px) * 4;
    return [I.data[i], I.data[i + 1], I.data[i + 2]];
  };
  const dist = (p: number[], q: number[]) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
  const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const lum = ([r, g, b]: number[]) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
  const ratio = (p: number[], q: number[]) => { const [h, l] = [lum(p), lum(q)].sort((m, n) => n - m); return (h + 0.05) / (l + 0.05); };
  const med = (v: number[]) => v.slice().sort((p, q) => p - q)[v.length >> 1];
  const REACH = Math.max(6, ctx.stroke * 3);
  const rays: { d: number; px: number[] }[][] = [];
  for (let k = 1; k < 12; k++) {
    const tx = ctx.x + (ctx.w * k) / 12, ty = ctx.y + (ctx.h * k) / 12;
    for (const [ox, oy, dx, dy] of [[tx, ctx.y, 0, 1], [tx, ctx.y + ctx.h, 0, -1], [ctx.x, ty, 1, 0], [ctx.x + ctx.w, ty, -1, 0]]) {
      const ray: { d: number; px: number[] }[] = [];
      for (let t = -1; t <= REACH; t += 0.5) {
        const p = at(A, ox + dx * t, oy + dy * t), q = at(B, ox + dx * t, oy + dy * t);
        if (p.length && q.length) ray.push({ d: dist(p, q), px: q });
      }
      rays.push(ray);
    }
  }
  const fillPx = [[0.3, 0.2], [0.7, 0.2], [0.2, 0.3], [0.8, 0.3], [0.2, 0.7], [0.8, 0.7], [0.3, 0.8], [0.7, 0.8]]
    .map(([fx, fy]) => at(B, ctx.x + ctx.w * fx, ctx.y + ctx.h * fy)).filter((p) => p.length);
  const fill = [0, 1, 2].map((c) => med(fillPx.map((p) => p[c])));
  const peaks = rays.map((r) => r.reduce((m, s) => (s.d > m.d ? s : m), { d: 0, px: [] as number[] }))
    .filter((p) => p.d > 8 && dist(p.px, ctx.strokeRgb) < 48);
  const ink = [0, 1, 2].map((c) => med(peaks.map((p) => p.px[c])));
  const M = med(peaks.map((p) => p.d));
  // THRESHOLD SENSITIVITY: per ray, the FAINTEST pixel still counted as line at x% of the median
  // peak change; the worst ray at each x, and the fraction of rays under 3.0 there.
  const sens: Record<string, { worst: number; under: number; n: number }> = {};
  for (const x of [0.5, 0.7, 0.9, 1.0]) {
    const per = rays.map((r) => r.filter((s) => s.d >= x * M && dist(s.px, ctx.strokeRgb) < 64))
      .filter((c) => c.length)
      .map((c) => Math.min(...c.map((s) => ratio(s.px, fill))));
    sens[String(x)] = { worst: per.length ? Math.min(...per) : NaN, under: per.filter((v) => v < 3).length / (per.length || 1), n: per.length };
  }
  return {
    isTheRing: peaks.length >= 8 && dist(ink, ctx.strokeRgb) <= 24,
    delta: dist(ink, ctx.strokeRgb),
    ratio: ratio(ink, fill),
    rays: peaks.length,
    raysUnder3: peaks.filter((p) => ratio(p.px, fill) < 3).length,
    sens,
    ctx,
    ink,
    fill,
    shotB,
  };
}

async function twoTables(browser: Browser, phone: boolean): Promise<{ ca: BrowserContext; cb: BrowserContext; a: Page; b: Page; sockets: string[] }> {
  const ca = await browser.newContext(
    phone
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true }
      : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 3 },
  );
  const cb = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const a = await ca.newPage();
  const b = await cb.newPage();
  const sockets: string[] = [];
  a.on("websocket", (w) => sockets.push(w.url()));
  // B (the desk) opens the table and A follows the link, so the phone never has to reach the
  // well's verb through the dock.
  await b.goto(SOLO);
  await settled(b);
  const link = await invite(b);
  await a.goto(link);
  await settled(a);
  for (const p of [a, b]) await expect(roster(p)).toHaveCount(2, { timeout: 45000 });
  return { ca, cb, a, b, sockets };
}

test("relay · desk — the ring and the tape, put there by a real peer", async ({ browser }, info) => {
  test.slow();
  const { ca, cb, a, b, sockets } = await twoTables(browser, false);
  const say = (s: string) => console.log(`[${info.project.name}] ${s}`);
  say(`A's sockets: ${[...new Set(sockets)].join(" ")}`);
  expect(sockets.some((u) => u.startsWith("ws://127.0.0.1:4248"))).toBe(true);
  await a.waitForTimeout(2500); // the boil parks at idle

  // B writes a digit; it arrives on A in B's hand.
  const x = await firstEmpty(b);
  await cellInput(b, x).click();
  await cellInput(b, x).fill("7");
  await expect.poll(() => cellInput(a, x).inputValue(), { timeout: 30000 }).toBe("7");

  const out: string[] = [];
  const frames: Buffer[] = [];
  for (const arm of ["light", "dark"] as const) {
    await a.evaluate((t) => document.documentElement.classList.toggle("dark", t === "dark"), arm);
    const far = x === 0 ? 80 : 0;
    // THE RING ROUND THE PEER'S OWN DIGIT: B's cursor on the cell B wrote, so the one adjacency
    // the second key invents (same hue, two bands) is on the photograph.
    const r = await ringBytes(
      a,
      x,
      async () => { await cellInput(b, x).click({ force: true }); },
      async () => { await cellInput(b, far).click({ force: true }); },
    );
    say(`${arm} ring from the wire: ${r.ctx.ink}`);
    say(`${arm} ring painted ${r.ratio.toFixed(3)}:1 over its own fill (isTheRing ${r.isTheRing}, Δ ${r.delta.toFixed(1)}, rays ${r.rays}, ${r.raysUnder3} under 3.0) · ground ${r.ctx.ground} off ${r.ctx.groundOf} · digit↔ring-inner-edge gap ${r.ctx.gap === null ? "no digit" : r.ctx.gap.toFixed(2) + "px"}`);
    say(`${arm} sensitivity ${Object.entries(r.sens).map(([k, v]) => `${Math.round(Number(k) * 100)}%: worst ${v.worst.toFixed(3)} · ${(v.under * 100).toFixed(1)}% of ${v.n} rays <3`).join(" | ")}`);
    expect(r.isTheRing).toBe(true);
    const band = await a.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--peer-ring-l").trim());
    expect(r.ctx.ink.startsWith(`oklch(${band} `)).toBe(true); // the ring's band, never the digit's
    frames.push(r.shotB);
    out.push(`${arm} ${r.ratio.toFixed(3)}`);

    // THE TAPE, off the node that wears it: hover B's digit on A.
    await cellInput(b, far).click({ force: true });
    await a.locator(".game-cell").nth(x).hover();
    const label = a.locator(".attribution-tape .washi-label");
    await expect(label).toBeVisible({ timeout: 10000 });
    const tape = await a.evaluate(() => {
      const l = document.querySelector<HTMLElement>(".attribution-tape .washi-label")!;
      const anchor = l.closest<HTMLElement>(".attribution-tape")!;
      const probe = document.createElement("span");
      anchor.appendChild(probe);
      const as = (v: string) => { probe.style.color = `var(${v})`; return getComputedStyle(probe).color; };
      const ring = as("--color-peer-cursor-ink"), digit = as("--color-user-ink");
      probe.remove();
      const ls = getComputedStyle(l);
      const card = getComputedStyle(document.documentElement).getPropertyValue("--color-card").trim();
      const c = document.createElement("canvas"); c.width = c.height = 1;
      const g = c.getContext("2d", { willReadFrequently: true })!;
      const px = (under: string, over: string) => { g.globalCompositeOperation = "copy"; g.fillStyle = under; g.fillRect(0, 0, 1, 1); g.globalCompositeOperation = "source-over"; g.fillStyle = over; g.fillRect(0, 0, 1, 1); const d = g.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]]; };
      const groundRgb = px(card, ls.backgroundColor);
      const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const lum = ([r, gg, b]: number[]) => 0.2126 * lin(r / 255) + 0.7152 * lin(gg / 255) + 0.0722 * lin(b / 255);
      const rat = (p: number[], q: number[]) => { const [h, lo] = [lum(p), lum(q)].sort((m, n) => n - m); return (h + 0.05) / (lo + 0.05); };
      const inkRgb = px(`rgb(${groundRgb})`, ls.color);
      const digitRgb = px(`rgb(${groundRgb})`, digit);
      return { color: ls.color, bg: ls.backgroundColor, ring, digit, ratio: rat(inkRgb, groundRgb), digitRatio: rat(digitRgb, groundRgb) };
    });
    say(`${arm} tape: label color ${tape.color} · ring string computes ${tape.ring} · digit string ${tape.digit} · bg (getComputedStyle) ${tape.bg} over the card → name ${tape.ratio.toFixed(3)}:1 (the digit string would read ${tape.digitRatio.toFixed(3)}:1)`);
    expect(tape.color).toBe(tape.ring);
    expect(tape.ratio).toBeGreaterThanOrEqual(4.5);
    await a.mouse.move(2, 2);
  }
  await pair(a, frames[0], frames[1], `ring-relay-desk-light-dark-${info.project.name}.png`).then((n) => say(`frame ${n} B`));
  say(`SUMMARY ${out.join(" · ")}`);
  await ca.close();
  await cb.close();
});

test("relay · phone 390×844 coarse — the sheet slides over, back, and the ring is photographed", async ({ browser }, info) => {
  test.slow();
  const { ca, cb, a, b } = await twoTables(browser, true);
  const say = (s: string) => console.log(`[${info.project.name}] ${s}`);
  const mq = await a.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, hoverNone: matchMedia("(hover: none)").matches }));
  const mqB = await b.evaluate(() => matchMedia("(pointer: coarse)").matches);
  say(`regime witnessed: A pointer coarse ${mq.coarse} · hover none ${mq.hoverNone} · B (desk) coarse ${mqB}`);
  expect(mq.coarse).toBe(true);
  const settle = () => expect.poll(() => a.evaluate(() => new Promise<boolean>((res) => {
    const read = () => { const r = document.querySelector("#controls-drawer")!.getBoundingClientRect(); return `${r.top.toFixed(2)}|${r.height.toFixed(2)}`; };
    requestAnimationFrame(() => { const p = read(); requestAnimationFrame(() => res(p === read())); });
  })), { timeout: 8000 }).toBe(true);
  // OPEN: what the sheet leaves of the board, and what ground the players' colours sit on there.
  await a.locator(".drawer-tab").tap();
  await expect(a.locator(".drawer-tab")).toHaveAttribute("aria-expanded", "true");
  await settle();
  await a.waitForTimeout(800);
  const open = await a.evaluate(() => {
    const sheet = document.querySelector("#controls-drawer")!.getBoundingClientRect();
    const cells = [...document.querySelectorAll<HTMLElement>(".game-cell")].map((c) => c.getBoundingClientRect());
    const card = document.querySelector<HTMLElement>("#controls-drawer .controls-card")!;
    const sw = [...document.querySelectorAll<HTMLElement>("#controls-drawer .player-swatch")].map((e) => getComputedStyle(e).backgroundColor);
    return { top: sheet.top, clear: cells.filter((r) => r.bottom <= sheet.top).length, of: cells.length, cardH: card.clientHeight, cardBg: getComputedStyle(card).backgroundColor, pop: getComputedStyle(document.documentElement).getPropertyValue("--color-popover").trim(), sw };
  });
  say(`sheet OPEN, settled: top ${open.top.toFixed(1)} · card clientHeight ${open.cardH} · ${open.clear}/${open.of} cells clear of it · card paints ${open.cardBg} (--color-popover is ${open.pop}) · roster swatches ${open.sw.join(" | ")}`);
  // CLOSE, and poll the slide home again before anything is photographed.
  await a.locator(".drawer-tab").tap();
  await expect(a.locator(".drawer-tab")).toHaveAttribute("aria-expanded", "false");
  await settle();
  await a.waitForTimeout(2500); // the slide (~700 ms) and the boil, both parked
  const pos = 40;
  const r = await ringBytes(
    a,
    pos,
    async () => { await cellInput(b, pos).click({ force: true }); },
    async () => { await cellInput(b, 0).click({ force: true }); },
  );
  say(`390 ring from the wire ${r.ctx.ink}: painted ${r.ratio.toFixed(3)}:1 (isTheRing ${r.isTheRing}, Δ ${r.delta.toFixed(1)}, ${r.raysUnder3}/${r.rays} rays under 3.0) · ground ${r.ctx.ground} off ${r.ctx.groundOf}`);
  say(`390 sensitivity ${Object.entries(r.sens).map(([k, v]) => `${Math.round(Number(k) * 100)}%: worst ${v.worst.toFixed(3)} · ${(v.under * 100).toFixed(1)}% of ${v.n} rays <3`).join(" | ")}`);
  // THE FRAME: three cells either side of the ring, the sheet's tab on the board's edge beneath.
  const cb40 = (await a.locator(".game-cell").nth(pos).boundingBox())!;
  const shot = await a.screenshot({ clip: { x: Math.max(0, cb40.x - cb40.width * 1.5), y: cb40.y - cb40.height * 1.5, width: cb40.width * 4, height: cb40.height * 4 } });
  writeFileSync(`${OUT}/ring-relay-390-coarse-light-${info.project.name}.png`, shot);
  say(`frame ${shot.length} B`);
  expect(r.isTheRing).toBe(true);
  await ca.close();
  await cb.close();
});

test("F1 — your own hand at a table of two (arm from PW_F1_ARM)", async ({ browser }, info) => {
  test.slow();
  const { ca, cb, a, b } = await twoTables(browser, false);
  const say = (s: string) => console.log(`[${info.project.name}] ${s}`);
  const mine = await firstEmpty(a);
  await cellInput(a, mine).click();
  await cellInput(a, mine).fill("3");
  const theirs = await firstEmpty(b, mine + 1);
  await cellInput(b, theirs).click();
  await cellInput(b, theirs).fill("5");
  await expect.poll(() => cellInput(a, theirs).inputValue(), { timeout: 30000 }).toBe("5");
  await a.locator(".game-cell").nth(0).click({ position: { x: 1, y: 1 } }).catch(() => {});
  await a.mouse.move(2, 2);
  await a.waitForTimeout(2500);
  const inks = await a.evaluate(([m, t]) => {
    const c = document.querySelectorAll<HTMLElement>(".game-cell");
    const read = (i: number) => getComputedStyle(c[i]).getPropertyValue("--color-user-ink").trim();
    const sw = [...document.querySelectorAll<HTMLElement>(".controls-card .player-swatch")].map((e) => getComputedStyle(e).backgroundColor);
    return { mine: read(m), theirs: read(t), swatches: sw };
  }, [mine, theirs]);
  say(`F1 arm ${ARM}: my digit ${inks.mine} · their digit ${inks.theirs} · roster swatches ${inks.swatches.join(" | ")}`);
  const boxes = await Promise.all([mine, theirs].map((i) => a.locator(".game-cell").nth(i).boundingBox()));
  const x0 = Math.min(...boxes.map((q) => q!.x)) - 8, y0 = Math.min(...boxes.map((q) => q!.y)) - 8;
  const x1 = Math.max(...boxes.map((q) => q!.x + q!.width)) + 8, y1 = Math.max(...boxes.map((q) => q!.y + q!.height)) + 8;
  const shot = await a.screenshot({ clip: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } });
  writeFileSync(`${OUT}/f1-${ARM}-${info.project.name}.png`, shot);
  say(`frame ${shot.length} B · cells ${mine} (mine) and ${theirs} (theirs)`);
  await ca.close();
  await cb.close();
});

test("tape ballot — the name in the ring's string vs the digit's, dark, off a real peer", async ({ browser }, info) => {
  test.slow();
  const { ca, cb, a, b } = await twoTables(browser, false);
  const x = await firstEmpty(b);
  await cellInput(b, x).click();
  await cellInput(b, x).fill("7");
  await expect.poll(() => cellInput(a, x).inputValue(), { timeout: 30000 }).toBe("7");
  await cellInput(b, 0).click({ force: true });
  await a.evaluate(() => document.documentElement.classList.add("dark"));
  await a.waitForTimeout(2500);
  await a.locator(".game-cell").nth(x).hover();
  const label = a.locator(".attribution-tape .washi-label");
  await expect(label).toBeVisible();
  await a.waitForTimeout(400);
  const box = (await label.boundingBox())!;
  const clip = { x: box.x - 10, y: box.y - 10, width: box.width + 20, height: box.height + 20 };
  const ring = await a.screenshot({ clip });
  await label.evaluate((l) => (l as HTMLElement).style.setProperty("color", "var(--color-user-ink)"));
  await a.waitForTimeout(200);
  const digit = await a.screenshot({ clip });
  const n = await pair(a, ring, digit, `tape-ballot-dark-ring-vs-digit-${info.project.name}.png`);
  console.log(`[${info.project.name}] tape ballot frame ${n} B (left: ring string, shipped · right: digit string)`);
  await ca.close();
  await cb.close();
});

test("compose — the F1 pair", async ({ page }, info) => {
  const { readFileSync, existsSync } = await import("node:fs");
  const y = `${OUT}/f1-yes-${info.project.name.replace("probe-", "probe-")}.png`;
  const no = `${OUT}/f1-no-${info.project.name}.png`;
  test.skip(!existsSync(y) || !existsSync(no), "both F1 frames first");
  await page.goto("about:blank");
  const n = await pair(page, readFileSync(y), readFileSync(no), `f1-yes-vs-no-light-${info.project.name}.png`);
  console.log(`[${info.project.name}] F1 pair ${n} B (left: YES, your hand takes a colour · right: NO, you stay blue)`);
});
