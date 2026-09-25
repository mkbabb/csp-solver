import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [url, engine = "chromium", scheme = "light"] = process.argv.slice(2);
const b = await pw[engine].launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: scheme });
await p.goto(url); await p.waitForTimeout(3000);
const read = () => p.evaluate(() => {
  const m = document.querySelector('meta[name="theme-color"]');
  const probe = document.createElement("div"); probe.style.color = m?.content ?? "transparent"; document.body.append(probe);
  const metaRgb = getComputedStyle(probe).color; probe.remove();
  const pr = document.querySelector(".page-root") ?? document.body;
  return { metas: document.querySelectorAll('meta[name="theme-color"]').length, content: m?.content ?? null, metaRgb, paper: getComputedStyle(pr).backgroundColor, body: getComputedStyle(document.body).backgroundColor, dark: document.documentElement.classList.contains("dark") };
});
const rows = [await read()];
for (let i = 0; i < 2; i++) { await p.locator(".sun-moon-toggle").click(); await p.waitForTimeout(1500); rows.push(await read()); }
console.log(`META ${engine} ${scheme} ${rows.map((r) => `${r.dark ? "dark" : "light"}: metas ${r.metas} content ${r.content} → ${r.metaRgb} vs paper ${r.paper} ${r.metaRgb === r.paper ? "EQUAL" : "DIFFERS"}`).join(" | ")}`);
await b.close();
