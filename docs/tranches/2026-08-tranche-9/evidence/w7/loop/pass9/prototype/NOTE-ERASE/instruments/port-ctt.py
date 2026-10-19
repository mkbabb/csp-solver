# port-ctt.py <tree ctt> <union ctt> — port the tree's pass-9 registration plants onto the union's copy
import sys
t = open(sys.argv[1]).read(); p = sys.argv[2]; s = open(p).read()
a1 = "    const home = real(HOME);\n"
i = t.index(a1) + len(a1); j = t.index("    const dup =\n", i)
consts = t[i:j]
assert "JSREG" in consts and s.count(a1) == 1 and "JSREG" not in s
s = s.replace(a1, a1 + consts)
anchor = '        plantFile(HOME, `${home}\\n.x::before { content: "/*"; }\\n${dup}\\n/* */`),\n      ],\n'
assert t.count(anchor) == 1 and s.count(anchor) == 1, (t.count(anchor), s.count(anchor))
k = t.index(anchor) + len(anchor); m = t.index("    ];\n    for (const [label, opts, rel2, text2] of plants)", k)
block = t[k:m]
assert block.count("Pass 9, row 2") == 1
s = s.replace(anchor, anchor + block)
open(p, "w").write(s)
print("ported", len(consts), len(block))
