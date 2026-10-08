---
title: "Reaction-Diffusion"
description: "Reaction-Diffusion: Patterns that grow like animal skin, coral and fingerprints, steered by the picture."
---

Patterns that grow like animal skin, coral and fingerprints, steered by the
picture. Two simulated chemicals spread and react across the frame
(the Gray-Scott model), and where they meet a pattern forms and keeps
moving. The pattern pad chooses which kind of pattern grows.

| Parameter | Control | Range | Notes |
|---|---|---|---|
| Look | Selector | Pattern, Picture | Pattern shows the pattern in black and white, keeping the picture's transparency. Picture shows the picture through the pattern. Switching restarts the pattern. Not modulation-assignable. |
| Size | Selector | Large, Small | Large grows bigger shapes and costs less. Small grows finer shapes and costs about twice as much. Switching restarts the pattern. Not modulation-assignable. |
| Calm, Fill | Pad | 0 to 1 each | The pattern pad. Calm runs left to right from restless waves to still shapes. Fill runs bottom to top from scattered spots to packed stripes and holes. The words inside the pad name each region, and the name under the pad follows the live position, including modulation. Every point on the pad grows a pattern. |
| Follow | Trough | 0 to 1 | How strongly the picture steers the pattern. Dark parts of the picture grow spots and bright parts grow stripes or holes, like a halftone of the picture. |
| Motion | Trough | 0 to 2 | How strongly movement in the picture plants new pattern. |
| Speed | Trough | 0 to 2 | How fast the pattern grows and moves. 0 freezes it. |
| Sharpness | Trough | 0 to 1 | Soft glowing edges at 0, crisp ink at 1. |
| Reset | Button, Lamp | | Restarts the pattern from the bright parts of the current picture, plus scattered seeds. The Lamp flashes on every reset, including resets fired by modulation. Modulation-assignable, with the same trigger rule as [Fluid's Reset](../fluid/). |

## Pad regions

| Region | Where | Look |
|---|---|---|
| Waves | Left edge | Restless, ever-changing fronts that never settle. |
| Spots | Bottom, left of centre | Separate round dots. |
| Worms | Bottom, right side | Short wiggling lines. |
| Mazes | Middle and right | Long winding stripes. |
| Holes | Top, left of centre | A packed field with round holes. |

Moving across the pad changes the pattern gradually. Sparse regions keep
seeding tiny new spots where the field is empty, so the pattern never dies
out while it is being modulated, and spotty regions never fully settle.

To color the pattern, place a [Palette Map](../../color/palette-map/) after
Reaction-Diffusion in the same chain, with the Pattern look.

**NOTE:** the pattern runs at a quarter (Large) or half (Small) of the output
resolution, and its timing follows the clock. Speed 2 at Small is the most
expensive setting.

Related: [Fluid](../fluid/), [Ripple](../ripple/),
[Insert FX Chains](../../../../concepts/insert-fx-chains/).
