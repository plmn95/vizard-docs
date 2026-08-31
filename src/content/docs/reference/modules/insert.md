---
title: "INSERT"
---

Reads an AUX bus back into the chain, or, left at its default, behaves as a
plain insert stage on the running chain with no bus involved at all.

| Parameter | Control | Notes |
|---|---|---|
| Source | Selector | `Chain composite (default)`, or `AUX 1` through `AUX 8`. |
| Blend | Selector | Additive, Multiply, Screen, Difference, XOR, Replace, or Phoenix. The same blend-mode set AUX Sends use. Shown only when Source is a bus. |
| Amount | Trough | Shown only when Source is a bus. |

See [AUX Sends and Buses](../../../concepts/aux-sends-and-buses/) for how
buses and sends work together.

INSERT carries its own Insert FX chain and its own Sends, so it can feed one
bus while reading a different one. A chain holds up to 16 of them, more than
any other module type. See
[Insert FX Chains](../../../concepts/insert-fx-chains/).
