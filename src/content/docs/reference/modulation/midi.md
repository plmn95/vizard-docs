---
title: "MIDI"
---

Continuous controller input. The `MIDI` tab carries CC and nothing else:
a CC number 0-127, and a channel where 0 means any channel.

A `Learn` button in the tab arms MIDI Learn and fills both fields from the
next incoming message, instead of typing a CC number by hand. See
[MIDI and OpenSoundControl Learn](../../../concepts/midi-and-opensoundcontrol-learn/).

The tab reports `Open a MIDI port in Settings > MIDI.` until a port is open.

The other MIDI message types, Velocity, Aftertouch, Pitch Bend, and NRPN,
are on their own tab. See [MIDI Note](../midi-note/).

Related: [Modulation Matrix](../../../concepts/modulation-matrix/).
