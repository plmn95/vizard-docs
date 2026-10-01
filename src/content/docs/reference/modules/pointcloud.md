---
title: "POINTCLOUD"
---

Renders the chain, or an AUX bus, as a 3D field of points or lines, displaced
by brightness.

The volume shapes, Galaxy Spiral, Noise Blob and Strange Attractor take their
colour from the picture where each point lands on screen, so the picture stays
recognisable behind the points. Spectrum wraps the picture into a ring that
bulges with the audio input, and stays flat with no audio.

| Parameter | Control | Notes |
|---|---|---|
| Color Source | Selector | `Chain composite (default)` or `AUX 1` to `AUX 8`. |
| Depth Source | Selector | `Generated (default)` derives depth from Color Source's brightness; `AUX 1` to `AUX 8` read depth from a bus. |
| Mix | Trough | 0-1. |
| Blend | Selector | Add, Multiply, Screen, Difference, XOR, Replace, or Phoenix. |
| Shape | Selector | Grouped list. Surfaces: Flat, Sphere. Volumes: Sphere Volume, Box Volume, Torus. Organic: Flow, Galaxy Spiral, Noise Blob. Math: Strange Attractor. Audio: Spectrum. Greyed out and fixed to Flat while the style is Voxels. |
| Thickness / Shell / Fill / Arms / Twist / Turbulence / Tube Size / Detail / Speed / Height / Smoothing | Trough | 0-1. One or two sliders that appear for the shapes that use them, and every one can be modulated. Sphere Volume: Thickness (0 is a hollow shell, 1 a solid ball). Box Volume: Shell (0 is a solid block, 1 only the outside faces). Torus: Fill (0 is a thin skin, 1 a filled tube) and Tube Size. Galaxy Spiral: Arms (2 to 6) and Twist. Noise Blob: Turbulence and Thickness. Strange Attractor: Detail (higher costs more on slow graphics cards) and Speed. Spectrum: Height and Smoothing. |
| Curve | Selector | Strange Attractor only: Lorenz, Aizawa, or Thomas. |
| Density | Trough | 0-1. Point and line grid resolution. In Voxels, how many cubes fit across the longest side, from 8 to 256. |
| Depth Amount | Trough | 0-1. How strongly depth pushes points off their shape. In Voxels, how tall the cube columns can get. The volume shapes, Galaxy Spiral, Noise Blob and Strange Attractor ignore it. |
| Perspective | Trough | 0-2. 0 is flat. |
| Zoom | Trough | 0.1-4. |
| Orbit / Tilt | Wheel | -180 to 180 degrees. |
| Point Size | Trough | 0.5-8 px. |
| Style | Selector | Points, Horiz Scanlines, Vert Scanlines, Depth Circles, Wireframe, Radial Scan, Trail/Comet, Solid Mesh, or Voxels. Voxels draws the picture as a wall of gap-free cubes, with brighter areas standing taller. Shapes that scatter free-floating points (the volumes, Galaxy Spiral, Noise Blob, Strange Attractor and Spectrum) only offer Points, Depth Circles and Trail/Comet. |
| Point | Selector | Auto, Square, Round, Soft, or Ring. Look of each point. Auto uses Square for Flat and Sphere, and Soft for Flow. Only applies to Points, Depth Circles and Trail/Comet. |
| Backdrop | Rocker | Replace only. Removes the chain behind the point cloud; the gaps between points and lines stay empty, black on the output. |
| Trail | Trough | 0-1. Trail/Comet only: how much of the previous frame's points persist. |
| Cutoff | Trough | 0-1. Voxels only: hides dark or distant areas so only the subject stays. |
| Shading | Trough | 0-1. Voxels only: how differently each cube face is lit. 0 is flat colour. |
| Edges | Trough | 0-1. Voxels only: thin lines between cubes. 0 gives a seamless solid. |

Related: [Insert FX Chains](../../../concepts/insert-fx-chains/),
[AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
