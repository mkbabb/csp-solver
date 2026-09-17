// @ts-check
//
// The relay's lint scope (T9-W6 §6.2). ESLint's flat config has ONE base path — the directory
// its config file sits in — so `eslint .` under web/frontend can never reach a sibling package:
// it answers "located outside of the base path" and lints nothing, which is how a deployed
// Worker sat outside the estate's lint for three campaigns while the frontend lane printed
// green. The cure is a config HERE, whose base path is this directory.
//
// It re-exports web/frontend's config rather than restating it: one law, one file. The import
// specifiers inside that module resolve from ITS location, so they find web/frontend's
// node_modules — which is also why this package needs none of its own (wrangler.toml's header
// makes the same point about wrangler and vitest).
//
// What actually applies here, since the frontend config's per-scope blocks key off `src/**`,
// `**/*.vue` and `scripts/**`: the js + typescript-eslint recommended sets and the shared rules
// block (no-explicit-any off, the `^_` unused-vars convention). The browser globals block
// applies too, and that is correct for a Worker: `Request`, `Response`, `URL` and `WebSocket`
// are the surface this file touches.
export { default } from "../frontend/eslint.config.js";
