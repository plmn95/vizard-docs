---
title: "AUX Sends and Buses"
---

Route more than one module into a shared effect without forcing them through
the same point in the chain: add a Send to each source module, aim every Send
at the same bus, and read that bus back with a single `INSERT` or `FEEDBACK`
downstream. Several sources feed one effect while each keeps its own place in
the chain.

A Send lives inside the module that owns it, not as a separate module: any of
the app's 9 module types can open its `SENDS` section and add one. Each Send
picks a bus (`AUX 1` through `AUX 8`), its own `Blend`, and an `Amount`,
tapping that module's output onto the bus without removing it from the normal
chain. Any number of sends across different modules can target the same bus:
it's a many-to-one mix, not a single owner.

`INSERT` and `FEEDBACK` are the two module types that can read a bus back,
through their own `Source` Selector. Left at `Chain composite`, each behaves
as if no bus were involved: `INSERT` runs as a plain insert stage on the
running chain, `FEEDBACK` reads its own chain input. Setting `Source` to a
specific bus switches either one to reading that bus's mixed content instead,
with its own `Blend` and `Amount` controlling how it composites in. A bus
nobody has sent to yet shows as not currently fed, and passes signal through
unchanged.

`INSERT` also carries its own Insert FX chain and its own Sends, so it can
feed one bus while reading from a different one.

Related: [Insert FX Chains](../insert-fx-chains/), [Signal Chain](../signal-chain/).
