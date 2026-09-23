/**
 * §2.6's rAF LADDER — the ONE copy the §10 lanes cite (T9-W7 pass 6, the chair's instruments lane).
 * From CTRL-TAPE's `pass5/prototype/CTRL-TAPE/instruments/p5-sticky.mjs` (the SYNC vs SETTLED
 * census) and its pass-5 critic's `sticky.mjs` (the frame ladder). For every reachable group it
 * jumps the card so 40 px of the group's head sits above the fold, then reads the tag's computed
 * `position`, `data-released` and visible fraction at the scroll's own task and after each of 8
 * animation frames, and prints `lagFrames` — the first frame from which the read equals the
 * settled one. The settle landed in `viewport-law-2.6-settle.diff` admits lagFrames ≤ 2.
 *
 *   node sticky-ladder.mjs <baseURL> [groupSel] [tagSel]
 *     groupSel defaults to `.tray-well`, tagSel to `.washi-tag` (CTRL-RULE's re-aim: `[data-ruled-group]` `.rp-name`)
 * Serve a BUILT dist and name its index-*.js (printed). Payload: the golden spec's pinned givens,
 * encoded (LAWS P4); the read-back is printed.
 */
const PW = process.env.PW ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const { chromium, webkit } = await import(PW);
const BASE = process.argv[2] ?? "http://127.0.0.1:4230";
const GROUP = process.argv[3] ?? ".tray-well";
const TAG = process.argv[4] ?? ".washi-tag";
const PAYLOAD = "ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw";
const CELLS = [
  { n: "rail1440x900-fine", w: 1440, h: 900, touch: false, sel: ".controls-card" },
  { n: "drawer375x667-coarse", w: 375, h: 667, touch: true, sel: "#controls-drawer .controls-card" },
];
for (const [en, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await eng.launch();
  for (const c of CELLS) {
    const ctx = await b.newContext({ baseURL: BASE, viewport: { width: c.w, height: c.h }, hasTouch: c.touch, isMobile: c.touch && en !== "firefox" });
    const page = await ctx.newPage();
    await page.goto("/?board=" + PAYLOAD);
    await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
    const index = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop());
    const givens = await page.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((e, i) => [i, e.getAttribute("aria-label") ?? ""]).filter(([, l]) => /given/i.test(l)).map(([i, l]) => `${i}:${(/\d+/.exec(l.replace(/row \d+|column \d+/gi, "")) ?? ["?"])[0]}`).join(","));
    if (c.touch) {
      await page.locator(".drawer-tab").first().click();
      await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
      await page.waitForTimeout(1300); // the dock sheet SLIDES (~700 ms); a probe, not a gate
    }
    const r = await page.evaluate(async ([sel, G, T]) => {
      const card = document.querySelector(sel);
      if (!card) return "no card";
      const max = card.scrollHeight - card.clientHeight;
      const out = [];
      for (const well of card.querySelectorAll(G)) {
        const tag = well.querySelector(T);
        if (!tag) continue;
        card.scrollTop = 0;
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const want = well.getBoundingClientRect().top - card.getBoundingClientRect().top + Math.min(40, well.getBoundingClientRect().height / 2);
        const name = (tag.textContent || "").trim();
        if (want <= 0 || want > max) { out.push({ tag: name, unreachable: `${want.toFixed(1)} of ${max}` }); continue; }
        const vis = () => { const t = tag.getBoundingClientRect(), k = card.getBoundingClientRect(); const h = Math.max(0, Math.min(t.bottom, k.bottom) - Math.max(t.top, k.top)); return +(h / Math.max(1, t.height)).toFixed(3); };
        const snap = () => `${getComputedStyle(tag).position}${tag.hasAttribute("data-released") ? "·rel" : ""}/${vis()}`;
        card.scrollTop = want;
        const ladder = [snap()];
        for (let f = 1; f <= 8; f++) { await new Promise((r) => requestAnimationFrame(r)); ladder.push(snap()); }
        let lag = ladder.length - 1;
        while (lag > 0 && ladder[lag - 1] === ladder[ladder.length - 1]) lag--;
        out.push({ tag: name, want: +want.toFixed(1), lagFrames: lag, ladder: ladder.join(" → ") });
      }
      card.scrollTop = 0;
      return { max, out };
    }, [c.sel, GROUP, TAG]);
    console.log(JSON.stringify({ engine: en, cell: c.n, index, givens, r }));
    await ctx.close();
  }
  await b.close();
}
