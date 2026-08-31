---
title: "Mod Matrix"
---

Every active modulation assignment, main patch and Mixer Mode together, in
one table: `SOURCE`, `SCALE`, `TARGET`, `LIVE`, `BYP`, and a delete column.

`LIVE` shows the assignment's current resolved value as a running meter.
`BYP` turns an assignment off without deleting it. The delete column removes
it outright.

`SCALE` carries the assignment's signed depth, -1 to 1, and a shaping
control beside it. That control is live only for assignments driven by the
`L Level` or `R Level` audio sources; on every other source it is greyed
out. See [Audio-Reactive](../../modulation/audio-reactive/).

Mixer-scoped assignments are shared across every patch in the same bank,
driven by Mixer Mode's own LFO, Envelope, Time, and Macro banks rather than
the patch's, and are saved with the bank rather than with any individual
patch.

Related: [Modulation Matrix](../../../concepts/modulation-matrix/).
