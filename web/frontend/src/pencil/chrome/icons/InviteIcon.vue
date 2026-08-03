<script setup lang="ts">
defineProps<{ size?: number }>();
</script>

<template>
  <!-- Decorative: every icon sits inside a control that carries its own accessible name
       (a11y r1 M6 — the census leak this file was one of four sources of). -->
  <svg
    aria-hidden="true"
    :width="size ?? 28"
    :height="size ?? 28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- T7-W7 — THE INVITE GETS ITS OWN MARK. "Play together on this board" and "Share board
         link" drew the SAME glyph in the same card, so the two acts were indistinguishable at
         the only place a reader compares them. Share stays the three-pip graph (a link, sent);
         invite is drawn as what it actually is — two people sat at one table.

         The family's hand, matched deliberately: outline strokes at 1.7 with round caps and
         joins and no fill (Hint/FillForced/Eraser), heads as solid circles in the dice-pip
         vocabulary (Share/Eraser), and every pair a hair uneven — the right figure smaller and
         a touch lower than the left, the table bowed, its legs splaying by different amounts.
         Nothing here is mirrored, because nothing in this estate's icons is. -->

    <!-- The table: one bowed rule, heavier than the figures so it reads as the object they
         share rather than an underline, with two legs splayed unequally. -->
    <path
      d="M2.3,17.6 Q12,16.9 21.7,17.6"
      stroke="currentColor"
      stroke-width="1.9"
      stroke-linecap="round"
      fill="none"
    />
    <path
      d="M6.6,18 L5.7,21.4"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <path
      d="M17.4,18 L18.4,21.4"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />

    <!-- Left figure: the larger of the two. Head and shoulders only — the torso runs out just
         above the table's edge, which is what puts them AT it rather than behind it. -->
    <circle cx="7.2" cy="5.4" r="2.05" fill="currentColor" />
    <path
      d="M3.9,15.3 Q4.2,9.3 7.3,9.2 Q10.4,9.4 10.6,15.3"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      fill="none"
    />

    <!-- Right figure: the one who joined — smaller head, seated a hair lower. -->
    <circle cx="16.8" cy="6" r="1.9" fill="currentColor" />
    <path
      d="M13.6,15.3 Q13.9,9.9 16.8,9.8 Q19.7,10 19.9,15.3"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      fill="none"
    />
  </svg>
</template>
