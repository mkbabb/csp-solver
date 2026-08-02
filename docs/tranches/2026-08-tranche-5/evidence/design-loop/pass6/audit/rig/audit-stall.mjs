/**
 * AUDIT rig — Option B (the per-size pose-stack cache), re-measured by a NON-AUTHOR.
 * Independent of BC's stall6.mjs: the counters are installed as an init script that wraps
 * HTMLCanvasElement.prototype.toBlob / OffscreenCanvas.prototype.convertToBlob and the
 * object-URL pair, the block detector is a 16ms interval whose observed gaps are summed over
 * the gesture window, and BYTE IDENTITY is read by fetching every live pose <img> src back off
 * the DOM and hashing the payload (FNV-1a) — a re-encode to a fresh URL cannot pass.
 *
 * Gesture walk: open, close, open — one fresh page per rep, so g1 is always a cold miss.
 *
 * Usage: node audit-stall.mjs <baseURL> <label> [reps]
 */
import { webkit } from "playwright";

const INIT = `(() => {
  const S = { encodes: [], revokes: 0, mints: 0, marks: [] };
  window.__S = S;
  const t = () => Math.round(performance.now());
  const wrapToBlob = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, ...rest) {
    S.encodes.push({ api: 'toBlob', w: this.width, h: this.height, t: t(), phase: S.phase });
    return wrapToBlob.call(this, cb, ...rest);
  };
  if (typeof OffscreenCanvas !== 'undefined' && OffscreenCanvas.prototype.convertToBlob) {
    const c2b = OffscreenCanvas.prototype.convertToBlob;
    OffscreenCanvas.prototype.convertToBlob = function (...a) {
      S.encodes.push({ api: 'convertToBlob', w: this.width, h: this.height, t: t(), phase: S.phase });
      return c2b.apply(this, a);
    };
  }
  const mk = URL.createObjectURL.bind(URL);
  URL.createObjectURL = (b) => { S.mints++; return mk(b); };
  const rv = URL.revokeObjectURL.bind(URL);
  URL.revokeObjectURL = (u) => { S.revokes++; return rv(u); };
  // block detector: a 16ms tick; any observed gap beyond 32ms is main-thread block.
  S.gaps = [];
  let last = performance.now();
  setInterval(() => {
    const now = performance.now();
    const gap = now - last;
    last = now;
    if (gap > 32) S.gaps.push({ t: Math.round(now), gap: Math.round(gap), phase: S.phase });
  }, 16);
  window.__mark = (p) => { S.phase = p; S.marks.push({ p, t: t() }); };
  window.__slice = (p) => ({
    encodes: S.encodes.filter((e) => e.phase === p),
    gaps: S.gaps.filter((g) => g.phase === p),
    blocked: S.gaps.filter((g) => g.phase === p).reduce((a, g) => a + (g.gap - 16), 0),
    worst: Math.max(0, ...S.gaps.filter((g) => g.phase === p).map((g) => g.gap - 16)),
  });
  window.__poses = async () => {
    const imgs = [...document.querySelectorAll('img')].filter((i) => i.src.startsWith('blob:'));
    const out = [];
    for (const i of imgs) {
      const buf = new Uint8Array(await (await fetch(i.src)).arrayBuffer());
      let h = 0x811c9dc5;
      for (let k = 0; k < buf.length; k++) { h ^= buf[k]; h = Math.imul(h, 0x01000193) >>> 0; }
      out.push({ bytes: buf.length, hash: h.toString(16), box: i.width + 'x' + i.height });
    }
    return out.sort((a, b) => (a.hash < b.hash ? -1 : 1));
  };
})()`;

const [, , baseURL, label, repsArg = "3"] = process.argv;
const REPS = Number(repsArg);
const browser = await webkit.launch();
const reps = [];
for (let r = 0; r < REPS; r++) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 810 },
    deviceScaleFactor: 2,
  });
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();
  await page.evaluate; // noop
  await page.goto(`${baseURL}/?size=3&difficulty=EASY`, { waitUntil: "load" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.waitForTimeout(2500); // land + settle + first bake
  const rep = { rep: r + 1, gestures: [] };
  const tab = page.locator(".drawer-tab");
  for (const g of ["g1", "g2", "g3"]) {
    await page.evaluate((p) => window.__mark(p), g);
    await tab.click();
    await page.waitForTimeout(1400);
    const slice = await page.evaluate((p) => window.__slice(p), g);
    const poses = await page.evaluate(() => window.__poses());
    rep.gestures.push({
      g,
      encodes: slice.encodes.length,
      boxes: slice.encodes.map((e) => `${e.w}x${e.h}`).join(","),
      blocked: slice.blocked,
      worst: slice.worst,
      poses,
    });
  }
  const tot = await page.evaluate(() => ({ revokes: window.__S.revokes, mints: window.__S.mints }));
  rep.revokes = tot.revokes;
  rep.mints = tot.mints;
  reps.push(rep);
  await ctx.close();
}
await browser.close();
console.log(`\n[${label}] webkit 1280x810 DPR2 · open/close/open · ${REPS} reps, fresh page each`);
for (const r of reps) {
  console.log(`  rep ${r.rep}  revokes=${r.revokes} mints=${r.mints}`);
  for (const g of r.gestures)
    console.log(
      `    ${g.g}: encodes=${String(g.encodes).padStart(2)} blocked=${String(g.blocked).padStart(4)}ms worst=${String(g.worst).padStart(4)}ms  boxes=[${g.boxes}]`,
    );
  // byte identity: compare the pose payload multiset across the three gestures
  const sig = (g) => g.poses.map((p) => p.hash + ":" + p.bytes).join("|");
  console.log(
    `    payload identity  g1==g2: ${sig(r.gestures[0]) === sig(r.gestures[1])}   g1==g3: ${sig(r.gestures[0]) === sig(r.gestures[2])}   (n poses ${r.gestures[0].poses.length}/${r.gestures[1].poses.length}/${r.gestures[2].poses.length})`,
  );
}
const all = reps.flatMap((r) => r.gestures);
console.log(
  `  TOTALS: encodes/gesture ${all.map((g) => g.encodes).join(",")} · pure-hit gestures (0 encodes) ${all.filter((g) => g.encodes === 0).length}/${all.length} · blocked ${Math.min(...all.map((g) => g.blocked))}–${Math.max(...all.map((g) => g.blocked))} ms`,
);
console.log(JSON.stringify({ label, reps }, null, 1).slice(0, 0));
