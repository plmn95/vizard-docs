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

An ISF shader is a separate mechanism from the fixed 43-type Insert FX
catalog: an ISF module also carries its own Insert FX chain, stacked after
the shader's own result, not as a 44th catalog entry. See
[Insert FX Chains](../../../concepts/insert-fx-chains/).

## Filters and generators

A shader whose header declares an input with `"TYPE": "image"` (usually
named `inputImage`; transitions declare two) is a filter and reads the chain.
A shader with no image input is a generator.

A filter receives the chain over black, as most ISF shaders expect. Its
result, after the module's own Insert FX, keeps the chain's see-through
areas: wherever the chain above has anything, the result is kept as drawn;
where the chain is empty, only the parts the shader lights are kept and dark
parts stay empty. A generator's result is used as drawn, with its own alpha.
See [Signal Chain](../../../concepts/signal-chain/).

**NOTE:** a filter set to `Blend` XOR or Phoenix treats a dark result over
an empty area as empty.

Related: [AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
