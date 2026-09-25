/** Critic π: computed PAINT properties + tag names of every rendered element, after vs the
 *  74a2b5d9 control, with a control-vs-control arm in the same run. One encoded payload. */
import { test, type Page } from "@playwright/test";
import { encodeSudoku } from "../e2e/wire";
// prettier-ignore
const SOLVED_9 = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
const BLANKS = new Set([0, 4, 10, 22, 36, 40, 55, 61, 73, 80]);
const PAYLOAD = encodeSudoku(3, Object.fromEntries(SOLVED_9.map((v, i) => [i, BLANKS.has(i) ? 0 : v])), 81);
const ARMS = { after: "http://127.0.0.1:4236", control: "http://127.0.0.1:4237" };
async function givens(page: Page) { return (await page.locator('.board-cells [aria-label*="given clue"]').evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")).join("|"))); }
const PROPS = ["color","background-color","background-image","opacity","transform","translate","scale","filter","backdrop-filter","z-index","position","visibility","display","fill","stroke","stroke-width","clip-path","mask-image","overflow-x","overflow-y","isolation","mix-blend-mode","border-top-color","border-top-width","outline-style","box-shadow","font-size","font-weight","width","height"];
async function census(page: Page) {
  return page.evaluate((PROPS) => {
    const out: Record<string, Record<string, string>> = {};
    const key = (el: Element): string => {
      const parts: string[] = [];
      for (let e: Element | null = el; e && e !== document.body; e = e.parentElement) {
        const p = e.parentElement; const sib = p ? [...p.children].filter((c) => c.tagName === e!.tagName && !c.classList.contains("grid-ink")) : []; const i = e.classList.contains("grid-ink") ? 99 : sib.indexOf(e);
        parts.unshift(`${e.tagName.toLowerCase()}[${i}]`);
      }
      return parts.join(">");
    };
    for (const el of document.body.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      if (cs.display === "none") continue;
      const r: Record<string, string> = {};
      for (const p of PROPS) { let v = cs.getPropertyValue(p); if (p === "mask-image" || p === "background-image") v = v.replace(/blob:[^")]+/g, "blob:*"); if (p==="width"||p==="height") v = String(Math.round(parseFloat(v)||0)); r[p] = v; }
      r.cls = [...el.classList].filter((c) => !/^is-active$/.test(c)).sort().join(".");
      out[key(el)] = r;
    }
    return out;
  }, PROPS);
}
function diff(a: any, b: any) {
  const ka = Object.keys(a), kb = new Set(Object.keys(b));
  const onlyA = ka.filter((k) => !kb.has(k)); const onlyB = [...kb].filter((k) => !(k in a));
  const moved: any[] = [];
  for (const k of ka) if (kb.has(k)) { const d = Object.keys(a[k]).filter((p) => p !== "cls" && a[k][p] !== b[k][p]); if (d.length) moved.push({ k, d: d.map((p) => `${p}: ${b[k][p]} -> ${a[k][p]}`) }); }
  return { shared: ka.length - onlyA.length, onlyA, onlyB, moved };
}
const CELLS = [
  { name: "1280x800-light-fine", w: 1280, h: 800, touch: false, dark: false },
  { name: "1280x800-dark-fine", w: 1280, h: 800, touch: false, dark: true },
  { name: "390x844-light-coarse", w: 390, h: 844, touch: true, dark: false },
];
for (const cell of CELLS) for (const pose of ["playing", "gallery"]) {
  test(`pi ${pose} ${cell.name}`, async ({ browser }, info) => {
    const reads: any = {};
    for (const arm of ["after", "control", "control2"]) {
      const ctx = await browser.newContext({ viewport: { width: cell.w, height: cell.h }, hasTouch: cell.touch, colorScheme: cell.dark ? "dark" : "light", reducedMotion: "reduce", deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      const base = arm === "after" ? ARMS.after : ARMS.control;
      await page.goto(`${base}/?game=sudoku&board=${PAYLOAD}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(3000);
      const g = await givens(page);
      if (pose === "gallery") { await page.keyboard.press("g"); await page.waitForTimeout(2500); }
      reads[arm] = { g, c: await census(page) };
      await ctx.close();
    }
    const av = diff(reads.after.c, reads.control.c), cc = diff(reads.control2.c, reads.control.c);
    const same = reads.after.g === reads.control.g && reads.control.g === reads.control2.g && reads.after.g.split("|").length === 71;
    const summ = (d: any) => ({ shared: d.shared, onlyAfter: d.onlyA.length, onlyControl: d.onlyB.length, moved: d.moved.length });
    console.log(`PI[${info.project.name}·${pose}·${cell.name}] givensEqual ${same} after-vs-ctl ${JSON.stringify(summ(av))} ctl-vs-ctl ${JSON.stringify(summ(cc))}`);
    for (const m of av.moved.slice(0, 40)) console.log(`   MOVED ${m.k.slice(-110)} :: ${m.d.join(" | ").slice(0, 400)}`);
    console.log(`   onlyAfter: ${av.onlyA.map((k: string) => k.split(">").slice(-2).join(">")).slice(0, 12).join(" , ")}`);
    console.log(`   onlyControl: ${av.onlyB.map((k: string) => k.split(">").slice(-2).join(">")).slice(0, 12).join(" , ")}`);
  });
}
