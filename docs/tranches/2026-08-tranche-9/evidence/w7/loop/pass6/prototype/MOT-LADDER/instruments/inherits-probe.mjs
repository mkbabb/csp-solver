// Clause 4, in-page, both engines: a registered <time> set on :root, read by a descendant's
// transition-duration. inherits:true (the ladder's) vs inherits:false (the plant).
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const page = (inh) => `<style>@property --motion-throw { syntax: "<time>"; inherits: ${inh}; initial-value: 0ms; }
:root { --motion-throw: 520ms; } .c { transition: opacity var(--motion-throw) linear; }</style><div><div class="c">x</div></div>`;
for (const [name, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await eng.launch();
  const p = await b.newPage();
  for (const inh of ["true", "false"]) {
    await p.setContent(page(inh));
    const r = await p.evaluate(() => [getComputedStyle(document.documentElement).getPropertyValue("--motion-throw").trim(), getComputedStyle(document.querySelector(".c")).transitionDuration]);
    console.log(`${name} inherits:${inh}  :root reads ${r[0]} · child's transition-duration ${r[1]}`);
  }
  await b.close();
}
