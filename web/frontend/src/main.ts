// Dev-only rAF-chain instrumentation — env-gated (import.meta.env.DEV is statically
// inlined, so the dynamic import()'s chunk is dead-code-eliminated from prod builds),
// loaded first so it wraps native requestAnimationFrame before any chain starts. See
// @pencil/dev/rafInstrumentation for the W8 chains=1 cross-check it powers.
if (import.meta.env.DEV) {
  void import('@pencil/dev/rafInstrumentation')
}

import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.css'

createApp(App).mount('#app')
