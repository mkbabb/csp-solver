// T9-B29 ballot pair: HEAD (lane default, :4238) vs graft (:4244), 16×16 mintSudoku(4), cell 0 focused
// by keyboard (tier 2) + cell 1 at rest, chromium, PRM, 1280×800 fine, DPR 1; ×3 nearest-neighbour.
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("@playwright/test"); const sharp = require("sharp");
const OUT = process.argv[2];
function mint(sub){const n=sub*sub;let cells="";for(let r=0;r<n;r++)for(let c=0;c<n;c++){const i=r*n+c;const keep=i>1&&(r*7+c*3)%5<2;cells+=(keep?((r*sub+Math.floor(r/sub)+c)%n)+1:0).toString(36)}return Buffer.from(String.fromCharCode(1)+`${sub}.${cells}`,"latin1").toString("base64url")}
const payload = mint(4);
const settled = async (page) => { for (let i = 0; i < 300; i++) { const n = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && a.effect?.getTiming().iterations !== Infinity).length); if (!n) return; await page.waitForTimeout(50); } };
const browser = await pw.chromium.launch();
for (const theme of ["light", "dark"]) {
  const tiles = [];
  for (const [arm, port] of [["HEAD, default: 44 of 240 under 3:1", 4238], ["graft, inset 0.86: 78 of 240", 4244]]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce", colorScheme: theme });
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${port}/?size=4&board=${payload}`);
    for (let i = 0; i < 600 && (await page.locator(".board-shell .game-cell").count()) !== 256; i++) await page.waitForTimeout(200);
    const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    if (isDark !== (theme === "dark")) { await page.locator("button.sun-moon-toggle").first().focus(); await page.keyboard.press("Enter"); for (let i = 0; i < 100 && (await page.evaluate(() => document.documentElement.classList.contains("dark"))) !== (theme === "dark"); i++) await page.waitForTimeout(100); }
    const back = await page.evaluate(() => new URLSearchParams(location.search).get("board"));
    if (back !== payload) throw new Error("payload not read back");
    await page.locator(".board-shell .game-cell .cell-native-input").nth(0).focus();
    await page.keyboard.press("Shift");
    await settled(page); await page.waitForTimeout(300); await settled(page);
    const box = await page.evaluate(() => { const r = document.querySelectorAll(".board-shell .game-cell")[0].getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width }; });
    const clip = { x: Math.max(0, Math.floor(box.x - 14)), y: Math.max(0, Math.floor(box.y - 14)), width: Math.ceil(box.w * 2 + 28), height: Math.ceil(box.w + 28) };
    const png = await page.screenshot({ clip });
    const big = await sharp(png).resize({ width: clip.width * 3, height: clip.height * 3, kernel: "nearest" }).png().toBuffer();
    tiles.push({ arm, big, w: clip.width * 3, h: clip.height * 3 });
    console.log(theme, arm, JSON.stringify(clip));
    await ctx.close();
  }
  const lab = 34, gap = 12; const W = tiles[0].w + tiles[1].w + gap; const H = tiles[0].h + lab;
  const bg = theme === "dark" ? "#1b1b1b" : "#ffffff", fg = theme === "dark" ? "#eeeeee" : "#111111";
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${lab}"><rect width="100%" height="100%" fill="${bg}"/><text x="8" y="24" font-family="Helvetica" font-size="15" fill="${fg}">${tiles[0].arm}</text><text x="${tiles[0].w + gap + 8}" y="24" font-family="Helvetica" font-size="15" fill="${fg}">${tiles[1].arm}</text></svg>`);
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } }).composite([{ input: svg, left: 0, top: 0 }, { input: tiles[0].big, left: 0, top: lab }, { input: tiles[1].big, left: tiles[0].w + gap, top: lab }]).png({ palette: true, quality: 80 }).toFile(`${OUT}/t9-b29-geometry-head-vs-graft-16x16-cell0-focused-${theme}-chromium-1280x800-fine-dpr1-prm.png`);
}
await browser.close();
