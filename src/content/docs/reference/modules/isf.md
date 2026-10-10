---
title: "ISF"
description: "Load an Interactive Shader Format shader and control the parameters declared by its inputs."
---

Runs an ISF (Interactive Shader Format) shader loaded with `Load .fs...`.
The shader's inputs determine the available parameters.

| Parameter | Control | Notes |
|---|---|---|
| Shader | file picker (`Load .fs...`) | |
| Blend | Selector | Add, Multiply, Screen, Difference, XOR, Replace, or Phoenix into the chain. |
| Mix | Trough | Wet/dry of the shader's result. |
| Shader Inputs | varies | Generated from the loaded shader's own metadata; shape and count vary shader to shader. |

The module's Insert FX run after the shader. See
[Insert FX Chains](../../../concepts/insert-fx-chains/).

## Filters and generators

A shader whose header declares an input with `"TYPE": "image"` (usually
named `inputImage`; transitions declare two) is a filter and reads the chain.
A shader with no image input is a generator.

A filter receives the chain over black. Its
result, after the module's own Insert FX, keeps the chain's see-through
areas: wherever the chain above has anything, the result is kept as drawn;
where the chain is empty, only the parts the shader lights are kept and dark
parts stay empty. A generator's result is used as drawn, with its own alpha.
See [Signal Chain](../../../concepts/signal-chain/).

**NOTE:** a filter set to `Blend` XOR or Phoenix treats a dark result over
an empty area as empty.

Related: [AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
