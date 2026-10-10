---
title: "Modulation Matrix"
description: "Assign modulation sources, adjust their amount, and inspect active parameter assignments in the Modulation Matrix."
---

Right-click a parameter and choose `Edit Modulation Connections...` to manage
its sources, or `Add Modulation Source` to open the source picker.

**Unverified in the released app:** these menu labels need a live desktop
check. They were checked against the local development build's source.

`+ Add Source` opens the source picker. Sources can also be dragged onto a
parameter from `Modulation`, or assigned through `MIDI Learn` and
`OpenSoundControl Learn`. Multiple sources can modulate the same parameter.

In the source picker, choose a `Source type`, select a source, and click
`Add Connection`. `Esc` or clicking outside closes the picker without adding
a connection. Edit an existing assignment in the connection editor.

Each assignment has a signed `Depth` in the parameter's units. Negative
Depth inverts the modulation. `Offset` adds a constant shift.

A source can modulate another assignment's Depth.

Removing sources and using `Clear All Modulation` can be undone.

The [Mod Matrix](../../reference/windows/mod-matrix/) window lists the
patch's assignments together.

Related: [Modulation Sources](../../reference/modulation/),
[MIDI and OpenSoundControl Learn](../midi-and-opensoundcontrol-learn/).
