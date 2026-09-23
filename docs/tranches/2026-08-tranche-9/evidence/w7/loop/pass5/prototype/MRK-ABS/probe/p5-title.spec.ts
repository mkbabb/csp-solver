/** Does the forced-colours deck title fade on the lane, or was crop p5-3 shot mid draw-in? Timed series, both arms. */
import { test } from "@playwright/test";
import fs from "node:fs";
import { mintSudoku } from "./abs-lib";
const RAW = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/raw";
const ARM: Record<string, string> = { A: "http://127.0.0.1:4239", HEAD: "http://127.0.0.1:4240" };
test("title", async ({ page }, info) => {
  test.setTimeout(300000);
  const e = info.project.name; const out: Record<string, unknown[]> = {};
  for (const forced of ["active", "none"] as const) for (const arm of ["A", "HEAD"]) {
    await page.emulateMedia({ forcedColors: forced });
    await page.goto(`${ARM[arm]}/?view=gallery&size=3&board=${mintSudoku(3)}`);
    await page.waitForSelector(".staging-band", { timeout: 30000 }); await page.waitForTimeout(900);
    await page.locator(".gallery-viewport").focus(); await page.keyboard.press("Shift");
    const series: unknown[] = [];
    for (const t of [900, 1600, 3000, 6000]) {
      await page.waitForTimeout(t - (series.length ? [900, 1600, 3000, 6000][series.length - 1] : 0));
      const c = (await page.locator(".game-card.is-center").boundingBox())!;
      const buf = await page.screenshot({ clip: { x: c.x + c.width * 0.25, y: c.y + 8, width: c.width * 0.5, height: 44 } });
      fs.writeFileSync(`${RAW}/titlef-${arm}-${forced}-${t}-${e}.png`, buf);
      const dark = await page.evaluate(async (b64) => {
        const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
        const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
        const x = cv.getContext("2d")!; x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, cv.width, cv.height).data;
        let n = 0, minL = 255; for (let i = 0; i < d.length; i += 4) { const l = (d[i] + d[i + 1] + d[i + 2]) / 3; if (l < 100) n++; if (l < minL) minL = l; }
        return { darkPx: n, minL: Math.round(minL) };
      }, buf.toString("base64"));
      const anims = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
      series.push({ t, ...dark, runningAnims: anims });
    }
    out[`${arm}-${forced}`] = series;
  }
  fs.writeFileSync(`${RAW}/titlef-${e}.json`, JSON.stringify(out, null, 1));
  console.log(e, JSON.stringify(out));
});
