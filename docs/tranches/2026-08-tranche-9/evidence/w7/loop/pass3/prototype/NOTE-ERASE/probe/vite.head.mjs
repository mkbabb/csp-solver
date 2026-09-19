// THE HEAD CONTROL — 74a2b5d9, read-only. The main tree's src is frozen at that commit (the
// lanes' HEAD control per the campaign's standing order), so it is served as-is; the only
// thing this config changes is the cacheDir, redirected out of the shared node_modules/.vite.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/NOTE-ERASE/.vite-cache-head",
};
