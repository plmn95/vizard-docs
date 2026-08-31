---
title: "CV/Gate"
---

External control voltage and gate input, carried on the audio interface's
own channels beyond the stereo pair. Channels 1 and 2 stay dedicated to
stereo audio in; up to 12 further channels can be read as CV or Gate.

Nothing appears in the `CV/Gate` tab until a channel is configured. Each one
is set up in `Settings > Audio > CV/Gate Channels`:

| Control | Notes |
|---|---|
| Mode | `Off`, `CV` (continuous, read as a smoothed 0 to 1 value), or `Gate` (trigger, read as 0 or 1). Set per channel; there is no fixed split between the two. |
| Range | `0-5V`, `+/-5V`, `+/-10V`, or `+/-2.5V`. CV channels only. |

Configured channels then appear as sources named for their physical input
and mode, `Ch 3 (CV)` or `Ch 4 (Gate)`, each with a live meter beside it for
calibrating against the incoming signal.

Related: [Modulation Matrix](../../../concepts/modulation-matrix/).
