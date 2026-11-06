const [, , lib] = process.argv;
const L = await import(lib);
const C = {
  C21: ['Object.assign(vars, { "animation-duration": "50ms" });', "animation-duration", 1],
  C6: ["({ 'animation-duration': '150ms', ...ink })", "animation-duration", 1],
  UNQUOTED: ["const s = { animationDuration: '50ms' };", "animation-duration", 1],
  NEG_INSTR: ['const css = "x { animation-duration: 50ms }";', "animation-duration", 0],
};
let bad = 0;
for (const [k, [code, prop, want]] of Object.entries(C)) {
  const got = L.scriptWrites(code, prop).filter((w) => w.kind === "script-object").length;
  console.log(k, "got", got, "want", want, got === want ? "OK" : "WRONG");
  if (got !== want) bad++;
}
process.exit(bad ? 1 : 0);
