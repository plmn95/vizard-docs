---
title: "AUX Buses Monitor"
---

Every AUX bus, in one table: `BUS`, `SENDERS`, `READERS`, and a live
`PREVIEW` thumbnail.

Senders lists every enabled Send currently targeting that bus, across every
module in the chain. Readers lists every `INSERT` or `FEEDBACK` instance
currently reading from it; those are the only two module types that can
read a bus back.

Related: [AUX Sends and Buses](../../../concepts/aux-sends-and-buses/).
