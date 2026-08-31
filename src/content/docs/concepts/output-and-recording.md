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
output image itself, not the window or its docked panels.

NDI, Spout (Windows), and Syphon (macOS) each send the same output live to
another program instead of, or alongside, a file. Each is enabled
separately in `Settings > Output`, under its own sender name.

`Dual Monitor Output`, also in `Settings > Output`, opens a second window
carrying nothing but the output image, sized independently of the main
window.

Display Fit controls how the output image sits inside whatever window or
monitor shows it, when the two don't share an aspect ratio: `Fit Best`,
`Fill`, or `Shrink`.

Related: [Signal Chain](../signal-chain/).
