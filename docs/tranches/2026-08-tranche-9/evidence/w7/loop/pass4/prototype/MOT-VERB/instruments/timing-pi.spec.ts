/**
 * MOT-VERB pass 4 — THE COMPUTED-TIMING SET-DIFF (charter row 5).
 *
 * A rect census reads geometry at rest and a CSS set-diff excludes timing lines, so BOTH π
 * instruments this wave has been using are blind to a re-curve by construction: pass 3 shipped
 * ~32 changed curves and six changed lengths with one measurement between them and both
 * instruments read 0. This one reads the COMPUTED timing of every rendered element — the
 * resolved transition property/duration/easing and animation name/duration/easing — keyed by a
 * `TAG[n]` path from `body` (MOT-LADDER's key, which cannot collide the way `TAG.class#id` did),
 * on the same pinned board in both arms, and prints every key whose timing moved.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const AFTER = "http://127.0.0.1:4247";
const CONTROL = "http://127.0.0.1:4248";
const BOARD = "?board=timing-pi";
const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/MOT-VERB/readings";

type Census = Record<string, string>;

async function census(page: Page, url: string): Promise<Census> {
  await page.goto(url + "/" + BOARD, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200); // let the entry choreography land; timing is read at rest
  return page.evaluate(() => {
    const out: Record<string, string> = {};
    const key = (el: Element): string => {
      const parts: string[] = [];
      let n: Element | null = el;
      while (n && n !== document.body) {
        const p: Element | null = n.parentElement;
        if (!p) break;
        const sibs = [...p.children].filter((c) => c.tagName === n!.tagName);
        parts.unshift(`${n.tagName}[${sibs.indexOf(n) + 1}]`);
        n = p;
      }
      return parts.join("/");
    };
    for (const el of document.body.querySelectorAll("*")) {
      const c = getComputedStyle(el);
      const t = `${c.transitionProperty}|${c.transitionDuration}|${c.transitionTimingFunction}|${c.transitionDelay}`;
      const a = `${c.animationName}|${c.animationDuration}|${c.animationTimingFunction}|${c.animationDelay}|${c.animationFillMode}`;
      // A row with nothing to say is not banked: `all|0s|…` with no animation is the default.
      if (t.startsWith("all|0s") && a.startsWith("none|0s")) continue;
      out[key(el)] = `T ${t}  ::  A ${a}`;
    }
    return out;
  });
}

test("computed timing, after vs 74a2b5d9, same pinned board", async ({ page }, info) => {
  const after = await census(page, AFTER);
  const control = await census(page, CONTROL);
  const engine = info.project.name;

  const keys = new Set([...Object.keys(after), ...Object.keys(control)]);
  const onlyAfter: string[] = [];
  const onlyControl: string[] = [];
  const moved: { key: string; after: string; control: string }[] = [];
  for (const k of keys) {
    if (!(k in control)) onlyAfter.push(k);
    else if (!(k in after)) onlyControl.push(k);
    else if (after[k] !== control[k]) moved.push({ key: k, after: after[k], control: control[k] });
  }
  // The classes the moves fall into, so the table is a count and not a wall.
  const cls = (m: { after: string; control: string }) => {
    const [ta, tc] = [m.after.split("::")[0], m.control.split("::")[0]];
    const dur = ta.split("|")[1] !== tc.split("|")[1];
    const ease = ta.split("|")[2] !== tc.split("|")[2];
    const prop = ta.split("|")[0] !== tc.split("|")[0];
    const anim = m.after.split("::")[1] !== m.control.split("::")[1];
    return [prop && "property", dur && "LENGTH", ease && "CURVE", anim && "animation"]
      .filter(Boolean)
      .join("+");
  };
  const byClass: Record<string, number> = {};
  for (const m of moved) byClass[cls(m)] = (byClass[cls(m)] ?? 0) + 1;

  console.log(
    `TIMING-PI[${engine}] shared=${keys.size} moved=${moved.length} onlyAfter=${onlyAfter.length} onlyControl=${onlyControl.length} classes=${JSON.stringify(byClass)}`,
  );
  mkdirSync(OUT, { recursive: true });
  writeFileSync(
    `${OUT}/timing-pi-${engine}.json`,
    JSON.stringify({ engine, shared: keys.size, byClass, onlyAfter, onlyControl, moved }, null, 1),
  );
});
