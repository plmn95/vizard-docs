---
title: "Modulation Matrix"
description: "Assign modulation sources, adjust their amount, and inspect active parameter assignments in the Modulation Matrix."
---

Right-click a parameter and choose `Edit Modulation` to manage its sources.
The number in the menu item, such as `Edit Modulation (2)`, is the number
of connected sources.

`+ Add Source` opens the source picker. Sources can also be dragged onto a
parameter from `Modulation`, or assigned through `MIDI Learn` and
`OpenSoundControl Learn`. Multiple sources can modulate the same parameter.

`Esc` or clicking outside the source picker preserves the assignment.
Sources already connected have a lamp; selecting one edits the existing
assignment.

Each assignment has a live meter and a signed `Depth` in the parameter's
units, with the percentage of its range shown alongside. Negative Depth
inverts the modulation. `Offset` adds a constant shift.

Assignments from `L Level` and `R Level` also have rectify, attack, release,
and gate-threshold controls, applied before Depth.

A source can modulate another assignment's Depth.

Removing sources and using `Clear All` can be undone.

The [Mod Matrix](../../reference/windows/mod-matrix/) window lists the
patch's assignments together.

Related: [Modulation Sources](../../reference/modulation/),
[MIDI and OpenSoundControl Learn](../midi-and-opensoundcontrol-learn/).
