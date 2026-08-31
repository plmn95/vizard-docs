---
title: "Modulation"
---

The source families available from `Add Modulation Source`, `MIDI Learn`,
and `OpenSoundControl Learn`, one tab each. See
[Modulation Matrix](../../concepts/modulation-matrix/) for how a source
gets assigned to a parameter in the first place.

| Source | What it is |
|---|---|
| [LFO](lfo/) | A repeating or one-shot waveform generator, 12 waveforms including 6 noise types. |
| [Envelope](envelope/) | An ADSR envelope, triggered by a MIDI note, an audio threshold, or another LFO's phase. |
| [Time](time/) | A monotonic accumulator: rises or falls at a steady rate, unbounded. |
| [Macro](macro/) | A named, freely assignable value, bindable to a MIDI CC. |
| [Audio-Reactive](audio-reactive/) | Live audio level: L/R, 8 named frequency bands, or 4 user-defined bands. |
| [CV/Gate](cv-gate/) | Up to 12 channels of external control voltage / gate input. |
| [MIDI](midi/) | CC values. |
| [MIDI Note](midi-note/) | Velocity, Aftertouch, Pitch Bend, and NRPN. |
| [OpenSoundControl](opensoundcontrol/) | Address-based UDP input. |
