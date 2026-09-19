/**
 * T9-W7 pass 1 · MRK-LIVE — TWO ARMS THE FAMILY OWES.
 *
 *  A. THE DECK. §3.7's ring has exactly one owner and it is the `aria-activedescendant` card.
 *     A focus-driven singleton follows DOM FOCUS, which on the deck is the SCROLLPORT — the one
 *     element §3.7 forbids a ring on. Measured: does a `focusin` singleton paint at all, what
 *     does it ring when it does, and does stepping the deck (`ArrowRight`) move it?
 *
 *  B. THE WASH. `.cell-peer` is a CSS box (σ 0 by construction). Replace it with a FILLED
 *     wobble path on the cell's own seed and read the fill's 3:1 from painted bytes against
 *     (i) the unwashed neighbour and (ii) the incumbent 7% box, both themes.
 */
import { test, expect, type Page } from "@playwright/test";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
const RING = readFileSync(join(HERE, "..", "proto", "focus-ring.js"), "utf8");
const WASH = readFileSync(join(HERE, "..", "proto", "peer-wash.js"), "utf8");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1400);
}

test("MRK-LIVE-r7 THE DECK — what a focus-driven ring rings when the owner is activedescendant", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("./?view=gallery&size=3&difficulty=EASY");
  await page.waitForSelector(".game-gallery", { timeout: 30000 });
  await page.waitForSelector("#gallery-card-0 .boil-pose", { timeout: 30000 });
  await page.waitForTimeout(700);

  await page.evaluate(RING);
  await page.evaluate(() => (window as any).__houseRing.init());
  await page.evaluate(() =>
    (window as any).__houseRing.install({ mode: "singleton", follow: "events" }),
  );
  await page.evaluate(() => (window as any).__houseRing.suppressIncumbents());

  const read = async (label: string) =>
    page.evaluate((l) => {
      const vp = document.querySelector<HTMLElement>(".gallery-viewport")!;
      const ad = vp.getAttribute("aria-activedescendant");
      const card = ad ? document.getElementById(ad) : null;
      const svg = document.querySelector(".house-focus-ring") as SVGElement | null;
      const r = svg?.getBoundingClientRect();
      const v = vp.getBoundingClientRect();
      const c = card?.getBoundingClientRect();
      const R = (x: number) => Math.round(x * 10) / 10;
      return {
        label: l,
        activeElement:
          (document.activeElement?.getAttribute("class") || document.activeElement?.tagName || "")
            .split(/\s+/)[0] ?? null,
        activeDescendant: ad,
        ringPainted: !!svg && svg.style.display !== "none" && (r?.width ?? 0) > 0,
        ringWidth: r ? R(r.width) : null,
        viewportWidth: R(v.width),
        cardWidth: c ? R(c.width) : null,
        ringsTheScrollport: !!r && Math.abs(r.width - v.width) < 20,
        ringsTheCard: !!r && !!c && Math.abs(r.width - c.width) < 20,
      };
    }, label);

  const onMount = await read("after install, no focus event yet");
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.waitForTimeout(200);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".gallery-viewport")?.focus(),
  );
  await page.waitForTimeout(400);
  const onFocus = await read("scrollport focused");
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(700);
  const onStep = await read("after ArrowRight (activedescendant moved)");

  const out = { engine: browserName, onMount, onFocus, onStep };
  bank(`deck-ring-${browserName}.json`, out);
  console.log("DECKRING2 " + JSON.stringify(out, null, 2));
  expect(out).toBeTruthy();
});

test.describe("dpr3", () => {
  test.use({ deviceScaleFactor: 3 });

  test("MRK-LIVE-w THE WASH as a filled path — 3:1 from painted bytes", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "painted-byte read-back on one engine");
    const lum = (c: number[]) => {
      const f = (x: number) => {
        const v = x / 255;
        return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
    };
    const ratio = (a: number[], b: number[]) => {
      const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
      return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
    };
    const centre = async (buf: Buffer) => {
      const { data, info } = await sharp(buf)
        .raw()
        .toBuffer({ resolveWithObject: true });
      const x = Math.floor(info.width / 2);
      const y = Math.floor(info.height / 2);
      const i = (y * info.width + x) * info.channels;
      return [data[i], data[i + 1], data[i + 2]];
    };

    const rows: unknown[] = [];
    for (const scheme of ["light", "dark"] as const) {
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
      await page.setViewportSize({ width: 1280, height: 800 });
      await boardReady(page);
      await page.evaluate(() => {
        const inputs = Array.from(
          document.querySelectorAll(".game-cell input"),
        ) as HTMLInputElement[];
        inputs[40]?.focus();
      });
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(500);

      const boxes = await page.evaluate(() => {
        const peer = document.querySelector(".cell-peer")!.closest(".game-cell")!;
        const all = Array.from(document.querySelectorAll(".game-cell"));
        const plain = all.find(
          (c) => !c.querySelector(".cell-peer") && !c.querySelector(".glyph-svg"),
        )!;
        const box = (el: Element) => {
          const r = el.getBoundingClientRect();
          return {
            x: Math.round(r.x + r.width * 0.35),
            y: Math.round(r.y + r.height * 0.35),
            width: Math.max(6, Math.round(r.width * 0.3)),
            height: Math.max(6, Math.round(r.height * 0.3)),
          };
        };
        return { peer: box(peer), plain: box(plain) };
      });

      const incumbentWash = await centre(await page.screenshot({ clip: boxes.peer }));
      const ground = await centre(await page.screenshot({ clip: boxes.plain }));

      // Install the filled-path wash on the same seed and re-read the SAME crop.
      await page.evaluate(WASH);
      await page.evaluate(() => (window as any).__peerWash.init());
      const installed = await page.evaluate(() =>
        (window as any).__peerWash.install({ opacity: 0.07 }),
      );
      await page.waitForTimeout(400);
      const pathWash = await centre(await page.screenshot({ clip: boxes.peer }));

      await page.evaluate(() => (window as any).__peerWash.setOpacity(0.13));
      await page.waitForTimeout(300);
      const pathWash13 = await centre(await page.screenshot({ clip: boxes.peer }));

      rows.push({
        scheme,
        installed,
        groundRgb: ground,
        incumbentBoxRgb: incumbentWash,
        incumbentVsGround: ratio(incumbentWash, ground),
        filledPathRgb: pathWash,
        filledPathVsGround: ratio(pathWash, ground),
        filledPathVsIncumbentBox: ratio(pathWash, incumbentWash),
        filledPath13Rgb: pathWash13,
        filledPath13VsGround: ratio(pathWash13, ground),
        note:
          "1.4.11 does not gate a decorative unit wash; these are reported so the family " +
          "cannot claim a contrast it did not measure.",
      });
    }
    bank("wash-contrast.json", { engine: browserName, rows });
    console.log("WASH " + JSON.stringify(rows, null, 2));
    expect(rows.length).toBe(2);
  });
});

test("MRK-LIVE-w2 THE WASH's EDGE — σ over space, against the ring's own band", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.setViewportSize({ width: 1280, height: 800 });
  await boardReady(page);
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs[40]?.focus();
  });
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(500);
  await page.evaluate(WASH);
  await page.evaluate(() => (window as any).__peerWash.init());
  const installed = await page.evaluate(() =>
    (window as any).__peerWash.install({ opacity: 0.07 }),
  );
  await page.waitForTimeout(300);

  const sigma = await page.evaluate((sels) => {
    const out: Record<string, unknown> = {};
    for (const sel of sels) {
      const els = Array.from(document.querySelectorAll(sel)) as any[];
      const rows: number[] = [];
      for (const el of els.slice(0, 120)) {
        const svg = el.ownerSVGElement;
        if (!svg) continue;
        const vb = svg.viewBox.baseVal;
        const scale = svg.getBoundingClientRect().width / (vb.width || 1);
        const total = el.getTotalLength();
        if (!total) continue;
        const pts: [number, number][] = [];
        for (let i = 0; i <= 32; i++) {
          const p = el.getPointAtLength(total * (0.02 + 0.21 * (i / 32)));
          pts.push([p.x * scale, p.y * scale]);
        }
        const [ax, ay] = pts[0];
        const [bx, by] = pts[pts.length - 1];
        const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
        let s = 0;
        for (const [x, y] of pts) {
          const d = Math.abs((x - ax) * dy - (y - ay) * dx) / len;
          s += d * d;
        }
        rows.push(Math.sqrt(s / pts.length));
      }
      const m = rows.length ? rows.reduce((a, b) => a + b, 0) / rows.length : null;
      out[sel] = {
        n: rows.length,
        sigmaPxMean: m === null ? null : Math.round(m * 10000) / 10000,
      };
    }
    // The incumbent has no geometry at all.
    const box = document.querySelector(".cell-peer");
    out["incumbent .cell-peer"] = {
      tag: box?.tagName ?? null,
      hasGeometry: false,
      sigmaPx: 0,
      reason: "a CSS box: the perpendicular residual is 0 by construction, not by measurement",
    };
    return out;
  }, [".peer-wash-path", ".cell-ghost-path"]);

  const out = { engine: browserName, installed, sigma };
  bank(`wash-sigma-${browserName}.json`, out);
  console.log("WASHSIGMA " + JSON.stringify(out, null, 2));
  expect(out).toBeTruthy();
});
