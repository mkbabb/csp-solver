import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const html = (rule) => `<style>:root{--motion-whisper:900ms}${rule}</style><div id=a><div id=b></div></div>`;
const cases = {
  none: "",
  lower: '@property --motion-whisper{syntax:"<time>";inherits:false;initial-value:0ms}',
  upper: '@PROPERTY --motion-whisper{syntax:"<time>";inherits:false;initial-value:0ms}',
  escape: '@property --motion-whisp\\65r{syntax:"<time>";inherits:false;initial-value:0ms}',
};
for (const [n, B] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await B.launch(); const p = await b.newPage();
  for (const [k, r] of Object.entries(cases)) {
    await p.setContent(html(r));
    const v = await p.evaluate(() => getComputedStyle(document.getElementById("b")).getPropertyValue("--motion-whisper").trim());
    console.log(`${n} ${k}: child reads '${v}' (${v === "900ms" ? "inherits (not registered inherits:false)" : "REGISTERED inherits:false"})`);
  }
  await b.close();
}
