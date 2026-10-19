// usage: node ringshot.mjs <engine> <url> <w> <h> <idx> <out.png> [css]
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const [eng, url, w, h, idx, out, css] = process.argv.slice(2);
const b = await (eng === "webkit" ? webkit : chromium).launch();
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2, reducedMotion: "reduce" });
const p = await ctx.newPage();
await p.goto(url + "/?size=3&difficulty=EASY");
await p.waitForSelector(".controls-card");
await p.waitForTimeout(1500);
if (css) await p.addStyleTag({ content: css });
await p.keyboard.press("Tab");
const box = await p.evaluate((i) => {
  const root = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
  const els = [...root.querySelectorAll('button, [role="tab"], [tabindex="0"]'), ...document.querySelectorAll(".drawer-tab")].filter((e) => e.getClientRects().length && !e.closest("[inert]") && !e.disabled);
  const e = els[i]; e.focus(); const r = e.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height, name: e.className.slice(0, 40), n: els.length };
}, +idx);
await p.waitForTimeout(200);
await p.screenshot({ path: out, clip: { x: Math.max(0, box.x - 30), y: Math.max(0, box.y - 30), width: box.w + 60, height: box.h + 60 } });
console.log(JSON.stringify(box));
await b.close();
