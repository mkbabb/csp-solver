/**
 * NOTE-LEDGER pass-1 PROTOTYPE — L7 THE RUNG, on painted bytes.
 * Line one ≥ 12:1, line two ≥ 4.5:1, both themes, both engines, and line two's core never
 * red or gold (a refusal that has aged is a record, and records are pencil).
 */
import { test, expect } from "@playwright/test";
import sharp from "sharp";
import { boardReady, armHint, armRefusal, ledger, bank, r2 } from "./lib";

const lum = (c: number[]) => {
  const [r, g, b] = c.slice(0, 3).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: number, b: number) => {
  const [hi, lo] = [a, b].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
};

for (const rig of [
  { name: "390x844", width: 390, height: 844, dsf: 3, mobile: true },
  { name: "1280x800", width: 1280, height: 800, dsf: 2, mobile: false },
]) {
  for (const theme of ["light", "dark"] as const) {
    test(`L7 RUNG — ${rig.name} ${theme}`, async ({ browser, browserName }) => {
      const ctx = await browser.newContext({
        viewport: { width: rig.width, height: rig.height },
        deviceScaleFactor: rig.dsf,
        isMobile: rig.mobile && browserName === "chromium",
        hasTouch: rig.mobile,
      });
      const page = await ctx.newPage();
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      await boardReady(page);
      // POSE: the refusal ages UNDER a hint, so line one is graphite at full pressure and
      // line two is the demoted refusal — the pair the rung gate is about (a red line two is
      // what this family forbids, and this is the pose that would show it).
      await armRefusal(page);
      await armHint(page);
      await page.waitForTimeout(400);
      const lines = await ledger(page);

      const boxes = await page.evaluate(() =>
        [".board-margin .margin-note", ".board-margin .margin-note-previous"].map((sel) => {
          const el = document.querySelector(sel) as HTMLElement | null;
          if (!el) return null;
          const r = el.getBoundingClientRect();
          // the INK's own box, not the block's full width (line two is right-open)
          const w = Math.min(r.width, Math.max(8, el.scrollWidth || r.width));
          return {
            sel,
            x: r.x + window.scrollX,
            y: r.y + window.scrollY,
            w,
            h: r.height,
            color: getComputedStyle(el).color,
            cls: el.className,
          };
        }),
      );

      const painted: unknown[] = [];
      for (const b of boxes) {
        if (!b) continue;
        const buf = await page.screenshot({
          fullPage: true,
          clip: { x: b.x, y: b.y, width: Math.max(8, b.w), height: Math.max(8, b.h) },
        });
        const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
        const px: number[][] = [];
        for (let p = 0; p < data.length; p += info.channels) {
          px.push([data[p], data[p + 1], data[p + 2]]);
        }
        const lums = px.map(lum);
        const order = lums.map((v, i) => [v, i] as const).sort((a, z) => a[0] - z[0]);
        const paper = order[Math.floor(order.length / 2)][0];
        const extremeIdx = theme === "light" ? order[0][1] : order[order.length - 1][1];
        const coreIdx =
          theme === "light"
            ? order[Math.floor(order.length * 0.01)][1]
            : order[Math.floor(order.length * 0.99)][1];
        const corePx = px[coreIdx];
        const chroma = Math.max(...corePx) - Math.min(...corePx);
        painted.push({
          sel: b.sel,
          text: b.sel.includes("previous") ? lines.two : lines.one,
          cssColor: b.color,
          cls: b.cls,
          pixels: px.length,
          ratioExtreme: ratio(lums[extremeIdx], paper),
          ratioCore: ratio(lums[coreIdx], paper),
          corePixel: corePx,
          coreChroma: chroma,
          paperPixel: px[order[Math.floor(order.length / 2)][1]],
        });
      }

      const row = { rig: rig.name, theme, engine: browserName, lines, painted };
      bank(`ink-${rig.name}-${theme}-${browserName}.json`, row);
      console.log(
        `L7 ${rig.name} ${theme} ${browserName} ` +
          painted
            .map((p) => {
              const q = p as {
                sel: string;
                ratioCore: number;
                ratioExtreme: number;
                coreChroma: number;
                corePixel: number[];
              };
              return `${q.sel.includes("previous") ? "two" : "one"} core=${q.ratioCore}:1 extreme=${q.ratioExtreme}:1 chroma=${q.coreChroma} rgb(${q.corePixel.join(",")})`;
            })
            .join("  |  "),
      );

      const one = painted[0] as { ratioCore: number };
      const two = painted[1] as { ratioCore: number; coreChroma: number };
      expect(one.ratioCore, "line one (graphite) ≥ 12").toBeGreaterThanOrEqual(12);
      expect(two.ratioCore, "line two ≥ 4.5").toBeGreaterThanOrEqual(4.5);
      // A demoted refusal reads graphite: the core is achromatic, never the teacher's rose.
      expect(two.coreChroma, "line two's core is never red or gold").toBeLessThanOrEqual(12);
      await ctx.close();
      void r2;
    });
  }
}
