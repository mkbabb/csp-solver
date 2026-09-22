// PRM: live — PAL-WALK pass-4 CRITIC probe (scratch; deleted before return, banked under critique/).
// (1) THE TAPE NAME, PAINTED: the name photographed twice (as drawn, and with its colour set
//     transparent), so every pixel the text changed is found and read against the ground the
//     translucent washi ACTUALLY paints there (grid lines and digits under it included) — the
//     row §A/§C price by compositing the tape over the flat card.
// (2) SESSION π: the board subtree of a live two-page session, prototype vs 74a2b5d9, read for
//     computed paint + tag, the two claimed cells (the peer's digit, the peer's cursor) excluded.
import { test, expect, type Page, type BrowserContext } from "@playwright/test";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const PROTO = process.env.CRITIC_PROTO || "http://127.0.0.1:4242";
const HEAD = process.env.CRITIC_HEAD || "http://127.0.0.1:4243";

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

async function paintedTape(a: Page, label: ReturnType<Page["locator"]>) {
  const box = (await label.boundingBox())!;
  const clip = { x: box.x, y: box.y, width: box.width, height: box.height };
  const ink = await a.screenshot({ clip });
  const spec = await label.evaluate((l) => getComputedStyle(l).color);
  await label.evaluate((l) => ((l as HTMLElement).style.color = "transparent"));
  await a.waitForTimeout(150);
  const ground = await a.screenshot({ clip });
  await label.evaluate((l) => ((l as HTMLElement).style.color = ""));
  return a.evaluate(async ([x, y, s]) => {
    const load = async (b64: string) => { const i = new Image(); i.src = `data:image/png;base64,${b64}`; await i.decode(); return i; };
    const [p, q] = [await load(x), await load(y)];
    const c = document.createElement("canvas");
    c.width = p.naturalWidth; c.height = p.naturalHeight;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    g.drawImage(p, 0, 0); const A = g.getImageData(0, 0, c.width, c.height).data;
    g.clearRect(0, 0, c.width, c.height);
    g.drawImage(q, 0, 0); const B = g.getImageData(0, 0, c.width, c.height).data;
    g.clearRect(0, 0, 1, 1); g.fillStyle = s; g.fillRect(0, 0, 1, 1);
    const sp = g.getImageData(0, 0, 1, 1).data;
    const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    const lum = (r: number, gg: number, bb: number) => 0.2126 * lin(r / 255) + 0.7152 * lin(gg / 255) + 0.0722 * lin(bb / 255);
    const ratio = (l1: number, l2: number) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const d: number[] = [];
    let max = 0;
    for (let k = 0; k < A.length; k += 4) { const v = Math.abs(A[k] - B[k]) + Math.abs(A[k + 1] - B[k + 1]) + Math.abs(A[k + 2] - B[k + 2]); d.push(v); if (v > max) max = v; }
    const specL = lum(sp[0], sp[1], sp[2]);
    const text: number[] = [], core: number[] = [];
    let groundMinLum = 1, groundMaxLum = 0;
    for (let n = 0; n < d.length; n++) {
      if (d[n] <= 0.2 * max) continue;
      const k = n * 4;
      const gl = lum(B[k], B[k + 1], B[k + 2]);
      groundMinLum = Math.min(groundMinLum, gl); groundMaxLum = Math.max(groundMaxLum, gl);
      text.push(ratio(specL, gl));
      if (d[n] >= 0.8 * max) core.push(ratio(lum(A[k], A[k + 1], A[k + 2]), gl));
    }
    const q10 = (xs: number[]) => [...xs].sort((u, v) => u - v)[Math.floor(xs.length * 0.1)] ?? NaN;
    return {
      spec: `rgb(${sp[0]},${sp[1]},${sp[2]})`,
      textPx: text.length, specVsGroundWorst: Math.min(...text), specVsGroundP10: q10(text),
      under45: text.filter((r) => r < 4.5).length,
      corePx: core.length, coreWorst: Math.min(...core), coreP10: q10(core), coreUnder45: core.filter((r) => r < 4.5).length,
      groundLum: [groundMinLum, groundMaxLum],
    };
  }, [ink.toString("base64"), ground.toString("base64"), spec] as const);
}

for (const [armName, base] of [["proto", PROTO], ["head74a2b5d9", HEAD]] as const) {
  test(`tape name painted over the ground it actually sits on · ${armName}`, async ({ context }, info) => {
    test.slow();
    const { a, b, givens } = await table(context, base);
    const say = (s: string) => console.log(`[${info.project.name}/${armName}] ${s}`);
    say(`givens ${givens}`);
    // targets: empty cells with a GIVEN directly above (the tape hangs over it), plus one top-row cell (tape flips below).
    const empties = [...givens].map((ch, i) => (ch === "." ? i : -1)).filter((i) => i >= 0);
    const under = empties.filter((i) => i >= 9 && givens[i - 9] !== ".").slice(0, 3);
    const top = empties.filter((i) => i < 9 && givens[i + 9] !== ".").slice(0, 1);
    const far = givens.indexOf(givens.replace(/\./g, "")[0]);
    for (const x of [...under, ...top]) {
      await cellIn(b, x).click();
      await cellIn(b, x).fill("7");
      await expect.poll(() => cellIn(a, x).inputValue(), { timeout: 30000 }).toBe("7");
    }
    await cellIn(b, far).click({ force: true });
    await a.waitForTimeout(2500); // the boil parks
    for (const theme of ["light", "dark"] as const) {
      await a.evaluate((t) => document.documentElement.classList.toggle("dark", t === "dark"), theme);
      await a.waitForTimeout(600);
      for (const x of [...under, ...top]) {
        await a.locator(".game-cell").nth(x).hover();
        const label = a.locator(".attribution-tape .washi-label");
        await expect(label).toBeVisible();
        await a.waitForTimeout(450);
        const r = await paintedTape(a, label);
        say(`${theme} cell ${x}${x < 9 ? " (top row, below)" : " (given above)"} name ${r.spec} · spec-vs-painted-ground worst ${r.specVsGroundWorst.toFixed(3)} p10 ${r.specVsGroundP10.toFixed(3)} (${r.under45}/${r.textPx} px <4.5) · painted core worst ${r.coreWorst.toFixed(3)} p10 ${r.coreP10.toFixed(3)} (${r.coreUnder45}/${r.corePx} <4.5) · ground lum ${r.groundLum.map((v) => v.toFixed(4)).join("..")}`);
        await a.mouse.move(2, 2);
        await a.waitForTimeout(250);
      }
    }
  });
}

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
