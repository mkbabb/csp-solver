/**
 * NOTE-ERASE pass 4 · Y1 — THE CLOCK IS A RULE, AND THE PUBLISHER'S DELETION IS ROW E.
 *
 * Two pass-3 gaps, one page each.
 *
 *  G16 (re-cut). Pass 3 asserted `transition-duration: 0s` during a SETTLED leave only, so the
 *  fence's general failure was unreachable by its own gate. Here a transition is PLANTED on bare
 *  `.margin-note-ink` — the exact act a palette lane would commit — and the clock is read on a
 *  FRESH leave and on a settled one. The born-RED in the same run strips `data-note-age` off the
 *  node (pass 3's own shape: a fresh note carried no attribute), which is the only thing the
 *  compound selector hangs on; the planted transition then wins and the drop clock stretches.
 *
 *  G7 (row E). The registration moved to the first static stylesheet, so deleting the publisher
 *  no longer takes the TYPE with it. `--motion-whisper` must compute to the registered initial
 *  value (`0s`), the `animation` shorthand must stay VALID (`animation-name` still names the
 *  rub-out), and the note must go on one frame. `""` and `animation-name: none` would be row I,
 *  which is what pass 3 measured.
 */
import { test, expect, type Page } from "@playwright/test";
import { bank, say, boardReady, refuseAGiven, traceRetraction, armHint } from "./lib";

const PLANT = `.margin-note-ink{transition: color 350ms linear;}`;

async function plant(page: Page) {
  await page.addStyleTag({ content: PLANT });
}

/** A refusal, then a second refusal of the same cell, which rubs the first line out. */
async function refuseTwice(page: Page) {
  await refuseAGiven(page, "5");
  await page.waitForTimeout(700);
}

async function readDuringLeave(page: Page) {
  return page.evaluate(() => {
    const el = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      leaving: el.classList.contains("note-leave-active"),
      age: el.getAttribute("data-note-age"),
      transitionDuration: cs.transitionDuration,
      transitionProperty: cs.transitionProperty,
      animationName: cs.animationName,
      animationDuration: cs.animationDuration,
    };
  });
}

/**
 * Press the refusal again and sample the leaving node every frame, reporting the first sample
 * that carries `note-leave-active` and the moment the node is gone.
 */
async function leaveReading(
  page: Page,
  strip = false,
  act?: (p: Page) => Promise<void>,
) {
  const tracePromise = traceRetraction(page, 900);
  const during: unknown[] = [];
  const poll = (async () => {
    for (let i = 0; i < 40; i++) {
      const r = await readDuringLeave(page);
      if (r?.leaving) {
        during.push(r);
        break;
      }
      await page.waitForTimeout(8);
    }
  })();
  if (strip) {
    await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>(".margin-note-ink");
      el?.removeAttribute("data-note-age");
      // …and keep it off: the leave clones no attribute, but the enter of the NEXT line would.
      const mo = new MutationObserver(() => {
        document
          .querySelectorAll(".margin-note-ink[data-note-age]")
          .forEach((n) => n.removeAttribute("data-note-age"));
      });
      mo.observe(document.body, { subtree: true, childList: true, attributes: true });
    });
  }
  if (act) await act(page);
  else await page.keyboard.press("5");
  await poll;
  const trace = await tracePromise;
  return { during: during[0] ?? null, trace };
}

test.describe("Y1 — the honest clock generalises, and row E fires", () => {
  test("G16: a transition planted on bare .margin-note-ink is neutralised on a FRESH leave", async ({
    page,
  }, info) => {
    await boardReady(page);
    await plant(page);
    await refuseTwice(page);

    // FRESH — the line has been on the page for well under the settle's eight beats.
    const fresh = await leaveReading(page);
    // …and the BORN-RED, same page, same act: strip the attribute the fence hangs on.
    await page.waitForTimeout(900);
    await refuseAGiven(page, "5");
    await page.waitForTimeout(700);
    const stripped = await leaveReading(page, true);

    // SETTLED — pass 3's row, re-run under the plant. A REFUSAL never settles (the age is armed
    // by KIND and a verdict is not one of the two that age), so the settled arm is the hint's
    // line: graphite, kind `state`, which is exactly what `AGES` admits. A second hint on
    // another cell is what rubs it out.
    const page2 = await page.context().newPage();
    await page2.goto(page.url());
    await page2.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
    await page2.waitForTimeout(1200);
    await page2.addStyleTag({ content: PLANT });
    await armHint(page2);
    await page2.waitForTimeout(1400); // > 8 beats: the note settles
    const settledAge = await page2.evaluate(
      () =>
        document
          .querySelector(".margin-note-ink")
          ?.getAttribute("data-note-age") ?? null,
    );
    const settled = await leaveReading(page2, false, async (p) => {
      await p.evaluate(() => {
        const inputs = Array.from(
          document.querySelectorAll(".game-cell input"),
        ) as HTMLInputElement[];
        const empties = inputs.filter((i) => !i.value);
        empties[Math.min(3, empties.length - 1)]?.focus();
      });
      await p.keyboard.press("h");
    });
    await page2.close();

    const row = {
      engine: info.project.name,
      planted: PLANT,
      fresh: { ...fresh.during, absentAtMs: fresh.trace.absentAtMs },
      strippedControl: {
        ...stripped.during,
        absentAtMs: stripped.trace.absentAtMs,
      },
      settledAgeBeforeLeave: settledAge,
      settled: { ...settled.during, absentAtMs: settled.trace.absentAtMs },
    };
    bank(`y1-clock-${info.project.name}.json`, row);
    say("y1", row);

    // The gate. Both ages fenced; the stripped control is the same act with the fence removed.
    expect(fresh.during, "a fresh leave was sampled").toBeTruthy();
    expect((fresh.during as { age: string }).age).toBe("fresh");
    expect((fresh.during as { transitionDuration: string }).transitionDuration).toBe("0s");
    expect((settled.during as { age: string }).age).toBe("settled");
    expect((settled.during as { transitionDuration: string }).transitionDuration).toBe(
      "0s",
    );
    // BORN-RED: with the attribute gone the plant wins — this is what the gate catches.
    expect(
      (stripped.during as { transitionDuration: string }).transitionDuration,
      "the negative control must show the planted transition winning",
    ).toBe("0.35s");
  });

  test("G7 row E: delete the publisher and the rungs fall to their registered 0ms", async ({
    page,
  }, info) => {
    await boardReady(page);
    const before = await page.evaluate(() => ({
      publisherNodes: document.querySelectorAll("style[data-motion-rungs]").length,
      whisper: getComputedStyle(document.documentElement)
        .getPropertyValue("--motion-whisper")
        .trim(),
    }));
    await page.evaluate(() =>
      document.querySelectorAll("style[data-motion-rungs]").forEach((n) => n.remove()),
    );
    const after = await page.evaluate(() => ({
      publisherNodes: document.querySelectorAll("style[data-motion-rungs]").length,
      whisper: getComputedStyle(document.documentElement)
        .getPropertyValue("--motion-whisper")
        .trim(),
      note: getComputedStyle(document.documentElement)
        .getPropertyValue("--motion-note")
        .trim(),
    }));
    await refuseAGiven(page, "5");
    await page.waitForTimeout(700);
    const trace = traceRetraction(page, 700);
    const during: unknown[] = [];
    const poll = (async () => {
      for (let i = 0; i < 40; i++) {
        const r = await readDuringLeave(page);
        if (r?.leaving) {
          during.push(r);
          break;
        }
        await page.waitForTimeout(8);
      }
    })();
    await page.keyboard.press("5");
    await poll;
    const t = await trace;
    const distinctClip = new Set(t.samples.map((s) => s.clip)).size;
    const row = {
      engine: info.project.name,
      before,
      after,
      duringLeave: during[0] ?? null,
      leaveAnimation: t.leaveAnimation,
      leaveDuration: t.leaveDuration,
      absentAtMs: t.absentAtMs,
      distinctClipStates: distinctClip,
      medianRafMs: t.medianRafMs,
    };
    bank(`y1-rowE-${info.project.name}.json`, row);
    say("y1-rowE", row);

    expect(before.publisherNodes).toBe(1);
    expect(after.publisherNodes).toBe(0);
    // ROW E: the registered initial value, not the empty string pass 3 measured.
    expect(after.whisper).toMatch(/^0m?s$/);
    expect(after.note).toMatch(/^0m?s$/);
    // The shorthand stays VALID — the verb is named, it just has no length.
    expect(t.leaveAnimation ?? "").toContain("ink-rub-out");
  });
});
