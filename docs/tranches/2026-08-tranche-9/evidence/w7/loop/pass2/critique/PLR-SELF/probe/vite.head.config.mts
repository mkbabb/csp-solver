// CRITIC's HEAD CONTROL: the main tree at a8fee1f5, served READ-ONLY on its own port with its
// own private cacheDir. Nothing is written into the main tree; main's src is frozen and this
// server only reads it. The pi census compares this against the prototype's server.
import base from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/vite.config.ts";

export default {
  ...base,
  cacheDir:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/PLR-SELF/cache-head",
};
