// census-plants7.mjs (MOT-VERB pass-7 critic): new SHAPES through undefinedTokens(extra); no tree byte touched.
import fs from 'node:fs'; import path from 'node:path';
const FE = process.env.FE;
const { undefinedTokens } = await import(path.join(FE, 'scripts/check-theme-tokens.mjs'));
const G = '--critic-ghost-ms';
const idx = path.join(FE, 'src/assets/index.css'); const idxT = fs.readFileSync(idx, 'utf8');
const th = path.join(FE, 'src/composables/useTheme.ts'); const thT = fs.readFileSync(th, 'utf8');
const scr = (body) => ({ [th]: thT + `\nexport function __p(el: HTMLElement, k: string, name: string) { ${body} }\n` });
const hit = (r, tok) => [...r.timing, ...r.any].some((x) => x.token.startsWith(tok)) || r.masked.some((x) => x.token.startsWith(tok));
const plants = {
  // controls the lane ships (sanity: must RED here too)
  'CTL s12 .style.x = var(ghost)': [scr(`el.style.animationDuration = "var(${G})";`), G],
  'CTL s14 :not(.theme-turning)': [{ [idx]: idxT + `\nhtml.theme-turning { ${G}: 250ms; }\nhtml:not(.theme-turning) .critic-x { transition: opacity var(${G}) linear; }\n` }, G],
  // new shapes
  'X15 stem that a declared token merely PREFIXES: var(--motion-${k}) (k free)': [scr('el.style.setProperty("animation-duration", `var(--motion-${k})`);'), '--motion-'],
  'X15b stem with a tail nothing declares: var(--verb-${k}-bogus)': [scr('el.style.setProperty("transition-timing-function", `var(--verb-${k}-bogus)`);'), '--verb-'],
  'X16 :is(.theme-turning, .critic) disjunction consumer': [{ [idx]: idxT + `\nhtml.theme-turning { ${G}: 250ms; }\nhtml:is(.theme-turning, .critic-any) .critic-x { transition: opacity var(${G}) linear; }\n` }, G],
  'X16b :where(.theme-turning, html) consumer': [{ [idx]: idxT + `\nhtml.theme-turning { ${G}: 250ms; }\n:where(.theme-turning, html) .critic-x { transition: opacity var(${G}) linear; }\n` }, G],
  'X17 setProperty with a COMPUTED property name': [scr(`el.style.setProperty(name, "var(${G})");`), G],
  'X18 value carried by a const, then written': [scr(`const v = "var(${G})"; el.style.animationDuration = v;`), G],
  'X19 Object.assign(el.style, {...})': [scr(`Object.assign(el.style, { animationDuration: "var(${G})" });`), G],
  'X20 style.cssText string': [scr(`el.style.cssText = "animation-duration: var(${G})";`), G],
};
for (const [name, [extra, tok]] of Object.entries(plants)) {
  const r = undefinedTokens(extra);
  const toks = [...r.timing, ...r.any].map((x) => x.token).concat(r.masked.map((x) => 'MASKED ' + x.token));
  console.log(`${hit(r, tok) ? 'RED  ' : 'GREEN'} ${name}  [${toks.join(', ')}]`);
}
