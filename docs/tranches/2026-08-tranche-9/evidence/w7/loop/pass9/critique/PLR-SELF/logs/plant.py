import sys, pathlib
S = pathlib.Path(sys.argv[0]).parent
F = S / 'tree/web/frontend/src/pencil/chrome/PlayerMark'
name = sys.argv[1]
rb = (S/'orig/rowBudget.ts').read_text(); pm = (S/'orig/PlayerMark.vue').read_text()
def one(text, old, new):
    assert text.count(old) == 1, (name, old, text.count(old)); return text.replace(old, new)
if name == 'restore': pass
elif name == 'LAPONLY':   # disjunct: the area comparison and the null clause gone; any lap takes short
    rb = one(rb, "  if (!short) return true;\n  return covered(tall, board) > covered(short, board);", "  void short; void covered;\n  return true;")
elif name == 'GE':
    rb = one(rb, "covered(tall, board) > covered(short, board)", "covered(tall, board) >= covered(short, board)")
elif name == 'NOPRESS':
    pm = one(pm, "function onPress(e: PointerEvent): void {\n  owedAt = -Infinity;", "function onPress(e: PointerEvent): void {\n")
elif name == 'NOKEY':
    pm = one(pm, "function onKey(): void {\n  owedAt = -Infinity;", "function onKey(): void {\n")
elif name == 'NOPAID':
    pm = one(pm, "  const owed = e.timeStamp - owedAt < TAP_CLICK_MS;\n  owedAt = -Infinity;", "  const owed = e.timeStamp - owedAt < TAP_CLICK_MS;\n")
else: raise SystemExit('unknown plant')
(F/'rowBudget.ts').write_text(rb); (F/'PlayerMark.vue').write_text(pm)
print(name, 'planted')
