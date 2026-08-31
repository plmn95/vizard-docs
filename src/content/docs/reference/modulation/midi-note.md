---
title: "MIDI Note"
---

The channel-voice MIDI messages, on their own tab separate from
[MIDI](../midi/)'s CC input. A `Source` Selector picks one of four, and a
`Ch (0=any)` field scopes it to a channel.

| Source | Notes |
|---|---|
| Velocity | Gate-scoped: updates once per note-on and holds its value until the next note, rather than varying continuously like a CC. |
| Aftertouch | Continuous pressure; updates while a note is held and holds its last value once released. |
| Pitch Bend | Bipolar, -1 to 1 across the pitch wheel's full travel. |
| NRPN | Tracks the most recent value sent for a chosen 14-bit parameter number (0-16383) on that channel. A `Param #` field appears for it. |

The tab reports `Open a MIDI port in Settings > MIDI.` until a port is open.

Related: [Modulation Matrix](../../../concepts/modulation-matrix/).
