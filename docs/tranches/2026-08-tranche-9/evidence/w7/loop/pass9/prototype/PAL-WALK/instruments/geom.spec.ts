import { test } from "@playwright/test";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
test("geom", async ({ page }) => {
  await page.goto(`./?board=${BOARD}&wire=local`);
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 40000 });
  await page.waitForTimeout(2500);
  const r = await page.evaluate(async () => {
    const cell = document.querySelectorAll<HTMLElement>(".game-cell")[40];
    const m = (await import("/src/games/shared/playerIdentity.ts" as string)) as { inkFor: (n: number) => Record<string, string> };
    cell.style.setProperty("--color-peer-cursor-ink", m.inkFor(6)["--color-peer-cursor-ink"]);
    cell.classList.add("is-peer-cursor");
    await new Promise((res) => setTimeout(res, 600));
    const path = cell.querySelector(".cell-ghost-path") as SVGGraphicsElement;
    const svg = path.ownerSVGElement!;
    const R = (e: Element) => { const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(1)); };
    const cs = getComputedStyle(path);
    const pr = path.getBoundingClientRect();
    const hit = (x: number, y: number) => { const e = document.elementFromPoint(x, y); return e ? `${e.tagName}.${[...e.classList].join(".")}` : null; };
    return { cell: R(cell), svg: R(svg), path: R(path), stroke: cs.stroke, sw: cs.strokeWidth, svgOverflow: getComputedStyle(svg).overflow, cellOverflow: getComputedStyle(cell).overflow, clip: getComputedStyle(cell).clipPath,
      leftHit: hit(pr.x + 1, pr.y + pr.height / 2), topHit: hit(pr.x + pr.width / 2, pr.y + 1), rightHit: hit(pr.right - 1, pr.y + pr.height / 2),
      neighbourZ: getComputedStyle(document.querySelectorAll(".game-cell")[39]).zIndex, z: getComputedStyle(cell).zIndex, parent: cell.parentElement?.className };
  });
  console.log(JSON.stringify(r));
});
