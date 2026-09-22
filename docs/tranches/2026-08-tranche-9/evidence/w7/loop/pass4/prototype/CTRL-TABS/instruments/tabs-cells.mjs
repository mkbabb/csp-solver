// CTRL-TABS pass 4 — the cell census. node tabs-cells.mjs <out.json> <tag=port,...> [kinds]
// Both engines; coarse rows run hasTouch:true with matchMedia witnessed on every page; one
// encoded board (?board= minted with the app's codec: \x01 + "3." + 81 cells) on every arm.
import { chromium, webkit } from "@playwright/test";
import fs from "node:fs";
const [OUT, ARMS, KINDS = "portrait,landscape,desk"] = process.argv.slice(2);
const arms = ARMS.split(",").map((a) => a.split("="));
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const SETTLE = 1000;
const CELLS = {
  portrait: [[390, 844], [375, 812], [430, 932], [360, 640], [412, 915], [390, 664]].map((c) => [...c, true]),
  landscape: [[844, 390], [812, 375], [900, 500]].map((c) => [...c, true]),
  desk: [[1024, 800], [1280, 800], [1360, 900], [1440, 900], [1600, 900]].map((c) => [...c, false]),
};
const measure = () => {
  const q = (s) => document.querySelector(s);
  const R = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2), b: +b.bottom.toFixed(2), r: +b.right.toFixed(2) }; };
  const shown = (el) => { if (!el) return false; const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.05) return false; const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  const inView = (el) => { if (!shown(el)) return false; const b = el.getBoundingClientRect(); return b.top >= -0.5 && b.left >= -0.5 && b.bottom <= innerHeight + 0.5 && b.right <= innerWidth + 0.5; };
  const paper = R(q(".board-wrapper")), tongue = R(q(".drawer-tab")), berth = R(q("#board-edge"));
  const card = q(".controls-card");
  const pc = q(".play-controls");
  const tools = [...document.querySelectorAll(".play-controls button")].map((b) => ({ n: b.getAttribute("aria-label") || b.textContent.trim(), ...R(b), inView: inView(b) }));
  const tabs = [...document.querySelectorAll(".tab")].map((t) => ({ w: TABW(t), y: +t.getBoundingClientRect().y.toFixed(1), raised: t.classList.contains("is-raised"), word: t.textContent.trim() }));
  function TABW(t) { return +t.getBoundingClientRect().width.toFixed(2); }
  const rowsY = [...new Set(tabs.map((t) => t.y))].sort((a, b) => a - b);
  const raisedRow = rowsY.indexOf(tabs.find((t) => t.raised)?.y);
  const tapes = [...document.querySelectorAll(".washi-tag")].map((t) => ({ t: t.textContent.trim(), shown: shown(t), inView: inView(t), pos: getComputedStyle(t).position, ...R(t) }));
  const deal = q(".controls-card .deal-btn"), level = q('.controls-card [aria-label="Difficulty"], .controls-card .ctrl-btn');
  const mh = R(q(".masthead")), logo = R(q(".handwritten-logo"));
  const desk = q(".desk-control-panel");
  return {
    mq: { coarse: matchMedia("(pointer: coarse)").matches, portrait: matchMedia("(orientation: portrait)").matches, stacked: matchMedia("(max-width: 1023px)").matches },
    vw: innerWidth, vh: innerHeight,
    paper, tongue, berth,
    tuck: paper && tongue ? +(tongue.y - paper.b).toFixed(2) : null,
    feet: tongue && berth ? +(tongue.b - berth.b).toFixed(2) : null,
    offCentreY: paper ? +Math.abs(paper.y + paper.h / 2 - innerHeight / 2).toFixed(2) : null,
    fold: { present: !!q("#fold-tools"), ...R(q("#fold-tools")) },
    pcParent: pc ? (pc.parentElement.id || pc.parentElement.className) : null,
    tools, toolsInView: tools.filter((t) => t.inView).length,
    tapes,
    card: card && { ...R(card), sh: card.scrollHeight, ch: card.clientHeight },
    reach: { tongueInView: inView(q(".drawer-tab")), dealInView: inView(deal), levelInView: inView(level), foldInView: inView(q(".fold-tools")) },
    tabs, tabRows: rowsY.length, raisedRow,
    deskPadTop: desk ? getComputedStyle(desk).paddingTop : null, stripLen: desk ? getComputedStyle(desk).getPropertyValue("--strip-len") : null,
    masthead: mh, logo,
    docScroll: document.documentElement.scrollHeight,
  };
};
const res = [];
for (const [ename, engine] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await engine.launch();
  for (const kind of KINDS.split(",")) {
    for (const [w, h, coarse] of CELLS[kind]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: coarse, isMobile: coarse && ename === "chromium" });
      const page = await ctx.newPage();
      for (const [tag, port] of arms) {
        try {
          await page.goto(`http://127.0.0.1:${port}/?board=${BOARD}`, { timeout: 45000 });
          await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 45000 });
          await page.waitForTimeout(SETTLE);
          res.push({ engine: ename, kind, cell: `${w}x${h}`, pointer: coarse ? "coarse(hasTouch)" : "fine", tree: tag, ...(await page.evaluate(measure)) });
        } catch (e) { res.push({ engine: ename, kind, cell: `${w}x${h}`, tree: tag, error: String(e).slice(0, 200) }); }
      }
      await ctx.close();
      console.log(ename, kind, w, h);
    }
  }
  await browser.close();
}
fs.writeFileSync(OUT, JSON.stringify(res));
console.log("EXIT OK", res.length);
