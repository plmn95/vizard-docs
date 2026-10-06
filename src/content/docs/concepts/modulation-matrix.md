---
title: "Modulation Matrix"
description: "Assign modulation sources, adjust their amount, and inspect active parameter assignments in the Modulation Matrix."
---

A parameter's modulation is managed from the parameter itself: right-clicking
it and choosing `Edit Modulation` opens a window headed "Modulate:
`<parameter>`." The menu item shows how many sources are connected, for
example `Edit Modulation (2)`.

The window lists every source modulating the parameter, one line each: the
source's name, a live meter of how far it is moving the parameter right now,
its `Depth`, a `BYP` switch that turns it off without removing it, and an `X`
that removes it. `+ Add Source` and `Clear All` sit below the list. A
parameter with no modulation shows an empty list, and `+ Add Source` opens
the source picker.

The source picker has one tab per source family: `LFO`, `ENV`, `TIME`,
`MACRO`, `Audio`, `CV/Gate`, `MIDI`, `MIDI Note`, and `OpenSoundControl`.
`Assign` adds the selected source and closes the window. Clicking a source's
name in the list opens the same picker for that connection: changes apply as
they are made, picking a different source swaps it while keeping its settings,
`Remove` returns to the list, and `Done` closes the window. Sources already connected to the
parameter carry a lamp, and picking one opens it for editing instead of adding
it twice.

Sources stack: adding a source, by the picker, by Learn, or by dragging it
onto the parameter, keeps the parameter's existing modulation.

The same right-click menu also offers `MIDI Learn` and `OpenSoundControl
Learn`, which arm the parameter and complete the assignment from the next
incoming MIDI CC or OpenSoundControl message instead of picking a source by
hand.

Every assignment carries a signed `Depth` in the parameter's own units, with
the matching share of its range shown beside it, so the same source can push
a parameter up or pull it down. `Offset` adds a constant shift on top of the
source's swing. Assignments driven by the `L Level` or `R Level` audio sources
carry a shaping stage as well, rectify, attack, release, and a gate
threshold, applied to the raw value before depth. No other source type offers
shaping.

Modulation can also target another assignment's own depth, not only a module
parameter. This is meta-modulation, its own target type rather than a
special case bolted onto ordinary parameter targets.

`Clear All`, at the bottom of the list, removes every assignment on that
parameter at once. Removing and clearing can be undone.

Every active assignment also shows up in the
[Mod Matrix](../../reference/windows/mod-matrix/) window, which lists and
edits them from one place instead of hunting through each module's own
parameters.

Related: [MIDI and OpenSoundControl Learn](../midi-and-opensoundcontrol-learn/).
