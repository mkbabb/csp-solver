#!/usr/bin/env node
/** CTRL-COST pass-3 RESEARCH r3 — WHO PRICES THE CARD, TO THE ELEMENT; AND THE BERTH'S INK.
 *
 *  r2 showed the card's width is the widest max-content box inside it, and that at the HEAD
 *  control (74a2b5d9) that box is `.legend-fold` — 284.22 chromium / 292.31 webkit. Under the
 *  chair's §6.4 (the card's width outranks its content) the ladder's rows have to FIT that
 *  number, so this probe names every box in the prototype whose max-content exceeds it, with
 *  its own children's arithmetic, at the desk in both engines.
 *
 *  It also measures the berthed tape's ink against its paper (critic row 7): the label's box,
 *  its computed padding / line-height, and the Range box of the text inside it.
 */
import fs from "node:fs";
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-30/web/frontend/node_modules/playwright/index.mjs";

const OUT = process.argv[2] || "./r3.json";
const PROTO = "http://127.0.0.1:4233";
const HEAD = "http://127.0.0.1:4234";
const FLOOR = 250; // report every box wider than this in max-content

const CENSUS = (floor) => {
  const name = (el) =>
    `${el.tagName}.${(el.className?.baseVal ?? el.className ?? "").toString().trim().split(/\s+/).slice(0, 3).join(".")}`;
  const card = document.querySelector(".controls-card");
  const out = [];
  const walk = (el, depth) => {
    if (depth > 6) return;
    const prev = el.style.width;
    el.style.width = "max-content";
    const w = +el.getBoundingClientRect().width.toFixed(2);
    el.style.width = prev;
    if (w >= floor) {
      const cs = getComputedStyle(el);
      out.push({
        depth,
        sel: name(el),
        maxContent: w,
        laid: +el.getBoundingClientRect().width.toFixed(2),
        display: cs.display,
        gap: cs.gap,
        flexWrap: cs.flexWrap,
        kids: Array.from(el.children).map((k) => {
          const p = k.style.width;
          k.style.width = "max-content";
          const kw = +k.getBoundingClientRect().width.toFixed(2);
          k.style.width = p;
          return { sel: name(k), maxContent: kw };
        }),
      });
    }
    for (const k of el.children) walk(k, depth + 1);
  };
  if (card) walk(card, 0);
  out.sort((a, b) => b.maxContent - a.maxContent);
  return out;
};

const BERTH = () => {
  const lab = document.querySelector(".cost-band-head .note-berth .washi-label.is-shown");
  if (!lab) return { shown: false };
  const cs = getComputedStyle(lab);
  const b = lab.getBoundingClientRect();
  // the ink: a Range over the label's text, which ignores the box's padding.
  const rng = document.createRange();
  rng.selectNodeContents(lab);
  const ib = rng.getBoundingClientRect();
  const head = lab.closest(".cost-band-head").getBoundingClientRect();
  return {
    shown: true,
    text: (lab.textContent || "").trim().slice(0, 60),
    label: { w: +b.width.toFixed(2), h: +b.height.toFixed(2), y: +b.y.toFixed(2), bottom: +b.bottom.toFixed(2) },
    ink: { w: +ib.width.toFixed(2), h: +ib.height.toFixed(2), y: +ib.y.toFixed(2), bottom: +ib.bottom.toFixed(2) },
    inkAboveLabelTop: +(b.y - ib.y).toFixed(2),
    inkBelowLabelBottom: +(ib.bottom - b.bottom).toFixed(2),
    padding: cs.padding,
    lineHeight: cs.lineHeight,
    fontSize: cs.fontSize,
    transform: cs.transform,
    headBox: { h: +head.height.toFixed(2), y: +head.y.toFixed(2), bottom: +head.bottom.toFixed(2) },
    overhangBelowHead: +(b.bottom - head.bottom).toFixed(2),
  };
};

async function run(engine, name, base, withBerth) {
  const br = await engine.launch();
  const ctx = await br.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`${base}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1400);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  const census = await page.evaluate(CENSUS, FLOOR);
  let berth = { shown: false };
  if (withBerth) {
    // hover the `fill` verb: the writing band's note takes its berth in that band's head.
    const fill = page.locator('button[aria-label^="Fill in every cell"]');
    if (await fill.count()) {
      await fill.hover();
      await page.waitForTimeout(600);
      berth = await page.evaluate(BERTH);
    }
  }
  await ctx.close();
  await br.close();
  return { lane: base === PROTO ? "proto(-30)" : "HEAD(74a2b5d9)", engine: name, census, berth };
}

const out = [];
for (const [e, n] of [
  [chromium, "chromium"],
  [webkit, "webkit"],
]) {
  for (const [base, wb] of [
    [PROTO, true],
    [HEAD, false],
  ]) {
    try {
      out.push(await run(e, n, base, wb));
    } catch (err) {
      out.push({ lane: base, engine: n, error: String(err).slice(0, 600) });
    }
    fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  }
}
console.log("DONE", OUT);
