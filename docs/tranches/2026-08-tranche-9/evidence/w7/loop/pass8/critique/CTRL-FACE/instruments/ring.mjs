// critic pass 8 · CTRL-FACE row 5 re-derived through the ONE edge probe, with fresh plants + a forced-colours band plant
import { createRequire } from "node:module";
import os from "node:os";
const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend";
const req = createRequire(FE + "/package.json");
const pw = req("@playwright/test");
const { fourBands, EDGE_PLANTS } = await import(FE + "/e2e/lib/edge-bands.mjs");
const { onOff } = await import(FE + "/e2e/lib/paint-lib.mjs");
const [engine, url, tag] = process.argv.slice(2);
const RP = "[data-ring-probe]";
const OPTS = { subject: RP, edge: RP, out: 8, inn: 0, off: `${RP} { outline-color: transparent !important; }` };
const say = (r) => r.bands ? Object.entries(r.bands).map(([k, b]) => `${k} ${b.coreMedian}/d${b.thickness}/h${b.holeFrac}`).join(" · ") : r.why.join("; ");
const PLANTS = [
  ["p7 THIN 1px (their plant)", EDGE_PLANTS(RP).THIN_1PX],
  ["p7 DASH (their plant)", `${RP} { outline-style: dashed !important; }`],
  ["fresh: dotted", `${RP} { outline-style: dotted !important; }`],
  ["fresh: 1.5px", `${RP} { outline-width: 1.5px !important; }`],
  ["fresh: right half clipped", `${RP} { clip-path: inset(-8px 50% -8px -8px) !important; }`],
  ["fresh: ink 55%", `${RP} { outline-color: color-mix(in srgb, var(--ring-ink) 55%, transparent) !important; }`],
  ["fresh: offset -3px (ring inside the chip)", `${RP} { outline-offset: -3px !important; }`],
];
const b = await pw[engine].launch();
const phone = pw.devices["iPhone 13"];
const cells = [["1280 fine", { viewport: { width: 1280, height: 800 } }, [".tray-well .ctrl-btn"]], ["390x844 coarse", { viewport: { width: 390, height: 844 }, deviceScaleFactor: phone.deviceScaleFactor, isMobile: engine === "chromium" ? phone.isMobile : undefined, hasTouch: true }, [".mobile-heading-btn", ".tray-well .ctrl-btn"]]];
const res = [];
for (const [label, use, sites] of cells)
  for (const scheme of ["light", "dark"]) {
    const o = { ...use }; if (o.isMobile === undefined) delete o.isMobile;
    const ctx = await b.newContext({ ...o, colorScheme: scheme, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(`${url}/?size=3&difficulty=EASY`);
    await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await p.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
    const card = p.locator(".controls-card:visible").first();
    if (!(await card.isVisible().catch(() => false))) { await p.locator(".drawer-tab").tap(); await p.waitForTimeout(900); }
    const flush = () => p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));
    for (const sel of sites) {
      await p.keyboard.press("Tab");
      await p.evaluate((sel) => {
        const root = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
        const el = [...root.querySelectorAll(sel)].find((e) => e.getClientRects().length);
        document.querySelectorAll("[data-ring-probe]").forEach((e) => e.removeAttribute("data-ring-probe"));
        el.setAttribute("data-ring-probe", ""); el.focus();
      }, sel);
      await flush();
      const cs = await p.evaluate(() => { const e = document.activeElement; const c = getComputedStyle(e); return `${e.matches(":focus-visible")} ${c.outlineStyle} ${c.outlineWidth}`; });
      const base = await fourBands(p, OPTS);
      const row = { cell: label, scheme, sel, cs, base: `${base.red ? "RED" : "GREEN"} ${say(base)}`, plants: [] };
      for (const [n, css] of PLANTS) {
        const t = await p.addStyleTag({ content: css }); await flush();
        const r = await fourBands(p, OPTS);
        await t.evaluate((e) => e.remove()); await flush();
        row.plants.push(`${n}: ${r.red ? "RED" : "GREEN"} (${say(r)})`);
      }
      // forced colours: the product's own count (ON vs outline-style none, >=24 any channel, floor (w+h)*dpr), with a THREE-BANDS-ERASED plant
      await p.emulateMedia({ forcedColors: "active" }); await flush();
      const dpr = await p.evaluate(() => devicePixelRatio);
      const count = async () => {
        const bb = await p.locator(RP).first().boundingBox();
        const clip = { x: Math.max(0, Math.floor(bb.x - 8)), y: Math.max(0, Math.floor(bb.y - 8)), width: Math.ceil(bb.width + 16), height: Math.ceil(bb.height + 16) };
        const { on, off } = await onOff(p, clip, `${RP} { outline-style: none !important; }`);
        let n = 0;
        for (let i = 0; i < on.data.length; i += 3) if (Math.max(Math.abs(on.data[i] - off.data[i]), Math.abs(on.data[i + 1] - off.data[i + 1]), Math.abs(on.data[i + 2] - off.data[i + 2])) >= 24) n++;
        return { n, floor: Math.round((bb.width + bb.height) * dpr) };
      };
      const fc = await count();
      const fcp = [];
      for (const [n, css] of [["clip inset(0) (their plant)", `${RP} { clip-path: inset(0) !important; }`], ["fresh: only the bottom band (inset 0 0 -8px 0)", `${RP} { clip-path: inset(0 0 -8px 0) !important; }`], ["fresh: 1px in forced colours", `${RP} { outline-width: 1px !important; }`]]) {
        const t = await p.addStyleTag({ content: css }); await flush();
        const c = await count();
        await t.evaluate((e) => e.remove()); await flush();
        fcp.push(`${n}: ${c.n}px vs floor ${c.floor} -> ${c.n < c.floor ? "RED" : "GREEN"}`);
      }
      await p.emulateMedia({ forcedColors: "none" }); await flush();
      row.forced = `ring ${fc.n}px floor ${fc.floor} · ${fcp.join(" · ")}`;
      res.push(row);
    }
    await ctx.close();
  }
console.log(JSON.stringify({ engine, tag, load: os.loadavg()[0].toFixed(1), res }));
await b.close();
