/**
 * T9-W7 pass 2 · MRK-ABS PROTOTYPE — the three readings the band instrument could not take:
 *   1  `.drawer-tab` reads 2.96 / 2.68 with isTheRing=false. WHO is over the band?
 *   2  `.sun-moon-toggle` returns 0 changed samples — its ring sits 54px out and the banked
 *      instrument clips at M=40. Re-taken with a margin that holds the ornament offset.
 *   3  the `.text-foreground` stop computes `outline-style: none` — which node is it?
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import sharp from "sharp";

const OUT = process.env.PROBE_OUT ?? ".";
const FRAMES = process.env.FRAME_OUT ?? join(OUT, "..", "frames");
mkdirSync(OUT, { recursive: true });
type RGB = [number, number, number];
const lum = ([r, g, b]: RGB) => {
  const f = (x: number) => {
    const v = x / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a: RGB, b: RGB) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
};
const med = (v: number[]) => v.slice().sort((a, b) => a - b)[Math.floor(v.length / 2)];
async function raw(buf: Buffer) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
}
const at = (I: { data: Buffer; w: number; ch: number }, x: number, y: number): RGB => {
  const i = (y * I.w + x) * I.ch;
  return [I.data[i], I.data[i + 1], I.data[i + 2]];
};
async function setTheme(page: Page, dark: boolean) {
  await page.evaluate((d) => document.documentElement.classList.toggle("dark", d), dark);
  await page.waitForTimeout(200);
}

/** band read with a caller-chosen margin, and a per-side breakdown */
async function bandWide(page: Page, sel: string, M: number) {
  const el = page.locator(sel).first();
  const box = await el.boundingBox();
  if (!box) return { sel, found: 0 };
  const vp = page.viewportSize()!;
  const clip = {
    x: Math.max(0, Math.floor(box.x - M)),
    y: Math.max(0, Math.floor(box.y - M)),
    width: Math.min(vp.width - Math.max(0, Math.floor(box.x - M)), Math.ceil(box.width + M * 2)),
    height: Math.min(vp.height - Math.max(0, Math.floor(box.y - M)), Math.ceil(box.height + M * 2)),
  };
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.waitForTimeout(300);
  const before = await page.screenshot({ clip });
  await el.evaluate((n: HTMLElement) => n.focus());
  await page.waitForTimeout(500);
  const after = await page.screenshot({ clip });
  const st = await el.evaluate((n: HTMLElement) => {
    const cs = getComputedStyle(n);
    return {
      outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
      colour: cs.outlineColor,
      off: parseFloat(cs.outlineOffset) || 0,
      w: parseFloat(cs.outlineWidth) || 0,
    };
  });
  const A = await raw(before);
  const B = await raw(after);
  const bx = box.x - clip.x;
  const by = box.y - clip.y;
  const d = st.off + st.w / 2;
  const sides: Record<string, { changed: number; sampled: number; ratio: number | null; inks: RGB[] }> = {};
  for (const side of ["top", "bottom", "left", "right"]) {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
      const tw = box.width * 0.2 + box.width * 0.6 * (i / 10);
      const th = box.height * 0.2 + box.height * 0.6 * (i / 10);
      if (side === "top") pts.push([bx + tw, by - d]);
      if (side === "bottom") pts.push([bx + tw, by + box.height + d]);
      if (side === "left") pts.push([bx - d, by + th]);
      if (side === "right") pts.push([bx + box.width + d, by + th]);
    }
    const changed: { ink: RGB; ground: RGB }[] = [];
    let sampled = 0;
    for (const [fx, fy] of pts) {
      const x = Math.round(fx);
      const y = Math.round(fy);
      if (x < 0 || y < 0 || x >= A.w || y >= A.h) continue;
      sampled++;
      const a = at(A, x, y);
      const b = at(B, x, y);
      if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) > 12)
        changed.push({ ink: b, ground: a });
    }
    sides[side] = {
      changed: changed.length,
      sampled,
      ratio: changed.length
        ? ratio(
            [0, 1, 2].map((c) => med(changed.map((p) => p.ink[c]))) as RGB,
            [0, 1, 2].map((c) => med(changed.map((p) => p.ground[c]))) as RGB,
          )
        : null,
      inks: changed.slice(0, 3).map((p) => p.ink),
    };
  }
  // who is on top of each band point?
  const hits = await el.evaluate(
    (n: HTMLElement, dd: number) => {
      const r = n.getBoundingClientRect();
      const pts: [number, number][] = [
        [r.left + r.width / 2, r.top - dd],
        [r.left + r.width / 2, r.bottom + dd],
        [r.left - dd, r.top + r.height / 2],
        [r.right + dd, r.top + r.height / 2],
      ];
      return pts.map(([x, y]) => {
        const e = document.elementFromPoint(x, y) as HTMLElement | null;
        return e ? `${e.tagName.toLowerCase()}.${(e.className || "").toString().split(" ")[0]}` : null;
      });
    },
    st.off + st.w / 2,
  );
  return { sel, found: 1, ...st, box, sides, topOfBandAt: hits };
}

test("d1-drawer-tab", async ({ page, browserName }) => {
  const out: Record<string, unknown> = { engine: browserName };
  for (const dark of [false, true]) {
    await page.goto("/");
    await page.waitForSelector(".drawer-tab", { timeout: 20000 });
    await setTheme(page, dark);
    await page.waitForTimeout(500);
    out[dark ? "dark" : "light"] = await bandWide(page, ".drawer-tab", 40);
    if (browserName === "chromium") {
      const box = await page.locator(".drawer-tab").first().boundingBox();
      if (box)
        await page.screenshot({
          path: join(FRAMES, `diag-drawer-tab-${dark ? "dark" : "light"}.png`),
          clip: {
            x: Math.max(0, Math.floor(box.x - 26)),
            y: Math.max(0, Math.floor(box.y - 26)),
            width: Math.ceil(box.width + 52),
            height: Math.ceil(box.height + 52),
          },
          scale: "css",
        });
    }
  }
  writeFileSync(join(OUT, `diag-drawer-${browserName}.json`), JSON.stringify(out, null, 2));
  for (const k of ["light", "dark"])
    console.log(`[drawer ${browserName} ${k}]`, JSON.stringify((out[k] as { sides: unknown; topOfBandAt: unknown }).sides), JSON.stringify((out[k] as { topOfBandAt: unknown }).topOfBandAt));
});

test("d2-toggle-wide", async ({ page, browserName }) => {
  const out: Record<string, unknown> = { engine: browserName };
  for (const vp of [
    { width: 1280, height: 800 },
    { width: 393, height: 699 },
  ]) {
    await page.setViewportSize(vp);
    for (const dark of [false, true]) {
      await page.goto("/");
      await page.waitForSelector(".sun-moon-toggle", { timeout: 20000 });
      await setTheme(page, dark);
      await page.waitForTimeout(500);
      const key = `${vp.width}-${dark ? "dark" : "light"}`;
      out[key] = await bandWide(page, ".sun-moon-toggle", 90);
      const r = out[key] as { off: number; sides: Record<string, { changed: number; ratio: number | null }> };
      console.log(
        `[toggle ${browserName} ${key}] offset ${r.off} · ` +
          Object.entries(r.sides)
            .map(([s, v]) => `${s} ${v.changed} ${v.ratio}`)
            .join(" · "),
      );
    }
  }
  writeFileSync(join(OUT, `diag-toggle-${browserName}.json`), JSON.stringify(out, null, 2));
});

test("d3-outline-none-stops", async ({ page, browserName }) => {
  await page.goto("/");
  await page.waitForSelector(".game-cell", { timeout: 20000 });
  await page.waitForTimeout(500);
  const rows = await page.evaluate(() => {
    const sel = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const out: unknown[] = [];
    for (const n of Array.from(document.querySelectorAll<HTMLElement>(sel))) {
      const r = n.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      n.focus();
      const cs = getComputedStyle(n);
      if (cs.outlineStyle === "none" || cs.outlineStyle === "auto")
        out.push({
          tag: n.tagName.toLowerCase(),
          cls: (n.className || "").toString().slice(0, 80),
          outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
          focusVisible: n.matches(":focus-visible"),
          text: (n.textContent || "").trim().slice(0, 40),
          parent: (n.parentElement?.className || "").toString().slice(0, 50),
        });
    }
    return out;
  });
  writeFileSync(join(OUT, `diag-nonestops-${browserName}.json`), JSON.stringify(rows, null, 2));
  console.log(`[none-stops ${browserName}] ${rows.length}:`, JSON.stringify(rows, null, 1).slice(0, 1200));
});
