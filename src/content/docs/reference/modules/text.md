---
title: "TEXT"
description: "Draw, position, size, and scroll text in the video chain using the TEXT module."
---

Draws text with font, layout, styling, and scrolling controls.

| Parameter | Control | Notes |
|---|---|---|
| Text | text field | Multiline text with no length limit. |
| Font | Dropdown | Bundled and installed fonts. `Load Custom...` accepts `.ttf`, `.otf`, or `.ttc` files; `Refresh List` reloads installed fonts. A font that cannot be found on this machine is drawn with the bundled default and shown as `(missing)`. |
| Style | Dropdown |  |
| B / I / U / S | Rocker | Bold, italic, underline, strikethrough. `B` and `I` switch Style to the family's real bold or italic when it has one and simulate it otherwise; hovering a lit `B` or `I` says when it is simulated. Cannot be modulated. |
| Mix | Trough | Opacity of the module's contribution to the chain. |
| Blend | Selector | Add, Multiply, Screen, Difference, XOR, Replace, or Phoenix into the chain. |
| Alignment | Selector, Trough | `L`, `C`, `R` snap lines to the left, centre or right of the block; the Trough (0 to 1) places them anywhere in between. |
| Line Spacing | Trough | Distance between lines, 0.5 to 3 times the font's line height. |
| Letter Spacing | Trough | Extra space between letters, -0.1 to 1 em. Applies on release. Cannot be modulated. |
| Position | Pad | |
| Scale | Pad, Rocker | Text width and height around the frame centre. `Link X/Y` (on by default) resizes without stretching; `Flip X` / `Flip Y` mirror the text. |
| Rotation | Wheel | Degrees, clockwise. |
| Speed | Pad | Scroll speed per axis in loops per second, the same loop time whatever the text length. Positive scrolls right or up, negative left or down. |
| Offset | Pad | Position within the scroll loop per axis; wraps around. |
| Gap | Trough | Space before the scrolled text repeats, in screens (0 to 2). |
| Fill | Trough | Fill color and alpha. |
| Stroke | Rocker, Trough | An outline around the glyphs: width (0 to 24) and color/alpha. |
| Emboss | Rocker, Wheel, Trough | A directional light shading the glyph edges: angle, depth and strength. |
| Warp | Selector, Trough | None, Arc, Bulge, Flag, Wave, or Fisheye, driven by Bend, Horizontal and Vertical. |

**NOTE:** an axis repeats only while its Speed or Offset is not 0. Still
text never shows copies of itself.

**NOTE:** scrolled text moves through the Warp; the warp shape stays in
place. For a strip like a shop-window LED sign, add a Mask insert effect.

**NOTE:** an LFO or Time source on Offset gives scrolling motion of any
shape. Offset keeps wrapping past 1, so a steadily rising source scrolls
forever.

**NOTE:** content, font, and Letter Spacing changes can take several frames
to appear. The previous text remains visible during the update.

**NOTE:** enable embedded assets in `Settings > Patches` to include custom
font files in saved patches.

Related: [Insert FX Chains](../../../concepts/insert-fx-chains/),
[AUX Sends and Buses](../../../concepts/aux-sends-and-buses/),
[Modulation Matrix](../../../concepts/modulation-matrix/).
