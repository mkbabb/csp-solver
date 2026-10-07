// TAB-PEN pass-8 CRITIC: the served favicon (tree :4240 /icon.svg vs control :4252 /favicon.svg) through the
// PRODUCT HOME's glyph-pop by relative path; 16 CSS px DPR 1 and 32 DPR 2, light (#ffffff) / dark (#202124)
// strips, both engines. Also the tile's painted pixel (1,1) and the fringe fraction (<4.5) per cell.
import fs from "node:fs";
import os from "node:os";
import { fmt, glyphGate } from "../e2e/lib/glyph-pop.mjs";
import { playwright } from "../e2e/lib/paint-lib.mjs";
const [OUT] = process.argv.slice(2);
const load = () => os.loadavg().map((v) => v.toFixed(2)).join(" ");
const arms = {};
for (const [name, url] of [["tree-W", "http://127.0.0.1:4240/icon.svg"], ["control-main", "http://127.0.0.1:4252/favicon.svg"]]) {
  const svg = await (await fetch(url)).text();
  const ng = name === "tree-W" ? svg.replace(/<path [^>]*\/>/, "") : svg.replace(/<g clip-path[\s\S]*<\/g>\s*<\/g>/, "");
  if (ng === svg) throw new Error("ng twin identical for " + name);
  arms[name] = { url, ng: "data:image/svg+xml," + encodeURIComponent(ng) };
}
const lines = [`LOAD start ${load()}`];
for (const engine of ["chromium", "webkit"]) {
  const b = await playwright()[engine].launch();
  for (const [size, dpr] of [[16, 1], [32, 2]])
    for (const [scheme, bg] of [["light", "#ffffff"], ["dark", "#202124"]]) {
      const ctx = await b.newContext({ viewport: { width: 200, height: 120 }, deviceScaleFactor: dpr, colorScheme: scheme });
      const page = await ctx.newPage();
      for (const [arm, a] of Object.entries(arms)) {
        await page.setContent(`<!doctype html><style>html,body{margin:0;background:${bg}}#f{position:absolute;left:40px;top:40px;width:${size}px;height:${size}px}</style><img id="f" src="${a.url}">`);
        await page.waitForFunction(() => document.getElementById("f").complete && document.getElementById("f").naturalWidth > 0);
        await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
        const shot = await page.screenshot({ clip: { x: 41, y: 41, width: 1, height: 1 } });
        const px = await page.evaluate(async (b64) => { const i = await createImageBitmap(await (await fetch("data:image/png;base64," + b64)).blob()); const c = new OffscreenCanvas(i.width, i.height); const g = c.getContext("2d"); g.drawImage(i, 0, 0); return [...g.getImageData(0, 0, 1, 1).data.slice(0, 3)]; }, shot.toString("base64"));
        const tag = `${engine} ${scheme} ${size}px dpr${dpr} strip ${bg} ${arm}`;
        const g = await glyphGate(page, { subject: "#f", payload: `crit8:${arm}:${size}:${dpr}:${scheme}`, img: { ng: a.ng }, off: `#f { content: url("${a.ng}") !important; }`, textRun: false, glyphWindows: false });
        lines.push(`${tag} TILE(1,1) rgb(${px.join(",")}) CLEAN ${fmt(g.clean)} (bound ${g.bound?.toFixed(3) ?? "-"})`);
        for (const [n, r] of Object.entries(g.plants)) lines.push(`${tag} PLANT ${n} → ${r.red ? "RED" : "GREEN"} median ${r.median ?? "-"}`);
        console.log(lines.at(-8).slice(0, 220));
      }
      await ctx.close();
    }
  await b.close();
}
lines.push(`LOAD end ${load()}`);
fs.writeFileSync(OUT, lines.join("\n") + "\n");
