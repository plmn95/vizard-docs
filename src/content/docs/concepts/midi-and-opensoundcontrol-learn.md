---
title: "MIDI and OpenSoundControl Learn"
---

Learn mode assigns a modulation source to a parameter from the next incoming
message, instead of picking a source by hand. It arms three ways:
right-clicking a parameter and choosing `MIDI Learn` or `OpenSoundControl
Learn` arms it for that parameter directly; pressing `M` (MIDI) or `O`
(OpenSoundControl) arms Learn mode globally, and the next left-clicked
parameter becomes the target; or, with the `Add Modulation Source` popover
already open on a parameter, `Learn` inside its `MIDI` or `OpenSoundControl`
tab fills that tab's own CC number or address field from the next message.

While `MIDI Learn` is armed, a pulsing `MIDI LEARN` label appears in the main
toolbar. `OpenSoundControl Learn` arms the same way but has no toolbar
indicator of its own.

Left-clicking a parameter while Learn is armed re-targets it: the target is
always whichever parameter was clicked most recently, not fixed at the
moment Learn was armed. The next incoming MIDI CC or OpenSoundControl
message completes the assignment on that target and disarms Learn.

Both protocols reach the same modulation matrix once learned: a learned CC or
OpenSoundControl address becomes an ordinary assignment, editable from the
[Mod Matrix](../../reference/windows/mod-matrix/) window like any source
picked from the `Add Modulation Source` popover.

Related: [Modulation Matrix](../modulation-matrix/).
