# The ten minute speed check — how to run it on the phone

You run this. No session ever drives your browser (M19). It reads; it changes nothing about the
game and it sends nothing anywhere: the numbers stay on the phone until you paste them.

You need: the phone, ten minutes, and somewhere to paste text (Notes, or a message to yourself).

---

## Before you start

1. **Low Power Mode off.** Settings, Battery. The page cannot see this, so you tell it.
2. **Plug the phone in or make sure it is cool.** A hot phone is a slow phone, and the reading
   would be about the heat instead of the game.
3. The build on the site has to carry the probe. Ask for the deploy first; a site without it
   simply ignores the `?__probe=1` on the end of the address.

---

## Run 1, the first load (about five minutes)

1. Open a **Private tab** (Safari, tabs button, Private). This is what makes it a first load.
2. Go to:

   ```
   https://sudoku.babb.dev/?__probe=1
   ```

3. **Wait.** Nothing appears for eight seconds. That is on purpose: the box would otherwise be
   sitting on the screen during the part being measured. A black box slides in at the bottom.
4. Tap **First load**. The box shrinks to a small round **Show** button in the bottom left, so
   your hands are free.
5. Tick **Low Power Mode is off** if it is (tap **Show** first, then tick it, then carry on).
6. **Tap the sun and moon button four times**, counting about three seconds between taps. Let
   each change finish before the next tap.
7. **Tap the controls tab three times** (the tab under the board that opens the drawer). Open,
   close, open.
8. **Tap the puzzle name at the top** to go to the picker, wait a moment, then **tap a puzzle**
   to come back to a board.
9. Tap **Show** in the bottom left, then tap **Copy**. The button says "Copied".
   - If it says the copy did not work: press and hold the black text under it, Select All, Copy.
10. Paste it into a note. That line is the reading.

## Run 2, the reload (about three minutes)

11. In the same tab, **reload the page** (pull down, or the reload arrow).
12. Wait the eight seconds again, tap **Reload** this time, and repeat steps 5 to 10.

---

## What to send back

Two lines of text, one per run. Paste them into

`docs/tranches/2026-08-tranche-9/evidence/w8/device/readings.jsonl`

one line each, or just send them and they get pasted for you. Nothing else is needed: the line
carries the phone, the screen size, which load it was, and every number.

---

## One thing to check on the first line you paste

The box is not free. Find `probeArmedMs` in the line: that is how long the page took to get the
box running. On a laptop browser it lands between 80 and 122 milliseconds. If the phone reads
much higher than that, say so when you send the line. It would mean the box itself is taking
time away from the thing it is meant to be timing, and the rest of the numbers need a second
look before anyone quotes them. Nobody has measured this on a phone yet, so your first line is
what settles it.

---

## If something goes wrong

- **The box never appears.** The address is missing `?__probe=1`, or the site has not been
  deployed with the probe yet.
- **The box says the reading is spoiled.** You left the page, took a call, or the screen locked
  mid run. Start again from step 1; a spoiled reading is never quoted.
- **A number says NOT MEASURED.** That is honest, not broken. Safari genuinely cannot see some
  of these, and a made up zero would be worse than a gap.
- **You tapped too fast.** The line says so, on the tap it applies to. Nothing is lost; the
  other taps still count.

---

## What each run is worth, in one line

The first load is the number the whole wave is about: how long the board takes to be there,
drawn, and moving on a real phone. Everything else on this list is one of the moments that
felt slow: the dark toggle, the drawer, the picker.

A pass with no reading is banked as `device: NOT RUN` and the claim stays open. It is never
filled in from a desktop number.
