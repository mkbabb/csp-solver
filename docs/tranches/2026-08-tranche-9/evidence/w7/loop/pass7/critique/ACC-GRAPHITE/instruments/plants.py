import subprocess, shutil, sys, os
A = sys.argv[1]
os.chdir(A)
def app(rel, text):
    return (rel, lambda s: s + text)
def rep(rel, old, new):
    def f(s):
        assert old in s, (rel, old)
        return s.replace(old, new, 1)
    return (rel, f)
GC = "src/games/shared/gameCell.css"; IDX = "src/assets/index.css"
BOARD = "src/games/shared/GameBoard.vue"; PI = "src/games/shared/playerIdentity.ts"
plants = {
 # wash gate (check-ink-pressure) — the CONSUMER and the registration, not the token's declarations
 "W1-consumer-opacity": ("scripts/check-ink-pressure.mjs", [app(GC, "\n.cell-peer { opacity: 0.2; }\n")]),
 "W2-consumer-bg-transparent": ("scripts/check-ink-pressure.mjs", [app(GC, "\n.cell-peer { background: transparent; }\n")]),
 "W3-consumer-literal-2pct": ("scripts/check-ink-pressure.mjs", [app(GC, "\n.cell-peer { background: rgb(87 83 78 / 0.02); }\n")]),
 "W4-tw-arbitrary-prop": ("scripts/check-ink-pressure.mjs", [rep(BOARD, "<template>\n", "<template>\n<!-- --><div class=\"[--ground-wash-unit:transparent]\" hidden></div>\n")]),
 "W5-property-inherits-false": ("scripts/check-ink-pressure.mjs", [app(IDX, "\n@property --ground-wash-unit { syntax: '<color>'; inherits: false; initial-value: transparent; }\n")]),
 "W6-cssText-write": ("scripts/check-ink-pressure.mjs", [app(PI, "\nexport const wz = (el: HTMLElement) => { el.style.cssText = '--ground-wash-unit: transparent'; };\n")]),
 # RETIRED (check-theme-tokens)
 "R1-tw-arbitrary-prop": ("scripts/check-theme-tokens.mjs", [rep(BOARD, "<template>\n", "<template>\n<!-- --><div class=\"[--color-crayon-blue:#4a90d9]\" hidden></div>\n")]),
 "R2-cssText-write": ("scripts/check-theme-tokens.mjs", [app(PI, "\nexport const cz = (el: HTMLElement) => { el.style.cssText = '--color-crayon-blue: #4a90d9'; };\n")]),
 "R3-json-table": ("scripts/check-theme-tokens.mjs", [("src/games/shared/retired-plant.json", lambda s: '{ "--color-crayon-blue": "#4a90d9" }\n')]),
 "R4-property-initial": ("scripts/check-theme-tokens.mjs", [app(IDX, "\n@property --color-crayon-blue { syntax: '<color>'; inherits: true; initial-value: #4a90d9; }\n")]),
 "R5-template-interp": ("scripts/check-theme-tokens.mjs", [app(PI, "\nconst hue = 'blue';\nexport const tz = (el: HTMLElement) => el.style.setProperty(`--color-crayon-${hue}`, '#4a90d9');\n")]),
 "R6-bracket-key": ("scripts/check-theme-tokens.mjs", [app(PI, "\nexport const bz = (el: HTMLElement) => Object.assign(el.style, { ['--color-crayon-blue']: '#4a90d9' });\n")]),
}
only = sys.argv[2:] or list(plants)
for name in only:
    gate, edits = plants[name]
    saved = {}
    for rel, f in edits:
        p = os.path.join(A, rel)
        saved[rel] = open(p).read() if os.path.exists(p) else None
        open(p, "w").write(f(saved[rel] or ""))
    r = subprocess.run(["node", gate], capture_output=True, text=True)
    out = (r.stdout + r.stderr).strip().splitlines()
    hit = [l for l in out if "crayon-blue" in l or "wash" in l.lower() and ("under" in l or "unreadable" in l or "RETIRED" in l)]
    print(f"{name}: exit {r.returncode} :: {(hit[:2] if hit else out[-1:])}")
    for rel, s in saved.items():
        p = os.path.join(A, rel)
        if s is None:
            shutil.move(p, os.path.join(A, "..", "..", os.path.basename(p) + ".moved"))
        else:
            open(p, "w").write(s)
