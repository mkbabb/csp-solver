// CTRL-FACE pass-1 — IS THE `p` REALLY GEORGIA?
// The cmap diff says the Fraunces cut has no U+0070, so "pencils" and "players" must paint
// their p in the Georgia fallback mid-word. `document.fonts.check` denies it, so the claim is
// settled by ADVANCE: a codepoint the face cannot draw advances exactly as the fallback does.
const { webkit, chromium } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs",
);
const BASE = process.env.BASE || "http://127.0.0.1:4235/";
for (const [eng, L] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await L.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await p.waitForTimeout(1600);
  console.log(`--- ${eng}`, JSON.stringify(await p.evaluate(() => {
    const c = document.createElement("canvas").getContext("2d");
    const adv = (s, f) => { c.font = f; return +c.measureText(s).width.toFixed(3); };
    const F = '800 25.888px "Fraunces", Georgia, serif';
    const G = "800 25.888px Georgia, serif";
    const out = {};
    for (const ch of ["p", "e", "n", "c", "i", "l", "s", "a", "y", "r"])
      out[ch] = { face: adv(ch, F), georgia: adv(ch, G), fellBack: Math.abs(adv(ch, F) - adv(ch, G)) < 0.001 };
    out["pencils"] = { face: adv("pencils", F), georgia: adv("pencils", G) };
    out["players"] = { face: adv("players", F), georgia: adv("players", G) };
    out["checking"] = { face: adv("checking", F), georgia: adv("checking", G) };
    return out;
  }), null, 1));
  await b.close();
}
