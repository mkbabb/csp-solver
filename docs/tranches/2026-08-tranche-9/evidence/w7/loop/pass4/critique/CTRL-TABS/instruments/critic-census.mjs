// CTRL-TABS pass-4 CRITIC census — independent of the prototype's instruments.
// node critic-census.mjs <section> ; arms: tree=4235 (built dist index-D8OwVfe4bGG9.js), head=4236 (w7-control index-CubiZsMVSwTc.js)
import { chromium, webkit } from "@playwright/test";
const SECTION = process.argv[2];
const ARMS = [["tree", 4235], ["head", 4236]];
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const CELLS = {
  portrait: [[390, 844, true], [360, 640, true], [390, 664, true]],
  landscape: [[844, 390, true], [812, 375, true], [900, 500, true]],
  desk: [[1280, 800, false], [1440, 900, false]],
  toggle: [[1024, 768, false]],
};
const INTERACTIVE = 'button, a[href], input, select, textarea, [role="radio"], [role="tab"], [role="switch"], [tabindex]:not([tabindex="-1"])';
function portrait() {
  const q = (s) => document.querySelector(s);
  const R = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return [+b.x.toFixed(2), +b.y.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)]; };
  const inView = (el) => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return cs.display !== "none" && cs.visibility !== "hidden" && b.width > 0 && b.top >= -0.5 && b.bottom <= innerHeight + 0.5 && b.left >= -0.5 && b.right <= innerWidth + 0.5; };
  const paper = q(".board-wrapper").getBoundingClientRect();
  const tongue = q(".drawer-tab")?.getBoundingClientRect();
  const btns = [...document.querySelectorAll(".play-controls button")];
  const tags = [...document.querySelectorAll(".washi-tag")].map((t) => {
    const cs = getComputedStyle(t);
    const refd = t.id ? !!document.querySelector(`[aria-labelledby~="${CSS.escape(t.id)}"]`) : false;
    return { text: t.textContent.trim(), tag: t.tagName, pos: cs.position, top: cs.top, mt: cs.marginTop, z: cs.zIndex, fs: cs.fontSize, lh: cs.lineHeight, ff: cs.fontFamily.slice(0, 24), color: cs.color, ariaHidden: t.getAttribute("aria-hidden"), role: t.getAttribute("role"), namesSomething: refd, parent: t.parentElement.className.toString().split(" ")[0] };
  });
  const berth = q("#board-edge");
  return {
    mq: matchMedia("(pointer: coarse)").matches,
    paper: R(q(".board-wrapper")), offCentre: +Math.abs(paper.y + paper.height / 2 - innerHeight / 2).toFixed(2),
    tuck: tongue ? +(tongue.top - paper.bottom).toFixed(2) : null,
    berth: R(berth), berthKids: berth ? [...berth.children].map((c) => c.id || c.className.toString().slice(0, 20)) : null,
    fold: R(q("#fold-tools")), foldTools: q("#fold-tools") ? q("#fold-tools").querySelectorAll("button").length : 0,
    toolsInView: `${btns.filter(inView).length}/${btns.length}`, toolNames: btns.map((b) => (b.getAttribute("aria-label") || b.textContent.trim()).slice(0, 10)),
    tags,
  };
}
function landscape() {
  const q = (s) => document.querySelector(s);
  const inView = (el) => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return cs.display !== "none" && cs.visibility !== "hidden" && b.width > 0 && b.top >= -0.5 && b.bottom <= innerHeight + 0.5 && b.left >= -0.5 && b.right <= innerWidth + 0.5; };
  const btns = [...document.querySelectorAll(".play-controls button")];
  const card = q(".controls-card");
  const t = q(".drawer-tab"), b = t.getBoundingClientRect();
  let own = 0, n = 0;
  for (let i = 1; i <= 7; i++) for (let j = 1; j <= 9; j++) { n++; const e = document.elementFromPoint(b.left + (b.width * i) / 8, b.top + (b.height * j) / 10); if (e && t.contains(e)) own++; }
  // label clip: each button's visible text vs the nearest painted outline box of the strip
  const strip = q("#board-edge-tools") || q(".edge-tools");
  const sb = strip?.getBoundingClientRect();
  const clip = btns.map((bt) => { const r = document.createRange(); r.selectNodeContents(bt); const tr = r.getBoundingClientRect(); return { n: bt.textContent.trim().slice(0, 6), textL: +tr.left.toFixed(2), btnL: +bt.getBoundingClientRect().left.toFixed(2), stripL: sb ? +sb.left.toFixed(2) : null }; });
  return { mq: matchMedia("(pointer: coarse)").matches, toolsInView: `${btns.filter(inView).length}/${btns.length}`, tools: btns.map((x) => { const r = x.getBoundingClientRect(); return [(x.getAttribute("aria-label") || "").slice(0, 6), +r.x.toFixed(1), +r.y.toFixed(1), +r.width.toFixed(2), +r.height.toFixed(2)]; }), card: card ? [card.clientHeight, card.scrollHeight] : null, tongueHit: `${own}/${n}`, clip };
}
async function deskScroll(page) {
  // scroll the card through its range; at each stop census the visible tag(s) vs interactive elements + action bar
  return page.evaluate(async (INTERACTIVE) => {
    const card = document.querySelector(".controls-card");
    const max = card.scrollHeight - card.clientHeight;
    const out = { sh: card.scrollHeight, ch: card.clientHeight, max, stops: [] };
    const bar = card.querySelector(".action-bar");
    for (let st = 0; st <= max + 0.5; st += Math.max(4, max / 12)) {
      card.scrollTop = st; await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const rows = [];
      for (const tag of card.querySelectorAll(".washi-tag")) {
        const cs = getComputedStyle(tag); if (cs.display === "none" || +cs.opacity < 0.05) continue;
        if (tag.closest("[inert]")) continue;
        const tb = tag.getBoundingClientRect(); if (tb.width === 0) continue;
        const cb = card.getBoundingClientRect(); if (tb.bottom <= cb.top || tb.top >= cb.bottom) continue;
        let px = 0; const hits = [];
        for (const el of card.querySelectorAll(INTERACTIVE)) {
          if (el.closest("[inert]") || tag.contains(el) || el.contains(tag)) continue;
          const b = el.getBoundingClientRect(); if (b.width === 0) continue;
          const w = Math.min(b.right, tb.right) - Math.max(b.left, tb.left), h = Math.min(b.bottom, tb.bottom) - Math.max(b.top, tb.top);
          if (w > 0.5 && h > 0.5) { px += w * h; hits.push((el.getAttribute("aria-label") || el.textContent.trim()).slice(0, 12)); }
        }
        let barPx = 0; if (bar) { const b = bar.getBoundingClientRect(); const w = Math.min(b.right, tb.right) - Math.max(b.left, tb.left), h = Math.min(b.bottom, tb.bottom) - Math.max(b.top, tb.top); if (w > 0 && h > 0) barPx = w * h; }
        rows.push({ t: tag.textContent.trim(), y: +(tb.top - cb.top).toFixed(1), overIa: +px.toFixed(1), hits, barPx: +barPx.toFixed(1), z: cs.zIndex });
      }
      out.stops.push({ st: +st.toFixed(1), rows });
    }
    return out;
  }, INTERACTIVE);
}
function toggle() {
  const tg = document.querySelector("button.sun-moon-toggle"); const t = tg.getBoundingClientRect();
  const out = [];
  for (const el of document.querySelectorAll("button, [role=tab], [role=radio], a[href]")) {
    if (el === tg || tg.contains(el)) continue; const b = el.getBoundingClientRect(); if (!b.width) continue;
    const l = Math.max(b.left, t.left), r = Math.min(b.right, t.right), tp = Math.max(b.top, t.top), bt = Math.min(b.bottom, t.bottom);
    if (r - l <= 0 || bt - tp <= 0) continue;
    const cx = (l + r) / 2, cy = (tp + bt) / 2; const hit = document.elementFromPoint(cx, cy);
    out.push({ el: (el.getAttribute("aria-label") || el.textContent.trim()).slice(0, 14), px: +((r - l) * (bt - tp)).toFixed(1), centreHitsToggle: !!(hit && tg.contains(hit)) });
  }
  return { toggle: [t.x, t.y, t.width, t.height].map((v) => +v.toFixed(1)), overlaps: out };
}
for (const [ename, engine] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await engine.launch();
  for (const [w, h, coarse] of CELLS[SECTION]) {
    for (const [tag, port] of ARMS) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: coarse, isMobile: coarse && ename === "chromium" });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${port}/?board=${BOARD}`, { timeout: 45000 });
      await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 45000 });
      await page.waitForTimeout(1000);
      let r;
      if (SECTION === "portrait") r = await page.evaluate(portrait);
      else if (SECTION === "landscape") r = await page.evaluate(landscape);
      else if (SECTION === "desk") r = await deskScroll(page);
      else r = await page.evaluate(toggle);
      const js = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop());
      console.log(JSON.stringify({ engine: ename, cell: `${w}x${h}`, pointer: coarse ? "coarse" : "fine", tree: tag, js, ...r }));
      await ctx.close();
    }
  }
  await browser.close();
}
console.log("EXIT OK");
