/** CRITIC re-run of the lane's CONFIRM'S FACE row, plus the readings the lane did not take:
 *  the drawn FRAME's own stroke colour (the lane reports the WORD's), the sentence's ink, the
 *  measured contrast of every painted colour against the bare card, and the fine-pointer arm. */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
const OUT = process.argv[2];
const BASE = process.argv[3];

const FACE = () => {
  const rib = document.querySelector(".confirm-ribbon");
  if (!rib) return { present: false };
  const r = rib.getBoundingClientRect();
  const row = rib.parentElement.getBoundingClientRect();
  const card = document.querySelector(".controls-card");
  const answers = [...rib.querySelectorAll(".confirm-answer")].map((a) => {
    const b = a.getBoundingClientRect();
    const word = [...a.querySelectorAll("span")].find((s) => !s.hasAttribute("aria-hidden"));
    const path = a.querySelector("svg path");
    const ps = path ? getComputedStyle(path) : null;
    return {
      cls: a.className,
      name: a.textContent.trim(),
      w: +b.width.toFixed(2), h: +b.height.toFixed(2),
      strokeWidth: ps?.strokeWidth ?? null,
      frameStroke: ps?.stroke ?? null,            // ← the reading the lane omitted
      frameFill: ps?.fill ?? null,
      pathLen: path ? +path.getTotalLength().toFixed(1) : null,
      wordColor: word ? getComputedStyle(word).color : null,
      bg: getComputedStyle(a).backgroundColor,
    };
  });
  const ask = rib.querySelector(".confirm-ask");
  return {
    present: true,
    ribbonW: +r.width.toFixed(2), rowW: +row.width.toFixed(2),
    ribbonH: +r.height.toFixed(2),
    askText: ask?.textContent.trim(), askColor: ask ? getComputedStyle(ask).color : null,
    askFont: ask ? getComputedStyle(ask).fontSize + " " + getComputedStyle(ask).fontFamily.split(",")[0] : null,
    cardBg: card ? getComputedStyle(card).backgroundColor : null,
    role: rib.getAttribute("role"), ariaLabel: rib.getAttribute("aria-label"),
    answers,
  };
};

async function drive(engine, theme) {
  const b = await engine.launch();
  const ctx = await b.newContext({
    baseURL: BASE, viewport: { width: 390, height: 844 },
    hasTouch: true, isMobile: engine === webkit, colorScheme: theme,
  });
  const p = await ctx.newPage();
  await p.goto("/?size=3&difficulty=EASY");
  await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  for (let i = 0; i < 12; i++) { await p.locator(".sudoku-cell").nth(i).click(); await p.keyboard.press("5"); }
  await p.waitForTimeout(200);
  await p.locator(".drawer-tab").click();
  await p.waitForTimeout(950);                       // the sheet SLIDES
  await p.evaluate(() => document.querySelector(".filter-tuner-toggle, .pencil-dev-toggle, [class*='tuner']")?.remove());
  const before = await p.evaluate(FACE);
  await p.locator('.action-verbs button', { hasText: 'clear' }).first().click();
  await p.waitForTimeout(260);
  const armed = await p.evaluate(FACE);
  await ctx.close(); await b.close();
  return { before, armed };
}

const out = {};
for (const [n, e] of [["chromium", chromium], ["webkit", webkit]])
  for (const t of ["dark", "light"]) {
    try { out[`${n}/${t}`] = await drive(e, t); }
    catch (err) { out[`${n}/${t}`] = { error: String(err).slice(0, 200) }; }
  }
writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2).slice(0, 4000));
