---
title: "POINTCLOUD"
---

Renders the chain, or an AUX bus, as a 3D field of points or lines, displaced
by brightness.

| Parameter | Control | Notes |
|---|---|---|
| Color Source | Selector | `Chain composite (default)` or `AUX 1` to `AUX 8`. |
| Depth Source | Selector | `Generated (default)` derives depth from Color Source's brightness; `AUX 1` to `AUX 8` read depth from a bus. |
| Mix | Trough | 0-1. |
| Blend | Selector | Add, Multiply, Screen, Difference, XOR, Replace, or Phoenix. |
| Shape | Selector | Flat, Sphere, or Flow. Greyed out and fixed to Flat while the style is Voxels. |
| Density | Trough | 0-1. Point and line grid resolution. In Voxels, how many cubes fit across the longest side, from 8 to 256. |
| Depth Amount | Trough | 0-1. How strongly depth pushes points off their shape. In Voxels, how tall the cube columns can get. |
| Perspective | Trough | 0-2. 0 is flat. |
| Zoom | Trough | 0.1-4. |
| Orbit / Tilt | Wheel | -180 to 180 degrees. |
| Point Size | Trough | 0.5-8 px. |
| Style | Selector | Points, Horiz Scanlines, Vert Scanlines, Depth Circles, Wireframe, Radial Scan, Trail/Comet, Solid Mesh, or Voxels. Voxels draws the picture as a wall of gap-free cubes, with brighter areas standing taller. |
| Point | Selector | Auto, Square, Round, Soft, or Ring. Look of each point. Auto uses Square for Flat and Sphere, and Soft for Flow. Only applies to Points, Depth Circles and Trail/Comet. |
| Backdrop | Rocker | Replace only. Removes the chain behind the point cloud; the gaps between points and lines stay empty, black on the output. |
| Trail | Trough | 0-1. Trail/Comet only: how much of the previous frame's points persist. |
| Cutoff | Trough | 0-1. Voxels only: hides dark or distant areas so only the subject stays. |
| Shading | Trough | 0-1. Voxels only: how differently each cube face is lit. 0 is flat colour. |
| Edges | Trough | 0-1. Voxels only: thin lines between cubes. 0 gives a seamless solid. |

Related: [Insert FX Chains](../../../concepts/insert-fx-chains/),
[AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
