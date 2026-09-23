// census:toggle — the live instance at identity vs the four rest poses, painted bytes (element screenshots)
// node handoff2.mjs <port> <engine> <scheme> <outdir>
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [port, engine, scheme, outdir] = process.argv.slice(2);
mkdirSync(outdir, { recursive: true });
const browser = await pw[engine].launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: scheme });
const page = await ctx.newPage();
const url = `http://127.0.0.1:${port}/`;
await page.goto(url, { waitUntil: "load" }); await page.waitForTimeout(3000); await page.goto(url, { waitUntil: "load" });
await page.waitForFunction(() => document.querySelectorAll(".rest-sun img.rest-pose").length === 4 && document.querySelectorAll(".rest-moon img.rest-pose").length === 4, null, { timeout: 30000 });
await page.waitForTimeout(2500);
const body = scheme === "dark" ? "moon" : "sun";
const el = page.locator(".sun-moon-toggle");
// freeze the page's own boil so only the toggle's poses differ; hide everything but the toggle's ink
await page.addStyleTag({ content: `.rest-pose{transition:none!important}` });
const shots = {};
for (let i = 0; i < 4; i++) {
  await page.evaluate(([b, i]) => { document.querySelectorAll(`.rest-${b} img.rest-pose`).forEach((im, k) => { im.style.setProperty("opacity", k === i ? "1" : "0", "important"); }); }, [body, i]);
  await page.waitForTimeout(250);
  shots[`rest${i}`] = await el.screenshot({ path: `${outdir}/${engine}-${scheme}-rest${i}.png`, animations: "disabled" });
}
// the live instance at identity: the gesture's own class, no theme change, transitions+animations frozen at their end
await page.addStyleTag({ content: `.toggle-icon,.toggle-icon *,.sun-moon-toggle{transition:none!important;animation:none!important}` });
await page.evaluate(() => document.querySelector(".sun-moon-toggle").classList.add("is-turning"));
await page.waitForTimeout(400);
const liveState = await page.evaluate((b) => { const s = document.querySelector(`.toggle-${b}`); const w = s.querySelector(".warp"); const cs = getComputedStyle(s); return { vis: cs.visibility, op: cs.opacity, scale: cs.scale, warp: getComputedStyle(w).transform, filter: s.getAttribute("filter"), restVis: getComputedStyle(document.querySelector(`.rest-${b}`)).visibility }; }, body);
shots.live = await el.screenshot({ path: `${outdir}/${engine}-${scheme}-live.png`, animations: "disabled" });
writeFileSync(`${outdir}/${engine}-${scheme}-state.json`, JSON.stringify(liveState));
await browser.close();
console.log("ok", engine, scheme, JSON.stringify(liveState));
