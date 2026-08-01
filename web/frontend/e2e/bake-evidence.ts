import type { Page, TestInfo } from "@playwright/test";

/**
 * Attach the baked pose stack to a failing test, so an EMPTY bake arrives attributable.
 *
 * CI run 30684983201 red `wordmark-integrity`'s `killer` row on the ubuntu runner with
 * "no ink in the baked pose at all" and shipped nothing to attribute it with: the throttle
 * config declared no HTML reporter, so `playwright-report/` carried the GOLDEN config's
 * report and the `test-results/` paths the log printed were never uploaded. Both specs that
 * read a baked bitmap now attach what they read BEFORE they assert on it — the pose's own
 * PNG bytes, its href, its intrinsic size, and whether the page face was loaded at read time
 * — so the next occurrence carries its own evidence instead of a message.
 *
 * `selector` names the pose `<image>` whose bitmap is under assertion. Best-effort: any
 * failure here is swallowed, because evidence collection must never become the failure.
 */
export async function attachBakeEvidence(
  page: Page,
  testInfo: TestInfo,
  selector: string,
  name: string,
): Promise<void> {
  try {
    const ev = await page.evaluate(async (sel: string) => {
      const nodes = [...document.querySelectorAll(sel)];
      const href = nodes[0]?.getAttribute("href") ?? null;
      const png = href
        ? await fetch(href)
            .then((r) => r.blob())
            .then(
              (b) =>
                new Promise<string | null>((ok) => {
                  const fr = new FileReader();
                  fr.onload = () => ok(String(fr.result).split(",")[1] ?? null);
                  fr.onerror = () => ok(null);
                  fr.readAsDataURL(b);
                }),
            )
            .catch(() => null)
        : null;
      const size = href
        ? await new Promise<{ w: number; h: number } | null>((ok) => {
            const i = new Image();
            i.onload = () => ok({ w: i.naturalWidth, h: i.naturalHeight });
            i.onerror = () => ok(null);
            i.src = href;
          })
        : null;
      return {
        poseCount: nodes.length,
        href,
        hrefs: nodes.map((n) => n.getAttribute("href")),
        intrinsic: size,
        fontsStatus: document.fonts?.status ?? "(no FontFaceSet)",
        frauncesLoaded: document.fonts?.check?.('900 52px "Fraunces"') ?? null,
        png,
      };
    }, selector);

    const { png, ...meta } = ev;
    await testInfo.attach(`${name}-bake.json`, {
      body: JSON.stringify(meta, null, 1),
      contentType: "application/json",
    });
    if (png) {
      await testInfo.attach(`${name}-bake.png`, {
        body: Buffer.from(png, "base64"),
        contentType: "image/png",
      });
    }
  } catch {
    // Evidence is best-effort — never let the collector become the failure.
  }
}
