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
it.

`H` hides the on-screen controls for a clean output feed while performing;
pressing it again brings them back. `Escape` reverses whichever of the two
is currently true: it un-hides the controls first if `H` hid them, and only
exits Mixer Mode once the controls are already visible.

Related: [Signal Chain](../signal-chain/).
