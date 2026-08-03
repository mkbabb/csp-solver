import { expect, type Locator } from '@playwright/test';

/**
 * committed-press.ts — A PRESS IS NOT LANDED UNTIL ITS EFFECT IS COMMITTED (T7-W3 §9).
 *
 * WHAT THIS GUARANTEES. `pressCommitted(trigger, committed)` returns only once the press's own
 * asserted effect is true on the page. It does not guarantee that exactly one press was sent,
 * and callers must not depend on that: it guarantees the effect.
 *
 * WHY IT HAS TO EXIST — the mechanism, measured, not narrated
 * (`evidence/w3/futoshiki-coldchunk-forensics.txt`; CI run 30799424855 shard 1 is where it
 * surfaced, as a wandering futoshiki row that read like a timeout and was neither contention
 * nor a cold chunk):
 *
 * WebKit synthesizes a `click` only from a PAIRED mousedown/mouseup. Two of this estate's
 * surfaces TEAR OUT the subtree under the pointer when their raster bake lands — the whole
 * live pose stack is removed from the document and baked `<image>` siblings take its place:
 *
 *     HandwrittenLogo.vue:392   v-for="(pid, f) in logoBaked ? [] : logoPoseIds"
 *     DarkModeToggle.vue:212    v-for="(sparkles, i) in sunBaked ? [] : SPARKLE_POSES"
 *     DarkModeToggle.vue:287    v-for="(stars, i) in moonBaked ? [] : STAR_POSES_D"
 *
 * A press that straddles that swap loses the half whose target was torn out, WebKit
 * synthesizes nothing, and the handler never runs — silently, with the app alive and no
 * console error. Measured on darwin WebKit: 2 of 30 unaided presses on the wordmark produced
 * no `click` event at all; the retry arm re-measured the same defect from the other side at 4
 * of 30 first presses dropped. Chromium dropped 0 of 25.
 *
 * AND IT IS NOT A ONE-SHOT WINDOW. `retainedPoseUrls` drops the retained poses whenever its
 * reset key changes — `${label}-${vbWidth}` for the wordmark — so a label swap or a post-font
 * re-measure sends a baked surface BACK to the live arm and bakes again. Any press on a
 * re-bakeable surface is exposed for as long as the surface can re-bake, which is why the cure
 * polls the committed effect rather than waiting out a bake once.
 *
 * THE CRITERION FOR USING THIS, and it is structural rather than a matter of taste: convert a
 * press iff a TEAR-OUT can occur under its pointer — the `v-for="…Baked ? [] : POSES"` shape
 * above. Estate-wide census (2026-08-03): exactly the three sites listed, in two components.
 * `HandDrawnGrid.vue` and `HandDrawnOutline.vue` bake too and are NOT in the family — they
 * keep the live stack MOUNTED and hide it (`baked-hidden`, `display:none`), which is the
 * estate's own immune grammar and the shape the product-side cure should take. A press on a
 * plain control that never re-renders under the pointer stays a plain `.click()`; wrapping it
 * would buy nothing and would hide a real defect behind a retry.
 *
 * WHY A RE-PRESS IS SAFE, per call site rather than in general: every consumer today presses a
 * control whose handler is idempotent against its own committed state (`openGallery()` returns
 * early on `view === 'gallery'`). A caller whose trigger is NOT idempotent must not use this
 * helper — poll a probe that is true after the first commit, or fix the trigger.
 *
 * THE CALLER'S ONE OBLIGATION: `committed` MUST BE FALSE BEFORE THE PRESS. It is the effect
 * this press causes, never a state the page can already be carrying. This is not a style note —
 * it was a real defect in this helper's first cut, caught by `gallery-deal.spec.ts:699` going
 * 4/4 red under ablation. That row re-opens the deck after a cancel and probed `.staging-band`;
 * measured immediately after `expect('.game-gallery').toBeHidden()` PASSED, the band still read
 * `visible` (the deck is mid-leave — `.game-gallery` hits a hidden state while its descendant
 * band still has a box). The helper's then-existing "already committed, nothing to do" fast path
 * therefore returned having sent ZERO presses, the deck never re-opened, and the row correctly
 * observed the stale chips it exists to forbid. The fast path is gone: this helper ALWAYS sends
 * at least one press unless the trigger is already inert. A probe that can be stale-true is
 * still the caller's bug to avoid, and the fix is to probe a state the previous commit cleared —
 * `gallery-deal` now reads `?view=gallery` off the URL, which `openGallery`/`cancel` write and
 * delete, rather than a node that outlives its own transition.
 *
 * NO FIXED WAITS ANYWHERE (check-sleep-lint.mjs): every wait here is a retrying Playwright
 * wait or `expect.poll`, which the lint names as the cure rather than the disease.
 */

/** One press's own beat: the wordmark's is MOTION.chromeLeaveMs 200ms + the deck's mount +
 *  paint, measured at 231–313ms on darwin and ~5.9s end-to-end on the CI runner. 4s is an
 *  order over the measured beat and an order under the 20s budget. */
export const PRESS_BEAT_MS = 4000;

/** The whole press, every attempt included. Past this it is no longer the dropped-press race
 *  and the failure should be read as a real defect, which is what the throw says. */
export const PRESS_BUDGET_MS = 20000;

/**
 * The press's committed effect. A `Locator` reads as "this is visible"; a predicate is for
 * effects that aren't a visible node (a URL param, a storage row, a count).
 */
export type Committed = Locator | (() => Promise<boolean>);

/** Retrying, never sleeping. `false` means "not within this beat", not "never". */
async function committedWithin(c: Committed, timeout: number): Promise<boolean> {
  try {
    if (typeof c === 'function') await expect.poll(c, { timeout }).toBe(true);
    else await c.waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false; // the caller owns the decision to press again or to give up on the budget
  }
}

/**
 * Press `trigger` until `committed` is true. Returns the number of presses actually sent, so a
 * caller (or a forensics run) can measure the drop rate instead of assuming it.
 *
 * `what` names the effect in the failure message — write it as the thing that should have
 * happened ("the gallery deck"), because that is what the reader of a red needs.
 */
export async function pressCommitted(
  trigger: Locator,
  committed: Committed,
  opts: { beatMs?: number; budgetMs?: number; what?: string } = {},
): Promise<number> {
  const beatMs = opts.beatMs ?? PRESS_BEAT_MS;
  const budgetMs = opts.budgetMs ?? PRESS_BUDGET_MS;
  const what = opts.what ?? 'the press';
  const deadline = Date.now() + budgetMs;
  let presses = 0;

  for (;;) {
    // NO "already committed" FAST PATH — see the caller's obligation above. A probe that is
    // stale-true from a previous commit would make this helper skip the press it exists to send.

    // The trigger can VANISH on success — the wordmark goes inert (`<span>`, not `<button>`)
    // once the deck commits, so `button.logo-trigger` stops resolving. That is the arm which
    // tells a LATE commit from a dropped press: pressing here would press a control that no
    // longer exists and hang out the whole budget on an actionability wait.
    if ((await trigger.count()) === 0) {
      if (await committedWithin(committed, beatMs)) return presses;
      throw new Error(
        `${what}: the trigger went inert but nothing committed within ${beatMs}ms — the press ` +
          `landed on something, and it was not the effect this site asserts`,
      );
    }

    await trigger.click({ timeout: beatMs });
    presses++;
    if (await committedWithin(committed, beatMs)) return presses;

    if (Date.now() > deadline)
      throw new Error(
        `${what}: nothing committed after ${presses} press(es) in ${budgetMs}ms — that is no ` +
          `longer the dropped-press race this budget covers (T7-W3 §9); read it as a real defect`,
      );
  }
}
