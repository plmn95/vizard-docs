---
title: "MIDI and OpenSoundControl Learn"
description: "Assign incoming MIDI and OpenSoundControl messages to parameters with Learn mode."
---

Learn assigns an incoming MIDI CC or OpenSoundControl address to a
parameter. It can be armed from:

- A parameter's right-click menu: `MIDI Learn` or `OpenSoundControl Learn`.
- `M` for MIDI or `O` for OpenSoundControl, followed by a click on the target
  parameter.
- `Learn` in the source picker's `MIDI` or `OpenSoundControl` tab, which fills
  the CC number and channel, or address, from the next message.

Clicking another parameter while Learn is armed changes the target. The
next message adds an assignment and disarms Learn. Existing assignments are
preserved; duplicate sources are not added.

A pulsing `MIDI LEARN` label appears in the toolbar while MIDI Learn is
armed. OpenSoundControl Learn has no toolbar indicator.

Related: [Modulation Matrix](../modulation-matrix/).
