"""W7/W8 · the wash ARM plants GRAPHITE owes SIX's wash reach (charter row 10). PROPOSED, not folded.

usage: python3 wash-arm-plants.py <web/frontend of a tree carrying the union's wash const> <logdir>

On the WAVE union (`acb9c08e` + homes.on-WAVE + GRAPHITE's on-WAVE delta) the wash is ONE const:
`--ground-wash-unit: var(--wash-blue)` (default) or `var(--wash-graphite)` (GRAPHITE's arm), each arm
re-declared under `@media (prefers-contrast: more)`. The plants act on the ARM token's contrast-more
re-declaration, never on `--ground-wash-unit`, with the const in both positions:
  W7g  `--wash-graphite: transparent` under contrast more  (the arm presses to nothing)
  W8g  `--wash-graphite` at 1 % under contrast more         (the arm presses DOWN, 12 % -> 1 %)
Each plant string is assembled at run time (never spelled in a product file); its bytes are printed
through `od -c`. The file is restored and compared byte for byte at the end.

Pass-9 reading on the union, both gates, all six cells (const x {clean, W7g, W8g}):
  lint:ink 0 in all six; lint:theme-tokens 1 in all six with output byte-identical to clean
  (its 1 is the union's own two bare var()s, the same on the union control).
So neither gate evaluates an arm token under contrast more, in either const position: the escape is
on the ACTIVE arm too. The wash reach reads `--ground-wash-unit`'s declarations only.
"""
import shutil
import subprocess
import sys

FE, LOG = sys.argv[1], sys.argv[2]
CSS = FE + "/src/assets/index.css"
ORIG = LOG + "/index.css.orig"
shutil.copy(CSS, ORIG)
g = "--wash-" + "graphite"
pg = "var(--color-pencil-" + "graphite)"
CLEAN_MORE = f"    {g}: color-mix(in srgb, {pg} 12%, transparent);"
ARM_BLUE = "  --ground-wash-unit: var(--wash-blue);"
ARM_G = "  --ground-wash-unit: var(" + g + ");"
plants = {
    "clean": None,
    "W7g": f"    {g}: " + "trans" + "parent;",
    "W8g": f"    {g}: color-mix(in srgb, {pg} 1%, transparent);",
}
out = open(LOG + "/wash-arm-plants.tsv", "w")
out.write("const\tplant\tlint:ink\tlint:theme-tokens\tplanted-line-od\n")
for arm, armline in (("blue", ARM_BLUE), ("graphite", ARM_G)):
    for pid, pl in plants.items():
        s = open(ORIG).read()
        assert s.count(ARM_BLUE) == 1 and s.count(CLEAN_MORE) == 1
        s = s.replace(ARM_BLUE, armline)
        if pl:
            s = s.replace(CLEAN_MORE, pl)
        open(CSS, "w").write(s)
        od = " ".join(subprocess.run(["od", "-c"], input=(pl or "").encode(), capture_output=True).stdout.decode().split())
        ex = []
        for gate in ("lint:ink", "lint:theme-tokens"):
            r = subprocess.run(["npm", "run", "-s", gate], cwd=FE, capture_output=True, text=True)
            open(f"{LOG}/wp-{arm}-{pid}-{gate.replace(':', '_')}.log", "w").write(r.stdout + r.stderr)
            ex.append(str(r.returncode))
        out.write(f"{arm}\t{pid}\t{ex[0]}\t{ex[1]}\t{od[:120]}\n")
        out.flush()
shutil.copy(ORIG, CSS)
out.write("restored " + str(open(CSS).read() == open(ORIG).read()) + "\n")
