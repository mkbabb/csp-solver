// favicon-glyph.mjs — TAB-PEN pass 7: the chair's glyph-population probe (pass7/instruments/glyph-pop.mjs, copied beside
// this file with the PROPOSED `off` + IMG_PLANTS extension, glyph-pop.PROPOSED.diff) run on the favicon as an <img>:
// ON = the arm's svg, OFF = its paper-only twin (the ground under the ink, pixel for pixel), clauses G1-G4 as the chair
// cut them (floor 4.5 absolute, EMPTY/thin RED, the fraction under 4.5 bounded at the clean read + 0.05, the per-slice
// core). Every image plant must RED in the same run. Cells: 16 px DPR 1 and 32 px DPR 2 (the tab), light and dark
// schemes on Chrome's light-active (#ffffff) and dark-strip (#202124), chromium and webkit.
// usage: node favicon-glyph.mjs <file://…/serve-arms dir> <arms csv> <out.txt>
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import os from "node:os";
import { glyphPopulation, IMG_PLANTS } from "./glyph-pop.mjs";
const require = createRequire(process.env.FE_PKG ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [ORIGIN, ARMS, OUT] = process.argv.slice(2);
const lines = [`SLICES16 ${process.env.SLICES16 ?? 16} · SLACK ${process.env.SLACK ?? 0.05}`, `LOAD start ${os.loadavg().map((v) => v.toFixed(2)).join(" ")}`];
let hole = false;
for (const engine of ["chromium", "webkit"]) {
  const b = await pw[engine].launch();
  for (const [size, dpr] of [[16, 1], [32, 2]])
    for (const [scheme, bg] of [["light", "#ffffff"], ["dark", "#202124"]]) {
      const ctx = await b.newContext({ viewport: { width: 220, height: 220 }, deviceScaleFactor: dpr, colorScheme: scheme });
      const page = await ctx.newPage();
      for (const arm of ARMS.split(",")) {
        await page.goto(`${ORIGIN}/strip.html?svg=${arm}.svg&size=${size}&bg=${encodeURIComponent(bg)}&n=1`);
        await page.waitForFunction(() => document.getElementById("f").complete && document.getElementById("f").naturalWidth > 0);
        await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
        const off = `#f { content: url("${arm}-ng.svg") !important; }`;
        // SLICES16 (default 16): G4's column count at 16 px DPR 1, where the ink spans ~10 device px and 16 columns
        // hold < 8 px each (G4 blind: TAIL12 read GREEN in the first run). SLACK (default 0.05): G3's bound over the clean read.
        const slices = size * dpr <= 16 ? +(process.env.SLICES16 ?? 16) : 16;
        const opts = { subject: "#f", off, slices };
        const clean = await glyphPopulation(page, opts);
        const bound = clean.fracUnder + +(process.env.SLACK ?? 0.05);
        const tag = `${engine} ${scheme} ${size}px dpr${dpr} strip ${bg} ${arm}`;
        const fmt = (r) => `pop ${r.population ?? 0} median ${r.coreMedian ?? "-"} <4.5 ${r.fracUnder ?? "-"} → ${r.red ? "RED " + r.why.join("; ") : "GREEN"}`;
        const bounded = await glyphPopulation(page, { ...opts, fracBound: bound });
        lines.push(`${tag} CLEAN ${fmt(bounded)} (bound ${bound.toFixed(3)})`);
        for (const [name, css] of Object.entries(IMG_PLANTS("#f", `${arm}-ng.svg`))) {
          const t = await page.addStyleTag({ content: css });
          await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
          const r = await glyphPopulation(page, { ...opts, fracBound: bound });
          await t.evaluate((e) => e.remove());
          if (!r.red) hole = true;
          lines.push(`${tag} PLANT ${name} ${fmt(r)}`);
        }
        console.log(lines.slice(-7).map((l) => l.slice(0, 160)).join("\n"));
      }
      await ctx.close();
    }
  await b.close();
}
lines.push(`LOAD end ${os.loadavg().map((v) => v.toFixed(2)).join(" ")}`, hole ? "HOLE: a plant read GREEN" : "every plant RED");
writeFileSync(OUT, lines.join("\n") + "\n");
process.exit(hole ? 3 : 0);
