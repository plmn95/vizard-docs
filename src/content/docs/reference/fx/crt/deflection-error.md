---
title: "Deflection Error"
---

Simulates an unstable CRT deflection coil: image roll, line bend, sync
jitter, and flicker, layered independently.

| Parameter | Control | Range | Notes |
|---|---|---|---|
| Amount | Trough | 0 to 1 | |
| Roll Speed | Trough | 0 to 3 | |
| Line Bend | Trough | 0 to 1 | |
| Sync Jitter | Trough | 0 to 1 | |
| Flicker Amount | Trough | 0 to 1 | |
| Flicker Rate | Trough | 0.5 to 60Hz | |
| Roll Mode | Selector | Seamless, Tear Band | UI-only; not modulation-assignable. |
| Video Standard | Selector | NTSC, PAL | UI-only; not modulation-assignable. Independent of Scan Lines' own copy of this control. |

**NOTE:** setting Roll Speed to 0 stops the roll wherever it currently
sits, part-way shifted, rather than returning the image to unrolled.
Resetting Roll Speed does not undo it either. A `Reset Roll` button snaps
the roll back to unrolled; it is the only control that does.

Related: [Insert FX Chains](../../../../concepts/insert-fx-chains/).
