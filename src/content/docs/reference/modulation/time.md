---
title: "Time"
---

A monotonic accumulator: rises or falls at a steady rate every frame,
unbounded, rather than cycling like an LFO. A patch starts with one and
grows the bank from its own add button; nothing caps how many a patch can
hold.

| Parameter | Control | Notes |
|---|---|---|
| Scale | Trough | Units added per second. Negative makes it count down instead of up. |
| Running | Rocker | Pausing freezes the accumulator in place, without resetting it. |
| Reset | button | Zeroes the accumulator immediately. |

Related: [Modulation Matrix](../../../concepts/modulation-matrix/).
