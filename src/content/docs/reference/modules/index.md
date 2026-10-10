---
title: "Modules"
description: "The module types a chain can contain."
---

Related: [Insert FX Chains](../../concepts/insert-fx-chains/),
[AUX Sends and Buses](../../concepts/aux-sends-and-buses/).

| Module | What it does |
|---|---|
| [FEEDBACK](feedback/) | Video feedback delay line with its own loop blend and Dry/Wet output. |
| [INSERT](insert/) | Reads an AUX bus back into the chain, or acts as a plain insert stage. |
| [ISF](isf/) | Runs a user-loaded ISF (Interactive Shader Format) shader. |
| [NOISE](noise/) | Procedural noise generator: 7 families (Random, Perlin, Simplex, and more), each in 2D or 3D. |
| [OSC](osc/) | The oscillator generator: Sine, Square, Sawtooth, Triangle, Noise, or a custom waveform. |
| [POINTCLOUD](pointcloud/) | Renders the chain or a bus as a 3D field of points or lines, displaced by brightness. |
| [SCOPE](scope/) | An XY trace from audio, internal generators, or manual values, with persistence. |
| [SHAPE](shape/) | Procedural 2D shapes and symmetry: circles, polygons, Lissajous curves, and more. |
| [SOURCE](source/) | Brings external video into the chain: a file, a capture device, or NDI/Spout/Syphon input. |
| [SPRITE](sprite/) | Places an image, sprite sheet, or hand-drawn pixel art in the chain, tiled, scattered, or fractal-repeated. |
| [TEXT](text/) | Draws and scrolls text with font, layout, and styling controls. |

One chain holds up to 8 instances of each type, with two exceptions: INSERT
allows 16, and SCOPE is a singleton.
