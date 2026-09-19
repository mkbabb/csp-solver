/**
 * The mark's two row shapes (T9-W7 §11). They live beside the components rather than inside
 * them because `<script setup>` carries no exports, and App.vue reads the first one.
 */

/** A person at the table, as the head draws them. `ink` is `playerIdentity.inkFor`'s shape —
 *  a `--color-user-ink` rebinding — or `{}` for the incumbent. */
export interface MarkRow {
  id: string;
  name: string;
  ink: Record<string, string>;
  self: boolean;
}

/** One line of the sheet: a name in its own ink, and at most one qualifier after it
 *  (`you`, or `26 seconds ago`). */
export interface LobbyLine extends Omit<MarkRow, "self"> {
  qualifier: string;
}
