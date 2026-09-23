// The ring gate reads computed outlineStyle + outlineColor against the token: plant X1 (opacity 0 on
// the focused chip) and FAINT (--ring-ink at 15 % alpha) and read what the gate reads beside PAINT.
import { chromium, webkit } from "playwright";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require("sharp");
const [engName, base] = process.argv.slice(2);
const eng = engName === "webkit" ? webkit : chromium;
const b = await eng.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
const p = await ctx.newPage();
await p.goto(`${base}/?size=3&difficulty=EASY`); await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); await p.waitForTimeout(1500);
const SEL = ".controls-card .ctrl-btn";
const read = async (plant) => {
  const h = plant ? await p.addStyleTag({ content: plant }) : null;
  await p.keyboard.press("Tab");
  const box = await p.evaluate((sel) => {
    const el = [...document.querySelectorAll(sel)].find((e) => e.getClientRects().length); el.focus();
    const r = el.getBoundingClientRect(); return { x: r.x - 8, y: r.y - 8, width: r.width + 16, height: r.height + 16 };
  }, SEL);
  await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const gate = await p.evaluate(() => { const d = document.createElement("div"); d.style.color = "var(--ring-ink)"; document.body.appendChild(d); const ink = getComputedStyle(d).color; d.remove(); const cs = getComputedStyle(document.activeElement); return { fv: document.activeElement.matches(":focus-visible"), style: cs.outlineStyle, color: cs.outlineColor, ink }; });
  const on = await sharp(await p.screenshot({ clip: box })).raw().toBuffer();
  const hOff = await p.addStyleTag({ content: `${SEL} { outline-color: transparent !important }` });
  await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const off = await sharp(await p.screenshot({ clip: box })).raw().toBuffer();
  await hOff.evaluate((n) => n.remove()); if (h) await h.evaluate((n) => n.remove());
  let changed = 0; for (let i = 0; i < on.length; i += 4) if (Math.abs(on[i] - off[i]) + Math.abs(on[i + 1] - off[i + 1]) + Math.abs(on[i + 2] - off[i + 2]) > 30) changed++;
  return { gateGreen: gate.fv && gate.style === "dashed" && gate.color === gate.ink, ...gate, ringPaintPx: changed };
};
for (const [name, plant] of [["clean", null], ["X1 opacity 0 on the chip", `${SEL}:focus-visible { opacity: 0 !important }`], ["FAINT --ring-ink 15%", `:root, .controls-card { --ring-ink: rgb(0 0 0 / 0.15) !important }`]])
  console.log(JSON.stringify({ engine: engName, plant: name, ...(await read(plant)) }));
await b.close();
