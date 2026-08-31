---
title: "Region"
---

An optional soft-edged circular boundary any Insert FX slot can turn on,
independent of which effect the slot runs. Two or more slots with Region on
fuse together at their edges when their circles come close.

| Parameter | Control | Range | Notes |
|---|---|---|---|
| Enable Region | Rocker | | Off by default. Outside this slot's boundary the chain's normal image continues untouched; the effect only shows inside the circle. |
| Center X / Center Y | Pad | -0.5 to 0.5 | |
| Radius | Trough | 0 to 1.5 | |
| Feather | Trough | 0 to 0.5 | Softness of the circle's edge. |
| Fusion | Trough | 0.001 to 0.5 | How eagerly this slot's circle merges into a nearby Region'd slot's circle. Low values hold a hard seam even at close range; high values bulge and merge from farther away. |

**NOTE:** with two or more Region'd slots active in one chain, they always
merge as a single group at the stacking position of the lowest-numbered
slot among them. A slot without Region can't sit between two merging
Region'd slots in the chain's stacking order.

**NOTE:** an empty slot (effect type `NONE`) has no Region controls to show.

Related: [Mask](../fx/filter/mask/), which uses the same circular
edge-and-feather boundary for a single slot's own coverage. [Insert FX
Chains](../../concepts/insert-fx-chains/).
