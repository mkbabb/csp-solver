// ACC-SIX pass-5 crops — three, each on the p5-common payload, each a REPLACEMENT (README names
// the pass-4 crop it retires). Every pair differs by ONE variable; the author looks at each.
//  c1 T9-B-ACC6-1: the arc, 8 legal writes, 1280x800 dpr2 light CHROMIUM FINE — top: the shipped
//     `answer-mid` #8b5cf6; bottom: the escape #9b74f7 (one token, --color-progress-ink).
//  c2 the count under the board, 2 legal writes, 393x699 dpr3 light WEBKIT COARSE (hasTouch).
//  c3 the count's PLACE (U-10), same cell as c2: top the shipped margin line; bottom Arm A, the
//     bottom-left tape INJECTED (a live tag tape cloned, not a built arm), the margin line hidden.
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { chromium, webkit, writeLegal, open, cells, DEAL, asset } from "./p5-common.mjs";
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const OUT = process.argv[2];
const stack = async (bufs, file) => {
  const metas = await Promise.all(bufs.map((b) => sharp(b).metadata()));
  const w = Math.max(...metas.map((m) => m.width)), gap = 6;
  const h = metas.reduce((n, m) => n + m.height, 0) + gap * (bufs.length - 1);
  let y = 0; const comp = bufs.map((b, i) => { const c = { input: b, top: y, left: 0 }; y += metas[i].height + gap; return c; });
  await sharp({ create: { width: w, height: h, channels: 3, background: "#808080" } }).composite(comp).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(file);
};
const facts = {};
// c1
{
  const br = await chromium.launch();
  const shots = [];
  for (const hex of [null, "#9b74f7"]) {
    const { ctx, page } = await open(br, BASE, { viewport: { width: 1280, height: 800 }, dpr: 2, reduce: true });
    facts.c1 ??= { asset: await asset(page), dealOk: (await cells(page)) === DEAL };
    if (hex) await page.addStyleTag({ content: `:root { --color-progress-ink: ${hex} !important; }` });
    for (let k = 0; k < 8; k++) await writeLegal(page, 200);
    await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(2, 2); await page.waitForTimeout(900);
    const b = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    shots.push(await page.screenshot({ clip: { x: Math.round(b.x - 16), y: Math.round(b.y - 16), width: Math.round(b.width * 0.62), height: Math.round(b.height * 0.36) } }));
    facts.c1[hex ?? "shipped"] = await page.evaluate(() => getComputedStyle(document.querySelector(".progress-trace")).stroke);
    await ctx.close();
  }
  await stack(shots, `${OUT}/c1-T9-B-ACC6-1-arc-shipped-vs-escape-desk-light-chromium-fine.png`);
  await br.close();
}
// c2 + c3
{
  const br = await webkit.launch();
  const C = { viewport: { width: 393, height: 699 }, dpr: 3, touch: true, reduce: true };
  const grab = async (page) => {
    const b = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    const pc = await page.locator(".play-controls").first().boundingBox();
    return page.screenshot({ clip: { x: 0, y: Math.round(b.y + b.height - 130), width: 393, height: Math.round(pc.y + 12 - (b.y + b.height - 130)) } });
  };
  const { ctx, page } = await open(br, BASE, C);
  facts.c2 = { asset: await asset(page), dealOk: (await cells(page)) === DEAL, coarse: await page.evaluate(() => matchMedia("(pointer: coarse)").matches) };
  await writeLegal(page, 260); await writeLegal(page, 260);
  await page.evaluate(() => document.activeElement?.blur?.()); await page.waitForTimeout(400);
  facts.c2.meta = await page.evaluate(() => document.querySelector(".margin-note-meta")?.textContent);
  const shipped = await grab(page);
  await sharp(shipped).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(`${OUT}/c2-count-under-the-board-phone-light-webkit-coarse.png`);
  // c3 bottom: Arm A injected, the margin line hidden — same page, same pose, one variable.
  await page.evaluate((text) => {
    const src = document.querySelector(".washi-label.washi-tag");
    const svg = document.querySelector("svg.hand-drawn-grid").getBoundingClientRect();
    const t = src.cloneNode(false); t.textContent = text; t.id = "acc6-armA";
    Object.assign(t.style, { position: "fixed", left: "0px", top: "0px", margin: "0", visibility: "visible", opacity: "1", zIndex: 999, transform: "rotate(var(--washi-tilt))" });
    document.body.appendChild(t);
    for (let k = 0; k < 2; k++) { const q = t.getBoundingClientRect(); t.style.left = `${parseFloat(t.style.left) + (svg.x + 4 - q.x)}px`; t.style.top = `${parseFloat(t.style.top) + (svg.y + svg.height - q.bottom)}px`; }
    document.querySelector(".margin-note-meta").style.visibility = "hidden";
  }, facts.c2.meta);
  await page.waitForTimeout(200);
  const armA = await grab(page);
  await stack([shipped, armA], `${OUT}/c3-count-place-margin-vs-armA-injected-phone-light-webkit-coarse.png`);
  await ctx.close(); await br.close();
}
console.log(JSON.stringify(facts));
