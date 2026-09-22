/**
 * T9-W7 pass 4 · CTRL-TAPE — I2 / I3 / I4 RE-READ WITH THEIR SUBJECTS WHERE THEY NOW ARE.
 *
 * The r0 copy (`p4-owners-eye.mjs`) reads I2/I3/I4 RED on this tree. Each red is the instrument
 * reading a subject this design moved, and this probe prints BOTH readings side by side so the
 * chair can see the move rather than take a claim:
 *   I2 · the well∩bar overlap UNCLIPPED (r0's own arithmetic) and CLIPPED to the card's
 *        scrollport. The bar left the scrollport for `#card-foot`, so a well scrolled out of
 *        view still has a rect down there and r0's unclipped term counts it.
 *   I3 · each "pinned" tape's computed `position` and `data-released` at every scroll state.
 *        r0 calls a tape pinned when `b.top <= scb.top + 30`, which a RELEASED tape riding up
 *        out of the port also satisfies.
 *   I4 · `.icon-sublabel.is-armed` (the pose this design deleted) beside `.confirm-ribbon`
 *        (the pose that replaced it), with `cellsWritten` — the law's real clause — either way.
 *
 *   node p4-i234.mjs <baseURL>
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const BASE = process.argv[2] || "http://127.0.0.1:4230";

for (const [eng, L] of [["chromium", chromium], ["webkit", webkit]]) {
  const br = await L.launch();

  // ── I2 · 390×844, sheet open ──────────────────────────────────────────────────────────
  {
    const ctx = await br.newContext({ baseURL: BASE, viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    await p.goto("/?size=3&difficulty=EASY&board=i2");
    await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
    await p.locator(".drawer-tab").click();
    await p.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
    await p.waitForTimeout(900);
    console.log(eng, "I2", JSON.stringify(await p.evaluate(() => {
      const bar = document.querySelector(".action-bar");
      const bb = bar.getBoundingClientRect();
      const card = document.querySelector(".controls-card");
      const port = card.getBoundingClientRect();
      const rows = [];
      for (const w of document.querySelectorAll(".tray-well")) {
        const wb = w.getBoundingClientRect();
        const raw = Math.max(0, Math.min(wb.bottom, bb.bottom) - Math.max(wb.top, bb.top)) *
                    Math.max(0, Math.min(wb.right, bb.right) - Math.max(wb.left, bb.left));
        // CLIPPED: the well only exists where the scrollport paints it.
        const vTop = Math.max(wb.top, port.top), vBot = Math.min(wb.bottom, port.bottom);
        const clipped = Math.max(0, Math.min(vBot, bb.bottom) - Math.max(vTop, bb.top)) *
                        Math.max(0, Math.min(wb.right, bb.right) - Math.max(wb.left, bb.left));
        rows.push({ tag: (w.querySelector(".washi-tag")?.textContent || "?").trim(),
          unclippedFrac: +(raw / Math.max(1, wb.width * wb.height)).toFixed(3),
          clippedFrac: +(clipped / Math.max(1, wb.width * wb.height)).toFixed(3) });
      }
      return { barBox: [bb.top, bb.bottom].map(n => +n.toFixed(2)), portBox: [port.top, port.bottom].map(n => +n.toFixed(2)), rows,
        barInPort: bar.closest(".controls-card") !== null, barInFoot: bar.closest("#card-foot") !== null };
    })));
    await ctx.close();
  }

  // ── I3 · 1440×900 ─────────────────────────────────────────────────────────────────────
  {
    const ctx = await br.newContext({ baseURL: BASE, viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto("/?size=3&difficulty=EASY&board=i3");
    await p.waitForSelector(".controls-card .washi-tag", { timeout: 30000 });
    await p.waitForTimeout(600);
    const out = [];
    for (const st of [0, 160, 327, 500, 9999]) {
      await p.evaluate((y) => { document.querySelector(".controls-card").scrollTop = y; }, st);
      await p.waitForTimeout(400);
      out.push(await p.evaluate(() => {
        const sc = document.querySelector(".controls-card");
        const scb = sc.getBoundingClientRect();
        return { at: sc.scrollTop, tags: [...document.querySelectorAll(".tray-well .washi-tag")].map((t) => {
          const b = t.getBoundingClientRect(), wb = t.closest(".tray-well").getBoundingClientRect();
          return { tag: t.textContent.trim(),
            r0CallsPinned: b.top <= scb.top + 30,
            position: getComputedStyle(t).position,
            released: t.hasAttribute("data-released"),
            tapeVisible: b.bottom > scb.top && b.top < scb.bottom,
            wellFrac: +(Math.max(0, Math.min(wb.bottom, scb.bottom) - Math.max(wb.top, scb.top)) / Math.max(1, wb.height)).toFixed(3) };
        }).filter((x) => x.r0CallsPinned) };
      }));
    }
    console.log(eng, "I3", JSON.stringify(out));
    await ctx.close();
  }

  // ── I4 · 390×844, dirty board, each destructive verb one tap ──────────────────────────
  {
    for (const verb of ["Deal", "Clear", "Fill", "Solve"]) {
      const ctx = await br.newContext({ baseURL: BASE, viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
      const p = await ctx.newPage();
      await p.goto("/?size=3&difficulty=EASY&board=i4");
      await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
      await p.evaluate(() => {
        const i = [...document.querySelectorAll(".sudoku-cell input")].filter((x) => !x.readOnly && !x.disabled && !x.value)[0];
        i?.focus();
      });
      await p.keyboard.type("5");
      await p.waitForTimeout(500);
      await p.locator(".drawer-tab").click();
      await p.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
      await p.waitForTimeout(900);
      console.log(eng, "I4", verb, JSON.stringify(await p.evaluate(async (name) => {
        const idx = { Clear: 0, Fill: 1, Solve: 2 };
        const b = name === "Deal" ? document.querySelector(".deal-row button")
          : document.querySelectorAll(".action-bar .action-verbs button")[idx[name]];
        if (!b) return { verb: name, missing: true };
        const before = [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value).join("");
        b.click();
        await new Promise((r) => setTimeout(r, 1200));
        const after = [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value).join("");
        const rib = document.querySelector(".confirm-ribbon");
        return { verb: name,
          r0Armed: !!b.querySelector(".icon-sublabel.is-armed"),
          ribbonArmed: !!rib,
          ribbonAsk: rib ? (rib.getAttribute("aria-label") || "").trim() : null,
          ribbonRole: rib ? rib.getAttribute("role") : null,
          dialog: !!document.querySelector("[role=alertdialog],[role=dialog]"),
          cellsWritten: [...before].filter((c, i) => c !== after[i]).length };
      }, verb)));
      await ctx.close();
    }
  }
  await br.close();
}
