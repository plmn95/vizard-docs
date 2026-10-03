---
title: "Settings"
description: "Configure Hex Composer using the eight categories in the Settings window."
---

8 categories, listed down the left side of the `Settings` window.

| Category | Covers |
|---|---|
| Output | Graphics Card, Display Fit, Dual Monitor Output, NDI/Spout/Syphon output. |
| Audio | Audio input: a Device to capture from, or capturing another application's audio (not available on any platform yet). Also `CV/Gate Channels`, where each input channel past the stereo pair is marked `Off`, `CV`, or `Gate` and given a voltage range; and `Custom Frequency Bands`, the 4 user-defined bands' low/high Hz ranges. |
| MIDI | MIDI port selection. |
| OpenSoundControl | The UDP listen port. |
| Recording | Quality (4 stops, Low to Lossless), frame rate (24, 30, or 60), codec (H.264 or H.265), and whether to include audio. Also `Output Folder` (defaults to Movies on macOS, Videos on Windows, the home folder on Linux) and `Filename` (strftime tokens, listed in the `(?)` tooltip beside it; `.mp4` is always appended). After a recording that skipped frames because encoding fell behind, a note under `Codec` suggests a faster choice. |
| Patches | Whether referenced sprites, images, and video are embedded inside a saved `.hxc` file, so the patch stays portable if the original files move. Increases file size. |
| Appearance | UI Scale: `Auto`, or one of four fixed stops, `100%`, `125%`, `150%`, `200%`. |
| Interaction | Fine Mouse Control: how much Shift-drag slows a Trough or Knob down, across six stops from `20% (Coarser)` to `1% (Finest)`. |

**NOTE:** the version string is pinned to the bottom of the category list, visible under every category. It's a read-only field but selectable and copyable, for pasting into a bug report.

## Graphics

The `Graphics` section at the top of the `Output` category sets which graphics
card Hex Composer renders on, and reports which one is in use.

| Control | Covers |
|---|---|
| Graphics Card | `High performance (dedicated graphics)` or `Power saving (built-in graphics)`. Present only on machines with two graphics cards. Takes effect on the next launch; a `Restart Hex Composer to apply` line appears once the selection differs from the card in use. |
| Rendering on | Read-only. Names the graphics card the current session is actually running on. Shown on every machine, including those with a single card. |

Laptops with both an integrated and a discrete graphics card default to the
discrete one. Hex Composer's render chain is many fullscreen passes deep, so the
integrated card can saturate on a small patch and cost frame rate across the
whole desktop, not just inside Hex Composer. `Power saving` moves rendering back to
the integrated card and extends battery life.

**NOTE:** when a launch fails to reach a window on the discrete card, the next
launch comes up on the integrated one and says so beneath the control.
Selecting `High performance` again is what asks Hex Composer to retry.

**NOTE:** the `HEXCOMPOSER_GPU` environment variable overrides the setting for
one session (`VIZARD_GPU` works as well). Accepted values are `discrete`,
`integrated`, `auto` and `off`. Any graphics-card variable already set in the
environment, such as `DRI_PRIME`, is honoured untouched and disables the
control for that session, which reads `Set by the environment this session.`
Both are troubleshooting aids; neither is persisted.

Related: [Output and Recording](../../../concepts/output-and-recording/).
