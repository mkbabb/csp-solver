import { test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/MOT-LADDER/readings";
mkdirSync(OUT, { recursive: true });

// π IDENTITY — a rect census of the three REST poses against the paired HEAD control
// (74a2b5d9). This family claims LENGTHS, so no rest pose it does not claim may move.
const POSES = [
  { name: "gallery-rest-1440x900", w: 1440, h: 900 },
  { name: "gallery-rest-390x844", w: 390, h: 844 },
  { name: "gallery-rest-768x1024", w: 768, h: 1024 },
];

test("pi · rect census of the rest poses vs 74a2b5d9", async ({ page, browserName }) => {
  test.setTimeout(300000);
  const rows: any[] = [];
  for (const p of POSES) {
    await page.setViewportSize({ width: p.w, height: p.h });
    const reads: Record<string, any[]> = {};
    for (const [tag, base] of [
      ["after", "http://127.0.0.1:4240"],
      ["control", "http://127.0.0.1:4247"],
    ] as const) {
      await page.goto(base + "/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1600); // the paper settles at 520; read after
      reads[tag] = await page.evaluate(() => {
        const out: Array<{ k: string; x: number; y: number; w: number; h: number }> = [];
        for (const el of Array.from(document.querySelectorAll("body *"))) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          const cls = typeof el.className === "string" ? el.className.slice(0, 40) : "";
          out.push({
            k: `${el.tagName}.${cls}#${el.id || ""}`,
            x: +r.x.toFixed(2),
            y: +r.y.toFixed(2),
            w: +r.width.toFixed(2),
            h: +r.height.toFixed(2),
          });
        }
        return out;
      });
    }
    const a = new Map(reads.after.map((r) => [r.k, r]));
    const c = new Map(reads.control.map((r) => [r.k, r]));
    let maxDelta = 0;
    let moved = 0;
    const movers: any[] = [];
    for (const [k, r] of a) {
      const o = c.get(k);
      if (!o) continue;
      const d = Math.max(
        Math.abs(r.x - o.x), Math.abs(r.y - o.y), Math.abs(r.w - o.w), Math.abs(r.h - o.h),
      );
      if (d > maxDelta) maxDelta = d;
      if (d > 0.005) { moved++; if (movers.length < 12) movers.push({ k, after: r, control: o, d: +d.toFixed(3) }); }
    }
    rows.push({
      pose: p.name, browserName,
      rectsAfter: reads.after.length, rectsControl: reads.control.length,
      pairedRects: [...a.keys()].filter((k) => c.has(k)).length,
      maxDelta: +maxDelta.toFixed(3), movedRects: moved, movers,
    });
    writeFileSync(`${OUT}/pi-rects-${browserName}.json`, JSON.stringify(rows, null, 1) + "\n");
  }
});
