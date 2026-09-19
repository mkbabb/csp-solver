import { chromium, webkit } from "playwright";
const ARMS = { head: "http://127.0.0.1:4242/", proto: "http://127.0.0.1:4240/" };
const CELLS = [[390,844],[375,812],[900,500],[844,390],[1280,800]];
const read = () => {
  const b = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return `${r.x.toFixed(2)},${r.y.toFixed(2)},${r.width.toFixed(2)},${r.height.toFixed(2)}`; };
  return { board: b(".board-wrapper")||b(".sudoku-board"), mast: b(".masthead"), logo: b("svg.handwritten-logo"), sun: b(".corner-right"), shell: b(".board-shell") };
};
for (const engine of ["chromium","webkit"]) {
  const br = await (engine==="webkit"?webkit:chromium).launch();
  for (const [w,h] of CELLS) {
    const r = {};
    for (const [arm,base] of Object.entries(ARMS)) {
      const ctx = await br.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1, hasTouch:w<1024, isMobile: w<1024&&engine==="chromium"?true:undefined, colorScheme:"light" });
      const p = await ctx.newPage();
      await p.addInitScript(`try{localStorage.clear();localStorage.setItem("sudoku-color-scheme","light")}catch{}`);
      await p.goto(base+"?size=3&difficulty=EASY",{waitUntil:"domcontentloaded"});
      await p.waitForSelector("svg.handwritten-logo",{timeout:30000});
      await p.waitForTimeout(1600);
      r[arm] = await p.evaluate(read);
      await ctx.close();
    }
    const diffs = Object.keys(r.head).filter(k=>r.head[k]!==r.proto[k]);
    console.log(`${engine} ${w}x${h}: ${diffs.length?diffs.map(k=>`${k} ${r.head[k]} -> ${r.proto[k]}`).join(" ; "):"pi HOLDS (board, masthead, logo, sun, shell byte-identical)"}`);
  }
  await br.close();
}
