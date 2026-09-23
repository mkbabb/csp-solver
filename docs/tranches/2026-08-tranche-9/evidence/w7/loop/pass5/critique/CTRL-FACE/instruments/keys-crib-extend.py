import sys
W=sys.argv[1]
src=open(W+"/e2e/keys-crib.spec.ts").read()
a="""for (const [w, h] of [
  [1280, 800],
  [1024, 768],
] as const) {
  for (const start of ["top", "end"] as const) {"""
assert a in src
src=src.replace(a,"""for (const [w, h] of [
  [1440, 900],
  [1280, 720],
  [1280, 800],
] as const) {
  for (const start of ["top", "end"] as const) for (const how of ["click", "enter"] as const) {""")
b="from the ${start}`"
assert b in src
src=src.replace(b,"from the ${start}, ${how}`")
c="async function press(page: Page) {"
assert c in src
src=src.replace(c,"""async function press(page: Page) {
  if ((globalThis as any).__how === "enter") {
    await page.evaluate((card) => {
      const c = [...document.querySelectorAll(card)].find((x) => x.getClientRects().length)!;
      (c.querySelector(".action-bar .info-btn") as HTMLElement).focus({ preventScroll: true });
    }, CARD);
    await page.keyboard.press("Enter");
    return;
  }""")
d="await load(page, w, h);"
assert d in src
src=src.replace(d,"(globalThis as any).__how = how;\n      await load(page, w, h);")
open(W+"/.facecrit/specs/keys-crib-ext.spec.ts","w").write(src)
print("ok")
