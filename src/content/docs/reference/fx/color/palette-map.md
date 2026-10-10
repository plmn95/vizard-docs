---
title: "Palette Map"
description: "Repaints the picture using only the colors in an editable palette: each pixel takes the palette color nearest to its own."
---

Repaints the picture using only the colors in an editable palette: each pixel takes the palette color nearest to its own.

| Parameter | Control | Range | Notes |
|---|---|---|---|
| Preset | Selector | 8 presets | Game Boy, 1-Bit B/W, CGA, EGA 16, C64 16, Pico-8 16, Amber Phosphor and Green Phosphor. Choosing one replaces the palette. The selector reads Custom once a color has been edited, added or removed. |
| Palette | color swatches | 2 to 32 colors | Click a swatch to select it, then edit it with the color row beneath. `+ Color` adds a copy of the selected color after it, and `- Color` removes the selected color. Cannot be modulated. |
| Cycle | Trough | 0 to 31 | Shifts which palette color each matched pixel uses, wrapping around the end of the palette. Sweeping it gives color cycling. |

A new Palette Map starts with the Game Boy palette.

Transparency is unchanged.

For dithering in the palette's colors, place [Dither](../dither/) before Palette Map and set `Quantize To` to Spread Only. Dither's `Add Palette Map after` button inserts the second effect.

Related: [Posterize](../posterize/), [Insert FX Chains](../../../../concepts/insert-fx-chains/).
