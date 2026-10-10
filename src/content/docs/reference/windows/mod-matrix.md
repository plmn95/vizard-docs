---
title: "Mod Matrix"
description: "Inspect and edit modulation assignments in the current patch."
---

Every active modulation assignment in the current patch, in one table: `SOURCE`, `DEPTH`, `TARGET`, `LIVE`, `BYP`, and a delete column.

`LIVE` shows how strongly the assignment is moving its target right now, as
a share of the target's range. At the source's peak the meter reaches the
percentage shown beside `DEPTH`, so a lower LFO Level or a smaller Depth
shrinks it, and a negative Depth fills it the other way. The number beside
the meter shows the same change in the target's own units, including
Offset. `BYP` turns an assignment off without deleting it. The delete column removes
it outright.

`DEPTH` sets how far the assignment moves its target, in the target's own
units, with the matching percentage of the target's range shown beside it.
A negative Depth
inverts the modulation. Beside it sit an Offset control (`±`), which adds a
constant offset on top of the swing, and a shaping control. The shaping
control is live only for assignments driven by the `L Level` or `R Level`
audio sources; on every other source it is greyed out. See [Audio-Reactive](../../modulation/audio-reactive/).

Mixer Mode's modulation is not listed here. It is set up on the mixer
controls themselves; see [Mixer Mode](../../../concepts/mixer-mode/).

Related: [Modulation Matrix](../../../concepts/modulation-matrix/).
