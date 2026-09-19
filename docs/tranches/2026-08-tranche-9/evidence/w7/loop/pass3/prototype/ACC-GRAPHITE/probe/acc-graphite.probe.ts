/**
 * ACC-GRAPHITE pass-3 — the DOM-readable gates in one run.
 *
 * G2  the band IN THE RING'S OWN SPACE: stroke-width and the ghost svg's px/unit read off the
 *     SAME element, so the two numbers cannot be priced in different coordinate systems (the
 *     pass-2 15-16 px reading was a board-space number wearing a ghost-space label).
 * G3  the tally's SUBPATH count at k = 1/3/20/full on three boards, plus the tick's aspect.
 * G-WASH  `.cell-peer` nodes and how many of them carry a sub-unit opacity.
 * G5/G7  the retired tokens, read off the LIVE root rather than off the stylesheet.
 * G1  the chromatic census at rest / focused / mid-board.
 * G4  clue vs entry rendered thickness.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/ACC-GRAPHITE/readings";
mkdirSync(OUT, { recursive: true });

const RIGS = [
  { name: "desk", width: 1280, height: 800, dpr: 1, touch: false },
  { name: "phone", width: 393, height: 699, dpr: 3, touch: true },
];

async function settle(page: Page) {
  await page.waitForSelector(".hand-drawn-grid", { timeout: 40_000 });
  await page.waitForTimeout(1800);
}

async function writeDigits(page: Page, k: number) {
  const cells = page.locator(".game-cell input:not([readonly])");
  const n = Math.min(k, await cells.count());
  for (let i = 0; i < n; i++) {
    await cells.nth(i).focus();
    await page.keyboard.type("1");
  }
  await page.waitForTimeout(500);
}

for (const rig of RIGS)
  for (const scheme of ["light", "dark"] as const)
    test(`${rig.name}-${scheme}`, async ({ browser }, info) => {
      const ctx = await browser.newContext({
        viewport: { width: rig.width, height: rig.height },
        deviceScaleFactor: rig.dpr,
        hasTouch: rig.touch,
        colorScheme: scheme,
      });
      const page = await ctx.newPage();
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await settle(page);

      // ── tokens on the LIVE root (G5 / G7) ────────────────────────────────
      const tokens = await page.evaluate(() => {
        const s = getComputedStyle(document.documentElement);
        const g = (n: string) => s.getPropertyValue(n).trim();
        return {
          crayonBlue: g("--color-crayon-blue"),
          progressInk: g("--color-progress-ink"),
          focusSketch: g("--color-focus-sketch"),
          groundWashUnit: g("--ground-wash-unit"),
          pencilGraphite: g("--color-pencil-graphite"),
          userInk: g("--color-user-ink"),
          crayonGreen: g("--color-crayon-green"),
          crayonOrange: g("--color-crayon-orange"),
          crayonRose: g("--color-crayon-rose"),
          crayonGold: g("--color-crayon-gold"),
        };
      });

      // ── G-WASH: select a cell, count .cell-peer and sub-unit opacity ─────
      await page.locator(".game-cell input:not([readonly])").first().focus();
      await page.waitForTimeout(400);
      const wash = await page.evaluate(() => {
        const peers = Array.from(document.querySelectorAll(".cell-peer"));
        const sub = peers.filter((e) => {
          const o = getComputedStyle(e).opacity;
          return o !== "" && Number(o) < 1;
        });
        const first = peers[0] ? getComputedStyle(peers[0]).backgroundColor : null;
        // the counterfactual: what graphite@6% over the card paints to
        const probe = document.createElement("div");
        probe.style.background =
          "color-mix(in srgb, var(--color-pencil-graphite) 6%, transparent)";
        document.body.appendChild(probe);
        const ref = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return { nodes: peers.length, subUnitOpacity: sub.length, painted: first, ref };
      });

      // ── G2: the band, in the ring's OWN space ───────────────────────────
      const band = await page.evaluate(() => {
        const cell = document.querySelector(".game-cell:has(input:focus-visible)")
          ? (document.querySelector(".game-cell:has(input:focus-visible)") as HTMLElement)
          : null;
        const read = (el: Element | null) => {
          if (!el) return null;
          const svg = (el as SVGGraphicsElement).ownerSVGElement;
          if (!svg) return null;
          const box = svg.getBoundingClientRect();
          const vb = svg.viewBox.baseVal;
          const perUnit = vb && vb.width ? box.width / vb.width : null;
          const cs = getComputedStyle(el);
          return {
            strokeWidthPx: parseFloat(cs.strokeWidth),
            fill: cs.fill,
            fillOpacity: cs.fillOpacity,
            stroke: cs.stroke,
            strokeOpacity: cs.strokeOpacity,
            svgBoxW: box.width,
            viewBoxW: vb ? vb.width : null,
            pxPerUnit: perUnit,
            strokeWidthUnits: perUnit ? parseFloat(cs.strokeWidth) / perUnit : null,
          };
        };
        const outer = cell?.querySelector(".cell-ghost-path") ?? null;
        const inner = cell?.querySelector(".cell-ghost-retrace") ?? null;
        const innerVisible = inner ? getComputedStyle(inner).display !== "none" : false;
        // the FRAME line, in the board's own space
        const frame = document.querySelector("svg.hand-drawn-grid .grid-line, svg.hand-drawn-grid path");
        let frameRead: Record<string, unknown> | null = null;
        if (frame) {
          const svg = (frame as SVGGraphicsElement).ownerSVGElement!;
          const box = svg.getBoundingClientRect();
          const vb = svg.viewBox.baseVal;
          const perUnit = box.width / vb.width;
          frameRead = {
            strokeWidthPx: parseFloat(getComputedStyle(frame).strokeWidth),
            pxPerUnit: perUnit,
            svgBoxW: box.width,
            viewBoxW: vb.width,
          };
        }
        // negative control: an UNfocused cell's retrace
        const other = Array.from(document.querySelectorAll(".game-cell")).find(
          (c) => !c.matches(":has(input:focus-visible)"),
        );
        const ctrl = other?.querySelector(".cell-ghost-retrace") ?? null;
        return {
          outer: read(outer),
          inner: read(inner),
          innerVisible,
          frame: frameRead,
          controlRetraceDisplay: ctrl ? getComputedStyle(ctrl).display : null,
        };
      });

      // ── G4: clue vs entry rendered thickness, 8 cells ────────────────────
      const authorship = await page.evaluate(() => {
        const paths = Array.from(
          document.querySelectorAll(".game-cell .glyph-svg path"),
        ) as SVGPathElement[];
        const rows = paths.slice(0, 40).map((p) => {
          const cell = p.closest(".game-cell");
          const input = cell?.querySelector("input") as HTMLInputElement | null;
          const svg = p.ownerSVGElement!;
          const box = svg.getBoundingClientRect();
          const vb = svg.viewBox.baseVal;
          const perUnit = vb && vb.width ? box.width / vb.width : 1;
          return {
            given: !!input?.readOnly,
            widthUnits: parseFloat(getComputedStyle(p).strokeWidth) / perUnit,
            widthPx: parseFloat(getComputedStyle(p).strokeWidth),
            stroke: getComputedStyle(p).stroke,
          };
        });
        return rows;
      });

      // ── G1: the chromatic census, as declared colours in use on the board ─
      const census = await page.evaluate(() => {
        const hues: Record<string, number> = {};
        const nodes = Array.from(document.querySelectorAll(".game-board *"));
        for (const n of nodes) {
          const cs = getComputedStyle(n);
          for (const prop of ["color", "fill", "stroke", "backgroundColor"]) {
            const v = (cs as unknown as Record<string, string>)[prop];
            const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(v ?? "");
            if (!m) continue;
            const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
            const a = m[4] === undefined ? 1 : Number(m[4]);
            if (a === 0) continue;
            const mx = Math.max(r, g, b),
              mn = Math.min(r, g, b);
            if (mx - mn < 12) continue; // achromatic within tolerance
            let h = 0;
            if (mx === r) h = (60 * ((g - b) / (mx - mn)) + 360) % 360;
            else if (mx === g) h = 60 * ((b - r) / (mx - mn)) + 120;
            else h = 60 * ((r - g) / (mx - mn)) + 240;
            const bin = `${Math.floor(h / 10) * 10}`;
            hues[bin] = (hues[bin] ?? 0) + 1;
          }
        }
        return hues;
      });

      // ── G3: the tally's subpaths at several k ────────────────────────────
      const tally: Record<string, unknown> = {};
      for (const k of [1, 3, 20]) {
        await page.reload({ waitUntil: "domcontentloaded" });
        await settle(page);
        await writeDigits(page, k);
        tally[`k${k}`] = await page.evaluate(() => {
          const p = document.querySelector(".progress-trace") as SVGPathElement | null;
          if (!p) return { subpaths: 0, d: null };
          const d = p.getAttribute("d") ?? "";
          const subs = (d.match(/M/g) ?? []).length;
          const svg = p.ownerSVGElement!;
          const box = svg.getBoundingClientRect();
          const perUnit = box.width / svg.viewBox.baseVal.width;
          // the first tick's own length, in px
          const first = d.split("M")[1] ?? "";
          const pts = (first.match(/-?[\d.]+,-?[\d.]+/g) ?? []).map((s) =>
            s.split(",").map(Number),
          );
          let len = 0;
          for (let i = 1; i < pts.length; i++)
            len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
          const cs = getComputedStyle(p);
          const strokePx = parseFloat(cs.strokeWidth);
          const poseTransform = getComputedStyle(
            p.closest(".progress-pose") as Element,
          ).transform;
          return {
            subpaths: subs,
            tickLenUnits: len,
            tickLenPx: len * perUnit,
            strokePx,
            aspect: (len * perUnit) / strokePx,
            dashArray: cs.strokeDasharray,
            pathLength: p.getAttribute("pathLength"),
            linecap: cs.strokeLinecap,
            poseTransform,
            pxPerUnit: perUnit,
          };
        });
      }

      const payload = {
        rig: rig.name,
        scheme,
        engine: info.project.name,
        base: process.env.PLAYWRIGHT_BASE_URL,
        tokens,
        wash,
        band,
        authorship,
        census,
        tally,
      };
      writeFileSync(
        `${OUT}/probe-${process.env.ARM ?? "proto"}-${rig.name}-${scheme}-${info.project.name}.json`,
        JSON.stringify(payload, null, 2),
      );
      await ctx.close();
    });
