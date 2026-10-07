// critic pass 8 · CTRL-FACE row 11 re-derived: every sideways scroll range on the page, the card's overhang, hover shift
import { createRequire } from "node:module";
import os from "node:os";
const req = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend/package.json");
const pw = req("@playwright/test");
const [engine, url, tag] = process.argv.slice(2);
const Q = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await pw[engine].launch();
const out = [];
for (const [w, h] of [[1024, 768], [1100, 800], [1280, 800], [1366, 768], [1440, 900], [1920, 1080]])
  for (const touch of [false, true]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(`${url}/?${Q}`);
    await p.locator(".board-cells").first().waitFor({ timeout: 90000 });
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => {
      const ranges = [];
      for (const e of document.querySelectorAll("*")) {
        if (!e.getClientRects().length) continue;
        const cs = getComputedStyle(e);
        if (e.scrollWidth > e.clientWidth + 1 && /(auto|scroll)/.test(cs.overflowX))
          ranges.push(`${e.tagName.toLowerCase()}.${String(e.className?.baseVal ?? e.className).trim().split(/\s+/)[0]} ${e.scrollWidth}/${e.clientWidth} ox=${cs.overflowX}`);
      }
      const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
      if (!card) return { ranges, card: null };
      const cr = card.getBoundingClientRect(), cs = getComputedStyle(card);
      const inL = cr.left + parseFloat(cs.borderLeftWidth), inR = inL + card.clientWidth;
      let worst = 0, who = "";
      for (const e of card.querySelectorAll("*")) {
        const q = e.getBoundingClientRect();
        if (!q.width || !q.height) continue;
        const o = Math.max(inL - q.left, q.right - inR);
        if (o > worst) { worst = o; who = `${e.tagName.toLowerCase()}.${String(e.className?.baseVal ?? e.className).trim().split(/\s+/)[0]}`; }
      }
      return { ranges, card: { sw: card.scrollWidth, cw: card.clientWidth, ox: cs.overflowX, worst: Math.round(worst * 100) / 100, who, docSW: document.documentElement.scrollWidth, docCW: document.documentElement.clientWidth } };
    });
    // hover every wide note with the real mouse; read the card's scrollLeft after
    const shifts = [];
    const notes = p.locator(".controls-card:visible .washi-wide");
    const n = await notes.count();
    for (let i = 0; i < n; i++) {
      const nb = await notes.nth(i).boundingBox().catch(() => null);
      if (!nb) { shifts.push("nobox"); continue; }
      await p.mouse.move(nb.x + nb.width / 2, nb.y + nb.height / 2);
      await p.waitForTimeout(350);
      shifts.push(await p.evaluate(() => [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length)?.scrollLeft ?? null));
      await p.mouse.move(2, 2);
    }
    out.push({ vp: `${w}x${h}`, touch, ...r, noteShift: shifts });
    await ctx.close();
  }
console.log(JSON.stringify({ engine, tag, load: os.loadavg()[0].toFixed(1), out }));
await b.close();
