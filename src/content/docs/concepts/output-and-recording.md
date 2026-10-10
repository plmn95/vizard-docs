---
title: "Output and Recording"
description: "Record video and send output through NDI, Spout, Syphon, or a second window."
---

`Output` shows the last module's result, or the mix of both decks in Mixer
Mode. Recordings, NDI, Spout, Syphon, and `Dual Monitor Output` use this image.

Recording writes an MP4 straight to disk with no save dialog, at whatever
quality, frame rate, codec, and audio-inclusion setting
`Settings > Recording` holds at the time. The codec is H.264 or H.265. It captures the aspect-locked
output image itself, not the window or its docked panels. Start and stop it
from the `REC` pill in the toolbar, which Mixer Mode also shows, or with
`Ctrl+Alt+R`.

If encoding falls behind, frames are skipped without changing the
recording's duration or audio sync. The save message reports skipped frames.
Choosing H.264 or a lower frame rate can reduce the load. If the selected codec is unavailable, recording cannot start.

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
