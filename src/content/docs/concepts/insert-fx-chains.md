---
title: "Insert FX Chains"
description: "Build a local effects stack for each module with up to eight ordered Insert FX slots."
---

Each module has an `INSERT FX` section with up to 8 effect slots. Effects
run in slot order on that module's output.

Slots reorder by dragging their grips. The `ACTIVE`/`BYPASSED` Rocker
bypasses a slot without removing it.

A slot's right-click menu offers `Copy Insert FX`, `Paste Insert FX`, and
`Paste Insert FX as new`. Pasting replaces the selected slot; pasting as new
inserts a copy after it. Modulation is not copied.

`Mix` blends the effect's result with its input.

[Region](../../reference/insert-fx-region/) limits an effect to a circle.
Regions on multiple slots can merge when their circles approach each other.

On [FEEDBACK](../../reference/modules/feedback/), `Pre` effects process the
loop on each lap; `Post` effects process its output once.

Related: [FX](../../reference/fx/), [Signal Chain](../signal-chain/).
