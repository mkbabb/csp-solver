/**
 * T9-W7 pass 2 · MRK-ABS research — the HEAD census of the three surfaces pass 1 never read,
 * plus the carrier list for the outline fade. Read-only, HEAD tree, :4238.
 *
 * FOUR READINGS:
 *   1  TRANSITION — every tab stop's computed `transition-property`/`-duration`, and whether
 *      `outline-color` is in that list. This is the fade's carrier census, engine-independent:
 *      a stop that lists outline-color CANNOT paint its ring same-frame.
 *   2  DECK — `?view=gallery` is the route that mounts `.staging-face`; `.guard-face` needs a
 *      dirty board and a DIFFERENT card. Both faces' focus rule, geometry and ground, plus the
 *      centre card's ring measured against the scrollport (the HEAD arm the deck never had).
 *   3  DOCK — the portrait sheet (`.drawer-case`) OPENED and settled 700ms: every focusable
 *      inside it, its outline, and whether its ring's reach clears the sheet's own edge.
 *   4  TABWALK — a real Tab walk with a per-step settle, both engines, so the "one colour"
 *      claim can carry its settle in its wording.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import process from "node:process";
import { dirname, join } from "node:path";

const OUT = process.env.PROBE_OUT ?? join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (name: string, data: unknown) =>
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(data, null, 2));

async function setTheme(page: Page, dark: boolean) {
  await page.evaluate((d) => {
    document.documentElement.classList.toggle("dark", d);
  }, dark);
  await page.waitForTimeout(150);
}

/** Computed focus facts for one element. */
const FACTS = `(n) => {
  const cs = getComputedStyle(n);
  const r = n.getBoundingClientRect();
  return {
    tag: n.tagName.toLowerCase(),
    cls: (n.className && n.className.baseVal !== undefined ? n.className.baseVal : n.className || "").toString().slice(0, 60),
    outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor,
    outlineOffset: cs.outlineOffset,
    borderRadius: cs.borderRadius,
    transitionProperty: cs.transitionProperty,
    transitionDuration: cs.transitionDuration,
    fadesOutline: /\\boutline-color\\b|\\ball\\b/.test(cs.transitionProperty),
    rect: [Math.round(r.x*100)/100, Math.round(r.y*100)/100, Math.round(r.width*100)/100, Math.round(r.height*100)/100],
    focusVisible: n.matches(":focus-visible"),
  };
}`;

test("1-transition-carriers", async ({ page, browserName }) => {
  await page.goto("/");
  await page.waitForSelector(".game-cell", { timeout: 20000 });
  await page.waitForTimeout(600);
  const rows = await page.evaluate((factsSrc) => {
    const facts = eval(factsSrc) as (n: Element) => Record<string, unknown>;
    const sel =
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const out: Record<string, unknown>[] = [];
    const seen = new Set<string>();
    for (const n of Array.from(document.querySelectorAll(sel))) {
      const f = facts(n) as { cls: string; transitionProperty: string };
      const key = `${f.cls}|${f.transitionProperty}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(f);
    }
    return out;
  }, FACTS);
  const carriers = rows.filter((r) => r.fadesOutline);
  bank(`transition-${browserName}`, { stops: rows.length, carriers, rows });
  console.log(
    `[transition ${browserName}] ${rows.length} distinct stop classes, ${carriers.length} fade their outline:`,
  );
  for (const c of carriers)
    console.log(`   ${c.cls} :: ${c.transitionProperty} @ ${c.transitionDuration}`);
});

test("2-deck", async ({ page, browserName }) => {
  const report: Record<string, unknown> = { engine: browserName };
  for (const dark of [false, true]) {
    const theme = dark ? "dark" : "light";
    await page.goto("/?view=gallery");
    await page.waitForSelector(".gallery-viewport", { timeout: 20000 });
    await setTheme(page, dark);
    await page.waitForTimeout(700);

    const deck = await page.evaluate((factsSrc) => {
      const facts = eval(factsSrc) as (n: Element) => Record<string, unknown>;
      const vp = document.querySelector(".gallery-viewport") as HTMLElement | null;
      const cards = Array.from(document.querySelectorAll(".game-card"));
      const centre = document.querySelector(".game-card.is-center");
      const stagingBtns = Array.from(document.querySelectorAll(".staging-btn"));
      const stagingFaces = Array.from(document.querySelectorAll(".staging-face"));
      return {
        viewportFound: !!vp,
        viewportOutlineStyle: vp ? getComputedStyle(vp).outlineStyle : null,
        viewportRect: vp
          ? (() => {
              const r = vp.getBoundingClientRect();
              return [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 100) / 100);
            })()
          : null,
        cards: cards.length,
        centre: centre ? facts(centre) : null,
        stagingBtns: stagingBtns.length,
        stagingFaces: stagingFaces.map((f) => facts(f)),
      };
    }, FACTS);

    // The centre card's ring, with the viewport actually focused (the deck is an
    // aria-activedescendant listbox: DOM focus stays on the scrollport).
    await page.evaluate(() => {
      (document.querySelector(".gallery-viewport") as HTMLElement | null)?.focus();
    });
    await page.waitForTimeout(250);
    const ring = await page.evaluate((factsSrc) => {
      const facts = eval(factsSrc) as (n: Element) => Record<string, unknown>;
      const vp = document.querySelector(".gallery-viewport") as HTMLElement;
      const centre = document.querySelector(".game-card.is-center") as HTMLElement | null;
      const cards = Array.from(document.querySelectorAll(".game-card")) as HTMLElement[];
      const vr = vp.getBoundingClientRect();
      const measure = (c: HTMLElement) => {
        const cs = getComputedStyle(c);
        const r = c.getBoundingClientRect();
        const off = parseFloat(cs.outlineOffset) || 0;
        const w = parseFloat(cs.outlineWidth) || 0;
        const reach = off + w;
        const airLeft = r.left - vr.left;
        const airRight = vr.right - r.right;
        return {
          outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor,
          offset: cs.outlineOffset,
          borderRadius: cs.borderRadius,
          reach,
          airLeft: Math.round(airLeft * 100) / 100,
          airRight: Math.round(airRight * 100) / 100,
          headroom: Math.round((Math.min(airLeft, airRight) - reach) * 100) / 100,
          whole: Math.min(airLeft, airRight) >= reach,
        };
      };
      return {
        activeDescendant: vp.getAttribute("aria-activedescendant"),
        focused: document.activeElement === vp,
        centre: centre ? measure(centre) : null,
        ends: [measure(cards[0]), measure(cards[cards.length - 1])],
        ownersWithRing: cards.filter((c) => getComputedStyle(c).outlineStyle !== "none").length,
      };
    }, FACTS);

    // The staging verbs: focus each and read the FACE (the node the ring rides).
    const staging: unknown[] = [];
    const btns = await page.locator(".staging-btn").all();
    for (let i = 0; i < btns.length; i++) {
      await btns[i].evaluate((n: HTMLElement) => n.focus());
      await page.waitForTimeout(200);
      staging.push(
        await page.evaluate(
          ({ factsSrc, i }) => {
            const facts = eval(factsSrc) as (n: Element) => Record<string, unknown>;
            const b = document.querySelectorAll(".staging-btn")[i] as HTMLElement;
            const face = b.querySelector(".staging-face") as HTMLElement;
            const cs = getComputedStyle(face);
            const ground = getComputedStyle(face).backgroundColor;
            return {
              btn: facts(b),
              face: facts(face),
              faceGround: ground,
              cardGround: getComputedStyle(document.body).backgroundColor,
              btnFocusVisible: b.matches(":focus-visible"),
            };
          },
          { factsSrc: FACTS, i },
        ),
      );
    }

    // THE GUARD FACE: dirty the board, come back, pick a DIFFERENT card, press Enter.
    let guard: unknown = { armed: false };
    try {
      await page.goto("/");
      await page.waitForSelector(".game-cell input", { timeout: 20000 });
      await setTheme(page, dark);
      const empty = page
        .locator(".game-cell input:not([readonly])")
        .filter({ hasNot: page.locator("[disabled]") });
      await empty.first().focus();
      await page.keyboard.press("1");
      await page.waitForTimeout(400);
      await page.evaluate(() => {
        const u = new URL(location.href);
        u.searchParams.set("view", "gallery");
        history.replaceState(null, "", u.toString());
      });
      await page.reload();
      await page.waitForSelector(".gallery-viewport", { timeout: 20000 });
      await setTheme(page, dark);
      await page.waitForTimeout(600);
      await page.evaluate(() => {
        (document.querySelector(".gallery-viewport") as HTMLElement | null)?.focus();
      });
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(700);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(900);
      guard = await page.evaluate((factsSrc) => {
        const facts = eval(factsSrc) as (n: Element) => Record<string, unknown>;
        const btns = Array.from(document.querySelectorAll(".guard-btn")) as HTMLElement[];
        if (!btns.length) return { armed: false, note: document.body.innerText.slice(0, 200) };
        btns[0].focus();
        return {
          armed: true,
          stops: btns.length,
          btn: facts(btns[0]),
          face: facts(btns[0].querySelector(".guard-face")!),
          faceGround: getComputedStyle(btns[0].querySelector(".guard-face")!).backgroundColor,
          noteGround: getComputedStyle(
            btns[0].closest(".guard-note") ?? document.body,
          ).backgroundColor,
          focusVisible: btns[0].matches(":focus-visible"),
        };
      }, FACTS);
    } catch (e) {
      guard = { armed: false, error: String(e).slice(0, 160) };
    }

    report[theme] = { deck, ring, staging, guard };
  }
  bank(`deck-${browserName}`, report);
  console.log(`[deck ${browserName}]`, JSON.stringify(report, null, 1).slice(0, 4000));
});

test("3-dock-sheet", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 393, height: 699 });
  const report: Record<string, unknown> = { engine: browserName, viewport: "393x699" };
  for (const dark of [false, true]) {
    const theme = dark ? "dark" : "light";
    await page.goto("/");
    await page.waitForSelector(".game-cell", { timeout: 20000 });
    await setTheme(page, dark);
    await page.waitForTimeout(500);

    const shut = await page.evaluate(() => {
      const tab = document.querySelector(".drawer-tab") as HTMLElement | null;
      const cas = document.querySelector(".drawer-case") as HTMLElement | null;
      const r = (n: Element | null) => {
        if (!n) return null;
        const b = n.getBoundingClientRect();
        return [b.x, b.y, b.width, b.height].map((v) => Math.round(v * 100) / 100);
      };
      return { tab: r(tab), case: r(cas), caseTransform: cas ? getComputedStyle(cas).transform : null };
    });

    await page.locator(".drawer-tab").first().click();
    await page.waitForTimeout(900); // THE SHEET SLIDES — settle before measuring.

    const open = await page.evaluate((factsSrc) => {
      const facts = eval(factsSrc) as (n: Element) => Record<string, unknown>;
      const cas = document.querySelector(".drawer-case") as HTMLElement | null;
      if (!cas) return { found: false };
      const cr = cas.getBoundingClientRect();
      const cs = getComputedStyle(cas);
      const stops = Array.from(
        cas.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      ) as HTMLElement[];
      const rows = stops.map((n) => {
        const f = facts(n) as { rect: number[] };
        const st = getComputedStyle(n);
        const off = parseFloat(st.outlineOffset) || 0;
        const w = parseFloat(st.outlineWidth) || 0;
        // If the token lands (2px @ offset 3), this is what the ring would reach; the sheet's
        // own padding is what has to hold it.
        const tokenReach = 3 + 2;
        const r = n.getBoundingClientRect();
        return {
          ...f,
          clipLeft: Math.round((r.left - cr.left) * 100) / 100,
          clipRight: Math.round((cr.right - r.right) * 100) / 100,
          clipTop: Math.round((r.top - cr.top) * 100) / 100,
          clipBottom: Math.round((cr.bottom - r.bottom) * 100) / 100,
          ringWouldClip:
            Math.min(r.left - cr.left, cr.right - r.right, r.top - cr.top, cr.bottom - r.bottom) <
            tokenReach,
          headOutlineReach: off + w,
        };
      });
      return {
        found: true,
        caseRect: [cr.x, cr.y, cr.width, cr.height].map((v) => Math.round(v * 100) / 100),
        overflow: cs.overflow + " / " + cs.overflowX + " / " + cs.overflowY,
        ground: cs.backgroundColor,
        transform: cs.transform,
        stops: rows.length,
        clipped: rows.filter((r) => r.ringWouldClip).length,
        rows,
      };
    }, FACTS);

    report[theme] = { shut, open };
  }
  bank(`dock-${browserName}`, report);
  const l = report.light as { open: { stops?: number; clipped?: number; caseRect?: number[]; overflow?: string } };
  console.log(
    `[dock ${browserName}] light: ${l.open.stops} stops inside the sheet, ${l.open.clipped} would clip a 3+2 ring; case ${JSON.stringify(l.open.caseRect)} overflow ${l.open.overflow}`,
  );
});

test("4-tabwalk-settle", async ({ page, browserName }) => {
  await page.goto("/");
  await page.waitForSelector(".game-cell", { timeout: 20000 });
  await page.waitForTimeout(700);
  const out: Record<string, unknown[]> = {};
  for (const settle of [40, 400]) {
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
    await page.keyboard.press("Escape");
    const rows: unknown[] = [];
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(settle);
      rows.push(
        await page.evaluate(() => {
          const a = document.activeElement as HTMLElement | null;
          if (!a || a === document.body) return { stop: "body" };
          const cs = getComputedStyle(a);
          return {
            cls: (a.className || "").toString().slice(0, 40),
            tag: a.tagName.toLowerCase(),
            outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor,
            offset: cs.outlineOffset,
          };
        }),
      );
    }
    out[`settle${settle}`] = rows;
  }
  const colours = (rows: unknown[]) =>
    new Set(
      rows
        .map((r) => (r as { outline?: string }).outline)
        .filter((o): o is string => !!o && !o.includes("none")),
    );
  bank(`tabwalk-${browserName}`, {
    engine: browserName,
    settle40Colours: [...colours(out.settle40)],
    settle400Colours: [...colours(out.settle400)],
    ...out,
  });
  console.log(
    `[tabwalk ${browserName}] 40ms settle: ${colours(out.settle40).size} painted colours; 400ms settle: ${colours(out.settle400).size}`,
  );
});
