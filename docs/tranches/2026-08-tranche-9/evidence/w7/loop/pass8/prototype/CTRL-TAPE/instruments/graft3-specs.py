import sys
HELPER = '''
/** T9-M12 (pass 8, CTRL-TAPE's landing of CTRL-COST's pointer-agnostic ask): a destructive verb on a
 *  DIRTY board (undo depth > 0 — a deal is on the spine, so a freshly dealt board counts) asks first
 *  at EVERY pointer, and only its own word in the foot's ribbon acts. A pristine board acts on the
 *  press. The helper presses, then answers the question when one stands (it is the press's subject
 *  that these rows read, not the ask — the ask has its own rows in zone-grammar and the unit suite). */
async function pressDestructive(page: Page, verb: string, answer: string) {
  await page.locator(verb).click();
  const ask = page.locator('#card-foot .confirm-ribbon');
  if (await ask.waitFor({ state: 'visible', timeout: 1500 }).then(() => true, () => false))
    await ask.getByRole('button', { name: answer, exact: true }).click();
}
'''
for p in sys.argv[1:]:
    s = open(p).read()
    if 'async function pressDestructive' in s: continue
    n0 = s.count('.click()')
    if p.endswith('sudoku-interaction.spec.ts'):
        s = s.replace("""  await page.locator('.controls-card button[aria-label="Deal a new board"]').click();""", """  await pressDestructive(page, '.controls-card button[aria-label="Deal a new board"]', 'deal');""", 1)
        s = s.replace("""  await page.locator('.drawer-case button[aria-label="Solve puzzle"]').click();""", """  await pressDestructive(page, '.drawer-case button[aria-label="Solve puzzle"]', 'solve');""", 1)
        anchor = 'async function loadApp(page: Page) {'
    else:
        s = s.replace("""  await page.locator('.drawer-case button[aria-label="Solve puzzle"]').click();""", """  await pressDestructive(page, '.drawer-case button[aria-label="Solve puzzle"]', 'solve');""")
        anchor = 'async function loadSudoku(page: Page'
    i = s.index(anchor)
    s = s[:i] + HELPER.lstrip('\n') + '\n' + s[i:]
    open(p, 'w').write(s)
    print(p.split('/')[-1], 'clicks', n0, '->', s.count('.click()'), 'helper calls', s.count('pressDestructive(page'))
