import sys, hashlib
C = '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/place8/copy/web/frontend/'
PM = 'src/pencil/chrome/PlayerMark/PlayerMark.vue'
P = {
    'YIELD': (PM, 'const CHART_YIELDS = false;', 'const CHART_YIELDS = true;'),
    'LIST': ('src/App.vue', 'const PLACE_CHART = true;', 'const PLACE_CHART = false;'),
    'REFIT': (PM, '  window.addEventListener("resize", refit);\n  document.addEventListener("transitionend", onSettle);\n', '  // PLANT REFIT: both re-fit listeners struck\n'),
    'BAND': (PM, '  passing = e.pointerType === "touch" && outside(e);\n', '  passing = false; // PLANT BAND\n'),
    'BAND_TE': (PM, '  if (TAP_IS_A_LOOK && !passing) e.preventDefault();\n', '  e.preventDefault(); // PLANT BAND_TE\n'),
    'ARMA_TE': (PM, '  if (TAP_IS_A_LOOK && !passing) e.preventDefault();\n', '  if (!passing) e.preventDefault(); // PLANT ARMA_TE (pass-8 first cut)\n'),
    'BAND_CLOSE': (PM, '  if (passing) return close();\n', '  if (passing) return; // PLANT BAND_CLOSE\n'),
    'BAND_EDGE': (PM, '    e.clientY > r.bottom\n  );', '    e.clientY > r.bottom + 4 // PLANT BAND_EDGE\n  );'),
    'SEAM_A': (PM, 'const TAP_IS_A_LOOK = true;', 'const TAP_IS_A_LOOK = false;'),
    'E4': (PM, '    @click="close"\n    @touchend="onSheetTouchEnd"\n', '    @touchend="onSheetTouchEnd"\n'),
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
