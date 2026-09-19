// One extra element on a solo board is one too many — this says which. Dumps a tag.class
// histogram off whatever is served on the port, so HEAD and the prototype can be diffed.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const label = process.argv[2] ?? "proto";
const url = "http://127.0.0.1:4245/?size=3&difficulty=EASY&wire=local";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
await p.goto(url);
await p.waitForSelector(".game-cell", { timeout: 60000 });
await p.waitForTimeout(1600);
const h = await p.evaluate(() => {
  const out = {};
  for (const e of document.querySelectorAll("*")) {
    const k = `${e.tagName.toLowerCase()}.${(e.getAttribute("class") || "-").split(/\s+/)[0]}`;
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
});
writeFileSync(
  `/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tinproto/hist-${label}.json`,
  JSON.stringify(h, null, 1),
);
console.log(label, Object.values(h).reduce((a, c) => a + c, 0));
await b.close();
