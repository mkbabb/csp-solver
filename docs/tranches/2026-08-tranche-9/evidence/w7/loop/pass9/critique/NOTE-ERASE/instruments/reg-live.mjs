// Does each escaped script spelling REGISTER --motion-whisper with inherits:false in a real engine? (blank page, both engines)
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const { chromium, webkit } = require("@playwright/test");
const D = `{ name: "--motion-whisper", syntax: "<time>", inherits: false, initialValue: "0ms" }`;
const SP = {
  none: ``,
  call: `CSS.registerProperty.call(CSS, ${D});`,
  optional: `CSS.registerProperty?.(${D});`,
  reflect: `Reflect.apply(CSS.registerProperty, CSS, [${D}]);`,
  comma: `(0, CSS.registerProperty)(${D});`,
  computed: `const k9 = "registerProperty"; CSS[k9](${D});`,
  assigned: `let r9; r9 = CSS.registerProperty.bind(CSS); r9(${D});`,
};
for (const [ename, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await eng.launch();
  for (const [k, code] of Object.entries(SP)) {
    const p = await b.newPage(); await p.setContent(`<div id=a style="--motion-whisper: 900ms"><span id=b></span></div>`);
    const r = await p.evaluate((c) => { let err = null; try { (0, eval)(c); } catch (e) { err = String(e); }
      return { child: getComputedStyle(document.getElementById("b")).getPropertyValue("--motion-whisper").trim(), err }; }, code);
    console.log(`${ename} ${k}: child reads ${JSON.stringify(r.child)} ${r.err ?? ""} => ${r.child === "0s" || r.child === "0ms" ? "REGISTERED inherits:false" : "not registered (inherits)"}`);
  }
  await b.close();
}
