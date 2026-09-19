#!/usr/bin/env node
/**
 * MOT-VERB PASS-2, the second probe: the three readings the first one could not take on a
 * bare load — the players well (its state needs a second player), RUB OUT (its note needs a
 * hint), and the two admitted PRM fallbacks (read off the shipped stylesheet's own text).
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import { createRequire } from "node:module";
import process from "node:process";

const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const { chromium, webkit } = createRequire(FE + "/package.json")("playwright");
const WT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-64";
const SC = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad";
const DISTS = { prototype: `${WT}/web/frontend/dist`, control: `${SC}/control/web/frontend/dist` };
const OUT = `${SC}/readings`;
mkdirSync(OUT, { recursive: true });

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".wasm": "application/wasm", ".webmanifest": "application/manifest+json", ".ico": "image/x-icon" };
function serve(root, port) {
  return new Promise((res) => {
    const srv = createServer((req, rq) => {
      const u = new URL(req.url, "http://x");
      let p = join(root, decodeURIComponent(u.pathname));
      if (!existsSync(p) || u.pathname === "/") p = join(root, "index.html");
      if (!existsSync(p)) p = join(root, "index.html");
      try {
        const b = readFileSync(p);
        rq.writeHead(200, { "content-type": MIME[extname(p)] ?? "application/octet-stream", "cache-control": "no-store" });
        rq.end(b);
      } catch { rq.writeHead(404); rq.end(); }
    });
    srv.listen(port, "127.0.0.1", () => res({ srv, base: `http://127.0.0.1:${port}/` }));
  });
}

/** The players well, on a live node wearing the SCOPE THE RULE ITSELF NAMES. */
const WELL = `(() => {
  let scope = null;
  const rules = [];
  for (const sheet of document.styleSheets) {
    let rs; try { rs = sheet.cssRules; } catch { continue; }
    for (const r of rs) {
      if (!r.selectorText || !/player-row\\.is-(arriving|returning|leaving)/.test(r.selectorText)) continue;
      rules.push({ selector: r.selectorText, animation: r.style.animation || r.style.animationName });
      const m = /\\[(data-v-[0-9a-f]+)\\]/.exec(r.selectorText);
      if (m) scope = m[1];
    }
  }
  const live = {};
  for (const state of ['is-arriving', 'is-returning', 'is-leaving']) {
    const row = document.createElement('div');
    row.className = 'player-row ' + state;
    const name = document.createElement('div');
    name.className = 'player-name';
    if (scope) { row.setAttribute(scope, ''); name.setAttribute(scope, ''); }
    row.appendChild(name);
    document.body.appendChild(row);
    const cs = getComputedStyle(row), cn = getComputedStyle(name);
    live[state] = {
      row: { name: cs.animationName, duration: Math.round(parseFloat(cs.animationDuration) * 1000), delay: Math.round(parseFloat(cs.animationDelay) * 1000), timing: cs.animationTimingFunction },
      playerName: { name: cn.animationName, duration: Math.round(parseFloat(cn.animationDuration) * 1000), delay: Math.round(parseFloat(cn.animationDelay) * 1000), timing: cn.animationTimingFunction },
    };
    row.remove();
  }
  return { scope, rules, live };
})()`;

const RUBOUT = `(async () => {
  const ink = document.querySelector('.margin-note-ink');
  if (!ink) return { note: 'no margin note' };
  ink.classList.add('is-rubbing-out');
  const cs = getComputedStyle(ink);
  const shorthand = { name: cs.animationName, duration: cs.animationDuration, timing: cs.animationTimingFunction, fill: cs.animationFillMode };
  const frames = [];
  const t0 = performance.now();
  await new Promise((res) => {
    const step = () => {
      frames.push({ t: Math.round(performance.now() - t0), clip: getComputedStyle(ink).clipPath, opacity: Number(getComputedStyle(ink).opacity).toFixed(3), boxes: ink.getClientRects().length });
      if (performance.now() - t0 < 260) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
  return { shorthand, frameCount: frames.length, boxes: [...new Set(frames.map((f) => f.boxes))], first: frames[0], mid: frames[Math.floor(frames.length / 2)], last: frames[frames.length - 1] };
})()`;

async function hintThenNote(p) {
  await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(1200);
  if (!(await p.evaluate(() => !!document.querySelector(".margin-note-ink")))) {
    await p.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) => /hint|nudge|check|why/i.test(b.textContent ?? ""));
      if (btn) btn.click();
    });
    await p.waitForTimeout(900);
  }
}

const out = [];
for (const [label, root] of Object.entries(DISTS)) {
  const { srv, base } = await serve(root, label === "prototype" ? 4247 : 4248);
  for (const [engine, launch] of [["chromium", chromium], ["webkit", webkit]]) {
    const br = await launch.launch();
    // the well, desk, light
    {
      const ctx = await br.newContext({ viewport: { width: 1280, height: 800 } });
      const p = await ctx.newPage();
      await p.goto(base, { waitUntil: "networkidle" });
      await p.waitForTimeout(600);
      out.push({ label, engine, section: "well", data: await p.evaluate(WELL) });
      await ctx.close();
    }
    // RUB OUT, phone, both themes, with and without reduce
    for (const dark of [true, false])
      for (const reduce of [false, true]) {
        const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true, colorScheme: dark ? "dark" : "light", reducedMotion: reduce ? "reduce" : "no-preference" });
        const p = await ctx.newPage();
        await p.goto(base + "?size=3&difficulty=EASY", { waitUntil: "networkidle" });
        await hintThenNote(p);
        out.push({ label, engine, section: "rubout", dark, reduce, data: await p.evaluate(RUBOUT) });
        await ctx.close();
      }
    await br.close();
  }
  srv.close();
  console.log(`${label} done`);
}
writeFileSync(join(OUT, "p2b-readings.json"), JSON.stringify(out, null, 2));
for (const row of out) console.log(`${row.label}/${row.engine}/${row.section}${row.dark === undefined ? "" : ` dark=${row.dark} reduce=${row.reduce}`}: ${JSON.stringify(row.data.live ?? row.data.shorthand ?? row.data)}`.slice(0, 400));
process.exit(0);
