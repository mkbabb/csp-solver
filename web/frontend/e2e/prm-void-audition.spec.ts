import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// PRM: live, because the spec measures the un-applied state — freezing it would erase the
//   very thing under audition. Every arm here declares PRM through a route and then asks the
//   page what actually landed; a spec-wide `emulateMedia` freeze would make all four arms
//   read true and the audition would assert nothing.
//
// T7-W3 cross-cutting gate 4 — THE VOID-`test.use` RE-AUDITION TRAP.
//
// At @playwright/test 1.61.1 the dedicated test option for reduced motion is VOID: `test.use({
// reducedMotion })` and the identical option in a config's `use` block are accepted, typed,
// and silently dropped — `matchMedia('(prefers-reduced-motion: reduce)')` reads FALSE in the
// page. The same option through raw `browser.newContext()` lands. That asymmetry cost the
// estate a flake family: every golden ever minted before T6.2 was captured with the ~8 Hz
// boil beat RUNNING while the config declared it frozen, and the logo baseline embedded
// "pose 1, ~one beat after settle" — worker contention skewing that phase is the whole
// logo-light red set, including the "6/6 deterministic" re-mint onto the moving target.
//
// The cure (`emulateMedia`, the route that provably lands) shipped at T6.2. The DEFECT this
// spec exists for is the other half: that measurement lived in a comment for 22 days
// (`b4d7aedf9`, 2026-07-11) and the golden family re-derived it from scratch — a finding held
// in prose propagates to nobody, and nothing anywhere would have told us the day upstream
// FIXED it. Both outcomes then look identical from the outside: green.
//
// So the deliberately-dead declarations stay (visual-golden.spec.ts, playwright-golden.config.ts
// — they are the declared contract and they harden the day the runner honours them), and this
// spec pins today's upstream truth around them. It reds on a Playwright bump that makes the
// fixture route work. THAT RED IS THE POINT — it is not a regression, it is the notice:
//   1. re-audition every `emulateMedia` workaround (they stay correct, but the belt-and-braces
//      `use` blocks now double-apply — harmless, and worth saying out loud),
//   2. re-read the golden baselines' provenance under a route that now freezes twice,
//   3. update the version in VOID_AT and the comments citing 1.61.1, in the same commit.
// scripts/check-motion-contract.mjs check 3 is the enforcement half: it reds any spec that
// claims `PRM: frozen` while its only route is the one auditioned dead here.
//
// One correction to the T6.2 diagnosis falls out of the arms below, measured in BOTH engines:
// `test.use({ contextOptions: { reducedMotion } })` DOES land. The runner isn't dropping
// context options generally — the dedicated option is the one that never reaches
// `browser.newContext`. Nothing needs changing (`emulateMedia` ships and the goldens are
// minted under it), but the estate now knows a fixture-level route exists, and this file is
// where that knowledge is executable rather than remembered.

const PRM = "(prefers-reduced-motion: reduce)";

/** The version whose behaviour every assertion below is pinned to. */
const VOID_AT = "1.61.1";

/** What the page itself says — the only authority. Read on about:blank on purpose: motion
 *  emulation is a context property, so the audition needs no app, no dev server, and no share
 *  of the contention it exists to explain. */
const pageReadsPRM = (page: Page) => page.evaluate((q) => matchMedia(q).matches, PRM);

const E2E = dirname(fileURLToPath(import.meta.url));

test.describe("PRM route audition @playwright/test " + VOID_AT, () => {
  test.describe("the fixture route — test.use({ reducedMotion })", () => {
    test.use({ reducedMotion: "reduce" });

    test("VOID: the declared option never reaches the page", async ({ page }) => {
      await page.goto("about:blank");

      expect(
        await pageReadsPRM(page),
        `test.use({ reducedMotion: 'reduce' }) LANDED. Upstream fixed the fixture route — ` +
          `this red is the notice, not a regression. Follow the three steps in this file's ` +
          `head, then re-pin VOID_AT (currently ${VOID_AT}).`,
      ).toBe(false);

      // Vacuity guard, same page, same probe: if the probe itself were broken, `false` above
      // would be meaningless. The route the estate actually ships must read true right here.
      await page.emulateMedia({ reducedMotion: "reduce" });
      expect(
        await pageReadsPRM(page),
        "emulateMedia({ reducedMotion: 'reduce' }) did NOT land — the route every frozen " +
          "spec and every golden depends on is gone. This is the serious red.",
      ).toBe(true);
    });
  });

  test.describe("the nested fixture route — test.use({ contextOptions })", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("LANDS: the void is the dedicated option, not the fixture plumbing", async ({
      page,
    }) => {
      // Measured here for the first time (T7-W3, both engines): the SAME option nested under
      // `contextOptions` reaches the page. So the T6.2 diagnosis needs one correction — the
      // runner does not drop context options wholesale; the DEDICATED `reducedMotion` test
      // option specifically fails to reach `browser.newContext`, while the raw bag passes
      // straight through. That localizes the defect, and it is the second vacuity control:
      // a fixture route CAN deliver PRM, so the arm above reading false is about that option,
      // not about fixtures or about `about:blank`.
      await page.goto("about:blank");
      expect(
        await pageReadsPRM(page),
        `test.use({ contextOptions: { reducedMotion } }) stopped landing at ${VOID_AT}. The ` +
          `localization above is void — re-measure before trusting the first arm's false.`,
      ).toBe(true);
    });
  });

  test("CONTROL: the same option through browser.newContext() DOES land", async ({
    browser,
  }) => {
    // The asymmetry is the whole finding — the option is honoured by the browser and lost by
    // the runner's fixture plumbing. Without this arm the two VOIDs above could just as well
    // mean "PRM is unsupported here", and the trap would be pinning the wrong fact.
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("about:blank");
    expect(
      await pageReadsPRM(page),
      "browser.newContext({ reducedMotion: 'reduce' }) stopped landing. The measured " +
        "asymmetry this trap is built on is gone; re-derive it before trusting either VOID.",
    ).toBe(true);
    await context.close();
  });

  test("the dead declarations are still on disk to be auditioned", async () => {
    // A trap whose referents were quietly deleted asserts nothing. These two files keep the
    // void form ON PURPOSE (visual-golden.spec.ts:52-56 says so); if a cleanup sweep removes
    // them, this spec stops describing the estate and has to be re-scoped in the same commit.
    const golden = readFileSync(join(E2E, "visual-golden.spec.ts"), "utf8");
    expect(golden, "visual-golden.spec.ts dropped its deliberately-dead test.use").toMatch(
      /test\.use\(\s*\{[\s\S]{0,400}?reducedMotion/,
    );

    const config = readFileSync(join(E2E, "..", "playwright-golden.config.ts"), "utf8");
    expect(config, "playwright-golden.config.ts dropped its declared reducedMotion").toMatch(
      /use:\s*\{[\s\S]{0,800}?reducedMotion/,
    );
  });
});
