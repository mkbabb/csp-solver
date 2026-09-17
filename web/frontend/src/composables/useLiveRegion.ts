import { onMounted, ref, watch, type Ref } from "vue";

/**
 * useLiveRegion — THE LIVE-REGION IDIOM (T9-W3 §3.4, the class's third occurrence).
 *
 * A live region announces MUTATIONS TO ITSELF. Nothing else. A region that enters the document
 * with its sentence already inside it has nothing to announce, and a region that leaves the
 * document at the moment its subject starts changing cannot announce anything either. Both
 * shapes read as accessible markup and both are silent, which is why the estate landed the
 * same defect three times: `players-status` (born under `v-if` holding "connecting…"),
 * `players-alone` (born under `v-if` holding its sentence), and `players-roster` — a
 * `role="log"` that arrived already holding rows, so the 0→1 arrival was never spoken while
 * T7-W2's 1→2 cure worked perfectly beside it.
 *
 * THE LAW, in three clauses, and every site in the estate holds all three:
 *
 *   BORN EMPTY   the region's text starts `""` NO MATTER WHAT THE STATE ALREADY SAYS. A source
 *                that is already true at setup is read one flush LATER (`onMounted`), so its
 *                first word arrives as a change to a node the assistive technology is already
 *                watching. This is the 0→1 clause and it is the one a local patch never gets
 *                right, because reading the source eagerly is the obvious thing to write.
 *   PERSISTS     the ELEMENT is unconditional for the whole life of the state it narrates; the
 *                CONTENT is the conditional half. `v-if` belongs on neither the region nor its
 *                ancestors within that life.
 *   EMPTIES      a region with nothing to say holds `""`, so nothing stale can be re-read off
 *                the page — and, at a drawn site, so it can be taken out of flow and cost no
 *                pixels (`sr-only` bound to its own emptiness).
 *
 * Two entry points, one mechanism:
 *
 *   const { text, say, clear } = useLiveRegion()          // utterances (an event speaks)
 *   const { text } = useLiveRegion(() => …)               // narration  (a state speaks)
 *
 * The persistence clause is markup, not code, so it cannot live in here — it is policed
 * statically instead, by `scripts/check-live-regions.mjs`, which reds any region born under a
 * condition with content already inside it. Mechanism and gate, same commit.
 */
export function useLiveRegion(source?: () => string): {
  /** What the MOUNTED region carries. Born `""`; bind it, never a computed of your own. */
  text: Ref<string>;
  /** Put an utterance in. */
  say: (line: string) => void;
  /** Empty it. */
  clear: () => void;
} {
  const text = ref("");
  const say = (line: string) => {
    text.value = line;
  };
  const clear = () => {
    text.value = "";
  };

  if (source) {
    // The deferred first read IS the cure. `immediate: true` would run inside setup, which puts
    // the sentence in the region's own birth markup and takes the announcement back off the
    // table; `flush: "post"` keeps every later read after the DOM it describes has settled.
    onMounted(() => {
      text.value = source();
    });
    watch(source, say, { flush: "post" });
  }

  return { text, say, clear };
}
