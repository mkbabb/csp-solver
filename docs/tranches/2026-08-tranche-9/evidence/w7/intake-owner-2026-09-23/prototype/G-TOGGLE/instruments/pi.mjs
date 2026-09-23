// G-TOGGLE π census — computed paint properties + tags at rest, every element, one tree.
// Also the live-filter census (own filter ≠ none AND own display ≠ none) at rest, hovered,
// and mid-gesture. node pi.mjs <port> <engine> <vw>x<vh> <scheme> <touch 0|1> <out.json>
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [port, engine, vp, scheme, touchA, out] = process.argv.slice(2);
const [vw, vh] = vp.split("x").map(Number);
const PAYLOAD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const URL_ = `http://127.0.0.1:${port}/?board=${PAYLOAD}`;
const browser = await pw[engine].launch();
const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 2, colorScheme: scheme, hasTouch: touchA === "1" });
const page = await ctx.newPage();
await page.goto(URL_, { waitUntil: "load" }); await page.waitForTimeout(2500); await page.goto(URL_, { waitUntil: "load" });
await page.waitForFunction(() => document.querySelectorAll(".rest-sun img.rest-pose").length === 4 && document.querySelectorAll(".glyph-svg path").length >= 20, null, { timeout: 40000 });
await page.waitForFunction(() => document.getAnimations().filter((a) => a.playState === "running").length === 0, null, { timeout: 20000 }).catch(() => {});
await page.waitForTimeout(2500);
// freeze the beat's own opacity swaps out of the comparison: read the stable property set
const PROPS = ["display", "visibility", "opacity", "color", "background-color", "border-top-color", "fill", "stroke", "stroke-width", "filter", "transform", "scale", "font-family", "font-size", "font-weight", "box-shadow", "outline-style", "mix-blend-mode", "clip-path", "z-index", "position"];
const snap = await page.evaluate((PROPS) => {
  const rows = [];
  const path = (el) => { const p = []; for (let e = el; e && e.nodeType === 1 && p.length < 6; e = e.parentElement) { const c = (e.getAttribute("class") || "").trim().split(/\s+/).filter((x) => x && !/^is-pose-active$|^is-active$/.test(x)).slice(0, 2).join("."); p.unshift(e.tagName.toLowerCase() + (c ? "." + c : "")); } return p.join(">"); };
  const all = [...document.body.querySelectorAll("*")];
  for (const el of all) {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    rows.push({ p: path(el), tag: el.tagName.toLowerCase(), attrs: [...el.attributes].map((a) => a.name).filter((n) => !n.startsWith("data-v-")).sort().join(","), v: PROPS.map((k) => cs.getPropertyValue(k)).join("|"), rect: [r.x, r.y, r.width, r.height].map((x) => Math.round(x)).join(",") });
  }
  return rows;
}, PROPS);
const census = () => page.evaluate(() => [...document.querySelectorAll("*")].filter((el) => { const cs = getComputedStyle(el); return cs.filter && cs.filter !== "none" && cs.display !== "none"; }).map((el) => `${el.tagName.toLowerCase()}.${(el.getAttribute("class") || "").split(/\s+/).slice(0, 2).join(".")}⟨${getComputedStyle(el).filter.slice(0, 40)}⟩`));
const rest = await census();
let hovered = null;
if (touchA !== "1") { await page.hover(".sun-moon-toggle"); await page.waitForTimeout(400); hovered = await census(); await page.mouse.move(5, vh - 5); await page.waitForTimeout(400); }
if (touchA === "1") await page.tap(".sun-moon-toggle", { force: true }); else await page.click(".sun-moon-toggle", { force: true });
await page.waitForTimeout(300);
const mid = await census();
await page.waitForTimeout(2500);
const after = await census();
const btnAfter = await page.evaluate(() => getComputedStyle(document.querySelector(".sun-moon-toggle")).transform);
writeFileSync(out, JSON.stringify({ port, engine, vp, scheme, touch: touchA === "1", snap, census: { rest, hovered, mid, after }, btnAfter }));
await browser.close();
console.log("ok", out, `els=${snap.length} rest=${rest.length} hovered=${hovered ? hovered.length : "-"} mid=${mid.length} after=${after.length} btnAfter=${btnAfter}`);
