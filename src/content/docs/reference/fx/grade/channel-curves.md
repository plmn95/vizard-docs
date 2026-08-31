---
title: "Channel Curves"
---

A Photoshop/After-Effects-style tone curve editor: any number of
freely-positioned control points, each with its own Bezier handles for
shaping the curve through it, on up to four channels (Red/Green/Blue/Luma)
at once, in a single slot.

| Parameter | Control | Range | Notes |
|---|---|---|---|
| Edit channel | Selector | Red, Green, Blue, Luma | Which channel's points and handles are live-editable this frame. Every active channel's curve line stays visible and color-coded, dimming when it is not the edited channel so the whole grade remains visible while one channel is worked on. Only the edited channel's control points and handles are drawn, to keep a multi-curve well from turning into a field of overlapping dots. |
| Solo | Rocker | | Isolates one channel by hiding the other three entirely instead of dimming them, for inspecting a single curve alone. |
| Active | Rocker | | Whether the currently-selected channel has a curve at all. An inactive channel is a true no-op: it costs nothing and is skipped by the shader. |
| Curve well | interactive curve graph | X and Y each 0 to 1 | A selected point can be dragged freely in X and Y; selecting it reveals its Bezier handles as small diamonds. A click anywhere on the edited channel's curve line adds a new point there. `Delete`, `Backspace`, or the `Remove point` button removes a selected point, except the first and last: those are permanent, so the curve always spans the full input range. A double-click, or an `Alt`-click, on a point flattens its handles back to a plain corner. |

Channels compose in a fixed order: Red, Green and Blue curves are applied
independently first; the Luma curve is applied last, to the result of the
RGB curves, rescaling RGB proportionally to preserve hue/chroma rather than
flattening it.

Points and handles are hard-clamped to the well's own [0,1] range: a
point can never be dragged, and a handle can never be shaped, past what
is visibly plotted.

Curve points and handles are not modulation-matrix targets: a single
point or handle driven by an LFO in isolation would produce only a local
kink, not a coherent grading effect.

Related: [Insert FX Chains](../../../../concepts/insert-fx-chains/), [Channel Attenuverter](../channel-attenuverter/).
