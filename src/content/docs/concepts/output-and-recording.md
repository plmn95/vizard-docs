---
title: "Output and Recording"
---

`Output` is the app's own composite: the last module in the chain, or the
mixed result of both decks in Mixer Mode. Everything downstream, recording,
NDI, Spout, Syphon, and the physical output window, reads from that same
image.

Recording writes an MP4 straight to disk with no save dialog, at whatever
quality, frame rate, codec, and audio-inclusion setting
`Settings > Recording` holds at the time. The codec is H.264 or H.265. It captures the aspect-locked
output image itself, not the window or its docked panels. Start and stop it
from the `REC` pill in the toolbar, which Mixer Mode also shows, or with
`Ctrl+Alt+R`.

The timer next to `REC` counts the length of the recording, and the saved
file has that same length. Each frame is stamped with the moment it was
captured, so the file plays back at real speed and stays in sync with the
sound.

Encoding runs on the graphics card's own video encoder when the computer has
one for the chosen codec, and on the processor otherwise. An encoder running
on the processor can fall behind at high resolutions or frame rates, H.265
in particular. When it does, the previous frame stays on screen a little
longer instead of the video speeding up: the recording keeps its length and
its sync, and motion looks less smooth. The message after saving then reads
"Saved recording (some frames skipped) to ...", and `Settings > Recording`
shows a note under `Codec` suggesting a faster choice, such as H.264 or a
lower frame rate. If no encoder for the chosen codec can start on the
computer, the recording doesn't start and a message says so.

Stopping a recording doesn't hold up the app. The file finishes writing in
the background, and a message then names the saved file. When finishing
takes more than a moment, the timer shows `Saving...` and `REC` is dimmed
until the file is complete. Quitting while a file is still being written
waits for it to finish.

NDI, Spout (Windows), and Syphon (macOS) each send the same output live to
another program instead of, or alongside, a file. Each is enabled
separately in `Settings > Output`, under its own sender name.

Parts of the picture that no module has drawn on are empty. The `Output`
window, `Dual Monitor Output`, recordings and snapshots show them as black.
NDI, Spout and Syphon send them as transparency. A receiving program that
ignores alpha shows partly see-through areas at full strength, for example
FEEDBACK echoes that are fading out.

`Dual Monitor Output`, also in `Settings > Output`, opens a second window
carrying nothing but the output image, sized independently of the main
window.

Display Fit controls how the output image sits inside whatever window or
monitor shows it, when the two don't share an aspect ratio: `Fit Best`,
`Fill`, or `Shrink`.

Related: [Signal Chain](../signal-chain/).
