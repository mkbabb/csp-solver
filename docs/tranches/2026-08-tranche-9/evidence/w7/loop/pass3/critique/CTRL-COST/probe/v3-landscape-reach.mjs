#!/usr/bin/env node
// CTRL-COST pass-3 critic (re-run) — a READING of W2 §2.2's question at 844x390: from the board,
// is every band's first control reached through the tab and one scroll? NOT W2's born-RED probe
// (this lane does not hold its source) — a reading, reported as such.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-29/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
const base = process.argv[2], engine = process.argv[3] ?? "chromium", out = process.argv[4];
const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/`);
await page.waitForSelector(".controls-card", { timeout: 25000, state: "attached" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
const openedBy = await page.evaluate(() => !document.documentElement.classList.contains("drawer-closed"));
let tabbed = false;
if (!openedBy) {
  const tab = await page.$(".drawer-tab, .drawer-handle, [aria-controls='controls-drawer']");
  if (tab) { await tab.click({ force: true }).catch(()=>{}); tabbed = true; await page.waitForTimeout(950); }
}
const r = await page.evaluate(() => {
  const r2=(n)=>+n.toFixed(2);
  const card=document.querySelector(".controls-card");
  if(!card) return { err:"no card" };
  const bands=[...document.querySelectorAll("section.cost-band")];
  const out=[];
  for(const b of bands){
    const head=b.querySelector(".cost-band-head");
    const ctrl=b.querySelector("button, input, select, a[href]");
    if(!ctrl) { out.push({ band: head?.textContent?.trim().slice(0,20), control:null }); continue; }
    ctrl.scrollIntoView({block:"center"});
    const rc=ctrl.getBoundingClientRect();
    const cr=card.getBoundingClientRect();
    const cx=rc.x+rc.width/2, cy=rc.y+rc.height/2;
    const hit=document.elementFromPoint(cx,cy);
    out.push({ band: head?.textContent?.trim().slice(0,20), control: ctrl.className.slice(0,40),
      box:[r2(rc.x),r2(rc.y),r2(rc.width),r2(rc.height)],
      insideCard: rc.y>=cr.y-0.5 && rc.bottom<=cr.bottom+0.5,
      hitIsControl: !!(hit && (hit===ctrl || ctrl.contains(hit) || hit.contains(ctrl))),
      hit: hit?hit.className?.toString().slice(0,40)||hit.tagName:"none" });
  }
  card.scrollTop=0;
  return { cardClientHeight: card.clientHeight, cardScrollHeight: card.scrollHeight,
    drawerClosed: document.documentElement.classList.contains("drawer-closed"),
    stickyHead: (()=>{const h=document.querySelector(".cost-band-head");return h?getComputedStyle(h).position:null;})(),
    pinBand: getComputedStyle(card).getPropertyValue("--pin-band"),
    paddingTop: getComputedStyle(card).paddingTop, bands: out };
});
writeFileSync(out, JSON.stringify({ engine, openedBy, tabbed, ...r }, null, 1));
console.log(engine, JSON.stringify(r));
await browser.close();
