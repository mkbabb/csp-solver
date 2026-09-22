// T9-W7 pass 4 · CTRL-RULE — charter rows 3 and 6 (the foot on the inset; the registration).
//  A · SOURCE: `.card-foot`'s rule carries `env(safe-area-inset-bottom)` — on this tree, and the
//      same regex over the 74a2b5d9 control's scene.css as its negative control (no foot there).
//  B · COMPUTED at 390×844 hasTouch, both engines: the foot's padding-bottom = its own pad
//      (0.15rem = 2.4px — Playwright supplies no inset) and `--card-foot-h` = ceil(foot box).
//  C · THE REGISTRATION TOOK: `--card-pad-{t,x}` / `--card-foot-h` read "0px" on a host that
//      declares nothing (documentElement); an UNREGISTERED name reads "" there (negative control).
//  D · THE PUBLISHER RAN: `--card-pad-x` on `.drawer-case` = the card's padding-left, and the
//      foot's padding-left equals it.  BORN-RED: delete the publisher's value ON THE DECLARING
//      HOST (the case) — the foot's inset falls to the registered 0px, visibly, in the same run.
// node foot-tokens.mjs <chromium|webkit> <BASE> <WORKTREE_FRONTEND> <CONTROL_FRONTEND>
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
const [E = "chromium", BASE = "http://127.0.0.1:4231/", WT, CT] = process.argv.slice(2);
const footRule = (css) => (css.match(/\.card-foot\s*\{[^}]*\}/) || [""])[0];
const src = {
  proto: /env\(safe-area-inset-bottom\)/.test(footRule(readFileSync(join(WT, "src/games/shared/scene.css"), "utf8"))),
  control: /env\(safe-area-inset-bottom\)/.test(footRule(readFileSync(join(CT, "src/games/shared/scene.css"), "utf8"))),
};
const b = await (E === "webkit" ? webkit : chromium).launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: E === "chromium", deviceScaleFactor: 1 });
const p = await ctx.newPage();
await p.goto(`${BASE}?size=3`); await p.waitForSelector(".sudoku-cell"); await p.waitForTimeout(1600);
if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) { await p.locator(".drawer-tab").first().click({ force: true }); await p.waitForTimeout(1100); }
const r = await p.evaluate(() => {
  const root = getComputedStyle(document.documentElement);
  const foot = document.getElementById("card-foot"), cas = document.querySelector(".drawer-case"), card = document.querySelector(".controls-card");
  const fcs = getComputedStyle(foot);
  const o = {
    coarse: matchMedia("(pointer: coarse)").matches,
    footPadB: fcs.paddingBottom, footPadL: fcs.paddingLeft, footH: foot.getBoundingClientRect().height,
    cardFootH: getComputedStyle(card).getPropertyValue("--card-foot-h"),
    took: Object.fromEntries(["--card-pad-t", "--card-pad-x", "--card-foot-h", "--card-pad-unregistered"].map((k) => [k, root.getPropertyValue(k)])),
    caseCardPadX: getComputedStyle(cas).getPropertyValue("--card-pad-x"), cardPadL: getComputedStyle(card).paddingLeft,
  };
  cas.style.removeProperty("--card-pad-x");
  o.ablated = { caseVar: getComputedStyle(cas).getPropertyValue("--card-pad-x"), footPadL: getComputedStyle(foot).paddingLeft };
  return o;
});
const out = { engine: E, src, ...r,
  verdict: {
    sourceGate: src.proto && !src.control,
    insetComputed: r.footPadB === "2.4px",
    footHPublished: r.cardFootH === `${Math.ceil(r.footH)}px`,
    registrationTook: r.took["--card-pad-x"] === "0px" && r.took["--card-pad-t"] === "0px" && r.took["--card-foot-h"] === "0px" && r.took["--card-pad-unregistered"] === "",
    publisherRan: r.caseCardPadX === r.cardPadL && r.footPadL === r.cardPadL,
    bornRedFires: r.ablated.footPadL === "0px" && r.cardPadL !== "0px",
  } };
console.log(E, JSON.stringify(out.verdict), JSON.stringify({ footPadB: r.footPadB, footPadL: r.footPadL, cardPadL: r.cardPadL, ablated: r.ablated, took: r.took }));
writeFileSync(join(OUT, `foot-tokens-${E}.json`), JSON.stringify(out, null, 1));
await b.close();
console.log("EXIT OK");
