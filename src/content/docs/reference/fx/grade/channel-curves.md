---
title: "Channel Curves"
description: "Shape red, green, blue, and luma tone curves with movable control points and Bezier handles."
---

Edits Red, Green, Blue, and Luma tone curves using control points and
Bezier handles.

| Parameter | Control | Range | Notes |
|---|---|---|---|
| Edit channel | Selector | Red, Green, Blue, Luma | Other active curves remain visible but dimmed. |
| Solo | Rocker | | Hides the other channels' curves. |
| Active | Rocker | |  |
| Curve well | interactive curve graph | X and Y each 0 to 1 | Click the curve to add a point; select a point to adjust its Bezier handles. `Delete`, `Backspace`, or `Remove point` removes the selected point. The first and last points cannot be deleted. Double-click, `Alt+click` (Windows/Linux), or `Option+click` (macOS) a point to flatten its handles. |

Channels compose in a fixed order: Red, Green and Blue curves are applied
independently first; the Luma curve is applied last, to the result of the
RGB curves, rescaling RGB proportionally to preserve hue/chroma rather than
flattening it.

Curve points and handles cannot be modulated.

Related: [Insert FX Chains](../../../../concepts/insert-fx-chains/), [Channel Attenuverter](../channel-attenuverter/).
