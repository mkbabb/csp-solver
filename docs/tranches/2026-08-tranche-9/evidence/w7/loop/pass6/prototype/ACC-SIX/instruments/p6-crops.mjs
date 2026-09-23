// ACC-SIX pass-6 crops — three, each on the p6-common payload (given-set read back via the aria-label corpus),
// each a REPLACEMENT naming the pass-5 crop it retires (pass5/SWEEP.md's names). Every pair: one page, ONE
// variable, stacked top/bottom with a 6px grey seam; the author looks at each.
//  c1 T9-B-ACC6-1: the arc, 8 legal writes, 1280x800 dpr2 LIGHT chromium FINE — top: the shipped `answer-mid`
//     #8f61f6 @1; bottom: the ballot's other arm #8b5cf6 @1 (one token, --color-progress-ink).
//     Retires pass5 prototype/ACC-SIX/c1-T9-B-ACC6-1-arc-shipped-vs-escape-desk-light-chromium-fine.png.
//  c2 T9-B-ACC6-2: the same arc, DARK, chromium FINE dpr2 — top: the shipped `answer-deep` #7c3aed @1 (2.575 on the
//     card's edge); bottom: the window's best byte of ANY hue #2178a5 (33,120,165; 2.893 min over the three dark
//     grounds, the impossibility's own number). One token. Retires pass5 prototype/ACC-SIX/c2-count-under-the-board-phone-light-webkit-coarse.png
//     (the charter's "c2 retired": it duplicated c3's upper arm).
//  c3 the count's PLACE (U-10), 393x699 dpr3 LIGHT webkit COARSE (hasTouch), digits WRITTEN in cells 72 and 73
//     (the pass-5 critic: Arm A's 0 px² held only while they were empty) — top the shipped margin line; bottom
//     Arm A (the bottom-left tag tape, INJECTED: a live tag tape cloned), the margin line hidden.
//     Retires pass5 prototype/ACC-SIX/c3-count-place-margin-vs-armA-injected-phone-light-webkit-coarse.png.
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { chromium, webkit, writeLegal, open, labels, SOL, asset } from "./p6-common.mjs";
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const OUT = process.argv[2];
const stack = async (bufs, file) => {
  const metas = await Promise.all(bufs.map((b) => sharp(b).metadata()));
  const w = Math.max(...metas.map((m) => m.width)), gap = 6;
  const h = metas.reduce((n, m) => n + m.height, 0) + gap * (bufs.length - 1);
  let y = 0; const comp = bufs.map((b, i) => { const c = { input: b, top: y, left: 0 }; y += metas[i].height + gap; return c; });
  await sharp({ create: { width: w, height: h, channels: 3, background: "#808080" } }).composite(comp).png({ palette: true, quality: 85, compressionLevel: 9 }).toFile(file);
};
const facts = {};
for (const [id, scheme, arms, file] of [
  ["c1", "light", [null, "#8b5cf6"], "c1-T9-B-ACC6-1-arc-8f61f6-vs-8b5cf6-desk-light-chromium-fine.png"],
  ["c2", "dark", [null, "#2178a5"], "c2-T9-B-ACC6-2-arc-deep-vs-best-any-byte-desk-dark-chromium-fine.png"],
]) {
  const br = await chromium.launch();
  const shots = [];
  for (const hex of arms) {
    const { ctx, page } = await open(br, BASE, { viewport: { width: 1280, height: 800 }, dpr: 2, reduce: true, scheme });
    facts[id] ??= { asset: await asset(page), givens: (await labels(page)).length };
    if (hex) await page.addStyleTag({ content: `:root { --color-progress-ink: ${hex} !important; }` });
    for (let k = 0; k < 8; k++) await writeLegal(page, 200);
    await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(2, 2); await page.waitForTimeout(900);
    const b = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    shots.push(await page.screenshot({ clip: { x: Math.round(b.x - 16), y: Math.round(b.y - 16), width: Math.round(b.width * 0.62), height: Math.round(b.height * 0.3) } }));
    facts[id][hex ?? "shipped"] = await page.evaluate(() => { const t = document.querySelector(".progress-trace"); const c = getComputedStyle(t); return c.stroke + " @" + t.getAttribute("stroke-opacity"); });
    await ctx.close();
  }
  await stack(shots, `${OUT}/${file}`);
  await br.close();
}
{
  const br = await webkit.launch();
  const C = { viewport: { width: 393, height: 699 }, dpr: 3, touch: true, reduce: true };
  const grab = async (page) => {
    const b = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    const pc = await page.locator(".play-controls").first().boundingBox();
    return page.screenshot({ clip: { x: 0, y: Math.round(b.y + b.height - 130), width: 393, height: Math.round(pc.y + 12 - (b.y + b.height - 130)) } });
  };
  const { ctx, page } = await open(br, BASE, C);
  facts.c3 = { asset: await asset(page), coarse: await page.evaluate(() => matchMedia("(pointer: coarse)").matches) };
  for (const i of [72, 73]) { await page.evaluate((j) => document.querySelectorAll(".sudoku-cell")[j].querySelector("input").focus(), i); await page.keyboard.type(SOL[i]); await page.waitForTimeout(260); }
  await page.evaluate(() => document.activeElement?.blur?.()); await page.waitForTimeout(400);
  facts.c3.meta = await page.evaluate(() => document.querySelector(".margin-note-meta")?.textContent);
  facts.c3.cells72_75 = await page.evaluate(() => Array.from(document.querySelectorAll(".sudoku-cell")).slice(72, 76).map((c) => c.querySelector("input")?.value || "."));
  const shipped = await grab(page);
  await page.evaluate((text) => {
    const src = document.querySelector(".washi-label.washi-tag");
    const svg = document.querySelector("svg.hand-drawn-grid").getBoundingClientRect();
    const t = src.cloneNode(false); t.textContent = text; t.id = "acc6-armA";
    Object.assign(t.style, { position: "fixed", left: "0px", top: "0px", margin: "0", visibility: "visible", opacity: "1", zIndex: 999, transform: "rotate(var(--washi-tilt))" });
    document.body.appendChild(t);
    for (let k = 0; k < 2; k++) { const q = t.getBoundingClientRect(); t.style.left = `${parseFloat(t.style.left) + (svg.x + 4 - q.x)}px`; t.style.top = `${parseFloat(t.style.top) + (svg.y + svg.height - q.bottom)}px`; }
    document.querySelector(".margin-note-meta").style.visibility = "hidden";
  }, facts.c3.meta);
  await page.waitForTimeout(200);
  const armA = await grab(page);
  await stack([shipped, armA], `${OUT}/c3-count-place-margin-vs-armA-digits-72-73-phone-light-webkit-coarse.png`);
  await ctx.close(); await br.close();
}
console.log(JSON.stringify(facts));
