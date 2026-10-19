import sys, pathlib
p = pathlib.Path(sys.argv[1]); t = p.read_text()
anchor = '      ["drawn PIN: the source authors 1.4",'
assert t.count(anchor) == 1
row = '      ["CRIT thickTol 0.5 beside the roster, 1 px frame", { subject: "#f-thin", edge: ".f-thin-edge", drawn: "head-sheet", drawnSource: SRC(1.5), thickTol: 0.5 }, "RED", "B3"],\n'
p.write_text(t.replace(anchor, row + anchor)); print('tol plant in')
