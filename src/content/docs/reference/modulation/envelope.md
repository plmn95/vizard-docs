---
title: "Envelope"
---

An ADSR envelope. A patch starts with one and grows the bank from its own
add button; nothing caps how many a patch can hold.

| Parameter | Control | Notes |
|---|---|---|
| Attack, Decay, Release | Trough | Seconds, 0.001 to 10. |
| Sustain | Trough | Level, 0 to 1. In Loop mode it sets the notch depth between decay and release. |
| `AUTO-RELEASE` / `HOLD` | Rocker | `HOLD` sustains for as long as the trigger stays on. `AUTO-RELEASE` releases after a fixed time instead, even while still gated. Not drawn in Loop mode. |
| Duration | Trough | Seconds spent holding Sustain before self-triggering Release. Drawn only under `AUTO-RELEASE`. |
| Loop | Rocker | Free-runs the envelope cyclically instead of waiting for a trigger; the Trigger selector is relabelled `Sync/Reset`, and the gate becomes a sync/reset instead of an open/close signal. |
| Trigger | Selector | `MIDI Note`, `Audio Threshold`, or `LFO Edge`. |
| `Ch (0=any)` | value field | MIDI Note trigger only; 0 means any channel. |
| Input / Threshold | Selector, Trough | Audio Threshold trigger only: `Audio L` or `Audio R`, and the level that opens the gate. |
| LFO / Split | Selector, Trough | LFO Edge trigger only: which LFO drives the gate, and the phase position (0 to 1) below which the gate stays open. |

Related: [Modulation Matrix](../../../concepts/modulation-matrix/).
