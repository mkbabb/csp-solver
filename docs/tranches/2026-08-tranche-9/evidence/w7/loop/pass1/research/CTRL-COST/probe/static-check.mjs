// CTRL-COST pass-1 · the static page's own zero-reflow + floor + contrast read.
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { writeFileSync } from "node:fs";
const URL =
  "http://127.0.0.1:4234/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/CTRL-COST/proto/cost-card-static.html";
const out = {};
for (const [name, w, h] of [["390x844", 390, 844], ["1280x800", 1280, 800]])
  for (const engine of ["chromium", "webkit"]) {
    const browser = await (engine === "webkit" ? webkit : chromium).launch();
    const page = await (await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })).newPage();
    await page.goto(URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const r = await page.evaluate(async () => {
      const R = (e) => { const b = e.getBoundingClientRect(); return [+b.top.toFixed(3), +b.right.toFixed(3), +b.bottom.toFixed(3), +b.left.toFixed(3)]; };
      const band = document.querySelectorAll(".cost-band")[2];
      const faces = [...document.querySelectorAll(".cost-face-destructive")];
      const before = { band: R(band), faces: faces.map(R), doc: document.body.scrollHeight };
      faces[0].click();
      await new Promise((r2) => setTimeout(r2, 260));
      const after = { band: R(band), faces: faces.map(R), doc: document.body.scrollHeight };
      const tap = [...document.querySelectorAll(".cost-face, .chip")].map((e) => { const b = e.getBoundingClientRect(); return [+b.width.toFixed(2), +b.height.toFixed(2)]; });
      return {
        deltaBand: before.band.map((v, i) => +(after.band[i] - v).toFixed(3)),
        deltaFaces: before.faces.map((f, i) => f.map((v, j) => +(after.faces[i][j] - v).toFixed(3))),
        deltaDoc: after.doc - before.doc,
        armed: document.querySelector(".cost-word-armed").textContent,
        worstW: Math.min(...tap.map((t) => t[0])), worstH: Math.min(...tap.map((t) => t[1])),
        bandNamePx: +parseFloat(getComputedStyle(document.querySelector(".cost-band-name")).fontSize).toFixed(2),
        chipPx: +parseFloat(getComputedStyle(document.querySelector(".chip")).fontSize).toFixed(2),
        face: getComputedStyle(document.querySelector(".cost-band-name")).fontFamily.split(",")[0],
      };
    });
    out[`${name}-${engine}`] = r;
    console.log(`${name}-${engine}`.padEnd(20), "Δband", JSON.stringify(r.deltaBand), "Δdoc", r.deltaDoc, "ratio", (r.bandNamePx / r.chipPx).toFixed(4), "floor", r.worstW + "×" + r.worstH, r.face);
    await browser.close();
  }
writeFileSync("../readings/static-page.json", JSON.stringify(out, null, 1));
