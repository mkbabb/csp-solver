// T5-W2 FINISHER lane B — POST-distill AX capture.
// Instrument semantics deliberately mirror r1/a11y.md and r2/verify-gate-criticals.md §5:
// built dist served static, repo's own playwright chromium, AX read via CDP
// Accessibility.getFullAXTree. No axe-core (absent from node_modules; installing would
// mutate the lockfile — same bar r1 held).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
// Resolved off web/frontend's own node_modules — the repo's playwright 1.61.1, not a fresh install.
const { chromium } = await import(
  process.env.PW_ENTRY ?? "playwright"
);

const DIST = path.resolve(process.argv[2]);
const PORT = Number(process.argv[3] || 4222);
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

const GAMES = ["sudoku", "futoshiki", "thermo", "killer", "kenken"];

const browser = await chromium.launch();
const result = { port: PORT, dist: DIST, when: new Date().toISOString(), games: {} };

// Roles r1/r2 put on the record; the census below is FULL, this is the diff set.
const NAMED = [
  "grid",
  "row",
  "rowgroup",
  "gridcell",
  "cell",
  "textbox",
  "listbox",
  "option",
  "heading",
  "tooltip",
  "image",
  "main",
  "separator",
  "alertdialog",
];

for (const game of GAMES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Accessibility.enable");

  const qs = game === "sudoku" ? "&size=3&difficulty=EASY" : "&difficulty=EASY";
  await page.goto(`http://localhost:${PORT}/?game=${game}${qs}`, {
    waitUntil: "networkidle",
  });
  // Wait for a dealt board: the grid exists and its gridcells have stopped growing.
  await page.waitForSelector('[role="grid"]', { timeout: 30000 });
  await page.waitForFunction(
    () => {
      const n = document.querySelectorAll('[role="gridcell"]').length;
      if (n === 0) return false;
      const w = window;
      const prev = w.__axN;
      w.__axN = n;
      return prev === n;
    },
    { timeout: 30000, polling: 250 },
  );
  await page.waitForTimeout(1200); // let boil/celebration settle, as r1 did

  const axRoles = async () => {
    const { nodes } = await cdp.send("Accessibility.getFullAXTree");
    const census = {};
    for (const n of nodes) {
      if (n.ignored) continue;
      const r = n.role?.value;
      if (!r) continue;
      census[r] = (census[r] || 0) + 1;
    }
    return { census, nodes };
  };

  const { census, nodes } = await axRoles();

  // r2's stronger assertion: resolve the grid AX node's own children.
  const byId = new Map(nodes.map((n) => [n.nodeId, n]));
  const gridNode = nodes.find((n) => !n.ignored && n.role?.value === "grid");
  const gridChildRoles = gridNode
    ? [
        ...new Set(
          (gridNode.childIds || [])
            .map((id) => byId.get(id))
            .filter(Boolean)
            .filter((n) => !n.ignored)
            .map((n) => n.role?.value),
        ),
      ]
    : [];
  const gridChildCount = gridNode
    ? (gridNode.childIds || [])
        .map((id) => byId.get(id))
        .filter((n) => n && !n.ignored).length
    : 0;

  const dom = await page.evaluate(() => {
    const q = (s) => document.querySelectorAll(s);
    const grid = document.querySelector('[role="grid"]');
    const bareSvgByClass = {};
    const labelledSvgNoRoleByClass = {};
    for (const svg of q("svg")) {
      let hidden = false;
      for (let e = svg; e; e = e.parentElement)
        if (e.getAttribute && e.getAttribute("aria-hidden") === "true") {
          hidden = true;
          break;
        }
      if (hidden) continue;
      const cls = (svg.getAttribute("class") || "?").split(/\s+/)[0] || "?";
      const label = svg.getAttribute("aria-label");
      const role = svg.getAttribute("role");
      if (label && !role)
        labelledSvgNoRoleByClass[cls] = (labelledSvgNoRoleByClass[cls] || 0) + 1;
      else if (!label) bareSvgByClass[cls] = (bareSvgByClass[cls] || 0) + 1;
    }
    const focusables = [
      ...q(
        'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"]),[role="option"]',
      ),
    ].filter((e) => !e.closest("[inert]") && e.offsetParent !== null);
    const main = document.querySelector("main");
    return {
      domGridcells: q('[role="gridcell"]').length,
      domRowRoles: q('[role="row"],[role="rowgroup"]').length,
      gridAttrs: grid
        ? {
            rowcount: grid.getAttribute("aria-rowcount"),
            colcount: grid.getAttribute("aria-colcount"),
            label: grid.getAttribute("aria-label"),
          }
        : null,
      landmarks: [
        ...q('main,nav,header,footer,aside,[role="main"],[role="navigation"],[role="banner"],[role="contentinfo"]'),
      ].map((e) => e.tagName.toLowerCase()),
      tabStops: focusables.length,
      focusableOutsideMain: focusables
        .filter((e) => !main || !main.contains(e))
        .map((e) => e.getAttribute("aria-label") || e.textContent.trim().slice(0, 40)),
      bareSvgByClass,
      labelledSvgNoRoleByClass,
      duplicateIds: (() => {
        const seen = new Set(),
          dup = [];
        for (const e of q("[id]"))
          seen.has(e.id) ? dup.push(e.id) : seen.add(e.id);
        return dup;
      })(),
      danglingIdrefs: (() => {
        const out = [];
        for (const attr of [
          "aria-controls",
          "aria-labelledby",
          "aria-describedby",
          "aria-activedescendant",
        ])
          for (const e of q(`[${attr}]`))
            for (const id of e.getAttribute(attr).split(/\s+/).filter(Boolean))
              if (!document.getElementById(id)) out.push(`${attr}=${id}`);
        return out;
      })(),
    };
  });

  // The picker, same page: r1 banked GALLERY {listbox:1, option:1}.
  await page.goto(`http://localhost:${PORT}/?game=${game}${qs}&view=gallery`, {
    waitUntil: "networkidle",
  });
  await page.waitForSelector('[role="listbox"]', { timeout: 30000 });
  await page.waitForTimeout(1200);
  const { census: galleryCensus } = await axRoles();
  const { nodes: gnodes } = await cdp.send("Accessibility.getFullAXTree");
  const galleryOptions = gnodes
    .filter((n) => !n.ignored && n.role?.value === "option")
    .map((n) => n.name?.value);
  const galleryDom = await page.evaluate(() => ({
    domOptions: document.querySelectorAll('[role="option"]').length,
    inertOptions: [...document.querySelectorAll('[role="option"]')].filter((e) =>
      e.closest("[inert]"),
    ).length,
  }));

  result.games[game] = {
    url: `/?game=${game}${qs}`,
    playing: {
      axRolesNamed: Object.fromEntries(NAMED.map((r) => [r, census[r] || 0])),
      axRolesFull: census,
      gridChildRoles,
      gridChildCount,
      ...dom,
    },
    gallery: {
      axRolesNamed: Object.fromEntries(
        ["listbox", "option"].map((r) => [r, galleryCensus[r] || 0]),
      ),
      galleryOptions,
      ...galleryDom,
    },
    pageErrors: errors,
  };
  await ctx.close();
  console.error(`captured ${game}`);
}

await browser.close();
server.close();
fs.writeFileSync(OUT, JSON.stringify(result, null, 1));
console.log(OUT);
