---
title: "Signal Chain"
---

A patch is the chain you build: modules run in the order shown top to bottom
in `Chain`, each one blending its own output into the running composite
before the next module runs. The last module in that order is what `Output`
shows.

Every module carries one of three states, read from a single selector rather
than separate toggles: `LIVE`, `BYP`, or `MUTE`. `LIVE` means the module is
genuinely passing signal to the next stage. `BYP` holds the module's position
in the chain without contributing its output. `MUTE` removes it entirely.

How a module's output combines with what came before it is set by its own
`Blend` Selector. Every generator except `SCOPE` offers the same seven: Add,
Multiply, Screen, Difference, XOR, Replace, and Phoenix; `SCOPE` composites
in place and has no `Blend` control at all. `INSERT` offers the same seven
with Additive in place of Add. `FEEDBACK` is the one module that differs,
adding Lerp for an eighth.

Every module also carries its own Insert FX chain and its own Sends,
independent of its position in the chain. See
[Insert FX Chains](../insert-fx-chains/) and
[AUX Sends and Buses](../aux-sends-and-buses/).
