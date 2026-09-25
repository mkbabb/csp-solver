// NOTE-LEDGER pass-7 CRITIC probe (copied from pass7/prototype/NOTE-LEDGER/probe/ledger7.mjs; PANELS re-pointed; reserve mode reads the RECT and display too).
// NOTE-LEDGER pass-7 probe. node ledger7.mjs <chromium|webkit> <arm> <url> <asset-id> <modes,...>
// ONE payload (the section's classic easy 9x9, 30 givens), read back through the input corpus AND the
// aria-label corpus before any read. Modes:
//   settle — line one's computed alpha, read POST-PAINT (rAF -> MessageChannel task) every frame for
//            2.6 s from the proof keystroke, 390x844 coarse DPR 2 light: when does it reach the quiet rung
//   swap   — ask, answer, ask (the held record displaced into line two, `note-swap`), 1280 fine: the
//            leaving line-one node's lifetime (MutationObserver) and the frames where the sentence stands
//            on BOTH lines, read post-paint, x3
//   frames — panels of the strip at P4 rest (+2.6 s) and P4 +100 ms, for the ballot composite
//   glyph  — the chair's glyph-pop on line one at P1 +500 ms (inside the first eight beats) and at rest
//   sixteen— a 16x16 payload dealt, read back through the aria-label corpus; the 256-value join timed in page
//   land   — 844x390 / 812x375 coarse DPR 3 P3: line two's computed clip + nowrap, its a11y line, bytes vs display:none
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { mkdirSync } from "node:fs";
import os from "node:os";
process.env.FE_PKG = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json";
const { glyphPopulation } = await import("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments/glyph-pop.mjs");

const [ENG, ARM, URL0, ASSET, MODES = "settle"] = process.argv.slice(2);
const B = ENG === "webkit" ? webkit : chromium;
const PANELS = process.env.PANELS ?? "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledgercrit7-panels";
mkdirSync(PANELS, { recursive: true });
const G = { 0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3, 36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9, 71: 5, 76: 8, 79: 7, 80: 9 };
let cells = "";
for (let i = 0; i < 81; i++) cells += (G[i] ?? 0).toString(36);
const PAYLOAD = Buffer.from(String.fromCharCode(1) + "3." + cells, "latin1").toString("base64url");
const EXPECTED = Array.from({ length: 81 }, (_, i) => (G[i] ? String(G[i]) : ".")).join("");
const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const RIGS = {
  desk1: { w: 1280, h: 800, coarse: false, dpr: 1 },
  phone2: { w: 390, h: 844, coarse: true, dpr: 2 },
  l844: { w: 844, h: 390, coarse: true, dpr: 3 },
  l812: { w: 812, h: 375, coarse: true, dpr: 3 },
};
const load = () => `load ${os.loadavg()[0].toFixed(1)}`;
const row = (r) => console.log("ROW", JSON.stringify({ eng: ENG, arm: ARM, ...r }));
const browser = await B.launch();

// the aria-label corpus: "Row r, column c, given clue X" -> index -> glyph
const ariaGivens = (p, side) =>
  p.evaluate((side) => {
    const out = {};
    for (const i of document.querySelectorAll(".game-cell input")) {
      const m = /^Row (\d+), column (\d+), given clue (\S+)/.exec(i.getAttribute("aria-label") ?? "");
      if (m) out[(+m[1] - 1) * side + (+m[2] - 1)] = m[3];
    }
    return out;
  }, side);

async function open(rigName, scheme, opts = {}) {
  const r = RIGS[rigName];
  const ctx = await browser.newContext({ viewport: { width: r.w, height: r.h }, deviceScaleFactor: r.dpr, hasTouch: r.coarse, isMobile: r.coarse && ENG === "chromium" });
  const page = await ctx.newPage();
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: "no-preference" });
  await page.goto(`${URL0}/?board=${opts.payload ?? PAYLOAD}`);
  await page.waitForSelector(".game-cell input", { timeout: 60000 });
  if (!opts.payload) {
    let got = "";
    for (let i = 0; i < 100; i++) { got = await bs(page); if (got === EXPECTED) break; await page.waitForTimeout(100); }
    if (got !== EXPECTED) throw new Error(`payload not dealt ${got}`);
    const aria = await ariaGivens(page, 9);
    const want = Object.fromEntries(Object.entries(G).map(([k, v]) => [k, String(v)]));
    if (JSON.stringify(aria) !== JSON.stringify(want)) throw new Error(`aria corpus disagrees: ${JSON.stringify(aria).slice(0, 200)}`);
  }
  const id = await page.evaluate(() => [...document.scripts].map((s) => s.src).join(" "));
  if (ASSET !== "dev" && !id.includes(ASSET)) throw new Error(`serves ${id}, want ${ASSET}`);
  const regime = await page.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, dark: matchMedia("(prefers-color-scheme: dark)").matches, landscape: matchMedia("(orientation: landscape)").matches }));
  await page.waitForTimeout(1200);
  return { ctx, page, regime };
}
const bs = (p) => p.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((i) => i.value || ".").join(""));
const lines = (p) => p.evaluate(() => {
  const a = document.querySelector(".board-margin .margin-note");
  const b = document.querySelector(".board-margin .margin-note-previous");
  return { one: a?.textContent.trim() ?? "", two: b?.textContent.trim() ?? "", oneColor: a ? getComputedStyle(a.querySelector(".margin-note-ink") ?? a).color : null, twoColor: b ? getComputedStyle(b).color : null };
});
async function ask(p, wait = 900) {
  await p.evaluate(() => [...document.querySelectorAll(".game-cell input")].find((i) => !i.value)?.focus());
  await p.keyboard.press("h");
  await p.waitForTimeout(wait);
}
async function answer(p, wait = 900) {
  const s = (await lines(p)).one;
  const d = (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1];
  if (!d) throw new Error(`no digit in "${s}"`);
  const t = await p.evaluate(([d, sol]) => [...document.querySelectorAll(".game-cell")].map((c, i) => ({ c, i })).filter(({ c, i }) => c.querySelector(".cell-because") && !c.querySelector("input").value && sol[i] === d).map(({ i }) => i), [d, SOL]);
  if (t.length !== 1) throw new Error(`"${s}": ${t.length} targets`);
  await p.locator(".game-cell input").nth(t[0]).focus();
  await p.keyboard.type(d);
  if (wait) await p.waitForTimeout(wait);
}
// post-paint alpha sampler on line one's ink, from now for `ms`
const sampleAlpha = (p, ms) => p.evaluate((ms) => new Promise((res) => {
  const t0 = performance.now(); const out = [];
  const ch = new MessageChannel();
  ch.port1.onmessage = () => {
    const el = document.querySelector(".board-margin .margin-note .margin-note-ink") ?? document.querySelector(".board-margin .margin-note");
    const c = el ? getComputedStyle(el).color : "";
    const m = /\/\s*([\d.]+)\)$/.exec(c) ?? /rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/.exec(c);
    out.push([+(performance.now() - t0).toFixed(1), m ? +m[1] : 1, (el?.textContent ?? "").trim().slice(0, 30)]);
  };
  const tick = () => { if (performance.now() - t0 > ms) return res(out); ch.port2.postMessage(0); requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}), ms);

for (const mode of MODES.split(",")) {
  if (mode === "settle") {
    for (const scheme of ["light", "dark"]) {
      const { ctx, page, regime } = await open("phone2", scheme);
      await page.evaluate(() => { window.__keys = []; document.addEventListener("keydown", () => window.__keys.push(performance.now()), { capture: true }); });
      const s = page.evaluate(() => performance.now()).then((t) => t);
      const t0p = await s;
      const sam = sampleAlpha(page, 3400);
      await ask(page, 900);
      await answer(page, 0);
      const series = await sam;
      const keys = (await page.evaluate(() => window.__keys)).map((k) => k - t0p);
      // series times are from the sampler's own t0 (~t0p); re-key to the ASK (the sentence's arrival) and the PROOF
      const tAsk = keys[0], tProof = keys.at(-1);
      const spoken = series.filter(([t, , x]) => t >= tAsk && x);
      const firstQuiet = spoken.find(([, a]) => a <= 0.69);
      const at = (ms) => spoken.reduce((b, x) => (Math.abs(x[0] - tProof - ms) < Math.abs(b[0] - tProof - ms) ? x : b), spoken[0]);
      row({ m: "settle", scheme, regime, frames: series.length, fromAskToQuiet: firstQuiet ? +(firstQuiet[0] - tAsk).toFixed(1) : null, fromProofToQuiet: firstQuiet ? +(firstQuiet[0] - tProof).toFixed(1) : null, askToProof: +(tProof - tAsk).toFixed(1), aProof50: at(50)[1], aProof100: at(100)[1], aProof300: at(300)[1], aEnd: series.at(-1)[1], text: series.at(-1)[2], load: load() });
      await ctx.close();
    }
  }
  if (mode === "swap") {
    for (let run = 1; run <= 3; run++) {
      const { ctx, page } = await open("desk1", "light");
      await ask(page); await answer(page); await page.waitForTimeout(1600);
      const before = (await lines(page)).one;
      await page.evaluate((before) => {
        window.__swap = { t0: 0, gone: null, frames: 0, both: 0 };
        const host = document.querySelector(".board-margin .margin-note");
        const inkOf = () => [...host.querySelectorAll(".margin-note-ink")];
        const mo = new MutationObserver(() => {
          const old = inkOf().find((e) => e.textContent.trim() === before);
          if (window.__swap.t0 && !old && window.__swap.gone == null) window.__swap.gone = performance.now() - window.__swap.t0;
        });
        mo.observe(host, { childList: true, subtree: true });
        document.addEventListener("keydown", () => { if (!window.__swap.t0) window.__swap.t0 = performance.now(); }, { capture: true });
        const ch = new MessageChannel();
        ch.port1.onmessage = () => {
          if (!window.__swap.t0) return;
          window.__swap.frames++;
          const old = inkOf().find((e) => e.textContent.trim() === before && e.isConnected);
          const two = document.querySelector(".board-margin .margin-note-previous");
          if (old && two && two.textContent.trim() === before && getComputedStyle(old).visibility !== "hidden" && +getComputedStyle(old).opacity > 0) window.__swap.both++;
        };
        const tick = () => { ch.port2.postMessage(0); if (!window.__swap.t0 || performance.now() - window.__swap.t0 < 600) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }, before);
      await ask(page, 1000);
      const r = await page.evaluate(() => window.__swap);
      const l = await lines(page);
      const leaving = r.gone == null ? "never-gone" : +r.gone.toFixed(1);
      row({ m: "swap", run, before, after: l, lifetimeMs: leaving, framesSampled: r.frames, framesBoth: r.both, load: load() });
      await ctx.close();
    }
  }
  if (mode === "frames") {
    for (const [rig, scheme] of [["phone2", "light"], ["phone2", "dark"], ["desk1", "light"]]) {
      for (const when of rig === "phone2" && scheme === "light" ? ["p100", "rest"] : ["rest"]) {
        const { ctx, page } = await open(rig, scheme);
        await ask(page); await answer(page); await ask(page);
        await answer(page, when === "p100" ? 100 : 2600);
        const clip = await page.evaluate(() => {
          const m = document.querySelector(".board-margin").getBoundingClientRect();
          const x = Math.max(0, Math.floor(m.left) - 6), y = Math.max(0, Math.floor(m.top) - 6);
          return { x, y, width: Math.min(innerWidth - x, Math.ceil(m.width) + 12), height: Math.ceil(Math.max(m.height, 30)) + 36 };
        });
        await page.screenshot({ path: `${PANELS}/${ENG}-${rig}-${scheme}-${when}-${ARM}.png`, clip });
        row({ m: "frame", rig, scheme, when, clip, lines: await lines(page), load: load() });
        await ctx.close();
      }
    }
  }
  if (mode === "glyph") {
    for (const when of [500, 2600]) {
      const { ctx, page } = await open("desk1", "light");
      await ask(page); await answer(page, when);
      const g = await glyphPopulation(page, { subject: ".board-margin .margin-note .margin-note-ink" });
      row({ m: "glyph", when, rig: "1280 fine DPR1 light", pop: g.population, median: g.coreMedian, fracUnder: g.fracUnder, red: g.red, why: g.why, lines: await lines(page), load: load() });
      await ctx.close();
    }
  }
  if (mode === "sixteen") {
    // a real 16x16 (a pattern-solved grid with a deterministic 60 % of cells blanked)
    const sol = []; for (let r = 0; r < 16; r++) for (let c = 0; c < 16; c++) sol.push(((r % 4) * 4 + Math.floor(r / 4) + c) % 16 + 1);
    let seed = 7; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
    const give = sol.map((v) => (rnd() < 0.4 ? v : 0));
    const cells16 = give.map((v) => v.toString(36)).join("");
    const payload = Buffer.from(String.fromCharCode(1) + "4." + cells16, "latin1").toString("base64url");
    const { ctx, page } = await open("desk1", "light", { payload });
    let aria = {};
    for (let i = 0; i < 100; i++) { aria = await ariaGivens(page, 16); if (Object.keys(aria).length) break; await page.waitForTimeout(100); }
    const inputs = await page.evaluate(() => document.querySelectorAll(".game-cell input").length);
    const glyph = (v) => (v <= 9 ? String(v) : String.fromCharCode(55 + v));
    const want = {}; give.forEach((v, i) => { if (v) want[i] = glyph(v); });
    const miss = Object.keys(want).filter((k) => aria[k] !== want[k]);
    const extra = Object.keys(aria).filter((k) => !(k in want));
    const join = await page.evaluate(() => {
      const els = [...document.querySelectorAll(".game-cell input")]; const t = [];
      for (let k = 0; k < 7; k++) { const t0 = performance.now(); for (let j = 0; j < 1000; j++) els.map((e) => e.value).join(""); t.push((performance.now() - t0) / 1000); }
      t.sort((a, b) => a - b); return { median: +t[3].toFixed(4), max: +t[6].toFixed(4) };
    });
    row({ m: "sixteen", payload: payload.slice(0, 24) + "…", payloadLen: payload.length, inputs, givensDealt: Object.keys(want).length, ariaGivens: Object.keys(aria).length, mismatched: miss.length, extra: extra.length, sample: Object.entries(aria).slice(0, 3), joinMsPer256: join, load: load() });
    await ctx.close();
  }
  if (mode === "reserve") {
    // the behavioural half of the reserve law: the EMPTY voice's computed min-height against the block's
    for (const rig of (process.env.RIGS ?? "phone2,l844").split(",")) {
      const { ctx, page, regime } = await open(rig, "light");
      const r = await page.evaluate(() => { const v = document.querySelector(".board-margin .margin-note"); const b = document.querySelector(".board-margin .margin-note-block") ?? v?.parentElement; const cv = v && getComputedStyle(v), cb = b && getComputedStyle(b); return { voiceText: v?.textContent.trim() ?? null, voiceDisplay: cv?.display, voiceRectH: v ? +v.getBoundingClientRect().height.toFixed(2) : null, blockFont: cb?.fontSize, voiceMinH: cv?.minHeight, voiceH: v ? +v.getBoundingClientRect().height.toFixed(2) : null, blockMinH: cb?.minHeight, blockH: b ? +b.getBoundingClientRect().height.toFixed(2) : null }; });
      row({ m: "reserve", rig, regime, ...r, load: load() });
      await ctx.close();
    }
  }
  if (mode === "land") {
    for (const rig of ["l844", "l812"]) {
      const { ctx, page, regime } = await open(rig, "light");
      await ask(page); await answer(page); await ask(page);
      const two = await page.evaluate(() => { const t = document.querySelector(".board-margin .margin-note-previous"); if (!t) return null; const cs = getComputedStyle(t); const r = t.getBoundingClientRect(); return { text: t.textContent.trim(), clip: cs.clipPath, ws: cs.whiteSpace, pos: cs.position, w: r.width, h: r.height, sh: document.documentElement.scrollHeight }; });
      const snap = await page.locator(".board-margin").ariaSnapshot();
      const strip = await page.evaluate(() => { const m = document.querySelector(".board-margin").getBoundingClientRect(); return { x: Math.floor(m.left), y: Math.floor(m.top), width: Math.ceil(m.width), height: Math.ceil(m.height) + 2 }; });
      const raw = async (b) => (await sharp(b).raw().toBuffer());
      const A = await raw(await page.screenshot({ clip: strip }));
      const t = await page.addStyleTag({ content: ".margin-note-previous{display:none!important}" });
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const Z = await raw(await page.screenshot({ clip: strip }));
      await t.evaluate((e) => e.remove());
      let d = 0; for (let i = 0; i < A.length; i += 4) if (A[i] !== Z[i] || A[i + 1] !== Z[i + 1] || A[i + 2] !== Z[i + 2]) d++;
      row({ m: "land", rig, regime, two, ariaLineTwo: snap.split("\n").filter((l) => two && l.includes(two.text)), bytesVsDisplayNone: `${d}/${A.length / 4}`, load: load() });
      await ctx.close();
    }
  }
}
await browser.close();
