---
title: "ISF"
---

Runs a user-loaded ISF (Interactive Shader Format) shader. `Load .fs...`
opens a file dialog filtered to `.fs` files; the shader's own declared
inputs determine what parameters appear, not a fixed list this module owns.

| Parameter | Control | Notes |
|---|---|---|
| Shader | file picker (`Load .fs...`) | |
| Blend | Selector | Add, Multiply, Screen, Difference, XOR, Replace, or Phoenix into the chain. |
| Mix | Trough | Wet/dry of the shader's result. |
| Shader Inputs | varies | Generated from the loaded shader's own metadata; shape and count vary shader to shader. |

An ISF shader is a separate mechanism from the fixed 41-type Insert FX
catalog: an ISF module also carries its own Insert FX chain, stacked after
the shader's own result, not as a 42nd catalog entry. See
[Insert FX Chains](../../../concepts/insert-fx-chains/).

Related: [AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
