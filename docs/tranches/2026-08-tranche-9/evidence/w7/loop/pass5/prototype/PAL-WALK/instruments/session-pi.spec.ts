// PAL-WALK pass 5 · the session π, copied from pass4/critique/PAL-WALK/instruments/critic.tape.spec.ts (its session test only), OUT re-pointed:
// PROTO = this tree dev (4244), HEAD = the w7-control tree dev (74a2b5d9, read-only, own cacheDir).
// PRM: live — PAL-WALK pass-4 CRITIC probe (scratch; deleted before return, banked under critique/).
// (1) THE TAPE NAME, PAINTED: the name photographed twice (as drawn, and with its colour set
//     transparent), so every pixel the text changed is found and read against the ground the
//     translucent washi ACTUALLY paints there (grid lines and digits under it included) — the
//     row §A/§C price by compositing the tape over the flat card.
// (2) SESSION π: the board subtree of a live two-page session, prototype vs 74a2b5d9, read for
//     computed paint + tag, the two claimed cells (the peer's digit, the peer's cursor) excluded.
import { test, expect, type Page, type BrowserContext } from "@playwright/test";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const PROTO = process.env.CRITIC_PROTO || "http://127.0.0.1:4244";
const HEAD = process.env.CRITIC_HEAD || process.env.CTRL_DEV;

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
async function table(context: BrowserContext, base: string) {
  const a = await context.newPage();
  await a.goto(`${base}/?board=${BOARD}&wire=local`);
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const b = await context.newPage();
  await b.goto(a.url());
  await settled(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2, { timeout: 45000 });
  const givens = await a.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
  return { a, b, givens };
}
const cellIn = (p: Page, i: number) => p.locator(".sudoku-cell input").nth(i);

test("session π — board subtree, prototype vs 74a2b5d9, the two claimed cells excluded", async ({ browser }, info) => {
  test.slow();
  const PROPS = ["color", "background-color", "font-family", "font-size", "font-weight", "line-height", "opacity", "stroke", "fill", "stroke-width", "stroke-opacity", "fill-opacity", "filter", "transform"];
  const run = async (base: string) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const { a, b, givens } = await table(ctx, base);
    const x = givens.indexOf(".");
    const far = 80 - [...givens].reverse().findIndex((ch) => ch !== ".");
    await cellIn(b, x).click();
    await cellIn(b, x).fill("7");
    await expect.poll(() => cellIn(a, x).inputValue(), { timeout: 30000 }).toBe("7");
    await cellIn(b, far).click({ force: true });
    await a.mouse.move(2, 2);
    await a.waitForTimeout(2600);
    const out = await a.evaluate(([props, x, far, POSITIVE]) => {
      const root = document.querySelector(".board-wrapper")!;
      const cells = [...document.querySelectorAll(".game-cell")];
      const claimed = [cells[x as number], cells[far as number]];
      const pathOf = (el: Element) => { const p: string[] = []; for (let n: Element | null = el; n && n !== root; n = n.parentElement) p.unshift(`${n.tagName}:${[...(n.parentElement?.children ?? [])].indexOf(n)}`); return p.join("/"); };
      const res: Record<string, string> = {};
      let skipped = 0;
      for (const el of root.querySelectorAll("*")) {
        if (el instanceof SVGElement && !(el.getAttribute("class") ?? "").trim()) continue;
        if (!POSITIVE && claimed.some((c) => c && c.contains(el))) { skipped++; continue; }
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const rect = el instanceof SVGElement && el.tagName.toLowerCase() === "path" ? "" : [r.x, r.y, r.width, r.height].map((v) => v.toFixed(2)).join(",");
        res[pathOf(el)] = `${el.tagName}|${el.getAttribute("class") ?? ""}|${rect}|${(props as string[]).map((p) => cs.getPropertyValue(p)).join("|")}`;
      }
      return { res, skipped };
    }, [PROPS, x, far, !!process.env.CRITIC_POSITIVE] as const);
    await ctx.close();
    return { ...out, x, far, givens };
  };
  const diff = (p: Record<string, string>, q: Record<string, string>) => {
    const keys = new Set([...Object.keys(p), ...Object.keys(q)]);
    let one = 0, paint = 0, rect = 0; const eg: string[] = [];
    for (const k of keys) {
      if (!(k in p) || !(k in q)) { one++; if (eg.length < 4) eg.push(`one-sided ${k.slice(-80)}`); continue; }
      const [ta, ca, ra, ...pa] = p[k].split("|"), [tb, cb, rb, ...pb] = q[k].split("|");
      if (ta !== tb || pa.join("|") !== pb.join("|")) { paint++; if (eg.length < 4) eg.push(`${ca || ta}: ${pa.join("|").slice(0, 160)} ≠ ${pb.join("|").slice(0, 160)}`); }
      if (ra && rb && Math.max(...ra.split(",").map((v, i) => Math.abs(+v - +rb.split(",")[i]))) > 0.01) rect++;
    }
    return { n: keys.size, one, paint, rect, eg };
  };
  const h1 = await run(HEAD), h2 = await run(HEAD), p = await run(PROTO);
  const say = (s: string) => console.log(`[${info.project.name}] ${s}`);
  say(`cells: peer digit ${p.x}, peer cursor ${p.far}; board decoded equal ${h1.givens === p.givens}; skipped (claimed) ${p.skipped}`);
  for (const [n, d] of [["NEGATIVE head-vs-head", diff(h1.res, h2.res)], ["π proto-vs-74a2b5d9", diff(h1.res, p.res)]] as const)
    say(`${n}: ${d.n} nodes · ${d.one} one-sided · ${d.paint} paint/tag · ${d.rect} rects>0.01 · ${d.eg.join(" ;; ")}`);
});
