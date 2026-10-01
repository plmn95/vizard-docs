---
title: "Dither"
---

Reduces each color to a few shades and arranges the rounding error into a pattern, so smooth gradients read as texture instead of hard bands.

| Parameter | Control | Range | Notes |
|---|---|---|---|
| Algorithm | Selector | 14 patterns | Grouped as Ordered, Noise, Screen and Diffusion Look. See the table below. Not modulation-assignable. |
| Quantize To | Selector | Color Levels, Gray Levels, Spread Only | Color Levels reduces red, green and blue to `Levels` shades each. Gray Levels converts to gray first, then reduces. Spread Only adds the pattern without reducing any shades. Not modulation-assignable. |
| Levels | Trough | 2 to 32 | Shades kept per color. In Spread Only it sets how far the pattern spreads, so match it to the number of tones in the palette that follows. |
| Strength | Trough | 0 to 1 | 0 gives plain banding with no pattern. 1 gives the full pattern. |
| Cell Size | Trough | 1 to 32px | The picture is sampled once per cell, so larger cells give a chunkier, lower-resolution look. 1 works on every pixel. |
| Angle | Wheel | -180 to 180 | Rotates the pattern. Halftone Dots always starts from the classic 45 degree screen angle, and Angle turns it from there. |
| Animate | Trough | 0 to 30 Hz | How many times per second the pattern changes. 0 keeps it still. |
| Bias | Trough | -0.5 to 0.5 | Pushes the picture lighter or darker before the shades are chosen. |

## Algorithms

| Group | Algorithm | Look |
|---|---|---|
| Ordered | Bayer 2x2, Bayer 4x4, Bayer 8x8, Bayer 16x16 | Regular grids. The larger the grid, the smoother the gradients. |
| Ordered | Bayer + Noise | A Bayer 8x8 grid with blue noise mixed in to hide the grid lines. |
| Noise | Blue Noise | Even, grain-like noise with no visible grid. |
| Noise | Gradient Noise | A fast diagonal noise, more structured than white noise. |
| Noise | White Noise | Pure random speckle. |
| Screen | Halftone Dots | Printed dots that grow with brightness. |
| Screen | Clustered Dot | A fixed 8 by 8 dot pattern, like an old digital printer. |
| Screen | Line Screen | Parallel lines that thicken with brightness. |
| Screen | Cross-Hatch | Two sets of lines at right angles that thicken with brightness. |
| Diffusion Look | Floyd-Steinberg Look, Atkinson Look | Organic worm-like patterns. Atkinson Look also crushes the brightest and darkest areas, as the early Macintosh did. |

The pattern is fixed to the output frame, not to the picture. Moving content slides underneath it.

**NOTE:** the two Diffusion Look entries approximate error diffusion. True error diffusion depends on every pixel before it, so each part of the frame runs the same method over its own small block instead. The result keeps the character of the originals, with no error carried across block borders. They cost the most at a `Cell Size` of 1, and raising `Cell Size` makes them cheaper. In Spread Only they fall back to Blue Noise.

**NOTE:** Dither does not change transparency. Parts of the picture that are empty stay empty.

To dither with a specific set of colors, set `Quantize To` to Spread Only and place a [Palette Map](../palette-map/) later in the same chain.

Related: [Posterize](../posterize/), [Insert FX Chains](../../../../concepts/insert-fx-chains/).
