// CTRL-TABS critic: (1) live url(#) filter population on the BUILT dist, tree vs head, both regimes, both engines;
// (2) painted contrast of the face-up tray's tag (ink vs tape ground) from element-screenshot bytes, both themes.
import { chromium, webkit } from "@playwright/test";
import sharp from "sharp";
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
async function painted(buf) {
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true }); const counts = new Map(); const px = [];
  for (let i = 0; i < data.length; i += 3) { const c = [data[i], data[i + 1], data[i + 2]]; px.push(c); const k = c.join(","); counts.set(k, (counts.get(k) || 0) + 1); }
  const ground = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  // ink = the pixel of max contrast against the ground; report its ratio and the 90th-percentile ratio of the 5% most-contrasting pixels
  const rs = px.map((c) => cr(c, ground)).sort((a, b) => b - a);
  return { ground, max: +rs[0].toFixed(2), p95ink: +rs[Math.floor(rs.length * 0.02)].toFixed(2) };
}
const filterCount = () => { let n = 0; for (const el of document.querySelectorAll("*")) { const cs = getComputedStyle(el); if (cs.display === "none") continue; const f = cs.filter; if (f && f.includes("url(")) n++; else if (el.getAttribute && /url\(#/.test(el.getAttribute("filter") || "")) n++; } return n; };
for (const [n, e] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await e.launch();
  for (const [tag, port] of [["tree", 4235], ["head", 4236]]) {
    for (const [w, h, coarse] of [[1280, 800, false], [390, 844, true]]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: coarse, isMobile: coarse && n === "chromium" });
      const p = await ctx.newPage(); await p.goto(`http://127.0.0.1:${port}/?board=${BOARD}`); await p.waitForSelector('[role="grid"] [role="gridcell"]'); await p.waitForTimeout(1200);
      const fc = await p.evaluate(filterCount);
      let tagPaint = null;
      if (!coarse) {
        tagPaint = {};
        for (const theme of ["light", "dark"]) {
          await p.evaluate((t) => { document.documentElement.classList.toggle("dark", t === "dark"); }, theme); await p.waitForTimeout(500);
          const loc = p.locator(".controls-card .washi-tag").first();
          tagPaint[theme] = (await loc.count()) ? await painted(await loc.screenshot()) : "absent";
        }
      }
      console.log(JSON.stringify({ engine: n, tree: tag, cell: `${w}x${h}`, pointer: coarse ? "coarse" : "fine", liveUrlFilters: fc, tagPaint }));
      await ctx.close();
    }
  }
  await b.close();
}
console.log("EXIT OK");
