/**
 * PAL-WALK pass-1 CRITIQUE — an INDEPENDENT read of the prototype's four headline numbers, off
 * the engine's own bytes, on the prototype's own server. Nothing here imports the prototype's
 * probes: the page is asked for the module's inks, the inks are painted, the bytes are read
 * back, and the arithmetic is done in node from the JSON this writes.
 *
 * Reads, per engine, per band: 144 painted ink triples, the two grounds, and the peer-cursor
 * ring's own DRAWN stroke-opacity off gameCell.css as the engine resolves it.
 */
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "../readings");

test("painted ink bytes, both bands", async ({ page }, info) => {
  await page.goto("/?game=sudoku");
  await page.waitForLoadState("networkidle");

  const data = await page.evaluate(async () => {
    const mod = (await import(
      /* @vite-ignore */ "/src/games/shared/playerIdentity.ts"
    )) as { inkFor: (i: number) => Record<string, string> };
    const cv = document.createElement("canvas");
    cv.width = cv.height = 4;
    const ctx = cv.getContext("2d", { willReadFrequently: true })!;
    const paint = (css: string): [number, number, number] => {
      ctx.clearRect(0, 0, 4, 4);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 4, 4);
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 4, 4);
      const d = ctx.getImageData(1, 1, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    const strings: string[] = [];
    for (let i = 0; i < 144; i++) strings.push(mod.inkFor(i)["--color-user-ink"]);
    const bands: Record<string, [number, number, number][]> = {};
    for (const L of ["0.5", "0.8"]) {
      bands[L] = strings.map((s) => paint(s.replace("var(--peer-ink-l)", L)));
    }
    // the grounds, as the product itself resolves them, in each theme
    const grounds: Record<string, Record<string, [number, number, number]>> = {};
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    for (const theme of ["light", "dark"]) {
      root.classList.toggle("dark", theme === "dark");
      const cs = getComputedStyle(root);
      grounds[theme] = {
        background: paint(cs.getPropertyValue("--color-background").trim()),
        card: paint(cs.getPropertyValue("--color-card").trim()),
      };
    }
    root.classList.toggle("dark", hadDark);
    // the ring's own drawn opacity, off the sheet rather than off the spec
    const probe = document.createElement("div");
    probe.className = "cell-ghost peer-cursor";
    document.body.appendChild(probe);
    const ringOpacity = getComputedStyle(probe).strokeOpacity;
    probe.remove();
    return { strings, bands, grounds, ringOpacity };
  });

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(
    path.join(OUT, `bytes-${info.project.name}.json`),
    JSON.stringify(data, null, 1),
  );
  expect(data.strings.length).toBe(144);
});
