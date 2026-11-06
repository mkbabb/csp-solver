// CTRL-FACE pass 10 - B-FACE-RING's frame: ONE payload, ONE control, ONE variable (outline-style),
// two arms read by the ONE four-band probe and photographed on the same page at the tree's DPR.
// usage: node ringframe.mjs <frontend dir> <engine> <url> <w> <h> <dpr> <control index> <out.png>
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { createRequire } from "node:module";
const sharp = createRequire(import.meta.url)("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp");
const [fe, eng, url, w, h, dpr, idx, out] = process.argv.slice(2);
const { fourBands } = await import(`${fe}/e2e/lib/edge-bands.mjs`);
const PAYLOAD = "/?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const RP = "[data-ring-probe]";
const b = await (eng === "webkit" ? webkit : chromium).launch();
try {
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: +dpr, reducedMotion: "reduce", colorScheme: "light" });
  const p = await ctx.newPage();
  await p.goto(url + PAYLOAD);
  await p.waitForSelector("svg.handwritten-logo");
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1500);
  const id = await p.evaluate(() => ({ js: [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop(), css: [...document.querySelectorAll("link[rel=stylesheet]")].map((l) => l.href.split("/").pop()).find((s) => /index-/.test(s)) }));
  const name = await p.evaluate((i) => {
    const root = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
    const els = [...root.querySelectorAll('button, [role="tab"], [tabindex="0"]')].filter((e) => e.getClientRects().length && !e.closest("[inert]") && !e.disabled);
    const e = els[i];
    e.setAttribute("data-ring-probe", "");
    return `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 2).join(".")} "${(e.getAttribute("aria-label") || e.textContent || "").trim().replace(/\s+/g, " ").slice(0, 18)}"`;
  }, +idx);
  const arms = [];
  for (const [arm, css] of [["a solid (shipped)", ""], ["b dashed", `${RP}:focus-visible { outline-style: dashed !important; }`]]) {
    const t = css ? await p.addStyleTag({ content: css }) : null;
    await p.keyboard.press("Shift");
    await p.keyboard.press("Tab");
    await p.evaluate((s) => document.querySelector(s).focus(), RP);
    await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const r = await fourBands(p, { subject: RP, edge: RP, out: 8, inn: 0, off: `${RP} { outline-color: transparent !important; }` });
    const box = await p.evaluate((s) => { const q = document.querySelector(s).getBoundingClientRect(); return { x: q.x, y: q.y, w: q.width, h: q.height }; }, RP);
    const png = await p.screenshot({ clip: { x: Math.max(0, box.x - 14), y: Math.max(0, box.y - 14), width: box.w + 28, height: box.h + 28 } });
    arms.push({ arm, png, red: r.red, bands: r.bands ? Object.fromEntries(Object.entries(r.bands).map(([k, v]) => [k, { core: v.coreMedian, depth: v.thickness, holes: v.holeFrac }])) : null, why: r.why });
    if (t) await t.evaluate((e) => e.remove());
  }
  const [A, B] = await Promise.all(arms.map((a) => sharp(a.png).metadata()));
  await sharp({ create: { width: A.width + B.width + 6, height: Math.max(A.height, B.height), channels: 3, background: "#ffffff" } })
    .composite([{ input: arms[0].png, left: 0, top: 0 }, { input: arms[1].png, left: A.width + 6, top: 0 }])
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(JSON.stringify({ engine: eng, cell: `${w}x${h}@${dpr}`, served: id, control: name, arms: arms.map(({ png, ...a }) => a) }, null, 1));
  await ctx.close();
} finally {
  await b.close();
}
