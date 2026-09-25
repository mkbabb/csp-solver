import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
const html = `<svg width="100" height="20"><defs><linearGradient id="solver-ink"><stop offset="0" stop-color="red"/><stop offset="1" stop-color="blue"/></linearGradient></defs>
<style>.a{stroke:url(#solver\\-ink);stroke-width:8}.b{stroke:url(#nope);stroke-width:8}</style>
<path class="a" d="M0 5 H100"/><path class="b" d="M0 15 H100"/></svg>`;
for (const [n, L] of [["chromium", pw.chromium], ["webkit", pw.webkit]]) {
  const b = await L.launch(); const p = await b.newPage(); await p.setContent(html);
  const r = await p.evaluate(() => [...document.querySelectorAll("path")].map((e) => getComputedStyle(e).stroke));
  const px = await p.screenshot({ clip: { x: 40, y: 3, width: 1, height: 1 } });
  console.log("T10", n, "computed", JSON.stringify(r)); await b.close();
}
