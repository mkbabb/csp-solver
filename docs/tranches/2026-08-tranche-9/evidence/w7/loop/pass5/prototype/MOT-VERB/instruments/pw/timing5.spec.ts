/**
 * MOT-VERB pass 5 — THE COMPUTED-TIMING SET-DIFF, PINNED (charter row 1; pass-4 critique §2.1).
 * Pass 4's `?board=timing-pi` was a bare name: `decodeBoardParam` read it invalid and each arm
 * dealt its own board. Here every page loads the estate's own codec payload (board.ts), the
 * given-set is read back from every page and asserted equal, and a CONTROL-vs-CONTROL arm runs
 * in the same test (the instrument's own noise). Keys: `TAG[n]` paths from body.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { PAYLOAD, ARMS, OUT, givens } from "./board";

type Census = Record<string, string>;
async function census(page: Page, url: string, pose: string): Promise<{ c: Census; g: string }> {
  const q = pose === "gallery" ? `?game=sudoku&view=gallery&board=${PAYLOAD}` : `?game=sudoku&board=${PAYLOAD}`;
  await page.goto(`${url}/${q}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const g = await givens(page);
  const c = await page.evaluate(() => {
    const out: Record<string, string> = {};
    const key = (el: Element): string => {
      const parts: string[] = [];
      let n: Element | null = el;
      while (n && n !== document.body) {
        const p: Element | null = n.parentElement;
        if (!p) break;
        const sibs = [...p.children].filter((x) => x.tagName === n!.tagName);
        parts.unshift(`${n.tagName}[${sibs.indexOf(n) + 1}]`);
        n = p;
      }
      return parts.join("/");
    };
    for (const el of document.body.querySelectorAll("*")) {
      const s = getComputedStyle(el);
      const t = `${s.transitionProperty}|${s.transitionDuration}|${s.transitionTimingFunction}|${s.transitionDelay}`;
      const a = `${s.animationName}|${s.animationDuration}|${s.animationTimingFunction}|${s.animationDelay}|${s.animationFillMode}`;
      if (t.startsWith("all|0s") && a.startsWith("none|0s")) continue;
      out[key(el)] = `T ${t}  ::  A ${a}`;
    }
    return out;
  });
  return { c, g };
}
function diff(a: Census, b: Census) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let onlyA = 0, onlyB = 0; const moved: { key: string; a: string; b: string }[] = [];
  for (const k of keys) {
    if (!(k in b)) onlyA++;
    else if (!(k in a)) onlyB++;
    else if (a[k] !== b[k]) moved.push({ key: k, a: a[k], b: b[k] });
  }
  const cls = (m: { a: string; b: string }) => {
    const [ta, tb] = [m.a.split("::")[0].split("|"), m.b.split("::")[0].split("|")];
    return [ta[0] !== tb[0] && "property", ta[1] !== tb[1] && "LENGTH", ta[2] !== tb[2] && "CURVE", m.a.split("::")[1] !== m.b.split("::")[1] && "animation"].filter(Boolean).join("+");
  };
  const byClass: Record<string, number> = {};
  for (const m of moved) byClass[cls(m)] = (byClass[cls(m)] ?? 0) + 1;
  return { shared: keys.size - onlyA - onlyB, onlyA, onlyB, moved: moved.length, byClass, rows: moved };
}
for (const pose of ["playing", "gallery"]) {
  test(`timing set-diff pinned · ${pose}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage();
    const A = await census(p, ARMS.after, pose);
    const C1 = await census(p, ARMS.control, pose);
    const C2 = await census(p, ARMS.control, pose);
    const same = A.g === C1.g && C1.g === C2.g && A.g.length > 0;
    const ac = diff(A.c, C1.c), cc = diff(C1.c, C2.c);
    console.log(`TIMING5[${info.project.name}·${pose}] payload=${PAYLOAD} givensEqual=${same} (len ${A.g.length}) · A-vs-C shared ${ac.shared} onlyA ${ac.onlyA} onlyC ${ac.onlyB} moved ${ac.moved} ${JSON.stringify(ac.byClass)} · C-vs-C moved ${cc.moved} onlyA ${cc.onlyA} onlyB ${cc.onlyB}`);
    writeFileSync(`${OUT}/timing5-${info.project.name}-${pose}.json`, JSON.stringify({ payload: PAYLOAD, givensEqual: same, afterVsControl: ac, controlVsControl: { ...cc, rows: undefined } }, null, 1));
    expect(same).toBe(true);
    await ctx.close();
  });
}
