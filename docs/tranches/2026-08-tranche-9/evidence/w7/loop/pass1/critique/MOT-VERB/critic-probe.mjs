import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-52/web/frontend/node_modules/playwright/index.mjs";

const URL_ = "http://127.0.0.1:4241/";
const SELS = [
  ".gallery-fade-leave-active",
  ".app-layout.scene-leaving .scene-controls",
  "html.gallery-leaving .scene-controls",
  ".player-row.is-arriving",
  ".player-row.is-returning",
  ".player-row.is-arriving .player-name",
  ".player-row.is-returning .player-name",
  ".drawer-tab-text",
  ".face",
  ".washi-label",
  ".sparkle-icon",
  ".toggle-icon",
  ".toggle-icon.is-active",
];

const dump = (sels) => {
  const out = {};
  const want = new Set(sels);
  for (const sheet of Array.from(document.styleSheets)) {
    let rules;
    try { rules = Array.from(sheet.cssRules); } catch { continue; }
    const walk = (rs, ctx) => {
      for (const r of rs) {
        if (r.cssRules) { walk(Array.from(r.cssRules), (ctx ? ctx + " | " : "") + (r.conditionText ?? r.media?.mediaText ?? r.name ?? "@")); continue; }
        if (!r.selectorText) continue;
        for (const s of r.selectorText.split(",").map((x) => x.trim())) {
          if (!want.has(s)) continue;
          const t = r.style.transition || [r.style.transitionProperty, r.style.transitionDuration, r.style.transitionTimingFunction, r.style.transitionDelay].filter(Boolean).join(" ");
          const a = r.style.animation || [r.style.animationName, r.style.animationDuration, r.style.animationTimingFunction, r.style.animationDelay].filter(Boolean).join(" ");
          if (!t && !a) continue;
          (out[s] ??= []).push({ ctx, transition: t || undefined, animation: a || undefined });
        }
      }
    };
    walk(Array.from(sheet.cssRules), "");
  }
  return out;
};

const rootVars = () => {
  const cs = getComputedStyle(document.documentElement);
  const names = ["--rung-page", "--rung-step", "--rung-sheet", "--rung-mark", "--rung-breath", "--rung-touch", "--verb-dusk-ms", "--verb-layDown-ease", "--verb-lift-ease", "--verb-slide-ease", "--verb-writeIn-ease", "--verb-rubOut-ease", "--verb-dusk-ease", "--verb-turn-ease", "--ease-glassGlide", "--ease-noteWrite", "--ease-fadeOut", "--ease-ghostDraw"];
  return Object.fromEntries(names.map((n) => [n, cs.getPropertyValue(n).trim()]));
};

const live = () => {
  const probe = {};
  for (const sel of [".drawer-tab-text", ".face", ".washi-label", ".sparkle-icon", ".scene-controls", ".gallery-pip", ".progress-trace"]) {
    const el = document.querySelector(sel);
    if (!el) { probe[sel] = "absent"; continue; }
    const cs = getComputedStyle(el);
    probe[sel] = `${cs.transitionProperty} | ${cs.transitionDuration} | ${cs.transitionTimingFunction} | ${cs.transitionDelay}`;
  }
  return probe;
};

const filterCensus = () => {
  let n = 0; const distinct = new Set();
  for (const el of document.querySelectorAll("*")) {
    const f = getComputedStyle(el).filter;
    if (f && f !== "none") { n++; distinct.add(f); }
  }
  return { elements: n, distinct: distinct.size, svgFilters: document.querySelectorAll("filter").length };
};

const results = {};
for (const [name, engine] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await engine.launch();
  const r = {};
  for (const [mode, prm] of [["normal", "no-preference"], ["reduce", "reduce"]]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: prm });
    const page = await ctx.newPage();
    await page.goto(URL_, { waitUntil: "load" });
    await page.waitForTimeout(2500);
    r[mode] = {
      root: await page.evaluate(rootVars),
      live: await page.evaluate(live),
    };
    if (mode === "normal") {
      r.rules = await page.evaluate(dump, SELS);
      r.filters = await page.evaluate(filterCensus);
      r.title = await page.title();
    }
    await ctx.close();
  }
  await browser.close();
  results[name] = r;
}
console.log(JSON.stringify(results, null, 1));
