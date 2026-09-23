// v2: SETTLED reads (poll the snapshot until two consecutive reads agree, the dock sheet slides ~700 ms) — v1's 200/500 ms reads caught the sheet mid-slide in BOTH arms and are struck.
// ACC-SIX pass-5 CRITIC — what the LANDSCAPE wrap moves (the portrait-only reserve's gap): 812x375 and
// 844x390 coarse, lane vs control 74a2b5d9, the lane's payload, 1 legal write (count showing), then the
// 16x16-width pair (hint "G goes nowhere else in this column" + count "3 of 170 on the board") emulated
// in the voice's own span; every element with a class, y before vs after, and the document's scrollHeight.
import { writeFileSync } from "node:fs";
import { ENGINES, BOARD, DEAL, cells, asset, writeLegal, open } from "./p5-common.COPY.mjs";
const ARMS = { proto: "http://127.0.0.1:4237", control: "http://127.0.0.1:4238" };
const CELLS = [{ name: "812x375-coarse", viewport: { width: 812, height: 375 }, dpr: 3, touch: true }, { name: "844x390-coarse", viewport: { width: 844, height: 390 }, dpr: 3, touch: true }];
const SNAP = () => { const m = new Map(); document.querySelectorAll("body [class]").forEach((e, i) => { const r = e.getBoundingClientRect(); if (r.width || r.height) m.set(i, [e.tagName + "." + String(e.className.baseVal ?? e.className).split(" ")[0], +(r.y + scrollY).toFixed(2), +r.height.toFixed(2)]); }); return { els: [...m.entries()], sh: document.scrollingElement.scrollHeight, vh: innerHeight, strip: +document.querySelector(".board-margin").getBoundingClientRect().height.toFixed(2) }; };
const out = { board: BOARD, cells: {} };
async function settled(page) { let prev = null; for (let t = 0; t < 40; t++) { const s = await page.evaluate(SNAP); const k = JSON.stringify(s); if (k === prev) return s; prev = k; await page.waitForTimeout(250); } return { ...JSON.parse(prev), unsettled: true }; }
for (const [eng, L] of ENGINES) { const br = await L.launch();
  for (const C of CELLS) for (const [arm, base] of Object.entries(ARMS)) {
    const { ctx, page } = await open(br, base, { ...C, reduce: true });
    await writeLegal(page, 260); await page.evaluate(() => document.activeElement?.blur?.()); await page.waitForTimeout(500);
    const a = await settled(page);
    await page.evaluate(() => { const p = document.querySelector(".margin-note"); const meta = document.querySelector(".margin-note-meta"); if (meta) meta.textContent = "3 of 170 on the board"; const s = document.createElement("span"); s.className = "margin-note-ink"; for (const x of p.getAttributeNames()) if (x.startsWith("data-v-")) s.setAttribute(x, ""); s.textContent = "G goes nowhere else in this column"; p.appendChild(s); });
    await page.waitForTimeout(200);
    const b = await settled(page); const bm = new Map(b.els);
    const moved = {}; for (const [i, [n, y]] of a.els) { const q = bm.get(i); if (q && Math.abs(q[1] - y) > 0.01) { moved[n] ??= []; if (moved[n].length < 2) moved[n].push(+(q[1] - y).toFixed(2)); } }
    out.cells[`${eng}/${C.name}/${arm}`] = { asset: await asset(page), dealOk: (await cells(page)).replace(/[1-9]/g, (d, i) => d) !== "", strip: [a.strip, b.strip], scrollH: [a.sh, b.sh], vh: a.vh, movedN: Object.keys(moved).length, unsettled: [!!a.unsettled, !!b.unsettled], moved: Object.fromEntries(Object.entries(moved).slice(0, 12)) };
    await ctx.close(); console.error("done", eng, C.name, arm);
  } await br.close(); }
writeFileSync(process.argv[2], JSON.stringify(out, null, 1)); console.error("wrote");
