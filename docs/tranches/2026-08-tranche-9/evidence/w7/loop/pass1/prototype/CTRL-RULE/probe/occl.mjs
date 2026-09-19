// THE PINNED HEAD'S OWN DEFECT, measured: a head that holds at the card's top is opaque, and
// the field it names scrolls UNDER it. `scroll-margin-top` answers a FOCUS; it does not answer
// an eye. This reads the fraction of each control covered by a pinned head at five scroll
// states — the same shape as I2, one rung down.
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const PORT = process.argv[2] || "4230";

async function run(engine, w, h, mobile, sheet) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: mobile && engine === "chromium" ? true : undefined,
    hasTouch: mobile,
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/?size=3&difficulty=EASY`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1600);
  if (sheet) {
    if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
      await page.locator(".drawer-tab").click({ force: true });
      await page.waitForTimeout(950);
    }
  }
  const r = await page.evaluate(async () => {
    const card = [...document.querySelectorAll(".controls-card")].find(
      (e) => e.scrollHeight - e.clientHeight > 40,
    );
    if (!card) return { error: "no scrollport" };
    const rows = [];
    for (const st of [0, 160, 327, 500, 99999]) {
      card.scrollTop = st;
      await new Promise((r) => setTimeout(r, 280));
      const at = Math.round(card.scrollTop);
      // A sticky child is offset from its scrollport's PADDING edge, never its client box —
      // the card's own `--card-pad-t` note says so at its other end.
      const cs = getComputedStyle(card);
      const cl = {
        top:
          card.getBoundingClientRect().top +
          card.clientTop +
          (parseFloat(cs.paddingTop) || 0),
        bottom:
          card.getBoundingClientRect().top + card.clientTop + card.clientHeight,
      };
      let worst = 0,
        who = null;
      for (const head of card.querySelectorAll(".group-head")) {
        const hb = head.getBoundingClientRect();
        // PINNED = held AT the scrollport's top edge and still on screen. A head that has
        // scrolled clean past the edge satisfies `top <= edge` too and occludes nothing.
        if (Math.abs(hb.top - cl.top) > 3 || hb.bottom <= cl.top + 1) continue;
        const grp = head.closest(".ruled-group");
        for (const ctrl of grp.querySelectorAll("button, [tabindex='0']")) {
          const b = ctrl.getBoundingClientRect();
          if (b.height < 2) continue;
          const ov =
            Math.max(0, Math.min(b.bottom, hb.bottom) - Math.max(b.top, hb.top)) /
            Math.max(1, b.height);
          if (ov > worst) {
            worst = ov;
            who = (ctrl.textContent || "").trim().slice(0, 16);
          }
        }
      }
      rows.push({ at, worst: +(worst * 100).toFixed(1), who });
    }
    card.scrollTop = 0;
    return rows;
  });
  await browser.close();
  return r;
}

for (const engine of ["chromium", "webkit"]) {
  for (const [w, h, mobile, sheet, name] of [
    [1440, 900, false, false, "rail-1440x900"],
    [1280, 800, false, false, "desk-1280x800"],
    [390, 844, true, true, "dock-390x844"],
  ]) {
    const r = await run(engine, w, h, mobile, sheet);
    console.log(
      `${name}/${engine}`,
      Array.isArray(r) ? r.map((x) => `${x.at}:${x.worst}%(${x.who})`).join(" · ") : JSON.stringify(r),
    );
  }
}
