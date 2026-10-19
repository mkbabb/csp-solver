// Where the `i` (keys) stop stands on a dist: every .info-btn and every .icon-btn, with its box and display.
import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/paint-lib.mjs";
const [base, label] = process.argv.slice(2);
const browser = await playwright().chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(`${base}/`);
await page.waitForTimeout(4000);
console.log(label, JSON.stringify(await page.evaluate(() => ({
  hover: matchMedia("(hover: hover) and (pointer: fine)").matches,
  btns: [...document.querySelectorAll(".info-btn, .icon-btn, [aria-controls=keys-fold]")].map((n) => { const r = n.getBoundingClientRect(); return `${n.tagName.toLowerCase()}.${n.className.replace(/\s+/g, ".")} [${n.getAttribute("aria-label")}] ${Math.round(r.width)}x${Math.round(r.height)} ${getComputedStyle(n).display}${n.closest("[inert]") ? " INERT" : ""}`; }),
}))));
await browser.close();
