---
title: "Modules"
---

The module types a chain can contain.

Every module here carries its own Insert FX chain and its own Sends; see
[Insert FX Chains](../../concepts/insert-fx-chains/) and
[AUX Sends and Buses](../../concepts/aux-sends-and-buses/) for how those
work in general.

| Module | What it does |
|---|---|
| [FEEDBACK](feedback/) | Ping-pong video feedback: decays and re-injects a previous frame. |
| [INSERT](insert/) | Reads an AUX bus back into the chain, or acts as a plain insert stage. |
| [ISF](isf/) | Runs a user-loaded ISF (Interactive Shader Format) shader. |
| [NOISE](noise/) | Procedural noise generator: 7 families (Random, Perlin, Simplex, and more), each in 2D or 3D. |
| [OSC](osc/) | The oscillator generator: Sine, Square, Sawtooth, Triangle, Noise, or a custom waveform. |
| [SCOPE](scope/) | An oscilloscope-style XY trace with GPU phosphor persistence. |
| [SHAPE](shape/) | Procedural 2D shapes and symmetry: circles, polygons, Lissajous curves, and more. |
| [SOURCE](source/) | Brings external video into the chain: a file, a capture device, or NDI/Spout/Syphon input. |
| [SPRITE](sprite/) | Places an image, sprite sheet, or hand-drawn pixel art in the chain, tiled, scattered, or fractal-repeated. |
| [TEXT](text/) | Draws a typed line or block of text in the chain, in a bundled, installed, or custom font, with fill, outline, background, emboss, and warp styling. |

One chain holds up to 8 instances of each type, with two exceptions: INSERT
allows 16, and SCOPE is a singleton. A type already at its limit stays
listed in the `+` menu but is no longer pickable.
