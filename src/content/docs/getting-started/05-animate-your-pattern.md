---
title: "Animate Your Pattern"
description: "Assign an LFO to Kaleidoscope Rotation, set a slow rate, and control the movement with modulation Depth."
---

Keep `OSC` selected and its `INSERT FX` section expanded after
[Build a Custom Chain](../03-build-a-custom-chain/).

**Unverified in the released app:** the source-picker labels and connection
steps below need a live desktop check. They were checked against the local
development build's source.

## Set the LFO rate

Open `View > Modulation` and select the `LFO` tab. Expand `LFO 1`.
If there is no LFO, click `+ Add LFO`.

Set the LFO's `RATE` to `0.1 Hz`. Use the numeric field beneath its Knob
to enter the value, then press `Enter`. Leave its waveform at `Sine` and
`LEVEL` at `1`. Keep `BPM Sync` off so the rate is measured in Hz.

## Connect rotation

Right-click the kaleidoscope's `Rotation` and choose `Add Modulation Source`.
Choose `LFO` in the `Source type` Selector, then select `LFO 1`.

Enter `45` in the `Depth` numeric field and press `Enter`, then click
`Add Connection`. Leave the connection's `Offset` at `0`.
Click outside the connection editor to watch the pattern turn back and forth.

Change the LFO's `RATE` to adjust how fast it turns. `Depth` belongs to
this connection and controls how far the source moves `Rotation`.

Related: [Modulation Matrix](../../concepts/modulation-matrix/).

Next: [Record and Output](../04-record-and-output/).
