// one-pixel tile reads: the served-identical icon.svg (W) as <img> 16 px DPR 1, both engines, both schemes
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const [ORIGIN] = process.argv.slice(2);
for (const [name, e] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await e.launch();
  for (const scheme of ["light", "dark"]) {
    const ctx = await b.newContext({ viewport: { width: 64, height: 64 }, deviceScaleFactor: 1, colorScheme: scheme });
    const p = await ctx.newPage();
    await p.goto(`${ORIGIN}/strip.html?svg=W.svg&size=16&bg=%23808080&n=1`);
    await p.waitForFunction(() => document.getElementById("f").complete && document.getElementById("f").naturalWidth > 0);
    await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const buf = await p.screenshot({ clip: { x: 8, y: 8, width: 16, height: 16 } });
    const px = await p.evaluate(async (b64) => { const img = await createImageBitmap(await (await fetch("data:image/png;base64," + b64)).blob()); const c = new OffscreenCanvas(16, 16); const g = c.getContext("2d"); g.drawImage(img, 0, 0); return [...g.getImageData(1, 1, 1, 1).data.slice(0, 3)]; }, buf.toString("base64"));
    console.log(`${name} ${scheme} tile(1,1) rgb(${px.join(",")})`);
    await ctx.close();
  }
  await b.close();
}
