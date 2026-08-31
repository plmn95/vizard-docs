---
title: "LFO"
---

A repeating or one-shot waveform generator. A patch starts with one LFO and
grows the bank from its own add button; nothing caps how many a patch can
hold.

| Parameter | Control | Notes |
|---|---|---|
| Wave | Selector | `Sine`, `Square`, `Saw`, `Triangle`, `S+H`, `Custom`, plus 6 noise waves: `Perlin1D`, `Simplex1D`, `Sparse Conv 1D`, `Hermite1D`, `Harm Sum 1D`, `Alligator1D`. |
| Rate | Trough | 0 to 20Hz, used when not BPM-synced. At 0 the wave freezes and `Phase Off` scans through its shape by hand. |
| BPM Sync | Rocker, Selector | Locks Rate to a musical division (`1/16` to `4`) instead of a raw Hz value. |
| Scale / Offset | Trough | Output amplitude multiplier, and a DC offset applied after Scale. |
| Fold | Trough | Wavefolder drive; 0 is an exact bypass. Reflects the signal back into range rather than letting it clip. |
| Phase Off | Wheel | Starts the wave partway through. 1.0 is a full cycle. |
| Duty | Trough | 1-99%. Square wave only. |
| Custom Wave | shared waveform editor | Only used when Wave is set to `Custom`. |
| Seed | value field, button | 0 to 999, typed directly or rolled with `Randomize`. All 6 noise waves. |
| Harmonics (`Count`), Harmonic Spread, Harmonic Gain | Selector, Trough | Octave count (1 to 8), lacunarity, and persistence. The 4 fbm-capable noise waves: `Perlin1D`, `Simplex1D`, `Harm Sum 1D`, `Alligator1D`. |
| Density | Trough | `Sparse Conv 1D` only. |
| Glide / Glide Mode | Trough, Selector | Smooths value changes; the Trough's meaning follows Glide Mode: an RC time under `Exponential`, a slew time under `Linear`, and a `Ramp` percentage of the cycle under `Cycle`. |

Related: [Modulation Matrix](../../../concepts/modulation-matrix/).
