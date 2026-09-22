import { test, expect, type Page, type Browser } from "@playwright/test";
// PRM: frozen — emulateMedia reducedMotion before every goto (critic scratch; deleted at return).
const CELLS = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
const BOARD = Buffer.from(String.fromCharCode(1) + "3." + CELLS, "latin1").toString("base64url");
const Q = `/?board=${BOARD}`;
const PROTO = process.env.PI_PROTO!;
const CONTROL = process.env.PI_CONTROL!;
const PROPS = ["color","backgroundColor","fontFamily","fontSize","fontWeight","lineHeight","letterSpacing","opacity","stroke","fill","strokeWidth","boxShadow","display","visibility","filter","transform","borderTopColor","borderTopWidth","paddingTop","paddingLeft","marginLeft","gap"];
const CENSUS = (props: string[]) => {
  const out: string[] = [];
  for (const e of document.querySelectorAll("body *")) {
    if (e.closest("script,style,noscript")) continue;
    const cs = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    const cls = (e.getAttribute("class") ?? "").split(/\s+/).filter((c) => c && !/^data-v-/.test(c)).sort().join(".");
    out.push(`<${e.tagName.toLowerCase()}>.${cls} | ${props.map((p) => `${p}=${(cs as any)[p]}`).join(" ")} | rect=${r.x.toFixed(2)},${r.y.toFixed(2)},${r.width.toFixed(2)},${r.height.toFixed(2)}`);
  }
  return out;
};
const givens = () => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || "0").join("");
async function open(browser: Browser, base: string, w: number, h: number, touch: boolean) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch });
  const p = await ctx.newPage();
  await p.emulateMedia({ reducedMotion: "reduce" });
  await p.goto(base + Q);
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
  await p.waitForTimeout(1500);
  const regime = await p.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, hover: matchMedia("(hover: hover)").matches, w: innerWidth, h: innerHeight }));
  return { ctx, p, regime };
}
function diff(a: string[], b: string[]) {
  const d: string[] = [];
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) d.push(`#${i}\n  CTL ${a[i]}\n  PRO ${b[i]}`);
  return d;
}
for (const [label, w, h, touch] of [["desk 1280x800 FINE", 1280, 800, false], ["phone 390x844 COARSE", 390, 844, true]] as const) {
  test(`pi solo ${label}`, async ({ browser }, info) => {
    test.slow();
    const c = await open(browser, CONTROL, w, h, touch);
    const p = await open(browser, PROTO, w, h, touch);
    const [gc, gp] = [await c.p.evaluate(givens), await p.p.evaluate(givens)];
    const [ac, ap] = [await c.p.evaluate(CENSUS, PROPS), await p.p.evaluate(CENSUS, PROPS)];
    const d = diff(ac, ap);
    console.log(`PI ${info.project.name} ${label} · regime ctl ${JSON.stringify(c.regime)} pro ${JSON.stringify(p.regime)} · givens equal ${gc === gp} (${gc.slice(0, 12)}…) · nodes ctl ${ac.length} pro ${ap.length} · DIFF ROWS ${d.length}`);
    for (const x of d.slice(0, 12)) console.log(x);
    await c.ctx.close(); await p.ctx.close();
  });
}
async function room(browser: Browser, base: string, n: number) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.emulateMedia({ reducedMotion: "reduce" });
  await a.goto(base + "/?size=3&difficulty=EASY&wire=local");
  await a.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => a.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  for (let i = 1; i < n; i++) { const p = await ctx.newPage(); await p.emulateMedia({ reducedMotion: "reduce" }); await p.goto(link); await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); }
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(n, { timeout: 90000 });
  await a.waitForTimeout(1500);
  return { ctx, a };
}
const ROSTER = (props: string[]) => [...document.querySelectorAll(".players-roster, .players-roster *")].map((e) => {
  const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
  const cls = (e.getAttribute("class") ?? "").split(/\s+/).filter((c) => c && !/^data-v-/.test(c)).sort().join(".");
  return `<${e.tagName.toLowerCase()}>.${cls} | ${props.filter((p) => p !== "color" && p !== "backgroundColor").map((p) => `${p}=${(cs as any)[p]}`).join(" ")} | x=${r.x.toFixed(2)} w=${r.width.toFixed(2)} h=${r.height.toFixed(2)}`;
});
test("pi roster five desk 1280 FINE", async ({ browser }, info) => {
  test.slow();
  const c = await room(browser, CONTROL, 5);
  const p = await room(browser, PROTO, 5);
  const [rc, rp] = [await c.a.evaluate(ROSTER, PROPS), await p.a.evaluate(ROSTER, PROPS)];
  const d = diff(rc, rp);
  console.log(`PI-ROSTER ${info.project.name} five · nodes ctl ${rc.length} pro ${rp.length} · DIFF ROWS ${d.length}`);
  for (const x of d.slice(0, 14)) console.log(x);
  await c.ctx.close(); await p.ctx.close();
});
test("pi NEGATIVE CONTROL: a planted 1px letter-spacing on the proto arm must show", async ({ browser }, info) => {
  test.slow();
  const c = await open(browser, CONTROL, 1280, 800, false);
  const p = await open(browser, PROTO, 1280, 800, false);
  await p.p.addStyleTag({ content: ".washi-label, .players-roster .player-name { letter-spacing: 1px }" });
  await p.p.addStyleTag({ content: ".sudoku-cell input { letter-spacing: 1px }" });
  const d = diff(await c.p.evaluate(CENSUS, PROPS), await p.p.evaluate(CENSUS, PROPS));
  console.log(`PI-NEG ${info.project.name} · DIFF ROWS ${d.length} (must be > 0)`);
  expect(d.length).toBeGreaterThan(0);
  await c.ctx.close(); await p.ctx.close();
});
test("filter census at SEVEN players, estate rule, built proto vs built control", async ({ browser }, info) => {
  test.slow();
  const RULE = () => { const out: string[] = []; for (const el of document.querySelectorAll("*")) { const cs = getComputedStyle(el); if (!cs.filter || cs.filter === "none" || cs.display === "none") continue; const raw = typeof (el as any).className === "string" ? (el as any).className : (el as any).className?.baseVal ?? ""; out.push(`${el.tagName.toLowerCase()}.${raw.trim().split(/\s+/).slice(0, 2).join(".")}`); } return { n: out.length, ticks: document.querySelectorAll(".roster-tick").length, rows: document.querySelectorAll(".players-roster .player-row").length, list: out.sort().join(" , ") }; };
  for (const [name, base] of [["CONTROL", CONTROL], ["PROTO", PROTO]] as const) {
    const r = await room(browser, base, 7);
    const c = await r.a.evaluate(RULE);
    console.log(`CENSUS7 ${info.project.name} ${name} · live ${c.n} · rows ${c.rows} · ticks ${c.ticks} · ${c.list}`);
    await r.ctx.close();
  }
});
