// CTRL-FACE pass 10 - every card control's ring, per BAND, one engine, one cell (the ledger's raw reading).
// usage: node bands10.mjs <frontend dir (for e2e/lib/edge-bands.mjs)> <engine> <url> <w> <h> <dpr> [plantCss]
// TOUCH=1 for the coarse cell. One browser, one context, closed in finally. Prints, per control, the
// sides its why-rows name (B1..B7 'side'), so a ledger keyed per control/band/engine reads it as is.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const [fe, eng, url, w, h, dpr, plant] = process.argv.slice(2);
const { fourBands } = await import(`${fe}/e2e/lib/edge-bands.mjs`);
const touch = process.env.TOUCH === "1";
const b = await (eng === "webkit" ? webkit : chromium).launch();
try {
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: +dpr, reducedMotion: "reduce", hasTouch: touch, isMobile: touch && eng !== "webkit" });
  const p = await ctx.newPage();
  await p.goto(url + "/?size=3&difficulty=EASY");
  await p.waitForSelector("svg.handwritten-logo");
  await p.waitForTimeout(1200);
  if (!(await p.locator(".controls-card:visible").first().isVisible().catch(() => false))) {
    const tab = p.locator(".drawer-tab");
    await (touch ? tab.tap() : tab.click());
    await p.waitForTimeout(900);
  }
  if (plant) await p.addStyleTag({ content: plant });
  const RP = "[data-ring-probe]";
  const names = await p.evaluate(() => {
    const root = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
    const foot = document.querySelector("#card-foot");
    const sel = 'button, [role="tab"], [tabindex="0"]';
    const els = [...root.querySelectorAll(sel), ...(foot ? foot.querySelectorAll(sel) : []), ...document.querySelectorAll(".drawer-tab")]
      .filter((e) => e.getClientRects().length && !e.closest("[inert]") && !e.disabled);
    els.forEach((e, i) => e.setAttribute("data-rc", String(i)));
    return els.map((e) => `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 2).join(".")} "${(e.getAttribute("aria-label") || e.textContent || "").trim().replace(/\s+/g, " ").slice(0, 18)}"`);
  });
  let reds = 0;
  for (const [i, name] of names.entries()) {
    await p.keyboard.press("Shift");
    await p.keyboard.press("Tab");
    await p.evaluate((i) => {
      document.querySelectorAll("[data-ring-probe]").forEach((e) => e.removeAttribute("data-ring-probe"));
      const e = document.querySelector(`[data-rc="${i}"]`);
      e.setAttribute("data-ring-probe", "");
      e.focus();
    }, i);
    await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const r = await fourBands(p, { subject: RP, edge: RP, out: 8, inn: 0, off: `${RP} { outline-color: transparent !important; }` });
    const sides = [...new Set(r.why.map((x) => /^B\d (top|right|bottom|left)\b/.exec(x)?.[1] ?? "*"))];
    if (r.red) reds++;
    if (process.env.DUMP === String(i)) console.log("DUMP", JSON.stringify({ box: r.box, dpr: r.dpr, bands: r.bands }));
    const bands = r.bands ? Object.entries(r.bands).map(([k, v]) => `${k} ${v.coreMedian}/d${v.thickness}/h${v.holeFrac}${v.occluder ? " occ " + v.occluder : ""}`).join(" · ") : "-";
    console.log(`${i} ${r.red ? "RED  " : "GREEN"} ${name} thin=[${r.red ? sides.join(",") : ""}] ${bands}${r.red ? " | " + r.why.join("; ").slice(0, 300) : ""}`);
  }
  console.log(`SUMMARY ${eng} ${w}x${h}@${dpr}${touch ? " coarse" : ""} controls ${names.length} red ${reds}`);
  await ctx.close();
} finally {
  await b.close();
}
