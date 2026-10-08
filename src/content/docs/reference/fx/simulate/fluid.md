---
title: "Fluid"
description: "Fluid: Turns the picture into a moving liquid. Movement in the picture pushes it and its edges stir it, so even a still image swirls."
---

Turns the picture into a moving liquid. Movement in the picture pushes the
fluid and its edges stir it, so even a still image swirls. `Look` decides
whether the fluid carries the picture's colors or bends the live picture.

| Parameter | Control | Range | Notes |
|---|---|---|---|
| Look | Selector | Smear, Warp | Smear carries the picture's colors along the flow and mixes them, and `Recover` brings the live picture back in. Warp bends the live picture, which springs back as the flow settles. Switching restarts the fluid. Not modulation-assignable. |
| Motion | Trough | 0 to 4 | How strongly movement in the picture pushes the fluid, in the direction the picture moves. A still picture gives no push. |
| Swirl | Trough | 0 to 2 | How strongly edges stir the fluid along their length. Works on a still picture. A flat picture with no edges gives no swirl. |
| Eddies | Trough | 0 to 4 | Keeps small whirls spinning instead of letting them smooth away. 0 gives broad, calm flow. |
| Speed | Trough | 0 to 3 | How fast the fluid moves. 0 freezes it in place. |
| Settle | Trough | 0 to 1 | How quickly the flow comes to rest. At 0 it keeps moving until something stops it. |
| Recover | Trough | 0 to 1 | How quickly the picture comes back through the flow. Low values leave long smears in Smear and slow springs in Warp. |
| Reset | Button, Lamp | | Clears the flow and restarts from the current picture. The Lamp flashes on every reset, including resets fired by modulation. Modulation-assignable: a reset fires when the modulated value rises past 0.5, and the next one needs it to fall below 0.25 first. |

Reset recipes:

- A synced LFO with a square wave resets once per cycle, in time with the
  beat.
- An Envelope triggered by a MIDI note, an audio threshold or an LFO edge
  resets on every hit.
- A MIDI CC button or a CV gate resets when pressed.

**NOTE:** the MIDI Velocity source holds its last value between notes, so
repeated notes at the same velocity never cross the threshold again. Use an
Envelope with a MIDI Note trigger instead.

**NOTE:** the fluid runs at a quarter of the output resolution and its timing
follows the clock, not the frame rate. A busy patch that drops frames moves
the fluid in larger steps rather than slowing it down, down to 20 frames per
second. Below that the fluid slows.

Related: [Motion Key](../../key/motion-key/), [Persistence](../../crt/persistence/),
[Insert FX Chains](../../../../concepts/insert-fx-chains/).
