// CRITIC probe (pass 8, CTRL-RULE): the row-28 source arm's FOOT_PAD, verbatim from zone-grammar.spec.ts,
// run on the critic's own plants. Browserless. Reads the tree passed in argv[2] (web/frontend).
import { readFileSync } from "node:fs";
import { join } from "node:path";
const FE = process.argv[2];
const { elementSites, REGIMES, effectiveAt, tokenSites, census: shapeCensus } = await import(join(FE, "scripts/shape-census.mjs"));
const DOCK = Object.entries(REGIMES).filter(([, r]) => r.width < 1024).map(([k]) => k);
const STACKED = /^calc\(\s*[^;]*\+\s*env\(\s*safe-area-inset-bottom\s*\)\s*\)$/;
const FOOT_PAD = (plant = null, off = [], other = null) => {
  const scene = join(FE, "src/games/shared/scene.css");
  const read = (f) => {
    let t = readFileSync(f, "utf8");
    if (other && f === join(FE, other[0])) return other[2] ? t.replace(other[2], other[1]) : `${t}\n${other[1]}`;
    if (!plant || f !== scene) return t;
    if (plant.shadow) t = t.replace(/(\.card-foot\s*\{[^}]*padding-bottom:\s*calc\([^;]*\);)/, `$1\n  padding-bottom: ${plant.shadow};`);
    return `${plant.prepend ?? ""}\n${t}\n${plant.css ?? ""}`;
  };
  const r = elementSites(FE, { file: "src/games/shared/GameScene.vue", pick: (el) => el.id === "card-foot", props: ["padding-bottom"], read });
  const regimes = off.includes("regimes") ? ["phone-portrait-390x844"] : DOCK;
  const bad = [];
  if (!r.elements.length) bad.push("no #card-foot");
  for (const regime of regimes) {
    const live = r.sites.filter((x) => (x.regimes ?? DOCK).includes(regime));
    const read1 = off.includes("every-site") ? [effectiveAt(r.sites, regime)].filter(Boolean) : live;
    if (!read1.length) bad.push(`${regime}: no site`);
    for (const x of read1) if (!STACKED.test(String(x.value).trim())) bad.push(`${regime}: ${x.file}:${x.line} ${x.prelude} {${x.prop}: ${x.value}${x.important ? " !important" : ""}}`);
  }
  return { sites: r.sites.length, bad };
};
const show = (name, res, want) => console.log(`${res.bad.length ? "RED  " : "GREEN"} (${want}) ${name} · sites ${res.sites} · ${res.bad.slice(0, 2).join(" | ").slice(0, 200)}`);
console.log("== shipped"); show("shipped", FOOT_PAD(), "GREEN");
console.log("== pass-7 critic's three plants FIRST");
show("E4 !important max() coarse", FOOT_PAD({ css: "@media (pointer:coarse){.card-foot{padding-bottom:max(0.15rem, env(safe-area-inset-bottom)) !important}}" }), "RED");
show("E3 #card-foot.card-foot", FOOT_PAD({ css: "#card-foot.card-foot{padding-bottom:.15rem}" }), "RED");
show("shadow in same block", FOOT_PAD({ shadow: "0.15rem" }), "RED");
console.log("== critic pass-8 plants");
show("K1 net-zero stack calc(.15rem - env() + env())", FOOT_PAD({ css: ".card-foot{padding-bottom:calc(0.15rem - env(safe-area-inset-bottom) + env(safe-area-inset-bottom))}" }), "RED owed");
show("K2 env() with a zero multiplier inside: calc(.15rem + 0*env() + env()) [stacks: decoy]", FOOT_PAD({ css: ".card-foot{padding-bottom:calc(0.15rem + 0 * env(safe-area-inset-bottom) + env(safe-area-inset-bottom))}" }), "GREEN decoy");
show("K3 calc(.15rem + env(safe-area-inset-bottom, 0px)) [legal fallback: decoy]", FOOT_PAD({ css: ".card-foot{padding-bottom:calc(0.15rem + env(safe-area-inset-bottom, 0px))}" }), "GREEN decoy");
show("K4 in index.css: #card-foot{padding-bottom:0 !important}", FOOT_PAD(null, [], ["src/assets/index.css", "#card-foot{padding-bottom:0 !important}"]), "RED");
show("K5 GameScene.vue <style>: .card-foot{padding-bottom:0}", FOOT_PAD(null, [], ["src/games/shared/GameScene.vue", "<style>.card-foot{padding-bottom:0}</style>"]), "RED");
show("K6 via token: .card-foot{padding-bottom:var(--fp)} (unresolved)", FOOT_PAD({ css: ".card-foot{padding-bottom:var(--fp,0px)}" }), "RED");
show("K7 calc(-1rem + env()) negative pad (clamps to inset-only-minus)", FOOT_PAD({ css: ".card-foot{padding-bottom:calc(-1rem + env(safe-area-inset-bottom))}" }), "RED owed");
show("K8 calc(0px + env()) zero pad", FOOT_PAD({ css: ".card-foot{padding-bottom:calc(0px + env(safe-area-inset-bottom))}" }), "RED owed");
show("K9 CSS-nested .scene{ .card-foot{padding-bottom:0} }", FOOT_PAD({ css: ".game-scene { .card-foot { padding-bottom: 0; } }" }), "RED");
show("K10 :is(#card-foot) {padding-bottom:0}", FOOT_PAD({ css: ":is(#card-foot){padding-bottom:0}" }), "RED");
show("K11 @supports (padding: 1px) { .card-foot{padding-bottom:0} }", FOOT_PAD({ css: "@supports (padding:1px){.card-foot{padding-bottom:0}}" }), "RED");
show("K12 @layer x { .card-foot{padding-bottom:0 !important} }", FOOT_PAD({ css: "@layer x{.card-foot{padding-bottom:0 !important}}" }), "RED");
show("K13 padding-block-end: 0 (logical longhand)", FOOT_PAD({ css: ".card-foot{padding-block-end:0}" }), "RED owed");
show("K14 padding-block: 0 (logical shorthand)", FOOT_PAD({ css: ".card-foot{padding-block:0}" }), "RED owed");
show("K15 inset-erase: .card-foot{margin-bottom:-2.4px}", FOOT_PAD({ css: ".card-foot{margin-bottom:-2.4px}" }), "(outside prop set; paint arm's)");
