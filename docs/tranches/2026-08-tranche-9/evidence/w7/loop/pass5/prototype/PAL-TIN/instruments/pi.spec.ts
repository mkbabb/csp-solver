import { test, expect, type Page, type Browser } from "@playwright/test";
// PRM: frozen — PAL-TIN pass-5 π instrument (the pass-4 critic's pi.tincrit4.spec.ts, re-pointed):
// every `body *` node × 22 computed paint properties + tag + rect, prototype vs the 74a2b5d9 control,
// one ENCODED board, both themes; a control-vs-control arm (the noise floor) and a planted
// letter-spacing arm (must show) in the same run. SOLO on dist arms; the roster at five on DEV arms.
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const PROTO = process.env.PI_PROTO!;
const CONTROL = process.env.PI_CONTROL!;
const PROTO_DEV = process.env.PI_PROTO_DEV!;
const CONTROL_DEV = process.env.PI_CONTROL_DEV!;
const PROPS = ["color","backgroundColor","fontFamily","fontSize","fontWeight","lineHeight","letterSpacing","opacity","stroke","fill","strokeWidth","boxShadow","display","visibility","filter","transform","borderTopColor","borderTopWidth","paddingTop","paddingLeft","marginLeft","gap"];
const CENSUS = (props: string[]) => {
  const out: string[] = [];
  for (const e of document.querySelectorAll("body *")) {
    if (e.closest("script,style,noscript")) continue;
    const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
    const cls = (e.getAttribute("class") ?? "").split(/\s+/).filter((c) => c && !/^data-v-/.test(c)).sort().join(".");
    out.push(`<${e.tagName.toLowerCase()}>.${cls} | ${props.map((p) => `${p}=${(cs as any)[p]}`).join(" ")} | rect=${r.x.toFixed(2)},${r.y.toFixed(2)},${r.width.toFixed(2)},${r.height.toFixed(2)}`);
  }
  return out;
};
const givens = () => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join("");
async function open(browser: Browser, base: string, w: number, h: number, touch: boolean) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch });
  const p = await ctx.newPage();
  await p.emulateMedia({ reducedMotion: "reduce" });
  await p.goto(`${base}/?board=${BOARD}`);
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
  expect(await p.evaluate(givens)).toBe(GIVENS);
  await p.waitForTimeout(1500); // sleep-ok: the boil parks
  const regime = await p.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, hover: matchMedia("(hover: hover)").matches, w: innerWidth, h: innerHeight }));
  return { ctx, p, regime };
}
const theme = (p: Page, t: string) => p.evaluate((x) => { document.documentElement.classList.toggle("dark", x === "dark"); return new Promise((r) => setTimeout(r, 900)); }, t);
function diff(a: string[], b: string[]) { const d: string[] = []; for (let i = 0; i < Math.max(a.length, b.length); i++) if (a[i] !== b[i]) d.push(`#${i}\n  CTL ${a[i]}\n  PRO ${b[i]}`); return d; }
for (const [label, w, h, touch] of [["desk 1280x800 FINE", 1280, 800, false], ["phone 390x844 COARSE", 390, 844, true]] as const) {
  test(`pi solo ${label}`, async ({ browser }, info) => {
    test.slow();
    const c = await open(browser, CONTROL, w, h, touch);
    const p = await open(browser, PROTO, w, h, touch);
    const c2 = await open(browser, CONTROL, w, h, touch);
    for (const t of ["light", "dark"]) {
      await Promise.all([theme(c.p, t), theme(p.p, t), theme(c2.p, t)]);
      const [ac, ap, ac2] = [await c.p.evaluate(CENSUS, PROPS), await p.p.evaluate(CENSUS, PROPS), await c2.p.evaluate(CENSUS, PROPS)];
      const d = diff(ac, ap); const n = diff(ac, ac2);
      console.log(`PI ${info.project.name} ${label} ${t} · regime ctl ${JSON.stringify(c.regime)} pro ${JSON.stringify(p.regime)} · nodes ctl ${ac.length} pro ${ap.length} · DIFF ROWS ${d.length} · control-vs-control ${n.length}`);
      for (const x of d.slice(0, 8)) console.log(x);
    }
    await p.p.addStyleTag({ content: ".sudoku-cell input, .washi-label { letter-spacing: 1px }" });
    const pos = diff(await c.p.evaluate(CENSUS, PROPS), await p.p.evaluate(CENSUS, PROPS));
    console.log(`PI-POS ${info.project.name} ${label} · planted 1px letter-spacing · DIFF ROWS ${pos.length} (must be > 0)`);
    expect(pos.length).toBeGreaterThan(0);
    await c.ctx.close(); await p.ctx.close(); await c2.ctx.close();
  });
}
async function room(browser: Browser, base: string, n: number) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.emulateMedia({ reducedMotion: "reduce" });
  await a.goto(`${base}/?board=${BOARD}&wire=local`);
  await a.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => a.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
  expect(await a.evaluate(givens)).toBe(GIVENS);
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  for (let i = 1; i < n; i++) { const p = await ctx.newPage(); await p.emulateMedia({ reducedMotion: "reduce" }); await p.goto(link); await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); }
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(n, { timeout: 90000 });
  await a.waitForTimeout(1500); // sleep-ok: the join wash settles
  return { ctx, a };
}
const ROSTER = (props: string[]) => [...document.querySelectorAll(".players-roster, .players-roster *")].map((e) => {
  const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
  const cls = (e.getAttribute("class") ?? "").split(/\s+/).filter((c) => c && !/^data-v-/.test(c)).sort().join(".");
  return `<${e.tagName.toLowerCase()}>.${cls} | ${props.filter((p) => !["color", "backgroundColor", "stroke", "fill"].includes(p)).map((p) => `${p}=${(cs as any)[p]}`).join(" ")} | x=${r.x.toFixed(2)} w=${r.width.toFixed(2)} h=${r.height.toFixed(2)}`;
});
test("pi roster five desk 1280 FINE (dev arms, colour excluded — the palette is the claim)", async ({ browser }, info) => {
  test.slow();
  const c = await room(browser, CONTROL_DEV, 5);
  const p = await room(browser, PROTO_DEV, 5);
  const [rc, rp] = [await c.a.evaluate(ROSTER, PROPS), await p.a.evaluate(ROSTER, PROPS)];
  const d = diff(rc, rp);
  console.log(`PI-ROSTER ${info.project.name} five · nodes ctl ${rc.length} pro ${rp.length} · DIFF ROWS ${d.length}`);
  for (const x of d.slice(0, 10)) console.log(x);
  await c.ctx.close(); await p.ctx.close();
});
