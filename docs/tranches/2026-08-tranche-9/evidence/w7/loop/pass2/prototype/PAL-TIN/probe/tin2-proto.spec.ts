/**
 * PAL-TIN pass 2 — the prototype on the real surface, both engines.
 *
 * Re-pointed from `pass1/prototype/PAL-TIN/probe/tin-proto.spec.ts` (the AA, ring, solo and
 * budget rigs are its, verbatim where the subject did not move) with the pass-2 rows added:
 * the corner tick's geometry, the board-scaled stroke, the roster as a legend, the one-person
 * room, print and forced colours, and the three-page wire rig.
 *
 * Nothing here writes into `loop/r0/` or any earlier pass.
 */
import { test, expect, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/PAL-TIN";
const READ = join(OUT, "readings");
const FRAMES = join(OUT, "frames");
mkdirSync(READ, { recursive: true });
mkdirSync(FRAMES, { recursive: true });

const SOLO9 = "./?size=3&difficulty=EASY&wire=local";
const SOLO16 = "./?size=4&difficulty=EASY&wire=local";

const bank = (name: string, data: unknown) =>
  writeFileSync(join(READ, name), JSON.stringify(data, null, 1));

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".game-cell .glyph-svg, .game-cell input").count(), {
      timeout: 60000,
    })
    .toBeGreaterThan(0);
  await page.waitForTimeout(600);
}

/** dark through the product's own key, settled on a rAF after the class write. */
async function dark(page: Page) {
  await page.evaluate(async () => {
    localStorage.setItem("sudoku-color-scheme", "dark");
    document.documentElement.classList.add("dark");
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  });
}

/** The portrait fold keeps the card in the dock; the sheet SLIDES, so settle ~900ms. */
async function openDock(page: Page) {
  const tab = page.locator(".drawer-tab");
  if (await tab.count()) {
    if ((await tab.getAttribute("aria-expanded")) !== "true") {
      await tab.click();
      await page.waitForTimeout(900);
    }
  }
}

async function openRoom(page: Page): Promise<string> {
  await openDock(page);
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return new URL(page.url()).searchParams.get("s")!;
}

async function fillRoom(page: Page, room: string, n: number) {
  // `startSession` writes `?s=` with `history.replaceState`, which WebKit will tear an
  // in-flight evaluation's context down for. Settle on the document before opening a channel.
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(300);
  return page.evaluate(
    async ({ room, n }) => {
      const w = window as unknown as Record<string, unknown>;
      const ch = new BroadcastChannel(`board:${room}`);
      w.__ch = ch;
      w.__st = null;
      ch.onmessage = (ev: MessageEvent) => {
        if (ev.data?.kind === "st") w.__st = ev.data.data;
      };
      await new Promise((r) => setTimeout(r, 700));
      const ids: string[] = [];
      for (let i = 0; i < n; i++) {
        const id = `zz${String(i).padStart(2, "0")}-peer${i}`;
        ids.push(id);
        ch.postMessage({ kind: "hi", data: {}, from: id });
        await new Promise((r) => setTimeout(r, 60));
      }
      for (const id of ids) ch.postMessage({ kind: "hi", data: {}, from: id });
      for (let t = 0; t < 12 && !w.__st; t++) {
        ch.postMessage({ kind: "hi", data: {}, from: ids[ids.length - 1] });
        await new Promise((r) => setTimeout(r, 400));
      }
      await new Promise((r) => setTimeout(r, 400));
      return { ids, st: w.__st };
    },
    { room, n },
  );
}

async function peerWrites(page: Page, from: string, pos: number, value: number) {
  await page.evaluate(
    ({ from, pos, value }) => {
      const w = window as unknown as Record<string, any>;
      const st = w.__st;
      w.__lam = (w.__lam ?? 1000) + 1;
      w.__ch.postMessage({
        kind: "op",
        data: { p: pos, v: value, s: 0, l: w.__lam, a: from, e: st.e, ea: st.ea },
        from,
      });
    },
    { from, pos, value },
  );
  await page.waitForTimeout(250);
}

/** Type a digit into the nth empty cell, through the real input. */
async function writeAt(page: Page, index: number, value: string): Promise<number> {
  const pos = await page.evaluate((i) => {
    const inputs = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
    const empties = inputs
      .map((el, n) => ({ el, n }))
      .filter((r) => !r.el.value && !r.el.disabled && !r.el.readOnly);
    return empties[i]?.n ?? -1;
  }, index);
  if (pos < 0) return -1;
  await page.locator(".game-cell input").nth(pos).click();
  await page.keyboard.type(value);
  await page.waitForTimeout(250);
  return pos;
}

/* ══ T1 · AA on the engine's own bytes — ten arms, two grounds ═════════════════ */
test("T1 — ten arms, two grounds, declared = painted", async ({ page }, info) => {
  await page.goto(SOLO9);
  await settled(page);
  const rows = await page.evaluate(() => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 4;
    const g = cv.getContext("2d", { willReadFrequently: true })!;
    const paint = (css: string) => {
      g.clearRect(0, 0, 4, 4);
      g.fillStyle = css;
      g.fillRect(0, 0, 4, 4);
      const d = g.getImageData(1, 1, 1, 1).data;
      return [d[0], d[1], d[2]] as [number, number, number];
    };
    const lum = ([r, gg, b]: number[]) => {
      const f = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b);
    };
    const ratio = (a: number[], b: number[]) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
      return (x + 0.05) / (y + 0.05);
    };
    const out: Record<string, unknown> = {};
    for (const theme of ["light", "dark"]) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      const c2 = getComputedStyle(document.documentElement);
      const grounds = {
        background: c2.getPropertyValue("--color-background").trim(),
        card: c2.getPropertyValue("--color-card").trim(),
      };
      const sticks: Record<string, unknown> = {};
      for (let i = 1; i <= 5; i++) {
        const declared = c2.getPropertyValue(`--color-peer-${i}`).trim();
        const probe = document.createElement("span");
        probe.style.color = `var(--color-peer-${i})`;
        document.body.appendChild(probe);
        const resolved = getComputedStyle(probe).color;
        probe.remove();
        const painted = paint(declared);
        const ground: Record<string, number> = {};
        for (const [gn, gv] of Object.entries(grounds))
          ground[gn] = +ratio(painted, paint(gv)).toFixed(3);
        sticks[`peer-${i}`] = {
          declared,
          resolved,
          painted: `rgb(${painted.join(", ")})`,
          agree: `rgb(${painted.join(", ")})` === resolved,
          ...ground,
        };
      }
      out[theme] = { grounds, sticks };
    }
    document.documentElement.classList.remove("dark");
    return out;
  });
  bank(`t1-aa-${info.project.name}.json`, rows);
  const all: number[] = [];
  let disagreed = 0;
  for (const theme of ["light", "dark"] as const) {
    const t = rows[theme] as any;
    for (const [n, s] of Object.entries<any>(t.sticks)) {
      all.push(s.background, s.card);
      if (!s.agree) disagreed++;
      console.log(
        `TIN-T1|${info.project.name}|${theme}|${n}|${s.declared}|painted=${s.painted}|agree=${s.agree}|bg=${s.background}|card=${s.card}`,
      );
    }
  }
  console.log(`TIN-T1|${info.project.name}|worst=${Math.min(...all)}|disagreed=${disagreed}`);
  expect(disagreed, "declared = painted byte-for-byte").toBe(0);
  expect(Math.min(...all), "AA 4.5:1").toBeGreaterThanOrEqual(4.5);
});

/* ══ T2 · the peer ring at its drawn pressure, over its OWN 4% fill ════════════ */
test("T2 — the ring against the fill it is drawn on", async ({ page }, info) => {
  await page.goto(SOLO9);
  await settled(page);
  const room = await openRoom(page);
  const { ids, st } = await fillRoom(page, room, 1);
  expect(st, "the page published its board").toBeTruthy();
  await page.evaluate(
    ({ from, st }) => {
      const w = window as unknown as Record<string, any>;
      w.__ch.postMessage({ kind: "cur", data: { p: 10, e: st.e, ea: st.ea }, from });
    },
    { from: ids[0], st },
  );
  await page.waitForTimeout(500);
  const drawn = await page.evaluate(() => {
    const el = document.querySelector(".game-cell.is-peer-cursor .cell-ghost-path");
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      strokeOpacity: cs.strokeOpacity,
      fillOpacity: cs.fillOpacity,
      stroke: cs.stroke,
      strokeWidth: cs.strokeWidth,
    };
  });
  // THE GROUND IS THE RING'S OWN FILL, not the bare card: the stroke is drawn on a cell the
  // same ink already washes at 4%, so that composite is what a reader's eye has under it.
  const sweep = await page.evaluate(() => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 4;
    const g = cv.getContext("2d", { willReadFrequently: true })!;
    const over = (ink: string, ground: string, alpha: number) => {
      g.globalAlpha = 1;
      g.fillStyle = ground;
      g.fillRect(0, 0, 4, 4);
      g.globalAlpha = alpha;
      g.fillStyle = ink;
      g.fillRect(0, 0, 4, 4);
      g.globalAlpha = 1;
      const d = g.getImageData(1, 1, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    const lum = ([r, gg, b]: number[]) => {
      const f = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b);
    };
    const ratio = (a: number[], b: number[]) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
      return (x + 0.05) / (y + 0.05);
    };
    const out: Record<string, unknown> = {};
    for (const theme of ["light", "dark"]) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      const cs = getComputedStyle(document.documentElement);
      const grounds = {
        background: cs.getPropertyValue("--color-background").trim(),
        card: cs.getPropertyValue("--color-card").trim(),
      };
      for (const alpha of [0.55, 0.75, 0.8]) {
        const worst: Record<string, number> = {};
        for (let i = 1; i <= 5; i++) {
          const ink = cs.getPropertyValue(`--color-peer-${i}`).trim();
          for (const [gn, gv] of Object.entries(grounds)) {
            const fill = over(ink, gv, 0.04); // the ring's own 4% wash
            worst[`peer-${i}/${gn}`] = +ratio(
              over(ink, `rgb(${fill.join(",")})`, alpha),
              fill,
            ).toFixed(3);
          }
        }
        out[`${theme}@${alpha}`] = worst;
      }
    }
    document.documentElement.classList.remove("dark");
    return out;
  });
  // …and the same question asked of PAINTED PIXELS at dpr3: the ring's own stroke band against
  // the cell's interior, read off a screenshot rather than modelled.
  const painted = await page.evaluate(async () => {
    const cell = document.querySelector(".game-cell.is-peer-cursor");
    if (!cell) return null;
    const b = cell.getBoundingClientRect();
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  });
  let paintedRatio: number | null = null;
  if (painted) {
    const shot = await page.screenshot({
      clip: { x: painted.x, y: painted.y, width: painted.w, height: painted.h },
    });
    paintedRatio = await page.evaluate(async (b64) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const cv = document.createElement("canvas");
      cv.width = img.width;
      cv.height = img.height;
      const g = cv.getContext("2d", { willReadFrequently: true })!;
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, cv.width, cv.height).data;
      const lum = (r: number, gg: number, bb: number) => {
        const f = (c: number) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(bb);
      };
      // the darkest band (the stroke) against the modal interior pixel (the 4% fill)
      const counts = new Map<string, number>();
      let darkest = 1;
      for (let i = 0; i < d.length; i += 4) {
        const L = lum(d[i], d[i + 1], d[i + 2]);
        if (L < darkest) darkest = L;
        const k = `${d[i]},${d[i + 1]},${d[i + 2]}`;
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
      let modal = "";
      let best = 0;
      for (const [k, n] of counts) if (n > best) ((best = n), (modal = k));
      const [mr, mg, mb] = modal.split(",").map(Number);
      const ml = lum(mr, mg, mb);
      const [hi, lo] = [ml, darkest].sort((a, b2) => b2 - a);
      return +((hi + 0.05) / (lo + 0.05)).toFixed(3);
    }, shot.toString("base64"));
  }
  bank(`t2-ring-${info.project.name}.json`, { drawn, sweep, paintedRatio });
  const at = (k: string) => Math.min(...Object.values(sweep[k] as Record<string, number>));
  const w080 = Math.min(at("light@0.8"), at("dark@0.8"));
  const w055 = Math.min(at("light@0.55"), at("dark@0.55"));
  console.log(
    `TIN-T2|${info.project.name}|drawn=${drawn?.strokeOpacity}|fill=${drawn?.fillOpacity}|0.80worst=${w080}|light=${at("light@0.8")}|dark=${at("dark@0.8")}|0.55HEAD=${w055}|paintedPixels=${paintedRatio}`,
  );
  expect(drawn?.strokeOpacity, "the rule that actually paints").toBe("0.8");
  expect(w080, "3:1 at the drawn pressure, on its own fill").toBeGreaterThanOrEqual(3.0);
  expect(w055, "HEAD's pressure is under").toBeLessThan(3.0);
});

/* ══ T3 · solo mounts nothing, and the leave path comes back to it ═════════════ */
test("T3 — solo: zero ticks, one fingerprint, and back", async ({ page }, info) => {
  await page.goto(SOLO9);
  await settled(page);
  // a SEEDED board (the pass-1 critique's flake): write three digits, so the fingerprint is
  // over a board with ink on it rather than an empty one.
  for (let i = 0; i < 3; i++) await writeAt(page, i, "5");
  const fp = async () =>
    page.evaluate(() => {
      const cells = document.querySelectorAll(".game-cell");
      const glyphs = [...document.querySelectorAll(".game-cell .glyph-svg path")];
      const r = (e: Element) => {
        const b = e.getBoundingClientRect();
        return [b.width, b.height].map((n) => +n.toFixed(2)).join(",");
      };
      return {
        ticks: document.querySelectorAll(".glyph-tick").length,
        rosterTicks: document.querySelectorAll(".roster-tick").length,
        cells: cells.length,
        styledCells: [...cells].filter((c) =>
          (c.getAttribute("style") ?? "").includes("--color-user-ink"),
        ).length,
        glyphStrokes: [...new Set(glyphs.map((g) => getComputedStyle(g).stroke))],
        cellRects: [...cells].slice(0, 12).map(r).join("|"),
      };
    });
  const solo = await fp();
  const leaveNow = async () => {
    const leave = page.locator("button.players-leave");
    if (await leave.count()) {
      await leave.first().click();
      await page.waitForTimeout(900);
    }
  };
  // THE CONTROL FIRST, and it is what makes the reading mean anything: open a room and leave it
  // with NOBODY in it. Nothing of the tin binds (a room of one binds no stick, §1.6), so
  // whatever the board's geometry does across this cycle is the ROOM's, not the palette's.
  await openRoom(page);
  await leaveNow();
  const control = await fp();
  const room = await openRoom(page);
  await fillRoom(page, room, 1);
  await page.waitForTimeout(400);
  const inRoom = await fp();
  await leaveNow();
  const after = await fp();
  bank(`t3-solo-${info.project.name}.json`, { solo, control, inRoom, after });
  console.log(
    `TIN-T3|${info.project.name}|soloTicks=${solo.ticks}/${solo.rosterTicks}|soloStyled=${solo.styledCells}|soloStrokes=${solo.glyphStrokes.join("+")}|roomStyled=${inRoom.styledCells}|afterStyled=${after.styledCells}|rectsSame=${solo.cellRects === after.cellRects}`,
  );
  expect(solo.ticks, "solo mounts no board tick").toBe(0);
  expect(solo.rosterTicks, "solo mounts no roster tick").toBe(0);
  expect(solo.styledCells, "solo binds nothing on a cell").toBe(0);
  expect(after.ticks, "the leave path takes the ticks with it").toBe(0);
  expect(after.styledCells, "…and unbinds every cell").toBe(0);
  expect(after.glyphStrokes.sort(), "the strokes are the solo strokes").toEqual(
    solo.glyphStrokes.sort(),
  );
  // THE GEOMETRY, against its own ablation. The exact string is banked and printed
  // (`rectsSame`); the ASSERTION is that the tin's cycle costs no more than the EMPTY room's,
  // because the board settles a fraction of a pixel differently once a scroll height has come
  // and gone, and that is the room's, measured here rather than assumed.
  const worst = (a: string, b: string) =>
    Math.max(
      ...a.split("|").map((r, i) => {
        const [aw, ah] = r.split(",").map(Number);
        const [bw, bh] = b.split("|")[i].split(",").map(Number);
        return Math.max(Math.abs(aw - bw), Math.abs(ah - bh));
      }),
    );
  const dControl = worst(solo.cellRects, control.cellRects);
  const dTin = worst(solo.cellRects, after.cellRects);
  console.log(
    `TIN-T3|${info.project.name}|emptyRoomDelta=${dControl.toFixed(2)}px|tinDelta=${dTin.toFixed(2)}px`,
  );
  expect(dTin, "the tin's cycle costs no geometry the empty room does not").toBeLessThanOrEqual(
    dControl + 0.05,
  );
});

/* ══ T4 · the corner tick under a 1, a 4 and a 7 ═══════════════════════════════ */
test("T4 — the tick never reads as a stem", async ({ page }, info) => {
  await page.goto(SOLO9);
  await settled(page);
  const room = await openRoom(page);
  const { ids, st } = await fillRoom(page, room, 6); // six peers → the sixth is on lap 1
  expect(st).toBeTruthy();
  const cells = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
    return inputs
      .map((el, n) => ({ n, empty: !el.value && !el.disabled }))
      .filter((r) => r.empty)
      .slice(0, 4)
      .map((r) => r.n);
  });
  // the peer with the highest index is the one wearing a tick
  const ticker = ids[ids.length - 1];
  for (const [i, v] of [1, 4, 7].entries()) await peerWrites(page, ticker, cells[i], v);
  await page.waitForTimeout(700);
  const geom = await page.evaluate((positions) => {
    const out: Record<string, unknown> = {};
    for (const pos of positions) {
      const cell = document.querySelectorAll(".game-cell")[pos];
      if (!cell) continue;
      const tick = cell.querySelector(".glyph-tick") as SVGSVGElement | null;
      const glyph = cell.querySelector(".glyph-svg") as SVGSVGElement | null;
      if (!tick || !glyph) {
        out[String(pos)] = { tick: !!tick, glyph: !!glyph };
        continue;
      }
      const cb = cell.getBoundingClientRect();
      const box = (e: Element) => {
        const b = e.getBoundingClientRect();
        return {
          x: +(((b.x - cb.x) / cb.width) * 100).toFixed(2),
          y: +(((b.y - cb.y) / cb.height) * 100).toFixed(2),
          w: +((b.width / cb.width) * 100).toFixed(2),
          h: +((b.height / cb.height) * 100).toFixed(2),
        };
      };
      // the INK's own box, not the svg's viewport: getBBox on the drawn paths
      const inkBox = (svg: SVGSVGElement) => {
        const paths = [...svg.querySelectorAll("path")] as SVGPathElement[];
        const rs = paths.map((p) => p.getBoundingClientRect());
        const x = Math.min(...rs.map((r) => r.x));
        const y = Math.min(...rs.map((r) => r.y));
        const x2 = Math.max(...rs.map((r) => r.x + r.width));
        const y2 = Math.max(...rs.map((r) => r.y + r.height));
        return {
          x: +(((x - cb.x) / cb.width) * 100).toFixed(2),
          y: +(((y - cb.y) / cb.height) * 100).toFixed(2),
          w: +(((x2 - x) / cb.width) * 100).toFixed(2),
          h: +(((y2 - y) / cb.height) * 100).toFixed(2),
          cx: +((((x + x2) / 2 - cb.x) / cb.width) * 100).toFixed(2),
        };
      };
      const t = inkBox(tick);
      const g = inkBox(glyph);
      const overlapX = Math.max(0, Math.min(t.x + t.w, g.x + g.w) - Math.max(t.x, g.x));
      const overlapY = Math.max(0, Math.min(t.y + t.h, g.y + g.h) - Math.max(t.y, g.y));
      out[String(pos)] = {
        digit: (cell.querySelector("input") as HTMLInputElement)?.value,
        tickBox: t,
        glyphBox: g,
        tickSvg: box(tick),
        overlapArea: +(overlapX * overlapY).toFixed(3),
        centreGap: +Math.abs(t.cx - g.cx).toFixed(2),
      };
    }
    return out;
  }, cells.slice(0, 3));
  // the same cell with the conflict ring armed: a duplicate digit in the same row
  const rimmed = await page.evaluate((pos) => {
    const cell = document.querySelectorAll(".game-cell")[pos] as HTMLElement;
    const ghost = cell?.querySelector(".cell-ghost-path");
    const tick = cell?.querySelector(".glyph-tick path");
    if (!ghost || !tick) return null;
    const gb = ghost.getBoundingClientRect();
    const tb = tick.getBoundingClientRect();
    const cb = cell.getBoundingClientRect();
    return {
      invalid: cell.classList.contains("is-invalid"),
      because: !!cell.querySelector(".cell-because"),
      ghostBottomPct: +(((gb.y + gb.height - cb.y) / cb.height) * 100).toFixed(2),
      tickTopPct: +(((tb.y - cb.y) / cb.height) * 100).toFixed(2),
      tickLeftPct: +(((tb.x - cb.x) / cb.width) * 100).toFixed(2),
    };
  }, cells[0]);
  bank(`t4-tick-${info.project.name}.json`, { geom, rimmed });
  const rows = Object.values(geom) as any[];
  for (const r of rows)
    console.log(
      `TIN-T4|${info.project.name}|digit=${r.digit}|tick=${JSON.stringify(r.tickBox)}|glyph=${JSON.stringify(r.glyphBox)}|overlap=${r.overlapArea}|centreGap=${r.centreGap}`,
    );
  console.log(`TIN-T4|${info.project.name}|rimmed=${JSON.stringify(rimmed)}`);
  expect(rows.length, "three digits carry a tick").toBe(3);
  for (const r of rows) {
    expect(r.overlapArea, `no overlap under a ${r.digit}`).toBe(0);
    expect(r.centreGap, `a single upright sits off the ${r.digit}'s centre`).toBeGreaterThan(
      30,
    );
  }
  if (info.project.name === "chromium") {
    const cell = page.locator(".game-cell").nth(cells[0]);
    const b = await cell.boundingBox();
    if (b)
      await page.screenshot({
        path: join(FRAMES, "tick-corner-under-1-light.png"),
        clip: {
          x: b.x - b.width * 0.15,
          y: b.y - b.height * 0.15,
          width: b.width * 2.4,
          height: b.height * 1.4,
        },
      });
  }
});

/* ══ T5 · the stroke follows the board ════════════════════════════════════════ */
test("T5 — painted stroke is boardWidth/300 at every size", async ({ browser }, info) => {
  const rows: Record<string, unknown> = {};
  for (const [label, url, vp] of [
    ["9x9-desk", SOLO9, { width: 1280, height: 800 }],
    ["9x9-phone", SOLO9, { width: 390, height: 844 }],
    ["16x16-phone", SOLO16, { width: 390, height: 844 }],
  ] as const) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 3 });
    const page = await ctx.newPage();
    await page.goto(url);
    await settled(page);
    if (label === "16x16-phone") await dark(page);
    const room = await openRoom(page);
    const { ids, st } = await fillRoom(page, room, 6);
    if (!st) {
      rows[label] = { error: "no st" };
      await ctx.close();
      continue;
    }
    const pos = await page.evaluate(() => {
      const inputs = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
      return inputs.findIndex((el) => !el.value && !el.disabled);
    });
    await peerWrites(page, ids[ids.length - 1], pos, 1);
    await page.waitForTimeout(600);
    const r = await page.evaluate((pos) => {
      const cell = document.querySelectorAll(".game-cell")[pos];
      const tick = cell?.querySelector(".glyph-tick path") as SVGPathElement | null;
      const board = document.querySelector(".board-wrapper svg, .board-wrapper");
      if (!tick) return { error: "no tick" };
      const cs = getComputedStyle(tick);
      const svg = tick.ownerSVGElement!;
      const vb = svg.viewBox.baseVal;
      const sb = svg.getBoundingClientRect();
      const userUnits = parseFloat(cs.strokeWidth);
      return {
        boardWidth: +(board?.getBoundingClientRect().width ?? 0).toFixed(2),
        cellWidth: +cell.getBoundingClientRect().width.toFixed(2),
        strokeUserUnits: userUnits,
        svgWidth: +sb.width.toFixed(2),
        viewBoxWidth: vb.width,
        paintedCssPx: +((userUnits * sb.width) / vb.width).toFixed(3),
      };
    }, pos);
    rows[label] = r;
    await ctx.close();
  }
  bank(`t5-stroke-${info.project.name}.json`, rows);
  for (const [k, v] of Object.entries<any>(rows))
    console.log(
      `TIN-T5|${info.project.name}|${k}|board=${v.boardWidth}|cell=${v.cellWidth}|units=${v.strokeUserUnits}|painted=${v.paintedCssPx}|expected=${v.boardWidth ? (v.boardWidth / 300).toFixed(3) : "-"}`,
    );
  for (const [k, v] of Object.entries<any>(rows)) {
    expect(v.paintedCssPx, `${k} has a painted tick`).toBeGreaterThan(0);
    expect(
      Math.abs(v.paintedCssPx - v.boardWidth / 300),
      `${k} painted = boardWidth/300`,
    ).toBeLessThanOrEqual(0.1);
  }
});

/* ══ T6 · sixteen at the table — the roster IS the legend ═════════════════════ */
test("T6 — sixteen rows, five swatches, eleven ticks, each against its word", async ({
  browser,
}, info) => {
  const rows: Record<string, unknown> = {};
  for (const [label, vp] of [
    ["1280", { width: 1280, height: 900 }],
    ["390", { width: 390, height: 844 }],
  ] as const) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    await page.goto(SOLO9);
    await settled(page);
    const room = await openRoom(page);
    const { st } = await fillRoom(page, room, 15);
    if (!st) {
      rows[label] = { error: "no st" };
      await ctx.close();
      continue;
    }
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => {
      const rowsEl = [...document.querySelectorAll(".player-row")];
      const gaps: number[] = [];
      const inks = new Set<string>();
      let ticks = 0;
      for (const row of rowsEl) {
        const name = row.querySelector(".player-name");
        const tick = row.querySelector(".roster-tick");
        const swatch = row.querySelector(".player-swatch");
        if (swatch) inks.add(getComputedStyle(swatch).backgroundColor);
        if (tick && name) {
          ticks++;
          gaps.push(
            +(
              tick.getBoundingClientRect().x -
              (name.getBoundingClientRect().x + name.getBoundingClientRect().width)
            ).toFixed(2),
          );
        }
      }
      const rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize);
      return {
        rows: rowsEl.length,
        swatchColours: inks.size,
        ticks,
        gaps,
        worstGapRem: gaps.length ? +(Math.max(...gaps) / rootFont).toFixed(3) : null,
        rowHeight: rowsEl[0]
          ? +rowsEl[0].getBoundingClientRect().height.toFixed(2)
          : null,
      };
    });
    rows[label] = r;
    if (label === "1280" && info.project.name === "chromium") {
      const card = page.locator(".players-list, .controls-card").first();
      const b = await card.boundingBox();
      if (b)
        await page.screenshot({
          path: join(FRAMES, "roster-sixteen-light.png"),
          clip: {
            x: b.x,
            y: b.y,
            width: Math.min(b.width, 360),
            height: Math.min(b.height, 620),
          },
        });
    }
    await ctx.close();
  }
  bank(`t6-roster-${info.project.name}.json`, rows);
  for (const [k, v] of Object.entries<any>(rows))
    console.log(
      `TIN-T6|${info.project.name}|${k}|rows=${v.rows}|swatches=${v.swatchColours}|ticks=${v.ticks}|worstGapRem=${v.worstGapRem}|rowH=${v.rowHeight}`,
    );
  for (const [k, v] of Object.entries<any>(rows)) {
    expect(v.rows, `${k}: sixteen at the table`).toBe(16);
    expect(v.swatchColours, `${k}: five inks`).toBe(5);
    expect(v.ticks, `${k}: eleven ticks`).toBe(11);
    expect(v.worstGapRem, `${k}: the tick sits against the word`).toBeLessThanOrEqual(0.4);
  }
});

/* ══ T7 · the one-person room — one hand, one colour ══════════════════════════ */
test("T7 — write, invite, write: both strokes are one colour", async ({ page }, info) => {
  await page.goto(SOLO9);
  await settled(page);
  const before = await writeAt(page, 0, "5");
  const room = await openRoom(page);
  const after = await writeAt(page, 0, "6");
  const alone = await page.evaluate(
    ([a, b]) => {
      const stroke = (i: number) => {
        const cell = document.querySelectorAll(".game-cell")[i];
        const p = cell?.querySelector(".glyph-svg path");
        return p ? getComputedStyle(p).stroke : null;
      };
      return { first: stroke(a), second: stroke(b), ticks: document.querySelectorAll(".glyph-tick").length };
    },
    [before, after],
  );
  // …and now a peer arrives.
  const { st } = await fillRoom(page, room, 1);
  await page.waitForTimeout(1400); // the join trace's arrival
  const joined = await page.evaluate(
    ([a, b]) => {
      const stroke = (i: number) => {
        const cell = document.querySelectorAll(".game-cell")[i];
        const p = cell?.querySelector(".glyph-svg path");
        return p ? getComputedStyle(p).stroke : null;
      };
      const styled = (i: number) =>
        (document.querySelectorAll(".game-cell")[i]?.getAttribute("style") ?? "").includes(
          "--color-user-ink",
        );
      return {
        first: stroke(a),
        second: stroke(b),
        firstStyled: styled(a),
        secondStyled: styled(b),
      };
    },
    [before, after],
  );
  bank(`t7-one-person-${info.project.name}.json`, { alone, joined, published: !!st });
  console.log(
    `TIN-T7|${info.project.name}|alone=${alone.first}/${alone.second}|aloneTicks=${alone.ticks}|joined=${joined.first}/${joined.second}|styled=${joined.firstStyled}/${joined.secondStyled}`,
  );
  expect(alone.first, "before and after the invite are one colour").toBe(alone.second);
  expect(joined.first, "both snap to the same stick when the room exists").toBe(joined.second);
  expect(joined.firstStyled, "the pre-invite cell takes the stick too").toBe(true);
  expect(joined.secondStyled).toBe(true);
});

/* ══ T8 · print and forced colours reach the tick ═════════════════════════════ */
test("T8 — the tick prints black and yields to CanvasText", async ({ page }, info) => {
  await page.goto(SOLO9);
  await settled(page);
  const room = await openRoom(page);
  const { ids, st } = await fillRoom(page, room, 6);
  expect(st).toBeTruthy();
  const pos = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
    return inputs.findIndex((el) => !el.value && !el.disabled);
  });
  await peerWrites(page, ids[ids.length - 1], pos, 3);
  await page.waitForTimeout(600);
  const read = async () =>
    page.evaluate((pos) => {
      const cell = document.querySelectorAll(".game-cell")[pos];
      const tick = cell?.querySelector(".glyph-tick path");
      const digit = cell?.querySelector(".glyph-svg path");
      const roster = document.querySelector(".roster-tick path");
      return {
        tick: tick ? getComputedStyle(tick).stroke : null,
        digit: digit ? getComputedStyle(digit).stroke : null,
        roster: roster ? getComputedStyle(roster).stroke : null,
      };
    }, pos);
  const screen = await read();
  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(200);
  const print = await read();
  await page.emulateMedia({ media: "screen", forcedColors: "active" });
  await page.waitForTimeout(200);
  const forced = await read();
  await page.emulateMedia({ media: "screen", forcedColors: "none" });
  bank(`t8-print-${info.project.name}.json`, { screen, print, forced });
  console.log(
    `TIN-T8|${info.project.name}|screen=${JSON.stringify(screen)}|print=${JSON.stringify(print)}|forced=${JSON.stringify(forced)}`,
  );
  expect(print.tick, "the tick prints black").toBe("rgb(0, 0, 0)");
  expect(print.digit).toBe("rgb(0, 0, 0)");
  if (forced.tick) {
    expect(forced.tick, "the tick yields to the system ink").toBe(forced.digit);
    expect(forced.tick).not.toBe(screen.tick);
  }
});

/* ══ T9 · the census with a sixteen-player board ══════════════════════════════ */
test("T9 — filterBudget with sixteen players on the board", async ({ page }, info) => {
  await page.goto(SOLO9);
  await settled(page);
  // THE CENSUS IS A DELTA, and it has to be: `filterBudget.ts` states the ROW regime and the
  // estate's own `filter-census.spec.ts` reads it off a built dist against that file's rows.
  // What this lane owes is narrower and is the thing a palette could break — that a board full
  // of players adds no live filter to the page. So: the same page, counted before and after.
  const count = () =>
    page.evaluate(() => {
      const live = [...document.querySelectorAll("*")].filter((el) => {
        const f = getComputedStyle(el).filter;
        return f && f !== "none" && f.includes("url(");
      });
      const name = (el: Element) =>
        `${el.tagName.toLowerCase()}.${(el.getAttribute("class") ?? "").split(/\s+/)[0]}`;
      return {
        defs: document.querySelectorAll("filter").length,
        live: live.length,
        who: live.map(name).sort(),
      };
    });
  const solo = await count();
  const room = await openRoom(page);
  const { ids, st } = await fillRoom(page, room, 15);
  expect(st).toBeTruthy();
  const cells = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
    return inputs
      .map((el, n) => ({ n, empty: !el.value && !el.disabled }))
      .filter((r) => r.empty)
      .slice(0, 15)
      .map((r) => r.n);
  });
  for (const [i, id] of ids.entries())
    if (cells[i] !== undefined) await peerWrites(page, id, cells[i], (i % 9) + 1);
  await page.waitForTimeout(800);
  const full = await count();
  const census = await page.evaluate(() => ({
    ticks: document.querySelectorAll(".glyph-tick").length,
    rosterTicks: document.querySelectorAll(".roster-tick").length,
    rows: document.querySelectorAll(".player-row").length,
    tickFilters: [...document.querySelectorAll(".glyph-tick *, .roster-tick *")].filter(
      (el) => {
        const f = getComputedStyle(el).filter;
        return f && f !== "none";
      },
    ).length,
  }));
  bank(`t9-census-${info.project.name}.json`, { solo, full, census });
  console.log(
    `TIN-T9|${info.project.name}|soloDefs=${solo.defs}/live=${solo.live}|fullDefs=${full.defs}/live=${full.live}|ticks=${census.ticks}|rosterTicks=${census.rosterTicks}|rows=${census.rows}|tickFilters=${census.tickFilters}`,
  );
  // WHAT THE ROOM ADDS AND WHAT THE TIN ADDS ARE TWO QUESTIONS. The roster region is drawn
  // furniture that mounts with the room (`HandDrawnOutline`) and carries its own filters; the
  // tin's own mark carries NONE, mounted eleven times over. The delta is named, not summed.
  const added = full.who.filter((w: string) => !solo.who.includes(w));
  console.log(`TIN-T9|${info.project.name}|added=${added.join(",") || "none"}`);
  expect(added.filter((w: string) => w.includes("tick")).length, "no tick is filtered").toBe(0);
  expect(census.tickFilters, "the tick is frozen — no filter on any tick").toBe(0);
  expect(full.defs, "the room mints no filter DEF of its own").toBe(solo.defs);
});

/* ══ T10 · three pages, one author, one assignment ════════════════════════════ */
test("T10 — the room converges on the author's word", async ({ browser }, info) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO9);
  await settled(a);
  const room = await openRoom(a);
  const b = await ctx.newPage();
  await b.goto(`./?s=${room}&wire=local`);
  await settled(b);
  const c = await ctx.newPage();
  await c.goto(`./?s=${room}&wire=local`);
  await settled(c);
  await a.waitForTimeout(1500);
  const state = async (p: Page) =>
    p.evaluate(() => {
      const rows = [...document.querySelectorAll(".player-row")];
      const inks = rows.map((r) => {
        const s = r.querySelector(".player-swatch");
        return s ? getComputedStyle(s).backgroundColor : "";
      });
      return {
        rows: rows.length,
        inks,
        duplicateInks: inks.length - new Set(inks).size,
      };
    });
  const [sa, sb, sc] = [await state(a), await state(b), await state(c)];
  bank(`t10-three-page-${info.project.name}.json`, { a: sa, b: sb, c: sc });
  console.log(
    `TIN-T10|${info.project.name}|A=${sa.rows}/${sa.duplicateInks}|B=${sb.rows}/${sb.duplicateInks}|C=${sc.rows}/${sc.duplicateInks}`,
  );
  for (const [n, s] of [
    ["A", sa],
    ["B", sb],
    ["C", sc],
  ] as const) {
    expect(s.rows, `${n} sees three at the table`).toBe(3);
    expect(s.duplicateInks, `${n}: no two people in one colour`).toBe(0);
  }
  await ctx.close();
});

/* ══ T11 · the dark board, two sticks and a tick — the crop ═══════════════════ */
test("T11 — a dark board with two sticks and a tick", async ({ browser }, info) => {
  test.skip(info.project.name !== "chromium", "one crop, one engine");
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
  });
  const page = await ctx.newPage();
  await page.goto(SOLO16);
  await settled(page);
  await dark(page);
  const room = await openRoom(page);
  const { ids, st } = await fillRoom(page, room, 6);
  if (st) {
    const cells = await page.evaluate(() => {
      const inputs = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
      return inputs
        .map((el, n) => ({ n, empty: !el.value && !el.disabled }))
        .filter((r) => r.empty)
        .slice(0, 3)
        .map((r) => r.n);
    });
    await peerWrites(page, ids[0], cells[0], 5);
    await peerWrites(page, ids[ids.length - 1], cells[1], 8);
    await page.waitForTimeout(700);
    const b = await page.locator(".game-cell").nth(cells[0]).boundingBox();
    if (b)
      await page.screenshot({
        path: join(FRAMES, "tick-16x16-phone-dark.png"),
        clip: {
          x: Math.max(0, b.x - b.width),
          y: Math.max(0, b.y - b.height),
          width: b.width * 6,
          height: b.height * 4,
        },
      });
  }
  await ctx.close();
});
