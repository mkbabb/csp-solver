import { test, expect, type Page } from "@playwright/test";
// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before every goto (scratch instrument, PAL-TIN pass 7).
// F1 (SELF_TAKES_A_HAND YES | NO) re-shot on the CONST, no URL arm: one payload, a room of two (A hosts, B joins
// under the pinned id p-0000000b0b0b), A writes cell 11 and B cell 12; A's board photographed. The one
// variable between the arms is the const (YES = the tree on :4245, NO = a replica with the const false on :4246).
const BOARD = "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS = "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const OUT = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/paltin7-frames";
async function boot(p: Page, url: string) {
  await p.emulateMedia({ reducedMotion: "reduce" });
  await p.goto(url);
  await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
for (const [arm, base] of [["YES", "http://127.0.0.1:4245/"], ["NO", "http://127.0.0.1:4246/"]] as const)
  test(`F1 ${arm}`, async ({ browser }, info) => {
    test.setTimeout(300_000);
    const ctx = await browser.newContext();
    const a = await ctx.newPage();
    await boot(a, `${base}?board=${BOARD}&wire=local`);
    expect(await a.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""))).toBe(GIVENS);
    await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
    await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
    const b = await ctx.newPage();
    await b.addInitScript(([r, id]) => sessionStorage.setItem("session-identity-v1", JSON.stringify({ [r]: id })), [new URL(a.url()).searchParams.get("s")!, "p-0000000b0b0b"] as const);
    await boot(b, a.url());
    for (const p of [a, b]) await expect(p.locator(".controls-card .players-roster .player-row")).toHaveCount(2, { timeout: 60000 });
    await a.locator(".sudoku-cell input").nth(11).click();
    await a.locator(".sudoku-cell input").nth(11).fill("5");
    await b.locator(".sudoku-cell input").nth(12).click();
    await b.locator(".sudoku-cell input").nth(12).fill("7");
    await expect.poll(() => a.locator(".sudoku-cell input").nth(12).inputValue()).toBe("7");
    await b.locator(".sudoku-cell input").nth(GIVENS.indexOf("3")).click({ force: true });
    await a.locator(".sudoku-cell input").nth(GIVENS.indexOf("3")).click({ force: true });
    await a.mouse.move(2, 2);
    await a.waitForTimeout(1500); // sleep-ok: the ink settles before a byte is read (PRM)
    const ink = await a.evaluate(() => [11, 12].map((n) => { const c = document.querySelectorAll<HTMLElement>(".game-cell")[n]; const p = c.querySelector(".glyph-svg path"); return `cell ${n} --color-user-ink=${getComputedStyle(c).getPropertyValue("--color-user-ink").trim()} stroke=${p ? getComputedStyle(p).stroke : "none"}`; }));
    const b0 = (await a.locator(".game-cell").nth(10).boundingBox())!;
    const b1 = (await a.locator(".game-cell").nth(13).boundingBox())!;
    const clip = { x: Math.floor(b0.x - 4), y: Math.floor(b0.y - 4), width: Math.ceil(b1.x + b1.width - b0.x + 8), height: Math.ceil(b0.height + 8) };
    await a.screenshot({ clip, path: `${OUT}/f1-${info.project.name}-${arm}.png` });
    console.log(`FRAME F1 ${info.project.name} ${arm} dpr ${await a.evaluate(() => devicePixelRatio)} · ${ink.join(" · ")} · clip ${JSON.stringify(clip)}`);
    await ctx.close();
  });
