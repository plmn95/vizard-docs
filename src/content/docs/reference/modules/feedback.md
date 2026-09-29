---
title: "FEEDBACK"
---

Video feedback as a delay line: the incoming frame is sent into a loop,
each lap keeps part of what was already circulating, and `Dry/Wet` sets how
much of the loop reaches the output in place of the incoming frame.

## Output

| Parameter | Control | Notes |
|---|---|---|
| Dry/Wet | Trough | 0 shows only the incoming frame. 0.50 shows the incoming frame and the loop together, combined by `Blend`. 1 shows only the loop; transparent areas of the loop stay transparent. Default 0.50. |
| Blend | Selector | `Add`, `Multiply`, `Screen`, `Difference`, `XOR`, `Replace`, or `Phoenix`. How the incoming frame and the loop combine in the middle of the `Dry/Wet` range. At 0.50, `Add` shows both at full strength and `Replace` puts the loop on top. At 1, `Blend` has no effect. |

## Loop

| Parameter | Control | Notes |
|---|---|---|
| Amount | Trough | How strongly the incoming frame is fed into the loop, 0-1. At 0 nothing new enters and the loop fades away. |
| Decay | Trough | How much of the loop survives each lap, 0-1. 1 never fades. |
| Loop Blend | Selector | Same seven modes as `Blend`. How each new frame recombines with what is already circulating. `Add` builds the trail up, `Difference` and `XOR` churn on the edges between laps, `Multiply` and `Screen` keep it bounded. `Replace` paints each new frame over the echoes: where the frame has picture it replaces them and `Decay` has no effect; where it is empty the echoes stay and fade by `Decay`. |
| Black Key | Trough | 0-1. Parts of the incoming frame darker than this count as empty, fading smoothly to see-through, so older echoes show through under `Loop Blend` Replace. 0 = off (default). |

## Timing and routing

| Parameter | Control | Notes |
|---|---|---|
| Delay | Trough, Rocker | 0-500ms, 0 bypasses the delay ring entirely; a Rocker switches it to a BPM division (`1/16` to `4`) instead of a raw ms value. |
| Hold | Trough, Rocker | 0-1000ms inter-frame hold, same BPM-sync Rocker as Delay. 0 steps every frame. |
| Feed back to | Selector | `Self (default)`, or an earlier `INSERT`, `FEEDBACK`, or `ISF` to inject this loop's previous frame into. Generators ignore chain input and can't be targets. |
| Source | Selector | `Chain composite (default)`, or `AUX 1` through `AUX 8`. |

A Lamp beside the `Routing` section reports whether the chosen `Feed back to`
target still resolves. If that module is deleted or moved later in the chain,
the Lamp turns red and the loop silently falls back to `Self`.

Modules placed after FEEDBACK in the Chain process its output normally, with
no compounding: the loop only accumulates signal within FEEDBACK itself.

## Insert FX

Each Insert FX slot on FEEDBACK chooses `Pre` or `Post`. `Pre` runs on the
recycled loop every lap, so it compounds: a small rotation spirals, a small
hue shift cycles. Every echo that reaches the output has passed through `Pre`
at least once. `Post` runs once on the loop's output on the way out and does
not compound. Each slot's own `Mix` still applies, and `Dry/Wet` scales both
stages together with the rest of the loop. See
[Insert FX Chains](../../../concepts/insert-fx-chains/).

## Recipes

| Result | Settings |
|---|---|
| Input plus one repeat at the same level | `Loop Blend` Replace, `Amount` 1, `Black Key` 0, `Blend` Add, `Dry/Wet` 0.50 |
| Loop only, each repeat half as bright | `Loop Blend` Add, `Amount` 1, `Decay` 0.5, `Dry/Wet` 1 |
| Afterimage held at half brightness | `Loop Blend` Add, `Amount` 1, `Decay` 1, `Blend` Add, `Dry/Wet` 0.25 |
| Clean delay line | `Loop Blend` Replace, `Amount` 1, `Black Key` 0, `Dry/Wet` 1, `Delay` as needed. Two in series add their delays. |
| Painted trail that never fades | `Loop Blend` Replace, `Amount` 1, `Decay` 1, `Black Key` 0.10, `Dry/Wet` 1 |
| Recursive edge churn | `Loop Blend` XOR or Difference, `Decay` around 0.9 |

**NOTE:** SCOPE, OSC and SHAPE draw on an opaque black background, so under
`Loop Blend` Replace each new frame would cover every older echo.
`Black Key` treats dark parts of the incoming frame as empty so echoes show
through; set it to 0 for a plain delay. For a key by brightness range or
colour, place an INSERT with `Luma Key` or `Chroma Key` right before
FEEDBACK.

**NOTE:** with `Feed back to` set to an earlier module, `Dry/Wet` is applied
where the loop enters that module, so everything shown passes through the
modules in between. At 0 the chain runs as if FEEDBACK were off. Below 0.50
`Dry/Wet` also shortens the trail, and `Amount`, `Loop Blend` and
`Black Key` only take effect above 0.50. This routing has a single recursion, so the repeat-once,
held-afterimage and delay-line recipes need `Self`.

FEEDBACK carries its own Sends. See
[AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
