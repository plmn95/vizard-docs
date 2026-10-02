---
title: "Record and Output"
---

Click `REC` in the main toolbar. It starts recording immediately, no save
dialog: the file is named `hexcomposer_YYYYMMDD_HHMMSS.mp4` from the current time
and written to the Movies folder on macOS, the Videos folder on Windows, and the
home folder on Linux. The word stays `REC` while recording, its lamp lights
red, and a timer next to it counts the length of the recording. Click it
again to end the recording. `Ctrl+Alt+R` does the same from the keyboard.

The file finishes saving in the background, then a message shows where it
was saved. If saving takes a moment, the timer shows `Saving...` until it's
done.

The camera button next to `REC` saves the current output image as a PNG in
the same folder (`PrintScreen` or `Ctrl+Alt+S` does the same). The
`REC` and camera pill is also available in Mixer Mode, in a slim strip along
the top.

What gets recorded is the actual output image, aspect-locked, with no docked
panels or letterbox bars in it, not a screen capture of the window.

Quality, frame rate, codec (H.264 or H.265), and whether to include audio
are set once in `Settings > Recording` and apply to every recording started
afterward.

Hex Composer can also send its output live to another program instead of, or
alongside, recording to a file: NDI, Spout (Windows), and Syphon (macOS) are
each enabled separately in `Settings > Output`.

This is the end of Getting Started. From here, [Concepts](../../concepts/)
explains how the pieces work, and [Reference](../../reference/) is where
to look up any specific module, effect, or modulation source.
