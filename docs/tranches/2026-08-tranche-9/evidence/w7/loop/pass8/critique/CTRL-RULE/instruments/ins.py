import sys
p = sys.argv[1]
s = open(p).read()
A = '''  test("CRIT8 row 28 · the critic's plants on the flat phone (both engines) and under CDP 34 (chromium)", async ({ page, browserName }) => {
    const cdp = browserName === "chromium" ? await page.context().newCDPSession(page) : null;
    const read = async (bottom: number) => {
      if (cdp) await cdp.send("Emulation.setSafeAreaInsetsOverride" as never, { insets: { top: 0, left: 0, right: 0, bottom } } as never);
      await OPEN(page);
    };
    const PL: [string, string][] = [
      ["none (shipped)", ""],
      ["K1 net-zero stack", "#card-foot { padding-bottom: calc(0.15rem - env(safe-area-inset-bottom) + env(safe-area-inset-bottom)) !important; }"],
      ["K13 logical longhand padding-block-end .15rem", "#card-foot { padding-block-end: 0.15rem !important; }"],
      ["K14 logical shorthand padding-block 0 0 .15rem", "#card-foot { padding-block: 0 0.15rem !important; }"],
      ["K15 translate 0 3px", "#card-foot { translate: 0 3px !important; }"],
      ["K16 margin-bottom -3px", "#card-foot { margin-bottom: -3px !important; }"],
      ["P7 E4 max() coarse (pass-7 plant FIRST)", "@media (pointer: coarse) { .card-foot { padding-bottom: max(0.15rem, env(safe-area-inset-bottom)) !important; } }"],
    ];
    for (const bottom of cdp ? [0, 34] : [0]) {
      await read(bottom);
      for (const [name, css] of PL) {
        const tag = css ? await page.addStyleTag({ content: css }) : null;
        await SHEET_SETTLED(page);
        const served = await SERVED_PAD(page);
        const padB = await page.evaluate(() => getComputedStyle(document.getElementById("card-foot")!).paddingBottom);
        const ink = await LOWEST_INK(page);
        const clears = ink === null ? null : +(844 - bottom - ink).toFixed(2);
        const flatVerdict = bottom === 0 ? (SERVED_OK(served) && parseFloat(padB) > 0 && clears !== null && clears >= 2 ? "GREEN" : "RED") : (clears !== null && clears >= 2 ? "GREEN" : "RED");
        console.log(`[CRIT8 row28] ${browserName} inset ${bottom} | ${name} | servedOK ${SERVED_OK(served)} | pad ${padB} | lowest ${ink} | clears ${clears} | arm ${flatVerdict} | ${JSON.stringify(served)}`);
        if (tag) await tag.evaluate((n) => (n as Element).remove());
      }
    }
  });

'''
anchor = '  test("row 28 · paint under a real inset (chromium CDP)'
assert s.count(anchor) == 1
s = s.replace(anchor, A + anchor)
B = '''
for (const cell of [
  { name: "1280x800 fine", use: { viewport: { width: 1280, height: 800 } } },
  { name: "390x844 coarse", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
]) {
  test.describe(`CRIT8 M18 clause matrix @ ${cell.name}`, () => {
    test.use(cell.use);
    for (const theme of ["light", "dark"] as const) {
      test(`${theme}: M18 clause matrix under the critic's plants`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: theme });
        await page.addInitScript((t) => { try { localStorage.setItem("sudoku-color-scheme", t); } catch { /* */ } }, theme);
        await loadSudoku(page);
        if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await page.locator(".drawer-tab").tap();
        await SHEET_SETTLED(page);
        const sw = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector("#card-foot svg.ruled-line path")!).strokeWidth));
        const S = "#card-foot svg.ruled-line";
        const G = "var(--color-pencil-graphite, var(--grid-line-color))";
        const PL: [string, string][] = [
          ["shipped", ""],
          ["P7-C1 path stroke-opacity .81 (pass-7 critic, plain)", `${S} path { stroke-opacity: .81; }`],
          ["P7-C2 path opacity .81 (pass-7 critic, plain)", `${S} path { opacity: .81; }`],
          ["P7-C3 svg filter opacity(.81) (pass-7 critic, plain)", `${S} { filter: opacity(.81); }`],
          ["K-mask81 svg mask alpha .81", `${S} { -webkit-mask-image: linear-gradient(rgb(0 0 0 / .81), rgb(0 0 0 / .81)) !important; mask-image: linear-gradient(rgb(0 0 0 / .81), rgb(0 0 0 / .81)) !important; }`],
          ["K-anc-filter .action-bar filter opacity(.81)", `#card-foot .action-bar { filter: opacity(.81) !important; }`],
          ["K-width stroke-width x0.55", `${S} path { stroke-width: ${(sw * 0.55).toFixed(3)} !important; }`],
          ["K-mix88 stroke graphite 88%", `${S} path { stroke: color-mix(in srgb, ${G} 88%, transparent) !important; }`],
          ["K-mix75 stroke graphite 75%", `${S} path { stroke: color-mix(in srgb, ${G} 75%, transparent) !important; }`],
          ["K-blend svg mix-blend-mode luminosity", `${S} { mix-blend-mode: luminosity !important; }`],
        ];
        for (const [name, css] of PL) {
          const tag = css ? await page.addStyleTag({ content: css }) : null;
          const d = await FOOT_RULE(page);
          const c = d ? FOOT_RULE_CLAUSES(d) : null;
          const failing = c ? Object.entries(c).filter(([, v]) => !v).map(([k]) => k) : ["null"];
          console.log(`[CRIT8 M18] ${cell.name} ${theme} | ${name} | HOLDS ${FOOT_RULE_HOLDS(d)} | failing [${failing.join(",")}] | alpha ${d?.alpha?.toFixed?.(3)} chain ${d?.chain?.toFixed?.(3)} quarters ${JSON.stringify(d?.quarters?.map((q) => q.median))} core ${d?.coreMedian} st<3 ${d?.stationsUnder3}`);
          if (tag) await tag.evaluate((n) => (n as Element).remove());
        }
      });
    }
  });
}
'''
s = s + B
open(p, "w").write(s)
print("ok")
