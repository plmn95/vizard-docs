---
title: "Settings"
---

8 categories, listed down the left side of the `Settings` window.

| Category | Covers |
|---|---|
| Output | Display Fit, Dual Monitor Output, NDI/Spout/Syphon output. |
| Audio | Audio input: a Device to capture from, or capturing another application's audio (not available on any platform yet). Also `CV/Gate Channels`, where each input channel past the stereo pair is marked `Off`, `CV`, or `Gate` and given a voltage range; and `Custom Frequency Bands`, the 4 user-defined bands' low/high Hz ranges. |
| MIDI | MIDI port selection. |
| OpenSoundControl | The UDP listen port. |
| Recording | Quality (4 stops, Low to Lossless), frame rate (24, 30, or 60), codec (H.264 or H.265), and whether to include audio. Also `Output Folder` (defaults to the OS movies folder), `Filename Template` (strftime tokens; a live preview shows the resolved example name), and `Prompt to save after recording`, which offers a Save As dialog after Stop to redirect the already-recorded file; cancelling leaves it where it auto-saved. |
| Patches | Whether referenced sprites, images, and video are embedded inside a saved `.viz` file, so the patch stays portable if the original files move. Increases file size. |
| Appearance | UI Scale: `Auto`, or one of four fixed stops, `100%`, `125%`, `150%`, `200%`. |
| Interaction | Fine Mouse Control: how much Shift-drag slows a Trough or Knob down, across six stops from `20% (Coarser)` to `1% (Finest)`. |

**NOTE:** the version string is pinned to the bottom of the category list, visible under every category. It's a read-only field but selectable and copyable, for pasting into a bug report.

Related: [Output and Recording](../../../concepts/output-and-recording/).
