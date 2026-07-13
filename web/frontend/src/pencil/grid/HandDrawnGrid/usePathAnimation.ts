import { ref } from "vue";
import { mulberry32 } from "@mkbabb/pencil-boil";
import {
  createSequenceSubscription,
  resolveEasing,
  usePrefersReducedMotion,
  type SequenceHandle,
} from "@mkbabb/pencil-boil";
import { DRAW_IN_PRESETS } from "@pencil/config/pencilConfig";

// Grid draw-in/erase — stroke-dashoffset tweens on the unified scheduler (W8 4th workstream).
// Each grid line was its own keyframes.js `KeyframesAnimation` → its own `RAFPlayback` → its
// own native rAF loop (up to ~boardSize² lines drawing at once). Now every line is a one-shot
// `sequence` subscriber on the ONE shared chain, so a full board reveal costs a single rAF.
export function usePathAnimation(svgRef: import("vue").Ref<SVGSVGElement | null>) {
  const pathsVisible = ref(false);
  const reducedMotion = usePrefersReducedMotion();
  let drawAnimations: SequenceHandle[] = [];

  function getPathElements(): SVGPathElement[] {
    if (!svgRef.value) return [];
    return Array.from(svgRef.value.querySelectorAll("path.grid-line"));
  }

  function setupPathLengths(pathEls: SVGPathElement[]): Map<SVGPathElement, number> {
    const lengths = new Map<SVGPathElement, number>();
    pathEls.forEach((el) => {
      const len = el.getTotalLength();
      lengths.set(el, len);
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
    });
    return lengths;
  }

  function cleanup() {
    drawAnimations.forEach((a) => {
      try {
        a.stop();
      } catch {
        /* ignore */
      }
    });
    drawAnimations = [];
  }

  // Run a batch of sequence tweens and resolve once every one has completed (or been stopped).
  function runBatch(
    specs: {
      el: SVGPathElement;
      from: number;
      to: number;
      duration: number;
      delay: number;
      easing: string;
    }[],
  ): Promise<void> {
    cleanup();
    return new Promise<void>((resolve) => {
      let remaining = specs.length;
      if (remaining === 0) {
        resolve();
        return;
      }
      const done = () => {
        if (--remaining === 0) resolve();
      };
      for (const spec of specs) {
        const span = spec.to - spec.from;
        const seq = createSequenceSubscription({
          durationMs: spec.duration,
          delayMs: spec.delay,
          easing: resolveEasing(spec.easing),
          onProgress: (eased) => {
            spec.el.style.strokeDashoffset = String(spec.from + span * eased);
          },
          onComplete: done,
        });
        drawAnimations.push(seq);
        seq.start();
      }
    });
  }

  async function animateDrawIn() {
    cleanup();
    const pathEls = getPathElements();
    if (pathEls.length === 0) return;

    if (reducedMotion.value) {
      pathEls.forEach((el) => {
        el.style.strokeDashoffset = "0";
      });
      pathsVisible.value = true;
      return "drawn" as const;
    }

    const lengths = setupPathLengths(pathEls);

    const framePaths = pathEls.filter((el) => el.classList.contains("frame-line"));
    const subgridPaths = pathEls.filter((el) => el.classList.contains("subgrid-line"));
    const cellPaths = pathEls.filter((el) => el.classList.contains("cell-line"));

    const jitterRng = mulberry32(77);
    const groups = [
      { paths: framePaths, preset: DRAW_IN_PRESETS.gridFrame },
      { paths: subgridPaths, preset: DRAW_IN_PRESETS.gridSubgrid },
      { paths: cellPaths, preset: DRAW_IN_PRESETS.gridCell },
    ];

    const specs: {
      el: SVGPathElement;
      from: number;
      to: number;
      duration: number;
      delay: number;
      easing: string;
    }[] = [];
    for (const { paths: groupPaths, preset } of groups) {
      groupPaths.forEach((el, i) => {
        const len = lengths.get(el)!;
        const jitter = Math.round((jitterRng() - 0.5) * preset.jitter * 2);
        specs.push({
          el,
          from: len, // offset len → 0 (draw on)
          to: 0,
          duration: preset.duration,
          delay: Math.max(0, preset.baseDelay + i * preset.stagger + jitter),
          easing: preset.timing,
        });
      });
    }

    await runBatch(specs);
    pathEls.forEach((el) => {
      el.style.strokeDasharray = "none";
      el.style.strokeDashoffset = "0";
    });
    pathsVisible.value = true;
    return "drawn" as const;
  }

  async function animateErase() {
    cleanup();
    const pathEls = getPathElements();
    if (pathEls.length === 0) return;

    const lengths = pathEls.map((el) => el.getTotalLength());

    if (reducedMotion.value) {
      pathEls.forEach((el, i) => {
        el.style.strokeDashoffset = String(lengths[i]);
      });
      pathsVisible.value = false;
      return "hidden" as const;
    }

    const specs = pathEls.map((el, i) => {
      const len = lengths[i];
      el.style.strokeDashoffset = "0";
      el.style.strokeDasharray = String(len);
      // easeInCubic — erasing leaves the page fast and careless (design §1.2 canon).
      return {
        el,
        from: 0,
        to: len,
        duration: 150,
        delay: i * 4,
        easing: "easeInCubic",
      };
    });

    await runBatch(specs);
    pathsVisible.value = false;
    return "hidden" as const;
  }

  function showInstant() {
    const pathEls = getPathElements();
    pathEls.forEach((el) => {
      el.style.strokeDashoffset = "0";
      el.style.strokeDasharray = "none";
    });
    pathsVisible.value = true;
  }

  return { pathsVisible, animateDrawIn, animateErase, showInstant, cleanup };
}
