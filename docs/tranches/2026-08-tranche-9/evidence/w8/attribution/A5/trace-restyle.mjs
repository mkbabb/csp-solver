#!/usr/bin/env node
// RUN: cd web/frontend && node <thisdir>/trace-restyle.mjs --throttle 4 --port 4254 > <out.txt>
// The CDP trace half of lane A5: how many ELEMENTS the @theme flip restyles, and what the main
// thread actually does, on toggle 1 vs toggle 2. chromium only (devtools.timeline).
import { createRequire } from "node:module";
const { chromium } = createRequire(process.cwd() + "/package.json")("playwright");
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const THROTTLE = Number(arg("throttle", "4"));
const PORT = arg("port", "4254");

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: "light" });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Network.enable");
await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
if (THROTTLE > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });

await page.goto(`http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`, { waitUntil: "load" });
await page.waitForSelector(".board-group .game-cell", { state: "visible" });
await page.waitForTimeout(3000);

const events = [];
cdp.on("Tracing.dataCollected", (e) => events.push(...e.value));

async function traced(label) {
  await cdp.send("Tracing.start", { categories: "devtools.timeline,disabled-by-default-devtools.timeline", transferMode: "ReportEvents" });
  const t0 = events.length;
  await page.evaluate(() => document.querySelector(".sun-moon-toggle").click());
  await page.waitForTimeout(3000);
  await new Promise((r) => { cdp.once("Tracing.tracingComplete", r); cdp.send("Tracing.end"); });
  const slice = events.slice(t0);
  const agg = {};
  let restyledElements = 0, styleRecalcs = 0, layoutObjects = 0;
  for (const ev of slice) {
    if (ev.ph !== "X" && ev.ph !== "B") continue;
    const d = ev.dur ? ev.dur / 1000 : 0;
    agg[ev.name] = agg[ev.name] || { n: 0, ms: 0 };
    agg[ev.name].n++; agg[ev.name].ms += d;
    if (ev.name === "UpdateLayoutTree") { styleRecalcs++; restyledElements += (ev.args?.elementCount ?? ev.args?.beginData?.elementCount ?? 0); }
    if (ev.name === "Layout") layoutObjects += ev.args?.beginData?.dirtyObjects ?? 0;
  }
  const top = Object.entries(agg).filter(([, v]) => v.ms > 1).sort((a, b) => b[1].ms - a[1].ms).slice(0, 12);
  console.log(`\n== ${label} · cpu ${THROTTLE}x · fast-3G · cache disabled · ${slice.length} trace events`);
  console.log(`   UpdateLayoutTree: ${styleRecalcs} recalcs, ${restyledElements} ELEMENTS restyled · Layout dirtyObjects ${layoutObjects}`);
  for (const [k, v] of top) console.log(`   ${k.padEnd(28)} n=${String(v.n).padStart(4)}  ${v.ms.toFixed(1)} ms`);
}

await traced("TOGGLE 1 (light -> dark, the first invocation)");
await traced("TOGGLE 2 (dark -> light)");
await traced("TOGGLE 3 (light -> dark, cache hit)");

// the static half: how many rules the flip's cascade actually carries
console.log("\n== the cascade the flip moves");
console.log(JSON.stringify(await page.evaluate(() => {
  let rules = 0, decls = 0, customProps = 0;
  for (const ss of document.styleSheets) {
    let rs; try { rs = ss.cssRules; } catch { continue; }
    for (const r of rs) {
      const sel = r.selectorText || "";
      if (!sel.includes(".dark")) continue;
      rules++; decls += r.style.length;
      for (let i = 0; i < r.style.length; i++) if (r.style[i].startsWith("--")) customProps++;
    }
  }
  return { rulesMatchingDark: rules, declarations: decls, customPropertyDeclarations: customProps, htmlClass: document.documentElement.className, colorSchemeComputed: getComputedStyle(document.documentElement).colorScheme, elementsInDoc: document.querySelectorAll("*").length };
})));

await browser.close();
