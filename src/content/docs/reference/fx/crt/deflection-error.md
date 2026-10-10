---
title: "Deflection Error"
description: "Simulates an unstable CRT deflection coil: image roll, line bend, sync jitter, and flicker, layered independently."
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
| Roll Mode | Selector | Seamless, Tear Band | Cannot be modulated. |
| Video Standard | Selector | NTSC, PAL | Cannot be modulated. |

**NOTE:** setting Roll Speed to 0 stops the roll at its current position.
Use `Reset Roll` to restore the image's position.

Related: [Insert FX Chains](../../../../concepts/insert-fx-chains/).
