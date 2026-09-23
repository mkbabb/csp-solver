/**
 * ACC-FIVE pass 5 · shared pieces: the `?board=` payload minted in four lines from the control's
 * own givens (NOTE-LEDGER's critic's graft; LAWS P4), the read-back that proves both arms dealt
 * it, the computed-PAINT census (tag + paint + rect, every element), and a settle poll.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
export const { chromium, webkit } = pw;

/** Givens read at REST off a freshly dealt board (every filled cell is a given before any act). */
export const READ_GIVENS = () => {
  const out = [];
  document.querySelectorAll(".sudoku-cell").forEach((cell, i) => {
    const v = cell.querySelector("input")?.value ?? "";
    out.push(v ? Number(v) : 0);
  });
  return out;
};

/** THE FOUR LINES: base64url of \x01 + "<size>.<cells base36>". */
export const mint = (size, cells) =>
  Buffer.from(String.fromCharCode(1) + `${size}.${cells.map((c) => c.toString(36)).join("")}`, "latin1")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

/** Mint once off the control; returns { payload, query, givens }. */
export async function mintFromControl(ctrlBase) {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto(ctrlBase + "/?size=3&difficulty=EASY");
  await p.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await p.waitForTimeout(2500);
  const cells = await p.evaluate(READ_GIVENS);
  await b.close();
  const payload = mint(3, cells);
  return { payload, query: `/?size=3&board=${payload}`, givens: cells.filter(Boolean).length, cells };
}

/** Both arms must read back the same given-set, or the row is unpinned. */
export async function assertSameBoard(page, cells) {
  const got = await page.evaluate(READ_GIVENS);
  const same = got.length === cells.length && got.every((v, i) => v === cells[i]);
  if (!same) throw new Error(`board read-back differs: ${got.filter(Boolean).length} givens vs ${cells.filter(Boolean).length}`);
  return true;
}

export const PAINT = [
  "color", "backgroundColor", "fontFamily", "fontSize", "fontWeight", "lineHeight",
  "letterSpacing", "borderTopWidth", "borderTopColor", "opacity", "stroke", "strokeWidth",
  "fill", "filter", "outlineStyle", "boxShadow",
];

export const CENSUS = (paintKeys) => {
  const out = [];
  const path = (el) => {
    const bits = [];
    let n = el;
    while (n && n !== document.body && bits.length < 7) {
      const p = n.parentElement;
      const i = p ? [...p.children].indexOf(n) : 0;
      bits.unshift(`${n.tagName.toLowerCase()}[${i}]`);
      n = p;
    }
    return bits.join(">");
  };
  document.querySelectorAll("*").forEach((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const paint = {};
    for (const k of paintKeys) paint[k] = cs[k];
    out.push({
      key: path(el) + "|" + (el.getAttribute("class") ?? ""),
      tag: el.tagName.toLowerCase(),
      rect: [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 10) / 10),
      paint,
    });
  });
  return out;
};

export function diffCensus(a, b, paintKeys = PAINT) {
  const A = new Map(a.map((r) => [r.key, r]));
  const B = new Map(b.map((r) => [r.key, r]));
  const paint = [];
  const rect = [];
  let shared = 0;
  for (const [k, ra] of A) {
    const rb = B.get(k);
    if (!rb) continue;
    shared++;
    if (ra.tag !== rb.tag) paint.push({ key: k, prop: "TAG", a: ra.tag, b: rb.tag });
    for (const p of paintKeys)
      if (ra.paint[p] !== rb.paint[p]) paint.push({ key: k, prop: p, a: ra.paint[p], b: rb.paint[p] });
    if (ra.rect.some((v, i) => Math.abs(v - rb.rect[i]) > 0.5)) rect.push({ key: k, a: ra.rect, b: rb.rect });
  }
  return {
    nodesA: a.length,
    nodesB: b.length,
    shared,
    onlyA: [...A.keys()].filter((k) => !B.has(k)),
    onlyB: [...B.keys()].filter((k) => !A.has(k)),
    paint,
    rect,
  };
}

/** Poll a page expression until it reads the same 3 times 120 ms apart (≤ 6 s). */
export async function settled(page, fn, arg) {
  let last = null;
  let same = 0;
  const t0 = Date.now();
  while (Date.now() - t0 < 6000) {
    const v = JSON.stringify(await page.evaluate(fn, arg));
    if (v === last) {
      if (++same >= 2) return { value: JSON.parse(v), ms: Date.now() - t0 };
    } else same = 0;
    last = v;
    await page.waitForTimeout(120);
  }
  return { value: JSON.parse(last), ms: Date.now() - t0, unsettled: true };
}

const lin = (c) => {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
};
export const Y = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
export const ratio = (a, b) => {
  const [hi, lo] = [Y(a), Y(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
export const rgbOf = (s) => (s.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);

export async function hints(page, n = 3) {
  for (let i = 0; i < n; i++) {
    await page.evaluate(() => {
      const b = document.querySelector('[aria-label*="Hint" i]');
      if (b && !b.disabled) b.click();
    });
    await page.waitForTimeout(300);
  }
  await page.evaluate(() => document.activeElement?.blur?.());
}
