// T9-W7 pass-1 CRITIC — the reading nobody took: the GUARD RIBBON's destructive verb.
// `.guard-go { color: var(--color-red-ink) }` on `.guard-face { background: color-mix(in srgb,
// var(--color-foreground) 8%, transparent) }` over `--color-card`. Computed from the tree's own
// tokens in a live document, both themes, both engines — no arming required for the ink maths,
// and the ribbon is armed beside it where the board can be dirtied.
import { chromium, webkit } from "playwright";
const BASE = "http://127.0.0.1:4240/";

const probe = () => {
  const cs = getComputedStyle(document.documentElement);
  const tok = (n) => cs.getPropertyValue(n).trim();
  const px = (color, bgColor) => {
    const d = document.createElement("div");
    d.style.cssText = `position:fixed;left:-9999px;width:10px;height:10px;background:${bgColor}`;
    document.body.appendChild(d);
    const resolved = getComputedStyle(d).backgroundColor;
    d.remove();
    return resolved;
  };
  const parse = (c) => {
    let m = /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)$/.exec(c);
    if (m) return [+m[1] * 255, +m[2] * 255, +m[3] * 255, m[4] === undefined ? 1 : +m[4]];
    m = /^rgba?\(([^)]+)\)$/.exec(c);
    if (m) { const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; }
    return null;
  };
  const lum = (r) => { const f = (x) => { const v = x / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r[0]) + 0.7152 * f(r[1]) + 0.0722 * f(r[2]); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +(((x + 0.05) / (y + 0.05))).toFixed(2); };

  const card = parse(px(null, "var(--color-card)"));
  const red = parse(px(null, "var(--color-red-ink)"));
  const fg = parse(px(null, "var(--color-foreground)"));
  const face = parse(px(null, "color-mix(in srgb, var(--color-foreground) 8%, transparent)"));
  // the 8% face composited over the card
  const faceOn = [0, 1, 2].map((k) => face[k] * face[3] + card[k] * (1 - face[3]));
  const keepOn = card;
  return {
    tokens: { card: tok("--color-card"), red: tok("--color-red-ink"), fg: tok("--color-foreground"), verb: tok("--type-verb"), caption: tok("--type-caption") },
    resolved: { card: card.map(Math.round), red: red.map(Math.round), face: face.map((v) => +v.toFixed(3)), faceOverCard: faceOn.map((v) => +v.toFixed(1)) },
    RATIOS: {
      "guard-go (clear) ink on its 8% face": ratio(red, faceOn),
      "guard-go ink on bare card (if the face were absent)": ratio(red, card),
      "guard-keep ink on card": ratio(fg, keepOn),
      "the 8% face against the card (the 'marked' cue itself)": ratio(faceOn, card),
    },
    verbFontPx: (() => {
      const d = document.createElement("span");
      d.style.cssText = "position:fixed;left:-9999px;font-size:var(--type-verb)";
      document.body.appendChild(d);
      const v = getComputedStyle(d).fontSize; d.remove(); return v;
    })(),
  };
};

for (const engine of ["chromium", "webkit"]) {
  for (const scheme of ["light", "dark"]) {
    const browser = await (engine === "webkit" ? webkit : chromium).launch();
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: engine === "chromium" ? true : undefined, colorScheme: scheme });
    const page = await ctx.newPage();
    await page.addInitScript(`try{localStorage.clear();localStorage.setItem("sudoku-color-scheme","${scheme}")}catch{}`);
    await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await page.waitForTimeout(1500);
    const r = await page.evaluate(probe);
    console.log(`\n### ${engine} / ${scheme}`);
    console.log("  tokens   ", JSON.stringify(r.tokens));
    console.log("  resolved ", JSON.stringify(r.resolved));
    console.log("  verb font", r.verbFontPx);
    for (const [k, v] of Object.entries(r.RATIOS)) console.log(`  ${v.toFixed(2).padStart(6)}:1  ${k}${v < 4.5 && k.includes("ink") ? "   <-- UNDER 4.5" : ""}`);
    await browser.close();
  }
}
