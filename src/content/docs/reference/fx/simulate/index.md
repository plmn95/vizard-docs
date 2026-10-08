---
title: "SIMULATE"
description: "SIMULATE: Simulations that keep their own state from frame to frame and move the picture over time, driven by what happens in it."
---

Simulations that keep their own state from frame to frame and move the
picture over time, driven by what happens in it. Each simulation runs at a
reduced resolution of its own and restarts when the output resolution
changes, when a patch is loaded, or when its slot is moved or removed.

- [Fluid](fluid/)

**NOTE:** each running simulation holds GPU memory. Past a fixed limit, a
further simulation passes its input through and its panel says so. Each
Mixer deck has its own limit.
