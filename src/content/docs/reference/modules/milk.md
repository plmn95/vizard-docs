---
title: "MILK"
---

MILK generates audio-reactive visuals from a MilkDrop `.milk` preset. This local
prototype also accepts experimental `.milk2` double presets. Its output
joins the signal chain at the module's position, with its own Mix, Blend,
[Insert FX](../../../concepts/insert-fx-chains/), and
[AUX Sends](../../../concepts/aux-sends-and-buses/).

Add **MILK** from the chain's `+` menu, then choose **Load preset…** in its Preset
section. Dropping a `.milk` or `.milk2` file onto the app loads the selected MILK module, or
creates one if another module is selected. Each chain supports up to eight MILK
instances. Each instance has independent preset execution and feedback state.

Select an audio input in **Settings → Audio**. MILK uses that input's stereo
samples to drive the preset's own waveform, spectrum, and beat analysis. With no
audio input, time-based animation can still run.

**Restart preset** clears its running state and starts it again. **Clear preset**
removes the loaded preset. Loading and clearing support undo. Bypass passes the
upstream chain through; mute clears the chain to transparent at this module's position.
Both suspend the preset's execution until the module resumes.

The preset text and imported local textures are saved inside patches and banks.
Import collects image files directly beside the preset, in its `textures`
subfolder, and in a `textures` folder beside the preset's parent folder. Keep
required textures in those locations before loading. Imports allow at most 256
textures totaling 64 MiB, with unique names regardless of extension or case.
Textures in other locations or deeper nested folders are not collected.

Saved patches preserve the preset and controls, rather than a snapshot of its
live GPU feedback history. Recalling a patch restarts the preset. Ordinary undo
of other controls preserves an unchanged preset's running state.

MILK uses projectM to execute MilkDrop presets. Some presets use shader features
that projectM cannot reproduce; the module displays loading errors and keeps the
previously loaded preset if replacement fails. Identical rendering to Winamp is
not guaranteed. The format is distinct from [ISF](../isf/).

The experimental MilkDrop 3 layer adds Q33–Q64, sixteen custom shapes and waves,
FFT shader helpers, and mouse inputs from the output canvas. Double presets run
two preset engines with independent equations, warp a shared previous image,
draw their primitives onto a common image, and composite from that common image.
Their final displayed composite is excluded from the next frame's feedback.
Twenty independently implemented blend masks remain approximate; the prototype
rejects other patterns and sprite overlays. Shared-stage behavior has owned
reference tests, but exact MilkDrop 3 visual fidelity remains unverified.
Closed `MD31`/`MD32` shader references and embedded-image extensions are rejected.
A failure preserves the previously loaded preset rather than displaying a
placeholder shader. Missing required textures also produce a loading error.
This is partial compatibility, not a guarantee that every MilkDrop 3 preset loads.
