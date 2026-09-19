import { chromium, webkit } from "playwright";
const run = async (engine, name) => {
  const b = await engine.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 3 });
  const page = await ctx.newPage();
  await page.goto("http://127.0.0.1:4248/?size=3&difficulty=EASY");
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1800);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(900);
  }
  // Playwright's own ARIA snapshot of the card — role-based, engine-independent contract.
  let aria = "n/a";
  try { aria = await page.locator(".controls-card").ariaSnapshot(); } catch (e) { aria = "ariaSnapshot err: " + e.message; }
  const headings = aria.split("\n").filter((l) => /heading/.test(l)).map((l) => l.trim());
  let cdp = "n/a";
  if (name === "chromium") {
    const c = await ctx.newCDPSession(page);
    await c.send("Accessibility.enable");
    const { nodes } = await c.send("Accessibility.getFullAXTree");
    cdp = nodes.filter((n) => n.role?.value === "heading" && !n.ignored)
      .map((n) => (n.name?.value ?? "") + " [lvl " + (n.properties?.find(p=>p.name==="level")?.value?.value ?? "?") + "]");
  }
  console.log(`\n=== ${name} ===`);
  console.log("playwright ariaSnapshot headings:", JSON.stringify(headings, null, 1));
  console.log("CDP full AX tree headings (unignored):", JSON.stringify(cdp, null, 1));
  await b.close();
};
await run(chromium, "chromium");
await run(webkit, "webkit");
