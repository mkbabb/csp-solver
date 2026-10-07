import { chromium, webkit } from "@playwright/test";
const port = process.argv[2] || "4234";
for (const [name, bt] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await bt.launch();
  const out = [];
  for (let k = 0; k < 6; k++) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage();
    await p.goto(`http://127.0.0.1:${port}/`);
    await p.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
    await p.waitForSelector(".controls-card .ctrl-btn", { timeout: 20000 });
    const tr = await p.evaluate(() => {
      const o = document.querySelector(".controls-card .ctrl-options");
      const cs = getComputedStyle(o);
      return { tp: cs.transitionProperty, td: cs.transitionDuration, gap: cs.columnGap + "/" + cs.rowGap, anims: document.getAnimations().length, prm: matchMedia("(prefers-reduced-motion: reduce)").matches };
    });
    await p.addStyleTag({ content: ".ctrl-options { gap: 0 !important }" });
    const r = await p.evaluate(() => {
      const o = document.querySelector(".controls-card .ctrl-options");
      const sync = getComputedStyle(o).columnGap + "/" + getComputedStyle(o).rowGap;
      const an = o.getAnimations().map((a) => a.transitionProperty || a.animationName);
      return { sync, an };
    });
    out.push({ ...tr, ...r });
    await ctx.close();
  }
  console.log(name, JSON.stringify(out));
  await b.close();
}
