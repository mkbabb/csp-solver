# CTRL-TABS critic: undefined-token census (the reverse half of chair §6.5). Every var(--x) referenced
# in src/**/*.{vue,css,ts} vs every --x declared (CSS `--x:`, @property, JS setProperty("--x"/`--x`), style binding keys).
# Prints referenced-but-undeclared for a tree; diff two trees to see what a lane introduced.
import re, sys, pathlib
root = pathlib.Path(sys.argv[1]) / "src"
ref, decl = {}, set()
for p in root.rglob("*"):
    if p.suffix not in (".vue", ".css", ".ts") or p.name.endswith(".test.ts"): continue
    t = p.read_text(errors="ignore")
    t_nc = re.sub(r"/\*[\s\S]*?\*/", "", t); t_nc = re.sub(r"<!--[\s\S]*?-->", "", t_nc)
    for m in re.finditer(r"var\(\s*(--[a-zA-Z0-9_-]+)", t_nc): ref.setdefault(m.group(1), set()).add(str(p.relative_to(root)))
    for m in re.finditer(r"(--[a-zA-Z0-9_-]+)\s*:", t_nc): decl.add(m.group(1))
    for m in re.finditer(r"@property\s+(--[a-zA-Z0-9_-]+)", t_nc): decl.add(m.group(1))
    for m in re.finditer(r"[\"'`](--[a-zA-Z0-9_-]+)[\"'`]", t_nc): decl.add(m.group(1))
    for m in re.finditer(r"`(--[a-zA-Z0-9_-]+)-\$\{", t_nc): decl.add(m.group(1) + "-*")
und = sorted(k for k in ref if k not in decl and not any(d.endswith("-*") and k.startswith(d[:-1]) for d in decl) and not k.startswith("--tw-"))
for k in und: print(k, "<-", ", ".join(sorted(ref[k]))[:160])
