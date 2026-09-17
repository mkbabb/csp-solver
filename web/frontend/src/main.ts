// Dev-only rAF-chain instrumentation — env-gated (import.meta.env.DEV is statically
// inlined, so the dynamic import()'s chunk is dead-code-eliminated from prod builds),
// loaded first so it wraps native requestAnimationFrame before any chain starts. See
// @pencil/dev/rafInstrumentation for the W8 chains=1 cross-check it powers.
if (import.meta.env.DEV) {
  void import("@pencil/dev/rafInstrumentation");
}

// T9-W8 §8.3 — THE OWNER-RUN DEVICE INSTRUMENT, armed by `?__probe=1` and by nothing else.
// The edge serves `script-src 'self' 'wasm-unsafe-eval'` with no `'unsafe-inline'`, so a
// bookmarklet cannot run on sudoku.babb.dev at all; the probe therefore ships as a lazily
// imported same-origin chunk that Vite emits content-hashed under /assets/, which satisfies
// that policy with no header change. The guard is a URL read with no allocation of its own
// and the `import()` is never reached without the flag, so an ordinary load makes no extra
// request, mounts no extra DOM, and carries no probe code in its entry chunk (the chunk graph
// is checked in e2e/device-probe.spec.ts and in the wave's dist evidence).
if (new URLSearchParams(window.location.search).has("__probe")) {
  void import("./probe/devicePaint").then((m) => m.mountDeviceProbe());
}

import { createApp } from "vue";
import App from "./App.vue";
import "./assets/index.css";

createApp(App).mount("#app");
