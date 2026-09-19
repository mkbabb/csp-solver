/**
 * THE ARRIVAL-TIME INSTRUMENT — banked for every family that says "same-frame" (T9-W7 pass 2,
 * MRK-ABS). Written by MRK-ABS's pass-1 critic as `verify2.probe.ts`; re-cut here as a
 * reusable probe with its OUT re-pointed and its subject list taken from the page.
 *
 * WHAT IT ANSWERS. A focus ring's COLOUR is a transitionable property in both engines
 * (`outline-color`), and Tailwind v4's `transition-colors` utility includes it — measured at the
 * library, `node_modules/tailwindcss/dist/lib.mjs`: "color, background-color, border-color,
 * outline-color, text-decoration-color, fill, stroke". So a stop that carries `transition-colors`
 * or any `transition: all` with a non-zero duration CANNOT paint its ring in the frame focus
 * lands. A computed-style census taken after a settle reads one colour and says nothing about
 * this; this probe samples the same property on a schedule.
 *
 * TWO READINGS PER STOP:
 *   ARRIVAL  the computed `outline-color` at 1/30/80/150/250/400/700ms after `.focus()`, and the
 *            first sample at which it equals its settled value (that is the arrival time).
 *   CARRIER  `transition-property` / `transition-duration`, so a stop that arrives late says
 *            WHY in the same row. A stop whose carrier lists outline-color at 0s is safe today
 *            and one duration away from not being.
 *
 * A gate that says "one colour" must carry its settle in its wording, or name this probe and
 * assert arrival <= one frame.
 */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import process from "node:process";

const OUT = process.env.PROBE_OUT ?? ".";
mkdirSync(OUT, { recursive: true });
const STEPS = [1, 30, 80, 150, 250, 400, 700];

test("arrival", async ({ page, browserName }) => {
  await page.goto("/");
  await page.waitForSelector(".game-cell", { timeout: 20000 });
  // INJECT_TOKEN=1 adds the pass-1 token EXACTLY as the cure authors it, so the instrument can
  // be validated (and the arrival measured) on a tree that has not landed it yet.
  if (process.env.INJECT_TOKEN) {
    await page.addStyleTag({
      content:
        "@layer base { :root { --focus-ring: 2px solid #3a7bc4; --focus-offset: 3px; }" +
        " :focus-visible { outline: var(--focus-ring); outline-offset: var(--focus-offset); }" +
        " .cell-native-input:focus-visible, .gallery-viewport:focus-visible { outline: none; } }",
    });
  }
  await page.waitForTimeout(600);

  const subjects = await page.evaluate(() => {
    const sel = 'a[href], button, input, [tabindex]:not([tabindex="-1"])';
    const out: string[] = [];
    const seen = new Set<string>();
    for (const n of Array.from(document.querySelectorAll<HTMLElement>(sel))) {
      const c = (n.className || "").toString().split(" ")[0] || n.tagName.toLowerCase();
      if (seen.has(c)) continue;
      seen.add(c);
      out.push(c);
    }
    return out;
  });

  const rows: unknown[] = [];
  for (const cls of subjects) {
    const loc = page.locator(`.${cls}`).first();
    if (!(await loc.count())) continue;
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
    await page.waitForTimeout(500);
    const samples: { t: number; colour: string; offset: string }[] = [];
    await loc.evaluate((n: HTMLElement) => n.focus());
    let prev = 0;
    for (const t of STEPS) {
      await page.waitForTimeout(t - prev);
      prev = t;
      samples.push(
        await loc.evaluate((n: HTMLElement) => {
          const cs = getComputedStyle(n);
          return { t: 0, colour: cs.outlineColor, offset: cs.outlineOffset };
        }),
      );
      samples[samples.length - 1].t = t;
    }
    const carrier = await loc.evaluate((n: HTMLElement) => {
      const cs = getComputedStyle(n);
      return {
        transitionProperty: cs.transitionProperty,
        transitionDuration: cs.transitionDuration,
        listsOutlineColour: /\boutline-color\b|\ball\b/.test(cs.transitionProperty),
      };
    });
    const settled = samples[samples.length - 1].colour;
    const arrival = samples.find((s) => s.colour === settled)?.t ?? null;
    rows.push({ cls, arrivalMs: arrival, sameFrame: arrival !== null && arrival <= 1, settled, carrier, samples });
  }
  writeFileSync(`${OUT}/arrival-${browserName}.json`, JSON.stringify({ engine: browserName, rows }, null, 2));
  const late = rows.filter((r) => !(r as { sameFrame: boolean }).sameFrame);
  console.log(`[arrival ${browserName}] ${rows.length} stops, ${late.length} do not arrive in the first frame`);
  for (const r of late as { cls: string; arrivalMs: number | null; carrier: { transitionDuration: string } }[])
    console.log(`   ${r.cls} arrives at ${r.arrivalMs}ms (carrier ${r.carrier.transitionDuration})`);
});
