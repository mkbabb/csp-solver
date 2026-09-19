import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
for (const [en, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  for (const [srv, base] of [["head","http://127.0.0.1:4230"],["proto","http://127.0.0.1:4232"]]) {
    const b = await eng.launch();
    const c = await b.newContext({ baseURL: base, viewport: { width: 390, height: 844 } });
    const p = await c.newPage();
    await p.goto("/?view=gallery&size=3&difficulty=EASY");
    await p.waitForSelector(".staging-band", { timeout: 30000 });
    await p.waitForTimeout(800);
    const snap = await p.locator("body").ariaSnapshot();
    const heads = snap.split("\n").filter(l => /heading/.test(l)).map(l=>l.trim());
    const dom = await p.evaluate(() => {
      const card = document.querySelector(".controls-card");
      const drawer = document.querySelector("#controls-drawer");
      const hid = (el) => el ? { inert: el.hasAttribute("inert"), ariaHidden: el.getAttribute("aria-hidden"), display: getComputedStyle(el).display, vis: getComputedStyle(el).visibility } : null;
      return { card: hid(card), drawer: hid(drawer) };
    });
    console.log(`== ${en}|${srv}  AX headings (${heads.length}):`);
    for (const h of heads) console.log("   ", h);
    console.log("    dom:", JSON.stringify(dom));
    await c.close(); await b.close();
  }
}
