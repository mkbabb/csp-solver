import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
const OUT = process.argv[2], ENGINE = process.argv[3] || "chromium", PORT = process.argv[4];
const BASE = `http://127.0.0.1:${PORT}`;
const DECK = () => {
  const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect();
    return { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) }; };
  const chip = document.querySelector(".staging-band .option-chip, .staging-band [role='radio'], .staging-band button");
  const cs = chip ? getComputedStyle(chip) : null;
  const chips = [...document.querySelectorAll(".staging-band .staging-axis button, .staging-band .staging-axis [role='radio']")]
    .slice(0, 4).map((e) => ({ t: (e.textContent||"").trim().slice(0,8), fs: getComputedStyle(e).fontSize, box: r(e) }));
  return {
    band: r(document.querySelector(".staging-band")),
    slip: r(document.querySelector(".staging-slip")),
    axes: r(document.querySelector(".staging-axes")),
    firstCard: r(document.querySelector(".game-card, .staging-card, [class*=card-wordmark]")),
    tape: r(document.querySelector(".staging-band .washi-tag, .staging-band .washi-label")),
    chipFS: cs ? cs.fontSize : null,
    chips,
    typeOption: getComputedStyle(document.documentElement).getPropertyValue("--type-option").trim(),
  };
};
const run = async () => {
  const b = await (ENGINE === "webkit" ? webkit : chromium).launch();
  const out = { engine: ENGINE, base: BASE, cells: {} };
  for (const [name, vp] of [["w900x700", {width:900,height:700}], ["w390x844", {width:390,height:844}], ["w1280x800",{width:1280,height:800}]]) {
    const ctx = await b.newContext({ viewport: vp, baseURL: BASE });
    const p = await ctx.newPage();
    await p.goto("/?view=gallery&size=3&difficulty=EASY");
    await p.waitForSelector(".staging-band", { timeout: 40000 });
    await p.waitForTimeout(900);
    out.cells[name] = await p.evaluate(DECK);
    await ctx.close();
  }
  await b.close();
  writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log("WROTE", OUT);
};
run().then(() => console.log("EXIT 0"), (e) => { console.error("FAIL", e); process.exit(1); });
