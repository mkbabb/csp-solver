import { test, expect, type Page } from "@playwright/test";

// PRM: live, because the keypad rows drive the drawer's real glide and the app's own scroll-clear
//   before reading where anything came to rest; the platform reads (overscroll, callout,
//   safe-area, text-size-adjust) are computed styles the beat never touches.

// T4-WM §1/§5 — the iOS platform-discipline + landscape/iPad geometry probes (lane C). Three
// gate rows live here, all born-RED at HEAD (zero visualViewport references; no overscroll /
// touch-callout / user-select / viewport-fit in src — crit-mobile grep-confirmed):
//   · ios-discipline  — overscroll-behavior, the game-surface callout/user-select/touch-action
//                       suppression, the (preflight-delivered) tap-highlight + text-size-adjust,
//                       viewport-fit=cover, and the toggle's env() safe-area padding.
//   · keyboard-avoid  — with an EMULATED visualViewport (a real keyboard is un-raisable headless),
//                       a focused board cell is scrolled clear of the keyboard band, never eclipsed.
//   · landscape-ipad  — landscape phone + iPad portrait carry no horizontal overflow and take
//                       entry; the large-iPad desktop-drawer layout keeps a ≥44px drawer tap target.
//
// Touch emulation: hasTouch + isMobile makes BOTH engines match `(pointer: coarse)` — the media
// the coarse branch keys on. THE ENGINE IS NOT PINNED HERE (T5-W1 1.10 / CH-56): the old file-scope
// `browserName: "chromium"` existed because the then chromium-only CI lane installed no webkit. It
// installs webkit now, the engine comes from the PROJECT, and both of playwright.config.ts's
// projects claim this file. Each describe still overrides only viewport/hasTouch/isMobile — the
// per-device geometry, free to vary within a worker (browserName is worker-scoped, which is why a
// describe-level engine override is rejected outright; there is no longer one to reject).
//
// WHAT WEBKIT REPORTS DIFFERENTLY — measured at @playwright/test 1.61.1, banked in
// evidence/w1/pw-residue.txt §2, and handled at the two assertion sites that read it:
//   · `getComputedStyle(el).userSelect` is "" in WebKit while `-webkit-user-select` is "none"
//     (Chromium reports both) — the ios-discipline selection row reads the effective value.
//   · `-webkit-text-size-adjust` has NO computed value in WebKit at all (""), because it is an
//     iOS-WebKit property and Playwright's WebKit is desktop Safari plus mobile EMULATION, not
//     iOS. The tap-highlight row asserts the AUTHORED preflight declaration in both engines and
//     the computed value only where an engine exposes one.
// Neither is a product difference; both are the engine's own reporting surface. The limits that
// are real API gaps (`mouse.wheel` under mobile WebKit, `maxTouchPoints`) are unreached here.

async function hideDevChrome(page: Page) {
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
}

/** Every byte of CSS the document actually loaded: the <style> tags vite dev injects plus any
 *  linked stylesheets (prod). Two rows below assert over AUTHORSHIP rather than computed style,
 *  because the properties they guard are ones NEITHER engine exposes to the CSSOM — measured:
 *  `CSS.supports('-webkit-touch-callout','none')` is false in Chromium AND in Playwright's
 *  WebKit, and `-webkit-text-size-adjust` is false in WebKit. Authorship is what the preflight
 *  and the game-surface rule actually control; the device smoke owns the taken-effect claim. */
async function loadedCss(page: Page): Promise<string> {
  return page.evaluate(async () => {
    const texts: string[] = [];
    for (const s of Array.from(document.querySelectorAll("style")))
      texts.push(s.textContent ?? "");
    for (const l of Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
    )) {
      try {
        texts.push(await (await fetch(l.href)).text());
      } catch {
        /* cross-origin — skip */
      }
    }
    return texts.join("\n");
  });
}

/** Sudoku is the eager/default game (no lazy-chunk waterfall, no futoshiki §4 bake dependency). */
async function loadSudoku(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
  await hideDevChrome(page);
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 15000 })
    .toBeGreaterThan(0);
  // The board's settle: `.is-active` on the boil frame layer exists once the grid drew in.
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 15000,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ios-discipline — the deliberate platform CSS, on a real coarse (iPhone-ish) device.
// ─────────────────────────────────────────────────────────────────────────────
test.describe("ios-discipline (iPhone-geometry coarse)", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });

  test("the board scene contains overscroll (no rubber-band / scroll-chain)", async ({
    page,
  }) => {
    await loadSudoku(page);
    // The app is an h-screen scene with no inner scroll container → <html> is the scroller.
    const behavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).overscrollBehaviorY,
    );
    expect(behavior).toBe("contain"); // born-RED: 'auto'
  });

  test("game surfaces suppress selection + the double-tap-zoom delay (long-press-clean)", async ({
    page,
  }) => {
    await loadSudoku(page);
    const surface = await page.evaluate(() => {
      const cells = document.querySelector(".board-cells")!;
      const cell = document.querySelector(".sudoku-cell")!; // inherits user-select from .board-cells
      // Selection control has two spellings and the engines expose different ones: Chromium
      // knows both, Playwright's WebKit knows ONLY `-webkit-user-select`
      // (`CSS.supports('user-select','none')` is false there, so the unprefixed computed value
      // is absent — measured, evidence/w1/pw-residue.txt §2). Read the effective value across
      // spellings: the assertion is about the SUPPRESSION, not about which spelling an engine
      // chose to publish. It still bites when the rule dies — an element outside `.board-cells`
      // reads 'auto' in Chromium and 'text' in WebKit, never 'none' (ablation, §2).
      const userSelect = (el: Element) => {
        const cs = getComputedStyle(el);
        return (
          cs.getPropertyValue("user-select") || cs.getPropertyValue("-webkit-user-select")
        );
      };
      return {
        touchAction: getComputedStyle(cells).touchAction,
        userSelectContainer: userSelect(cells),
        userSelectCell: userSelect(cell),
      };
    });
    expect(surface.touchAction).toBe("manipulation"); // born-RED: 'auto'
    expect(surface.userSelectContainer).toBe("none"); // born-RED: unsuppressed reads auto/text
    expect(surface.userSelectCell).toBe("none"); // inherited onto the cell

    // -webkit-touch-callout is iOS-WebKit-only: NEITHER engine here parses it into the CSSOM
    // (`CSS.supports('-webkit-touch-callout','none')` is false in Chromium AND in Playwright's
    // WebKit — the latter is desktop Safari plus mobile emulation, not iOS). So prove it is
    // AUTHORED on the game surface by reading the RAW loaded CSS. The callout suppression is
    // what keeps the iOS long-press loupe away from lane E's peek hold (device-verified in the
    // owner smoke; user-select:none above is the load-bearing, computable half).
    // The .board-cells rule authoring `-webkit-touch-callout: none` (dev-expanded or minified).
    const calloutAuthored = /\.board-cells\b[^{}]*\{[^}]*-webkit-touch-callout\s*:\s*none/.test(
      await loadedCss(page),
    );
    expect(calloutAuthored).toBe(true); // born-RED: no -webkit-touch-callout anywhere in src
  });

  test("tap-highlight + text-size-adjust are delivered (preflight) app-wide", async ({
    page,
  }) => {
    await loadSudoku(page);
    const probe = await page.evaluate(() => {
      const btn = document.querySelector(".sun-moon-toggle")!; // a real interactive
      return {
        tapHighlight: getComputedStyle(btn).getPropertyValue(
          "-webkit-tap-highlight-color",
        ),
        textSizeAdjust: getComputedStyle(document.documentElement).getPropertyValue(
          "-webkit-text-size-adjust",
        ),
        // Asked of the engine, not guessed from the platform: does it parse the property at all?
        knowsTextSizeAdjust: CSS.supports("-webkit-text-size-adjust", "100%"),
      };
    });
    // Transparent = 'rgba(0, 0, 0, 0)' (inherited from the html preflight rule). Both engines
    // expose this one.
    expect(probe.tapHighlight.replace(/\s+/g, "")).toBe("rgba(0,0,0,0)");

    // `-webkit-text-size-adjust` is iOS-WebKit's. Playwright's WebKit is desktop Safari plus
    // mobile emulation, so it does not know the property and publishes no computed value ("");
    // Chromium knows it and reports the inherited "100%". The preflight controls DELIVERY, so
    // the load-bearing assertion is over the AUTHORED declaration — it bites in both engines,
    // and it is the same instrument the callout row above uses for the same reason. The
    // computed read stays as an exact second assertion keyed to the engine's own answer: no
    // fallback, no skip, both arms fail if either engine changes what it publishes.
    const adjustAuthored =
      /(?:^|[\s,{}])(?:html|:host)\b[^{}]*\{[^}]*-webkit-text-size-adjust\s*:\s*100%/.test(
        await loadedCss(page),
      );
    expect(adjustAuthored).toBe(true); // born-RED: the preflight rule deleted
    expect(probe.textSizeAdjust).toBe(probe.knowsTextSizeAdjust ? "100%" : "");
  });

  test("viewport opts into the notch + the fixed toggle pads clear of the safe area", async ({
    page,
  }) => {
    await loadSudoku(page);
    const meta = await page.getAttribute('meta[name="viewport"]', "content");
    expect(meta).toContain("viewport-fit=cover"); // born-RED: absent
    expect(meta).not.toContain("maximum-scale"); // pinch-zoom preserved (WCAG 1.4.4)

    // env() resolves to 0 on non-notched Chromium, so prove the safe-area clearance is AUTHORED
    // (its real clearance is an owner-device smoke row).
    //
    // T8-W7 (M17) — WHERE it is authored moved, and the assertion follows it up rather than
    // down. The top inset used to be `padding-top` on `.corner-right` alone: one corner paid the
    // notch and the other did not, which is a broken line on exactly the hardware that reserves
    // the corner. It is now a term inside `--head-rule` on `.page-root`, and BOTH head corners
    // hang from that one rule — so the row asks for all three facts, and reds if any of them
    // goes: the term, and each corner's consumption of it.
    const authored = await page.evaluate(() => {
      const found = {
        headRuleHasInset: false,
        rightConsumes: false,
        leftConsumes: false,
        rightPadsSide: false,
        leftPadsSide: false,
      };
      const visit = (rules: CSSRuleList) => {
        for (const rule of Array.from(rules)) {
          if (rule instanceof CSSMediaRule) {
            visit(rule.cssRules);
            continue;
          }
          if (!(rule instanceof CSSStyleRule)) continue;
          const sel = rule.selectorText;
          const headRule = rule.style.getPropertyValue('--head-rule');
          if (sel.includes('.page-root') && headRule.includes('safe-area-inset-top'))
            found.headRuleHasInset = true;
          if (sel.includes('.corner-right')) {
            if (rule.style.top.includes('--head-rule')) found.rightConsumes = true;
            if (rule.style.paddingRight.includes('safe-area-inset')) found.rightPadsSide = true;
          }
          if (sel.includes('.corner-left') || sel.includes('.mobile-attribution')) {
            if (rule.style.top.includes('--head-rule')) found.leftConsumes = true;
            if (rule.style.paddingLeft.includes('safe-area-inset')) found.leftPadsSide = true;
          }
        }
      };
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          visit(sheet.cssRules);
        } catch {
          continue;
        }
      }
      return found;
    });
    // born-RED, each arm: drop the env() term from the rule, or stop either corner reading it.
    expect(authored).toEqual({
      headRuleHasInset: true,
      rightConsumes: true,
      leftConsumes: true,
      rightPadsSide: true,
      leftPadsSide: true,
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// keyboard-avoid — an EMULATED visualViewport (installed before app scripts) lets us shrink the
// visual viewport the way the OS keyboard does. The focused cell must ride clear of the band.
// ─────────────────────────────────────────────────────────────────────────────
/** Replace visualViewport with a controllable fake BEFORE any app script reads it. Nothing else
 *  in the app (or pencil-boil) consumes visualViewport — grep-verified — so this is inert
 *  elsewhere. window.__setVV(height, offsetTop) shrinks the band + dispatches the resize the
 *  composable listens for, exactly as the OS keyboard would. */
type VVWindow = { __setVV: (h: number, ot?: number) => void };
async function installFakeVisualViewport(page: Page) {
  await page.addInitScript(() => {
    const fake = new EventTarget();
    let h = window.innerHeight;
    let ot = 0;
    Object.defineProperties(fake, {
      height: { get: () => h, configurable: true },
      width: { get: () => window.innerWidth, configurable: true },
      offsetTop: { get: () => ot, configurable: true },
      offsetLeft: { get: () => 0, configurable: true },
      pageTop: { get: () => ot, configurable: true },
      pageLeft: { get: () => 0, configurable: true },
      scale: { get: () => 1, configurable: true },
    });
    Object.defineProperty(window, "visualViewport", {
      get: () => fake,
      configurable: true,
    });
    (window as unknown as VVWindow).__setVV = (nh, no) => {
      h = nh;
      ot = no ?? 0;
      fake.dispatchEvent(new Event("resize"));
    };
  });
}

test.describe("keyboard-avoid (emulated visualViewport)", () => {
  test.use({
    viewport: { width: 390, height: 640 },
    hasTouch: true,
    isMobile: true,
  });

  test("a focused below-fold cell scrolls clear of the emulated keyboard band", async ({
    page,
  }) => {
    await installFakeVisualViewport(page);

    await loadSudoku(page); // 9×9

    const inputs = page.locator(".board-cells input");
    const last = inputs.nth((await inputs.count()) - 1); // bottom-right cell

    // Focus it while the band is still full (no keyboard) — the composable is a no-op here, so the
    // cell stays at its natural spot: the RED state. The band edge is derived FROM the measured
    // cell (mid-cell, clamped to the viewport) rather than a layout-dependent constant — a fixed
    // 360 rode the incidental page height and broke when W7's margin content lifted the board
    // ~20px on the linux runner. Deriving it guarantees the eclipse precondition on any layout.
    await last.tap();
    const beforeBox = (await last.boundingBox())!;
    const KEYBOARD_TOP = Math.min(
      Math.round(beforeBox.y + beforeBox.height / 2), // band edge eclipses the cell's lower half
      620, // never taller than the 640 viewport minus a sane band
    );
    expect(beforeBox.y + beforeBox.height).toBeGreaterThan(KEYBOARD_TOP);

    // Raise the keyboard: shrink the visual viewport + fire resize. The composable must scroll the
    // focused cell up so its bottom clears the band edge.
    await page.evaluate((top) => {
      (window as unknown as { __setVV: (h: number, ot?: number) => void }).__setVV(
        top,
        0,
      );
    }, KEYBOARD_TOP);

    await expect
      .poll(
        async () => {
          const b = (await last.boundingBox())!;
          return b.y + b.height;
        },
        { timeout: 5000 },
      )
      .toBeLessThanOrEqual(KEYBOARD_TOP + 2); // never eclipsed
  });

  /**
   * T6.2 MARK B — THE FOLD STOPS FEEDING BACK. The owner's report: a fast scroll to the bottom
   * of a phone makes the board bounce under the controls. Instrumented on the built dist at
   * 390×844 by rAF-sampling the published vars and the board's rect through a scripted
   * momentum ramp, and the mechanism is one publisher and one consumer:
   *
   *   `publishInset` wrote `--keyboard-inset` on EVERY `visualViewport` resize/scroll, and its
   *   input — `layoutHeight − (vv.height + vv.offsetTop)` — is nonzero for every reason a mobile
   *   engine moves that viewport, a collapsing URL bar chief among them. Its one consumer is a
   *   LAYOUT property (App.vue's `.board-group { padding-bottom }`) sitting under mark 9's
   *   `margin-block: auto` centring, so the auto margins HALVED each phantom band into a board
   *   translation: a 60px ramp moved the board 223.64 → 193.64 and back, 30px each way, twice
   *   per flick, both engines. (`--fold-bottom` was the suspect and is exonerated: it never
   *   republished through the ramp — a ResizeObserver watches the CONTENT box, so a padding
   *   growth never fired it — which made it stale rather than noisy. It is deleted with mark A.)
   *
   * The cure is at the publisher: no focused input, no keyboard, no band. This row drives the
   * ramp with nothing focused and asserts BOTH halves — the band stays 0 and the board does not
   * move — and its control proves the consumer is still live, so a cure that merely severed the
   * layout arm could not pass here either.
   */
  test("a viewport wobble with nothing focused publishes no band, and the board holds still", async ({
    page,
  }) => {
    await installFakeVisualViewport(page);
    await loadSudoku(page);

    const ramp = () =>
      page.evaluate(async () => {
        const H = window.innerHeight;
        const tops: number[] = [];
        const bands = new Set<string>();
        // The shape of one fast flick: the URL bar collapses, holds, and comes back.
        for (const band of [0, 12, 28, 46, 60, 60, 60, 44, 26, 10, 0]) {
          (window as unknown as VVWindow).__setVV(H - band, 0);
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          tops.push(
            +document.querySelector(".board-cells")!.getBoundingClientRect().top.toFixed(2),
          );
          bands.add(
            getComputedStyle(document.documentElement)
              .getPropertyValue("--keyboard-inset")
              .trim(),
          );
        }
        (window as unknown as VVWindow).__setVV(H, 0);
        return {
          span: +(Math.max(...tops) - Math.min(...tops)).toFixed(2),
          bands: [...bands],
        };
      });

    const r = await ramp();
    expect(r.bands).toEqual(["0px"]); // no phantom keyboard, at any point on the ramp
    expect(r.span).toBeLessThanOrEqual(0.5); // and the board never moved (head: 30.00)

    // CONTROL — the consumer is live and the probe can see it. Write the band by hand, exactly
    // as the ungated publisher did, and the same board must jump by half of it.
    const moved = await page.evaluate(() => {
      const cells = document.querySelector(".board-cells")!;
      const before = cells.getBoundingClientRect().top;
      document.documentElement.style.setProperty("--keyboard-inset", "60px");
      void document.body.offsetHeight;
      const after = cells.getBoundingClientRect().top;
      document.documentElement.style.setProperty("--keyboard-inset", "0px");
      return +(before - after).toFixed(2);
    });
    expect(moved).toBeGreaterThan(20);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// THE 296px KEYPAD BAND — the F3 charter's own measured constant (pass 2 measured 296 on a
// booted device against the 336 pass 1 had assumed). Pass 3 routed it to the owner because the
// SIM's soft keypad would not rise; the keypad is not the mechanism. `useKeyboardViewport`
// publishes the occlusion height as `--keyboard-inset` and the stacked scene spends it as
// bottom scroll-room (App.vue), so the band is drivable at its measured size through the fake
// visual viewport, composable and all. Lane B's G4 charge — the commit verb 8.9px under the
// keypad at max scroll — was a property of a FIXED tray; this tree's panel is in flow.
// ─────────────────────────────────────────────────────────────────────────────
test.describe("the 296px keypad band (measured constant, driven through the composable)", () => {
  test.use({ viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true });

  /**
   * T5-W4 PASS 6 — THE METRIC MOVES, AND IT MOVES BECAUSE THE MECHANISM DID.
   *
   * Pass 4 measured this band as a SCROLL question: the controls card was in flow, the
   * composable spent `--keyboard-inset` as bottom scroll-room, and the gate asked whether every
   * control could be SCROLLED clear of the keypad. On the portrait dock the card is no longer in
   * flow — it is a `position: fixed` sheet anchored on `top: var(--vv-height)`, and the page does
   * not scroll at all (`pageVh 1.000`, `board-covisibility.spec.ts`). A doc-growth assertion on
   * this tree would measure a mechanism that no longer exists and pass on any tree at all.
   *
   * So the metric becomes the honest one: **every control seats clear of the 296px band at
   * `scrollY 0`** — no scroll, because the sheet rides the keyboard's own edge. That is the
   * charter's iOS idiom doing precisely the work it was banked for.
   *
   * The RED arm is the ablation the charter named: restore `bottom: 0` in place of the anchor
   * — the shape every naive fixed sheet has — and the deepest chip strands under the band with
   * no scroll available to redeem it, because there is no scroll.
   */
  test("with the keypad up, every control seats clear of the band at scrollY 0", async ({
    page,
  }) => {
    const BAND = 296;
    await installFakeVisualViewport(page);
    await loadSudoku(page);
    // `.click()`, not `.tap()`, and the reason is the harness rather than the product: this
    // row replaces `window.visualViewport` with a fake before load, and Playwright's touch
    // path converts its point through that object — the tongue's box (616–664 at this cell,
    // measured) is inside the viewport, but the emulated tap resolves "outside of the
    // viewport" against the stand-in. The tongue's own touch target is gated where it belongs,
    // on the real object: `drawer.spec.ts`'s portrait row taps it and reads 92×48.
    await page.locator(".drawer-tab").click();
    await expect(page.locator("#controls-drawer .drawer-case")).toBeVisible();
    await page.waitForTimeout(700);

    // T6.2 mark B — THE PREMISE IS DRIVEN, not assumed. `--keyboard-inset` is gated on a focused
    // input now (`useKeyboardViewport`: a band published with nothing focused was a phantom
    // keyboard, and its layout consumer turned every momentum-scroll wobble into a board
    // bounce), so a keypad row has to put a cell in focus before it raises a keypad. That is
    // what a real keypad IS. `.focus()` rather than a tap: the sheet is open over the board and
    // the row is about the band, not about reaching a covered cell.
    await page.locator(".board-cells input").first().focus();
    await page.evaluate((b) => (window as unknown as VVWindow).__setVV(664 - b), BAND);
    // BOTH vars publish from the one handler — the trigger's own ordering, gated.
    await expect
      .poll(() =>
        page.evaluate(() => {
          const cs = getComputedStyle(document.documentElement);
          return [
            cs.getPropertyValue("--keyboard-inset").trim(),
            cs.getPropertyValue("--vv-height").trim(),
          ].join(" ");
        }),
      )
      .toBe(`${BAND}px ${664 - BAND}px`);

    /** The lowest painted instance of `sel`, and whether it is clear of the band — at scrollY 0.
     *  `deep` scrolls the sheet's own scrollport to its end first: the dock is designed around
     *  an interior scroll (`scene.css:230`, priced there), so a control below that fold is
     *  reached by the gesture the design owns, not stranded under a keyboard. */
    const seat = (sel: string, deep = false) =>
      page.evaluate(
        ({ sel, band, deep }) => {
          const doc = document.scrollingElement || document.documentElement;
          doc.scrollTop = 0;
          const port = document.querySelector(
            "#controls-drawer .controls-card",
          ) as HTMLElement | null;
          if (port) port.scrollTop = deep ? port.scrollHeight : 0;
          void document.body.offsetHeight;
          const all = [...document.querySelectorAll(sel)].filter(
            (el) => el.getClientRects().length > 0,
          );
          const el = all[all.length - 1] as HTMLElement | undefined;
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const p = port?.getBoundingClientRect();
          return {
            top: +r.top.toFixed(2),
            bottom: +r.bottom.toFixed(2),
            bandEdge: window.innerHeight - band,
            scrollTop: doc.scrollTop,
            portBottom: p ? +p.bottom.toFixed(2) : null,
          };
        },
        { sel, band: BAND, deep },
      );

    const verb = await seat("#controls-drawer .deal-btn");
    expect(verb!.scrollTop).toBe(0);
    expect(verb!.top).toBeGreaterThanOrEqual(0);
    expect(verb!.bottom).toBeLessThanOrEqual(verb!.bandEdge);

    // T6 — THE READ IS SCROLL-AWARE, because the mechanism always was. The card is a scrollport
    // on this dock and it overflowed at head too (~55px, priced in `scene.css`'s own comment);
    // the row simply never scrolled it, so the deepest chip's rect happened to land above the
    // band and the assertion passed on an accident. T6's receipt row and bigger verbs take the
    // overflow to ~134 and the accident ends. What the anchor actually guarantees, and what is
    // asserted here: the SCROLLPORT's bottom rides the keyboard's edge, and the deepest control
    // seats inside it once the interior scroll is spent. Neither survives the ablation below.
    const deepest = await seat("#controls-drawer .ctrl-btn", true);
    expect(deepest!.scrollTop).toBe(0);
    expect(deepest!.portBottom).toBeLessThanOrEqual(deepest!.bandEdge);
    expect(deepest!.top).toBeGreaterThanOrEqual(0);
    expect(deepest!.bottom).toBeLessThanOrEqual(deepest!.bandEdge);

    // CONTROL — the ablation the charter banked: `bottom: 0` instead of the `--vv-height`
    // anchor. The sheet stops tracking the keyboard's edge, so the SCROLLPORT itself strands
    // under the band and no amount of interior scroll can redeem a chip inside it. Without this
    // arm the row above would pass on any tree whose sheet happens to be short.
    await page.addStyleTag({
      content:
        "#controls-drawer { top: auto !important; bottom: 0 !important; translate: none !important; }",
    });
    // POLLED, NOT SLEPT (T7-W3, the sleep-lint residue). Re-anchoring the sheet re-lays it and
    // re-runs the interior scroll `seat()` drives; the old fixed 200ms let a mid-relayout box
    // reach a non-retrying `expect`, so the ablation arm — the thing that proves the row above
    // can fail — was itself timing-dependent. The verdict retries and carries its figures.
    await expect
      .poll(
        async () => {
          const s = await seat("#controls-drawer .ctrl-btn", true);
          return {
            portStranded: s !== null && s.portBottom !== null && s.portBottom > s.bandEdge,
            chipStranded: s !== null && s.bottom > s.bandEdge,
            measured: s
              ? `portBottom=${s.portBottom} bottom=${s.bottom} bandEdge=${s.bandEdge}`
              : "no painted .ctrl-btn",
          };
        },
        {
          timeout: 6000,
          message:
            "with `bottom: 0` in place of the `--vv-height` anchor the scrollport itself must " +
            "strand under the keyboard band, and the deepest chip with it — without this arm " +
            "the row above passes on any tree whose sheet happens to be short",
        },
      )
      .toMatchObject({ portStranded: true, chipStranded: true });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// landscape-ipad — §5 geometry probes: no horizontal overflow, entry works, drawer tap target.
// ─────────────────────────────────────────────────────────────────────────────
async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const el = document.documentElement;
    return { scrollW: el.scrollWidth, clientW: el.clientWidth };
  });
  expect(overflow.scrollW).toBeLessThanOrEqual(overflow.clientW + 2); // 2px sub-pixel tolerance
}

async function assertEntryWorks(page: Page) {
  const inputs = page.locator(".board-cells input");
  const blankIdx = await page.evaluate(() => {
    const cells = document.querySelectorAll(".sudoku-cell");
    for (let i = 0; i < cells.length; i++)
      if (!cells[i].querySelector(".glyph-svg")) return i;
    return 0;
  });
  const cell = inputs.nth(blankIdx);
  await cell.tap();
  await page.keyboard.type("5");
  await expect(cell).toHaveValue("5");
}

test.describe("landscape phone (~844×390, coarse)", () => {
  test.use({
    viewport: { width: 844, height: 390 },
    hasTouch: true,
    isMobile: true,
  });

  // The parenthetical used to read "the tall board scrolls vertically" — true of a tree where
  // the stacked shell had a width bound and no height bound, so 844×390 drew a 672px board
  // into a 390px viewport. T4-P1 mark 6 gave the stacked regime the row regime's own
  // `100dvh − 10rem` arm; the board fits now, and `e2e/board-covisibility.spec.ts` gates that
  // directly with a control. This row keeps its own charge: the page never scrolls sideways.
  test("no horizontal overflow; entry works", async ({ page }) => {
    await loadSudoku(page);
    await assertNoHorizontalOverflow(page);
    await assertEntryWorks(page);
  });
});

test.describe("iPad portrait (<1024, coarse, stacked)", () => {
  test.use({
    viewport: { width: 820, height: 1180 },
    hasTouch: true,
    isMobile: true,
  });

  test("no horizontal overflow; entry works", async ({ page }) => {
    await loadSudoku(page, "?size=4&difficulty=EASY"); // 16×16 — the widest board
    await assertNoHorizontalOverflow(page);
    await assertEntryWorks(page);
  });
});

test.describe("large iPad landscape (≥1024, coarse → desktop drawer layout)", () => {
  test.use({
    viewport: { width: 1194, height: 834 },
    hasTouch: true,
    isMobile: true,
  });

  test("the drawer tab is a clean ≥44px tap target and toggles the rail", async ({
    page,
  }) => {
    await loadSudoku(page);
    const tab = page.locator(".drawer-tab");
    await expect(tab).toBeVisible(); // ≥1024 display:block, even on a coarse device
    const box = (await tab.boundingBox())!;
    expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);

    const before = await tab.getAttribute("aria-expanded");
    await tab.tap();
    await expect.poll(() => tab.getAttribute("aria-expanded")).not.toBe(before); // the tap actually toggles the drawer
  });
});
