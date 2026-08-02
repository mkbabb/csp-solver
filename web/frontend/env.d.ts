/// <reference types="vite/client" />

/** T6.1 — the signalling relay's URL, baked at build. Absent in every ordinary build (the
 *  production default lives beside the constant in `useSession.ts`); set by the local probe
 *  rig against `wrangler dev`, and by the chair if the deploy lands on another hostname. */
interface ImportMetaEnv {
  readonly VITE_RELAY_URL?: string
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
