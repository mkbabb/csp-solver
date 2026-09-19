#!/usr/bin/env node
/** CTRL-COST pass-3 RESEARCH r2 — THE CARD'S WIDTH, THE HEAD'S CLOSED FORM, THE SCOPED TOKEN.
 *
 *  Run against TWO servers: the pass-2 prototype (:4233, worktree -30) and the HEAD CONTROL
 *  (:4234, MAIN at 74a2b5d9 — the W7 execution fold, chair §2.7/§7.4). Desk 1280×800, both
 *  engines. Read-only; nothing is clicked that writes to the board.
 *
 *  1 · π attribution: the card's box, the board column's x, the wordmark and the first cell —
 *      the four boxes the three RED goldens are cut from.
 *  2 · WHO PRICES THE CARD: per-child max-content contribution inside the scrollport, so the
 *      chair's §6.4 width law can be written against the real ranking rather than pass 2's.
 *  3 · THE HEAD'S CLOSED FORM: `.cost-band-head`'s own metrics (padding-block, the heading's
 *      font-size / line-height / box) against the MEASURED `--cost-head-h` the panel publishes
 *      — the merge-watch question (TAPE derives its band, COST measures it).
 *  4 · `--sheet-chrome` where it is actually declared (the scoped case), not on :root.
 */
import fs from "node:fs";
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-30/web/frontend/node_modules/playwright/index.mjs";

const OUT = process.argv[2] || "./r2.json";
const LANES = [
  { name: "proto(-30, pass-2 diff)", base: "http://127.0.0.1:4233" },
  { name: "HEAD(74a2b5d9)", base: "http://127.0.0.1:4234" },
];

const READ = () => {
  const r = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return {
      w: +b.width.toFixed(2),
      h: +b.height.toFixed(2),
      x: +b.x.toFixed(2),
      y: +b.y.toFixed(2),
    };
  };
  const card = document.querySelector(".controls-card");
  const cs = card && getComputedStyle(card);
  const caseEl = document.querySelector(".drawer-case");
  const cases = caseEl && getComputedStyle(caseEl);
  const cell = document.querySelector(".game-cell");
  const logo = document.querySelector(".wordmark, .site-wordmark, header svg");

  // per-child max-content contribution: give the child `width: max-content` and read its box.
  const rows = [];
  const kids = card ? Array.from(card.children) : [];
  for (const k of kids) {
    const inner = Array.from(k.children);
    const probe = [k, ...inner];
    for (const el of probe) {
      const prev = el.style.width;
      el.style.width = "max-content";
      const w = +el.getBoundingClientRect().width.toFixed(2);
      el.style.width = prev;
      rows.push({
        sel: `${el.tagName}.${(el.className?.baseVal ?? el.className ?? "").toString().trim().split(/\s+/).slice(0, 2).join(".")}`,
        maxContent: w,
        laid: +el.getBoundingClientRect().width.toFixed(2),
      });
    }
  }
  rows.sort((a, b) => b.maxContent - a.maxContent);

  const head = document.querySelector(".cost-band-head");
  const hs = head && getComputedStyle(head);
  const h2 = head && head.querySelector(".section-heading");
  const h2s = h2 && getComputedStyle(h2);

  return {
    card: r(card),
    cardPad: cs
      ? { top: cs.paddingTop, bottom: cs.paddingBottom, left: cs.paddingLeft, right: cs.paddingRight }
      : null,
    caseBox: r(caseEl),
    sheetChromeOnCase: cases ? cases.getPropertyValue("--sheet-chrome").trim() : "",
    sheetChromeOnCard: cs ? cs.getPropertyValue("--sheet-chrome").trim() : "",
    pinBandOnCard: cs ? cs.getPropertyValue("--pin-band").trim() : "",
    costHeadOnCard: cs ? cs.getPropertyValue("--cost-head-h").trim() : "",
    firstCell: r(cell),
    logo: r(logo),
    board: r(document.querySelector(".board-cells, .game-board")),
    widest: rows.slice(0, 8),
    head: head
      ? {
          box: r(head),
          paddingBlock: `${hs.paddingTop} / ${hs.paddingBottom}`,
          marginBottom: hs.marginBottom,
          heading: h2
            ? {
                box: r(h2),
                fontSize: h2s.fontSize,
                lineHeight: h2s.lineHeight,
                fontFamily: h2s.fontFamily.split(",")[0],
              }
            : null,
        }
      : null,
  };
};

async function run(engine, name, lane) {
  const br = await engine.launch();
  const ctx = await br.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`${lane.base}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1400);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  const reading = await page.evaluate(READ);
  await ctx.close();
  await br.close();
  return { lane: lane.name, engine: name, ...reading };
}

const out = [];
for (const lane of LANES)
  for (const [e, n] of [
    [chromium, "chromium"],
    [webkit, "webkit"],
  ]) {
    try {
      out.push(await run(e, n, lane));
    } catch (err) {
      out.push({ lane: lane.name, engine: n, error: String(err).slice(0, 600) });
    }
    fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  }
console.log("DONE", OUT);
