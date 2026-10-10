---
title: "Build a Custom Chain"
description: "Build a six-segment kaleidoscope from the default OSC module and its Insert FX chain."
---

Save any changes you want to keep, then choose
`File > Reset Active Patch to Default`.
This leaves one `OSC` module in the chain.

## Shape the pattern

Select `OSC` in `Chain`. Under `Waveform` in `Module`, choose the
sine-wave icon.

Expand `FREQUENCY` and move the `Freq X / Freq Y` Pad to change the spacing
and direction of the colored bands.

For this recipe, enter `3` in `Freq X` and `2` in `Freq Y`, pressing
`Enter` after each value. Leave the channels' other controls at their
default values.

## Add the kaleidoscope

Expand `INSERT FX`, click `+ Add`, and choose `Kaleidoscope` from the
effect type Selector.

Click the numeric field for `Segments`, enter `6`, and press `Enter`.
Drag `Rotation` to turn the mirrored pattern, then enter `0` in its
numeric field before adding modulation.

The effect runs inside `OSC`'s Insert FX chain. Keep that one module for
this recipe; a second generator would add another image to the chain.

Related: [Insert FX Chains](../../concepts/insert-fx-chains/).

Next: [Animate Your Pattern](../05-animate-your-pattern/).
