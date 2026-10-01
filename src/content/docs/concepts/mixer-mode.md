---
title: "Mixer Mode"
---

`F3` toggles Mixer Mode: a live two-deck view built for performance, separate
from the single-chain editing view the rest of the app defaults to. Each
deck loads its own patch independently.

Mixing between the two decks is one of five modes: `Crossfade / Blend`,
`Luma Key`, `Chroma Key`, `Strobe`, and `Dirty Mix`. `Crossfade / Blend`
itself has five sub-modes (Crossfade, Add, Screen, Multiply, Difference).
`Dirty Mix` splits its own behavior across two Selectors, a sum mode (Add
or Difference) and an overflow mode (Clip or Wrap), rather than one flat
list of variants.

Mixer Mode carries its own modulation, separate from the editing view's:
one LFO bank, one Envelope bank, and one Time bank, all shared across both
decks, plus a single Mixer-wide undo/redo stack. Macros are the one
deck-scoped source, four per deck, named `A1` to `A4` and `B1` to `B4`.
Each deck also loads a patch, which brings that patch's own modulators with
it. Right-click any mixer control to assign it a source, MIDI Learn it, set
its Amount, or clear it. A dot marks each control that is being modulated.

`H` hides the on-screen controls for a clean output feed while performing;
pressing it again brings them back. `Escape` reverses whichever of the two
is currently true: it un-hides the controls first if `H` hid them, and only
exits Mixer Mode once the controls are already visible.

A slim strip along the top keeps the `REC` and camera pill, the recording
timer and the recording settings within reach, and `Ctrl+Alt+R` starts or
stops a recording from the keyboard. While `H` hides the controls, a small
red lamp in the corner shows that a recording is running.

Related: [Signal Chain](../signal-chain/).
