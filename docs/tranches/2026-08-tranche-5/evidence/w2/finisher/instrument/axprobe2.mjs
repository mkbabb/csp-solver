// Follow-up: disambiguate the two rows where my census diverged from r1's banked figures —
// tab-stop count and focusables-outside-main. r1's script is gone, so the question is whether
// the divergence is the ESTATE or my INSTRUMENT. Walk the real tab order with keyboard.Tab,
// which is instrument-free.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const { chromium } = await import(process.env.PW_ENTRY);

const DIST = path.resolve(process.argv[2]);
const PORT = Number(process.argv[3]);
const OUT = path.resolve(process.argv[4]);
const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".wasm": "application/wasm",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
};
const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  let f = path.join(DIST, decodeURIComponent(u.pathname));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory())
    f = path.join(DIST, "index.html");
  res.writeHead(200, {
    "content-type": MIME[path.extname(f)] || "application/octet-stream",
  });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(`http://localhost:${PORT}/?game=sudoku&size=3&difficulty=EASY`, {
  waitUntil: "networkidle",
});
await page.waitForSelector('[role="gridcell"]');
await page.waitForTimeout(1500);

const cellTabindex = await page.evaluate(() => {
  const cells = [...document.querySelectorAll('[role="gridcell"]')];
  const census = {};
  for (const c of cells) {
    const ti = c.getAttribute("tabindex");
    census[String(ti)] = (census[String(ti)] || 0) + 1;
  }
  const inputs = [...document.querySelectorAll('[role="gridcell"] input')];
  const inputTi = {};
  for (const i of inputs) {
    const ti = i.getAttribute("tabindex");
    inputTi[String(ti)] = (inputTi[String(ti)] || 0) + 1;
  }
  return { cellTabindex: census, cellInputCount: inputs.length, inputTabindex: inputTi };
});

// The real tab order: press Tab until it cycles back.
await page.evaluate(() => document.body.focus());
const order = [];
const seen = new Set();
for (let i = 0; i < 200; i++) {
  await page.keyboard.press("Tab");
  const cur = await page.evaluate(() => {
    const a = document.activeElement;
    if (!a || a === document.body) return null;
    const main = document.querySelector("main");
    return {
      tag: a.tagName.toLowerCase(),
      role: a.getAttribute("role"),
      label: (a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 48),
      ti: a.getAttribute("tabindex"),
      inMain: !!(main && main.contains(a)),
      key:
        a.tagName +
        "|" +
        (a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 48) +
        "|" +
        (a.id || ""),
    };
  });
  if (!cur) break;
  if (seen.has(cur.key)) break;
  seen.add(cur.key);
  order.push(cur);
}

// The attribution card's own links: are they in the tree with the card closed?
const attribution = await page.evaluate(() => {
  const hits = [...document.querySelectorAll("a[href]")].map((a) => {
    const r = a.getBoundingClientRect();
    const cs = getComputedStyle(a);
    return {
      text: a.textContent.trim().slice(0, 40),
      href: a.getAttribute("href"),
      w: +r.width.toFixed(1),
      h: +r.height.toFixed(1),
      visibility: cs.visibility,
      display: cs.display,
      opacity: cs.opacity,
      offsetParentNull: a.offsetParent === null,
      inert: !!a.closest("[inert]"),
      ariaHidden: !!a.closest('[aria-hidden="true"]'),
      cardOpen: a.closest('[class*="attribution"]')?.className || null,
    };
  });
  return hits;
});

fs.writeFileSync(
  OUT,
  JSON.stringify(
    {
      when: new Date().toISOString(),
      cellTabindex,
      realTabOrderCount: order.length,
      realTabOrder: order,
      outsideMainInRealOrder: order.filter((o) => !o.inMain).map((o) => o.label),
      anchors: attribution,
    },
    null,
    1,
  ),
);
console.log("tabStops(real):", order.length);
console.log("outsideMain:", JSON.stringify(order.filter((o) => !o.inMain).map((o) => o.label)));
console.log("cells:", JSON.stringify(cellTabindex));
await browser.close();
server.close();
