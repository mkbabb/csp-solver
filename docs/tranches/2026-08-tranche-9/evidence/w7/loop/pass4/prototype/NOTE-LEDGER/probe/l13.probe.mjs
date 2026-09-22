/**
 * NOTE-LEDGER · pass-4 probe 5 — L13's BORN-RED, on the SERVED BUILT DIST.
 *
 * The row: "delete §13's publisher → the leave is instant and this row reds". Pass 3 proved the
 * mechanism (the `@property … initial-value: 0ms` registration) and never ran the deletion, so
 * the row was unearned. Here the ablation runs on the dist that actually ships
 * (`index-CzJXFPhXEQqA.js` on :4247), by removing the node the publisher writes — the same
 * bytes, one node different — and the leave is timed against the un-ablated arm in the same run.
 *
 * AND IT REPORTS A LAW BREACH IT CANNOT FIX. The @property block's first clause (LAWS §Gates,
 * chair §6.5) is that the registration lives in the first STATIC stylesheet and is NEVER emitted
 * by the publisher it guards. §13's borrowed stub emits both from one `<style data-motion-rungs>`
 * node, so this ablation removes the registration and the values together. The reading is still
 * the reading; the node is MOT-LADDER's (registry §2.7) and the breach is reported, not patched.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const DIST = "http://127.0.0.1:4247/";
const digitOf = (s) =>
  (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1] ?? null;

async function arm(page, ablate) {
  await page.goto(DIST + "?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
  const publisher = await page.evaluate((kill) => {
    const n = document.querySelector("style[data-motion-rungs]");
    const had = !!n;
    if (kill && n) n.remove();
    return { had, killed: kill && had };
  }, ablate);
  const rungs = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return {
      note: cs.getPropertyValue("--motion-note").trim(),
      whisper: cs.getPropertyValue("--motion-whisper").trim(),
    };
  });
  // Two records so line two exists, then a third so line two LEAVES through the eraser.
  const say = async () => {
    await page.evaluate(() => {
      const free = [...document.querySelectorAll(".board-cells input")].filter(
        (x) => !x.value && !x.readOnly && !x.disabled,
      );
      free[0]?.focus();
    });
    await page.keyboard.press("h");
    await page.waitForTimeout(650);
    const s = await page.evaluate(
      () => document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
    );
    const d = digitOf(s);
    if (d) await page.keyboard.type(d);
    await page.waitForTimeout(500);
    return s;
  };
  await say();
  await say();
  // The third record: line two's node leaves.
  await page.evaluate(() => {
    window.__leave = null;
    const obs = new MutationObserver(() => {
      const el = document.querySelector(".board-margin .margin-note-previous");
      if (el && !window.__leave) {
        const cs = getComputedStyle(el);
        if (cs.animationName !== "none")
          window.__leave = {
            animationName: cs.animationName,
            animationDuration: cs.animationDuration,
            transitionDuration: cs.transitionDuration,
            at: performance.now(),
          };
      }
    });
    obs.observe(document.body, { subtree: true, childList: true, attributes: true });
    window.__t0 = performance.now();
  });
  const third = await say();
  const leave = await page.evaluate(() => ({
    leave: window.__leave,
    // The node the rub-out runs on is gone by now; the reading that survives is whether the
    // rung resolved to a time at all.
    noteResolved: getComputedStyle(document.documentElement)
      .getPropertyValue("--motion-note")
      .trim(),
  }));
  return { publisher, rungs, third, ...leave };
}

const out = {};
for (const engine of ["chromium", "webkit"]) {
  const browser = await pw[engine].launch();
  out[engine] = {};
  for (const ablate of [false, true]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const page = await ctx.newPage();
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
    out[engine][ablate ? "publisherDeleted" : "shipped"] = await arm(page, ablate);
    await ctx.close();
  }
  await browser.close();
  const a = out[engine].shipped;
  const b = out[engine].publisherDeleted;
  console.log(
    `${engine} SHIPPED rungs note=${a.rungs.note} whisper=${a.rungs.whisper} leaveAnim=${a.leave?.animationName ?? "—"}/${a.leave?.animationDuration ?? "—"} · ` +
      `ABLATED publisher had=${b.publisher.had} killed=${b.publisher.killed} rungs note="${b.rungs.note}" whisper="${b.rungs.whisper}" leaveAnim=${b.leave?.animationName ?? "—"}/${b.leave?.animationDuration ?? "—"}`,
  );
}
writeFileSync(join(OUT, "l13-bornred.json"), JSON.stringify(out, null, 2));
