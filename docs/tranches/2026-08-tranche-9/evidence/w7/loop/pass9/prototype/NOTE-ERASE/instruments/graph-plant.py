# graph-plant.py <ctt> — the outside-src plant reaches the row ONLY through the module graph (not the handed list)
import sys
p = sys.argv[1]; s = open(p).read()
def rep(a, b):
    global s
    assert s.count(a) == 1, (p[-50:], a[:60], s.count(a)); s = s.replace(a, b)
rep('''        "plant-x/x.css",
        dup,
      ],''', '''        "plant-x/x.css",
        dup,
        // Reached ONLY through main.ts's import (never handed to the library in `files`), so the
        // row is GREEN on this plant with the module-graph clause off (SHAPE_SABOTAGE=module-graph).
        "graph",
      ],''')
rep("    for (const [label, opts, rel2, text2] of plants) {\n      // a two-file plant: the second file rides the first's read\n",
    "    for (const [label, opts, rel2, text2, reach] of plants) {\n      // a two-file plant: the second file rides the first's read (and, unless `reach` is \"graph\",\n      // is handed to the library in `files` as well)\n")
rep("              files: opts.files.includes(abs2) ? opts.files : [...opts.files, abs2],",
    "              files:\n                reach === \"graph\" || opts.files.includes(abs2)\n                  ? opts.files\n                  : [...opts.files, abs2],")
open(p, "w").write(s); print("ok", p[-60:])
