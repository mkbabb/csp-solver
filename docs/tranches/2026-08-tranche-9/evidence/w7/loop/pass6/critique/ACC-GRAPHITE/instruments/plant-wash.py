import sys
p, sel, media = sys.argv[1], sys.argv[2], sys.argv[3] == "1"
M = "color-mix(in srgb, var(--color-pencil-graphite) 3%, transparent)"
rule = f"{sel} {{ --ground-wash-unit: {M}; }}"
if media: rule = "@media (prefers-contrast: more) {\n  " + rule + "\n}"
open(p, "a").write("\n" + rule + "\n")
