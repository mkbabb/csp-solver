// TAB-PEN pass 8: the favicon's painted cells through the PRODUCT HOME's glyph-population probe
// (e2e/lib/glyph-pop.mjs by relative path; column count scaled to the ink span, OFF-pair compare,
// per-payload G3 bound, IMG_PLANTS). ON = the arm's svg as an <img>, OFF = its paper-only twin.
// Cells: 16 px DPR 1 and 32 px DPR 2, light (#ffffff strip) and dark (#202124 strip), both engines.
// usage (cwd web/frontend): node .tabpen8/favicon-glyph8.mjs <origin> <arms csv> <out.txt>
import { writeFileSync } from "node:fs";
import os from "node:os";
import { fmt, glyphGate } from "../e2e/lib/glyph-pop.mjs";
import { playwright } from "../e2e/lib/paint-lib.mjs";

const [ORIGIN, ARMS, OUT] = process.argv.slice(2);
const load = () => os.loadavg().map((v) => v.toFixed(2)).join(" ");
const lines = [`LOAD start ${load()}`];
let holes = 0;
let cleanRed = 0;
for (const engine of ["chromium", "webkit"]) {
  const b = await playwright()[engine].launch();
  for (const [size, dpr] of [[16, 1], [32, 2]])
    for (const [scheme, bg] of [["light", "#ffffff"], ["dark", "#202124"]]) {
      const ctx = await b.newContext({ viewport: { width: 220, height: 220 }, deviceScaleFactor: dpr, colorScheme: scheme });
      const page = await ctx.newPage();
      for (const arm of ARMS.split(",")) {
        await page.goto(`${ORIGIN}/strip.html?svg=${arm}.svg&size=${size}&bg=${encodeURIComponent(bg)}&n=1`);
        await page.waitForFunction(() => document.getElementById("f").complete && document.getElementById("f").naturalWidth > 0);
        await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
        const tag = `${engine} ${scheme} ${size}px dpr${dpr} strip ${bg} ${arm}`;
        const g = await glyphGate(page, {
          subject: "#f",
          payload: `tab:${arm}:${size}:${dpr}:${scheme}`,
          img: { ng: `${arm}-ng.svg` },
          off: `#f { content: url("${arm}-ng.svg") !important; }`,
          textRun: false,
          glyphWindows: false,
        });
        if (g.clean.red) cleanRed++;
        lines.push(`${tag} CLEAN ${fmt(g.clean)} columns ${g.clean.columns} (bound ${g.bound?.toFixed(3) ?? "-"})`);
        for (const [name, r] of Object.entries(g.plants)) {
          if (!r.red) holes++;
          lines.push(`${tag} PLANT ${name} ${fmt(r)} columns ${r.columns}`);
        }
        console.log(lines.slice(-8).map((l) => l.slice(0, 170)).join("\n"));
      }
      await ctx.close();
    }
  await b.close();
}
lines.push(`LOAD end ${load()}`, `clean RED ${cleanRed} · plant holes ${holes}`);
writeFileSync(OUT, lines.join("\n") + "\n");
process.exit(cleanRed ? (holes ? 4 : 1) : holes ? 3 : 0);
