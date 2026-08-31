---
title: "Modulation Matrix"
---

Any parameter that accepts modulation can be assigned one from the same
place: right-clicking it and choosing `Add Modulation Source` opens a tabbed
popover, headed "Modulate: <parameter>," with one tab per source family:
`LFO`, `ENV`, `TIME`, `MACRO`, `Audio`, `CV/Gate`, `MIDI`, `MIDI Note`, and
`OpenSoundControl`.

The same right-click menu also offers `MIDI Learn` and `OpenSoundControl
Learn`, which arm the parameter and complete the assignment from the next
incoming MIDI CC or OpenSoundControl message instead of picking a source by
hand.

Every assignment carries a signed depth from -1 to 1, so the same source can
push a parameter up or pull it down. Assignments driven by the `L Level` or
`R Level` audio sources carry a shaping stage as well, rectify, attack,
release, and a gate threshold, applied to the raw value before depth. No
other source type offers shaping.

Modulation can also target another assignment's own depth, not only a module
parameter. This is meta-modulation, its own target type rather than a
special case bolted onto ordinary parameter targets.

`Clear All Modulation`, also in the right-click menu, removes every
assignment on that parameter at once.

Every active assignment also shows up in the
[Mod Matrix](../../reference/windows/mod-matrix/) window, which lists and
edits them from one place instead of hunting through each module's own
parameters.

Related: [MIDI and OpenSoundControl Learn](../midi-and-opensoundcontrol-learn/).
