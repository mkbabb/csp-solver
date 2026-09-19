// Does the pinned head merely PAINT over the chip, or does it also take its taps?
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules";
const { chromium, webkit } = await import(`${NM}/playwright/index.mjs`);
for (const engine of ["chromium", "webkit"]) {
  const b = await (engine === "webkit" ? webkit : chromium).launch();
  const c = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, colorScheme: "light" });
  await c.addInitScript(() => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", "light"); } catch {} });
  const p = await c.newPage();
  await p.goto("http://127.0.0.1:4240/?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await p.waitForTimeout(1800);
  const r = await p.evaluate(async () => {
    const card = [...document.querySelectorAll(".controls-card")].find((e) => e.scrollHeight - e.clientHeight > 40);
    card.scrollTop = 500; await new Promise((r) => setTimeout(r, 400));
    const out = [];
    for (const h of card.querySelectorAll(".group-head")) {
      const hb = h.getBoundingClientRect();
      const cs = getComputedStyle(card);
      const top = card.getBoundingClientRect().top + card.clientTop + (parseFloat(cs.paddingTop) || 0);
      if (Math.abs(hb.top - top) > 3) continue;
      const grp = h.closest("[data-ruled-group]");
      for (const ctrl of grp.querySelectorAll("button")) {
        const cb = ctrl.getBoundingClientRect();
        const ov = Math.max(0, Math.min(cb.bottom, hb.bottom) - Math.max(cb.top, hb.top));
        if (ov <= 0.5) continue;
        // the point one third down the chip, inside the head's band
        const px = cb.x + cb.width / 2, py = cb.top + Math.min(ov / 2, cb.height / 3);
        const hit = document.elementFromPoint(px, py);
        out.push({
          head: grp.querySelector("h2")?.textContent.trim(),
          control: ctrl.textContent.trim().slice(0, 12),
          coveredPx: +ov.toFixed(1), coveredPct: +((ov / cb.height) * 100).toFixed(1),
          hitAt: hit ? `${hit.tagName.toLowerCase()}.${(hit.className.baseVal ?? hit.className ?? "").toString().split(" ").slice(0, 2).join(".")}` : null,
          hitIsTheControl: !!hit && (hit === ctrl || ctrl.contains(hit)),
        });
      }
    }
    return out;
  });
  console.log(engine, JSON.stringify(r, null, 1));
  await b.close();
}
