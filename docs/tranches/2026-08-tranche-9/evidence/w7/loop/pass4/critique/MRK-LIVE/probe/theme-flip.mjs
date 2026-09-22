import { webkit } from "playwright";
const b = await webkit.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: "dark" });
const p = await ctx.newPage();
await p.goto("http://127.0.0.1:4246/?game=sudoku");
await p.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
await p.waitForTimeout(1500);
const read = () => p.evaluate(() => ({
  theme: document.documentElement.dataset.theme ?? document.documentElement.className,
  bg: getComputedStyle(document.body).backgroundColor,
  rings: document.querySelectorAll(".focus-ring").length,
}));
console.log("BEFORE", JSON.stringify(await read()));
const box = await p.locator(".sun-moon-toggle").first().boundingBox();
await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await p.mouse.down(); await p.mouse.up();
await p.waitForTimeout(1200);
console.log("AFTER ", JSON.stringify(await read()));
await b.close();
