---
title: "SCOPE"
description: "Generate XY oscilloscope traces from audio or internal signals with GPU phosphor persistence."
---

An XY oscilloscope trace with GPU phosphor persistence: each axis reads a
manual value, live audio, or one of two independent internal generators,
and the result accumulates and decays like a real scope tube rather than
redrawing from a sample ring.

| Parameter | Control | Notes |
|---|---|---|
| X Source / Y Source | Selector | Manual, Audio L, Audio R, Generator A, or Generator B, independently per axis. |
| X / Y | Trough | Manual axis value; only live when its Source is Manual. |
| X Scale / Y Scale | Trough | Replaces X / Y for an axis whose Source is Audio or Generator. Gain on that axis's raw bipolar signal, 0 to 2, default 1. Corrects trace geometry on a non-square canvas, since the raw signal otherwise maps 1:1 to screen space with no gain. |
| Blend / Mix | Selector, Trough | Same blend-mode family every other module uses (Replace, Add, etc.) plus a 0-1 Mix amount, applied to the composited trace+backdrop result. |
| Persistence | Trough | Per-second exponential decay of the phosphor trace. |
| Brightness / Width | Trough | Line width in line mode; also sizes points when Points Only is on. |
| Points Only | Rocker | Renders each frame's beam position as a discrete point-glow instead of a connected line between positions. |
| Detail | Trough | Beam segments drawn per frame; hidden (and has no effect) when both axes are Manual. |
| Generator A / Generator B | Selector, Trough | Wave (Sine, Square, Sawtooth, Triangle, S+H, and the same 6 noise waves LFO offers), Freq, Phase, Amp. Square adds Duty, the share of each cycle spent high (1-99%, default 50). S+H jumps to a new random level once per cycle, with no glide. Seed picks the random sequence for S+H and the noise waves; the noise waves also add Harmonics/Spread/Gain/Density. |
| Reset Generators | Button | Zeroes Generator A/B's phase accumulators back in lock-step (restarting S+H at the start of its sequence) and clears the phosphor trail. Only shown when Generator A or B drives an axis: independent modulation of Gen A/B Freq drifts their phases apart over time, skewing the default clean-circle Lissajous shape, and this snaps it back. |

Insert FX on SCOPE applies to the full composited result, backdrop and
phosphor trace together, not the trace alone. The effects see it over black; areas they leave dark stay empty. See
[Insert FX Chains](../../../concepts/insert-fx-chains/).

SCOPE's Sends are send-only: it can feed a bus but has no `Source` field to
read one back, unlike INSERT and FEEDBACK. See
[AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
