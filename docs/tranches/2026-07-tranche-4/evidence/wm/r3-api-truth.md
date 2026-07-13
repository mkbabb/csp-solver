# R3 — web-API capability truth (mobile recut)

**Lane R3 of the E8 mobile-recut RESEARCH phase.** Owner's ruling: native bounded text entry replaces the custom keypad (iOS-congruent focus styling); tap/touch-to-hold + vibration/haptics *if* a modern web API allows (iOS-only acceptable); KISS-forward. This is the honest matrix — every row verified against current (2026) documentation, every refusal flagged as hard as every ability. Research banked 2026-07-13; sources dated inline.

**Platform baseline.** "iOS Safari" = WebKit, and on iOS *every* browser (Chrome, Firefox, Edge included) is WebKit — a WebKit refusal is an iOS-wide refusal, no browser-shopping around it. Current shipping train in mid-2026 is iOS/Safari **26.x** (sources below cite iOS 26.1 and 26.5 behavior). "Android/Chrome" = Blink/Chromium.

---

## The matrix

| # | Capability | iOS Safari (WebKit) truth | Android/Chrome (Blink) truth | KISS verdict | Exact API shape |
|---|---|---|---|---|---|
| 1a | Numeric keypad on focus | `inputmode="numeric"` → digit keypad (iOS 14+; it's the decimal pad minus the `.`). `type="number"` → **full QWERTY with a number row**, not the pad. | `inputmode`/`type=number` both surface the numeric pad. | **`type="text"` + `inputmode="numeric"`** | `<input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1">` |
| 1b | `maxlength` bound (single digit) | Works on `text`/`tel`; **ignored on `type=number`** (spec: `maxlength` valid only for email/password/search/tel/text/url). | Same — `maxlength` ignored on `number` everywhere. | Text-typed input is the *only* way to bound length declaratively | `maxlength="1"` on `type="text"` (+ JS slice guard) |
| 1c | Kill autocorrect/caps/spell | Honored: `autocorrect`, `autocapitalize`, `spellcheck`. | Honored (`autocorrect` is a no-op but harmless). | Set all three off | `autocorrect="off" autocapitalize="off" spellcheck="false" autocomplete="off"` |
| 1d | Enter-key label | `enterkeyhint` supported **iOS Safari 13.4+**: enter/done/go/next/previous/search/send. | Chrome 77+. | Optional polish; `done`/`next` | `enterkeyhint="next"` |
| 2a | Zoom-on-focus suppression | Focus zooms iff computed font-size **< 16px**. `maximum-scale=1`/`user-scalable=no` stops it but is **a11y-hostile** (WCAG 1.4.4). | No focus-zoom; the 16px rule is iOS-only. | **16px font, full stop** — never disable user zoom | `input{font-size:16px}` (`1rem` if root=16px) |
| 2b | Layout-viewport resize opt-in (`interactive-widget`) | **NOT supported.** WebKit never implemented the viewport `interactive-widget` key. | Chrome 108+, Firefox 132+ (`resizes-content`/`overlays-content`). | Can't rely on it — iOS refusal | — (WebKit `standards-positions#65` open) |
| 2c | `VirtualKeyboard` API (geometry/env vars) | **NOT supported.** ~6 yrs unshipped in WebKit. | Chromium 94+ (`navigator.virtualKeyboard.overlaysContent`, `env(keyboard-inset-*)`). | iOS refusal — use `visualViewport` instead | — |
| 2d | Keep focused cell above keyboard | On iOS the **visual** viewport shrinks, **layout** viewport doesn't → fixed/bottom content hides under the keyboard. Fix: `visualViewport` `resize`/`scroll` listeners, or `dvh` units, or `scrollIntoView`. | Layout viewport shrinks to match; overlap is mostly automatic. | `visualViewport` + `scrollIntoView({block:'center'})` on focus | `window.visualViewport.addEventListener('resize',…)` / `el.scrollIntoView` |
| 3a | `navigator.vibrate` (programmatic buzz) | **NOT supported — never shipped, still absent 2026.** No public haptics API. | **Supported** (Chrome/Edge/Opera/Samsung/Android Browser). | **Android-only.** iOS is a hard refusal for scripted vibration | `navigator.vibrate?.(10)` — feature-detect, no-op on iOS |
| 3b | `<input switch>` haptic tick (iOS 18) | Shipped iOS 18 / Safari 17.4: a native `checkbox switch` plays a system tick **on toggle**. **But iOS 26.5 blocked *script*-triggered ticks** — only a **direct user tap** on the real control fires it now. | n/a (Blink has real `vibrate`). | Marginal, fragile, switch-semantics — see refusal note | overlay `opacity:0` `<input type="checkbox" switch>` sized over the tap target so the *user's own tap* hits it |
| 4a | Long-press detection | `pointerdown`+timer works. **`contextmenu` does NOT fire on iOS (13+)** — the desktop long-press path is dead. | `contextmenu` fires on long-press; `pointerdown` timer also works. | **`pointerdown`+`setTimeout`, cancel on `pointerup`/`pointercancel`/`pointermove`** — never `contextmenu` | timer set on `pointerdown`, cleared on move/up/cancel |
| 4b | Suppress OS callout/selection on hold | `-webkit-touch-callout:none` + `user-select:none` suppress the share-sheet/magnifier; recent reports of `-webkit-touch-callout:none` being **unreliable on iOS 26.1**. `touch-action` stops scroll-steal. | `-webkit-touch-callout` ignored (no callout to suppress); `user-select`/`touch-action` honored. | Belt-and-suspenders CSS on the hold target; test on-device | `-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;touch-action:none` |
| 5a | `:focus-visible` on touch | Shipped **Safari 15.4** (2022). Heuristic: a *tap* generally shows **no** ring; keyboard focus does. Buttons aren't mouse-focusable on Safari by design. | Same heuristic; shipped long prior. | Style `:focus-visible` for the keyboard path; don't fight the touch no-ring | `:focus-visible{outline:…}` (not bare `:focus`) |
| 5b | Tap-flash | Grey tap flash on tappable els; kill with transparent highlight. | Same property honored. | Zero it globally on interactive els | `-webkit-tap-highlight-color:transparent` |
| 5c | Auto text-inflation | `-webkit-text-size-adjust` default `auto` (iPhone) / `none` (iPad); can inflate cell digits unpredictably. | `text-size-adjust` honored. | Pin it | `-webkit-text-size-adjust:100%` |
| 5d | Overscroll/bounce containment | `overscroll-behavior` shipped **Safari 16.0** (2022) — `contain`/`none` stop scroll-chaining & rubber-band. | Chromium since v63. | Use it on the board scroll container | `overscroll-behavior:contain` |

---

## Row detail + citations

### 1. Bounded numeric entry

- **Keyboard shown.** `inputmode="numeric"` yields the tap-friendly digit pad on iOS since iOS 14 — since 14 it's literally the decimal pad without the `.` key. `type="number"` on iOS does *not* give the big keypad; it gives a normal keyboard with a number row, which is worse for single-digit tapping. The legacy fix was `pattern="[0-9]*"`, which forces the keypad even on older iOS and remains a harmless belt-and-suspenders alongside `inputmode`. Sources: [CSS-Tricks, *Finger-friendly numerical inputs with `inputmode`*](https://css-tricks.com/finger-friendly-numerical-inputs-with-inputmode/); [soledadpenades, *Safari on iOS and input[type=number]* (2024)](https://soledadpenades.com/posts/2024/safari-ios-input-type-number/); [catskull, *A note on iOS 12.2 input types*](https://catskull.net/ios-inputmode.html).
- **`maxlength` is the decider.** `maxlength` is *ignored* on `type="number"` — it's not merely a browser bug, the HTML spec only permits `maxlength` on email/password/search/tel/text/url. A single-cell "one digit max" bound therefore *requires* `type="text"` (or `tel`), which is exactly why the native-entry recut lands on text-typed input. Sources: [Rocket Validator, *maxlength is only allowed when the input type is…*](https://rocketvalidator.com/html-validation/attribute-maxlength-is-only-allowed-when-the-input-type-is-email-password-search-tel-text-or-url); [dev.to, *maxLength input type=number*](https://dev.to/matheusmcz/maxlength-input-typenumber-4npl); [codestudy.net, *Maxlength Ignored for Input Type Number in Chrome*](https://www.codestudy.net/blog/maxlength-ignored-for-input-type-number-in-chrome/).
- **Also:** `type="number"` carries `valueAsNumber`/leading-zero/scroll-wheel-increment baggage that a Sudoku cell doesn't want. `type="text"+inputmode="numeric"` sidesteps all of it and still declares numeric intent.
- **`enterkeyhint`** supported iOS Safari 13.4+ (enter/done/go/next/previous/search/send). Sources: [CSS-Tricks, *enterkeyhint*](https://css-tricks.com/enterkeyhint/); [WebKit, *New WebKit Features in Safari 13.1*](https://webkit.org/blog/10247/new-webkit-features-in-safari-13-1/).

**Proxy-input vs real-per-cell input (the caret/focus-ring question).** Two shapes exist: (A) one visually-hidden "proxy" input that drives the keyboard while the *cell div* is the visual, or (B) a real `<input>` per cell styled to look like the cell. On iOS a *focused but visually-hidden* input still owns a blinking **caret** and the keyboard; you can't fully suppress the caret except with `caret-color:transparent`, and an off-screen/opacity-0 focused input risks the page auto-scrolling to chase it and the iOS zoom heuristic still applying by computed font-size. Shape (B) is the KISS path: a real per-cell `type="text" inputmode="numeric" maxlength="1"` input, `caret-color:transparent` if you don't want the caret, `font-size:16px` to defeat zoom, and `:focus-visible` for the ring. It keeps the accessibility tree honest and avoids the proxy's scroll/caret gymnastics.

### 2. Keyboard geometry

- **`VirtualKeyboard` API** is Chromium-only (94+); WebKit hasn't shipped it ~6 years post-spec. Sources: [MDN, *VirtualKeyboard API*](https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API); [Chrome for Developers, *Full control with the VirtualKeyboard API*](https://developer.chrome.com/docs/web-platform/virtual-keyboard); [zouhir.org, *The Virtual Keyboard API Is Broken Where It Matters Most*](https://zouhir.org/blog/virtual-keyboard-api/); [WebKit bug 230225](https://bugs.webkit.org/show_bug.cgi?id=230225).
- **`interactive-widget` viewport key** (opt the *layout* viewport into resizing) is Chrome 108+/Firefox 132+ and **not in WebKit**. Sources: [htmhell, *Control the Viewport Resize Behavior with `interactive-widget`* (2024)](https://www.htmhell.dev/adventcalendar/2024/4/); [WebKit bug 259770](https://bugs.webkit.org/show_bug.cgi?id=259770); [WebKit standards-positions #65](https://github.com/WebKit/standards-positions/issues/65).
- **What iOS actually does:** keyboard shows → *visual* viewport shrinks, *layout* viewport stays full-height, so `position:fixed`/bottom content sits *under* the keyboard. The supported fix is `window.visualViewport` `resize`/`scroll` events (reposition via `top` + `translateY(-100%)`), `dvh` units, or `scrollIntoView` on the focused cell. Sources: [bram.us, *Prevent content hidden underneath the Virtual Keyboard*](https://www.bram.us/2021/09/13/prevent-items-from-being-hidden-underneath-the-virtual-keyboard-by-means-of-the-virtualkeyboard-api/); [franciscomoretti, *Fix mobile keyboard overlap with VisualViewport*](https://dev.to/franciscomoretti/fix-mobile-keyboard-overlap-with-visualviewport-3a4a).

### 3. Haptics — the honest answer

- **`navigator.vibrate`: iOS refusal, full stop.** WebKit has never shipped the Vibration API; still absent as of May 2026 (Chrome/Edge/Opera/Samsung/Android Browser support it, Safari + Safari-on-iOS do not). Because all iOS browsers are WebKit, there's no iOS browser where `navigator.vibrate` works. Sources: [mdn/browser-compat-data #29166](https://github.com/mdn/browser-compat-data/issues/29166); [web-platform-tests/interop #718 (Vibration API)](https://github.com/web-platform-tests/interop/issues/718); [TestMu, *Vibration API: Browser Support*](https://www.testmuai.com/learning-hub/vibration-api-browser-support/).
- **The `<input switch>` haptic — and why 2026 kills it as a general tick.** iOS 18 / Safari 17.4 gave the native `<input type="checkbox" switch>` a system haptic tick on toggle. Through early 2026, libraries (`use-haptic`, `ios-haptics`) exploited this by programmatically `.click()`-ing a `<label>` bound to a hidden switch to fire an *arbitrary* tick from JS. **iOS 26.5 patched that hole**: script-triggered ticks no longer fire — *only a direct user tap on the real switch control* produces haptics now. The sole surviving trick is `project-fathom`'s: overlay an `opacity:0`, full-size, `clip-path`-hit-clipped real `<input switch>` over your visual button so the user's *own* finger lands on the native control. Sources: [WebKit, *News from WWDC24: Safari 18 beta* (haptic for `<input switch>`)](https://webkit.org/blog/15443/news-from-wwdc24-webkit-in-safari-18-beta/); [asuma/posaune0423, *I Open-Sourced use-haptic* (2026-03-30)](https://medium.com/@posaune0423/i-open-sourced-an-oss-library-for-arbitrary-haptic-feedback-in-ios-safari-5b8ca74a5f05); [github.com/tijnjh/ios-haptics](https://github.com/tijnjh/ios-haptics) (notes Apple patched the bug in iOS 26.5); [github.com/m1ckc3s/project-fathom](https://github.com/m1ckc3s/project-fathom) ("as of iOS 26.5, only a direct tap fires the haptic — it can't be triggered from script anymore").
- **KISS verdict on haptics:** *There is no clean, KISS-forward web haptic on iOS in 2026.* You cannot buzz on a keypad press from script. The only iOS tick available is a **side-effect of a real user tap on a native switch element** — which toggles (wrong semantics for a numeric button), must remain a real (if invisible) native control, looks brittle against Apple's demonstrated willingness to close the hole (18→26.5), and delivers exactly one fixed system tick with no pattern control. Honest recommendation: **feature-detect `navigator.vibrate` and use it on Android; treat iOS haptics as unavailable** and don't build UX that depends on them. If the owner still wants an iOS tick badly enough to accept the fragility, the *only* shape that works post-26.5 is the fathom overlay, applied to a genuine tap target (e.g. a confirm/commit button), never as a scripted "tick on every digit."

### 4. Touch-hold

- **`contextmenu` is out on iOS.** iOS Safari (13+) does not fire `contextmenu` — the desktop long-press-via-contextmenu pattern simply never runs. Sources: [mdn/browser-compat-data #6376 (*contextmenu: Safari on iOS does not support it*)](https://github.com/mdn/browser-compat-data/issues/6376); [Apple Developer Forums, *Contextmenu event not triggered on iOS 13.1+*](https://developer.apple.com/forums/thread/699834).
- **The shape that works:** `pointerdown` starts a `setTimeout` (~400-500ms); `pointerup`/`pointercancel`/`pointermove`-past-threshold clears it; the timer firing = long-press. Pointer Events are unified across iOS/Android, so one code path covers both.
- **Suppressing the OS callout/magnifier:** `-webkit-touch-callout:none` + `-webkit-user-select:none` + `user-select:none` on the hold target; `touch-action:none` (or `manipulation`) to stop the hold from being stolen by scroll/double-tap-zoom. Caveat: developers report `-webkit-touch-callout:none` behaving **unreliably on iOS 26.1** — must be device-verified, and `user-select:none` is the load-bearing half of the pair. Side effect: `user-select:none` also disables the text-selection magnifier (fine for a game cell, and desired here). Sources: [TestMu, *-webkit-touch-callout*](https://www.testmuai.com/learning-hub/webkit-touch-callout-browser-support/); [Apple Developer Forums, *webkit-touch-callout:none not working in Safari on iOS 26.1*](https://developer.apple.com/forums/thread/808606); [additionalknowledge, *Prevent Default Context Menu on Long Press*](https://additionalknowledge.com/2024/08/02/how-to-prevent-the-default-context-menu-live-preview-on-long-press-in-mobile-safari-chrome/).

### 5. Other load-bearing rows

- **`:focus-visible`** shipped Safari 15.4 (2022, STP 138). On touch the heuristic draws *no* ring for a tap but does for keyboard focus; Safari also doesn't mouse-focus buttons by platform convention. Style `:focus-visible`, not bare `:focus`, so a finger-tap doesn't leave a stuck ring. Sources: [Igalia/Rego, *:focus-visible is shipping in Safari/WebKit* (2022-04-08)](https://blogs.igalia.com/mrego/2022/04/08/focus-visible-is-shipping-in-safari-webkit/); [WebKit, *The Focus-Indicated Pseudo-class :focus-visible*](https://webkit.org/blog/12179/the-focus-indicated-pseudo-class-focus-visible/).
- **`-webkit-tap-highlight-color:transparent`** removes the grey tap flash on iOS. Source: [W3Cubdocs, *-webkit-tap-highlight-color*](https://docs.w3cub.com/css/-webkit-tap-highlight-color).
- **`-webkit-text-size-adjust`** default is `auto` on iPhone / `none` on iPad; pin to `100%` so cell digits don't auto-inflate on rotation/reflow. Source: [Apple, *Adjusting the Text Size*](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/AdjustingtheTextSize/AdjustingtheTextSize.html).
- **`overscroll-behavior:contain`** shipped Safari 16.0 (2022); stops rubber-band/scroll-chaining on the board container. Source: [WebKit, *WebKit Features in Safari 16.0*](https://webkit.org/blog/13152/webkit-features-in-safari-16-0/).

---

## Flagged refusals (where iOS simply cannot)

The tranche write needs these as much as the abilities:

1. **`navigator.vibrate` — permanent iOS refusal.** No scripted vibration on any iOS browser, 2026. (Row 3a)
2. **Programmatic haptic tick — refused since iOS 26.5.** The `label.click()` switch trick is dead; only a *direct user tap* on a native switch fires a tick. No arbitrary/patterned haptics. (Row 3b)
3. **`VirtualKeyboard` API — iOS refusal.** No `env(keyboard-inset-*)`, no `overlaysContent` on iOS. (Row 2c)
4. **`interactive-widget` viewport key — iOS refusal.** Can't opt the layout viewport into keyboard resize; must hand-roll with `visualViewport`. (Row 2b)
5. **`contextmenu` long-press — iOS refusal.** Event never fires; long-press must be `pointerdown`+timer. (Row 4a)
6. **`maxlength` on `type="number"` — universal refusal (spec).** Not iOS-specific, but it forecloses the "numeric input, bounded to one char" combination and forces `type="text"`. (Row 1b)
7. **Disabling user zoom to dodge focus-zoom — refused on a11y grounds, not by the engine.** `maximum-scale=1` works but violates WCAG 1.4.4; the sanctioned answer is 16px font. (Row 2a)

---

## KISS recommendation sketch (per owner ask)

**Bounded input shape.** One real `<input>` per cell — `type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"`. `type="text"` (not `number`) is non-negotiable: it's the only type where `maxlength` bounds the cell to a single digit, and `inputmode="numeric"` still raises the iOS digit pad (iOS 14+). Style: `font-size:16px` (kills the focus-zoom without ever touching `maximum-scale`), `caret-color:transparent` if the caret reads as clutter, `:focus-visible` outline for the keyboard path plus `-webkit-tap-highlight-color:transparent` for the tap path, and a JS `input` handler that slices to `[0-9]` and one char as the belt to `maxlength`'s suspenders. Skip the visually-hidden proxy-input pattern — a real per-cell input keeps the a11y tree honest and dodges the caret-chasing auto-scroll.

**Haptics — honest answer.** Ship `navigator.vibrate?.(10)` behind feature detection: a real short tick on Android, a silent no-op on iOS. On iOS in 2026 there is *no* KISS haptic — `navigator.vibrate` was never implemented and iOS 26.5 closed the only scripted path through the `<input switch>` tick. Do **not** architect any interaction that needs an iOS buzz. If (and only if) the owner accepts fragility for a single iOS tap-tick on a *commit* control, the post-26.5 shape is the fathom overlay: an `opacity:0`, full-size, `clip-path`-clipped native `<input type="checkbox" switch>` over that button so the user's own finger fires the native tick — but flag it as brittle (Apple has narrowed this hole twice: iOS 18 → 26.5) and switch-semantic.

**Touch-hold shape.** `pointerdown` → `setTimeout(~450ms)`; clear on `pointerup`/`pointercancel`/`pointermove` beyond a small threshold; the surviving timer is the long-press. Never `contextmenu` (it doesn't fire on iOS). On the hold target set `touch-action:none`, `user-select:none` (+ `-webkit-user-select:none`), `-webkit-touch-callout:none` to kill the iOS callout/magnifier — but device-verify, since `-webkit-touch-callout:none` has been flaky on iOS 26.1 and `user-select:none` is the reliable half. One Pointer-Events path covers iOS and Android.

---

## Sources (with dates where the page carries one)

- CSS-Tricks — Finger-friendly numerical inputs with `inputmode`: https://css-tricks.com/finger-friendly-numerical-inputs-with-inputmode/
- soledadpenades — Safari on iOS and input[type=number] (2024): https://soledadpenades.com/posts/2024/safari-ios-input-type-number/
- catskull — A note on iOS 12.2 input types: https://catskull.net/ios-inputmode.html
- Rocket Validator — maxlength only allowed on email/password/search/tel/text/url: https://rocketvalidator.com/html-validation/attribute-maxlength-is-only-allowed-when-the-input-type-is-email-password-search-tel-text-or-url
- dev.to (matheusmcz) — maxLength input type=number: https://dev.to/matheusmcz/maxlength-input-typenumber-4npl
- codestudy.net — Maxlength Ignored for Input Type Number in Chrome: https://www.codestudy.net/blog/maxlength-ignored-for-input-type-number-in-chrome/
- CSS-Tricks — 16px or Larger Text Prevents iOS Form Zoom: https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/
- defensivecss.dev — Input zoom on iOS Safari: https://defensivecss.dev/tip/input-zoom-safari/
- htmhell — Control Viewport Resize with `interactive-widget` (2024): https://www.htmhell.dev/adventcalendar/2024/4/
- WebKit standards-positions #65 — opt-in meta for virtual keyboard layout: https://github.com/WebKit/standards-positions/issues/65
- WebKit bug 259770 — Implement interactive-widget in viewport meta: https://bugs.webkit.org/show_bug.cgi?id=259770
- MDN — VirtualKeyboard API: https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API
- Chrome for Developers — Full control with the VirtualKeyboard API: https://developer.chrome.com/docs/web-platform/virtual-keyboard
- zouhir.org — The Virtual Keyboard API Is Broken Where It Matters Most: https://zouhir.org/blog/virtual-keyboard-api/
- WebKit bug 230225 — Implement the VirtualKeyboard API: https://bugs.webkit.org/show_bug.cgi?id=230225
- bram.us — Prevent items hidden underneath the Virtual Keyboard (2021): https://www.bram.us/2021/09/13/prevent-items-from-being-hidden-underneath-the-virtual-keyboard-by-means-of-the-virtualkeyboard-api/
- dev.to (franciscomoretti) — Fix mobile keyboard overlap with VisualViewport: https://dev.to/franciscomoretti/fix-mobile-keyboard-overlap-with-visualviewport-3a4a
- mdn/browser-compat-data #29166 — navigator.vibrate on iOS Safari: https://github.com/mdn/browser-compat-data/issues/29166
- web-platform-tests/interop #718 — Vibration API (opened 2024-09-18): https://github.com/web-platform-tests/interop/issues/718
- TestMu (LambdaTest) — Vibration API: Browser Support, Patterns, Limitations: https://www.testmuai.com/learning-hub/vibration-api-browser-support/
- WebKit — News from WWDC24: WebKit in Safari 18 beta (haptic for `<input switch>`): https://webkit.org/blog/15443/news-from-wwdc24-webkit-in-safari-18-beta/
- Medium (asuma/posaune0423) — I Open-Sourced use-haptic (2026-03-30): https://medium.com/@posaune0423/i-open-sourced-an-oss-library-for-arbitrary-haptic-feedback-in-ios-safari-5b8ca74a5f05
- github.com/tijnjh/ios-haptics — notes Apple patched the trick in iOS 26.5: https://github.com/tijnjh/ios-haptics
- github.com/m1ckc3s/project-fathom — post-26.5 direct-tap-only haptic overlay: https://github.com/m1ckc3s/project-fathom
- mdn/browser-compat-data #6376 — contextmenu unsupported on iOS Safari: https://github.com/mdn/browser-compat-data/issues/6376
- Apple Developer Forums — Contextmenu event not triggered on iOS 13.1+: https://developer.apple.com/forums/thread/699834
- TestMu (LambdaTest) — -webkit-touch-callout: https://www.testmuai.com/learning-hub/webkit-touch-callout-browser-support/
- Apple Developer Forums — webkit-touch-callout:none not working in Safari on iOS 26.1: https://developer.apple.com/forums/thread/808606
- Igalia/Rego — :focus-visible is shipping in Safari/WebKit (2022-04-08): https://blogs.igalia.com/mrego/2022/04/08/focus-visible-is-shipping-in-safari-webkit/
- WebKit — The Focus-Indicated Pseudo-class :focus-visible: https://webkit.org/blog/12179/the-focus-indicated-pseudo-class-focus-visible/
- W3Cubdocs — -webkit-tap-highlight-color: https://docs.w3cub.com/css/-webkit-tap-highlight-color
- Apple — Adjusting the Text Size (-webkit-text-size-adjust): https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/AdjustingtheTextSize/AdjustingtheTextSize.html
- WebKit — WebKit Features in Safari 16.0 (overscroll-behavior): https://webkit.org/blog/13152/webkit-features-in-safari-16-0/
- CSS-Tricks — enterkeyhint: https://css-tricks.com/enterkeyhint/
- WebKit — New WebKit Features in Safari 13.1 (enterkeyhint): https://webkit.org/blog/10247/new-webkit-features-in-safari-13-1/
