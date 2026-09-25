import { test, type Page } from "@playwright/test";
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const TREE = "http://127.0.0.1:4245", CTRL = "http://127.0.0.1:4244";
const PROPS = ["color", "background-color", "opacity", "visibility", "display", "transform", "filter", "border-top-width", "border-bottom-width", "border-left-width", "border-right-width", "border-top-color", "box-shadow", "font-size", "font-weight", "font-family", "fill", "stroke", "stroke-width", "clip-path", "mask-image", "text-decoration-line", "outline-style"];
async function census(page: Page, base: string) {
  await page.goto(`${base}/?board=${BOARD}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2500);
  const id = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s)) ?? "");
  const rows = await page.evaluate((PROPS) => {
    const out: Record<string, string> = {};
    const seen = new Map<string, number>();
    const chain = (e: Element): string => {
      const parts: string[] = [];
      for (let n: Element | null = e; n && n !== document.body; n = n.parentElement)
        parts.unshift(n.tagName.toLowerCase() + ([...n.classList].filter((c) => !/^(is-|data-v)/.test(c)).sort().slice(0, 2).map((c) => "." + c).join("")));
      return parts.join(">");
    };
    for (const e of document.body.querySelectorAll("*")) {
      if (["SCRIPT", "STYLE", "LINK", "META"].includes(e.tagName)) continue;
      const k0 = chain(e);
      const i = (seen.get(k0) ?? 0) + 1;
      seen.set(k0, i);
      const cs = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      out[`${k0}#${i}`] = PROPS.map((p) => `${p}:${cs.getPropertyValue(p)}`).join(";") + `;rect:${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)},${Math.round(r.height)}`;
    }
    return out;
  }, PROPS);
  const givens = await page.evaluate(() => [...document.querySelectorAll("[aria-label]")].map((e) => e.getAttribute("aria-label")).filter((l) => /given/i.test(l ?? "")).length);
  return { id, rows, givens };
}
function diff(a: Record<string, string>, b: Record<string, string>) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const out: string[] = [];
  for (const k of keys) {
    if (a[k] === b[k]) continue;
    if (!(k in a)) { out.push(`+ ${k}`); continue; }
    if (!(k in b)) { out.push(`- ${k}`); continue; }
    const pa = a[k].split(";"), pb = b[k].split(";");
    out.push(`~ ${k} :: ${pa.map((v, i) => (v === pb[i] ? "" : `${v} -> ${pb[i]}`)).filter(Boolean).join(" | ")}`);
  }
  return out;
}
for (const theme of ["light", "dark"] as const)
  for (const [vw, vh, touch] of [[1280, 800, false], [390, 844, true]] as const)
    test.describe(`PI7 ${theme} ${vw}x${vh}`, () => {
      test.use({ viewport: { width: vw, height: vh }, hasTouch: touch, isMobile: false, colorScheme: theme, contextOptions: { reducedMotion: "reduce" } });
      test(`PI7 ${theme} ${vw}x${vh} ${touch ? "coarse" : "fine"}`, async ({ browser }) => {
        const mk = async () => (await browser.newContext({ viewport: { width: vw, height: vh }, hasTouch: touch, colorScheme: theme, reducedMotion: "reduce" })).newPage();
        const c1 = await census(await mk(), CTRL);
        const c2 = await census(await mk(), CTRL);
        const t1 = await census(await mk(), TREE);
        const noise = diff(c1.rows, c2.rows);
        const d = diff(c1.rows, t1.rows);
        console.log("PI7", JSON.stringify({ engine: test.info().project.name, theme, vw, vh, touch, ctrl: c1.id.split("/").pop(), tree: t1.id.split("/").pop(), givens: [c1.givens, c2.givens, t1.givens], rows: [Object.keys(c1.rows).length, Object.keys(t1.rows).length], noise: noise.length, noiseRows: noise.slice(0, 5), delta: d.length }));
        for (const l of d) console.log("PI7D", test.info().project.name, theme, `${vw}x${vh}`, l.slice(0, 400));
      });
    });
