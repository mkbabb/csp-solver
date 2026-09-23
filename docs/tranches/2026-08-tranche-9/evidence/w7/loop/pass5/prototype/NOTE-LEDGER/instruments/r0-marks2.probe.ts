/**
 * T9-W7 round zero · lane R3 (THE MARKS) — second pass.
 *   R3-e  the deck ring's REACH vs its AIR (W3 §3.7 landed the motion; the look is W7 §6,
 *         and any house-hand ring has to fit inside the scrollport's clip)
 *   R3-f  focus-indicator CONTRAST against its own backdrop (WCAG 1.4.11's 3:1, un-gated here)
 *   R3-g  the hint note against the BOARD-CHANGING acts the first pass did not reach
 */
import { encodeSudoku } from "../e2e/wire";
const PINNED = "?board=" + encodeSudoku(3, {0:5,1:3,4:7,9:6,12:1,13:9,14:5,19:9,20:8,25:6,27:8,31:6,35:3,36:4,39:8,41:3,44:1,45:7,49:2,53:6,55:6,60:2,61:8,66:4,67:1,68:9,71:5,76:8,79:7,80:9}, 81);
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = process.env.R0_OUT!; // NOTE-LEDGER pass 5: re-pointed (r0 is frozen)
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, query = PINNED) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
}

test("R3-e THE DECK RING — reach, air, and who owns it", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("./?view=gallery&size=3&difficulty=EASY");
  await page.waitForSelector(".game-gallery", { timeout: 30000 });
  await page.waitForSelector("#gallery-card-0 .boil-pose", { timeout: 30000 });
  await page.evaluate(() => document.querySelector<HTMLElement>(".gallery-viewport")?.focus());
  await page.keyboard.press("Home");
  await page.waitForTimeout(900);

  const read = async () =>
    page.evaluate(() => {
      const vp = document.querySelector<HTMLElement>(".gallery-viewport");
      if (!vp) return null;
      const card = document.getElementById(vp.getAttribute("aria-activedescendant") ?? "");
      const owners: string[] = [];
      if (getComputedStyle(vp).outlineStyle !== "none") owners.push("the scrollport");
      for (const c of Array.from(document.querySelectorAll<HTMLElement>(".game-card")))
        if (getComputedStyle(c).outlineStyle !== "none") owners.push(c.id);
      if (!card) return { owners, activeDescendant: null };
      const cs = getComputedStyle(card);
      const reach = parseFloat(cs.outlineOffset) + parseFloat(cs.outlineWidth);
      const c = card.getBoundingClientRect();
      const v = vp.getBoundingClientRect();
      const r1 = (x: number) => Math.round(x * 10) / 10;
      return {
        owners,
        activeDescendant: card.id,
        focusVisible: vp.matches(":focus-visible"),
        outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
        outlineOffset: cs.outlineOffset,
        radius: cs.borderRadius,
        reachPx: r1(reach),
        airPx: [c.left - v.left, v.right - c.right, c.top - v.top, v.bottom - c.bottom].map(r1),
        headroomPx: r1(
          Math.min(c.left - v.left, v.right - c.right, c.top - v.top, v.bottom - c.bottom) - reach,
        ),
      };
    });

  const home = await read();
  await page.keyboard.press("End");
  await page.waitForTimeout(900);
  const end = await read();

  const report = { engine: browserName, home, end };
  bank(`${process.env.R0_ARM}-deckring-${browserName}.json`, report);
  console.log("DECKRING " + JSON.stringify(report));
  expect(home, "the deck must publish an active option").not.toBeNull();
});

test("R3-f FOCUS CONTRAST — every ring's own 1.4.11 number", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());

  const rows: unknown[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press("Tab");
    const row = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const parse = (s: string): [number, number, number, number] => {
        const m = /rgba?\(([^)]+)\)/.exec(s);
        if (m) {
          const p = m[1].split(/[, /]+/).map(Number);
          return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
        }
        const c = /color\(srgb ([^)]+)\)/.exec(s);
        if (c) {
          const p = c[1].split(/[ /]+/).map(Number);
          return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1];
        }
        return [0, 0, 0, 1];
      };
      const over = (f: [number, number, number, number], b: [number, number, number, number]) => {
        const a = f[3] + b[3] * (1 - f[3]);
        if (!a) return [0, 0, 0, 0] as [number, number, number, number];
        const ch = (i: number) => (f[i] * f[3] + b[i] * b[3] * (1 - f[3])) / a;
        return [ch(0), ch(1), ch(2), a] as [number, number, number, number];
      };
      const lum = (c: [number, number, number, number]) => {
        const f = (x: number) => {
          const v = x / 255;
          return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
      };
      // Backdrop: the first opaque ancestor background, composited up.
      const layers: [number, number, number, number][] = [];
      for (let n: Element | null = el; n; n = n.parentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c[3] > 0) layers.push(c);
        if (c[3] >= 1) break;
      }
      let bg: [number, number, number, number] = [255, 255, 255, 1];
      for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg);

      // The indicator: the element's own outline, or the cell ghost's stroke when the
      // affordance is a drawn path instead of a rect.
      const ghost = el.closest(".game-cell")?.querySelector(".cell-ghost-path") as SVGPathElement | null;
      const gcs = ghost ? getComputedStyle(ghost) : null;
      const isGhost = cs.outlineStyle === "none" && !!gcs;
      const raw = isGhost ? gcs!.stroke : cs.outlineColor;
      const alpha = isGhost ? parseFloat(gcs!.strokeOpacity || "1") : 1;
      const base = parse(raw);
      const ink = over([base[0], base[1], base[2], base[3] * alpha], bg);
      const [l1, l2] = [lum(ink), lum(bg)].sort((a, b) => b - a);
      return {
        cls: (el.getAttribute("class") || "").split(/\s+/)[0] || el.tagName.toLowerCase(),
        name: (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 28),
        indicator: isGhost ? "house hand (SVG ghost path)" : cs.outlineStyle === "auto" ? "UA default (outline:auto)" : `geometric rect (${cs.outlineWidth} ${cs.outlineStyle})`,
        widthPx: isGhost ? gcs!.strokeWidth : cs.outlineWidth,
        offsetPx: isGhost ? "n/a" : cs.outlineOffset,
        ink: raw,
        ratio: Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100,
      };
    });
    if (!row) break;
    if (seen.has(row.cls)) continue;
    seen.add(row.cls);
    rows.push(row);
  }
  bank(`${process.env.R0_ARM}-focus-contrast-${browserName}.json`, { engine: browserName, rows });
  console.log("FOCUSCONTRAST " + JSON.stringify(rows));
  expect(rows.length).toBeGreaterThan(5);
});

test("R3-g THE HINT NOTE — the board-changing acts", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });

  const note = () =>
    page.evaluate(() => {
      const n = document.querySelector(".margin-note");
      if (!n) return null;
      const ink = document.querySelector(".margin-note-ink");
      const r = (ink ?? n).getBoundingClientRect();
      return {
        text: (n.textContent || "").replace(/\s+/g, " ").trim(),
        opacity: getComputedStyle(n).opacity,
        visible: r.width > 0 && r.height > 0,
      };
    });

  async function armHint() {
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll(".game-cell input")) as HTMLInputElement[];
      inputs.find((i) => !i.value)?.focus();
    });
    await page.keyboard.press("h");
    await page.waitForTimeout(900);
    return note();
  }

  const clickByName = async (re: RegExp) => {
    await page.getByRole("button", { name: re }).first().click({ timeout: 6000 }).catch(() => {});
    await page.waitForTimeout(1400);
  };

  const acts: [string, () => Promise<void>][] = [
    ["second H press (consume the hint)", async () => { await page.keyboard.press("h"); await page.waitForTimeout(900); }],
    ["deal a new board", async () => { await clickByName(/deal/i); }],
    ["clear the board", async () => { await clickByName(/clear/i); await page.getByRole("button", { name: /clear|yes|discard/i }).last().click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(1400); }],
    ["fill forced", async () => { await clickByName(/fill/i); }],
    ["solve", async () => { await clickByName(/^solve/i); await page.waitForTimeout(2500); }],
  ];

  const rows: unknown[] = [];
  for (const [name, act] of acts) {
    await boardReady(page);
    const armed = await armHint();
    await act();
    rows.push({ act: name, armed, after: await note() });
  }
  bank(`${process.env.R0_ARM}-hintnote2-${browserName}.json`, { engine: browserName, rows });
  console.log("HINTNOTE2 " + JSON.stringify(rows));
  expect(rows.length).toBe(acts.length);
});
