// ACC-SIX pass 7 · the live-filter COUNT at boot and at rest, both themes, both engines (charter row 5; LAWS P6 §E;
// INTAKE-23 §0 item 5's 11-vs-9). A live filter = an element (HTML or SVG) with computed `filter` != none, not
// display:none. BOOT = the max count over rAF samples from navigation to +3.0 s (a page-side sampler installed by
// addInitScript, so it sees the first frames); REST = the count after the page settles (+6 s). The dark extras are
// named by selector + value. usage: ARMS='control=http://127.0.0.1:4238,integ=http://127.0.0.1:4241,tree=http://127.0.0.1:4239' node p7-filtercount.mjs
import { chromium, webkit } from "./p7-common.mjs";
import { execSync } from "node:child_process";
const ARMS = Object.fromEntries((process.env.ARMS).split(",").map((a) => a.split("=")));
const INIT = () => { window.__fmax = 0; window.__fmaxAt = 0; const t0 = performance.now(); const tick = () => { const all = document.querySelectorAll("*"); let n = 0; for (const e of all) { const f = getComputedStyle(e).filter; if (f && f !== "none") n++; } if (n > window.__fmax) { window.__fmax = n; window.__fmaxAt = Math.round(performance.now() - t0); } if (performance.now() - t0 < 3000) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
const REST = () => { const out = []; for (const e of document.querySelectorAll("*")) { const cs = getComputedStyle(e); if (cs.filter && cs.filter !== "none" && cs.display !== "none") out.push(`${e.tagName.toLowerCase()}.${String(e.className?.baseVal ?? e.className ?? "").trim().split(/\s+/).slice(0, 2).join(".")} ⟨${cs.filter.slice(0, 40)}⟩`); } return out; };
for (const [en, L] of [["chromium", chromium], ["webkit", webkit]]) { const br = await L.launch();
  for (const scheme of ["light", "dark"]) for (const [arm, base] of Object.entries(ARMS)) {
    const ctx = await br.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: scheme });
    await ctx.addInitScript(INIT); const page = await ctx.newPage(); await page.goto(base + "/");
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 }); await page.waitForTimeout(6000);
    const asset = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop());
    const boot = await page.evaluate(() => [window.__fmax, window.__fmaxAt]); const rest = await page.evaluate(REST);
    const heart = rest.filter((r) => /crayon-heart/.test(r)).length;
    console.log(`${en} ${scheme} ${arm} ${asset} · BOOT max ${boot[0]} (at +${boot[1]} ms) · REST ${rest.length} (crayon-heart ${heart}) · load ${execSync("uptime").toString().split("averages:")[1].trim().split(" ")[0]}`);
    if (process.env.VERBOSE) console.log("   " + rest.join(" | "));
    await ctx.close();
  } await br.close(); }
