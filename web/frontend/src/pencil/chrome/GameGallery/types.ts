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
  /** what the staging band offers for this card — the structural twin of the registry's
   *  `CardStaging` (the same `GalleryCard` trick: pencil declares the shape it consumes and
   *  the richer registry row assigns straight in). */
  staging: GalleryStaging;
  /** the static, non-interactive poster face (a read-only mini-board). */
  poster: () => Promise<Component>;
}

/** One staging axis, as presentation data. */
interface GalleryAxis {
  label: string;
  options: { value: number | string; label: string }[];
  default: number | string;
}

export interface GalleryStaging {
  size: GalleryAxis;
  difficulty: GalleryAxis;
}

/** THE CROSS-GAME TRUTH (T4-P1 F4): what the app knows about each card's saved board. App
 *  hands this down id-keyed; a card with NO entry is a game that has never been played, and
 *  the band says so ("start") rather than dressing a registry default as your saved settings. */
export interface GallerySaved {
  size: number | string;
  difficulty: number | string;
  /** a restorable board exists — the band's `resume` vs `start` verb. */
  board: boolean;
  /** the user has written on it — the ONLY thing a deal can destroy, and therefore the only
   *  thing that arms the guard ribbon. Givens are not work. */
  userMoves: boolean;
}
