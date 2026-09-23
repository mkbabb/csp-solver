// T9-W7 pass 6 · CTRL-RULE — the two ballot pairs, each ONE payload and ONE variable, the variable
// injected at runtime on the SAME served dist (index-6iZX5AxOWmmo.js), left = shipped, right = arm.
//   f3  the rule's ink: --ink-press-quiet (68%, shipped) vs --ink-press-rule (55%, pass 5)
//       chromium · light · 390×844 · coarse (hasTouch, witnessed) · DPR 2 · sheet open, scroll END
//   f4  the coarse rail's verb faces: at the tap gutter (shipped, case 224.00 = control) vs the
//       pass-5 face padding (0.55rem, case 294.38) — webkit · light · 1280×800 · coarse · DPR 1 · rest
// The sun is parked (reducedMotion: reduce) and the masthead is outside both crops.
// node p6-frames.mjs <BASE> <OUTDIR>
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;
const [BASE, OUTDIR] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
async function pair({ engine, w, h, touch, dpr, arm, crop, name }) {
  const b = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, hasTouch: touch, isMobile: touch && engine === "chromium", colorScheme: "light", reducedMotion: "reduce" });
  await ctx.addInitScript(() => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", "light"); } catch {} });
  const p = await ctx.newPage();
  await p.goto(`${BASE}?size=3&board=${BOARD}`); await p.waitForSelector(".sudoku-cell"); await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await p.waitForTimeout(1500);
  const witness = await p.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, givens: [...document.querySelectorAll(".board-wrapper input")].filter((e) => /given/.test(e.getAttribute("aria-label") || "")).length }));
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().click({ force: true });
  let last = -1; for (let i = 0; i < 40; i++) { await p.waitForTimeout(100); const t = await p.evaluate(() => { const r = document.querySelector(".drawer-case").getBoundingClientRect(); return r.top + r.left; }); if (Math.abs(t - last) < 0.01) break; last = t; }
  if (name.startsWith("f3")) await p.evaluate(() => { const c = document.querySelector(".controls-card"); c.scrollTop = c.scrollHeight; });
  await p.waitForTimeout(400);
  const box = await p.evaluate(crop);
  const shot = async () => sharp(await p.screenshot({ clip: box })).toBuffer();
  const left = await shot();
  await p.addStyleTag({ content: arm });
  await p.waitForTimeout(400);
  const right = await shot();
  const meta = await sharp(left).metadata();
  const gap = 12;
  const out = await sharp({ create: { width: meta.width * 2 + gap, height: meta.height, channels: 3, background: "#ffffff" } })
    .composite([{ input: left, left: 0, top: 0 }, { input: right, left: meta.width + gap, top: 0 }])
    .png({ palette: true, quality: 80, compressionLevel: 9 }).toFile(`${OUTDIR}/${name}`);
  console.log(name, JSON.stringify({ witness, box, bytes: out.size }));
  await b.close();
}
await pair({ engine: "chromium", w: 390, h: 844, touch: true, dpr: 2, name: "f3-rule-ink-quiet68-vs-rule55-chromium-light-390x844-coarse-scrollend.png",
  arm: "svg.ruled-line path{stroke:var(--ink-press-rule)!important}",
  crop: () => { const f = document.getElementById("card-foot").getBoundingClientRect(); return { x: 0, y: Math.max(0, f.top - 200), width: 390, height: Math.min(844, f.bottom) - Math.max(0, f.top - 200) }; } });
await pair({ engine: "webkit", w: 1280, h: 800, touch: true, dpr: 1, name: "f4-rail-faces-gutter-vs-padded-webkit-light-1280x800-coarse-rest.png",
  arm: ".action-verbs .act-face{padding-inline:0.55rem!important}",
  crop: () => { const f = document.getElementById("card-foot").getBoundingClientRect(); return { x: 780, y: Math.max(0, f.top - 120), width: 500, height: Math.min(800, f.bottom + 8) - Math.max(0, f.top - 120) }; } });
console.log("EXIT OK");
