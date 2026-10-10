---
title: "Troubleshooting"
description: "Check recording failures, skipped frames, MIDI input, and differences in external output, and gather the details needed to report a problem."
---

## Recording

| Symptom | Check |
|---|---|
| Recording cannot start | Read the error message. Check the selected codec in `Settings > Recording`; an unavailable codec prevents recording. Check that `Output Folder` exists and is writable, and that the disk has free space. |
| The saved clip skips frames | Choose H.264 or a lower frame rate in `Settings > Recording`. Record a short test again. The save message reports skipped frames. |
| The file is still being saved | Wait for the message naming the saved file. `Saving...` means the write is still in progress, and `REC` stays dimmed until it finishes. |

See [Output and Recording](../concepts/output-and-recording/) for codec,
frame-rate, and save-completion behavior.

## Controller input

| Symptom | Check |
|---|---|
| `Open a MIDI port in Settings > MIDI.` appears | Open your controller's input port in `Settings > MIDI`. |
| A MIDI assignment does nothing | Check the input port, CC number, and channel. Channel `0` accepts any channel. Use the parameter's `MIDI Learn` action and move a control that sends MIDI CC. |
| MIDI Learn stays armed | Send a MIDI CC message from the controller. A successful learn adds the assignment and disarms Learn. |

See [MIDI](../reference/modulation/midi/) and
[MIDI and OpenSoundControl Learn](../concepts/midi-and-opensoundcontrol-learn/).

## External output

| Symptom | Check |
|---|---|
| The receiving application shows a different picture | Check its handling of transparency. Recordings show empty areas as black; NDI, Spout, and Syphon send those areas as transparency. A receiver that ignores alpha can show fading feedback echoes at full strength. |
| You need an output window for a second display | Enable `Dual Monitor Output` in `Settings > Output`. |

See [Output and Recording](../concepts/output-and-recording/) for sender
settings and display fit.

## Report a problem

Include:

- The Hex Composer version, shown at the bottom of `Settings`.
- Your operating system and version.
- The exact error message.
- The steps that reproduce the problem, including relevant settings.
- A patch that reproduces it, if the problem depends on a patch. Check any
  embedded media before sharing the file.

Use [the Hex Composer Discord](https://discord.gg/Mfx6Jkffkj) to report an
app problem. Use `Describe a problem` on the relevant documentation page
to report unclear or incorrect instructions.
