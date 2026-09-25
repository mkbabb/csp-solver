import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("@playwright/test");
for (const e of ["chromium", "webkit"]) {
  const b = await pw[e].launch(); const p = await b.newPage();
  await p.setContent('<i id=a style="animation-duration: VAR(--nope, 280ms)"></i><i id=b style="animation-duration: var(--nope, 280ms)"></i>');
  const r = await p.evaluate(() => ["a", "b"].map((id) => getComputedStyle(document.getElementById(id)).animationDuration + " / " + document.getElementById(id).getAttribute("style")));
  console.log(e, JSON.stringify(r)); await b.close();
}
