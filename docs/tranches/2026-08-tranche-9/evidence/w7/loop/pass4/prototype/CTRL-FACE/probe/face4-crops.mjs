// T9-W7 pass 4 · CTRL-FACE — the four cited crops. Each is a REPLACEMENT (chair §6.11).
import { chromium, webkit } from "playwright";
import { mkdirSync } from "node:fs";
const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/CTRL-FACE/frames";
mkdirSync(OUT, { recursive: true });
const PROTO = "http://127.0.0.1:4234", HEAD = "http://127.0.0.1:4235";

async function shot(launcher, base, vp, file, sel, theme = "light") {
  const b = await launcher.launch();
  const ctx = await b.newContext({ viewport: vp, baseURL: base, hasTouch: true, isMobile: launcher === chromium, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
  await p.goto("/?size=3&difficulty=EASY", { waitUntil: "networkidle" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await p.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  const card = p.locator(".controls-card:visible").first();
  if (!(await card.isVisible().catch(() => false))) { await p.locator(".drawer-tab").tap(); await p.waitForTimeout(900); }
  await p.waitForTimeout(400);
  const t = p.locator(sel).first();
  await t.screenshot({ path: `${OUT}/${file}` });
  await b.close();
  console.log("wrote", file);
}
// 1+2 — THE U-10 FORK, one crop each arm, same cell, same engine, same theme.
await shot(chromium, PROTO, { width: 320, height: 568 }, "f1-p4-320-light-coarse-chromium-PROTO-caption-is-its-word.png", ".controls-card:visible .tray-well >> nth=1");
await shot(chromium, HEAD, { width: 320, height: 568 }, "f2-p4-320-light-coarse-chromium-HEAD-caption-column-60px.png", ".controls-card:visible .tray-well >> nth=1");
// 3+4 — the ink gate's subject, re-shot: `checking`'s paper over `what fits`'s ink, both engines.
for (const [name, L] of [["chromium", chromium], ["webkit", webkit]])
  await shot(L, PROTO, { width: 390, height: 844 }, `f${name === "chromium" ? 3 : 4}-p4-390x844-light-coarse-${name}-checking-over-what-fits.png`, ".controls-card:visible .tray-well >> nth=1");
