---
title: "OSC"
---

The oscillator generator. Produces a per-channel waveform, independently
phased, amplitude-scaled, and time-scaled across R, G, and B.

| Parameter | Control | Notes |
|---|---|---|
| Waveform | Selector | Sine, Square, Sawtooth, Triangle, Noise, Custom. |
| Blend | Selector | Add, Multiply, Screen, Difference, XOR, Replace, or Phoenix into the chain. |
| Freq X / Freq Y | Pad | X and Y frequency read as one gesture; a Link ties Y to X's position. |
| Phase R/G/B | Wheel | Ganged, one ring per channel. |
| Amp R/G/B | Trough | Ganged. |
| DC R/G/B | Trough | Ganged; per-channel DC offset. |
| Duty | Trough | 1-99%. Square wave only; ignored for every other waveform. |
| Time R/G/B | Trough | Ganged; per-channel time multiplier. |
| Custom Wave | shared waveform editor | Only used when Waveform is set to Custom. |

Related: [Insert FX Chains](../../../concepts/insert-fx-chains/),
[AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
