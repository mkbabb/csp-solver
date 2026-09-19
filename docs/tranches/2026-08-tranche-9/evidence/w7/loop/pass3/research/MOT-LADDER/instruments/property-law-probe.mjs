#!/usr/bin/env node
// T9-W7 pass-3 research · MOT-LADDER · THE NO-FALLBACK LAW, MEASURED
//
// Chair §6.5 names the motion rungs in the wave-wide no-fallback law: register the
// published token with `@property` + `initial-value`, publish before first paint, and let
// consumers write `var(--x)` with NO fallback "so an absent publisher fails at
// computed-value time and is caught by a born-RED row that deletes the publisher".
//
// The pass-2 ladder ships the opposite shape (byte-equal `var(--motion-x, Nms)` fallbacks,
// B3 holding them there). This probe measures which of the two claims is true in the two
// engines the estate ships to, with no product file touched: every case is a document
// handed to `page.setContent`.
//
// usage: node property-law-probe.mjs            (writes JSON to stdout)
//        OUT=<file> node property-law-probe.mjs

// registry-v2 §3.22: a scratch script under docs/ cannot resolve @playwright from its own
// directory. Resolve against the frontend's package.json instead of copying the instrument
// into the product tree.
import { createRequire } from "node:module";
const require = createRequire(
  (process.env.PW_ROOT ??
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend") +
    "/package.json"
);
const { chromium, webkit } = require("playwright");

const EASE = "--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);";
const PUB = "--motion-throw: 520ms;";
const REG_520 =
  '@property --motion-throw { syntax: "<time>"; inherits: true; initial-value: 520ms; }';
const REG_0 =
  '@property --motion-throw { syntax: "<time>"; inherits: true; initial-value: 0ms; }';
const REDUCE =
  "@media (prefers-reduced-motion: reduce) { :root { --motion-throw: 0ms; } }";

const doc = (head, rule) => `<!doctype html><html><head><style>
${head}
:root { ${EASE} }
.t { ${rule} }
</style></head><body><div class="t" id="t">x</div></body></html>`;

// each case: [id, what it proves, document]
const CASES = [
  [
    "A pub+fallback (pass-2 shape)",
    doc(`:root{${PUB}}`, "transition: opacity var(--motion-throw, 520ms) var(--ease-standard);"),
  ],
  [
    "B NO pub, fallback kept",
    doc(":root{}", "transition: opacity var(--motion-throw, 520ms) var(--ease-standard);"),
  ],
  [
    "C NO pub, no fallback, UNREGISTERED",
    doc(":root{}", "transition: opacity var(--motion-throw) var(--ease-standard);"),
  ],
  [
    "D NO pub, no fallback, @property initial 520ms",
    doc(REG_520, "transition: opacity var(--motion-throw) var(--ease-standard);"),
  ],
  [
    "E NO pub, no fallback, @property initial 0ms",
    doc(REG_0, "transition: opacity var(--motion-throw) var(--ease-standard);"),
  ],
  [
    "F pub + @property initial 0ms + reduce arm",
    doc(`${REG_0}\n:root{${PUB}}\n${REDUCE}`, "transition: opacity var(--motion-throw) var(--ease-standard);"),
  ],
  [
    "G pub + UNREGISTERED + reduce arm",
    doc(`:root{${PUB}}\n${REDUCE}`, "transition: opacity var(--motion-throw, 520ms) var(--ease-standard);"),
  ],
  [
    "H NO pub, no fallback, longhand only",
    doc(":root{}", "transition-property: opacity; transition-duration: var(--motion-throw);"),
  ],
  [
    "I NO pub, no fallback, ANIMATION shorthand",
    doc(
      ":root{}\n@keyframes k { from { opacity: 0 } to { opacity: 1 } }",
      "animation: k var(--motion-throw) var(--ease-standard) backwards;"
    ),
  ],
  [
    "J pub + @property initial 0ms, publisher wins",
    doc(`${REG_0}\n:root{${PUB}}`, "transition: opacity var(--motion-throw) var(--ease-standard);"),
  ],
  [
    "K @property inherits:false, read on a CHILD",
    doc(
      '@property --motion-throw { syntax: "<time>"; inherits: false; initial-value: 520ms; }\n:root{}',
      "transition: opacity var(--motion-throw) var(--ease-standard);"
    ),
  ],
];

const READ = () => {
  const el = document.getElementById("t");
  const cs = getComputedStyle(el);
  return {
    duration: cs.transitionDuration,
    property: cs.transitionProperty,
    timing: cs.transitionTimingFunction,
    animName: cs.animationName,
    animDuration: cs.animationDuration,
    tokenAtRoot: getComputedStyle(document.documentElement)
      .getPropertyValue("--motion-throw")
      .trim(),
    tokenAtEl: cs.getPropertyValue("--motion-throw").trim(),
  };
};

const out = { generated: new Date().toISOString(), engines: {} };

for (const [name, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  const rows = {};
  for (const regime of ["no-preference", "reduce"]) {
    const ctx = await browser.newContext({ reducedMotion: regime });
    const page = await ctx.newPage();
    for (const [id, html] of CASES) {
      await page.setContent(html);
      rows[`${regime} | ${id}`] = await page.evaluate(READ);
    }
    await ctx.close();
  }
  // does the engine register a <time> property at all?
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.setContent("<!doctype html><html><head></head><body></body></html>");
  rows["registerProperty API"] = await page.evaluate(() => {
    let api = false;
    try {
      CSS.registerProperty({
        name: "--probe-time",
        syntax: "<time>",
        inherits: true,
        initialValue: "123ms",
      });
      api = true;
    } catch {
      api = false;
    }
    return {
      cssRegisterProperty: api,
      supportsAtProperty: typeof CSSPropertyRule !== "undefined",
    };
  });
  await ctx.close();
  out.engines[name] = rows;
  await browser.close();
}

const text = JSON.stringify(out, null, 1);
if (process.env.OUT) {
  const { writeFileSync } = await import("node:fs");
  writeFileSync(process.env.OUT, text);
}
// terse table to stdout
for (const [engine, rows] of Object.entries(out.engines)) {
  console.log(`\n== ${engine} ==`);
  for (const [k, v] of Object.entries(rows)) {
    if (k === "registerProperty API") {
      console.log(`  ${k}: ${JSON.stringify(v)}`);
      continue;
    }
    console.log(
      `  ${k.padEnd(56)} dur=${v.duration.padEnd(6)} prop=${v.property.padEnd(8)} anim=${v.animName}/${v.animDuration} tok="${v.tokenAtRoot}"`
    );
  }
}
