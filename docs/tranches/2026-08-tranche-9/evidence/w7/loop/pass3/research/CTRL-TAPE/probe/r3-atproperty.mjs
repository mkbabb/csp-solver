// T9-W7 pass 3 · RESEARCH · CTRL-TAPE — what `@property` actually does to the no-fallback chain.
//
// The chair's §6.5 asks for two things in one sentence: register every measured token with an
// `initial-value`, AND let an absent publisher fail at computed-value time so a born-RED row
// catches it. This probe asks whether both can be true of one token, on the two engines the
// wave ships on, using the estate's own chain shape (`scene.css:556` / `:600`) in isolation:
//
//   --sheet-chrome: max(12rem, calc(var(--masthead-foot) + 8px - var(--case-offset)));
//   .card { max-height: calc(100dvh - var(--sheet-chrome) - 1.5rem); }
//
// No dev server, no product file: about:blank plus an injected sheet, so the answer is the
// engines' and not this estate's layout. Readings bank beside this file.
//
//   node r3-atproperty.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, webkit } = require(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js",
);
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../readings/r3-atproperty.json");

const CASES = {
  // A · the estate's chain today: no registration, no fallback, no publisher.
  bare: `
    .card { --sheet-chrome: max(12rem, calc(var(--mf) + 8px - var(--co)));
            max-height: calc(100dvh - var(--sheet-chrome) - 1.5rem); }`,
  // B · registered <length> with a computationally-independent initial value.
  registered: `
    @property --mf { syntax: "<length>"; inherits: true; initial-value: 0px; }
    @property --co { syntax: "<length>"; inherits: true; initial-value: 0px; }
    .card { --sheet-chrome: max(12rem, calc(var(--mf) + 8px - var(--co)));
            max-height: calc(100dvh - var(--sheet-chrome) - 1.5rem); }`,
  // C · the same registration written with a RELATIVE initial value (12rem). Per
  // css-properties-values-api the initial value must be computationally independent, so this
  // rule is expected to be dropped — the question is whether it is dropped SILENTLY.
  relInitial: `
    @property --mf { syntax: "<length>"; inherits: true; initial-value: 12rem; }
    @property --co { syntax: "<length>"; inherits: true; initial-value: 0px; }
    .card { --sheet-chrome: max(12rem, calc(var(--mf) + 8px - var(--co)));
            max-height: calc(100dvh - var(--sheet-chrome) - 1.5rem); }`,
};

const read = async (page, css, publish) =>
  page.evaluate(
    ([css, publish]) => {
      document.querySelectorAll("style[data-probe],div.card").forEach((n) => n.remove());
      const s = document.createElement("style");
      s.dataset.probe = "1";
      s.textContent = css;
      document.head.append(s);
      const card = document.createElement("div");
      card.className = "card";
      card.textContent = "x";
      document.body.append(card);
      if (publish === "good") {
        document.documentElement.style.setProperty("--mf", "117.75px");
        document.documentElement.style.setProperty("--co", "-6.18px");
      } else if (publish === "junk") {
        document.documentElement.style.setProperty("--mf", "banana");
        document.documentElement.style.setProperty("--co", "0px");
      } else {
        document.documentElement.style.removeProperty("--mf");
        document.documentElement.style.removeProperty("--co");
      }
      const cs = getComputedStyle(card);
      const root = getComputedStyle(document.documentElement);
      return {
        rootMf: JSON.stringify(root.getPropertyValue("--mf")),
        cardChrome: JSON.stringify(cs.getPropertyValue("--sheet-chrome")),
        maxHeight: cs.maxHeight,
        // the estate's own consequence: an invalid cap means the card is its content's height
        clientH: card.clientHeight,
      };
    },
    [css, publish],
  );

const results = {};
for (const [name, launch] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launch.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("about:blank");
  results[name] = {
    supportsAtProperty: await page.evaluate(() => CSS.supports("(--x: 0)") && typeof CSS.registerProperty === "function"),
  };
  for (const [cname, css] of Object.entries(CASES)) {
    for (const publish of ["none", "good", "junk"]) {
      results[name][`${cname}/${publish}`] = await read(page, css, publish);
    }
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
