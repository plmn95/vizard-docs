---
title: "Luma Range"
---

Pulls an alpha matte from a brightness band: everything between Min and Max
keys in, everything outside it keys out.

| Parameter | Control | Range | Notes |
|---|---|---|---|
| Min | Trough | 0 to 1 | |
| Max | Trough | 0 to 1 | |
| Softness | Trough | 0 to 0.5 | Feathers both edges of the band. |

Outputs an alpha-only matte, not a recolored image. Same panel shape as
[Sat Isolate](../sat-isolate/), which bands saturation instead of
brightness.

Related: [Insert FX Chains](../../../../concepts/insert-fx-chains/).
