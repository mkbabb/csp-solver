import { test, expect } from "@playwright/test";
// PRM: frozen — emulateMedia reducedMotion before every goto (critic scratch; deleted at return).
test("forced-colours row: ablate the widened selector, does the tick still read CanvasText?", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext();
  const pages = [];
  const a = await ctx.newPage(); await a.emulateMedia({ reducedMotion: "reduce" }); await a.goto("./?size=3&difficulty=EASY&wire=local");
  await a.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => a.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  for (let i = 1; i < 6; i++) { const p = await ctx.newPage(); await p.emulateMedia({ reducedMotion: "reduce" }); await p.goto(a.url()); pages.push(p); }
  await expect(a.locator(".players-roster .player-row")).toHaveCount(6, { timeout: 90000 });
  const read = () => { const t = document.querySelector(".roster-tick path")!; const pr = document.createElement("div"); pr.style.color = "CanvasText"; document.body.appendChild(pr); const ct = getComputedStyle(pr).color; pr.remove(); return { tick: getComputedStyle(t).stroke, ct }; };
  await a.emulateMedia({ media: "screen", forcedColors: "active" });
  const before = await a.evaluate(read);
  const removed = await a.evaluate(() => { let n = 0; const walk = (list: CSSRuleList, owner: any) => { for (let i = list.length - 1; i >= 0; i--) { const r: any = list[i]; if (r.cssRules) walk(r.cssRules, r); if (r.selectorText && r.selectorText.includes(".roster-tick path")) { const sel = r.selectorText.split(",").map((s: string) => s.trim()).filter((s: string) => !s.includes(".roster-tick")); if (sel.length) r.selectorText = sel.join(", "); else owner.deleteRule(i); n++; } } }; for (const s of document.styleSheets) { try { walk(s.cssRules, s); } catch {} } return n; });
  await a.emulateMedia({ media: "screen", forcedColors: "none" }); await a.emulateMedia({ media: "screen", forcedColors: "active" });
  const after = await a.evaluate(read);
  console.log(`FORCED-ABLATION ${info.project.name}: rules edited ${removed} · before tick ${before.tick} (CanvasText ${before.ct}) · after ablation tick ${after.tick} · row would ${after.tick === after.ct ? "STILL PASS (cannot fail)" : "RED (can fail)"}`);
  await ctx.close();
});
