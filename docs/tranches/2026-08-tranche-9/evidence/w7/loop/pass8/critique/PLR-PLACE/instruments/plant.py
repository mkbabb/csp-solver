import sys, hashlib
C = '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-place8/p7/web/frontend/'
PM = 'src/pencil/chrome/PlayerMark/PlayerMark.vue'
P = {
    'LIST': ('src/App.vue', 'const PLACE_CHART = true;', 'const PLACE_CHART = false;'),
    # the pass-7 plant, first (pass7 plant.py TOUCHEND: the touchend handler struck)
    'TOUCHEND': (PM, '    @touchend="onSheetTouchEnd"\n', '    data-plant-touchend\n'),
    # clause-sabotage battery on outside(): each disjunct deleted in turn
    'NO_LEFT': (PM, '    e.clientX < r.left ||\n', '    // PLANT NO_LEFT\n'),
    'NO_RIGHT': (PM, '    e.clientX > r.right ||\n', '    // PLANT NO_RIGHT\n'),
    'NO_TOP': (PM, '    e.clientY < r.top ||\n', '    // PLANT NO_TOP\n'),
    'NO_BOTTOM': (PM, '    e.clientY < r.top ||\n    e.clientY > r.bottom\n', '    e.clientY < r.top\n'),
    'NO_TOUCHKEY': (PM, '  passing = e.pointerType === "touch" && outside(e);\n', '  passing = outside(e);\n'),
    'BAND': (PM, '  passing = e.pointerType === "touch" && outside(e);\n', '  passing = false;\n'),
}
name, act = sys.argv[1], sys.argv[2]
f, a, b = P[name]
p = C + f
s = open(p).read()
if act == 'restore':
    a, b = b, a
assert s.count(a) == 1, (name, act, s.count(a))
open(p, 'w').write(s.replace(a, b))
print(name, act, f, hashlib.sha1(open(p, 'rb').read()).hexdigest()[:12])
