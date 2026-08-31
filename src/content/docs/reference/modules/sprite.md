---
title: "SPRITE"
---

Places an image in the chain: a loaded file (still image, sprite sheet, or
video/GIF) or artwork drawn directly in the built-in pixel editor, then
repeated as a single sprite, a tiled grid, a fractal, or a scatter of
instances.

| Parameter | Control | Notes |
|---|---|---|
| Source | Selector | File (loaded via the file picker) or Pixel Art (drawn in the built-in pixel editor). |
| Display Mode | Selector | Sprite, Tile, Fractal, or Scatter. |
| Blend | Selector | Add, Multiply, Screen, Difference, XOR, Replace, or Phoenix into the chain. |
| Position / Size / Rotation | Pad, Knob, Wheel | |
| Alpha Mode | Selector | Per-Pixel, Threshold, or Blend. |
| Tint | Trough | Color and amount, applied on top of the source image. |
| Repeat Count | Trough | Tile Mode's grid size, or Scatter Mode's instance count. |
| Depth / Scale Factor | Trough | Fractal Mode's recursion depth and per-level scale falloff. |
| Sheet Animation | Selector, Trough | Off, Forward, Ping-Pong, or Random playback through a sprite sheet's grid (columns, rows, frame count, and fps), independent of Display Mode. |
| Loop / Speed | Rocker, Trough | File input only. Speed runs 0 to 4.0x, forward only, same shape as SOURCE's. |

Related: [Insert FX Chains](../../../concepts/insert-fx-chains/),
[AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
