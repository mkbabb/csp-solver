exec(open('/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/edits/two.py').read())
g='src/games/shared/gameCell.css'; t=open(g).read()
o='  stroke-width: 7;\n  stroke-opacity: 0.95;'
assert t.count(o)==1
t=t.replace(o,'  stroke-width: 7;\n  stroke-opacity: 1; /* BALLOT ARM (U-10): tier 2 at full ink; it ties the invalid rung */')
open(g,'w').write(t)
