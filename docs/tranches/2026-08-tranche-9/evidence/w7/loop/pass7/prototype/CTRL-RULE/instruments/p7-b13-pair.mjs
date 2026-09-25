// T9-W7 pass 7 · CTRL-RULE — T9-B13(b)'s lawful pair (charter row 3): the RULED page (this tree) vs
// the INTEGRATED §10 page (`74a2b5d9 + pass6/integrate/s10.diff`), ONE payload, ONE engine, ONE DPR,
// ONE cell, ONE pose (drawer open and settled, the card scrolled to its END), both themes as two
// frames. Left = ruled (arm b), right = s10 (the fold's page). The only variable is the page.
// The given-set is read back through the aria-label corpus on both arms; the sun is parked (PRM).
// node p7-b13-pair.mjs <RULED_BASE> <S10_BASE> <OUTDIR>
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;
const [RULED, S10, OUTDIR] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await chromium.launch();
async function shoot(base, theme) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, colorScheme: theme, reducedMotion: "reduce" });
  await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, theme);
  const p = await ctx.newPage();
  await p.goto(`${base}?size=3&board=${BOARD}`); await p.waitForSelector(".sudoku-cell"); await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await p.waitForTimeout(1500);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().tap();
  let last = -1; for (let i = 0; i < 60; i++) { await p.waitForTimeout(100); const t = await p.evaluate(() => document.querySelector(".drawer-case").getBoundingClientRect().top); if (Math.abs(t - last) < 0.01) break; last = t; }
  await p.evaluate(() => { const c = document.querySelector(".controls-card"); c.scrollTop = c.scrollHeight; });
  await p.waitForTimeout(500);
  const m = await p.evaluate(() => {
    const cas = document.querySelector(".drawer-case").getBoundingClientRect(); const card = document.querySelector(".controls-card"); const foot = document.getElementById("card-foot")?.getBoundingClientRect();
    const givens = [...document.querySelectorAll("[aria-label]")].filter((e) => /given/i.test(e.getAttribute("aria-label"))).length;
    return { witness: { coarse: matchMedia("(pointer: coarse)").matches, givens }, box: { x: Math.max(0, Math.floor(cas.left)), y: Math.max(0, Math.floor(cas.top)), width: Math.floor(Math.min(cas.width, 390)), height: Math.floor(Math.min(cas.bottom, 844) - Math.max(0, cas.top)) },
      caseTop: +cas.top.toFixed(2), cardClientH: card.clientHeight, footH: foot ? +foot.height.toFixed(2) : null, rule: !!document.querySelector("#card-foot svg.ruled-line") };
  });
  const png = await p.screenshot({ clip: m.box });
  await ctx.close();
  return { png, m };
}
for (const theme of ["light", "dark"]) {
  const L = await shoot(RULED, theme), R = await shoot(S10, theme);
  const [ml, mr] = [await sharp(L.png).metadata(), await sharp(R.png).metadata()];
  const gap = 24, H = Math.max(ml.height, mr.height);
  const bg = theme === "light" ? "#ffffff" : "#000000";
  const name = `p7-b13b-ruled-vs-s10-chromium-${theme}-390x844-coarse-dpr2-scrollend.png`;
  const out = await sharp({ create: { width: ml.width + mr.width + gap, height: H, channels: 3, background: bg } })
    .composite([{ input: L.png, left: 0, top: H - ml.height }, { input: R.png, left: ml.width + gap, top: H - mr.height }])
    .png({ compressionLevel: 9 }).toFile(`${OUTDIR}/${name}`);
  console.log(name, JSON.stringify({ ruled: L.m, s10: R.m, bytes: out.size }));
}
await b.close();
