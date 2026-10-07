// T9-B8 (three inks on HEAD geometry, 16x16 cells 0-1, cell 0 focused) + T9-B29 (HEAD | sized, 9x9 cell 0 focused),
// ONE composite. Two invocations (one dist served per port) then a compose step:
//   node shoot8.mjs lane  <url> <out.json>    A/B/C at 16x16 + HEAD at 9x9, from the lane's dist
//   node shoot8.mjs sized <url> <out.json>    the sized arm at 9x9, from the copy's dist built with arm "sized"
//   node shoot8.mjs compose <out.png> <lane.json> <sized.json>
import { readFileSync, writeFileSync } from "node:fs";
import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/paint-lib.mjs";
const [, , MODE, A1, A2, A3] = process.argv;
function mint(sub) {
  const n = sub * sub; let cells = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const i = r * n + c; const v = ((r * sub + Math.floor(r / sub) + c) % n) + 1; const keep = i > 1 && (r * 7 + c * 3) % 5 < 2; cells += (keep ? v : 0).toString(36); }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}
const browser = await playwright().chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce", colorScheme: "light" });
const page = await ctx.newPage();
const settled = () => page.waitForFunction(() => document.getAnimations().filter((a) => a.playState === "running" && Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity)).length === 0, null, { timeout: 15000 });
async function shot(base, sub, cells, css) {
  await page.goto(`${base}/?size=${sub}&board=${mint(sub)}`);
  await page.waitForFunction((n) => document.querySelectorAll(".board-shell .game-cell").length === n, sub ** 4, { timeout: 120000 });
  if (await page.evaluate(() => document.documentElement.classList.contains("dark"))) throw new Error("dark");
  const tag = css ? await page.addStyleTag({ content: css }) : null;
  await page.keyboard.press("Tab");
  await page.locator(".board-shell .game-cell .cell-native-input").nth(0).focus();
  await page.keyboard.press("Shift");
  await settled(); await page.waitForTimeout(300);
  const info = await page.evaluate((cells) => {
    const cs = [...document.querySelectorAll(".board-shell .game-cell")];
    const rs = cells.map((i) => cs[i].getBoundingClientRect());
    const x0 = Math.min(...rs.map((r) => r.left)), y0 = Math.min(...rs.map((r) => r.top)), x1 = Math.max(...rs.map((r) => r.right)), y1 = Math.max(...rs.map((r) => r.bottom));
    const p = document.querySelector(".game-cell:has(input:focus-visible) .cell-ghost-path"); const g = getComputedStyle(p);
    return { clip: { x: Math.floor(x0 - 6), y: Math.floor(y0 - 6), width: Math.ceil(x1 - x0 + 12), height: Math.ceil(y1 - y0 + 12) }, stroke: g.stroke, so: g.strokeOpacity, d: p.getAttribute("d").slice(0, 48), payload: new URLSearchParams(location.search).get("board") };
  }, cells);
  const png = await page.screenshot({ clip: info.clip, caret: "hide" });
  if (tag) await tag.evaluate((e) => e.remove());
  return { png: png.toString("base64"), ...info };
}
const arm = (ink, so) => `:root { --color-focus-sketch: ${ink} !important; } .game-cell:has(input:focus-visible) .cell-ghost-path { stroke-opacity: ${so} !important; }`;
if (MODE === "lane") {
  const out = {
    row1: [
      ["A #3a7bc4 @0.95 (ships)", await shot(A1, 4, [0, 1], null)],
      ["B #4589d2 @0.95", await shot(A1, 4, [0, 1], arm("#4589d2", 0.95))],
      ["C #2f68aa @1.0", await shot(A1, 4, [0, 1], arm("#2f68aa", 1))],
    ],
    head: ["HEAD (ships)", await shot(A1, 3, [0], null)],
  };
  for (const [k, v] of [...out.row1, out.head]) console.log(k, JSON.stringify(v.clip), v.stroke, v.so, v.d, v.payload);
  writeFileSync(A2, JSON.stringify(out));
} else if (MODE === "sized") {
  const out = { sized: ["sized", await shot(A1, 3, [0], null)] };
  console.log("sized", JSON.stringify(out.sized[1].clip), out.sized[1].stroke, out.sized[1].so, out.sized[1].d, out.sized[1].payload);
  writeFileSync(A2, JSON.stringify(out));
} else {
  const L = JSON.parse(readFileSync(A2, "utf8")), Z = JSON.parse(readFileSync(A3, "utf8"));
  const rows = [L.row1, [L.head, Z.sized]].map((r) => r.map(([k, v]) => [k, { png: v.png }]));
  await page.goto("about:blank");
  const out = await page.evaluate(async ({ rows, titles }) => {
    const S = 3, LB = 16, GAP = 8, T = 18;
    const load = async (b) => createImageBitmap(await (await fetch("data:image/png;base64," + b)).blob());
    const bm = await Promise.all(rows.map((r) => Promise.all(r.map(([, v]) => load(v.png)))));
    const rowW = bm.map((r) => r.reduce((a, b) => a + b.width * S + GAP, -GAP));
    const W = Math.max(...rowW, 560) + 2 * GAP;
    const H = bm.reduce((a, r) => a + T + LB + Math.max(...r.map((b) => b.height)) * S + GAP, GAP);
    const c = new OffscreenCanvas(W, H), x = c.getContext("2d");
    x.fillStyle = "#fff"; x.fillRect(0, 0, W, H); x.imageSmoothingEnabled = false; x.fillStyle = "#111"; x.font = "12px sans-serif";
    let y = GAP;
    bm.forEach((r, ri) => {
      x.fillText(titles[ri], GAP, y + 12); y += T;
      let xx = GAP;
      r.forEach((b, i) => { x.fillText(rows[ri][i][0], xx, y + 12); x.drawImage(b, xx, y + LB, b.width * S, b.height * S); xx += b.width * S + GAP; });
      y += LB + Math.max(...r.map((b) => b.height)) * S + GAP;
    });
    const blob = await c.convertToBlob({ type: "image/png" });
    const buf = new Uint8Array(await blob.arrayBuffer()); let s = ""; for (const v of buf) s += String.fromCharCode(v); return btoa(s);
  }, { rows, titles: ["T9-B8 the ring's ink: HEAD geometry, 16x16 (mint 4) cells 0-1, cell 0 focused, x3", "T9-B29 the ring's geometry: 9x9 (mint 3) cell 0 focused, ink A, x3"] });
  writeFileSync(A1, Buffer.from(out, "base64"));
}
await browser.close();
