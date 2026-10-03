---
title: "AUX Sends and Buses"
description: "Route, duplicate, and combine module outputs with AUX buses, sends, and returns in Hex Composer."
---

Module outputs can be redirected, duplicated, and combined via the `AUX` buses. Every module has a `SENDS` section from which the module's output can be sent to one or more of the `AUX` buses, and an `AUX` bus can be returned at the `INSERT` and `FEEDBACK` modules via their `SOURCE` parameter. A single module can be sent to any number of `AUX` buses, and any number of modules can be sent to a single `AUX` bus. Use the `AUX` buses to split a module's output and send it to multiple other modules, or to merge the output of multiple modules at a single module.

Each bus starts every frame empty. Sends paint into it with their own blend mode, and parts no send has drawn on stay see-through where the bus is read back.

Related: [Insert FX Chains](../insert-fx-chains/), [Signal Chain](../signal-chain/).
