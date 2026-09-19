/**
 * CTRL-FACE pass-1 — CONTRAST FROM PAINT, on every node the face law re-points. Not a token
 * read: each node is screenshot twice (as it renders, and with its own ink turned transparent),
 * so the GROUND is the modal pixel the element actually sits on (washi paper, card, whatever)
 * and the INK is the darkest-from-ground pixel the glyph actually paints — which is what carries
 * an alpha-blended token like `--ink-press-quiet` honestly.
 *   node probe/contrast.mjs   → one JSONL row per node per theme per engine
 */
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs";
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const BASE = process.env.BASE || "http://127.0.0.1:4242/";

const lum = ([r, g, b]) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};

const SITES = [
  { sel: ".tray-well > .washi-tag", label: "washi-tag (printed name on tape)" },
  { sel: ".mobile-heading-btn[aria-expanded='true'] .section-heading", label: "tab head OPEN" },
  { sel: ".mobile-heading-btn[aria-expanded='false'] .section-heading", label: "tab head SHUT" },
  { sel: ".mobile-heading-btn[aria-expanded='false'] .heading-value", label: "shut value word" },
  { sel: ".zone-row-label", label: "row caption (printed)" },
  { sel: ".ctrl-btn[aria-pressed='true'] .ctrl-word", label: "chip SELECTED" },
  { sel: ".ctrl-btn[aria-pressed='false'] .ctrl-word", label: "chip UNSELECTED" },
  { sel: "h2 > .section-heading", label: "desk h2 (rail cell only)" },
];

const rows = [];
for (const [eng, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await L.launch();
  for (const cell of [
    { name: "dock-390x844", w: 390, h: 844, mobile: true },
    { name: "rail-1280x800", w: 1280, h: 800, mobile: false },
  ])
    for (const theme of ["light", "dark"]) {
      const ctx = await b.newContext({
        viewport: { width: cell.w, height: cell.h },
        hasTouch: cell.mobile,
        isMobile: cell.mobile && eng === "chromium",
        deviceScaleFactor: 2,
        colorScheme: theme,
      });
      const p = await ctx.newPage();
      await p.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
      await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
      await p.waitForTimeout(1500);
      await p.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
      await p.waitForTimeout(400);
      if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
        await p.locator(".drawer-tab").click({ force: true });
        await p.waitForTimeout(950);
      }
      for (const site of SITES) {
        const n = await p.locator(site.sel).count();
        for (let i = 0; i < n; i++) {
          const el = p.locator(site.sel).nth(i);
          if (!(await el.isVisible())) continue;
          try {
            await el.scrollIntoViewIfNeeded({ timeout: 4000 });
          } catch {
            /* a node the scrollport cannot reach is read where it lies, or skipped below */
          }
          await p.waitForTimeout(150);
          const box = await el.boundingBox();
          if (!box || box.width < 2 || box.height < 2) continue;
          const x = Math.max(0, Math.round(box.x));
          const y = Math.max(0, Math.round(box.y));
          const clip = {
            x,
            y,
            width: Math.max(2, Math.min(Math.round(box.width), cell.w - x)),
            height: Math.max(2, Math.min(Math.round(box.height), cell.h - y)),
          };
          if (y >= cell.h - 2 || x >= cell.w - 2) continue;
          const text = (await el.innerText()).trim().slice(0, 14);
          const inked = await p.screenshot({ clip });
          await el.evaluate((e) => {
            e.dataset.prevColor = e.style.color;
            e.style.setProperty("color", "transparent", "important");
          });
          await p.waitForTimeout(120);
          const bare = await p.screenshot({ clip });
          await el.evaluate((e) => {
            e.style.color = e.dataset.prevColor ?? "";
          });
          const [A, B] = await Promise.all([
            sharp(inked).raw().toBuffer({ resolveWithObject: true }),
            sharp(bare).raw().toBuffer({ resolveWithObject: true }),
          ]);
          const ch = A.info.channels;
          // ground = modal pixel of the ink-free frame
          const counts = new Map();
          for (let k = 0; k < B.data.length; k += ch) {
            const key = `${B.data[k]},${B.data[k + 1]},${B.data[k + 2]}`;
            counts.set(key, (counts.get(key) ?? 0) + 1);
          }
          const ground = [...counts.entries()]
            .sort((x, y) => y[1] - x[1])[0][0]
            .split(",")
            .map(Number);
          // ink = the pixel of the inked frame furthest from ground (the glyph's core)
          let ink = ground;
          let far = -1;
          for (let k = 0; k < A.data.length; k += ch) {
            const px = [A.data[k], A.data[k + 1], A.data[k + 2]];
            const d = Math.abs(lum(px) - lum(ground));
            if (d > far) {
              far = d;
              ink = px;
            }
          }
          rows.push({
            eng,
            cell: cell.name,
            theme,
            site: site.label,
            text,
            ground: ground.join(","),
            ink: ink.join(","),
            ratio: ratio(ink, ground),
          });
        }
      }
      await ctx.close();
    }
  await b.close();
}

const min = rows.reduce((m, r) => Math.min(m, r.ratio), Infinity);
for (const r of rows) console.log(JSON.stringify(r));
console.log(
  JSON.stringify({
    row: "SUMMARY",
    nodes: rows.length,
    min,
    worst: rows.filter((r) => r.ratio === min).map((r) => `${r.site}/${r.text}/${r.theme}/${r.eng}`),
    under45: rows.filter((r) => r.ratio < 4.5).map((r) => `${r.site}/${r.text}/${r.theme}/${r.eng}=${r.ratio}`),
  })
);
