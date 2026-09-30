---
title: "TEXT"
---

Draws a line or block of text into the chain, placed, sized and scrolled
by the module itself, so text beyond the edge of the screen can still move
into view. The string is typed straight into the module panel; every
control except Letter Spacing styles the same rendered text without
re-rendering it, so all of them can be modulated.

| Parameter | Control | Notes |
|---|---|---|
| Text | text field | The content. Enter starts a new line. The field grows one row per line up to eight rows, then scrolls. No length limit. |
| Font | Dropdown | The font family: one alphabetical list of the bundled retro/terminal fonts and the fonts installed on the computer, each row drawn in its own typeface, plus `Load Custom...` (a `.ttf`, `.otf` or `.ttc` file) and `Refresh List`. A font that cannot be found on this machine is drawn with the bundled default and shown as `(missing)`. |
| Style | Dropdown | The family's styles (Regular, Bold, Italic, ...), also drawn in their own face. Dimmed when the family has only one style. Picking a style sets `B` and `I` to match it. |
| B / I / U / S | Rocker | Bold, italic, underline, strikethrough. `B` and `I` switch Style to the family's real bold or italic when it has one and simulate it otherwise; hovering a lit `B` or `I` says when it is simulated. Underline and strikethrough run to the last letter of each line and take the stroke, emboss and warp. Not modulatable. |
| Mix | Trough | Opacity of the module's contribution to the chain. |
| Blend | Selector | Add, Multiply, Screen, Difference, XOR, Replace, or Phoenix into the chain. |
| Alignment | Selector, Trough | `L`, `C`, `R` snap lines to the left, centre or right of the block; the Trough (0 to 1) places them anywhere in between. |
| Line Spacing | Trough | Distance between lines, 0.5 to 3 times the font's line height. |
| Letter Spacing | Trough | Extra space between letters, -0.1 to 1 em. Applies on release. Not modulatable. |
| Position | Pad | Places the text. |
| Scale | Pad, Rocker | Text width and height around the frame centre; the only size control, and the text stays sharp at any value. `Link X/Y` (on by default) resizes without stretching; `Flip X` / `Flip Y` mirror the text. |
| Rotation | Wheel | Degrees, clockwise. |
| Speed | Pad | Scroll speed per axis in loops per second, the same loop time whatever the text length. Positive scrolls right or up, negative left or down; both axes together scroll diagonally. 0 is still. |
| Offset | Pad | Position within the scroll loop per axis; wraps around. |
| Gap | Trough | Space before the scrolled text repeats, in screens (0 to 2). |
| Fill | Trough | Fill color and alpha. |
| Stroke | Rocker, Trough | An outline around the glyphs: width (0 to 24) and color/alpha. Dimmed while the Rocker is off. |
| Emboss | Rocker, Wheel, Trough | A directional light shading the glyph edges: angle, depth and strength. |
| Warp | Selector, Trough | None, Arc, Bulge, Flag, Wave, or Fisheye, driven by Bend, Horizontal and Vertical. The sliders are dimmed while the preset is None. |

**NOTE:** an axis repeats only while its Speed or Offset is not 0. Still
text never shows copies of itself.

**NOTE:** scrolled text moves through the Warp; the warp shape stays in
place. For a strip like a shop-window LED sign, add a Mask insert effect.

**NOTE:** an LFO or Time source on Offset gives scrolling motion of any
shape. Offset keeps wrapping past 1, so a steadily rising source scrolls
forever.

**NOTE:** the text is rendered once per change of content, font or Letter
Spacing, spread across frames when a patch loads several instances; any
other change is visible on the same frame. While a new string is being
rendered the previous one stays on screen, so typing never flashes to
empty.

**NOTE:** a font chosen with `Load Custom...` is stored by file path. With
embedded assets enabled in Settings, the font file travels inside the saved
patch like a SPRITE's image does.

Related: [Insert FX Chains](../../../concepts/insert-fx-chains/),
[AUX Sends and Buses](../../../concepts/aux-sends-and-buses/),
[Modulation Matrix](../../../concepts/modulation-matrix/).
