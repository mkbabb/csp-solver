import { chromium, webkit } from "playwright";
import fs from "node:fs";
const DESK = [[1024, 800], [1280, 800], [1360, 900], [1440, 900], [1600, 900]];
const out = [];
const grab = () => {
  const r = (s) => {
    const e = document.querySelector(s);
    return e ? e.getBoundingClientRect() : null;
  };
  const card = r(".controls-card"), paper = r(".board-wrapper"), strip = r(".tab-strip");
  const cardEl = document.querySelector(".controls-card");
  const caseB = r(".case-body");
  const tabs = [...document.querySelectorAll(".tab")].map((t) => {
    const b = t.getBoundingClientRect();
    return [+b.x.toFixed(2), +b.y.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)];
  });
  // does any tab paint over the board?
  const over = paper ? tabs.filter((t) => t[0] < paper.x + paper.width && t[0] + t[2] > paper.x).length : -1;
  return {
    cardW: card ? +card.width.toFixed(2) : null,
    cardX: card ? +card.x.toFixed(2) : null,
    boardX: paper ? +paper.x.toFixed(2) : null,
    boardY: paper ? +paper.y.toFixed(2) : null,
    stripY: strip ? +strip.y.toFixed(2) : null,
    stripH: strip ? +strip.height.toFixed(2) : null,
    caseTop: caseB ? +caseB.y.toFixed(2) : null,
    boardTop: paper ? +paper.y.toFixed(2) : null,
    sh: cardEl?.scrollHeight, ch: cardEl?.clientHeight,
    tabsOverBoard: over,
    nTabs: tabs.length,
  };
};
for (const [eng, name] of [[chromium, "chromium"], [webkit, "webkit"]]) {
  const b = await eng.launch();
  for (const [w, h] of DESK) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    for (const [tag, url] of [["head", "http://127.0.0.1:4233/"], ["proto", "http://127.0.0.1:4232/"]]) {
      await p.goto(url, { waitUntil: "domcontentloaded" });
      await p.waitForTimeout(950);
      out.push({ eng: name, cell: `${w}x${h}`, tree: tag, ...(await p.evaluate(grab)) });
    }
    await ctx.close();
  }
  await b.close();
}
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
const key = (r) => `${r.eng}|${r.cell}`;
const m = new Map();
for (const r of out) { if (!m.has(key(r))) m.set(key(r), {}); m.get(key(r))[r.tree] = r; }
console.log("eng|cell          head.cardW proto.cardW  Δw     head.bX  proto.bX   Δx    strip y/h  caseTop  sh/ch  over");
for (const [k, p] of m) {
  const dw = (p.proto.cardW - p.head.cardW).toFixed(2);
  const dx = (p.proto.boardX - p.head.boardX).toFixed(2);
  console.log(
    `${k.padEnd(18)} ${String(p.head.cardW).padStart(7)} ${String(p.proto.cardW).padStart(11)} ${dw.padStart(7)} ${String(p.head.boardX).padStart(8)} ${String(p.proto.boardX).padStart(9)} ${dx.padStart(7)}  ${p.proto.stripY}/${p.proto.stripH}  ${p.proto.caseTop}  ${p.proto.sh}/${p.proto.ch}  ${p.proto.tabsOverBoard}`,
  );
}
