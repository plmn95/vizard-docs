---
title: "SOURCE"
---

Brings external video into the chain, from a file, a live capture device, or
another program's NDI/Spout/Syphon output.

| Parameter | Control | Notes |
|---|---|---|
| Input | Selector | Video File, Camera / Capture, NDI In, Spout In (Windows only), Syphon In (macOS only). |
| File / Device | file picker, text field | Meaning depends on Input: a file path for Video File, an OS capture handle for Camera / Capture, or a sender/server name to connect to for NDI/Spout/Syphon In. |
| Loop | Rocker | File input only. |
| Speed | Trough | 0 to 4.0x. At 0 the value field reads `Pause`. Playback is forward only; there is no reverse. |
| Blend | Selector | Add, Multiply, Screen, Difference, XOR, Replace, or Phoenix into the chain. |
| Mix | Trough | Wet/dry of the source against what's beneath it. |

Related: [Insert FX Chains](../../../concepts/insert-fx-chains/),
[AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
