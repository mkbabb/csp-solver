import fs from 'node:fs'; import path from 'node:path';
const FE = process.env.FE;
const mod = await import(path.join(FE, 'scripts/check-theme-tokens.mjs'));
const { undefinedTokens } = mod;
const G = '--critic-ghost-ms';
const lam = path.join(FE, 'src/pencil/sheet/AnswerKeyLaminate.vue');
const lamT = fs.readFileSync(lam, 'utf8');
const onRoot = (attr) => lamT.replace(/<template>\s*<div\b/, (m) => `${m}\n    ${attr}`);
const idx = path.join(FE, 'src/assets/index.css'); const idxT = fs.readFileSync(idx, 'utf8');
const flip = path.join(FE, 'src/games/shared/useFlipGlide.ts'); const flipT = fs.readFileSync(flip, 'utf8');
const hit = (r, tok) => r.timing.some((x) => x.token === tok) || r.any.some((x) => x.token === tok) || r.masked.some((x) => x.token === tok);
const plants = {
  'X5 style= fallback on registered (sanity)': { [lam]: onRoot(`style="animation-duration: var(--motion-note, 280ms)"`) },
  'X5d :style OBJECT camelCase undeclared': { [lam]: onRoot(`:style="{ animationDuration: 'var(${G})' }"`) },
  'X5e :style OBJECT kebab key undeclared': { [lam]: onRoot(`:style="{ 'animation-duration': 'var(${G})' }"`) },
  'X5f :style OBJECT fallback on registered': { [lam]: onRoot(`:style="{ animationDuration: 'var(--motion-note, 280ms)' }"`) },
  'X6 script el.style.animationDuration = var(ghost)': { [flip]: flipT + `\nexport function __p(el: HTMLElement) { el.style.animationDuration = 'var(${G})'; }\n` },
  'X6b script setProperty(animation-duration, var(ghost))': { [flip]: flipT + `\nexport function __p(el: HTMLElement) { el.style.setProperty('animation-duration', 'var(${G})'); }\n` },
  'X6c WAAPI-free template stem var(--ease-\${x}) naming nothing': { [flip]: flipT + "\nexport function __p(el: HTMLElement, x: string) { el.style.transition = `opacity 200ms var(--ease-${x})`; }\n" },
  'X7 :not(.theme-turning) consumer of a turning-only token': { [idx]: idxT + `\nhtml.theme-turning { ${G}: 250ms; }\nhtml:not(.theme-turning) .critic-x { transition: opacity var(${G}) linear; }\n` },
  'X7b .theme-turning-done consumer (substring tail)': { [idx]: idxT + `\nhtml.theme-turning { ${G}: 250ms; }\n.theme-turning-done .critic-x { transition: opacity var(${G}) linear; }\n` },
  'X8 @media-declared, consumed in a DIFFERENT @media': { [idx]: idxT + `\n@media (min-width: 900px) { :root { ${G}: 250ms; } }\n@media (max-width: 400px) { .critic-x { transition: opacity var(${G}) linear; } }\n` },
  'X9 animation shorthand fallback on registered in <style>': { [idx]: idxT + `\n.critic-x { transition: opacity var(--motion-note, 250ms) linear; }\n` },
};
for (const [name, extra] of Object.entries(plants)) {
  const r = undefinedTokens(extra);
  const toks = [...r.timing, ...r.any].map((x) => x.token).concat(r.masked.map((x) => 'MASKED ' + x.token));
  console.log(`${hit(r, G) || hit(r, '--motion-note') || toks.length ? 'RED  ' : 'GREEN'} ${name}  [${toks.join(', ')}]`);
}
