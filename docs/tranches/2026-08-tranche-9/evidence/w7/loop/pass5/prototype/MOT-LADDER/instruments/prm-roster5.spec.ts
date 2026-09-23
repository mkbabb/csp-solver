import { test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { PINNED_URL } from "./board";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MOT-LADDER/readings";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(`${OUT}/${n}.json`, JSON.stringify(d, null, 1) + "\n");

const AFTER = process.env.PW_AFTER ?? "http://127.0.0.1:4246";
const CONTROL = process.env.PW_CONTROL ?? "http://127.0.0.1:4237";

/**
 * B5's SECOND CLAUSE, EXECUTED (critique §2.7). Pass 3 priced PRM over CSSOM rules and the
 * ledger said the unadmitted set was exactly 2; the surface said 16 rendered elements tween
 * under `reduce`. The clause "every other nonzero live rule is a PRM-FALLBACK row" was never
 * run. It is run here, over RENDERED ELEMENTS, and every survivor is resolved into one of
 * three classes — admitted, INHERITED (present in the control's roster at the same key, so
 * pre-existing at 74a2b5d9 and not this family's), or UNACCOUNTED, which is the only number
 * that matters.
 */
const ROSTER = () => {
  const path = (el: Element): string => {
    const parts: string[] = [];
    let n: Element | null = el;
    while (n && n !== document.body) {
      const p: Element | null = n.parentElement;
      if (!p) break;
      const sibs = Array.from(p.children).filter((c) => c.tagName === n!.tagName);
      parts.unshift(`${n.tagName}[${sibs.indexOf(n) + 1}]`);
      n = p;
    }
    return parts.join("/");
  };
  const secs = (v: string) =>
    v
      .split(",")
      .map((s) => (s.trim().endsWith("ms") ? parseFloat(s) / 1000 : parseFloat(s)))
      .filter((n) => !Number.isNaN(n));
  const out: Array<Record<string, unknown>> = [];
  for (const el of Array.from(document.querySelectorAll("body *"))) {
    const cs = getComputedStyle(el);
    const d = secs(cs.transitionDuration);
    const ad = secs(cs.animationDuration);
    const tdNonzero = d.some((n) => n > 0);
    const adNonzero = ad.some((n) => n > 0) && cs.animationName !== "none";
    if (!tdNonzero && !adNonzero) continue;
    out.push({
      key: path(el),
      tag: el.tagName,
      cls: (el.getAttribute("class") ?? "").slice(0, 60),
      td: cs.transitionDuration,
      tp: cs.transitionProperty,
      ad: cs.animationDuration,
      an: cs.animationName,
      tdNonzero,
      adNonzero,
    });
  }
  return out;
};

const RUNGS = () =>
  Object.fromEntries(
    ["whisper", "leave", "note", "dusk", "step", "throw", "rise"].map((n) => [
      n,
      getComputedStyle(document.documentElement).getPropertyValue(`--motion-${n}`).trim(),
    ]),
  );

test("prm · rendered-element roster under reduce, with the class-closure clause", async ({
  browser,
  browserName,
}) => {
  test.setTimeout(300000);
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const [a, b] = [await ctx.newPage(), await ctx.newPage()];
  for (const [p, base] of [
    [a, AFTER],
    [b, CONTROL],
  ] as const) {
    await p.goto(base + PINNED_URL);
    await p.waitForLoadState("networkidle");
    await p.waitForTimeout(2200);
  }
  const witness = await a.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [ra, rb] = [await a.evaluate(ROSTER), await b.evaluate(ROSTER)];
  const rungs = await a.evaluate(RUNGS);
  const tdA = ra.filter((r) => r.tdNonzero);
  const tdB = rb.filter((r) => r.tdNonzero);
  const controlKeys = new Set(rb.map((r) => r.key as string));
  const inherited = ra.filter((r) => controlKeys.has(r.key as string));
  const unaccounted = ra.filter((r) => !controlKeys.has(r.key as string));
  const row = {
    browserName,
    witnessReduce: witness,
    rungsUnderReduce: rungs,
    controlNonzeroElements: rb.length,
    afterNonzeroElements: ra.length,
    controlTweeningTransitions: tdB.length,
    afterTweeningTransitions: tdA.length,
    afterTweeningTransitionRows: tdA.slice(0, 40),
    inheritedFromControl: inherited.length,
    unaccountedByThisFamily: unaccounted.length,
    unaccounted,
    afterSample: ra.slice(0, 20),
  };
  bank(`prm-roster-${browserName}`, row);
  console.log(
    `prm ${browserName}: TRANSITIONS tweening under reduce control ${tdB.length} → after ${tdA.length}; any-nonzero control ${rb.length} → after ${ra.length}; inherited ${inherited.length}, UNACCOUNTED ${unaccounted.length}; rungs ${JSON.stringify(rungs)}`,
  );
  await ctx.close();
});
