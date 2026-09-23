/**
 * MOT-VERB pass 5 — T9-M15, THE BLOOM ON A COLD FLIP (INTAKE rows 36–38, 41; the census's own
 * sampler and its `born` definition, re-pointed): per rAF the live sun/moon icon's opacity and
 * visibility, its `.warp` scale, and the rest stacks' visibility. `born` = the incoming body's
 * warp scale on its first live-visible frame (op > 0.02). Four flips per boot: flip 0 is COLD
 * (the first flip into that theme), 1–3 warm. Plus the bake counters: drawImage onto a canvas
 * ≥ 200 px, createObjectURL, `href` attribute mutations and `.boil-frame-bitmap` style mutations.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { PAYLOAD, ARMS, OUT } from "./board";

const INIT = () => {
  const w = window as any;
  w.__ev = [];
  const note = (k: string) => w.__ev.push({ k, t: performance.now() });
  const hook = (proto: any) => {
    if (!proto) return;
    const d = proto.drawImage;
    proto.drawImage = function (...a: any[]) { if ((this.canvas?.width ?? 0) >= 200) note("drawImage"); return d.apply(this, a); };
  };
  hook(CanvasRenderingContext2D.prototype);
  hook((w as any).OffscreenCanvasRenderingContext2D?.prototype);
  const co = URL.createObjectURL;
  URL.createObjectURL = function (o: any) { note("objectURL"); return co.call(URL, o); };
  new MutationObserver((ms) => { for (const m of ms) { if (m.attributeName === "href") note("href"); else if (m.attributeName === "style" && (m.target as Element).classList?.contains("boil-frame-bitmap")) note("bitmapStyle"); } })
    .observe(document, { subtree: true, attributes: true, attributeFilter: ["href", "style"] });
};

async function flip(page: Page) {
  await page.evaluate(() => { (window as any).__ev.length = 0; });
  const p = page.evaluate(() => new Promise<any>((res) => {
    const sc = (tf: string) => { if (!tf || tf === "none") return 1; const m = tf.match(/matrix\(([^)]+)\)/); if (!m) return null; const [a, b] = m[1].split(",").map(Number); return Math.hypot(a, b); };
    const icon = (s: string) => { const el = document.querySelector(s); if (!el) return null; const cs = getComputedStyle(el); return { op: +cs.opacity, v: cs.visibility === "visible" }; };
    const frames: any[] = []; const t0 = performance.now(); (window as any).__t0 = t0;
    const tick = (now: number) => {
      frames.push({ t: now - t0, sunW: sc(getComputedStyle(document.querySelector(".toggle-sun .warp")!).transform), moonW: sc(getComputedStyle(document.querySelector(".toggle-moon .warp")!).transform), sun: icon(".toggle-sun"), moon: icon(".toggle-moon"), restSun: getComputedStyle(document.querySelector(".rest-sun")!).visibility === "visible", restMoon: getComputedStyle(document.querySelector(".rest-moon")!).visibility === "visible" });
      if (now - t0 < 1500) requestAnimationFrame(tick); else res(frames);
    };
    requestAnimationFrame(tick);
  }));
  await page.waitForTimeout(60);
  const actAt = await page.evaluate(() => performance.now() - (window as any).__t0);
  const before = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await page.click(".sun-moon-toggle", { force: true });
  const frames = await p;
  await page.waitForTimeout(250);
  const ev = await page.evaluate(() => (window as any).__ev.map((e: any) => ({ k: e.k, t: e.t - (window as any).__t0 })));
  const inK = before ? "sun" : "moon";
  const F = frames.filter((f: any) => f.t >= actAt - 1);
  const dts = F.slice(1).map((f: any, i: number) => ({ t: f.t - actAt, d: f.t - F[i].t }));
  const live = (f: any) => f[inK] && f[inK].v && f[inK].op > 0.02;
  const born = F.find(live);
  let dsMax = 0;
  for (let i = 1; i < F.length; i++) if (live(F[i]) && live(F[i - 1])) dsMax = Math.max(dsMax, Math.abs(F[i][inK + "W"] - F[i - 1][inK + "W"]));
  const inWin = (t: number, a: number, b: number) => t >= actAt + a && t <= actAt + b;
  return {
    dir: `${before ? "dark" : "light"}->${before ? "light" : "dark"}`,
    born: born ? { t: +(born.t - actAt).toFixed(0), s: +born[inK + "W"].toFixed(3), op: +born[inK].op.toFixed(2) } : null,
    maxFrame: +Math.max(...dts.filter((x: any) => x.t <= 900).map((x: any) => x.d)).toFixed(1),
    over34: dts.filter((x: any) => x.t <= 900 && x.d > 34).length,
    over50: dts.filter((x: any) => x.t <= 900 && x.d > 50).length,
    dScaleMax: +dsMax.toFixed(3),
    drawImage: ev.filter((e: any) => e.k === "drawImage" && inWin(e.t, 0, 1100)).length,
    objectURL: ev.filter((e: any) => e.k === "objectURL" && inWin(e.t, 0, 1100)).length,
    href: ev.filter((e: any) => e.k === "href" && inWin(e.t, 0, 1100)).length,
    bitmapStyle: ev.filter((e: any) => e.k === "bitmapStyle" && inWin(e.t, 0, 1100)).length,
  };
}

const ARM_LIST = (process.env.ARMS ?? "after,control,main").split(",") as (keyof typeof ARMS)[];
const PRM = process.env.PRM === "1";
const CELLS = [
  { name: "playing-1280x800-fine-lightboot", w: 1280, h: 800, touch: false, dark: false, q: "" },
  { name: "playing-1280x800-fine-darkboot", w: 1280, h: 800, touch: false, dark: true, q: "" },
  { name: "playing-390x844-coarse-lightboot", w: 390, h: 844, touch: true, dark: false, q: "" },
];
for (const cell of CELLS) {
  test(`M15 cold flip · ${cell.name}${PRM ? " · PRM" : ""}`, async ({ browser }, info) => {
    const out: any[] = [];
    // INTERLEAVED: arm A, B, C, then the same again — the box is loaded; a single pass per arm
    // would hand one arm the quiet minute. Two rounds, every arm cold in each.
    for (const round of [1, 2]) for (const arm of ARM_LIST) {
      const ctx = await browser.newContext({ viewport: { width: cell.w, height: cell.h }, hasTouch: cell.touch, colorScheme: cell.dark ? "dark" : "light", reducedMotion: PRM ? "reduce" : "no-preference", deviceScaleFactor: 2 });
      await ctx.addInitScript(INIT);
      const page = await ctx.newPage();
      const url = `${ARMS[arm]}/?game=sudoku&board=${PAYLOAD}${cell.q}`;
      await page.goto(url, { waitUntil: "load" });
      await page.waitForSelector(".sun-moon-toggle");
      await page.waitForTimeout(4000); // the boot's bakes land and the page idles
      const flips = [];
      for (let i = 0; i < 4; i++) { flips.push(await flip(page)); await page.waitForTimeout(1200); }
      out.push({ arm, round, flips });
      console.log(`M15[${info.project.name}·${cell.name}${PRM ? "·PRM" : ""}·${arm}·r${round}] ` + flips.map((f, i) => `${i === 0 ? "COLD" : "warm"} ${f.dir} born ${JSON.stringify(f.born)} max ${f.maxFrame} >34 ${f.over34} >50 ${f.over50} dS ${f.dScaleMax} draw ${f.drawImage} url ${f.objectURL} href ${f.href} bmpStyle ${f.bitmapStyle}`).join(" || "));
      await ctx.close();
    }
    writeFileSync(`${OUT}/m15-${info.project.name}-${cell.name}${PRM ? "-prm" : ""}.json`, JSON.stringify({ payload: PAYLOAD, out }, null, 1));
  });
}
