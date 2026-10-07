// CTRL-FACE pass 8 · charter row 5 — the ring read through the ONE edge probe at its product home
// (../e2e/lib/edge-bands.mjs: B3 THICKNESS, B4 station 1), every PAINT_REGIMES stop, plus a
// forced-colours row that COUNTS PAINTED PIXELS with the clip-path plant.
//   node .face8/ring8.mjs --url <u> --engine chromium|webkit --site <sel> [--viewport WxH] [--dpr n] [--touch 1]
import os from "node:os";
import { fourBands, edgeGate, EDGE_PLANTS, fmt } from "../e2e/lib/edge-bands.mjs";
import { playwright, args, cellsOf, openCell, settle } from "../e2e/lib/paint-lib.mjs";
const A = args();
const engine = A.engine ?? "chromium";
const PAYLOAD = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const browser = await playwright()[engine].launch();
const RP = "[data-ring-probe]";
const OFF = `${RP} { outline-color: transparent !important; }`;
let worst = 0;
const open = async (cell) => {
  const { ctx, page } = await openCell(browser, cell);
  await page.goto(`${A.url}/?${PAYLOAD}`);
  await page.locator("svg.handwritten-logo").first().waitFor({ timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  await page.waitForTimeout(900);
  const vis = await page.evaluate(() => [...document.querySelectorAll(".controls-card")].some((c) => c.getClientRects().length && c.getBoundingClientRect().height > 0 && getComputedStyle(c).visibility !== "hidden"));
  if (!vis) {
    const tab = page.locator(".drawer-tab").first();
    await (cell.hasTouch ? tab.tap() : tab.click());
    await page.waitForTimeout(900);
  }
  return { ctx, page };
};
const focus = async (page, site) => {
  await page.keyboard.press("Tab");
  const who = await page.evaluate((sel) => {
    document.querySelectorAll("[data-ring-probe]").forEach((e) => e.removeAttribute("data-ring-probe"));
    const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
    const el = [...(card ?? document).querySelectorAll(sel)].find((e) => e.getClientRects().length);
    if (!el) return null;
    el.setAttribute("data-ring-probe", "");
    el.scrollIntoView({ block: "center" });
    el.focus();
    const cs = getComputedStyle(el);
    return { fv: el.matches(":focus-visible"), ring: `${cs.outlineStyle} ${cs.outlineWidth} off ${cs.outlineOffset} ${cs.outlineColor}`, text: el.textContent.trim().slice(0, 16) };
  }, site);
  await settle(page);
  return who;
};
const cells = cellsOf({ ...A, regimes: "all" }).map((c) => ({ ...c, hasTouch: c.hasTouch || A.touch === "1" }));
for (const cell of cells) {
  const { ctx, page } = await open(cell);
  const who = await focus(page, A.site);
  const tag = `${engine} ${A.viewport ?? "1280x800"} dpr${cell.dpr} ${cell.label}${A.touch === "1" ? " (touch)" : ""} ${A.site}`;
  if (!who) {
    console.log(`RING ${tag} NO SUBJECT → RED`);
    worst = Math.max(worst, 1);
    await ctx.close();
    continue;
  }
  const plants = {
    ...EDGE_PLANTS(RP),
    X1_opacity0: `${RP} { opacity: 0 !important; }`,
    FAINT15_ring_ink: `${RP} { outline-color: color-mix(in srgb, var(--ring-ink) 15%, transparent) !important; }`,
    ARM_SOLID_ring: `${RP} { outline-style: solid !important; }`,
  };
  const g = await edgeGate(page, { subject: RP, edge: RP, off: OFF, out: 8, inn: 0, plants });
  console.log(`RING ${tag} "${who.text}" fv=${who.fv} ${who.ring} CLEAN ${fmt(g.clean)}`);
  if (g.clean.red) worst = Math.max(worst, 1);
  for (const [name, r] of Object.entries(g.plants)) {
    const want = /^ARM_|^INFO_/.test(name) ? "info" : "RED";
    if (want === "RED" && !r.red && !r.noop) worst = Math.max(worst, 3);
    console.log(`RING ${tag} PLANT ${name} ${fmt(r)}`);
  }
  await ctx.close();
}
// FORCED COLOURS: painted pixels, ON vs OFF (outline-style none), with the clip-path plant
{
  const cell = { width: +(A.viewport ?? "1280x800").split("x")[0], height: +(A.viewport ?? "1280x800").split("x")[1], dpr: +(A.dpr ?? 1), colorScheme: "light", reducedMotion: "reduce", hasTouch: A.touch === "1", forcedColors: "active" };
  const { ctx, page } = await open(cell);
  const who = await focus(page, A.site);
  const count = async () => {
    const b = await page.locator(RP).first().boundingBox();
    const pad = 8;
    const clip = { x: Math.max(0, Math.floor(b.x - pad)), y: Math.max(0, Math.floor(b.y - pad)), width: Math.ceil(b.width + 2 * pad), height: Math.ceil(b.height + 2 * pad) };
    const { onOff } = await import("../e2e/lib/paint-lib.mjs");
    const { on, off } = await onOff(page, clip, `${RP} { outline-style: none !important; }`);
    let n = 0;
    for (let i = 0; i < on.data.length; i += 3) if (Math.max(Math.abs(on.data[i] - off.data[i]), Math.abs(on.data[i + 1] - off.data[i + 1]), Math.abs(on.data[i + 2] - off.data[i + 2])) >= 24) n++;
    const perim = 2 * (b.width + b.height) * cell.dpr;
    return { n, perim: Math.round(perim), floor: Math.round(perim * 0.5) };
  };
  const clean = await count();
  const t = await page.addStyleTag({ content: `${RP} { clip-path: inset(0) !important; }` });
  await settle(page);
  const planted = await count();
  await t.evaluate((e) => e.remove());
  const fcRed = clean.n < clean.floor;
  const plRed = planted.n < planted.floor;
  console.log(`FORCED ${engine} ${A.viewport ?? "1280x800"} dpr${cell.dpr} ${A.site} fv=${who?.fv} ${who?.ring} painted ${clean.n} px (floor ${clean.floor} = ½ device perimeter ${clean.perim}) → ${fcRed ? "RED" : "GREEN"} · PLANT clip-path inset(0) painted ${planted.n} → ${plRed ? "RED" : "GREEN (a hole)"}`);
  if (fcRed) worst = Math.max(worst, 1);
  if (!plRed) worst = Math.max(worst, 3);
  await ctx.close();
}
console.log(`LOAD ${os.loadavg().map((v) => v.toFixed(2)).join(" ")} · exit ${worst}`);
await browser.close();
process.exit(worst);
