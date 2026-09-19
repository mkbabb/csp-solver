import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
const p = await ctx.newPage();
await p.goto("http://127.0.0.1:4232/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(950);
const w = async (css) =>
  p.evaluate((c) => {
    document.getElementById("abl")?.remove();
    if (c) {
      const s = document.createElement("style");
      s.id = "abl";
      s.textContent = c;
      document.head.appendChild(s);
    }
    const card = document.querySelector(".controls-card");
    return +card.getBoundingClientRect().width.toFixed(2);
  }, css);
console.log("base                       ", await w(""));
console.log("strip display:none         ", await w(".tab-strip{display:none!important}"));
console.log("floor(.action-verbs) none  ", await w(".action-verbs{display:none!important}"));
console.log("trays min-width:0          ", await w(".tray,.tray *{min-width:0!important}"));
console.log("act-face min-width:0       ", await w(".act-face{min-width:0!important}"));
console.log("icon-btn min-width:0       ", await w(".icon-btn{min-width:0!important}"));
console.log("chips wrap                 ", await w(".chip-row{flex-wrap:wrap!important}"));
console.log("zone-hint none             ", await w(".zone-hint{display:none!important}"));
console.log("washi none                 ", await w(".washi-tag,.sheet-washi-label{display:none!important}"));
console.log("case-body min-width 0      ", await w(".case-body,.tray,.control-panel-filtered{min-width:0!important}"));
console.log("play-controls none         ", await w(".play-controls{display:none!important}"));
console.log("keyboard-legend none       ", await w(".keyboard-legend,#keys-fold{display:none!important}"));
await b.close();
