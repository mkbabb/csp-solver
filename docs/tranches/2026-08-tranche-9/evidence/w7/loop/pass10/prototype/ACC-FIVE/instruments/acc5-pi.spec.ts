// PRM: frozen — reduced motion, the whole-DOM computed style at rest (ACC-FIVE pass 10, R4 π; never banked).
import { test, expect, type Page } from "@playwright/test";
import { encodeSudoku } from "./wire";

// π: tree dist vs the control dist (74a2b5d9), ONE payload (visual-golden's pinned board), 1280×800,
// reduced motion, per scheme. Every element keyed by its DOM path; every computed property compared,
// plus the rounded box. An in-run floor plant (letter-spacing on the control's .section-heading) must
// be seen, or the read measured nothing.
const BOARD = encodeSudoku(3, { 0: 5, 2: 8, 11: 3, 18: 6, 20: 9 }, 81);
const READ = () => {
  const out: Record<string, string> = {};
  const path = (e: Element): string => {
    const p: string[] = [];
    for (let n: Element | null = e; n && n !== document.documentElement; n = n.parentElement) {
      const i = n.parentElement ? Array.prototype.indexOf.call(n.parentElement.children, n) : 0;
      p.unshift(`${n.tagName.toLowerCase()}${i}`);
    }
    return p.join("/");
  };
  for (const e of Array.from(document.querySelectorAll("body *"))) {
    const cs = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    const props: string[] = [];
    // standard properties only, sorted: custom properties inherit onto every node and their order is
    // engine- and load-dependent; they are read ONCE, on :root, below
    for (let i = 0; i < cs.length; i++) if (!cs[i].startsWith("--")) props.push(`${cs[i]}:${cs.getPropertyValue(cs[i])}`);
    props.sort();
    out[path(e)] = `${e.getAttribute("class") ?? ""}|${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)},${Math.round(r.height)}|${props.join(";")}`;
  }
  const root = getComputedStyle(document.documentElement);
  const vars: string[] = [];
  for (let i = 0; i < root.length; i++) if (root[i].startsWith("--")) vars.push(`${root[i]}:${root.getPropertyValue(root[i]).trim()}`);
  out[":root-vars"] = `||${vars.sort().join(";")}`;
  return out;
};
async function read(page: Page, url: string, plant = "") {
  await page.goto(`${url}/?board=${BOARD}`);
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  if (plant) await page.addStyleTag({ content: plant });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  return page.evaluate(READ);
}
for (const scheme of ["light", "dark"] as const)
  test(`PI ${scheme}: tree dist vs 74a2b5d9`, async ({ browser }, ti) => {
    test.setTimeout(240000);
    const r: Record<string, Record<string, string>> = {};
    for (const [k, url, plant] of [
      ["control", process.env.CB!, ""],
      ["tree", process.env.TB!, ""],
      ["plant", process.env.CB!, ".section-heading{letter-spacing:0.3px!important}"],
    ] as const) {
      const ctx = await browser.newContext({ reducedMotion: "reduce", colorScheme: scheme, viewport: { width: 1280, height: 800 } });
      try {
        r[k] = await read(await ctx.newPage(), url, plant);
      } finally {
        await ctx.close();
      }
    }
    const cmp = (a: Record<string, string>, b: Record<string, string>) => {
      const ka = Object.keys(a), kb = Object.keys(b);
      const onlyA = ka.filter((k) => !(k in b)), onlyB = kb.filter((k) => !(k in a));
      const diff = ka.filter((k) => k in b && a[k] !== b[k] && k !== ":root-vars");
      const va = new Set(a[":root-vars"].split("|")[2].split(";")), vb = new Set(b[":root-vars"].split("|")[2].split(";"));
      const vars = [...va].filter((v) => !vb.has(v)).map((v) => `${v} → ${[...vb].find((w) => w.split(":")[0] === v.split(":")[0])?.split(":").slice(1).join(":") ?? "(absent)"}`);
      const varsNew = [...vb].filter((v) => ![...va].some((w) => w.split(":")[0] === v.split(":")[0]));
      const detail = diff.slice(0, 12).map((k) => {
        const pa = a[k].split("|")[2].split(";"), pb = new Set(b[k].split("|")[2].split(";"));
        const box = a[k].split("|")[1] !== b[k].split("|")[1] ? ` box ${a[k].split("|")[1]}→${b[k].split("|")[1]}` : "";
        return `${k} .${a[k].split("|")[0].split(" ").slice(0, 2).join(".")}${box} [${pa.filter((p) => !pb.has(p)).slice(0, 4).join("; ").slice(0, 300)}]`;
      });
      return { n: [ka.length, kb.length], onlyA: onlyA.length, onlyB: onlyB.length, diff: diff.length, detail, vars, varsNew };
    };
    const t = cmp(r.control, r.tree), p = cmp(r.control, r.plant);
    console.log(`PI ${ti.project.name} ${scheme} nodes ${t.n.join("/")} only-control ${t.onlyA} only-tree ${t.onlyB} differing ${t.diff} :: ${t.detail.join(" || ")}`);
    console.log(`PI ${ti.project.name} ${scheme} :root custom properties changed ${t.vars.length} [${t.vars.join("; ").slice(0, 900)}] new on the tree ${t.varsNew.length} [${t.varsNew.join("; ").slice(0, 400)}]`);
    console.log(`PI ${ti.project.name} ${scheme} FLOOR PLANT differing ${p.diff} (must be > 0)`);
    expect(p.diff).toBeGreaterThan(0);
  });
