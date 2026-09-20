---
title: "TEXT"
---

Draws a line or block of text into the chain. The string is typed straight
into the module panel; every other control styles the same rendered text
without re-rendering it, so all of them can be modulated.

| Parameter | Control | Notes |
|---|---|---|
| Text | text field | The content. Enter starts a new line; the field grows one row per line and each line is centered in the block. |
| Font | Dropdown | The font family: one alphabetical list of the bundled retro/terminal fonts and the fonts installed on the computer, each row drawn in its own typeface, plus `Load Custom...` (a `.ttf`, `.otf` or `.ttc` file) and `Refresh List`. A font that cannot be found on this machine is drawn with the bundled default and shown as `(missing)`. |
| Style | Dropdown | The family's styles (Regular, Bold, Italic, ...), also drawn in their own face. Dimmed when the family has only one style. |
| Mix | Trough | Opacity of the module's contribution to the chain. |
| Blend | Selector | Add, Multiply, Screen, Difference, XOR, Replace, or Phoenix into the chain. |
| Position / Size / Rotation | Pad, Trough, Wheel | Size is the only size control; there is no separate font size. |
| Fill | Trough | Fill color and alpha. |
| Stroke | Rocker, Trough | An outline around the glyphs: width (0 to 24) and color/alpha. Dimmed while the Rocker is off. |
| Background | Rocker, Trough | A solid box behind the whole block: color/alpha and padding (0 to 64). Follows the same transform and warp as the text. |
| Emboss | Rocker, Wheel, Trough | A directional light shading the glyph edges: angle, depth and strength. |
| Warp | Selector, Trough | None, Arc, Bulge, Flag, Wave, or Fisheye, driven by Bend, Horizontal and Vertical. The sliders are dimmed while the preset is None. |

**NOTE:** the text is rendered once per change of content or font, spread
across frames when a patch loads several instances; a slider change is
visible on the same frame. While a new string is being rendered the previous
one stays on screen, so typing never flashes to empty.

**NOTE:** a font chosen with `Load Custom...` is stored by file path. With
embedded assets enabled in Settings, the font file travels inside the saved
patch like a SPRITE's image does.

Related: [Insert FX Chains](../../../concepts/insert-fx-chains/),
[AUX Sends and Buses](../../../concepts/aux-sends-and-buses/),
[Modulation Matrix](../../../concepts/modulation-matrix/).
