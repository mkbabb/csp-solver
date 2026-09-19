import { chromium } from "playwright";
const b = await chromium.launch({headless:true});
const ctx = await b.newContext({viewport:{width:390,height:844}, reducedMotion:"reduce"});
const p = await ctx.newPage();
await p.goto("http://127.0.0.1:4246/?size=3&difficulty=EASY");
await p.waitForSelector("svg.handwritten-logo",{timeout:30000});
await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(`(() => {
  const cs = getComputedStyle(document.documentElement);
  const tw = cs.getPropertyValue('--default-transition-duration').trim();
  const rows = [];
  for (const sel of ['.transition-colors','.duration-150','.duration-200','.duration-250','.duration-500','.transition-\\\\[box-shadow\\\\]']) {
    let els = [];
    try { els = [...document.querySelectorAll(sel)]; } catch(e) { rows.push({sel, err:String(e).slice(0,60)}); continue; }
    rows.push({ sel, n: els.length, durations: [...new Set(els.map(e=>getComputedStyle(e).transitionDuration))] });
  }
  return { defaultTransitionDuration: tw, rows };
})()`), null, 2));
await b.close();
