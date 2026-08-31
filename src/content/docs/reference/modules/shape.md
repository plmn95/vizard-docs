---
title: "SHAPE"
---

Procedural 2D shapes: a primitive drawn as a signed-distance field, with
symmetry, an independent fill and outline, and per-primitive contextual
parameters.

| Parameter | Control | Notes |
|---|---|---|
| Primitive | Selector | Circle, Square, Triangle, Star, Polygon, Superellipse, Lissajous, Spirograph. |
| Blend | Selector | Add, Multiply, Screen, Difference, XOR, Phoenix, or Replace into the chain. |
| Symmetry | Selector | None, Bilateral, RotationalN, Kaleidoscope. |
| Sym N / Poly N / Depth | Trough | Symmetry repeat count, polygon side count, and IFS recursion depth. |
| Size / Position | Knob, Pad | Overall scale and X/Y offset. |
| Scale Factor / Rotation Per Level | Trough | Per-level falloff and rotation, when Depth > 1. |
| Color | Trough | Fill color, R/G/B. |
| Edge Smooth / Superellipse Exponent | Trough | SDF edge softness; exponent only affects the Superellipse primitive. |
| Contextual | Trough | Up to four rows that rename themselves per Primitive: Lissajous shows Freq X, Freq Y, Phase, Damping; Spirograph shows R, r, d. |
| Outline | Selector, Trough | Off, Outline Only, or Fill+Outline, with its own color, opacity, and width independent of the fill. |

Related: [Insert FX Chains](../../../concepts/insert-fx-chains/),
[AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
