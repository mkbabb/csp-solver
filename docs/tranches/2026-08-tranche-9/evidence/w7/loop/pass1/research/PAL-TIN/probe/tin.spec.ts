/**
 * PAL-TIN pass-1 LIVE PROBE — the tin against the real engine, both engines, both themes.
 *
 * Nothing in src/, e2e/ or scripts/ is touched. Everything here is an `addStyleTag` overlay or a
 * `page.evaluate` DOM patch against the lane's own dev server (127.0.0.1:4245).
 *
 *   T1  canvas read-back of every stick on FOUR grounds (the engine's painted bytes)
 *   T2  a 16-person roster under the tin's allocator — sharers drawn, the real component
 *   T3  the tick at dpr3 on a board digit — the wobble law and the accessible name
 *   T4  the incumbent's own numbers, re-derived beside them (the control)
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/PAL-TIN";
const SOLO = "./?size=3&difficulty=EASY&wire=local";

/** THE TIN OF FIVE — probe/tin-five.mjs, derived off index.css's own reserved set. */
const TIN5 = [
  { name: "amber", h: 49.2, light: "#b15000", dark: "#ff9a61" },
  { name: "green", h: 124.5, light: "#5f7d00", dark: "#a0c942" },
  { name: "aqua", h: 199.7, light: "#008085", dark: "#00d0d8" },
  { name: "violet", h: 274.9, light: "#5762cf", dark: "#a2b2ff" },
  { name: "pink", h: 333.9, light: "#a64297", dark: "#f68ce3" },
];
/** THE TIN OF SIX — the same cut, one stick more. */
const TIN6 = [
  { name: "orange", h: 42.0, light: "#bb4500", dark: "#ff9970" },
  { name: "olive", h: 109.8, light: "#757500", dark: "#bfbf16" },
  { name: "teal", h: 177.7, light: "#008370", dark: "#00d5b7" },
  { name: "blue", h: 229.2, light: "#007ba2", dark: "#35c7ff" },
  { name: "violet", h: 280.6, light: "#625fcd", dark: "#aaafff" },
  { name: "pink", h: 333.9, light: "#a64297", dark: "#f68ce3" },
];

const log: string[] = [];
const say = (s: string) => {
  log.push(s);
  console.log(s);
};

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function setTheme(page: Page, theme: "light" | "dark") {
  await page.evaluate((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
  }, theme);
  await page.waitForTimeout(120);
}

/* ── T1 · canvas read-back on four grounds ─────────────────────────────── */
test("T1 — the tin, read back off the engine's painted bytes on four grounds", async ({
  page,
}, info) => {
  await page.goto(SOLO);
  await settled(page);
  for (const theme of ["light", "dark"] as const) {
    await setTheme(page, theme);
    const rows = await page.evaluate(
      ({ tin5, tin6, theme }) => {
        const cs = getComputedStyle(document.documentElement);
        const probe = document.createElement("div");
        document.body.appendChild(probe);
        // the engine resolves every colour; we read what IT paints, never our own arithmetic
        const paint = (v: string): [number, number, number] => {
          probe.style.color = v;
          const c = getComputedStyle(probe).color;
          const cv = document.createElement("canvas");
          cv.width = cv.height = 1;
          const ctx = cv.getContext("2d")!;
          ctx.fillStyle = c;
          ctx.fillRect(0, 0, 1, 1);
          const d = ctx.getImageData(0, 0, 1, 1).data;
          return [d[0], d[1], d[2]];
        };
        const lin = (c: number) =>
          c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        const lum = ([r, g, b]: number[]) =>
          0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
        const cr = (a: number[], b: number[]) => {
          const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
          return (x + 0.05) / (y + 0.05);
        };
        const over = (f: number[], b: number[], a: number) =>
          f.map((v, k) => Math.round(v * a + b[k] * (1 - a)));
        const bg = paint(cs.getPropertyValue("--color-background").trim());
        const card = paint(cs.getPropertyValue("--color-card").trim());
        const out: Record<string, unknown>[] = [];
        for (const [tinName, tin] of [
          ["tin5", tin5],
          ["tin6", tin6],
        ] as const) {
          for (const s of tin) {
            const rgb = paint(theme === "light" ? s.light : s.dark);
            out.push({
              tin: tinName,
              name: s.name,
              declared: theme === "light" ? s.light : s.dark,
              painted: `rgb(${rgb.join(", ")})`,
              bg: +cr(rgb, bg).toFixed(2),
              card: +cr(rgb, card).toFixed(2),
              ring_bg: +cr(over(rgb, bg, 0.55), bg).toFixed(2),
              ring_card: +cr(over(rgb, card, 0.55), card).toFixed(2),
              trace95: +Math.min(
                cr(over(rgb, bg, 0.95), bg),
                cr(over(rgb, card, 0.95), card),
              ).toFixed(2),
            });
          }
        }
        // the INCUMBENT walk, first 16, read the same way — the control
        const band = cs.getPropertyValue("--peer-ink-l").trim();
        for (let i = 0; i < 16; i++) {
          const rgb = paint(`oklch(${band} 0.11 ${((i * 137.5) % 360).toFixed(1)}deg)`);
          out.push({
            tin: "walk(HEAD)",
            name: `i${i}`,
            declared: `oklch(${band} 0.11 ${((i * 137.5) % 360).toFixed(1)}deg)`,
            painted: `rgb(${rgb.join(", ")})`,
            bg: +cr(rgb, bg).toFixed(2),
            card: +cr(rgb, card).toFixed(2),
            ring_bg: +cr(over(rgb, bg, 0.55), bg).toFixed(2),
            ring_card: +cr(over(rgb, card, 0.55), card).toFixed(2),
            trace95: +Math.min(
              cr(over(rgb, bg, 0.95), bg),
              cr(over(rgb, card, 0.95), card),
            ).toFixed(2),
          });
        }
        probe.remove();
        return { bg, card, rows: out };
      },
      { tin5: TIN5, tin6: TIN6, theme },
    );
    const eng = info.project.name;
    say(
      `T1|${eng}|${theme}|papers bg=rgb(${rows.bg.join(",")}) card=rgb(${rows.card.join(",")})`,
    );
    for (const group of ["tin5", "tin6", "walk(HEAD)"]) {
      const g = rows.rows.filter((r) => r.tin === group);
      const worstAA = Math.min(...g.map((r) => Math.min(r.bg as number, r.card as number)));
      const worstRing = Math.min(
        ...g.map((r) => Math.min(r.ring_bg as number, r.ring_card as number)),
      );
      const worstTrace = Math.min(...g.map((r) => r.trace95 as number));
      const underAA = g.filter(
        (r) => Math.min(r.bg as number, r.card as number) < 4.5,
      ).length;
      const underRing = g.filter(
        (r) => Math.min(r.ring_bg as number, r.ring_card as number) < 3,
      ).length;
      say(
        `T1|${eng}|${theme}|${group}: worst AA ${worstAA.toFixed(2)}:1 (${underAA}/${g.length} under 4.5) · worst ring@0.55 ${worstRing.toFixed(2)}:1 (${underRing}/${g.length} under 3) · worst trace@0.95 ${worstTrace.toFixed(2)}:1`,
      );
      for (const r of g.filter((x) => x.tin !== "walk(HEAD)"))
        say(
          `T1|${eng}|${theme}|  ${String(r.name).padEnd(7)} declared ${r.declared} painted ${r.painted} bg ${r.bg}:1 card ${r.card}:1 ring ${Math.min(r.ring_bg as number, r.ring_card as number)}:1`,
        );
    }
  }
});

/* ── T2 · a sixteen-person roster under the tin's allocator ────────────── */
test("T2 — sixteen people, five pencils, the sharers drawn", async ({ browser }, info) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);

  for (const theme of ["light", "dark"] as const) {
    await setTheme(a, theme);
    const shot = await a.evaluate(
      ({ tin, theme }) => {
        /* THE ALLOCATOR, in one function: tin order, then laps. Stick = index % tin.length;
           ticks = floor(index / tin.length). Nothing golden, nothing random, and the lap count
           IS the tick count the lobby says out loud. */
        const alloc = (index: number) => ({
          stick: index % tin.length,
          ticks: Math.floor(index / tin.length),
        });
        const ul = document.querySelector(".controls-card .players-roster")!;
        const proto = ul.querySelector(".player-row") as HTMLElement;
        const names = [
          "brave-otter", "tragic-mockingbird", "keen-heron", "wild-lemur", "olden-marten",
          "swift-vole", "bold-finch", "quiet-ibis", "merry-stoat", "handy-newt",
          "sober-crane", "lively-shrew", "noble-tern", "hardy-vole", "clever-wren",
          "windy-owl",
        ];
        ul.querySelectorAll(".player-row").forEach((n) => n.remove());
        ul.classList.remove("sr-only");
        (ul as HTMLElement).style.maxHeight = "none";
        names.forEach((slug, i) => {
          const li = proto.cloneNode(true) as HTMLElement;
          const { stick, ticks } = alloc(i);
          li.style.setProperty(
            "--color-user-ink",
            theme === "light" ? tin[stick].light : tin[stick].dark,
          );
          (li.querySelector(".player-name") as HTMLElement).textContent = slug;
          li.querySelector(".player-self")?.remove();
          if (i === 0) {
            const you = document.createElement("span");
            you.className = "player-self";
            you.textContent = "you";
            li.querySelector(".player-row-cells")!.appendChild(you);
          }
          /* THE TICK — the sharing axis, drawn, not coloured. One upright per lap past the
             first, in the deal counter's own hand (DifficultyTally's 26-unit stroke at
             TALLY_BOIL 0.6, one static pose — no beat, no filter, filterBudget untouched).
             aria-hidden: the row already SAYS the slug, and the cell's accessible name already
             names the author. The tick adds a picture, never a second name. */
          if (ticks > 0) {
            const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            t.setAttribute("viewBox", `0 0 ${ticks * 6 + 4} 14`);
            t.setAttribute("width", String(ticks * 6 + 4));
            t.setAttribute("height", "14");
            t.setAttribute("aria-hidden", "true");
            t.style.marginLeft = "4px";
            t.style.flex = "0 0 auto";
            for (let k = 0; k < ticks; k++) {
              const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
              const x = 3 + k * 6;
              const w = (n: number) => n + (Math.sin((k + 1) * 7.3) * 0.6);
              p.setAttribute("d", `M ${w(x)} 2 Q ${w(x) + 0.5} 7 ${w(x) - 0.3} 12`);
              p.setAttribute("stroke", "var(--color-user-ink)");
              p.setAttribute("stroke-width", "2");
              p.setAttribute("stroke-linecap", "round");
              p.setAttribute("fill", "none");
              t.appendChild(p);
            }
            li.querySelector(".player-row-cells")!.appendChild(t);
          }
          ul.appendChild(li);
        });
        const rows = [...ul.querySelectorAll(".player-row")].map((li, i) => {
          const sw = li.querySelector(".player-swatch") as HTMLElement;
          const nm = li.querySelector(".player-name") as HTMLElement;
          return {
            i,
            slug: nm.textContent,
            swatch: getComputedStyle(sw).backgroundColor,
            nameInk: getComputedStyle(nm).color,
            ticks: li.querySelectorAll("svg path").length,
            h: +li.getBoundingClientRect().height.toFixed(1),
          };
        });
        const box = (document.querySelector(".players-well") ?? ul).getBoundingClientRect();
        return { rows, box: { x: box.x, y: box.y, w: box.width, h: box.height } };
      },
      { tin: TIN5, theme },
    );
    const eng = info.project.name;
    say(
      `T2|${eng}|${theme}|sixteen rows drawn · roster box ${shot.box.w.toFixed(1)}x${shot.box.h.toFixed(1)} at (${shot.box.x.toFixed(1)},${shot.box.y.toFixed(1)})`,
    );
    for (const r of shot.rows)
      say(
        `T2|${eng}|${theme}|  ${String(r.i).padStart(2)} ${String(r.slug).padEnd(20)} swatch ${r.swatch} ticks ${r.ticks} rowH ${r.h}`,
      );
    /* distinct colours actually painted, and the sharer pairs the ticks must separate */
    const distinct = new Set(shot.rows.map((r) => r.swatch));
    say(
      `T2|${eng}|${theme}|distinct painted swatches ${distinct.size} over ${shot.rows.length} people · sharers ${shot.rows.length - distinct.size} · rows carrying a tick ${shot.rows.filter((r) => r.ticks > 0).length}`,
    );
    if (theme === "light" && eng === "chromium") {
      const el = a.locator(".controls-card .players-roster");
      await el.screenshot({ path: path.join(OUT, "frames/roster-16-five-pencils-light.png") });
    }
  }
  await ctx.close();
});

/* ── T3 · the tick on a digit, at dpr3 ─────────────────────────────────── */
test("T3 — a shared pencil's tick on a board digit, dpr3, and the cell's own name", async ({
  browser,
}, info) => {
  const ctx = await browser.newContext({ deviceScaleFactor: 3, viewport: { width: 700, height: 700 } });
  const page = await ctx.newPage();
  await page.goto(SOLO);
  await settled(page);
  // write four digits first — the ink binds a PLAYER's entry, never a given's graphite
  const empties = page.locator(".sudoku-cell input:not([readonly]):not([disabled])");
  const n = Math.min(4, await empties.count());
  for (let k = 0; k < n; k++) {
    await empties.nth(k).click();
    await page.keyboard.type(String((k % 9) + 1));
    await page.waitForTimeout(80);
  }
  const out = await page.evaluate((tin) => {
    /* Paint four cells as four authors: two on different pencils, two SHARING one pencil and
       told apart by one tick and two ticks. Everything is injected; nothing in src/ moves. */
    const cells = [...document.querySelectorAll(".sudoku-cell")].filter((c) => {
      const inp = c.querySelector("input") as HTMLInputElement | null;
      return inp && !inp.readOnly && !inp.disabled && (inp.value ?? "").trim() !== "";
    }) as HTMLElement[];
    const plan = [
      { stick: 0, ticks: 0 },
      { stick: 1, ticks: 0 },
      { stick: 0, ticks: 1 },
      { stick: 0, ticks: 2 },
    ];
    const got: Record<string, unknown>[] = [];
    plan.forEach((p, k) => {
      const c = cells[k];
      if (!c) return;
      c.style.setProperty("--color-user-ink", tin[p.stick].light);
      const host = (c.querySelector(".glyph-svg")?.parentElement ?? c) as HTMLElement;
      if (p.ticks > 0) {
        const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        t.setAttribute("viewBox", `0 0 ${p.ticks * 7 + 4} 10`);
        t.setAttribute("aria-hidden", "true");
        t.style.position = "absolute";
        t.style.left = "50%";
        t.style.bottom = "3px";
        t.style.transform = "translateX(-50%)";
        t.style.width = `${p.ticks * 7 + 4}px`;
        t.style.height = "10px";
        t.style.pointerEvents = "none";
        for (let i = 0; i < p.ticks; i++) {
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          const x = 3 + i * 7;
          path.setAttribute("d", `M ${x - 0.4} 1.5 Q ${x + 0.6} 5 ${x - 0.2} 8.5`);
          path.setAttribute("stroke", "var(--color-user-ink)");
          path.setAttribute("stroke-width", "1.6");
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("fill", "none");
          t.appendChild(path);
        }
        getComputedStyle(host).position === "static" && (host.style.position = "relative");
        host.appendChild(t);
      }
      const input = c.querySelector("input");
      got.push({
        k,
        stick: tin[p.stick].name,
        ticks: p.ticks,
        ink: getComputedStyle(c).getPropertyValue("--color-user-ink").trim(),
        accessibleName: input?.getAttribute("aria-label") ?? "(no input)",
        rect: (() => {
          const r = c.getBoundingClientRect();
          return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
        })(),
      });
    });
    return got;
  }, TIN5);
  const eng = info.project.name;
  for (const r of out)
    say(
      `T3|${eng}|cell ${r.k} pencil ${r.stick} ticks ${r.ticks} ink ${r.ink} · name "${r.accessibleName}"`,
    );
  if (eng === "chromium" && out.length) {
    const rs = out.map((o) => o.rect as { x: number; y: number; w: number; h: number });
    const x0 = Math.min(...rs.map((r) => r.x)), y0 = Math.min(...rs.map((r) => r.y));
    const x1 = Math.max(...rs.map((r) => r.x + r.w)), y1 = Math.max(...rs.map((r) => r.y + r.h));
    say(`T3|${eng}|crop box ${(x1 - x0).toFixed(1)}x${(y1 - y0).toFixed(1)} at (${x0.toFixed(1)},${y0.toFixed(1)}) dpr3`);
    await page.screenshot({
      path: path.join(OUT, "frames/tick-on-a-digit-dpr3.png"),
      clip: { x: Math.max(0, x0 - 6), y: Math.max(0, y0 - 6), width: x1 - x0 + 12, height: y1 - y0 + 12 },
    });
  }
  await ctx.close();
});

test.afterAll(() => {
  fs.appendFileSync(path.join(OUT, "out/live-probe.txt"), log.join("\n") + "\n");
});
