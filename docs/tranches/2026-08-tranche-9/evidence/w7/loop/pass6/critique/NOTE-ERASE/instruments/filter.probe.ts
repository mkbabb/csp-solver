import { test } from "@playwright/test";
import { boardReady, armHint, PROTO, CONTROL } from "./lib";
for (const scheme of ["light", "dark"] as const)
  test(`filter census ${scheme}`, async ({ browser }, info) => {
    const out: Record<string, unknown> = {};
    for (const [arm, base] of [["tree", PROTO], ["control", CONTROL]] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: scheme });
      const page = await ctx.newPage();
      await boardReady(page, base);
      const count = () => page.evaluate(() => {
        const hits: string[] = [];
        for (const el of document.querySelectorAll("*")) {
          const f = getComputedStyle(el).filter;
          if (f && f !== "none") hits.push(`${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 2).join(".")} ${f.slice(0, 40)}`);
        }
        return { n: hits.length, js: [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s)), hits };
      });
      const atLoad = await count();
      await armHint(page, 0);
      const armed = await count();
      out[arm] = { load: atLoad.n, armed: armed.n, js: atLoad.js, hits: armed.hits };
      await ctx.close();
    }
    console.log(`ERASECRIT6F|${info.project.name}|${scheme}|${JSON.stringify(out)}`);
  });
