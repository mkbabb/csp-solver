/**
 * CTRL-FACE pass-1 — IS IT INK ON INK, OR A BOUNDING BOX? A tape is rotated ±1.5°, so its
 * axis-aligned rect is inflated by width·sin(tilt) (3.9px at 148px wide) and a 3px "overlap"
 * can be entirely that inflation. This probe reads three rects per pair:
 *   · the tape's painted bbox (rotated, what getBoundingClientRect returns)
 *   · the tape's UNROTATED box (transform temporarily cleared — the paper's own rectangle)
 *   · the other element's INK box (a Range over its text node, never the padding box)
 * and reports the overlap of (bbox × ink) and (unrotated × ink).
 */
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const BASE = process.env.BASE || "http://127.0.0.1:4242/";
const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true },
  { name: "dock-375x812", w: 375, h: 812, mobile: true },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
];

for (const [eng, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await L.launch();
  for (const cell of CELLS) {
    const ctx = await b.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile && eng === "chromium",
      deviceScaleFactor: cell.mobile ? 3 : 1,
    });
    const p = await ctx.newPage();
    await p.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await p.waitForSelector(".controls-card", { state: "attached", timeout: 60000 });
    await p.waitForTimeout(1400);
    if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
      await p.locator(".drawer-tab").click({ force: true });
      await p.waitForTimeout(950);
    }
    const out = await p.evaluate(() => {
      const card = document.querySelector(".controls-card");
      const R = (r) => ({ l: r.left, t: r.top, r: r.right, b: r.bottom });
      const ov = (a, c) => {
        const x = Math.min(a.r, c.r) - Math.max(a.l, c.l);
        const y = Math.min(a.b, c.b) - Math.max(a.t, c.t);
        return x > 0 && y > 0
          ? { w: +x.toFixed(2), deep: +y.toFixed(2), px2: +(x * y).toFixed(1) }
          : null;
      };
      const inkBox = (el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        return R(range.getBoundingClientRect());
      };
      const tapes = Array.from(card.querySelectorAll(".tray-well > .washi-tag"));
      const others = [
        ...Array.from(card.querySelectorAll(".zone-row-label")).map((e) => ({
          sel: ".zone-row-label",
          el: e,
        })),
        ...Array.from(card.querySelectorAll(".ctrl-btn .ctrl-word")).map((e) => ({
          sel: ".ctrl-word",
          el: e,
        })),
        ...Array.from(card.querySelectorAll(".mobile-heading-btn .section-heading")).map((e) => ({
          sel: ".section-heading",
          el: e,
        })),
      ];
      const rows = [];
      for (const t of tapes) {
        const bbox = R(t.getBoundingClientRect());
        const prev = t.style.transform;
        t.style.transform = "none";
        const flat = R(t.getBoundingClientRect());
        t.style.transform = prev;
        const tapeInk = inkBox(t);
        for (const o of others) {
          const ink = inkBox(o.el);
          const a = ov(bbox, ink);
          const c = ov(flat, ink);
          const d = ov(tapeInk, ink);
          if (a || c || d)
            rows.push({
              tape: t.innerText.trim(),
              sel: o.sel,
              text: o.el.innerText.trim().slice(0, 14),
              bboxVsInk: a,
              flatVsInk: c,
              inkVsInk: d,
            });
        }
      }
      return rows;
    });
    console.log(
      `--- ${eng} ${cell.name}`,
      out.length ? JSON.stringify(out, null, 1) : "no tape/ink overlap of any kind",
    );
    await ctx.close();
  }
  await b.close();
}
