---
title: "Insert FX Chains"
---

Insert FX gives a module its own local effects stack, layered onto that
module's output without adding separate modules to the chain: every module
carries one, with up to 8 ordered slots shown in `Module`'s `INSERT FX`
section. Each slot holds one effect from the same 41-effect catalog wherever
it appears, and runs independent of the module's own position in the signal
chain.

An empty slot's effect type is `NONE`. Clicking `+ Add` appends a new empty
slot; picking an effect from its type Selector fills it. A slot reorders by
dragging its grip, disables without being removed via its `ACTIVE`/`BYPASSED`
Rocker, and is deleted with its `X`.

Each slot's own `Mix` sets how much of the effect blends back with what came
into the slot, from fully dry to fully wet.

A slot can also scope its effect to a circle instead of the whole frame, and
melt into another slot's circle when the two come close, regardless of what
effect either slot runs. See [Region](../../reference/insert-fx-region/).

FEEDBACK's Insert FX chain adds one more choice per slot, not something the
other 8 module types need to decide: whether the effect applies before or
after the feedback loop itself. See [Feedback](../../reference/modules/feedback/).

Related: [Signal Chain](../signal-chain/).
