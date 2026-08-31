---
title: "NOISE"
---

Procedural noise. A noise family and a dimension combine into the actual
generator; most other parameters apply across all of them, a few only to
specific families.

| Parameter | Control | Notes |
|---|---|---|
| Type | Selector | Random, Perlin, Simplex, Sparse Convolution, Hermite, Harmonic Summation, Alligator. |
| Dimension | Selector | 2D or 3D. Hidden for Random, which has no spatial dimensionality to choose. |
| Blend | Selector | Add, Multiply, Screen, Difference, XOR, Replace, or Phoenix into the chain. |
| Seed | value field, button | 0 to 999, typed directly or rolled with `Randomize`. |
| Period | Trough | Base noise frequency. |
| Position X/Y/Z | Trough | Scroll/offset through the noise field. Z is drawn only for a 3D type. |
| Harmonics (`Count`), Harmonic Spread, Harmonic Gain | Selector, Trough | Octave count (1 to 8), lacunarity, and persistence. Perlin, Simplex, Harmonic Summation, and Alligator only; the other three families have no octave structure to layer. |
| Density | Trough | Impulses per unit area/volume. Sparse Convolution only. |
| Exponent | Trough | Sign-preserving contrast curve. |
| Amplitude / Offset | Trough | Maps the generator's raw range into 0-1 output. |

Related: [Insert FX Chains](../../../concepts/insert-fx-chains/),
[AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
