---
title: "Ripple"
description: "Ripple: Water over the picture. Movement and raindrops make ripples that travel, bounce off the edges and bend the picture beneath them."
---

Water over the picture. Movement in the picture and random raindrops make
ripples that travel outward, bounce off the edges of the frame and bend the
picture beneath them, with a glint on the wave crests.

| Parameter | Control | Range | Notes |
|---|---|---|---|
| Motion | Trough | 0 to 4 | How strongly a change in the picture presses into the water. Small changes, such as camera noise, are ignored. A still picture gives no push. |
| Rain | Trough | 0 to 20 /s | Random drops per second, so a still picture ripples too. |
| Drop Size | Trough | 0 to 1 | Big drops make long, slow waves. Small drops make fine rings. |
| Speed | Trough | 0 to 2 | How fast the waves travel. 0 freezes the water, and no new ripples start. |
| Settle | Trough | 0 to 1 | How quickly the waves die away. At 0 they keep bouncing for a long time. |
| Refract | Trough | 0 to 1 | How strongly the waves bend the picture. 0 shows the picture unbent, with only the glint. |
| Shine | Trough | 0 to 1 | Light glinting off the side of each wave that faces the upper left. |
| Reset | Button, Lamp | | Flattens the water. The Lamp flashes on every reset, including resets fired by modulation. Modulation-assignable, with the same trigger rule as [Fluid's Reset](../fluid/). |

Pictures with clear lines and edges show the bending best. On a soft, even
picture the ripples read mainly through Shine.

**NOTE:** the water runs at a third of the output resolution, and its timing
follows the clock, not the frame rate. Below 30 frames per second the waves
slow down rather than skipping ahead.

Related: [Fluid](../fluid/), [Insert FX Chains](../../../../concepts/insert-fx-chains/).
