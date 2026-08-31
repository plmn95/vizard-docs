---
title: "Chroma Key"
---

Pulls an alpha matte from a chosen color: a green- or blue-screen key.

| Parameter | Control | Range | Notes |
|---|---|---|---|
| Key Color | color swatch | | Not modulation-assignable. |
| Tolerance | Trough | 0 to 1 | |
| Softness | Trough | 0 to 0.5 | Feathers the matte's edge. |

Outputs an alpha-only matte, not a recolored image. See
[Despill](../despill/) for cleaning up color spill left on the subject after
keying.

Related: [Insert FX Chains](../../../../concepts/insert-fx-chains/).
