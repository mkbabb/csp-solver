// postpaint.mjs — THE post-paint sampler (T9-W7 pass 7, chair's instruments; registry-v6 §2.5; LAWS P6 §D).
// A first-frame, drift, interval or rate row reads POST-PAINT. A sampler registered before the product's
// rAF reads PRE-CALLBACK state (MOT-VERB's GA1 passed 8/8 while frame 1 painted 142.9 px off; keys-crib G3
// read 5.9–30.8 px in-rAF against 0.016 px painted). This sampler reads each frame THREE ways, side by side:
//   inRAF  — in our own rAF callback (the pre-callback sampler; printed as the NEGATIVE arm, never gated)
//   post   — a task queued from that rAF (MessageChannel; runs after the frame's rendering update, whatever
//            order the product's rAFs ran in) — THE GATED READ
//   rAF2   — requestAnimationFrame(() => requestAnimationFrame(read)) (LAWS' spelling; it runs at the START
//            of frame k+1, AFTER that frame's animation update — for a WAAPI subject it reads frame k+1's time;
//            printed so a row that uses it knows what it reads)
// Every read carries the frame's document.timeline time captured in the rAF. The gated clauses:
//   F1  post-paint frame 1 (the first frame the subject animation exists): |centre − rest| ≤ 3 px AND |w − rest.w| ≤ 3 px
//   CI  the clock identity for k = 2, 3: ct(frame k) = tl(k) − tl(frame 1) ± 2 ms (post-paint reads)
// Library: `installSampler` (page-side), `analyse(frames, rest)`. CLI: the GA1 row (the fold on 'g'), both
// engines, with PLANT=skip (every explicit startTime write lands 150 ms early — MOT-VERB's critic) as the negative.
//   node postpaint.mjs --url <u> --engine chromium|webkit [--plant skip] [--cells desk,phone] [--reps 2]
// Exit 0 GREEN · 1 RED (any cell: F1 post-paint both engines; CI post-paint chromium) · the in-RAF and rAF2
// verdicts printed beside (they must NOT be what gates).
import { createRequire } from "node:module";
import os from "node:os";
const require = createRequire(process.env.FE_PKG ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");

/** Page-side. `sel` = the subject; the animation = the first WAAPI animation on it that is neither a CSS
 *  transition nor a CSS animation (the product's scripted motion), or any when `anyAnim`. */
export function installSampler({ sel, anyAnim = false, maxFrames = 240 }) {
  const w = window; w.__pp = { inRAF: [], post: [], rAF2: [], done: false };
  const read = (k, tl) => {
    const b = document.querySelector(sel);
    if (!b) return null;
    const a = b.getAnimations().find((x) => anyAnim || (!(x instanceof CSSTransition) && !(x instanceof CSSAnimation))) ?? null;
    const r = b.getBoundingClientRect();
    return { k, tl, ct: a ? Number(a.currentTime ?? 0) : null, ps: a ? a.playState : null, x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width };
  };
  const mc = new MessageChannel(); const q = [];
  mc.port1.onmessage = () => { const f = q.shift(); if (f) f(); };
  let i = 0, seen = false;
  const tick = () => {
    const k = i++; const tl = document.timeline.currentTime;
    const s = read(k, tl); if (s) w.__pp.inRAF.push(s);
    q.push(() => { const p = read(k, tl); if (p) w.__pp.post.push(p); }); mc.port2.postMessage(0);
    requestAnimationFrame(() => requestAnimationFrame(() => { const p = read(k, tl); if (p) w.__pp.rAF2.push(p); }));
    const live = s?.ct != null; seen ||= live;
    if ((seen && !live) || i >= maxFrames) setTimeout(() => (w.__pp.done = true), 200); else requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Frames with the animation present, frame 1 first; F1 + CI verdicts. */
export function analyse(frames, rest, { tolPx = 3, tolMs = 2, ks = [2, 3] } = {}) {
  const f = frames.filter((x) => x.ct !== null).sort((a, b) => a.k - b.k);
  if (!f.length) return { red: true, why: "EMPTY: the subject never animated", f1: null };
  const c = (s) => Math.hypot(s.x - rest.x, s.y - rest.y), dw = (s) => s.w - rest.w;
  const why = [];
  const f1red = c(f[0]) > tolPx || Math.abs(dw(f[0])) > tolPx;
  if (f1red) why.push(`F1 frame 1 at ct ${f[0].ct.toFixed(1)}: centre ${c(f[0]).toFixed(2)} px, dw ${dw(f[0]).toFixed(2)} px (> ${tolPx})`);
  const ci = [];
  for (const k of ks) {
    const fk = f[k - 1]; if (!fk) { why.push(`CI frame ${k} missing`); continue; }
    const want = fk.tl - f[0].tl;
    const abs = fk.ct - (fk.tl - f[0].tl); // the law: ct(frame k) = tl(k) − tl(frame 1) ± tolMs
    ci.push({ k, ct: +fk.ct.toFixed(1), tlDelta: +want.toFixed(1), off: +abs.toFixed(1) });
    if (Math.abs(abs) > tolMs) why.push(`CI ct(frame ${k}) ${fk.ct.toFixed(1)} vs tl(${k})−tl(1) ${want.toFixed(1)} (off ${abs.toFixed(1)} ms > ${tolMs})`);
  }
  const ciRed = why.length > (f1red ? 1 : 0);
  return { red: why.length > 0, f1red, ciRed, why, f1: { ct: +f[0].ct.toFixed(1), c: +c(f[0]).toFixed(2), dw: +dw(f[0]).toFixed(2), ps: f[0].ps }, ci, frames: f.length };
}

export const SKIP_PLANT = () => {
  const d = Object.getOwnPropertyDescriptor(Animation.prototype, "startTime");
  Object.defineProperty(Animation.prototype, "startTime", { get() { return d.get.call(this); }, set(v) { d.set.call(this, typeof v === "number" ? v - 150 : v); }, configurable: true });
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const pw = require("playwright");
  const A = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => { if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1]?.startsWith("--") || all[i + 1] == null ? "1" : all[i + 1]]); return acc; }, []));
  const engine = A.engine ?? "chromium"; const plant = A.plant ?? "";
  const CELLS = { desk: { name: "1280x800 fine light", w: 1280, h: 800, touch: false }, phone: { name: "390x844 coarse light", w: 390, h: 844, touch: true } };
  const cells = (A.cells ?? "desk,phone").split(",").map((c) => CELLS[c]);
  const reps = +(A.reps ?? 2);
  const browser = await pw[engine].launch();
  let red = 0; const tally = { post: 0, inRAF: 0, rAF2: 0, n: 0 };
  for (const cell of cells) for (let rep = 1; rep <= reps; rep++) {
    const ctx = await browser.newContext({ viewport: { width: cell.w, height: cell.h }, hasTouch: cell.touch, colorScheme: "light", reducedMotion: "no-preference" });
    if (plant === "skip") await ctx.addInitScript(SKIP_PLANT);
    const page = await ctx.newPage();
    await page.goto(A.url);
    await page.locator(".board-cells").first().waitFor();
    const givens = await page.locator('.board-cells [aria-label*="given clue"]').count();
    const coarse = await page.evaluate(() => matchMedia("(any-pointer: coarse)").matches);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    const rest = await page.evaluate(() => { const r = document.querySelector(".board-peek-host").getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; });
    await page.evaluate(installSampler, { sel: ".board-peek-host" });
    await page.keyboard.press(A.key ?? "g");
    await page.waitForFunction(() => window.__pp.done, null, { timeout: 20000 });
    const pp = await page.evaluate(() => window.__pp);
    await ctx.close();
    const R = { post: analyse(pp.post, rest), inRAF: analyse(pp.inRAF, rest), rAF2: analyse(pp.rAF2, rest) };
    tally.n++; for (const m of ["post", "inRAF", "rAF2"]) { if (R[m].f1red ?? R[m].red) tally[m]++; if (R[m].ciRed) tally[m + "CI"] = (tally[m + "CI"] ?? 0) + 1; }
    // GATED: F1 on the post-paint read, both engines; CI on the post-paint read in chromium. WebKit's post
    // task runs after its NEXT animation-time update in some frames (ct 23–30 with the rect still at rest,
    // pass-7 reading), so its CI is PRINTED and read from painted-frames.mjs's ladder, never gated here.
    if (R.post.f1red ?? R.post.red) red = 1;
    if (engine === "chromium" && R.post.ciRed) red = 1;
    const f = (r) => r.f1 ? `F1 ct ${r.f1.ct} c ${r.f1.c} dw ${r.f1.dw} ${r.f1red ? "RED" : "GREEN"} | CI ${r.ci.map((x) => `k${x.k} ct ${x.ct}/tlΔ ${x.tlDelta} off ${x.off}`).join(" ; ")} ${r.ciRed ? "RED" : "GREEN"}` : `→ RED ${r.why}`;
    console.log(`POSTPAINT ${engine} ${cell.name} r${rep} plant=${plant || "none"} givens ${givens} coarse ${coarse} | POST ${f(R.post)} | inRAF ${f(R.inRAF)} | rAF2 ${f(R.rAF2)}`);
  }
  console.log(`TALLY ${engine} plant=${plant || "none"} of ${tally.n}: F1 RED post ${tally.post} · inRAF ${tally.inRAF} · rAF2 ${tally.rAF2} | CI RED post ${tally.postCI ?? 0} · inRAF ${tally.inRAFCI ?? 0} · rAF2 ${tally.rAF2CI ?? 0} | load ${os.loadavg().map((v) => v.toFixed(2)).join(" ")}`);
  await browser.close();
  process.exit(red);
}
