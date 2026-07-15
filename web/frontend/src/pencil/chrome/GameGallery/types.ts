import type { Component } from "vue";

/**
 * The card shape the gallery renders (T4-W12) — a PENCIL-LOCAL type, deliberately NOT
 * imported from `@games/registry` (pencil imports nothing from games/**, the eslint
 * boundary). TypeScript is structural, so the registry's richer `GameCard` (which also
 * carries `scene`/`eager` — the mount half the gallery never touches) assigns straight
 * into `readonly GalleryCard[]` at App.vue's `<GameGallery :cards="GAMES">` seam. The
 * gallery is handed already-erased presentation data + loader thunks; it never reaches
 * into domain state.
 */
export interface GalleryCard {
  /** URL token + stable id; drives `?game=`, aria ids, and v-for keys. */
  id: string;
  /** lowercase wordmark register; rendered as a live `<text>`. */
  name: string;
  /** optional bespoke name glyph (unused by the shell wave; reserved). */
  glyph?: Component;
  /** the size/difficulty sub-line, in the game's own vocabulary. */
  range: { label: string; levels: string[] };
  /** the static, non-interactive poster face (a read-only mini-board). */
  poster: () => Promise<Component>;
}
