---
title: "SCOPE"
---

An XY oscilloscope trace with GPU phosphor persistence: each axis reads a
manual value, live audio, or one of two independent internal generators,
and the result accumulates and decays like a real scope tube rather than
redrawing from a sample ring.

| Parameter | Control | Notes |
|---|---|---|
| X Source / Y Source | Selector | Manual, Audio L, Audio R, Generator A, or Generator B, independently per axis. |
| X / Y | Trough | Manual axis value; only live when its Source is Manual. |
| Persistence | Trough | Per-second exponential decay of the phosphor trace. |
| Brightness / Line Width | Trough | |
| Detail | Trough | Beam segments drawn per frame; has no effect when both axes are Manual. |
| Generator A / Generator B | Selector, Trough | Wave (Sine, Square, Sawtooth, Triangle, and the same 6 noise waves LFO offers), Freq, Phase, Amp, plus Seed/Harmonics/Spread/Gain/Density for the noise waves. |

Insert FX on SCOPE applies to the full composited result, backdrop and
phosphor trace together, not the trace alone. See
[Insert FX Chains](../../../concepts/insert-fx-chains/).

SCOPE's Sends are send-only: it can feed a bus but has no `Source` field to
read one back, unlike INSERT and FEEDBACK. See
[AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
