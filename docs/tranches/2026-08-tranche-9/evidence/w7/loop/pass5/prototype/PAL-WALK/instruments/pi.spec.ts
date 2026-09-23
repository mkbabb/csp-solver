// PAL-WALK pass 5 · copied from pass4/prototype/PAL-WALK/probe/pal-walk-pi.spec.ts, OUT re-pointed (PROTO = this pass's built dist on 4230).
// PRM: frozen — emulateMedia reduce before goto; a paint/rect census, motion moves nothing read.
// π identity on the surfaces PAL-WALK does not claim (a solo board binds no player ink): every
// HTML element and every CLASSED svg element, keyed by tree position, read for its rect AND its
// computed PAINT (colour, background, font, line-height, stroke, fill, opacities) and its tag,
// on the built dist (4246) against the control (74a2b5d9, 4245). HEAD-vs-HEAD runs first: the
// negative control that proves the instrument's floor (pass 3's critic: an unclassed hand-drawn
// path is re-seeded per load and reads ~1000px of noise, so it is not read).
import { test, expect, type Page } from "@playwright/test";
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx"; // app codec: base64url(\x01 + "3." + 81 cells base36), minted from the control's deal
const PROTO = process.env.PROTO_URL || "http://127.0.0.1:4246";
const HEAD = process.env.HEAD_URL || "http://127.0.0.1:4245";
const PROPS = ["color", "background-color", "font-family", "font-size", "font-weight", "line-height", "opacity", "stroke", "fill", "stroke-width", "stroke-opacity", "fill-opacity"];
async function census(page: Page, base: string, arm: "light" | "dark") {
  await page.goto(`${base}/?board=${BOARD}`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
  await page.evaluate((t) => document.documentElement.classList.toggle("dark", t === "dark"), arm);
  await page.waitForTimeout(2600); // sleep-ok: the boil's park is the subject's precondition
  return page.evaluate((props) => {
    const givens = [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join("");
    const out: Record<string, string> = {};
    const pathOf = (el: Element) => { const p: string[] = []; for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) p.unshift(`${n.tagName}:${[...(n.parentElement?.children ?? [])].indexOf(n)}`); return p.join("/"); };
    for (const el of document.querySelectorAll("body *")) {
      if (el instanceof SVGElement && !(el.getAttribute("class") ?? "").trim()) continue;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const rect = el instanceof SVGElement && el.tagName.toLowerCase() === "path" ? "" : [r.x, r.y, r.width, r.height].map((v) => v.toFixed(2)).join(",");
      out[pathOf(el)] = `${el.tagName}|${rect}|${props.map((p) => cs.getPropertyValue(p)).join("|")}`;
    }
    return { givens, out };
  }, PROPS);
}
function diff(a: Record<string, string>, b: Record<string, string>) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let oneSided = 0, paint = 0, rect = 0, worst = 0, where = "", sample = "";
  for (const k of keys) {
    if (!(k in a) || !(k in b)) { oneSided++; continue; }
    const [ta, ra, ...pa] = a[k].split("|"), [tb, rb, ...pb] = b[k].split("|");
    if (ta !== tb) { paint++; sample ||= `tag ${k}`; }
    if (pa.join("|") !== pb.join("|")) { paint++; sample ||= `${k}: ${pa.join("|")} ≠ ${pb.join("|")}`; }
    if (ra && rb) { const d = Math.max(...ra.split(",").map((v, i) => Math.abs(Number(v) - Number(rb.split(",")[i])))); if (d > 0.01) rect++; if (d > worst) { worst = d; where = k; } }
  }
  return { n: keys.size, oneSided, paint, rect, worst, where, sample };
}
for (const arm of ["light", "dark"] as const) {
  test(`pi · paint + rect census, solo, ${arm}`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const h1 = await census(page, HEAD, arm);
    const h2 = await census(page, HEAD, arm);
    const p = await census(page, PROTO, arm);
    const minted = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
    console.log(`[${info.project.name}/${arm}] board decoded: head ${h1.givens === minted} · proto ${p.givens === minted}`);
    const neg = diff(h1.out, h2.out);
    const pi = diff(h1.out, p.out);
    const say = (n: string, d: ReturnType<typeof diff>) => console.log(`[${info.project.name}/${arm}] ${n}: ${d.n} nodes · ${d.oneSided} one-sided · ${d.paint} paint/tag deltas · ${d.rect} rects > 0.01px · worst |Δ| ${d.worst.toFixed(2)}px${d.where ? " at " + d.where.slice(-60) : ""}${d.sample ? " · e.g. " + d.sample.slice(-200) : ""}`);
    say("NEGATIVE CONTROL head-vs-head", neg);
    say("π proto-vs-head (74a2b5d9)", pi);
    expect(h1.givens).toBe(minted);
    expect(p.givens).toBe(minted);
    expect(pi.oneSided).toBe(0);
    expect(pi.paint).toBe(0);
    expect(pi.rect).toBe(0);
  });
}
test("pi · POSITIVE control — the census sees a paint change (HEAD light vs HEAD dark)", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const l = await census(page, HEAD, "light");
  const d = await census(page, HEAD, "dark");
  const x = diff(l.out, d.out);
  console.log(`[${info.project.name}] POSITIVE CONTROL light-vs-dark: ${x.n} nodes · ${x.paint} paint/tag deltas · ${x.rect} rects moved`);
  expect(x.paint).toBeGreaterThan(0);
});
