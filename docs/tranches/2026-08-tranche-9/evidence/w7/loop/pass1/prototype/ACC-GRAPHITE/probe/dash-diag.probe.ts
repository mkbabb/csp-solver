/** Why does WebKit paint 4x the ticks? One page, three questions. */
import { test, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=HARD";

async function boot(page: Page) {
  await page.goto(SOLO);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.waitForTimeout(900);
}

test("dash diagnosis", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);
  // write three digits
  const empties: number[] = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell"))
      .map((c, i) => ({ i, v: c.querySelector<HTMLInputElement>("input")?.value }))
      .filter((c) => !c.v)
      .slice(0, 3)
      .map((c) => c.i),
  );
  for (const i of empties) {
    await page.evaluate((n: number) => {
      document
        .querySelectorAll<HTMLElement>(".sudoku-cell")
        [n].querySelector<HTMLInputElement>("input")
        ?.focus();
    }, i);
    await page.keyboard.type("1");
  }
  await page.waitForTimeout(600);
  const info = await page.evaluate(() => {
    const paths = Array.from(document.querySelectorAll<SVGPathElement>(".progress-trace"));
    const poses = Array.from(document.querySelectorAll<HTMLElement>(".progress-pose"));
    const p = paths[0];
    const d = p?.getAttribute("d") ?? "";
    return {
      poseCount: poses.length,
      poseOpacities: poses.map((g) => getComputedStyle(g).opacity),
      poseActive: poses.map((g) => g.classList.contains("is-active")),
      pathCount: paths.length,
      subpaths: (d.match(/M/gi) || []).length,
      zCount: (d.match(/Z/gi) || []).length,
      dLen: d.length,
      totalLength: +(p?.getTotalLength() ?? 0).toFixed(1),
      dash: p ? getComputedStyle(p).strokeDasharray : null,
      // what each pose's own path draws
      perPose: paths.map((q) => ({
        len: +q.getTotalLength().toFixed(1),
        dash: getComputedStyle(q).strokeDasharray,
        opacity: getComputedStyle(q.parentElement as Element).opacity,
      })),
    };
  });
  console.log(browserName, JSON.stringify(info, null, 1));

  // How many ink runs does the WHOLE board show, and how many with only the ACTIVE pose?
  const b = await page.evaluate(() => {
    const s2 = document.querySelector<SVGSVGElement>("svg.hand-drawn-grid")!;
    const r = s2.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  const style = async (css: string) => {
    await page.evaluate((t: string) => {
      let el = document.getElementById("diag") as HTMLStyleElement | null;
      if (!el) {
        el = document.createElement("style");
        el.id = "diag";
        document.head.appendChild(el);
      }
      el.textContent = t;
    }, css);
    await page.waitForTimeout(250);
  };
  const countRuns = async (): Promise<number> => {
    const clip = { x: b.x - 16, y: b.y - 16, width: b.w + 32, height: b.h + 32 };
    const on = await page.screenshot({ type: "png", clip });
    await style(".progress-pose { display: none !important }");
    const off = await page.screenshot({ type: "png", clip });
    await style("");
    const sharp = (await import("sharp")).default;
    const A = await sharp(on).raw().toBuffer({ resolveWithObject: true });
    const B = await sharp(off).raw().toBuffer({ resolveWithObject: true });
    const w = A.info.width, h = A.info.height, ch = A.info.channels;
    const mask = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const o = i * ch;
      const d = Math.abs(A.data[o] - B.data[o]) + Math.abs(A.data[o + 1] - B.data[o + 1]) + Math.abs(A.data[o + 2] - B.data[o + 2]);
      if (d >= 8) mask[i] = 1;
    }
    const seen = new Uint8Array(w * h);
    let runs = 0;
    const stack: number[] = [];
    for (let i = 0; i < w * h; i++) {
      if (!mask[i] || seen[i]) continue;
      let n = 0;
      stack.push(i); seen[i] = 1;
      while (stack.length) {
        const j = stack.pop()!;
        n++;
        const jx = j % w, jy = (j - (j % w)) / w;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = jx + dx, ny = jy + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const k = ny * w + nx;
          if (mask[k] && !seen[k]) { seen[k] = 1; stack.push(k); }
        }
      }
      if (n >= 6) runs++;
    }
    return runs;
  };
  const all = await countRuns();
  console.log(browserName, "runs, as the component paints them:", all);
  for (const dash of ["100 4000", "100 10000", "50 100", "200 3800", "400 400"]) {
    await style(`.progress-trace { stroke-dasharray: ${dash} !important }`);
    const n = await countRuns();
    console.log(browserName, `dasharray "${dash}" ->`, n, "runs");
  }
  await style("");
});
