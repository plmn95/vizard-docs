---
title: "FEEDBACK"
---

Video feedback: decays the previous frame and re-injects it into the chain,
with an optional delay and hold before each step advances.

| Parameter | Control | Notes |
|---|---|---|
| Blend | Selector | Additive, Lerp, Multiply, Screen, Difference, XOR, Phoenix, or Replace. Under Replace the current frame always shows as-is and Amount has no effect. |
| Amount | Trough | Feedback mix coefficient, 0-1. |
| Decay | Trough | Per-frame attenuation of the previous frame, 0-1. |
| Delay | Trough, Rocker | 0-500ms, 0 bypasses the delay ring entirely; a Rocker switches it to a BPM division (`1/16` to `4`) instead of a raw ms value. |
| Hold | Trough, Rocker | 0-1000ms inter-frame hold, same BPM-sync Rocker as Delay. 0 steps every frame. |
| Feed back to | Selector | `Self (default)`, or an earlier `INSERT`, `FEEDBACK`, or `ISF` to inject this loop's previous frame into. Generators ignore chain input and can't be targets. |
| Source | Selector | `Chain composite (default)`, or `AUX 1` through `AUX 8`. |

A Lamp beside the `Routing` section reports whether the chosen `Feed back to`
target still resolves. If that module is deleted or moved later in the chain,
the Lamp turns red and the loop silently falls back to `Self`.

Modules placed after FEEDBACK in the Chain process its output normally, with
no compounding: the loop only accumulates signal within FEEDBACK itself.

FEEDBACK's Insert FX chain is the one exception to the rest of the app: each
slot also chooses whether it applies before or after the feedback loop
itself, as `Pre` or `Post`. `Pre` runs on the recycled history before the
blend; `Post` runs on the accumulated result after the blend. This is how to
compound FX inside the loop instead. See
[Insert FX Chains](../../../concepts/insert-fx-chains/).

FEEDBACK carries its own Sends. See
[AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
