# line2-dark.py <union spec> — line two's ghost arm and its in-run negative in the DARK theme too (charter row 1: both themes)
import sys
p = sys.argv[1]; s = open(p).read()
def rep(a, b):
    global s
    assert s.count(a) == 1, (a[:70], s.count(a)); s = s.replace(a, b)
rep("async function lineTwoLeaves(page: Page, css: string) {\n  await holdDeal(page, 'light', css",
    "async function lineTwoLeaves(page: Page, css: string, scheme: 'light' | 'dark' = 'light') {\n  await holdDeal(page, scheme, css")
anchor = "for (const adv of LINE_TWO_ADVERSARIES.filter((a) => /layer|shorthand|:root/.test(a.name)))"
add = '''// Line two's ghost arm and its in-run negative in the DARK theme as well (the arms above read light).
test('drop clock, line two: the ghost name is a zero-length leave — dark', async ({ page }) => {
  const leave = await lineTwoLeaves(page, `${TWO} { animation-name: ${GHOST} !important; }`, 'dark');
  expect(leave.animationName).toBe(GHOST);
  expect(leave.animationDuration).toBe('0s');
  expect(leave.ms).toBeLessThan(MOTION.rungs.whisper);
  expect(leave.painted).toBeLessThanOrEqual(2);
  console.log(
    `line two dark ghost: ${leave.ms} ms, ${leave.painted} connected / ${leave.visible} visible frames`,
  );
});

test('drop clock, line two (negative, in-run): the pass-8 name key holds a GHOST rub-out — dark', async ({
  page,
}) => {
  await page.addInitScript(NAME_KEY);
  const leave = await lineTwoLeaves(page, `${TWO} { animation-name: ${GHOST} !important; }`, 'dark');
  expect(leave.animationName).toBe(GHOST);
  expect(leave.animationDuration).toBe(`${MOTION.rungs.whisper / 1000}s`);
  expect(leave.ms).toBeGreaterThanOrEqual(MOTION.rungs.whisper);
  console.log(
    `line two dark ghost negative: held ${leave.ms} ms, ${leave.painted} connected / ${leave.visible} visible frames`,
  );
});

'''
rep(anchor, add + anchor)
open(p, "w").write(s); print("ok")
