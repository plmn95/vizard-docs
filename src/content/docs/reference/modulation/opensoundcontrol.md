---
title: "OpenSoundControl"
---

OpenSoundControl input as a modulation source: any incoming message, read by
its address (for example `/1/fader1`) rather than by a fixed slot number the
way MIDI CC is.

The listen port is set in `Settings > OpenSoundControl`'s `UDP Port` field.

`OpenSoundControl Learn` arms a parameter and completes the assignment from
the next incoming message at whatever address sent it, instead of typing an
address by hand; see
[MIDI and OpenSoundControl Learn](../../../concepts/midi-and-opensoundcontrol-learn/).

Related: [Modulation Matrix](../../../concepts/modulation-matrix/).
