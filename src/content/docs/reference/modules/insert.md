---
title: "INSERT"
description: "Apply Insert FX to the chain composite or an AUX bus."
---

Applies Insert FX to the chain composite or an AUX bus.

| Parameter | Control | Notes |
|---|---|---|
| Source | Selector | `Chain composite (default)`, or `AUX 1` through `AUX 8`. |
| Blend | Selector | Additive, Multiply, Screen, Difference, XOR, Replace, or Phoenix. Shown only when Source is a bus. |
| Amount | Trough | Shown only when Source is a bus. |

See [AUX Sends and Buses](../../../concepts/aux-sends-and-buses/) for how
buses and sends work together.

INSERT can send to one bus while reading another. A chain holds up to 16
INSERT modules. See
[Insert FX Chains](../../../concepts/insert-fx-chains/).

**NOTE:** Insert FX on INSERT see the chain, or the bus, over black. Areas
they leave dark stay empty unless the input had picture there.
