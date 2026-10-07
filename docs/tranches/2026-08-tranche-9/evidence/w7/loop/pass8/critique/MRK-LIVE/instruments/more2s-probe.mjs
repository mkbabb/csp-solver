// Proof of life for MORE2S / COARSE2S: the plant is in force on the logo-trigger stop and the ONE four-band probe reds it.
import { chromium, webkit } from "@playwright/test";
const edge = await import(new URL("./e2e/lib/edge-bands.mjs", `file://${process.cwd()}/`).href);
const base = process.argv[2] || "http://127.0.0.1:4238";
for (const [name, bt] of [["chromium", chromium], ["webkit", webkit]]) {
  for (const regime of ["more", "coarse", "none"]) {
    const b = await bt.launch();
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: regime === "coarse", reducedMotion: "reduce", contrast: regime === "more" ? "more" : "no-preference" });
    const page = await ctx.newPage();
    await page.goto(base + "/?game=sudoku");
    await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
    await page.waitForTimeout(1500);
    for (const key of ["button.logo-trigger", "button.sun-moon-toggle"]) {
      await page.keyboard.press("Tab");
      await page.evaluate((k) => { document.querySelectorAll("[data-crit]").forEach((e) => e.removeAttribute("data-crit")); const el = document.querySelector(k); el.setAttribute("data-crit", ""); el.scrollIntoView({ block: "center" }); el.focus(); }, key);
      await page.waitForTimeout(900);
      const st = await page.evaluate(() => ({ fv: document.activeElement?.matches(":focus-visible"), op: getComputedStyle(document.querySelector(".focus-ring") || document.body).opacity, outset: parseFloat(getComputedStyle(document.activeElement).getPropertyValue("--focus-ring-outset")) || 0 }));
      const r = await edge.fourBands(page, { subject: "[data-crit]", edge: ".focus-ring", out: Math.max(6, Math.ceil(st.outset) + 6), inn: Math.max(4, Math.ceil(-st.outset) + 6) });
      const med = r.bands ? Object.entries(r.bands).map(([s, x]) => `${s} ${x.coreMedian}`).join(" · ") : "-";
      console.log(`${name} ${regime.padEnd(6)} ${key.padEnd(22)} fv=${st.fv} ring-opacity=${st.op} → ${r.red ? "RED" : "GREEN"} ${med}${r.red ? " ⟨" + r.why.slice(0, 2).join("; ") + "⟩" : ""}`);
    }
    await b.close();
  }
}
