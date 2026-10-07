import * as shape from "./scripts/shape-census.mjs";
const reg = ["--focus-ring-outset", "--toggle-bleed", "--motion-note"];
const plants = {
  X8_known: "const rung='note'; el.style.setProperty('animation-duration', `var(--motion-${rung}, 280ms)`);",
  X10_bare_stem: "const n='motion-note'; el.style.setProperty('animation-duration', `var(--${n}, 280ms)`);",
  X11_const_name: "const N='--motion-note'; el.style.setProperty('animation-duration', 'var(' + N + ', 280ms)');",
  X12_template_name: "const N='--motion-note'; el.style.setProperty('animation-duration', `var(${N}, 280ms)`);",
  X13_fn_stem: "el.style.setProperty('animation-duration', `var(--motion-${pick()}, 280ms)`);",
  X9_concat: 'const d9 = "var(--motion-note" + ", 280ms)";',
};
for (const [k, t] of Object.entries(plants)) {
  const raw = shape.maskedDefaults(shape.stripJs(t), reg);
  const kept = raw.filter((m) => !m.unresolved && reg.includes(m.name)).map((m) => m.name);
  console.log(k.padEnd(18), "raw", JSON.stringify(raw.map((m) => ({ n: m.name, u: !!m.unresolved }))), "→ spec keeps", JSON.stringify(kept), kept.length ? "RED" : "GREEN (hole)");
}
