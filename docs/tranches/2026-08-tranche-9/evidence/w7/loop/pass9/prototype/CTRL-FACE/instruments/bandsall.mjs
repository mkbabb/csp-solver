// usage: node bandsall.mjs <engine> <url> <w> <h> <dpr> [hideCss]
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { fourBands } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend/e2e/lib/edge-bands.mjs";
const [eng, url, w, h, dpr, hide] = process.argv.slice(2);
const b = await (eng === "webkit" ? webkit : chromium).launch();
const touch = process.env.TOUCH === "1";
const p = await (await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: +dpr, reducedMotion: "reduce", hasTouch: touch, isMobile: touch && eng !== "webkit" ? true : false })).newPage();
await p.goto(url + "/?size=3&difficulty=EASY"); await p.waitForSelector("svg.handwritten-logo"); await p.waitForTimeout(1200);
if (!(await p.locator(".controls-card:visible").first().isVisible().catch(() => false))) { const tab = p.locator(".drawer-tab"); await (touch ? tab.tap() : tab.click()); await p.waitForTimeout(900); }
if (hide) await p.addStyleTag({ content: hide }); if (process.env.CENTER) await p.evaluate(() => (globalThis.__center = true));
const RP = "[data-ring-probe]";
const n = await p.evaluate(() => { const root = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
  const els = [...root.querySelectorAll('button, [role="tab"], [tabindex="0"]'), ...document.querySelectorAll(".drawer-tab")].filter((e) => e.getClientRects().length && !e.closest("[inert]") && !e.disabled);
  els.forEach((e, i) => e.setAttribute("data-rc", String(i))); return els.length; });
for (let i = 0; i < n; i++) {
  await p.keyboard.press("Tab");
  const name = await p.evaluate((i) => { document.querySelectorAll("[data-ring-probe]").forEach((e) => e.removeAttribute("data-ring-probe")); const e = document.querySelector(`[data-rc="${i}"]`); e.setAttribute("data-ring-probe", ""); e.focus(); if (globalThis.__center) e.scrollIntoView({ block: "center", inline: "nearest" }); return `${e.className.slice(0, 30)} "${e.textContent.trim().slice(0, 12)}"`; }, i);
  await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const r = await fourBands(p, { subject: RP, edge: RP, out: 8, inn: 0, off: `${RP} { outline-color: transparent !important; }` });
  if (r.red && process.env.SHOTDIR && r.box) await p.screenshot({ path: `${process.env.SHOTDIR}/rc${i}.png`, clip: { x: Math.max(0, r.box.x - 20), y: Math.max(0, r.box.y - 20), width: r.box.w + 40, height: r.box.h + 40 } }).catch(() => {});
  if (process.env.DUMP === String(i)) console.log(JSON.stringify(r.bands, null, 0), JSON.stringify(r.box), r.why);
  console.log(i, r.red ? "RED  " : "GREEN", name, r.bands ? Object.entries(r.bands).map(([k, v]) => `${k} ${v.coreMedian}/d${v.thickness}/h${v.holeFrac}${v.occluder ? " occ " + v.occluder : ""}`).join(" · ") : r.why.join(";"));
}
await b.close();
