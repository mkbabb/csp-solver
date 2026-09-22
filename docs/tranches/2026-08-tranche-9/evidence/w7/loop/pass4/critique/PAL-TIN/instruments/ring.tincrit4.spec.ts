import { test, expect, type Page } from "@playwright/test";
import { inflateSync } from "node:zlib";
// PRM: frozen — emulateMedia reducedMotion before every goto (critic scratch; deleted at return).
type RGB = [number, number, number];
function pixels(png: Uint8Array) {
  const dv = new DataView(png.buffer, png.byteOffset, png.byteLength);
  let pos = 8, w = 0, h = 0, depth = 0, ctype = 0; const parts: Uint8Array[] = [];
  while (pos + 8 <= png.length) { const len = dv.getUint32(pos); const type = String.fromCharCode(png[pos+4],png[pos+5],png[pos+6],png[pos+7]); const at = pos + 8;
    if (type === "IHDR") { w = dv.getUint32(at); h = dv.getUint32(at+4); depth = png[at+8]; ctype = png[at+9]; } else if (type === "IDAT") parts.push(png.subarray(at, at+len)); else if (type === "IEND") break; pos = at + len + 4; }
  if (depth !== 8 || (ctype !== 6 && ctype !== 2)) throw new Error("INSTRUMENT BROKEN");
  const bpp = ctype === 6 ? 4 : 3; const z = Buffer.concat(parts.map((p) => Buffer.from(p))); const raw = inflateSync(z); const stride = w * bpp; const out = new Uint8Array(h * stride); let r = 0;
  for (let y = 0; y < h; y++) { const f = raw[r++]; for (let i = 0; i < stride; i++) { const a = i >= bpp ? out[y*stride+i-bpp] : 0; const b = y ? out[(y-1)*stride+i] : 0; const c = i >= bpp && y ? out[(y-1)*stride+i-bpp] : 0; let v = raw[r+i];
    if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a+b)>>1; else if (f === 4) { const pa=Math.abs(b-c), pb=Math.abs(a-c), pc=Math.abs(a+b-2*c); v += pa<=pb&&pa<=pc?a:pb<=pc?b:c; } out[y*stride+i] = v & 255; } r += stride; }
  return { w, h, at: (x: number, y: number): RGB => [out[y*stride+x*bpp], out[y*stride+x*bpp+1], out[y*stride+x*bpp+2]] };
}
const lum = (p: RGB) => { const f = (v: number) => { const c = v/255; return c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); }; return 0.2126*f(p[0])+0.7152*f(p[1])+0.0722*f(p[2]); };
const ratio = (a: RGB, b: RGB) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x+0.05)/(y+0.05); };
const apart = (a: RGB, b: RGB) => Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2]);
const TIN = { light: ["#4b1d00","#243200","#003436","#220084","#4f0049"], dark: ["#ff975e","#9ac900","#00ced7","#a2afff","#ff7cef"] };
const WALK = { light: ["#552200","#2a3900","#003b3e","#270094","#590052"], dark: ["#ff9f6b","#9ecf00","#00d4dd","#a8b5ff","#ff87f0"] };
async function settled(p: Page) { await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0); }
test("ring distribution, five arms, two scalars", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage(); await a.emulateMedia({ reducedMotion: "reduce" }); await a.goto("./?size=3&difficulty=EASY&wire=local"); await settled(a);
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const b = await ctx.newPage(); await b.emulateMedia({ reducedMotion: "reduce" }); await b.goto(a.url()); await settled(b);
  await expect(a.locator(".players-roster .player-row")).toHaveCount(2, { timeout: 60000 });
  const idx = await a.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].findIndex((i) => !(i as HTMLInputElement).value));
  const cell = a.locator(".sudoku-cell").nth(idx);
  const which = await a.evaluate(() => getComputedStyle(document.querySelector(".sudoku-cell.is-peer-cursor") ?? document.body).getPropertyValue("--color-peer-cursor-ink"));
  const shoot = async () => { const box = (await cell.boundingBox())!; return pixels((await a.screenshot({ clip: { x: box.x, y: box.y, width: box.width, height: box.height } })) as unknown as Uint8Array); };
  for (const arm of ["light", "dark"] as const) {
    await a.evaluate((m) => { document.documentElement.classList.toggle("dark", m === "dark"); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }, arm);
    await b.locator(".sudoku-cell input").nth(idx).blur(); await expect(cell).not.toHaveClass(/is-peer-cursor/, { timeout: 30000 }); await a.waitForTimeout(400);
    const off = await shoot();
    await b.locator(".sudoku-cell input").nth(idx).focus(); await expect(cell).toHaveClass(/is-peer-cursor/, { timeout: 30000 }); await a.waitForTimeout(400);
    const bound = await a.evaluate(() => getComputedStyle(document.querySelector(".sudoku-cell.is-peer-cursor")!).getPropertyValue("--color-peer-cursor-ink"));
    const cx = Math.floor(off.w / 2), cy = Math.floor(off.h / 2);
    for (const [name, table] of [["TIN", TIN], ["WALK", WALK]] as const) {
      for (let k = 0; k < 5; k++) {
        // put arm k's hex on the ONE bound ring token (the live cursor reads peer-2's arm)
        await a.evaluate((h) => { document.documentElement.style.setProperty("--color-peer-2-ring", h); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }, table[arm][k]);
        await a.waitForTimeout(250);
        const on = await shoot();
        const interior = on.at(cx, cy);
        const moved: { d: number; r: number }[] = [];
        let max = 0;
        for (let y = 0; y < on.h; y++) for (let x = 0; x < on.w; x++) { const d = apart(on.at(x, y), off.at(x, y)); if (d > max) max = d; if (d > 0) moved.push({ d, r: ratio(on.at(x, y), interior) }); }
        const core = moved.filter((m) => m.d >= max * 0.5).sort((p, q) => q.d - p.d);
        const at = (q: number) => core[Math.min(core.length - 1, Math.floor(core.length * q))].r;
        const under = core.filter((m) => m.r < 3.0).length / core.length;
        console.log(`DIST ${info.project.name} ${arm} ${name} peer-${k+1} ${table[arm][k]} · core px ${core.length} · ratio@maxmoved ${core[0].r.toFixed(3)} · p10 ${at(0.1).toFixed(3)} · p30 ${at(0.3).toFixed(3)} · median ${at(0.5).toFixed(3)} · p90 ${at(0.9).toFixed(3)} · frac<3.0 ${(under*100).toFixed(1)}% · bestRatio ${Math.max(...core.map((m) => m.r)).toFixed(3)}`);
      }
    }
    await a.evaluate(() => document.documentElement.style.removeProperty("--color-peer-2-ring"));
    console.log(`BOUND ${arm} ${bound} (first read ${which})`);
  }
  await ctx.close();
});
test("tape ink per stick, painted, both themes", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage(); await a.emulateMedia({ reducedMotion: "reduce" }); await a.goto("./?size=3&difficulty=EASY&wire=local"); await settled(a);
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const b = await ctx.newPage(); await b.emulateMedia({ reducedMotion: "reduce" }); await b.goto(a.url()); await settled(b);
  await expect(a.locator(".players-roster .player-row")).toHaveCount(2, { timeout: 60000 });
  const idx = await a.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].findIndex((i) => !(i as HTMLInputElement).value));
  const c = b.locator(".sudoku-cell input").nth(idx); await c.click(); await c.fill("8");
  await expect.poll(() => a.locator(".sudoku-cell input").nth(idx).inputValue()).toBe("8");
  await b.locator(".sudoku-cell input").nth(idx).blur();
  const tape = a.locator(".attribution-tape .washi-label");
  for (const arm of ["light", "dark"] as const) {
    await a.evaluate((m) => { document.documentElement.classList.toggle("dark", m === "dark"); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }, arm);
    await a.locator(".sudoku-cell").nth(idx).hover();
    await expect(tape).toHaveCount(1, { timeout: 15000 });
    await a.waitForTimeout(500);
    const sticks = await a.evaluate(() => { const cs = getComputedStyle(document.documentElement); return [1,2,3,4,5].map((i) => cs.getPropertyValue(`--color-peer-${i}`).trim()); });
    for (let k = 0; k < 5; k++) {
      await a.evaluate((h) => { document.documentElement.style.setProperty("--color-peer-2", h); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }, sticks[k]);
      await a.waitForTimeout(250);
      const box = (await tape.boundingBox())!;
      const clip = { x: box.x + 2, y: box.y + 1, width: box.width - 4, height: box.height - 2 };
      const on = pixels((await a.screenshot({ clip })) as unknown as Uint8Array);
      await a.evaluate(() => { const s = document.createElement("style"); s.id = "tc-off"; s.textContent = ".attribution-tape .washi-label{color:transparent !important} .attribution-tape .roster-tick path{stroke:transparent !important}"; document.head.appendChild(s); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); });
      await a.waitForTimeout(150);
      const off = pixels((await a.screenshot({ clip })) as unknown as Uint8Array);
      await a.evaluate(() => { document.getElementById("tc-off")?.remove(); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); });
      const ink: { d: number; r: number }[] = []; let max = 0;
      for (let y = 0; y < on.h; y++) for (let x = 0; x < on.w; x++) { const d = apart(on.at(x, y), off.at(x, y)); if (d > max) max = d; if (d > 0) ink.push({ d, r: ratio(on.at(x, y), off.at(x, y)) }); }
      const core = ink.filter((m) => m.d >= max * 0.5).sort((p, q) => q.d - p.d);
      const at = (q: number) => core[Math.min(core.length - 1, Math.floor(core.length * q))].r;
      const paper = off.at(Math.floor(off.w / 2), 2);
      console.log(`TAPE ${info.project.name} ${arm} stick peer-${k+1} ${sticks[k]} · paper~rgb(${paper}) · ink px ${core.length} · ratio@max-moved ${core[0].r.toFixed(3)} · p30 ${at(0.3).toFixed(3)} · median-core ${at(0.5).toFixed(3)} · frac<4.5 ${(core.filter((m)=>m.r<4.5).length/core.length*100).toFixed(1)}% · frac<3.0 ${(core.filter((m)=>m.r<3).length/core.length*100).toFixed(1)}%`);
    }
    await a.evaluate(() => document.documentElement.style.removeProperty("--color-peer-2"));
    await a.mouse.move(0, 0); await expect(tape).toHaveCount(0);
  }
  await ctx.close();
});
