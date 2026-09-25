// rest-probes.mjs — THE resize-at-rest + un-park + sequence-guard probes (T9-W7 pass 7, chair's
// instruments; registry-v6 §2.11; LAWS P6 §D). Three mechanisms recur across §10 and §11:
//   (a) UN-PARK — a publisher parked until `transitionend` never un-parks when no transition starts (FACE:
//       two presses in one task; `--action-bar-h` 121 vs 132 for the page's life). Probe: act, reach REST
//       (`getAnimations()` empty over two frames, read post-paint), perturb something ELSE that moves the
//       subject (the root font +12.5 %), reach rest, and compare every PUBLISHED length with its TRUTH.
//   (b) RESIZE AT REST — a regime measured at OPEN goes stale on a resize at rest (SELF: 390×844 → 390×800
//       open keeps 4 rows / 7 cells lapped). Probe: open at A, resize to B, reach rest, read; then close,
//       reopen at B, reach rest, read; the two reads must AGREE (and the at-rest read must pass the
//       surface's own clause, e.g. lap 0).
//   (c) SEQUENCE-KEYED TOUCH GUARD — WebKit labels a touch's click `pointerType: "mouse"`. Probe: log the
//       tap's event sequence; then the RELABEL plant (every trusted touch click is swallowed in capture and
//       re-dispatched as a `mouse` click at the same target — WebKit's labelling, in any engine) and count the
//       state toggles of ONE tap: exactly one. A guard keyed on `click.pointerType` toggles twice.
//   (d) ROW TAP KEEPS FOCUS — a tap on a row inside an open overlay keeps the cell's focus (never BODY).
// Library: atRest, openThenResize, unpark, tapToggles, rowTapFocus. CLI: `--preset` (see bottom).
import { createRequire } from "node:module";
import os from "node:os";
const require = createRequire(process.env.FE_PKG ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");

/** REST: no running/pending animation in the document over two consecutive frames, then a post-paint beat. */
export async function atRest(page, timeout = 6000) {
  const t0 = Date.now(); let quiet = 0;
  while (Date.now() - t0 < timeout) {
    const n = await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => setTimeout(() => r(document.getAnimations().filter((a) => a.playState === "running" || a.pending).length), 0))));
    quiet = n === 0 ? quiet + 1 : 0;
    if (quiet >= 2) return { ms: Date.now() - t0, residual: 0 };
  }
  const residual = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").map((a) => a.animationName ?? a.id ?? a.constructor.name).slice(0, 5));
  return { ms: Date.now() - t0, residual }; // an infinite animation (a boil, a spinner) never rests: printed, never hidden
}

/** (b) open → resize at rest → read, vs a fresh open at the new size. `same(a, b)` decides agreement. */
export async function openThenResize(page, { open, close, read, to, same = (a, b) => JSON.stringify(a) === JSON.stringify(b) }) {
  await open(); await atRest(page);
  const before = await read();
  await page.setViewportSize(to); await page.waitForFunction(({ width, height }) => innerWidth === width && innerHeight === height, to);
  const rest = await atRest(page);
  const after = await read();
  await close(); await atRest(page); await open(); await atRest(page);
  const reopened = await read();
  return { before, after, reopened, rest, agree: same(after, reopened) };
}

/** (a) act → rest → perturb → rest → published vs truth for each pair; tolerance 0.5 px. */
export async function unpark(page, { act, perturb = () => page.evaluate(() => { document.documentElement.style.fontSize = "18px"; }), pairs }) {
  const read = () => page.evaluate((pairs) => pairs.map(([name, pubJs, truthJs]) => { const p = new Function(`return (${pubJs})`)(), t = new Function(`return (${truthJs})`)(); return { name, published: p, truth: t }; }), pairs);
  const before = await read();
  await act(); const r1 = await atRest(page);
  const afterAct = await read();
  await perturb(); const r2 = await atRest(page);
  const afterPerturb = await read();
  const stale = afterPerturb.filter((x) => x.published == null || x.published === "" || Math.abs(parseFloat(x.published) - parseFloat(x.truth)) > 0.5);
  return { before, afterAct, afterPerturb, rest: [r1, r2], stale };
}

/** (c) the RELABEL plant — WebKit's LABEL with iOS's DELIVERY, in any engine: after a trusted touch release,
 *  exactly one `click` labelled `pointerType: "mouse"` reaches the target. A trusted touch click (chromium) is
 *  swallowed in capture and re-dispatched as `mouse`; where the engine sends none (WebKit's emulation after a
 *  prevented pointerdown — an absence, not a guard: SELF's critic), one is synthesised 60 ms after the release. */
export const RELABEL = () => {
  let pending = null;
  const fire = (target, x, y) => target.dispatchEvent(new PointerEvent("click", { bubbles: true, cancelable: true, composed: true, pointerType: "mouse", clientX: x, clientY: y, button: 0 }));
  window.addEventListener("pointerup", (e) => {
    if (!e.isTrusted || e.pointerType !== "touch") return;
    const target = e.target, x = e.clientX, y = e.clientY;
    pending = setTimeout(() => { pending = null; fire(target, x, y); }, 60);
  }, { capture: true });
  window.addEventListener("click", (e) => {
    if (!e.isTrusted) return;
    if (pending) { clearTimeout(pending); pending = null; }
    if (e.pointerType === "mouse") return; // already WebKit's label
    e.stopImmediatePropagation(); e.preventDefault();
    const t = e.target, x = e.clientX, y = e.clientY; queueMicrotask(() => fire(t, x, y));
  }, { capture: true });
};
/** Tap once; log the event sequence; count toggles of `state()` across the tap's whole sequence. */
export async function tapToggles(page, { target, state }) {
  await page.evaluate(() => { window.__seq = []; for (const t of ["pointerdown", "pointerup", "touchend", "click"]) window.addEventListener(t, (e) => window.__seq.push(`${t}:${e.pointerType ?? "-"}${e.isTrusted ? "" : "(synthetic)"}`), { capture: true }); });
  await page.evaluate((stateJs) => { const f = new Function(`return (${stateJs})`); window.__st = [f()]; const mo = new MutationObserver(() => { const v = f(); if (v !== window.__st.at(-1)) window.__st.push(v); }); mo.observe(document.body, { subtree: true, attributes: true, childList: true }); window.__mo = mo; }, state);
  await page.locator(target).first().tap();
  await page.waitForTimeout(400); await atRest(page, 3000);
  const r = await page.evaluate(() => { window.__mo.disconnect(); return { seq: window.__seq, states: window.__st }; });
  return { ...r, toggles: r.states.length - 1 };
}
/** (d) focus a cell, open the overlay, tap a row: where is focus? */
export async function rowTapFocus(page, { cell, open, row }) {
  await page.locator(cell).first().tap(); await open(); await atRest(page, 3000);
  await page.locator(row).first().tap(); await page.waitForTimeout(300); await atRest(page, 3000);
  return page.evaluate(() => { const a = document.activeElement; return a ? `${a.tagName}${a.closest(".sudoku-cell") ? "[cell]" : ""}.${(a.getAttribute("class") ?? "").split(" ")[0]}` : null; });
}

// --------------------------------------------------------------------------------------------- CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const pw = require("playwright");
  const A = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => { if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1]?.startsWith("--") || all[i + 1] == null ? "1" : all[i + 1]]); return acc; }, []));
  const engine = A.engine ?? "chromium"; const base = A.url; const preset = A.preset; const plant = A.plant ?? "";
  const browser = await pw[engine].launch();
  let red = 0; const say = (o) => console.log(`REST ${engine} ${preset}${plant ? " plant=" + plant : ""} ${JSON.stringify(o)}`);
  const coarse = async (w, h) => { const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: false }); if (plant === "relabel") await ctx.addInitScript(RELABEL); const page = await ctx.newPage(); return { ctx, page }; };
  // SELF's head sheet (dev tree, ?wire=local): invite, crowd, the mark.
  const selfOpen = async (page, n) => {
    await page.goto(`${base}/?size=3&difficulty=EASY&wire=local`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, null, { timeout: 60000 });
    const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
    const docked = !(await verb.isVisible());
    if (docked) { await page.locator(".drawer-tab").first().click(); await atRest(page, 3000); }
    await verb.click();
    await page.waitForFunction(() => document.querySelectorAll(".players-roster .player-row").length === 1);
    if (docked) { await page.locator(".drawer-tab").first().click(); await atRest(page, 3000); }
    await page.evaluate((n) => { const room = new URL(location.href).searchParams.get("s"); const ch = new BroadcastChannel(`board:${room}`); for (let i = 0; i < n; i++) ch.postMessage({ kind: "hi", data: {}, from: `rest-${i}` }); setTimeout(() => ch.close(), 0); }, n);
    await page.waitForFunction((n) => document.querySelectorAll(".players-roster .player-row").length === n + 1, n, { timeout: 15000 });
  };
  const sheetRead = (page) => page.evaluate(() => {
    const el = [...document.querySelectorAll("[data-lobby]")].find((e) => e.getBoundingClientRect().width > 0);
    if (!el) return { open: false };
    const s = el.getBoundingClientRect(); const cells = [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0);
    return { open: el.classList.contains("is-open"), rows: el.querySelectorAll(".pl-row").length, lapped: cells.filter((c) => c.left < s.right && c.right > s.left && c.top < s.bottom && c.bottom > s.top).length };
  });
  const mark = '[data-player-mark]:visible';
  if (preset === "self-resize") {
    for (const [from, to] of [[{ width: 390, height: 844 }, { width: 390, height: 800 }]]) {
      const { ctx, page } = await coarse(from.width, from.height); await selfOpen(page, 6);
      const r = await openThenResize(page, { open: async () => { if (!(await sheetRead(page)).open) await page.locator(mark).first().tap(); }, close: async () => { if ((await sheetRead(page)).open) await page.locator(mark).first().tap(); }, read: () => sheetRead(page), to });
      const bad = !r.agree || r.after.lapped > 0; if (bad) red = 1;
      say({ from: `${from.width}x${from.height}`, to: `${to.width}x${to.height}`, before: r.before, afterResizeAtRest: r.after, reopened: r.reopened, rest: r.rest, verdict: bad ? "RED" : "GREEN" });
      await ctx.close();
    }
  } else if (preset === "control-resize") {
    const { ctx, page } = await coarse(390, 844);
    await page.goto(`${base}/?game=sudoku&board=${A.board}`); await page.locator(".board-cells").first().waitFor();
    await atRest(page, 4000);
    const read = () => page.evaluate(() => { const c = document.querySelector("#controls-drawer .drawer-case") ?? document.querySelector(".drawer-case"); const r = c?.getBoundingClientRect(); const b = document.querySelector(".board-cells").getBoundingClientRect(); return r ? { open: r.height > 0 && getComputedStyle(c).visibility !== "hidden", caseTop: Math.round(r.top), caseH: Math.round(r.height), caseBottom: Math.round(r.bottom), vh: innerHeight, boardTop: Math.round(b.top) } : { open: false }; });
    const tab = ".drawer-tab";
    const r = await openThenResize(page, { open: async () => { if (!(await read()).open) await page.locator(tab).first().tap(); }, close: async () => { if ((await read()).open) await page.locator(tab).first().tap(); }, read, to: { width: 390, height: 800 } });
    if (!r.agree) red = 1;
    say({ from: "390x844", to: "390x800", before: r.before, afterResizeAtRest: r.after, reopened: r.reopened, rest: r.rest, verdict: r.agree ? "GREEN" : "RED" });
    await ctx.close();
  } else if (preset === "unpark") {
    // FACE's `--action-bar-h` / `--card-pad-t` publisher (any tree that publishes them); act = two presses in one task
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } }); const page = await ctx.newPage();
    await page.goto(`${base}/?size=3&difficulty=MEDIUM&board=${A.board}`); await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); await atRest(page, 4000);
    const hasKeys = await page.evaluate(() => { const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length); const b = card?.querySelector(".action-bar") && [...card.querySelector(".action-bar").querySelectorAll("button")].find((x) => /keys/i.test((x.getAttribute("aria-label") || "") + x.textContent)); if (b) b.setAttribute("data-rest-keys", "1"); return !!b; });
    const CARD = `[...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length)`;
    const pairs = [["--action-bar-h", `${CARD}.style.getPropertyValue("--action-bar-h") || getComputedStyle(${CARD}).getPropertyValue("--action-bar-h")`, `Math.ceil(${CARD}.querySelector(".action-bar").getBoundingClientRect().height + (parseFloat(getComputedStyle(${CARD}).paddingBottom) || 0)) + "px"`]];
    const mode = A.mode ?? "double";
    const act = async () => { if (!hasKeys) return; if (mode === "double") await page.evaluate(() => { const b = document.querySelector("[data-rest-keys]"); b.click(); b.click(); }); else if (mode === "single") await page.evaluate(() => document.querySelector("[data-rest-keys]").click()); };
    const r = await unpark(page, { act, pairs });
    const bad = r.stale.length > 0; if (bad) red = 1;
    say({ mode: hasKeys ? mode : "no keys control (act = none)", before: r.before, afterAct: r.afterAct, afterPerturb: r.afterPerturb, rest: r.rest, stale: r.stale, verdict: bad ? "RED" : "GREEN" });
    await ctx.close();
  } else if (preset === "self-touch") {
    const { ctx, page } = await coarse(390, 844); await selfOpen(page, 3);
    const t = await tapToggles(page, { target: mark, state: `[...document.querySelectorAll('[data-player-mark]')].find((e) => e.getBoundingClientRect().width > 0)?.getAttribute('aria-expanded')` });
    const bad = t.toggles !== 1; if (bad) red = 1;
    say({ row: "one tap on the mark", seq: t.seq, states: t.states, toggles: t.toggles, verdict: bad ? "RED" : "GREEN" });
    // (d) close the sheet if open, then the row tap (not under RELABEL: that plant makes every open a double toggle)
    if (plant !== "relabel") {
    if ((await sheetRead(page)).open) await page.locator(mark).first().tap();
    await atRest(page, 3000);
    const focus = await rowTapFocus(page, { cell: ".sudoku-cell input >> nth=1", open: async () => { if (!(await sheetRead(page)).open) await page.locator(mark).first().tap(); }, row: "[data-lobby]:visible .pl-row >> nth=1" });
    const bad2 = !/\[cell\]/.test(focus ?? ""); if (bad2) red = 1;
    say({ row: "a row tap inside the open sheet", focus, verdict: bad2 ? "RED" : "GREEN" });
    }
    await ctx.close();
  } else if (preset === "control-touch") {
    const { ctx, page } = await coarse(390, 844);
    await page.goto(`${base}/?game=sudoku&board=${A.board}`); await page.locator(".board-cells").first().waitFor(); await atRest(page, 4000);
    const t = await tapToggles(page, { target: ".drawer-tab", state: `[...document.querySelectorAll('.drawer-tab')].find((e) => e.getBoundingClientRect().width > 0)?.getAttribute('aria-expanded')` });
    const bad = t.toggles !== 1; if (bad) red = 1;
    say({ row: "one tap on the drawer tab", seq: t.seq, states: t.states, toggles: t.toggles, verdict: bad ? "RED" : "GREEN" });
    await ctx.close();
  }
  console.log(`LOAD ${os.loadavg().map((v) => v.toFixed(2)).join(" ")}`);
  await browser.close();
  process.exit(red);
}
