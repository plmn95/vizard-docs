---
title: "Mixer Mode"
description: "Mix two patches and control Mixer Mode modulation and recording."
---

`F3` toggles Mixer Mode, where two decks each hold a patch.

Mix modes are described in [Mixer Controls](../../reference/windows/mixer-controls/).

Mixer Mode carries its own modulation, separate from the editing view's:
one LFO bank, one Envelope bank, and one Time bank, all shared across both
decks, plus a single Mixer-wide undo/redo stack. Macros are the one
deck-scoped source, four per deck, named `A1` to `A4` and `B1` to `B4`.
Each deck also loads a patch, which brings that patch's own modulators with
it. Right-clicking any mixer control offers the same `Edit Modulation` window
as a patch parameter, using the Mixer's own sources, and `MIDI Learn`. A dot
marks each control that is being modulated.

`H` hides or shows the controls. `Escape` first restores hidden controls;
if they are already visible, it exits Mixer Mode.

A slim strip along the top keeps the `REC` and camera pill, the recording
timer and the recording settings within reach, and `Ctrl+Alt+R`
(`Cmd+Option+R` on macOS) starts or
stops a recording from the keyboard. While `H` hides the controls, a small
red lamp in the corner shows that a recording is running.

Related: [Signal Chain](../signal-chain/).
